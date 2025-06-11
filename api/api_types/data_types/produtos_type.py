# Dicionário tipado de produtos

from typing import TypedDict, List, Union, Optional
from pydantic import BaseModel


class ProdutoDict(TypedDict):
    '''
    Dicionário tipado para os produtos.
    '''
    # Identificação
    id_item: str
    nome: str
    # Restaurante
    restaurante: str
    id_restaurante: str
    # Categoria
    categoria: str
    id_categoria: str
    # Informações
    descricao: str
    avaliacao: float
    estoque: int
    # Preço
    preco: float
    preco_especial: Optional[float]
    # Ingredientes
    # ingredientes: List[Union[str, None]]
    # ingredientes_ids: List[Union[str, None]]
    # URL da imagem
    imagem: str


class ProdutoModel(BaseModel):
    '''Modelo Pydantic para os produtos.'''
    id_item: str
    nome: str
    restaurante: str
    id_restaurante: str
    categoria: str
    id_categoria: str
    descricao: str
    avaliacao: float | None
    estoque: int
    preco: float
    preco_especial: float | None
    imagem: str | None
