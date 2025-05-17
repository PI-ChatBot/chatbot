# Utilitários pro chatbot

from openai import OpenAI
from api_types import Message
from typing import List


# Função para obter a resposta do chatbot
def get_chatbot_response(client: OpenAI, model_name: str, messages: List[Message], temperature: float = 0):
    '''
    Função para obter a resposta do chatbot.
    Esta função é responsável por interagir com o modelo de linguagem (LLM) através da API da OpenAI. Ela processa as mensagens de entrada e retorna a resposta gerada pelo modelo.

    Parameters
    ----------
    client 
        Um objeto cliente da API OpenAI que gerencia a comunicação com os serviços da OpenAI.
    model_name
        String que especifica qual modelo de IA será utilizado para gerar a resposta.
    messages
        Lista de dicionários onde cada dicionário representa uma mensagem na conversa.
    temperature
        (opcional) Controla a aleatoriedade das responsas geradas. Valores mais baixos (próximos de 0) tornam as respostas mais determinísticas e focadas, enquanto valores mais altos (próximos de 1) tornam as respostas mais variadas e criativas. O valor  padrão é 0.
    '''

    try:
        # Lista de mensagens enviadas pro modelo
        input_messages: List[Message] = []
        for message in messages:
            # Adicionar mensagens do parâmetro a lista de mensagens
            input_messages.append({
                'role': message['role'],
                'content': message['content']
            })

        # Chamar API da OpenAI para obter a resposta do modelo
        response = client.chat.completions.create(
            model=model_name,
            messages=input_messages,  # type: ignore
            temperature=temperature,
            top_p=0.8,
            max_tokens=2000
        ).choices[0].message.content

        # Verificar se resposta está vazia
        if not response or response.strip() == "":
            print("Aviso: API retornou uma resposta vazia.")
            return ""
        
        # Retornar resposta
        return response

    except Exception as e:
        print(f"Erro ao obter a resposta do chatbot: \n{e}")
        return ""  # Retorna uma string vazia em caso de erro
