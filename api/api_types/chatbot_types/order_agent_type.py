'''
Tipagem do Order Agent
'''
from typing import List, TypedDict, Optional


class OrderItem(TypedDict):
    '''
    Dicionário tipado dos itens do pedido.
    '''
    item: str  # nome do item
    quantidade: int  # quantidade do item
    preco: float  # preço do item
    preco_especial: Optional[float]  # preço especial do item (se houver)


class OrderTakingAgentResponse(TypedDict, total=False):
    '''
    Dicionário tipado da resposta do agente de pedidos.
    '''
    # Informações retornada pelo agente:
    cadeia_de_pensamento: str  # cadeia de pensamento
    etapa: int  # número da etapa
    pedido: List[OrderItem]  # lista de itens do pedido
    resposta: str  # resposta ao usuário

    # Outras informações:
    recomendacao_solicitada_antes: bool  # se a recomendação foi solicitada antes
