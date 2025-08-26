from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    SECRET_KEY: str = "change_me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:///./notes.db"
    CORS_ORIGINS: List[str] = ["http://127.0.0.1:5173"]

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", ".env")

settings = Settings()
