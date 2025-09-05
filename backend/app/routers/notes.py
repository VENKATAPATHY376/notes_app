from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import uuid4
from typing import List, Optional
from app.db import get_db
from app import models, schemas
from app.routers.auth import decode_token
from fastapi import Header
from sqlalchemy import func

router = APIRouter(tags=["notes"])

def get_user_id(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="no_token")
    token = authorization.split(" ", 1)[1]
    try:
        data = decode_token(token)
        return data.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="invalid_token")

def ensure_tags(db: Session, uid: str, names: List[str]) -> List[models.Tag]:
    existing = db.query(models.Tag).filter(models.Tag.user_id == uid, models.Tag.name.in_(names)).all()
    existing_names = {t.name for t in existing}
    to_create = [n for n in names if n not in existing_names]
    created = []
    for name in to_create:
        tag = models.Tag(id=str(uuid4()), user_id=uid, name=name)
        db.add(tag)
        created.append(tag)
    db.commit()
    return existing + created

@router.get("", response_model=schemas.NotesListResponse)
def list_notes(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    tag: Optional[str] = None,
    search: Optional[str] = None,
    archived: Optional[bool] = None,
    db: Session = Depends(get_db),
    uid: str = Depends(get_user_id),
):
    q = db.query(models.Note).filter(models.Note.user_id == uid)
    if archived is not None:
        q = q.filter(models.Note.is_archived == archived)
    if tag:
        q = q.join(models.NoteTag).join(models.Tag).filter(models.Tag.name == tag)
    if search:
        like = f"%{search}%"
        q = q.filter((models.Note.title.ilike(like)) | (models.Note.content.ilike(like)))
    total = q.count()
    items = q.order_by(models.Note.updated_at.desc()).offset((page - 1) * limit).limit(limit).all()

    out = []
    for n in items:
        tags = (
            db.query(models.Tag.name)
            .join(models.NoteTag, models.Tag.id == models.NoteTag.tag_id)
            .filter(models.NoteTag.note_id == n.id)
            .all()
        )
        out.append(
            schemas.NoteOut(
                id=n.id,
                title=n.title,
                content=n.content,
                tags=[t[0] for t in tags],
                is_pinned=n.is_pinned,
                is_archived=n.is_archived,
                version=n.version,
                created_at=n.created_at,
                updated_at=n.updated_at,
            )
        )
    return {"items": out, "meta": {"page": page, "limit": limit, "total": total}}

@router.get("/{note_id}", response_model=schemas.NoteOut)
def get_note(note_id: str, db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    n = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == uid).first()
    if not n:
        raise HTTPException(status_code=404, detail="not_found")
    tags = (
        db.query(models.Tag.name)
        .join(models.NoteTag, models.Tag.id == models.NoteTag.tag_id)
        .filter(models.NoteTag.note_id == n.id)
        .all()
    )
    return schemas.NoteOut(
        id=n.id,
        title=n.title,
        content=n.content,
        tags=[t[0] for t in tags],
        is_pinned=n.is_pinned,
        is_archived=n.is_archived,
        version=n.version,
        created_at=n.created_at,
        updated_at=n.updated_at,
    )

@router.post("", response_model=schemas.NoteOut, status_code=201)
def create_note(payload: schemas.NoteCreate, db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    note = models.Note(id=str(uuid4()), user_id=uid, title=payload.title, content=payload.content)
    db.add(note)
    db.commit()
    db.refresh(note)

    tags = ensure_tags(db, uid, payload.tags or [])
    for t in tags:
        db.add(models.NoteTag(note_id=note.id, tag_id=t.id))
    db.commit()

    return get_note(note.id, db, uid)

@router.put("/{note_id}", response_model=schemas.NoteOut)
def update_note(note_id: str, payload: schemas.NoteUpdate, db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    n = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == uid).first()
    if not n:
        raise HTTPException(status_code=404, detail="not_found")
    if n.version != payload.version:
        raise HTTPException(status_code=409, detail={"error": "version_mismatch", "server_version": n.version})

    n.title = payload.title
    n.content = payload.content
    n.is_pinned = payload.is_pinned
    n.is_archived = payload.is_archived
    n.version += 1
    db.query(models.NoteTag).filter(models.NoteTag.note_id == n.id).delete()
    tags = ensure_tags(db, uid, payload.tags or [])
    for t in tags:
        db.add(models.NoteTag(note_id=n.id, tag_id=t.id))
    db.commit()
    return get_note(note_id, db, uid)

@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: str, db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    deleted = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == uid).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="not_found")
    db.commit()
    return
