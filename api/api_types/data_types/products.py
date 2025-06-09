# Dicionário tipado de produtos

from typing import TypedDict, List, Union, Optional


class ProductDict(TypedDict):
    '''
    Dicionário tipado para representar um produto.
    '''
    nome: str
    categoria: str
    descricao: str
    ingredientes: List[Union[str, None]]
    preco: float
    preco_especial: Optional[float]
    avaliacao: float
    imagem_url: str
