from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr

# Notes
class NoteBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: List[str] = []
    is_pinned: bool = False
    is_archived: bool = False

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    version: int

class NoteOut(NoteBase):
    id: str
    version: int
    created_at: datetime
    updated_at: datetime

# Tags
class TagCreate(BaseModel):
    name: str

class TagOut(BaseModel):
    id: str
    name: str

# Generic
class ListMeta(BaseModel):
    page: int
    limit: int
    total: int

class NotesListResponse(BaseModel):
    items: List[NoteOut]
    meta: ListMeta

class TokenResponse(BaseModel):
    access_token: str
    user: UserOut | None = None

class ErrorResponse(BaseModel):
    error: str
    message: str
