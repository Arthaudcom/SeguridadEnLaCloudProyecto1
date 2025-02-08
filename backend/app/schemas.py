from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
class EmailRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class PostCreate(BaseModel):
    title: str
    content: str
    tags: List[str]
    
class PostUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    tag_ids: Optional[List[int]]
    is_published: Optional[bool]

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime.datetime
    is_published: bool
    tags: List[str]

    class Config:
        orm_mode = True
        
class TagCreate(BaseModel):
    name: str        

class TagResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class RatingCreate(BaseModel):
    score: float
    post_id: int
    
class RatingResponse(BaseModel):
    id: int
    score: float
    user_id: int
    post_id: int

    class Config:
        orm_mode = True
    

