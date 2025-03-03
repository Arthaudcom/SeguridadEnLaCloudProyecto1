import os
import time
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def wait_for_db():
    retries = 5
    while retries > 0:
        try:
            with engine.connect() as connection:
                print("Conecion a la base de datos con exito")
                return
        except Exception as e:
            print(f"Base de datos no disponible, intentando de nuevo ({retries})...")
            time.sleep(5)
            retries -= 1
    raise Exception("Imposible de conectar a la base de datos.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
