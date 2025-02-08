from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Rating, Post, User
from app.schemas import RatingCreate, RatingResponse
from app.database import get_db
from app.auth import verify_token

router = APIRouter()

@router.post("/", response_model=RatingResponse)
def rate_post(rating: RatingCreate, token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    post = db.query(Post).filter(Post.id == rating.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    existing_rating = db.query(Rating).filter(Rating.user_id == user.id, Rating.post_id == rating.post_id).first()
    if existing_rating:
        existing_rating.score = rating.score
    else:
        new_rating = Rating(score=rating.score, user_id=user.id, post_id=rating.post_id)
        db.add(new_rating)

    db.commit()
    return existing_rating or new_rating

@router.get("/{post_id}/average-rating")
def get_average_rating(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicación no encontrada")

    total_ratings = db.query(Rating).filter(Rating.post_id == post_id).count()
    if total_ratings == 0:
        return {"post_id": post_id, "average_rating": None, "message": "Aún no hay calificaciones"}

    average_score = db.query(Rating.score).filter(Rating.post_id == post_id).all()
    average_score = sum([r[0] for r in average_score]) / total_ratings

    return {"post_id": post_id, "average_rating": round(average_score, 2)}
