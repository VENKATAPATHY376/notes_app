from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import timedelta
from app.db import get_db
from app import models, schemas
from app.security import hash_password, verify_password, create_token, decode_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE_NAME = "refresh_token"

def set_refresh_cookie(resp: Response, token: str):
    resp.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # set True in production with HTTPS
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        path="/api/v1/auth",
    )

def clear_refresh_cookie(resp: Response):
    resp.delete_cookie(REFRESH_COOKIE_NAME, path="/api/v1/auth")

@router.post("/register", response_model=schemas.TokenResponse, status_code=201)
def register(payload: schemas.RegisterRequest, response: Response, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="email_taken")
    user = models.User(id=str(uuid4()), email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    access = create_token(user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh = create_token(user.id, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    set_refresh_cookie(response, refresh)
    return {"access_token": access, "user": {"id": user.id, "email": user.email}}

@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid_credentials")
    access = create_token(user.id, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh = create_token(user.id, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    set_refresh_cookie(response, refresh)
    return {"access_token": access, "user": {"id": user.id, "email": user.email}}

@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh(request: Request, response: Response):
    cookie = request.cookies.get(REFRESH_COOKIE_NAME)
    if not cookie:
        raise HTTPException(status_code=401, detail="no_refresh")
    try:
        decoded = decode_token(cookie)
        uid = decoded.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="invalid_refresh")
    access = create_token(uid, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    # rotate refresh
    new_refresh = create_token(uid, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    set_refresh_cookie(response, new_refresh)
    return {"access_token": access, "user": None}

@router.post("/logout", status_code=204)
def logout(response: Response):
    clear_refresh_cookie(response)
    return Response(status_code=204)
