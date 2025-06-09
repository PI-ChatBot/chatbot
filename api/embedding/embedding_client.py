'''
Cliente para gerar embeddings usando Sentence Transformers.
'''

import numpy as np
from typing import List, Union
from sentence_transformers import SentenceTransformer


class EmbeddingClient:
    '''
    Cliente para gerar embeddings de textos usando Sentence Transformers.
    '''

    # Método construtor
    def __init__(self, model_name: str):
        '''
        Inicializa o cliente de embeddings.

        :param model_name: Nome do modelo de Sentence Transformers a ser utilizado.
        '''
        self.model_name = model_name
        self._model = None

    # Criar o modelo de embedding
    @property
    def model(self) -> SentenceTransformer:
        '''
        Carrega o modelo de embedding no Sentence Transformers caso não haja um configurado.
        '''
        if self._model is None:
            self._model = SentenceTransformer(self.model_name)
        return self._model

    # Gerar embeddings
    def encode(
            self,
            texts: Union[str, List[str]],
            convert_to_numpy: bool = True
    ) -> Union[np.ndarray, List[float]]:
        '''
        Gera embeddings para o(s) texto(s) fornecido(s).

        :param texts: Texto ou lista de textos para gerar os embeddings.
        :param convert_to_numpy: Se `True`, converte o resultado para um array NumPy. Se `False`, retorna uma lista padrão do Python.

        :return: Embeddings gerados como um array NumPy ou uma lista de floats.
        '''
        # Se for um texto único, converte para lista
        if isinstance(texts, str):
            texts = [texts]

        # Gera os embeddings
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=convert_to_numpy
        )
        return embeddings
