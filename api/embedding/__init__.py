'''
Módulo de embedding e integração com Pinecone.
'''

from .embedding_config import EmbeddingConfig
from .embedding_client import EmbeddingClient
from .pinecone_client import PineconeClient
from .pinecone import create_clients, get_config, pinecone_client

__all__ = [
    'EmbeddingConfig',
    'EmbeddingClient',
    'PineconeClient',
    'create_clients',
    'get_config',
    'pinecone_client'
]
