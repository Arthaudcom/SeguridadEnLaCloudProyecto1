from fastapi import FastAPI
from app.database import Base, engine, wait_for_db
from app.models import *  
from app.routes import posts, users, tags, ratings

wait_for_db()

print("Creacion de las tablas en la base de datos")
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(posts.router, prefix="/posts", tags=["Posts"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(tags.router, prefix="/tags", tags=["Tags"])
app.include_router(ratings.router, prefix="/ratings", tags=["Ratings"])

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI !"}

    
