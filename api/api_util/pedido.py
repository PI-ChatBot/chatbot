from decimal import Decimal
import uuid
from sqlmodel import Session, select
from api_util.funcionario import get_current_funcionario
from api_util.login import get_current_user
from api_util.tables import Item, ItemPedido, Pedido
from random import randint
from api_util.db import engine

def fazer_pedido(token: str, itens: list[dict]):
    user = get_current_user(token)
    # Unico restaurante disponivel para testes
    id_restaurante_str = "44c57a5e-ced2-4938-ba1d-108a60a60ea1"
    if user is not None:
        preco = 0
        for item in itens:
            preco += item["preco"]
        session = Session(engine)
        try:
            pedido = Pedido(
                id_restaurante=uuid.UUID(id_restaurante_str),
                id_funcionario=None,
                id_cliente=user.id_cliente,
                nome_cliente=user.nome,
                status="pendente",
                subtotal=Decimal(preco),
                codigo_retirada=str(randint(10000,99999))
            )
            session.add(Pedido)
            itensPedido : list[ItemPedido]= []
            for item in itens:
                itemPedido = itensPedido.append(
                    ItemPedido(
                        id_pedido=Pedido.id_pedido,
                        id_item= item["id_item"],
                        quantidade= item["quantidade"],
                        preco = item["preco"],
                        observacoes = item["observacoes"]
                    )
                )
                session.add(itemPedido)
            session.commit()
            session.refresh(Pedido)
            session.close()
            return Pedido
        except Exception:
            pass
        finally:
            session.close()
            return None

def obter_pedidos_no_restaurante(token_funcionario : str):
    session = Session(engine)
    try:
        funcionario = get_current_funcionario(token_funcionario)
        if funcionario is None:
            return None
        statement = select(Pedido).where(Pedido.id_restaurante == funcionario.id_restaurante and Pedido.status == "pendente")
        pedidos_itens = []
        pedidos = session.exec(statement).all()
        for pedido in pedidos:
            pedido_atual = {}
            itens_pedido_atual = []
            statement = select(ItemPedido).where(pedido.id_pedido == ItemPedido.id_pedido)
            itensPedidos = session.exec(statement).all()
            for itemPedido in itensPedidos:
                statement = select(Item).where(itemPedido.id_item == Item.id_item)
                itens = session.exec(statement).all()
                for item in itens:
                    itens_pedido_atual.append({"nome":item.nome,"imagem":item.imagem})
            pedido_atual["id"] = pedido.id_pedido
            pedido_atual["subtotal"] = pedido.subtotal
            pedido_atual["itens"] = itens_pedido_atual
            pedido_atual["nome_cliente"] = pedido.nome_cliente
            pedidos_itens.append(pedido_atual)
        session.close()
        return pedidos_itens
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
        session.close()
        return True
    except Exception:
        pass
    finally:
        session.close()
        return None
