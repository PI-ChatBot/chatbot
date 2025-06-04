'''
Tipagem da memória do chatbot.
'''

from typing import TypedDict
from typing_extensions import NotRequired
from .agent_literals import agent_types, guard_decisions

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
