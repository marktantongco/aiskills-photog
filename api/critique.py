"""Small serverless proxy for Gemini prompt critique.

The browser sends only a prompt to this handler. ``GOOGLE_API_KEY`` stays in the
server environment, while the static site can still run its offline scorer when
this function is not deployed. The return shape follows the Freebuff-style
``{"statusCode": ..., "headers": ..., "body": ...}`` contract used by the
original project.
"""
import json
import os
from collections.abc import Mapping
from typing import Any

GEMINI_KEY = os.environ.get("GOOGLE_API_KEY", "").strip()
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
MAX_PROMPT_LENGTH = 6000
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "").strip()

SYSTEM = (
    "You are an expert critic of AI image-generation prompts. Judge this prompt "
    "against professional doctrine: structured scaffold order, named lighting "
    "patterns, real lens vocabulary, specific style anchors, native resolution "
    "tiers, and weighted negative prompting. Be concise.\n\n"
    "Reply exactly in this format:\nScore: X/10\nStrengths: …\nImprove: …"
)


def _request_value(request: Any, name: str, default: Any = None) -> Any:
    """Read a field from mapping-like or attribute-based serverless requests."""
    if isinstance(request, Mapping):
        return request.get(name, default)
    return getattr(request, name, default)


def _response(status: int, payload: dict[str, Any], request: Any = None) -> dict[str, Any]:
    """Create a cache-safe JSON response with conservative CORS headers."""
    request_origin = _request_value(request, "headers", {}) or {}
    if isinstance(request_origin, Mapping) or hasattr(request_origin, "get"):
        origin = request_origin.get("origin") or request_origin.get("Origin")
    else:
        origin = None
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    # Same-origin use does not need CORS. An explicit allow-list is required
    # before a separately hosted frontend can call this proxy; never emit '*'.
    if origin and ALLOWED_ORIGIN and origin == ALLOWED_ORIGIN:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Vary"] = "Origin"
    return {"statusCode": status, "headers": headers, "body": json.dumps(payload)}


def _body(request: Any) -> dict[str, Any]:
    raw = _request_value(request, "body", "{}")
    if isinstance(raw, Mapping):
        return dict(raw)
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8", errors="replace")
    try:
        parsed = json.loads(raw or "{}")
    except (TypeError, json.JSONDecodeError):
        return {}
    return parsed if isinstance(parsed, dict) else {}


def handler(request):
    """WSGI / Freebuff serverless entry point."""
    method = str(_request_value(request, "method", "POST") or "POST").upper()
    if method == "OPTIONS":
        return _response(204, {}, request)
    if method != "POST":
        return _response(405, {"error": "method not allowed"}, request)

    body = _body(request)
    user_prompt = body.get("prompt", "")
    if not isinstance(user_prompt, str):
        return _response(400, {"error": "'prompt' must be a string"}, request)
    user_prompt = user_prompt.strip()
    if not user_prompt:
        return _response(400, {"error": "missing 'prompt' field"}, request)
    if len(user_prompt) > MAX_PROMPT_LENGTH:
        return _response(413, {"error": f"prompt is limited to {MAX_PROMPT_LENGTH} characters"}, request)

    if not GEMINI_KEY:
        return _response(503, {"error": "GOOGLE_API_KEY is not configured on the server"}, request)

    import urllib.error
    import urllib.request

    payload = json.dumps({
        "contents": [{"parts": [{"text": SYSTEM + "\n\nPROMPT: " + user_prompt}]}]
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        # Do not reflect the upstream body or API key in a public error.
        return _response(502, {"error": f"Gemini request failed (HTTP {exc.code})"}, request)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return _response(502, {"error": "Gemini request could not be completed"}, request)
    except Exception:
        # Keep provider/network details out of a visitor-visible response.
        return _response(502, {"error": "Gemini request failed"}, request)

    candidates = data.get("candidates", []) if isinstance(data, dict) else []
    candidate = candidates[0] if isinstance(candidates, list) and candidates and isinstance(candidates[0], dict) else {}
    content = candidate.get("content", {}) if isinstance(candidate.get("content", {}), dict) else {}
    parts = content.get("parts", []) if isinstance(content.get("parts", []), list) else []
    reply = "".join(part.get("text", "") for part in parts if isinstance(part, dict)).strip()
    if not reply:
        return _response(502, {"error": "Gemini returned an empty response"}, request)
    return _response(200, {"reply": reply[:12000]}, request)
