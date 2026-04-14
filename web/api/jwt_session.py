from __future__ import annotations

import time
from dataclasses import dataclass

import jwt


@dataclass(frozen=True)
class Session:
    user_id: int


def issue_token(*, user_id: int, secret: str, ttl_seconds: int) -> str:
    now = int(time.time())
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + max(1, int(ttl_seconds)),
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def verify_token(token: str, secret: str) -> Session:
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
    except Exception as e:
        raise ValueError("invalid token") from e

    sub = payload.get("sub")
    if not sub:
        raise ValueError("missing sub")
    return Session(user_id=int(sub))

