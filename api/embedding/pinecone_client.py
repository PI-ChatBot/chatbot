'''
Cliente para interagir com o Pinecone, um serviço de banco de dados vetorial.
'''

import time
from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec, Index
import pinecone.exceptions


class PineconeClient:
    '''Cliente para gerenciar operações no Pinecone.'''

    # Método construtor
    def __init__(self, api_key: str):
        '''
        Inicializa o cliente do Pinecone.

        :param api_key: Chave de API para autenticação no Pinecone.
        '''
        self.api_key = api_key
        self._client = None

    # Cliente do Pinecone
    @property
    def client(self) -> Pinecone:
        '''
        Cria, caso não exista, uma instância do cliente Pinecone e a retorna.
        '''
        if self._client is None:  # verifica se o cliente já foi criado
            self._client = Pinecone(api_key=self.api_key)
        return self._client

    # Índice no Pinecone
    @property
    def create_index(
        self,
        name: str,
        dimension: int,
        metric: str = 'cosine',
        cloud: str = 'aws',
        region: str = 'us-east-1',
    ) -> None:
        '''
        Cria um novo índice no Pinecone,

        :param name: Nome do índice a ser criado.
        :param dimension: Dimensão dos vetores.
        :param metric: Métrica de similaridade a ser usada (padrão: cosseno).
        :param cloud: Provedor de nuvem onde o índice será criado (padrão: AWS).
        :param region: Região do provedor de nuvem onde o índice será criado (padrão: us-east-1). Nota: precisa ser uma região disponibilizada pelo Pinecone.
        '''
        try:  # Verifica se o índice já existe
            self.client.describe_index(name)
            print(f'Índice "{name}" já existe.')
        except pinecone.exceptions.NotFoundException:
            # Se não existir, cria o índice
            print(f'Criando índice "{name}"...')
            self.client.create_index(
                name=name,
                dimension=dimension,
                metric=metric,
                spec=ServerlessSpec(cloud=cloud, region=region)
            )

            # Aguarda até que o índice esteja pronto
            self._wait_for_index(name)

    # Aguardar o índice estar pronto
    def _wait_for_index(
            self, name: str, timeout: int = 300
    ) -> None:
        '''
        Aguarda até que o índice esteja pronto para uso.

        :param name: Nome do índice a ser verificado.
        :param timeout: Tempo máximo em segundos para aguardar o índice ficar pronto (padrão: 300 segundos).
        '''

        # Iniciar o tempo de espera
        start_time = time.time()
        while not self.client.describe_index(name).status.ready:
            # Verifica se o tempo limite foi atingido
            if time.time() - start_time > timeout:
                raise TimeoutError(
                    f'Índice "{name}" não ficou pronto dentro do tempo limite de {timeout} segundos.')

            # Espera 5 segundos antes de verificar novamente
            time.sleep(5)

    # Obter o índice
    def get_index(self, name: str) -> Index:
        '''
        Obtém uma referência para um índice existente no Pinecone.

        :param name: Nome do índice a ser obtido.
        :return: Objeto `Index` do Pinecone.
        '''
        return self.client.Index(name)

    # Inserir ou atualizar vetores
    def upsert_vectors(
            self,
            index_name: str,
            vectors: List[Dict[str, Any]],
            namespace: str = 'default'
    ) -> None:
        '''
        Insere ou atualiza vetores no índice especificado.

        :param index_name: Nome do índice onde os vetores serão inseridos ou atualizados.
        :param vectors: Lista de dicionários representando os vetores a serem inseridos ou atualizados.
        :param namespace: Namespace onde os vetores serão armazenados (padrão: 'default').
        '''
        # Obtém o índice
        index = self.get_index(index_name)
        # Insere ou atualiza os vetores
        index.upsert(vectors=vectors, namespace=namespace)
        print(
            f'Inseridos {len(vectors)} vetores no índice "{index_name}" no namespace "{namespace}".')

    # Consultar vetores
    def query_vectors(
            self,
            index_name: str,
            vector: List[float],
            top_k: int = 5,
            namespace: str = 'default',
            include_metadata: bool = True
    ) -> Dict[str, Any]:
        '''
        Consulta vetores no índice especificado.

        :param index_name: Nome do índice onde a consulta será realizada.
        :param vector: Vetor de consulta.
        :param top_k: Número de resultados mais próximos a serem retornados (padrão: 5).
        :param namespace: Namespace onde a consulta será realizada (padrão: 'default').
        :param include_metadata: Se `True`, inclui metadados nos resultados (padrão: `True`).

        :return: Dicionário com os resultados da consulta, incluindo IDs, pontuações e metadados (se solicitado).
        '''

        # Obtém o índice
        index = self.get_index(index_name)
        # Realiza a consulta
        return index.query(
            namespace=namespace,
            vector=vector,
            top_k=top_k,
            include_values=False,
            include_metadata=include_metadata
        )

    # Excluir todos os vetores
    def delete_namespace(
            self,
            index_name: str,
            namespace: str
    ) -> None:
        '''
        Exclui todos os vetores de um namespace específico no índice.

        :param index_name: Nome do índice onde os vetores serão excluídos.
        :param namespace: Namespace de onde os vetores serão excluídos.
        '''
        # Obtém o índice
        index = self.get_index(index_name)
        # Exclui todos os vetores do namespace
        try:
            index.delete(delete_all=True, namespace=namespace)
            print(f"Namespace '{namespace}' deletado com sucesso.")
        except pinecone.exceptions.NotFoundException:
            print(f"Namespace '{namespace}' não encontrado.")
