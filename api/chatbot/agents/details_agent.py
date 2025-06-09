import json
import os
from copy import deepcopy
from typing import List

import dotenv
import numpy as np
from api_types import MessageDict
from openai import OpenAI
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

from .utils import get_chatbot_response, get_embeddings

dotenv.load_dotenv()  # Carregar variáveis de ambiente


class DetailsAgent():
    '''
    Agente de detalhes do chatbot.

    Este agente é responsável por fornecer detalhes sobre os produtos disponíveis no restaurante.
    '''
    # Método construtor

    def __init__(self):
        # Cliente OpenAI
        self.client = OpenAI(
            api_key=os.getenv("CHATBOT_API_KEY"),
            base_url=os.getenv("CHATBOT_URL")
        )
        # Modelo de LLM
        self.model_name: str = os.getenv("MODEL_NAME", "")

        # Cliente de embeddings
        self.embedding_model_name = os.getenv("EMBEDDING_MODEL_NAME")
        self.embedding_client = SentenceTransformer(self.embedding_model_name)

        # Cliente Pinecone
        self.pinecone_client = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "")

    # Obter resultado mais próximo
    def get_closest_result(self, index_name: str, input_embeddings: list, top_k=2):
        '''
        Obtém o resultado mais próximo do índice Pinecone.

        :param index_name: Nome do índice no Pinecone
        :param input_embeddings: Embeddings de entrada para a consulta
        :param top_k: Número de resultados mais próximos a serem retornados

        :return: Resultados mais próximos do índice Pinecone
        '''
        # Converter embeddings para lista
        if not isinstance(input_embeddings, list):
            input_embeddings = input_embeddings.tolist()

        # Obter índice do Pinecone
        index = self.pinecone_client.Index(index_name)

        # Consulta no índice do Pinecone
        results = index.query(
            namespace='produtos',  # namespace
            vector=input_embeddings,  # vetor de entrada
            top_k=top_k,  # número de resultados mais próximos
            include_values=False,  # não incluir valores dos vetores
            include_metadata=True  # incluir metadados (legível para humanos)
        )
        return results

    # Obter resposta do agente
    def get_response(self, messages: List[MessageDict]) -> MessageDict:
        '''
        Obtém a resposta do agente de detalhes.

        :param messages: Lista de mensagens entre o usuário e o chatbot.
        '''
        messages = deepcopy(messages)  # Evitar efeitos colaterais

        # Mensagem do usuário
        user_message = messages[-1]["content"]
        # Embedding da mensagem do usuário
        user_embedding = get_embeddings(self.embedding_client, user_message)[0]

        # Obter resultados mais próximos do Pinecone
        result = self.get_closest_result(self.index_name, user_embedding)

        # Obter texto legível
        source_knowledge = "\n".join(
            [x['metadata']['text'].strip() + "\n"
             for x in result['matches']]  # type: ignore
        )

        # System prompt do agente de detalhes
        system_prompt = """
            Você é um assistente de IA especializado em fornecer detalhes sobre os produtos disponíveis nos restaurantes do Colégio Poliedro.
            Sua tarefa é responder às perguntas dos usuários com base nas informações dos produtos disponíveis.
            Se não souber a resposta, diga educadamente que não sabe.
        """

        # Prompt com o resultado da consulta no Pinecone
        prompt_pinecone = f"""
            Usando os contextos fornecidos, responda à pergunta do usuário de forma clara e concisa.
            Contextos:
            {source_knowledge}

            Pergunta do usuário: {user_message}
        """

        # Adicionar prompts à mensagem
        messages[-1]["content"] = prompt_pinecone
        input_messages: List[MessageDict] = [
            # type: ignore
            {'role': 'system', 'content': system_prompt}] + messages[-3:]

        # Obter resposta do LLM
        chatbot_output = get_chatbot_response(
            self.client, self.model_name, input_messages)
        # Processar e retornar resposta
        output = self.postprocess(chatbot_output)
        return output

    # Pós-processamento da resposta do agente
    def postprocess(self, output: str) -> MessageDict:
        '''
        Pós-processa a resposta do agente de detalhes.

        :param output: String da resposta do LLM.
        '''
        output_dict: MessageDict = {
            'role': 'assistant',
            'content': output.strip(),
            'memory': {
                'agent': 'details_agent'
            }
        }
        return output_dict
