import uuid
from sqlmodel import Session, select
from api_util.tables import Item
from api_util.db import engine


def obter_pratos_por_restaurante(id_restaurante : str):
    session = Session(engine)
    try:
        statement= select(Item).where(Item.id_restaurante == uuid.UUID(id_restaurante))
        itens = session.exec(statement).all()
        session.close()
        return itens
    except Exception:
        return None
