from typing import Annotated


import os
import dotenv
from fastapi import Depends
from sqlmodel import Session, create_engine
from api_util.tables import *

dotenv.load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

if __name__ == "__main__":
    create_db_and_tables()
