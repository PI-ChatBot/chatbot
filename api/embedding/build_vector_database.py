'''
Script para criar um banco de dados vetorial a partir do dataframe com os produtos cadastrados no banco de dados.
'''

import pandas as pd
import json
import unicodedata
import os
from typing import List, Dict, Any
from .embedding_config import EmbeddingConfig
from .embedding_client import EmbeddingClient
from .pinecone_client import PineconeClient

# Carregar JSON


def load_products_data(json_path: str) -> pd.DataFrame:
    """
    Carrega os dados dos produtos do arquivo JSON.

    :param json_path: Caminho para o arquivo produtos.json
    :return: DataFrame com os dados dos produtos
    """
    # Abrir o arquivo JSON e carregar os dados
    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    # Converter os dados para um DataFrame do pandas
    return pd.DataFrame(data)

# Descrição textual do produto


def create_product_text(row: pd.Series) -> str:
    """
    Cria uma descrição textual do produto para ser usada no embedding.

    :param row: Linha do DataFrame com os dados do produto
    :return: Texto formatado do produto
    """
    nome = row.get('nome', 'N/A')
    categoria = row.get('categoria', 'N/A')
    descricao = row.get('descricao', 'N/A')
    ingredientes = row.get('ingredientes', [])
    preco = row.get('preco', 'N/A')
    preco_especial = row.get('preco_especial', None)
    avaliacao = row.get('avaliacao', 'N/A')

    # Formatar ingredientes
    if isinstance(ingredientes, list) and ingredientes and ingredientes[0] is not None:
        ingredientes_str = ", ".join(
            [str(ing) for ing in ingredientes if ing is not None])
    else:
        ingredientes_str = "Não informado"

    # Preço especial (se existir)
    preco_info = f"R$ {preco}"
    if preco_especial:
        preco_info += f"Preço para alunos, professores e funcionários: R$ {preco_especial}."

    # Avaliação (se existir)
    avaliacao_info = f"Avaliação: {avaliacao}" if avaliacao and avaliacao != 'N/A' else "Sem avaliação"

    # Criar texto completo
    texto = f"{nome} - {categoria}: {descricao}. Ingredientes: {ingredientes_str}. Preço: {preco_info}.{avaliacao_info}"

    return texto

# Normalizar texto para ASCII


def normalize_text(text: str) -> str:
    """
    Remove acentos e normaliza o texto para ASCII.

    :param text: Texto a ser normalizado
    :return: Texto normalizado
    """
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')

# Criar vetores para o Pinecone


def create_vectors_for_pinecone(df: pd.DataFrame, embeddings: List[List[float]]) -> List[Dict[str, Any]]:
    """
    Cria a estrutura de vetores para envio ao Pinecone.

    :param df: DataFrame com os dados dos produtos
    :param embeddings: Lista de embeddings correspondentes
    :return: Lista de vetores formatados para o Pinecone
    """
    vectors = []

    for i, (_, row) in enumerate(df.iterrows()):
        # ID único baseado no nome do produto e categoria
        # Normalizar para ASCII e remover caracteres especiais
        categoria_clean = normalize_text(
            row['categoria']).replace(" ", "_").replace("/", "_")
        nome_clean = normalize_text(row['nome']).replace(
            " ", "_").replace("/", "_")
        product_id = f"{categoria_clean}_{nome_clean}_{i}"

        # Texto completo do produto
        product_text = create_product_text(row)
        normalized_text = normalize_text(product_text)

        # Metadata com informações estruturadas
        metadata = {
            "text": normalized_text,
            "nome": row['nome'],
            "categoria": row['categoria'],
            "descricao": row['descricao'],
            "preco": str(row['preco']),
            "type": "produto"
        }

        # Se há preço especial, adicionar aos metadados
        if row.get('preco_especial'):
            metadata["preco_especial"] = str(row['preco_especial'])

        # Se há avaliação, adicionar aos metadados
        if row.get('avaliacao'):
            metadata["avaliacao"] = str(row['avaliacao'])

        vector = {
            "id": product_id,
            "values": embeddings[i],
            "metadata": metadata
        }

        vectors.append(vector)

    return vectors


def main():
    """
    Função principal para construir o banco de dados vetorial.
    """
    print("=== Iniciando construção do banco de dados vetorial ===")

    # 1. Carregar configurações
    print("\n1. Carregando configurações...")
    config = EmbeddingConfig()

    print(f"   - Modelo de embedding: {config.embedding_model_name}")
    print(f"   - Dimensão: {config.embedding_dimension}")
    print(f"   - Índice Pinecone: {config.pinecone_index_name}")

    # 2. Carregar dados dos produtos
    print("\n2. Carregando dados dos produtos...")
    current_dir = os.path.dirname(__file__)
    json_path = os.path.join(current_dir, '..', 'data', 'produtos.json')

    df = load_products_data(json_path)

    # 3. Preparar textos para embedding
    print("\n3. Preparando textos para embedding...")
    texts = []
    for _, row in df.iterrows():
        product_text = create_product_text(row)
        texts.append(product_text)

    print(f"   - Criados {len(texts)} textos para embedding")
    # 4. Gerar embeddings
    print("\n4. Gerando embeddings...")
    embedding_client = EmbeddingClient(config.embedding_model_name)
    embeddings = embedding_client.encode(texts, convert_to_numpy=True)

    embedding_dim = len(embeddings[0]) if hasattr(  # type: ignore
        embeddings[0], '__len__') else 1
    print(
        f"   - Gerados embeddings: {len(embeddings)} textos com dimensão {embedding_dim}")

    # 5. Configurar Pinecone
    print("\n5. Configurando Pinecone...")
    pinecone_client = PineconeClient(config.pinecone_api_key)

    # Criar índice se não existir
    pinecone_client.create_index(
        name=config.pinecone_index_name,
        dimension=config.embedding_dimension,
        metric='cosine',
        cloud='aws',
        region='us-east-1'
    )
    # 6. Preparar vetores para Pinecone
    print("\n6. Preparando vetores para Pinecone...")
    # Converter embeddings para lista se necessário
    if hasattr(embeddings, 'tolist'):
        embeddings_list = embeddings.tolist()  # type: ignore
    else:
        embeddings_list = embeddings

    vectors = create_vectors_for_pinecone(df, embeddings_list)  # type: ignore

    print(f"   - Preparados {len(vectors)} vetores")

    # 7. Limpar namespace existente
    print("\n7. Limpando dados existentes...")
    namespace = "produtos"
    pinecone_client.delete_namespace(config.pinecone_index_name, namespace)

    # 8. Enviar vetores para Pinecone
    print("\n8. Enviando vetores para Pinecone...")
    pinecone_client.upsert_vectors(
        index_name=config.pinecone_index_name,
        vectors=vectors,
        namespace=namespace
    )
    # Mensagem de sucesso
    print("\n=== Banco de dados vetorial criado com sucesso! ===")
    print(f"   - {len(vectors)} produtos indexados")
    print(f"   - Namespace: {namespace}")
    print(f"   - Índice: {config.pinecone_index_name}")


# Executar main se chamar script diretamente
if __name__ == "__main__":
    main()
