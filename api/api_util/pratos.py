from decimal import Decimal
import uuid
from pydantic import BaseModel
from sqlmodel import Session, select, func
from api_util.funcionario import get_current_funcionario
from api_util.tables import Categoria, Item, Restaurante, Pedido, ItemPedido
from api_util.db import engine
from api_types import ProdutoModel
from typing import List


def obter_pratos_por_restaurante(id_restaurante: str) -> List[ProdutoModel] | None:
    session = Session(engine)
    try:
        # Query que faz join com restaurante e categoria para obter seus nomes
        statement = (
            select(
                Item.id_item,
                Item.nome,
                Restaurante.nome,
                Item.id_restaurante,
                Categoria.nome,
                Item.id_categoria,
                Item.descricao,
                func.avg(Pedido.avaliacao),
                Item.estoque,
                Item.preco,
                Item.preco_especial,
                Item.imagem
            )  # type: ignore
            .select_from(Item)
            .join(Categoria, Item.id_categoria == Categoria.id_categoria)
            .join(Restaurante, Item.id_restaurante == Restaurante.id_restaurante)
            .outerjoin(ItemPedido, Item.id_item == ItemPedido.id_item)
            .outerjoin(Pedido, ItemPedido.id_pedido == Pedido.id_pedido)
            .where(Item.id_restaurante == uuid.UUID(id_restaurante))
            .group_by(
                Item.id_item,
                Item.nome,
                Restaurante.nome,
                Item.id_restaurante,
                Categoria.nome,
                Item.id_categoria,
                Item.descricao,
                Item.estoque,
                Item.preco,
                Item.preco_especial,
                Item.imagem
            )
            .order_by(Item.nome)
        )
        # Executar a consulta e obter o resultado
        result = session.exec(statement).all()

        # Converter o resultado para objetos ProdutoModel
        pratos: List[ProdutoModel] = []
        for row in result:
            prato = ProdutoModel(
                id_item=str(row[0]),  # id_item
                nome=row[1],          # nome
                restaurante=row[2],   # restaurante nome
                id_restaurante=str(row[3]),  # id_restaurante
                categoria=row[4],     # categoria nome
                id_categoria=str(row[5]),    # id_categoria
                descricao=row[6],     # descricao
                avaliacao=float(row[7]) if row[7] else None,  # avaliacao
                estoque=row[8],       # estoque
                preco=float(row[9]),  # preco
                preco_especial=float(
                    row[10]) if row[10] else None,  # preco_especial
                imagem=row[11]        # imagem
            )
            pratos.append(prato)

        session.close()
        return pratos
    except Exception:
        session.close()
        return None


class ItemCardapio(BaseModel):
    id_item : str | None
    nome: str
    preco: float
    descricao: str
    categoria: str
    imagem: str | None
    promocional: bool


def criar_prato(token_funcionario_str: str, itemCardapio: ItemCardapio):
    session = Session(engine)
    try:
        funcionario = get_current_funcionario(token_funcionario_str)
        if funcionario is None:
            return None
        if funcionario.id_restaurante is None:
            return None
        categoria = obter_categoria_por_nome(itemCardapio.nome)
        if categoria is None:
            categoria = Categoria(
                nome=itemCardapio.categoria
            )
            session.add(categoria)
            session.commit()
            session.refresh(categoria)
        item = Item(
            id_restaurante=funcionario.id_restaurante,
            id_categoria=categoria.id_categoria,
            nome=itemCardapio.nome,
            descricao=itemCardapio.descricao,
            imagem=itemCardapio.imagem,
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

<<<<<<< Updated upstream

def obter_categoria_por_nome(nome_categoria: str):
=======
def editar_prato(token_funcionario_str : str, itemCardapio : ItemCardapio):
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
                nome=itemCardapio.categoria
            )
            session.add(categoria)
            session.commit()
            session.refresh(categoria)
        if itemCardapio.id_item is None:
            return None
        statement = select(Item).where(Item.id_item == uuid.UUID(itemCardapio.id_item))
        item = session.exec(statement).one()
        item.id_restaurante= funcionario.id_restaurante
        item.id_categoria= categoria.id_categoria
        item.nome=itemCardapio.nome
        item.descricao=itemCardapio.descricao
        item.estoque=1000
        item.imagem=itemCardapio.imagem
        item.preco=Decimal(itemCardapio.preco)
        item.preco_especial=Decimal(itemCardapio.preco)
        session.add(item)
        session.commit()
        session.close()
        return True
    except Exception:
        pass
    finally:
        session.close()
        return None

def deletar_prato(token_funcionario_str : str, itemCardapioID : str):
    session = Session(engine)
    try:
        funcionario = get_current_funcionario(token_funcionario_str)
        if funcionario is None:
            return None
        statement = select(Item).where(Item.id_item == uuid.UUID(itemCardapioID))
        item = session.exec(statement).one()
        session.delete(item)
        session.commit()
        session.close()
        return True
    except Exception:
        pass
    finally:
        session.close()
        return None

def obter_categoria_por_nome(nome_categoria : str):
>>>>>>> Stashed changes
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
