from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # Use 5433 for Docker PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5433/production"
    )
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

