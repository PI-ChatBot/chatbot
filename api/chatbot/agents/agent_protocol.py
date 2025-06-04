from typing import Protocol, List
from api_types import MessageDict


class AgentProtocol(Protocol):
    # Método para obter resposta do agente
    def get_response(self, messages: List[MessageDict]) -> MessageDict:
        '''
        Modelo de método para obter resposta do agente.
        Este método deve ser implementado por todos os agentes que seguem este protocolo.
        '''
        ...
