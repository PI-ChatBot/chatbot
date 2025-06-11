from decimal import Decimal
import uuid
from pydantic import BaseModel
from sqlmodel import Session, select
from api_util.funcionario import get_current_funcionario
from api_util.tables import Categoria, Item
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

class ItemCardapio(BaseModel):
    nome: str
    preco: float
    descricao: str
    categoria: str | None
    imagem: str | None
    promocional: bool

def criar_prato(token_funcionario_str : str, itemCardapio : ItemCardapio):
    session = Session(engine)
    try :
        funcionario = get_current_funcionario(token_funcionario_str)
        if funcionario is None:
            return None
        if funcionario.id_restaurante is None:
            return None
        categoria = obter_categoria_por_nome(itemCardapio.nome)
        if categoria is None:
            categoria = Categoria(
                nome=itemCardapio.nome
            )
            session.add(categoria)
            session.commit()
            session.refresh(categoria)
        item = Item(
            id_restaurante= funcionario.id_restaurante,
            id_categoria= categoria.id_categoria,
            nome=itemCardapio.nome,
            descricao=itemCardapio.descricao,
            estoque=1000,
            preco=Decimal(itemCardapio.preco),
            preco_especial=Decimal(itemCardapio.preco)
        )
        session.add(item)
        session.commit()
        session.close()
        return True
    except Exception:
        pass
    finally:
        session.close()
        return None

def obter_categoria_por_nome(nome_categoria : str):
    session = Session(engine)
    try:
        statement = select(Categoria).where(Categoria.nome == nome_categoria)
        categoria = session.exec(statement).one()
        session.close()
        return categoria
    except Exception:
        pass
    finally:
        session.close()
        return None
