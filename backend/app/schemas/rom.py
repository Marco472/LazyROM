from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.platform import PlatformRead


class ROMBase(BaseModel):
    name: str
    file_name: str
    file_path: str
    file_size: int = 0
    platform_id: int
    igdb_id: Optional[int] = None
    cover_url: Optional[str] = None
    summary: Optional[str] = None
    rating: Optional[float] = None


class ROMCreate(ROMBase):
    pass


class ROMUpdate(BaseModel):
    name: Optional[str] = None
    igdb_id: Optional[int] = None
    cover_url: Optional[str] = None
    summary: Optional[str] = None
    rating: Optional[float] = None
    scraped_at: Optional[datetime] = None


class ROMRead(ROMBase):
    id: int
    scraped_at: Optional[datetime] = None
    created_at: datetime
    platform: Optional[PlatformRead] = None

    model_config = {"from_attributes": True}
