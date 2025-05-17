# Utilitários pro chatbot

from openai import OpenAI
from api_types import Message
from typing import List


# Função para obter a resposta do chatbot
def get_chatbot_response(client: OpenAI, model_name: str, messages: List[Message], temperature: float = 0) -> str:
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

# Verificação dupla do JSON


def double_check_json_output(client: OpenAI, model_name: str, json_string: str) -> str:
    '''
    Função para verificar e corrigir um JSON string.

    Parameters
    ----------
    client : OpenAI
        Cliente da API OpenAI usado pra interagir com o modelo de linguagem.
    model_name : str
        Nome do modelo de linguagem usado pra gerar respostas.
    json_string : str
        String JSON a ser verificada e corrigida.
    '''

    # Verificar se json_string está vazio ou é nulo
    if not json_string or json_string.strip() == "":
        print("Aviso: json_string está vazio ou nulo.")
        return ""

    # Prompt
    prompt = f"""
        You will check this json string and correct any mistakes that will make it invalid. Then you will return the corrected json string. Nothing else. 
        If the Json is correct just return it.

        If there is any text before order after the json string, remove it.
        Do NOT return a single letter outside of the json string.
        Make sure that each key iss enclosed in double quotes.
        The first thing you write should be open curly brace of the json and the last letter you write should be the closing curly brace of the json.

        You should check the json string for the following text between triple backticks:
        ```
        {json_string}
        ```
    """

    # Usar LLM para corrigir o JSON
    messages: List[Message] = [{'role': 'user', 'content': prompt}]
    response = get_chatbot_response(client, model_name, messages)

    # Se a resposta do LLM estiver vazia, mantenha o JSON original
    if not response or response.strip() == "":
        print("Aviso: LLM do verificador do JSON retornou uma resposta vazia.")
        response = json_string

    # Remover backticks (códigos no markdown)
    response = response.replace("`", "")

    # Verificar se a resposta está vazia
    if not response or response.strip() == "":
        print("Aviso: LLM do verificador do JSON retornou uma resposta vazia.")
        return ""

    return response
