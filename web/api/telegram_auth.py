from __future__ import annotations

import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from urllib.parse import parse_qsl


@dataclass(frozen=True)
class TelegramWebAppUser:
    id: int
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None


@dataclass(frozen=True)
class TelegramWebAppAuthResult:
    user: TelegramWebAppUser
    auth_date: int


class TelegramInitDataError(ValueError):
    pass


def _hmac_sha256(key: bytes, msg: bytes) -> bytes:
    return hmac.new(key, msg, hashlib.sha256).digest()


def validate_init_data(init_data: str, bot_token: str, max_age_seconds: int) -> TelegramWebAppAuthResult:
    """
    Validate Telegram WebApp initData.

    Algorithm: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    """
    if not init_data:
        raise TelegramInitDataError("empty initData")

    pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = pairs.get("hash")
    if not received_hash:
        raise TelegramInitDataError("missing hash")

    # auth_date freshness
    auth_date_str = pairs.get("auth_date")
    if not auth_date_str or not auth_date_str.isdigit():
        raise TelegramInitDataError("missing/invalid auth_date")
    auth_date = int(auth_date_str)
    now = int(time.time())
    if max_age_seconds > 0 and now - auth_date > max_age_seconds:
        raise TelegramInitDataError("initData is too old")

    # Build data-check-string (sort keys, exclude hash)
    data_check_kv = []
    for k in sorted(pairs.keys()):
        if k == "hash":
            continue
        data_check_kv.append(f"{k}={pairs[k]}")
    data_check_string = "\n".join(data_check_kv).encode("utf-8")

    secret_key = _hmac_sha256(b"WebAppData", bot_token.encode("utf-8"))
    calculated_hash = hmac.new(secret_key, data_check_string, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise TelegramInitDataError("bad hash")

    user_raw = pairs.get("user")
    if not user_raw:
        raise TelegramInitDataError("missing user")

    try:
        user_obj = json.loads(user_raw)
    except Exception as e:
        raise TelegramInitDataError("invalid user json") from e

    if "id" not in user_obj:
        raise TelegramInitDataError("missing user.id")

    return TelegramWebAppAuthResult(
        user=TelegramWebAppUser(
            id=int(user_obj["id"]),
            first_name=user_obj.get("first_name"),
            last_name=user_obj.get("last_name"),
            username=user_obj.get("username"),
        ),
        auth_date=auth_date,
    )

