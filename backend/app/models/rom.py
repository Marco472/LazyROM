from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, BigInteger, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ROM(Base):
    __tablename__ = "roms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    platform_id: Mapped[int] = mapped_column(Integer, ForeignKey("platforms.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    file_name: Mapped[str] = mapped_column(String(500), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1000), unique=True, nullable=False, index=True)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    igdb_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cover_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(String(5000), nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    scraped_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, server_default=func.now()
    )

    platform: Mapped["Platform"] = relationship("Platform", back_populates="roms")
