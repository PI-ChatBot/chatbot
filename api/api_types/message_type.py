# Modelo de dados das mensagens
from typing import Literal, TypedDict

from typing_extensions import NotRequired
from api_types import agent_literal, guard_decision_literal

MessageRole = Literal['user', 'assistant', 'system']  # Papéis possíveis


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
    agent: agent_literal  # Agente usado

    # Guard Agent
    # Decisão do Guard Agent
    guard_decision: NotRequired[guard_decision_literal]


class Message(TypedDict):  # Dicionário tipado
    """
    Tipo de dados para mensagens do chatbot.
    Esta estrutura de dicionário é utilizada para definir o formato das mensagens que serão trocadas entre o usuário e o modelo de linguagem.

    Attributes
    ----------
    role: MessageRole
        Define a função da mensagem no contexto da conversa. Pode assumir três valores:
        - `'user'`: Mensagem enviada pelo usuário do aplicativo.
        - `'system'`: Mensagem de configuração do sistema (system prompt) que define o comportamento do chatbot e aplica regras, como saída em JSON.
        - `'assistant'`: Mensagem gerada pelo chatbot em respostas anteriores, que pode ser utilizada como contexto para novas mensagens.
    content: str
        Conteúdo textual da mensagem. Contém o texto que será processado pelo modelo de linguagem. 
        O uso do conteúdo depende do papel (`role`) da mensagem:
        - Para mensagens do usuário (`'user'`), contém a pergunta ou solicitação do usuário.
        - Para mensagens do sistema (`'system'`), contém instruções ou regras que o modelo deve seguir.
        - Para mensagens do assistente (`'assistant'`), contém a resposta gerada pelo modelo em interações anteriores.
    memory: ChatbotMemory
        Memória do chatbot, que armazena informações sobre o agente utilizado e outros dados relevantes para a conversa.
        A memória é utilizada para manter o contexto da conversa e garantir que o modelo de linguagem tenha acesso às informações necessárias para gerar respostas coerentes e relevantes.
    """
    # Papel da mensagem
    role: MessageRole
    # Conteúdo da mensagem
    content: str
    # Memória do chatbot
    memory: NotRequired[ChatbotMemory]
