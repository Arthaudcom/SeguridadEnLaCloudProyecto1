from sqlalchemy import Column, Integer, String, ForeignKey, Table, Text, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
class SecretKey(Base):
    __tablename__ = "secret_keys"
    id = Column(Integer, primary_key=True, index=True)
    value = Column(String, unique=True, nullable=False)

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    is_published = Column(Boolean, default=False)
    tags = relationship("Tag", secondary="post_tags", backref="posts")
    ratings = relationship("Rating", back_populates="post")
    

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)  
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    user = relationship("User")
    post = relationship("Post", back_populates="ratings")

class PostTag(Base):
    __tablename__ = "post_tags"
    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)