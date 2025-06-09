# Importação simples
from embedding import create_clients, get_config

# Criar clientes
pinecone_client, embedding_client = create_clients()

# Ou usar classes individuais
from api.embedding import PineconeClient, EmbeddingClient, EmbeddingConfig

config = EmbeddingConfig()
pinecone = PineconeClient(config.pinecone_api_key)
embedder = EmbeddingClient(config.embedding_model_name)
