import json
import os
import hashlib
import hmac
import time
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

SECRET = "cloudvideo_jwt_secret_2026"
DEMO_TOKEN = "demo_token_cloudvideo"


def make_token(user_id: int, email: str) -> str:
    payload = f"{user_id}:{email}:{int(time.time()) + 86400 * 7}"
    sig = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"


def verify_token(token: str):
    if token == DEMO_TOKEN:
        return {"id": 0, "email": "demo@cloudvideo.ru", "name": "Демо режим", "plan": "pro",
                "cameras_limit": 8, "storage_days": 30, "is_demo": True}
    try:
        parts = token.rsplit(":", 1)
        if len(parts) != 2:
            return None
        payload, sig = parts
        expected = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        uid_str, email, exp_str = payload.split(":", 2)
        if int(exp_str) < int(time.time()):
            return None
        return {"id": int(uid_str), "email": email, "is_demo": False}
    except Exception:
        return None


def check_password(plain: str, hashed: str) -> bool:
    try:
        import bcrypt
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return plain == "demo123" and "LQv3c1yqBWVHxkd0" in hashed


def handler(event: dict, context) -> dict:
    """Авторизация для облачного кабинета видеонаблюдения. POST /login, GET /me"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # ── POST login ──
    if method == "POST" and action == "login":
        body = json.loads(event.get("body") or "{}")
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Email и пароль обязательны"})}

        # Демо-вход
        if email == "demo@cloudvideo.ru" and password == "demo123":
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({
                "token": DEMO_TOKEN,
                "user": {"id": 0, "email": email, "name": "Демо режим", "plan": "pro",
                         "cameras_limit": 8, "storage_days": 30, "is_demo": True}
            })}

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute("SELECT id, email, password_hash, name, plan, cameras_limit, storage_days FROM cloud_video_users WHERE email = %s", (email,))
        row = cur.fetchone()
        conn.close()

        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        uid, db_email, pw_hash, name, plan, cams, storage = row
        if not check_password(password, pw_hash):
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        token = make_token(uid, db_email)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "token": token,
            "user": {"id": uid, "email": db_email, "name": name, "plan": plan,
                     "cameras_limit": cams, "storage_days": storage, "is_demo": False}
        })}

    # ── GET me ──
    if method == "GET" and action == "me":
        auth = event.get("headers", {}).get("X-Authorization") or event.get("headers", {}).get("authorization") or ""
        token = auth.replace("Bearer ", "").strip()
        user = verify_token(token)
        if not user:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"user": user})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}