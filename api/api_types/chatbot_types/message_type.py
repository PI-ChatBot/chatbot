'''
Tipagem das mensagens do chatbot, conforme a especificação do OpenAI API.
'''

from typing import Optional, TypedDict

from pydantic import BaseModel
from typing_extensions import NotRequired

from .chatbot_memory import ChatbotMemory, PartialMemory
from .message_literals import message_role

# Dicionário tipado


class MessageDict(TypedDict):
    """
    Dicionário tipado para mensagens do chatbot.

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
    role: message_role
    # Conteúdo da mensagem
    content: str
    # Memória do chatbot (opcional)
    memory: NotRequired[PartialMemory]

# Base Model


class MessageModel(BaseModel):
    """
    Modelo base para mensagens do chatbot.

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
    role: message_role
    # Conteúdo da mensagem
    content: str
    # Memória do chatbot (opcional)
    memory: Optional[ChatbotMemory] = None
