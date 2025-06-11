# Dicionário tipado de produtos

from typing import TypedDict, List, Union, Optional


class ProdutoDict(TypedDict):
    '''
    Dicionário tipado para os produtos.
    '''
    # Identificação
    id: str
    nome: str
    # Restaurante
    restaurante: str
    restaurante_id: str
    # Categoria
    categoria: str
    categoria_id: str
    # Informações
    descricao: str
    avaliacao: float
    # Ingredientes
    ingredientes: List[Union[str, None]]
    ingredientes_ids: List[Union[str, None]]
    # Preço
    preco: float
    preco_especial: Optional[float]
    # URL da imagem
    imagem_url: str
