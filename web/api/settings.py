from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass(frozen=True)
class Settings:
    bot_token: str
    jwt_secret: str
    jwt_ttl_seconds: int
    telegram_max_auth_age_seconds: int
    cors_allow_origins: list[str]


def load_settings() -> Settings:
    # Load root .env if present (dev convenience)
    load_dotenv()

    bot_token = os.getenv("BOT_TOKEN", "").strip()
    if not bot_token:
        raise RuntimeError("BOT_TOKEN is required")

    jwt_secret = os.getenv("WEBAPP_JWT_SECRET", "").strip()
    if not jwt_secret:
        raise RuntimeError("WEBAPP_JWT_SECRET is required")

    jwt_ttl_seconds = int(os.getenv("WEBAPP_JWT_TTL_SECONDS", "86400"))
    telegram_max_auth_age_seconds = int(os.getenv("TELEGRAM_MAX_AUTH_AGE_SECONDS", "3600"))

    origins_raw = os.getenv("WEBAPP_CORS_ORIGINS", "").strip()
    cors_allow_origins = [o.strip() for o in origins_raw.split(",") if o.strip()] if origins_raw else []

    return Settings(
        bot_token=bot_token,
        jwt_secret=jwt_secret,
        jwt_ttl_seconds=jwt_ttl_seconds,
        telegram_max_auth_age_seconds=telegram_max_auth_age_seconds,
        cors_allow_origins=cors_allow_origins,
    )

