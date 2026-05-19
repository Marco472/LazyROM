from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.settings import AppSettings

router = APIRouter(prefix="/api/settings", tags=["settings"])

SETTING_KEYS = ["LIBRARY_PATH", "IGDB_CLIENT_ID", "IGDB_CLIENT_SECRET"]


class SettingsPayload(BaseModel):
    LIBRARY_PATH: str = ""
    IGDB_CLIENT_ID: str = ""
    IGDB_CLIENT_SECRET: str = ""


@router.get("")
def get_settings(db: Session = Depends(get_db)):
    rows = db.query(AppSettings).filter(AppSettings.key.in_(SETTING_KEYS)).all()
    result: dict[str, Any] = {k: "" for k in SETTING_KEYS}
    for row in rows:
        result[row.key] = row.value
    return result


@router.put("")
def update_settings(payload: SettingsPayload, db: Session = Depends(get_db)):
    updates = payload.model_dump()
    for key, value in updates.items():
        row = db.query(AppSettings).filter(AppSettings.key == key).first()
        if row:
            row.value = value
        else:
            db.add(AppSettings(key=key, value=value))
    db.commit()
    return updates
