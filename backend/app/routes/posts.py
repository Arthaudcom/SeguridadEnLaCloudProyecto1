from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.models import Post, Tag, User
from app.auth import verify_token
from app.schemas import PostCreate, PostResponse, PostUpdate
from app.database import get_db
from typing import List, Optional
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=PostResponse)
def create_post(
    post: PostCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    # Vérifier le token
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autenticación requerido")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    # Retrouver l'utilisateur
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Gérer la liste de tags reçus sous forme de noms
    tag_objects = []
    for tag_name in post.tags:
        existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if existing_tag:
            tag_objects.append(existing_tag)
        else:
            new_tag = Tag(name=tag_name)
            db.add(new_tag)
            db.commit()
            db.refresh(new_tag)
            tag_objects.append(new_tag)

    new_post = Post(
        title=post.title,
        content=post.content,
        author_id=user.id,
        author=post.author,
        published_at=post.published_at,
        is_published=post.is_published
    )

    new_post.tags = tag_objects

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return PostResponse(
        id=new_post.id,
        title=new_post.title,
        content=new_post.content,
        author=new_post.author or "",
        published_at=new_post.published_at or datetime.now(),
        is_published=new_post.is_published,
        tags=[tag.name for tag in new_post.tags],
    )



@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    token: str,
    db: Session = Depends(get_db)
):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # On retrouve le post qui correspond à l'auteur
    post_db = db.query(Post).filter(
        Post.id == post_id, 
        Post.author_id == user.id
    ).first()

    if not post_db:
        raise HTTPException(status_code=404, detail="Publicación no encontrada o no tienes permisos")

    # Mettre à jour les champs un par un
    if post_data.title is not None:
        post_db.title = post_data.title

    if post_data.content is not None:
        post_db.content = post_data.content

    if post_data.author is not None:
        post_db.author = post_data.author

    if post_data.published_at is not None:
        post_db.published_at = post_data.published_at

    # S’il y a un tableau de tags, on met à jour
    if post_data.tags is not None:
        tag_objects = []
        for tag_name in post_data.tags:
            existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if existing_tag:
                tag_objects.append(existing_tag)
            else:
                new_tag = Tag(name=tag_name)
                db.add(new_tag)
                db.commit()
                db.refresh(new_tag)
                tag_objects.append(new_tag)
        post_db.tags = tag_objects

    # S’il y a is_published
    if post_data.is_published is not None:
        post_db.is_published = post_data.is_published

    db.commit()
    db.refresh(post_db)

    return PostResponse(
        id=post_db.id,
        title=post_db.title,
        content=post_db.content,
        author=post_db.author or "",
        published_at=post_db.published_at or datetime.now(),
        is_published=post_db.is_published,
        tags=[tag.name for tag in post_db.tags],
    )


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
    posts_db = db.query(Post).filter(Post.is_published == True).offset(offset).limit(page_size).all()

    # Construire un PostResponse pour chaque post
    responses = []
    for p in posts_db:
        responses.append(
            PostResponse(
                id=p.id,
                title=p.title,
                content=p.content,
                author=p.author or "",
                published_at=p.published_at or p.created_at,
                is_published=p.is_published,
                tags=[t.name for t in p.tags],
            )
        )
    return responses


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post_db = db.query(Post).filter(Post.id == post_id, Post.is_published == True).first()
    if not post_db:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    # Construire un PostResponse en extrayant les données voulues
    response = PostResponse(
        id=post_db.id,
        title=post_db.title,
        content=post_db.content,
        author=post_db.author or "",
        published_at=post_db.published_at or post_db.created_at,  # Au choix
        is_published=post_db.is_published,
        tags=[tag.name for tag in post_db.tags]
    )
    return response


@router.get("/tag/{tag_id}", response_model=List[PostResponse])
def get_posts_by_tag(tag_id: int, db: Session = Depends(get_db)):
    posts_db = (
        db.query(Post)
        .join(Post.tags)
        .filter(Tag.id == tag_id, Post.is_published == True)
        .all()
    )
    # Retourner une liste de PostResponse
    responses = []
    for p in posts_db:
        responses.append(
            PostResponse(
                id=p.id,
                title=p.title,
                content=p.content,
                author=p.author or "",
                published_at=p.published_at or p.created_at,
                is_published=p.is_published,
                tags=[t.name for t in p.tags]
            )
        )
    return responses


