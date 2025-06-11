import uuid
from sqlmodel import Session, select
from api_util.tables import Restaurante
from api_util.db import engine

def obter_restaurantes():
    pass

def obter_restaurante_por_id(id_restaurante : str):
    session = Session(engine)
    try:
        statement= select(Restaurante).where(Restaurante.id_restaurante == uuid.UUID(id_restaurante))
        restaurante = session.exec(statement).one()
        session.close()
        return restaurante
    except Exception:
        return None
