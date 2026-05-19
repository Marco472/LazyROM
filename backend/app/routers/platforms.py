from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.platform import Platform
from app.models.rom import ROM
from app.schemas.platform import PlatformCreate, PlatformUpdate, PlatformRead, PlatformWithCount

router = APIRouter(prefix="/api/platforms", tags=["platforms"])


@router.get("", response_model=List[PlatformWithCount])
def list_platforms(db: Session = Depends(get_db)):
    results = (
        db.query(Platform, func.count(ROM.id).label("rom_count"))
        .outerjoin(ROM, ROM.platform_id == Platform.id)
        .group_by(Platform.id)
        .order_by(Platform.name)
        .all()
    )
    platforms = []
    for platform, count in results:
        p = PlatformWithCount.model_validate(platform)
        p.rom_count = count
        platforms.append(p)
    return platforms


@router.get("/{platform_id}", response_model=PlatformRead)
def get_platform(platform_id: int, db: Session = Depends(get_db)):
    platform = db.query(Platform).filter(Platform.id == platform_id).first()
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    return platform


@router.post("", response_model=PlatformRead, status_code=201)
def create_platform(data: PlatformCreate, db: Session = Depends(get_db)):
    existing = db.query(Platform).filter(Platform.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=409, detail="Platform with this slug already exists")
    platform = Platform(**data.model_dump())
    db.add(platform)
    db.commit()
    db.refresh(platform)
    return platform


@router.put("/{platform_id}", response_model=PlatformRead)
def update_platform(platform_id: int, data: PlatformUpdate, db: Session = Depends(get_db)):
    platform = db.query(Platform).filter(Platform.id == platform_id).first()
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(platform, field, value)
    db.commit()
    db.refresh(platform)
    return platform


@router.delete("/{platform_id}", status_code=204)
def delete_platform(platform_id: int, db: Session = Depends(get_db)):
    platform = db.query(Platform).filter(Platform.id == platform_id).first()
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    db.delete(platform)
    db.commit()
