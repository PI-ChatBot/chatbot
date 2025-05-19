# Código para testar o chatbot via terminal

import os
import sys
from typing import List

# Adicionar caminho do projeto ao sys.path
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, "../.."))
api_dir = os.path.abspath(os.path.join(script_dir, ".."))

# Certifique-se de que os caminhos não estejam duplicados
if project_root not in sys.path:
    sys.path.insert(0, project_root)
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

# print(f"Caminhos adicionados ao sys.path: {project_root}, {api_dir}")

# Importações após adicionar caminhos ao sys.path
# fmt: off
# noqa: E402
from agents import GuardAgent  # noqa: E402
from api_types import Message  # noqa: E402
# fmt: on

# Função principal


def main():
    # Instanciar agentes
    guard_agent = GuardAgent()

    # Lista de mensagens
    messages: List[Message] = []
    # Interações com o usuário
    while True:
        # Limpar o processamento dos agentes (exibir somente as mensagens)
        # os.system('cls' if os.name == 'nt' else 'clear')

        # Exibir histórico de mensagens entre o usuário e chatbot
        print("\n\n Mensagens: ***************")
        for message in messages:
            print(f'{message["role"]}: {message["content"]}')

        # Input da entrada do usuário
        prompt = input("Usuário: ")
        # adicionar a lista de msgs
        messages.append({'role': 'user', 'content': prompt})

        # 1º Executar Guard Agent
        guard_agent_response = guard_agent.get_response(messages)
        print("Resposta do Guard Agent:", guard_agent_response)  # debug
        # Se não for permitido, exibir mensagem e reiniciar loop
        memory = guard_agent_response.get('memory', {})
        if memory.get('guard_decision') == 'not allowed':
            messages.append(guard_agent_response)
            continue

        # 2º Executar Classification Agent
        print('Próxima etapa: Classification Agent')


# Garantir que o script seja executado diretamente (e não importado como um módulo)
if __name__ == "__main__":
    main()
