"""Serverless proxy for Gemini prompt critique.

Keeps the GOOGLE_API_KEY server-side so production visitors never handle it.
Freebuff hosting installs requirements.txt automatically.
"""
import json
import os

GEMINI_KEY = os.environ.get("GOOGLE_API_KEY", "")
MODEL = "gemini-2.0-flash"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

SYSTEM = (
    "You are an expert critic of AI image-generation prompts. Judge this prompt "
    "against professional doctrine: structured scaffold order, named lighting "
    "patterns, real lens vocabulary, specific style anchors, native resolution "
    "tiers, and weighted negative prompting. Be concise.\n\n"
    "Reply exactly in this format:\nScore: X/10\nStrengths: …\nImprove: …"
)


def handler(request):
    """WSGI / Freebuff serverless entry point."""
    try:
        body = json.loads(request.get("body", "{}"))
    except (json.JSONDecodeError, AttributeError):
        body = {}

    user_prompt = body.get("prompt", "")
    if not user_prompt:
        return {"statusCode": 400, "body": json.dumps({"error": "missing 'prompt' field"})}

    if not GEMINI_KEY:
        return {"statusCode": 503, "body": json.dumps({"error": "GOOGLE_API_KEY not configured on server"})}

    import urllib.request

    payload = json.dumps({
        "contents": [{"parts": [{"text": SYSTEM + "\n\nPROMPT: " + user_prompt}]}]
    }).encode()

    req = urllib.request.Request(
        ENDPOINT + "?key=" + GEMINI_KEY,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
        reply = "".join(p.get("text", "") for p in parts).strip()
        if not reply:
            return {"statusCode": 502, "body": json.dumps({"error": "empty Gemini response"})}
        return {"statusCode": 200, "body": json.dumps({"reply": reply})}
    except Exception as exc:
        return {"statusCode": 502, "body": json.dumps({"error": str(exc)})}
