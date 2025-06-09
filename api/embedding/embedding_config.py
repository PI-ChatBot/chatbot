'''
Configurações do embedding e do Pinecone.
'''

import os
from typing import Optional

from api_types import EmbeddingConfigDict
from dotenv import load_dotenv


class EmbeddingConfig:
    '''
    Classe para gerenciar as configurações de embedding e do Pinecone.
    '''

    # Método construtor
    def __init__(self, env_path: Optional[str] = None):
        '''
        Método construtor que carrega as variáveis de ambiente a partir de um arquivo `.env`.

        :param env_path: Caminho para o arquivo `.env`. Se `None`, usa o padrão `.env` na raiz da pasta `/api`.
        '''

        if env_path:
            # carregar variáveis de ambiente do arquivo especificado
            load_dotenv(env_path)
        else:
            # Carregar do arquivo .env na pasta api
            current_dir = os.path.dirname(__file__)
            env_path = os.path.join(current_dir, '..', '.env')
            load_dotenv(env_path)

    # API Key do Pinecone
    @property
    def pinecone_api_key(self) -> str:
        '''
        Chave da API do Pinecone.
        '''
        key = os.getenv('PINECONE_API_KEY')
        if not key:  # Se não for encontrado no ENV
            raise ValueError(
                'PINECONE_API_KEY não encontrado nas variáveis de ambiente.')
        return key

    # Nome do índice do Pinecone
    @property
    def pinecone_index_name(self) -> str:
        '''
        Nome do índice do Pinecone utilizado no projeto.
        '''
        name = os.getenv('PINECONE_INDEX_NAME')
        if not name:  # Se não for encontrado no ENV
            raise ValueError(
                'PINECONE_INDEX_NAME não encontrado nas variáveis de ambiente.')
        return name    # Nome do modelo de embedding

    @property
    def embedding_model_name(self) -> str:
        '''
        Nome do modelo de embedding.
        '''
        return os.getenv(
            'EMBEDDING_MODEL_NAME',
            'BAAI/bge-small-en-v1.5'  # modelo padrão se não for especificado no ENV
        )

    # Dimensão dos embeddings
    @property
    def embedding_dimension(self) -> int:
        '''
        Dimensão dos vetores de embedding.
        '''
        return int(os.getenv('EMBEDDING_DIMENSION', '384'))

    # Retornar configurações em um dicionário    def dict_config(self) -> EmbeddingConfigDict:
        '''
        Retorna as configurações de embedding e do Pinecone como um dicionário.
        '''
        return {
            'pinecone_api_key': self.pinecone_api_key,
            'pinecone_index_name': self.pinecone_index_name,
            'embedding_model_name': self.embedding_model_name,
            'embedding_dimension': str(self.embedding_dimension)
        }
