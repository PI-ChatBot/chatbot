#!/usr/bin/env python3
"""
Script de teste para verificar se o banco de dados vetorial está funcionando corretamente.
"""

import sys
import os

# Adicionar o diretório pai ao path para importações
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from embedding.embedding_config import EmbeddingConfig
from embedding.embedding_client import EmbeddingClient
from embedding.pinecone_client import PineconeClient


def test_vector_search(query: str = "frango grelhado"):
    """
    Testa a busca por similaridade no banco de dados vetorial.

    :param query: Consulta de teste
    """
    print(f"=== Testando busca por: '{query}' ===")

    # 1. Carregar configurações
    config = EmbeddingConfig()

    # 2. Gerar embedding da consulta
    embedding_client = EmbeddingClient(config.embedding_model_name)
    query_embedding = embedding_client.encode([query], convert_to_numpy=True)

    # Converter para lista se necessário
    if hasattr(query_embedding, 'tolist'):
        query_vector = query_embedding.tolist()[0]  # type: ignore
    elif isinstance(query_embedding, list) and isinstance(query_embedding[0], list):
        query_vector = query_embedding[0]
    elif isinstance(query_embedding, list) and all(isinstance(x, float) for x in query_embedding):
        query_vector = query_embedding
    else:
        raise ValueError(
            "query_embedding não está no formato esperado de lista de floats.")

    # 3. Fazer consulta no Pinecone
    pinecone_client = PineconeClient(config.pinecone_api_key)

    results = pinecone_client.query_vectors(
        index_name=config.pinecone_index_name,
        vector=query_vector,  # type: ignore
        top_k=3,
        namespace="produtos",
        include_metadata=True
    )

    # 4. Mostrar resultados
    print(f"\nResultados para '{query}':")
    print("-" * 50)

    for i, match in enumerate(results['matches'], 1):  # type: ignore
        score = match['score']
        metadata = match.get('metadata', {})

        print(f"\n{i}. Score: {score:.4f}")
        print(f"   Nome: {metadata.get('nome', 'N/A')}")
        print(f"   Categoria: {metadata.get('categoria', 'N/A')}")
        print(f"   Descrição: {metadata.get('descricao', 'N/A')}")
        print(f"   Preço: R$ {metadata.get('preco', 'N/A')}")
        if metadata.get('preco_especial'):
            print(f"   Preço Especial: R$ {metadata.get('preco_especial')}")

        # Mostrar parte do texto completo
        text = metadata.get('text', '')
        if len(text) > 100:
            text = text[:100] + "..."
        print(f"   Texto: {text}")


def main():
    """
    Função principal para testar diferentes consultas.
    """
    # Testes diferentes
    queries = [
        "frango grelhado",
        "refeição com arroz",
        "comida barata",
        "prato principal",
        "almoco"
    ]

    for query in queries:
        try:
            test_vector_search(query)
            print("\n" + "=" * 70 + "\n")
        except Exception as e:
            print(f"Erro ao testar '{query}': {e}")
            print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    main()
