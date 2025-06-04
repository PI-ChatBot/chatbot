import json
import os
from copy import deepcopy
from typing import List, Literal, TypedDict

import dotenv
from api_types import MessageDict, agent_types
from openai import OpenAI

from .utils import double_check_json_output, get_chatbot_response

dotenv.load_dotenv()  # carregar variáveis de ambiente


# Tipagem da resposta do Classification Agent
class ClassificationAgentResponse(TypedDict):
    '''
    Estrutura de dados para a resposta do agente de classificação.
    Esta estrutura é usada para definir o formato da resposta que o agente de classificação deve retornar.
    '''
    chain_of_thought: str  # cadeia de pensamento
    decision: agent_types  # decisão
    message: Literal[""]


class ClassificationAgent:
    '''
    Agente de classificação para o chatbot.

    Este agente é responsável por classificar a solicitação do usuário para determinar para qual agente deve tratar a solicitação.

    Attributes
    ----------
    client : OpenAI
        Cliente da API OpenAI usado pra interagir com o modelo de linguagem.
    model_name : str
        Nome do modelo de linguagem usado pra gerar respostas.
    '''

    # Método construtor
    def __init__(self):
        # Iniciar cliente OpenAI
        self.client = OpenAI(
            api_key=os.getenv("CHATBOT_API_KEY"),
            base_url=os.getenv("CHATBOT_URL")
        )
        # Modelo de LLM
        self.model_name: str = os.getenv("MODEL_NAME")  # type: ignore

    # Método para obter resposta do agente
    def get_response(self, messages: List[MessageDict]) -> MessageDict:
        '''
        Método para obter a resposta do agente de classificação.
        Este método recebe uma lista de mensagens e retorna a resposta do agente de classificação.

        Parameters
        ----------
        messages : List[Message]
            Lista de mensagens que contém o histórico da conversa entre o usuário e o chatbot.
        '''
        messages = deepcopy(messages)  # evitar efeitos colaterais

        # System prompt do Classification Agent
        system_prompt = """
            Você é um assistente de IA prestativo para o aplicativo de chatbot dos restaurantes e lanchonetes do Colégio Poliedro.

            Sua tarefa é determinar qual agente deve lidar com a entrada do usuário. Você tem 3 agentes disponíveis:
            1- details_agent: Responsável por responder perguntas sobre os restaurantes ou lanchonetes do Colégio Poliedro. Isso inclui localização dentro da escola, horários de funcionamento, formas de pagamento, detalhes sobre os itens do cardápio, ou listar os itens disponíveis (como "O que vocês têm hoje?").
            2- order_taking_agent: Responsável por conduzir a conversa relacionada a pedidos. Se o usuário quiser pedir algo, este agente deve assumir e acompanhar a conversa até o pedido estar completo.
            3- recommendation_agent: Responsável por dar recomendações do que comer ou beber. Se o usuário pedir sugestões, dicas ou perguntar “o que você recomenda?”, este agente deve ser escolhido. Também deve ser escolhido por padrão se o usuário usar uma saudação como "Oi" ou "Bom dia" e não fizer uma pergunta específica.

            Sua saída deve estar em um formato JSON estruturado exatamente como este. Cada chave é uma string, e cada valor também deve ser uma string:
                        {
            "chain_of_thought": "Percorra cada um dos agentes acima e escreva alguns pensamentos sobre a qual agente esta entrada é relevante.",
            "decision": "details_agent" ou "order_taking_agent" ou "recommendation_agent",
            "message": "" (deixe a mensagem vazia)
            }
        """

        # Incluir as últimas 3 mensagens do usuário com o system prompt
        system_message: MessageDict = {
            'role': 'system', 'content': system_prompt}
        input_messages: List[MessageDict] = [system_message] + messages[-3:]

        # Obter resposta do chatbot
        chatbot_output = get_chatbot_response(
            self.client, self.model_name, input_messages)
        chatbot_output = double_check_json_output(
            self.client, self.model_name, chatbot_output)
        print('\n\tClassification Agent:', chatbot_output)  # debug
        # Pós-processamento
        output = self.postprocess(chatbot_output)
        # Retornar resposta
        return output

    # Método para pós-processamento
    def postprocess(self, output: str) -> MessageDict:
        '''
        Método para pós-processar a resposta do agente de classificação.
        Este método recebe a saída do agente e a formata como um dicionário.

        Parameters
        ----------
        output : str
            Saída do agente de classificação.

        Returns
        -------
        ClassificationAgentResponse
            Resposta do agente de classificação formatada como um dicionário.
        '''
        try:
            # Converter resposta em JSON
            output_dict: ClassificationAgentResponse = json.loads(output)

            # Montar resposta do Classification Agent
            dict_output: MessageDict = {
                'role': 'assistant',
                'content': output_dict['message'],
                'memory': {
                    'agent': 'classification_agent',
                    'classification_decision': output_dict['decision']
                }
            }
            return dict_output

        except json.JSONDecodeError as e:
            raise ValueError(f'Erro ao decodificar JSON: {e}')
