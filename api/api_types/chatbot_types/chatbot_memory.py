'''
Tipagem da memória do chatbot.
'''

from typing import TypedDict
from typing_extensions import NotRequired
from .agent_literals import agent_types, guard_decisions
from .order_agent_type import OrderTakingAgentResponse

# Dicionário tipado


class ChatbotMemory(TypedDict):
    '''
    Estrutura de dados para a memória do chatbot.
    Esta estrutura é usada para armazenar informações relevantes sobre o agente utilizado e outros dados que podem ser necessários durante a conversa.

    Attributes
    ----------
    agent: agent_literal
        O agente utilizado no momento. Este campo é importante para manter o contexto da conversa e garantir que o modelo de linguagem tenha acesso às informações corretas.

    guard_decision
    '''
    agent: agent_types  # Agente usado

    # Guard Agent
    # Decisão do Guard Agent
    guard_decision: NotRequired[guard_decisions]

    # Recommendation Agent
    # Decisão do Recommendation Agent
    classification_decision: NotRequired[agent_types]

# Memória que herda memória dos chatbots


class PartialMemory(ChatbotMemory, OrderTakingAgentResponse, total=False):
    '''
    Memória parcial do chatbot que herda a memória do agente de pedidos.
    Esta estrutura é usada para armazenar informações adicionais que podem ser relevantes para o agente de pedidos, como o número do passo atual e o pedido em andamento.

    Attributes
    ----------
    step_number: int
        Número do passo atual no processo de pedidos.
    order: OrderTakingAgentResponse
        Pedido atual em andamento.
    '''
    pass
