from typing import Literal

agent_literal = Literal[  # Literal com os tipos de agentes
    'guard_agent',
    'classification_agent',
    'details_agent',
    'recommendation_agent',
    'order_taking_agent',
]