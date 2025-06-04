import json
import os
from copy import deepcopy
from typing import List, Literal, TypedDict

import dotenv
from api_types import MessageDict, guard_decisions
from openai import OpenAI

from .utils import double_check_json_output, get_chatbot_response

dotenv.load_dotenv()  # carregar variáveis de ambiente


class GuardAgentResponse(TypedDict):  # Tipagem da resposta do Guard Agent
    '''
    Estrutura de dados para a resposta do agente de guarda.
    Esta estrutura é usada para definir o formato da resposta que o agente de guarda deve retornar.
    '''
    chain_of_thought: str  # cadeia de pensamento
    decision: guard_decisions  # decisão
    message: Literal['Desculpe, não posso ajudar com isso. Posso te ajudar com seu pedido?', ""]


# Classe do agente de guarda


class GuardAgent:
    '''
    Agente de guarda para o chatbot.
    Este agente é responsável por verificar se a solicitação do usuário é válida para o contexto do aplicativo, ou seja, .
    Se a solicitação do usuário for válida, o agente de guarda permite que a solicitação prossiga pro próximo agente. Caso contrário, ele rejeita a solicitação e exibe uma mensagem pro usuário.

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
        messages = deepcopy(messages)  # evitar efeitos colaterais

        # System prompt do Guard Agent
        system_prompt = """
            Você é um assistente de IA prestativo para um aplicativo de chatbot dos restaurantes e lanchonetes do Colégio Poliedro.
            Sua tarefa é determinar se o usuário está perguntando ou pedindo algo relevante para os serviços de alimentação oferecidos pelo restaurante/lanchonete do colégio.

            O usuário está autorizado a:
            1. Fazer perguntas sobre os restaurantes ou lanchonetes do Colégio Poliedro, como localização dentro da escola, horário de funcionamento, formas de pagamento e funcionamento geral.
            2. Fazer perguntas sobre os itens do cardápio, incluindo ingredientes, detalhes nutricionais, restrições alimentares e preços.
            3. Realizar pedidos de comida ou bebida.
            4. Pedir sugestões ou recomendações de refeições ou lanches disponíveis.
            5. Perguntar sobre promoções ou combos disponíveis atualmente para membros da comunidade (alunos, professores, funcionários, etc).

            O usuário não está autorizado a:
            1. Fazer perguntas que não estejam relacionadas aos restaurantes ou lanchonetes da escola.
            2. Fazer perguntas sobre os funcionários (como nomes, escalas ou cargos) ou sobre como preparar ou cozinhar os itens do cardápio.

            Sua saída deve estar em um formato JSON estruturado como este. Cada chave é uma string e cada valor é uma string. Certifique-se de seguir o formato JSON exatamente como mostrado abaixo:
            {
                "chain_of_thought": "Revise cada um dos pontos acima e veja se a mensagem se enquadra nesse ponto ou não. Em seguida, escreva algumas reflexões sobre qual ponto essa contribuição é relevante.",
                "decision": "allowed" or "not allowed",
                "message": deixe a mensagem vazia (empty strings) se "decision" for "allowed", caso contrário, escreva de forma educada e breve, entre aspas duplas ("Desculpa, não posso...") que não pode ajudar o usuário com isso pois sua função é auxiliar o usuário a fazer um pedido ou fornecer informações sobre o restaurante do colégio. Se o usuário fizer uma saudação, você pode responder com algo como "Olá, como posso ajudar com seu pedido? Gostaria de saber o cardápio do dia?".
            }
            """

        # Incluir as últimas 3 mensagens anteriores
        input_messages: List[MessageDict] = [
            # type: ignore
            {'role': 'system', 'content': system_prompt}] + messages[-3:]

        # Obter resposta do chatbot
        chatbot_output = get_chatbot_response(
            self.client, self.model_name, input_messages)
        chatbot_output = double_check_json_output(
            self.client, self.model_name, chatbot_output)
        # Pós-processamento
        output: MessageDict = self.postprocess(chatbot_output)
        # Retornar resposta
        return output

    # Método para pós-processar a resposta do agente
    def postprocess(self, output: str) -> MessageDict:
        '''
        Método para pós-processar a resposta do agente de guarda.
        Este método é responsável por converter a resposta do agente de guarda em um formato JSON estruturado e garantir que a resposta esteja no formato correto.

        Parameters
        ----------
        output : str
            Resposta do agente de guarda.

        Returns
        -------
        GuardAgentResponse
            Resposta do agente de guarda em formato JSON estruturado.
        '''
        # Converter resposta em JSON
        try:
            output_dict: GuardAgentResponse = json.loads(output)

            # Montar resposta do Guard Agent
            dict_output: MessageDict = {
                'role': 'assistant',
                'content': output_dict['message'],
                'memory': {
                    'agent': 'guard_agent',
                    'guard_decision': output_dict['decision']
                }
            }
            return dict_output

        except json.JSONDecodeError as e:
            raise ValueError(f"Erro ao decodificar JSON: {e}")
