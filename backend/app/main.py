
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, notes, tags  # import your routers


app = FastAPI(title="Notes API")

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ include auth routes under /api/v1/auth
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

# ✅ include notes routes
app.include_router(notes.router, prefix="/api/v1/notes", tags=["notes"])

# ✅ include tags routes
app.include_router(tags.router, prefix="/api/v1/tags", tags=["tags"])

@app.get("/health")
def health():
    return {"status": "ok"}
