from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.models.rom import ROM
from app.schemas.rom import ROMRead, ROMUpdate

router = APIRouter(prefix="/api/roms", tags=["roms"])


@router.get("", response_model=List[ROMRead])
def list_roms(
    platform_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(ROM)
    if platform_id is not None:
        query = query.filter(ROM.platform_id == platform_id)
    if search:
        query = query.filter(ROM.name.ilike(f"%{search}%"))
    return query.order_by(ROM.name).all()


@router.get("/{rom_id}", response_model=ROMRead)
def get_rom(rom_id: int, db: Session = Depends(get_db)):
    rom = db.query(ROM).filter(ROM.id == rom_id).first()
    if not rom:
        raise HTTPException(status_code=404, detail="ROM not found")
    return rom


@router.put("/{rom_id}", response_model=ROMRead)
def update_rom(rom_id: int, data: ROMUpdate, db: Session = Depends(get_db)):
    rom = db.query(ROM).filter(ROM.id == rom_id).first()
    if not rom:
        raise HTTPException(status_code=404, detail="ROM not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(rom, field, value)
    db.commit()
    db.refresh(rom)
    return rom


@router.delete("/{rom_id}", status_code=204)
def delete_rom(rom_id: int, db: Session = Depends(get_db)):
    rom = db.query(ROM).filter(ROM.id == rom_id).first()
    if not rom:
        raise HTTPException(status_code=404, detail="ROM not found")
    db.delete(rom)
    db.commit()


@router.get("/{rom_id}/download")
def download_rom(rom_id: int, db: Session = Depends(get_db)):
    rom = db.query(ROM).filter(ROM.id == rom_id).first()
    if not rom:
        raise HTTPException(status_code=404, detail="ROM not found")
    if not os.path.exists(rom.file_path):
        raise HTTPException(status_code=404, detail="ROM file not found on disk")
    return FileResponse(
        path=rom.file_path,
        filename=rom.file_name,
        media_type="application/octet-stream",
    )
