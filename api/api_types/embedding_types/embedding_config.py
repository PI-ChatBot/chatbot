from typing import TypedDict


class EmbeddingConfigDict(TypedDict):
    '''
    Dicionário com as configurações de embedding e do Pinecone.
    '''
    pinecone_api_key: str
    pinecone_index_name: str
    embedding_model_name: str
