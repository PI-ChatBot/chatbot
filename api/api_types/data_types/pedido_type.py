'''
Tipagem para os pedidos na API.
'''

from pydantic import BaseModel
from typing import List, Optional

class ItemPedido(BaseModel):
    '''
    Modelo que representa um item de um pedido.
    '''
    id_item: int
    quantidade: int
    observacoes: Optional[str] = None

