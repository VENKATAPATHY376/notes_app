from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import Base, engine
from app.config import settings
from app.routers import auth, notes, tags

# Create tables on startup (for demo). Use migrations in production.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

api = FastAPI()
api.include_router(auth.router, prefix="/auth")
api.include_router(notes.router, prefix="/notes")
api.include_router(tags.router, prefix="/tags")

app.mount("/api/v1", api)
