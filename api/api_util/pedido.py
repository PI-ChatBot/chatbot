from decimal import Decimal
import uuid
from sqlmodel import Session, select
from api_util.funcionario import get_current_funcionario
from api_util.login import get_current_user
from api_util.tables import Pedido
from random import randint
from api_util.db import engine

def fazer_pedido(token: str, id_restaurante_str: str, preco: float):
    user = get_current_user(token)
    if user is not None:
        pedido = Pedido(
            id_restaurante=uuid.UUID(id_restaurante_str),
            id_funcionario=None,
            id_cliente=user.id_cliente,
            nome_cliente=user.nome,
            status="pendente",
            subtotal=Decimal(preco),
            codigo_retirada=str(randint(10000,99999))
        )

def obter_pedidos_no_restaurante(token_funcionario : str):
    session = Session(engine)
    try:
        funcionario = get_current_funcionario(token_funcionario)
        if funcionario is None:
            return None
        statement = select(Pedido).where(Pedido.id_restaurante == funcionario.id_restaurante)
        pedidos = session.exec(statement).all()
        return pedidos
    except Exception:
        pass
    finally:
        session.close()
        return None

def atualizar_status_pedido(token_funcionario : str, id_pedido : str, novo_status : str):
    session = Session(engine)
    try:
        funcionario = get_current_funcionario(token_funcionario)
        if funcionario is None:
            return None
        statement = select(Pedido).where(Pedido.id_pedido == id_pedido)
        pedido = session.exec(statement).one()

        pedido.status = novo_status
        session.add(pedido)
        session.commit()
        session.refresh(pedido)
        return True
    except Exception:
        pass
    finally:
        session.close()
        return None
