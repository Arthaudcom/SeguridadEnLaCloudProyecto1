from fastapi import FastAPI
from app.database import Base, engine
from app.models import *  
from app.routes import posts, users, tags, ratings

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(posts.router, prefix="/posts", tags=["Posts"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(tags.router, prefix="/tags", tags=["Tags"])
app.include_router(ratings.router, prefix="/ratings", tags=["Ratings"])

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur FastAPI !"}
