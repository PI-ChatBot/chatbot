# Código para testar o chatbot via terminal

import os
import pathlib
import sys
from typing import List

from agents import (  # Importação dos agentes
    GuardAgent
)
from api_types import Message

# Adicionar caminho do projeto ao sys.path
folder_path = pathlib.Path(__file__).resolve()
sys.path.append(os.path.join(folder_path, "../.."))

# Função principal


def main():
    # Instanciar agentes
    guard_agent = GuardAgent()

    # Lista de mensagens
    messages: List[Message] = []
    # Interações com o usuário
    while True:
        # Limpar o processamento dos agentes (exibir somente as mensagens)
        os.system('cls' if os.name == 'nt' else 'clear')

        # Exibir mensagens anteriores
        print("\n\n Mensagens: ***************")
        for message in messages:
            print(f'{message["role"]}: {message['content']}')

        # Input da entrada do usuário
        prompt = input("Usuário: ")
        # adicionar a lista de msgs
        messages.append({'role': 'user', 'content': prompt})

        # 1º Executar Guard Agent
        guard_agent_response = guard_agent.get_response(messages)
        # Se não for permitido, exibir mensagem e reiniciar loop
        memory = guard_agent_response.get('memory', {})
        if memory.get('guard_decision') == 'not allowed':
            messages.append(guard_agent_response)
            continue


# Garantir que o script seja executado diretamente (e não importado como um módulo)
if __name__ == "__main__":
    main()
