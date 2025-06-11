import os
import pathlib
import sys
from typing import Any, Dict

from api_types import agent_types

from chatbot.agents import (  # importação dos agentes
    ClassificationAgent,
    DetailsAgent,
    GuardAgent,
    OrderTakingAgent,
    RecommendationAgent,
)

# Adicionar caminho do projeto ao sys.path
folder_path = pathlib.Path(__file__).parent.resolve()
sys.path.append(os.path.join(folder_path, '../..'))

# Agente de Controle


class AgentController:
    '''
    Agente de Controle responsável por gerenciar os demais agentes do chatbot.
    '''
    # Método construtor

    def __init__(self):
        # Instanciar agentes
        self.guard_agent = GuardAgent()  # guarda
        self.classification_agent = ClassificationAgent()  # classificação
        # ... (RecommendationAgent)
        self.agent_dict: Dict[agent_types, Any] = {  # agentes pós-classificação
            "details_agent": DetailsAgent(),
            # "recommendation_agent": RecommendationAgent(),  # TODO: ajustar depois
            # TODO: add RecommendationAgent como método depois
            "order_taking_agent": OrderTakingAgent()
        }

    # Método para obter resposta do LLM

    def get_response(self, input):
        '''
        Método para obter resposta do LLM.
        Executa os agentes em sequência (Guard Agent, Classification Agent e o agente escolhido).	

        :param input: Dicionário com a entrada do usuário.

        :return: Resposta do agente escolhido.
        '''

        # Extrair input do usuário para ser usado com serverless
        job_input = input['input']
        messages = job_input['messages']        # Executar o Guard Agent
        # 1º Executar Guard Agent
        guard_agent_response = self.guard_agent.get_response(messages)
        # print("\n\tResposta do Guard Agent:", guard_agent_response)  # debug

        # Se não for permitido, retornar mensagem do guard agent
        memory = guard_agent_response.get('memory', {})
        if memory.get('guard_decision') == 'not allowed':
            return guard_agent_response

        # 2º Executar Classification Agent
        classification_agent_response = self.classification_agent.get_response(
            messages)
        # Agente escolhido
        chosen_agent = classification_agent_response.get(
            'memory', {}).get('classification_decision')

        # 3º Executar agente escolhido
        if chosen_agent is None or chosen_agent not in self.agent_dict:
            # Verificar se o agente escolhido é válido
            raise ValueError(f"Agente escolhido inválido: {chosen_agent}")
        agent = self.agent_dict[chosen_agent]

        # Obter resposta do agente
        response = agent.get_response(messages)

        # Retornar mensagem ao usuário
        return response
