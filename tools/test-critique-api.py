#!/usr/bin/env python3
"""Stdlib regression tests for the server-side Gemini critique proxy.

No network call is made. The upstream request is replaced with a context-manager
stub so these checks cover input validation, header-only key transport, CORS
allow-listing, cache headers, and malformed provider responses.

Run: python3 tools/test-critique-api.py
"""
import json
import sys
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import api.critique as critique


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return json.dumps(self.payload).encode("utf-8")


failures = 0


def check(name, condition, detail=""):
    global failures
    print(f"  {'PASS' if condition else 'FAIL'}  {name}{' — ' + detail if detail else ''}")
    if not condition:
        failures += 1


def response_payload(response):
    return json.loads(response["body"])


print("\ncritique API checks")

critique.GEMINI_KEY = ""
check("GET is rejected", critique.handler({"method": "GET"})["statusCode"] == 405)
check("OPTIONS is handled", critique.handler({"method": "OPTIONS"})["statusCode"] == 204)
check("missing prompt is rejected", critique.handler({"body": "{}"})["statusCode"] == 400)
check(
    "non-string prompt is rejected",
    critique.handler({"body": json.dumps({"prompt": 123})})["statusCode"] == 400,
)
check(
    "oversized prompt is rejected",
    critique.handler({"body": json.dumps({"prompt": "x" * 6001})})["statusCode"] == 413,
)
check(
    "missing server key is reported without upstream access",
    critique.handler({"body": json.dumps({"prompt": "portrait"})})["statusCode"] == 503,
)

critique.GEMINI_KEY = "server-secret"
critique.ALLOWED_ORIGIN = "https://allowed.example"
seen = {}


def fake_urlopen(request, timeout):
    seen["url"] = request.full_url
    seen["key"] = request.get_header("X-goog-api-key")
    seen["timeout"] = timeout
    return FakeResponse({"candidates": [{"content": {"parts": [{"text": "Score: 8/10"}]}}]})


with patch("urllib.request.urlopen", fake_urlopen):
    result = critique.handler(
        {
            "method": "POST",
            "headers": {"Origin": "https://allowed.example"},
            "body": json.dumps({"prompt": "portrait"}),
        }
    )
check("valid prompt returns the provider reply", result["statusCode"] == 200 and response_payload(result)["reply"] == "Score: 8/10")
check("provider key is sent in a header", seen.get("key") == "server-secret")
check("provider URL contains no query key", "?key=" not in seen.get("url", "") and seen.get("url") == critique.ENDPOINT)
check("provider call has a timeout", seen.get("timeout") == 30)
check("allowed origin receives CORS permission", result["headers"].get("Access-Control-Allow-Origin") == "https://allowed.example")
check("responses disable caching", result["headers"].get("Cache-Control") == "no-store")

blocked = critique.handler(
    {
        "method": "OPTIONS",
        "headers": {"Origin": "https://other.example"},
    }
)
check("unlisted origin receives no CORS permission", "Access-Control-Allow-Origin" not in blocked["headers"])

with patch("urllib.request.urlopen", lambda *_args, **_kwargs: FakeResponse({"candidates": ["malformed"]})):
    malformed = critique.handler({"body": json.dumps({"prompt": "portrait"})})
check("malformed provider data becomes a safe 502", malformed["statusCode"] == 502 and "empty" in response_payload(malformed)["error"])

print(f"\ncritique API tests: {'all passed' if failures == 0 else f'{failures} failed'}")
sys.exit(0 if failures == 0 else 1)
