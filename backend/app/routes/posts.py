from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Post, Tag, User
from app.auth import verify_token
from app.schemas import PostCreate, PostResponse, PostUpdate
from app.database import get_db
from typing import List

router = APIRouter()

@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    tags = db.query(Tag).filter(Tag.id.in_(post.tag_ids)).all()
    if not tags:
        raise HTTPException(status_code=400, detail="Algunas etiquetas no existen")

    new_post = Post(
        title=post.title,
        content=post.content,
        author_id=user.id,
        is_published=post.is_published,
        tags=tags
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, post_data: PostUpdate, token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = db.query(User).filter(User.email == payload["sub"]).first()
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no tienes permisos")

    if post_data.title:
        post.title = post_data.title
    if post_data.content:
        post.content = post_data.content
    if post_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(post_data.tag_ids)).all()
        post.tags = tags
    if post_data.is_published is not None:
        post.is_published = post_data.is_published

    db.commit()
    return post

@router.delete("/{post_id}")
def delete_post(post_id: int, token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = db.query(User).filter(User.email == payload["sub"]).first()
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no tienes permisos")

    db.delete(post)
    db.commit()
    return {"message": "Publicación eliminada correctamente"}

@router.get("/", response_model=List[PostResponse])
def get_posts(page: int = 1, page_size: int = 10, db: Session = Depends(get_db)):
    offset = (page - 1) * page_size
    posts = db.query(Post).filter(Post.is_published == True).offset(offset).limit(page_size).all()
    return posts

@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id, Post.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")
    return post

@router.get("/tag/{tag_id}", response_model=List[PostResponse])
def get_posts_by_tag(tag_id: int, db: Session = Depends(get_db)):
    posts = db.query(Post).join(Post.tags).filter(Tag.id == tag_id, Post.is_published == True).all()
    return posts

