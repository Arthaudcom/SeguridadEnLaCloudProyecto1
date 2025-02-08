from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate, UserResponse, TokenResponse, EmailRequest, ResetPasswordRequest
from datetime import timedelta
from app.database import get_db
from app.utils import hash_password, verify_password
from app.auth import create_access_token, verify_token

router = APIRouter()


@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()

    if existing_user:
        if existing_user.email == user.email:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        if existing_user.username == user.username:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")

    hashed_pwd = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_pwd)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/recover-password")
def recover_password(request: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    reset_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=10))
    return {"message": "Token de recuperación generado", "token": reset_token}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = verify_token(request.token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    email = payload["sub"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.hashed_password = hash_password(request.new_password)
    db.commit()
    return {"message": "Contraseña actualizada exitosamente"}
