# Modelo de dados das mensagens

from typing import TypedDict, Literal

MessageRole = Literal['user', 'assistant', 'system']  # Papéis possíveis


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
    """
    # Papel da mensagem
    role: MessageRole
    # Conteúdo da mensagem
    content: str
