'''
Literais para os agentes do chatbot.
'''

from typing import Literal

# Literal com os tipos de agentes
agent_types = Literal[
    'guard_agent',
    'classification_agent',
    'details_agent',
    'recommendation_agent',
    'order_taking_agent',
]

# Literal de decisão do Guard Agent
guard_decisions = Literal['allowed', 'not allowed']
