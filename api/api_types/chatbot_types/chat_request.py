'''
Tipagem das requisições do chatbot, conforme a especificação do OpenAI API, em formato JSON.
'''

from typing import List, TypedDict

from pydantic import BaseModel

from .message_type import MessageDict, MessageModel

# Dicionário tipado


class ChatRequestDict(TypedDict):
    '''
    Dicionário tipado para requisições de chat.
    '''
    messages: List[MessageDict]

# Modelo de base Pydantic


class ChatRequestModel(BaseModel):
    '''
    Modelo de base para requisições de chat.
    '''
    messages: List[MessageModel]
