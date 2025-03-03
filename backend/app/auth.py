import os
import secrets
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SecretKey

def get_or_create_secret_key(db: Session):
    key = db.query(SecretKey).first()
    if key is None:
        new_key = SecretKey(value=secrets.token_hex(32))  
        db.add(new_key)
        db.commit()
        db.refresh(new_key)
        return new_key.value
    return key.value

def load_secret_key():
    db = next(get_db())
    try:
        return get_or_create_secret_key(db)
    finally:
        db.close()  

SECRET_KEY = load_secret_key()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  
    except JWTError:
        return None  
