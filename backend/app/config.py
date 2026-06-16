from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    LIBRARY_PATH: str = "/roms"
    DATABASE_URL: str = "sqlite:///./lazyrom.db"
    IGDB_CLIENT_ID: str = ""
    IGDB_CLIENT_SECRET: str = ""
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
