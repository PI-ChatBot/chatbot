'''
Módulo principal para integração com o Pinecone e embedding.
'''

from typing import Tuple
from .embedding_client import EmbeddingClient
from .embedding_config import EmbeddingConfig
from .pinecone_client import PineconeClient

# Criar clientes


def create_clients(config_path: str = None) -> Tuple[PineconeClient, EmbeddingClient]:
    '''
    Cria e retorna clientes do Pinecone e embedding configurados.

    :param config_path: Caminho para o arquivo de configuração. Se `None`, usa as variáveis de ambiente.

    :return: Tupla contendo o cliente do Pinecone e o cliente de embedding.
    '''
    # Carregar configuração de embedding
    config = EmbeddingConfig(config_path)

    # Inicializar os clientes
    pinecone_client = PineconeClient(config.pinecone_api_key)
    embedding_client = EmbeddingClient(config.embedding_model_name)

    return pinecone_client, embedding_client

# Obter configurações de embedding


def get_config(config_path: str = None) -> EmbeddingConfig:
    '''
    Obtém as configurações de embedding.

    :param config_path: Caminho para o arquivo `.env`.

    :return: Instância de EmbeddingConfig com as configurações carregadas.
    '''
    return EmbeddingConfig(config_path)
