from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
from app.db import get_db
from app import models, schemas
from app.routers.notes import get_user_id

router = APIRouter(prefix="/tags", tags=["tags"])

@router.get("", response_model=list[schemas.TagOut])
def list_tags(db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    tags = db.query(models.Tag).filter(models.Tag.user_id == uid).order_by(models.Tag.name.asc()).all()
    return [{"id": t.id, "name": t.name} for t in tags]

@router.post("", response_model=schemas.TagOut, status_code=201)
def create_tag(payload: schemas.TagCreate, db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    existing = db.query(models.Tag).filter(models.Tag.user_id == uid, models.Tag.name == payload.name).first()
    if existing:
        return {"id": existing.id, "name": existing.name}
    t = models.Tag(id=str(uuid4()), user_id=uid, name=payload.name)
    db.add(t)
    db.commit()
    return {"id": t.id, "name": t.name}

@router.delete("/{tag_id}", status_code=204)
def delete_tag(tag_id: str, db: Session = Depends(get_db), uid: str = Depends(get_user_id)):
    deleted = db.query(models.Tag).filter(models.Tag.id == tag_id, models.Tag.user_id == uid).delete()
    if not deleted:
        raise HTTPException(status_code=404, detail="not_found")
    db.commit()
    return
