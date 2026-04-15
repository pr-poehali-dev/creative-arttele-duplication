import os
import json
import urllib.request
import urllib.parse
import urllib.error

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {**CORS, "Content-Type": "application/json"}

    api_url = os.environ.get("MIKROBILL_API_URL", "")
    api_key = os.environ.get("MIKROBILL_API_KEY", "")

    if not api_url or not api_key:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": "MIKROBILL_API_URL and MIKROBILL_API_KEY must be configured"}),
        }

    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    method = event.get("httpMethod", "GET")

    if action == "auth":
        if method != "POST":
            return {
                "statusCode": 405,
                "headers": headers,
                "body": json.dumps({"error": "POST required"}),
            }

        body = {}
        raw = event.get("body", "")
        if raw:
            try:
                body = json.loads(raw)
            except Exception:
                body = {}

        login = (body.get("login") or "").strip()
        password = body.get("password") or ""

        if not login or not password:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Введите логин и пароль"}),
            }

        try:
            target = api_url.rstrip("/") + "?action=auth"
            payload = json.dumps({"login": login, "password": password}).encode("utf-8")
            req = urllib.request.Request(
                target,
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "X-Api-Key": api_key,
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(data),
            }
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            try:
                err_data = json.loads(err_body)
            except Exception:
                err_data = {"error": err_body}
            return {
                "statusCode": e.code,
                "headers": headers,
                "body": json.dumps(err_data),
            }
        except Exception as e:
            return {
                "statusCode": 502,
                "headers": headers,
                "body": json.dumps({"error": f"Failed to connect to MikroBill: {str(e)}"}),
            }

    if action in ("user_info", "payments", "traffic", "tariffs"):
        login = params.get("login", "")
        if not login and action != "tariffs":
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "login parameter required"}),
            }

        try:
            query = {"action": action}
            if login:
                query["login"] = login
            target = api_url.rstrip("/") + "?" + urllib.parse.urlencode(query)
            req = urllib.request.Request(
                target,
                headers={"X-Api-Key": api_key},
                method="GET",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(data),
            }
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            try:
                err_data = json.loads(err_body)
            except Exception:
                err_data = {"error": err_body}
            return {
                "statusCode": e.code,
                "headers": headers,
                "body": json.dumps(err_data),
            }
        except Exception as e:
            return {
                "statusCode": 502,
                "headers": headers,
                "body": json.dumps({"error": f"Failed to connect to MikroBill: {str(e)}"}),
            }

    return {
        "statusCode": 400,
        "headers": headers,
        "body": json.dumps({"error": "Unknown action", "available": ["auth", "user_info", "payments", "traffic", "tariffs"]}),
    }
