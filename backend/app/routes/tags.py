from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Tag, Post
from app.schemas import TagResponse, TagCreate
from app.database import get_db
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()

@router.post("/", response_model=TagResponse)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    existing_tag = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Esta etiqueta ya existe.")

    new_tag = Tag(name=tag.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

@router.post("/{post_id}/assign-tags")
def assign_tags_to_post(post_id: int, tag_ids: List[int], db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    if not tags:
        raise HTTPException(status_code=400, detail="Algunas etiquetas no existen")

    post.tags = tags
    db.commit()
    return {"message": "Etiquetas asignadas correctamente"}