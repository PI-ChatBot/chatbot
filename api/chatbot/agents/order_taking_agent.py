# Agente de pedidos

import json
import os
from copy import deepcopy
from typing import List

import requests
from api_types import MessageDict, OrderTakingAgentResponse
from dotenv import load_dotenv
from openai import OpenAI

from .utils import double_check_json_output, get_chatbot_response

load_dotenv()  # variáveis de ambiente


# Classe do agente de pedidos


class OrderTakingAgent:
    '''
    Agente de pedidos do chatbot.

    Este agente é responsável por gerenciar o processo de pedidos no restaurante do Colégio Poliedro.
    '''
    # Método construtor

    def __init__(self):
        # Cliente OpenAI
        self.client = OpenAI(
            api_key=os.getenv("CHATBOT_API_KEY"),
            base_url=os.getenv("CHATBOT_URL")
        )
        # Modelo de LLM
        self.model_name: str = os.getenv("MODEL_NAME", "")        # Agente de recomendação
        # TODO: Implementar agente de recomendação

    # Obter resposta
    def get_response(self, messages: List[MessageDict]) -> MessageDict:
        '''
        Obtém a resposta do agente de pedidos.

        :param messages: Lista de mensagens entre o usuário e o chatbot.
        '''
        messages = deepcopy(messages)  # Evitar efeitos colaterais

        # Menu do restaurante - Obter via API
        id_restaurante = "44c57a5e-ced2-4938-ba1d-108a60a60ea1"  # ID padrão da Cafeteria Nova Geração
        cardapio = self.obter_cardapio_restaurante(id_restaurante)

        # System prompt
        system_prompt = f"""
            Você é um agente de pedidos de um chatbot de restaurante do Colégio Poliedro. Sua tarefa é ajudar os clientes (alunos, professores, funcionários ou visitantes da escola) a fazer pedidos de forma eficiente e precisa. Você deve seguir as seguintes diretrizes:

            Aqui está o cardápio deste restaurante:
            {cardapio}

              """

        system_prompt += """
            Coisas que você NÃO DEVE FAZER:
            * NÃO pergunte como pagar em dinheiro ou cartão.

            Sua tarefa é a seguinte:
            1. Anotar o pedido do usuário.
            2. Validar se todos os itens estão no cardápio.
            3. Se algum item não estiver no cardápio, informe o usuário e repita o pedido válido restante.
            4. Pergunte se ele precisa de mais alguma coisa.
            5. Se precisar, repita a partir do passo 3.
            6. Se ele não quiser mais nada, usando o objeto "order" que está no output, certifique-se de abordar os três pontos:
                1. Liste todos os itens e seus preços.
                2. Calcule o total.
                3. Agradeça ao usuário pelo pedido e encerre a conversa sem mais perguntas.

            A mensagem do usuário conterá uma seção chamada memória. Esta seção conterá o seguinte:
                "order"
                "step number"
            Por favor, utilize essas informações para determinar o próximo passo no processo.

            Produza o seguinte output sem quaisquer adições, nem uma única letra fora da estrutura abaixo.
            Seu output deve estar em um formato JSON estruturado como este. Cada chave é uma string e cada valor é uma string. Certifique-se de seguir o formato exatamente:
            {
            "cadeia_de_pensamento": Escreva seu raciocínio crítico sobre qual é o número máximo de tarefa em que o usuário está agora. Em seguida, escreva seu raciocínio crítico sobre a entrada do usuário e sua relação com o processo da cafeteria. Depois, escreva seu raciocínio sobre como você deve responder no parâmetro resposta, levando em consideração a seção Coisas que você NÃO DEVE FAZER e focando nas coisas que você deve fazer.
            "etapa": Determine em qual tarefa você está com base na conversa.
            "pedido": isso será uma lista de JSONs como está [{"item": coloque o nome do item, "quantidade": coloque o número que o usuário deseja deste item, "preco": coloque o preço total do item, "preco_especial": coloque o preço especial do item (se houver)}]. Se o usuário não quiser mais nada, deixe a lista vazia.
            "resposta": escreva uma resposta para o usuário.
            }
        """

        # Histórico do status do pedido
        # Se já houve recomendações antes, não perguntar novamente
        status_ultimo_pedido_recebido = ""
        recomendacao_solicitada_antes = False
        pedido = []
        etapa: int = 1
        # Verificar se há mensagens anteriores
        for message_index in range(len(messages) - 1, 0, -1):
            message = messages[message_index]

            # Obter o nome do agente
            # 1- Buscar a memória e retornar um dicionário
            # 2- Buscar a chave 'agent' no dicionário e retornar o valor
            agent_name = message.get('memory', {}).get('agent', '')

            # Verificar se o nome do agente é 'order_taking_agent'
            if message["role"] == 'assistant' and agent_name == 'order_taking_agent':
                # Extrair número da etapa
                etapa = message.get('memory', {}).get('etapa', 1)
                # Último status do pedido
                pedido = message.get('memory', {}).get('pedido', [])
                # Verificar se a chave 'recomendacao_solicitada_antes' está presente
                if 'recomendacao_solicitada_antes' in message.get('memory', {}):
                    recomendacao_solicitada_antes = message.get(
                        'memory', {}).get('recomendacao_solicitada_antes', False)
                # Último status do pedido recebido
                status_ultimo_pedido_recebido = f"""
                    etapa: {etapa}
                    pedido: {pedido}
                """
        # Adicionar último status do pedido ao histórico de mensagens
        messages[-1]['content'] = status_ultimo_pedido_recebido + \
            "\n" + messages[-1]['content']

        # Mensagens pro LLM
        input_messages: List[MessageDict] = [
            {'role': 'system', 'content': system_prompt}] + messages  # type: ignore

        # Obter resposta do LLM
        try:
            chatbot_response = get_chatbot_response(
                self.client, self.model_name, input_messages
            )

            # Se retornar resposta vazia
            if not chatbot_response or chatbot_response.strip() == "":
                raise ValueError("Resposta do agente de pedidos está vazia.")

            # Verificação do JSON
            chatbot_response = double_check_json_output(
                self.client, self.model_name, chatbot_response
            )

            # Pós-processamento
            output = self.postprocess(chatbot_response)
        except Exception as e:
            # Se ocorrer um erro, retornar mensagem de erro
            output: MessageDict = {
                'role': 'assistant',
                'content': f"Erro ao processar o pedido: {str(e)}",
                'memory': {
                    'agent': 'order_taking_agent',
                    'etapa': etapa,
                    'pedido': pedido,
                    'recomendacao_solicitada_antes': recomendacao_solicitada_antes,
                    'cadeia_de_pensamento': '',
                    'resposta': f"Desculpe, ocorreu um erro ao processar seu pedido: {str(e)}"
                }
            }

        # Retorno
        return output

    # Resposta padrão do agente de pedidos
    def criar_output_padrao(self, message: str) -> MessageDict:
        '''
        Cria uma resposta padrão do agente de pedidos.

        :param message: Mensagem a ser retornada.
        :return: Dicionário com a resposta padrão.
        '''
        return {
            'role': 'assistant',
            'content': message.strip(),
            'memory': {
                'agent': 'order_taking_agent',
                'etapa': 1,
                'pedido': [],
                'recomendacao_solicitada_antes': False,
                'cadeia_de_pensamento': '',
                'resposta': message.strip()
            }
        }

    # Pós-processamento
    def postprocess(self, output: str, recomendacao_solicitada_antes: bool = False) -> MessageDict:
        '''
        Pós-processa a resposta do agente de pedidos.

        :param output: String da resposta do LLM.
        :param recomendacao_solicitada_antes: Indica se a recomendação foi solicitada antes.
        :return: Dicionário com a resposta pós-processada.
        '''
        try:
            # Tentar converter para JSON
            output_dict: OrderTakingAgentResponse = json.loads(output.strip())

            # Verificação adicional das chaves necessárias
            required_keys = ['pedido', 'resposta', 'etapa']
            for key in required_keys:
                if key not in output_dict:
                    return self.criar_output_padrao("Desculpe, não consegui processar seu pedido. Por favor, tente novamente.")

            # Processamento do pedido
            pedido = output_dict.get('pedido', [])
            if isinstance(pedido, str):  # Verificar se é uma string
                try:
                    output_dict['pedido'] = json.loads(
                        pedido) if pedido.strip() else []
                except json.JSONDecodeError:
                    output_dict['pedido'] = []
                    raise ValueError("Pedido inválido formatado como string.")

            # Obter resposta do agente
            response = output_dict.get('resposta', '').strip()

        except json.JSONDecodeError:
            return self.criar_output_padrao(
                "Desculpe, ocorreu um erro ao processar seu pedido. Por favor, tente novamente."
            )

        # Retorno
        return {
            'role': 'assistant',
            'content': response,
            'memory': {
                'agent': 'order_taking_agent',
                'etapa': int(output_dict.get('etapa', 1)),
                'recomendacao_solicitada_antes': recomendacao_solicitada_antes,
            }
        }

    def obter_cardapio_restaurante(self, id_restaurante: str, api_url: str = "http://localhost:8000") -> str:
        """
        Obtém o cardápio do restaurante via API e formata como string.
        
        :param id_restaurante: ID do restaurante
        :param api_url: URL base da API (padrão: localhost:8000)
        :return: String formatada com o cardápio
        """
        try:
            # Dados para a requisição
            payload = {
                "body": json.dumps({
                    "id_restaurante": id_restaurante
                })
            }
            
            # Headers para a requisição
            headers = {
                "Content-Type": "application/json"
            }
            
            # Fazer requisição POST para o endpoint
            response = requests.post(
                f"{api_url}/cozinha/pratos",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            # Verificar se a requisição foi bem-sucedida
            response.raise_for_status()
            
            # Extrair dados da resposta
            data = response.json()
            
            if "pratos" not in data:
                return "❌ Erro: Não foi possível obter o cardápio do restaurante."
            
            pratos = data["pratos"]
            
            if not pratos:
                return "ℹ️ Este restaurante não possui produtos cadastrados no momento."
            
            # Formatar cardápio
            cardapio_formatado = "📋 **CARDÁPIO DO RESTAURANTE**\n\n"
            
            # Agrupar por categoria
            categorias = {}
            for prato in pratos:
                categoria = prato.get('categoria', 'Sem categoria')
                if categoria not in categorias:
                    categorias[categoria] = []
                categorias[categoria].append(prato)
            
            # Formatar cada categoria
            for categoria, itens in categorias.items():
                cardapio_formatado += f"🍽️ **{categoria.upper()}**\n"
                cardapio_formatado += "-" * 50 + "\n"
                
                for item in itens:
                    nome = item.get('nome', 'Nome não disponível')
                    id_item = item.get('id_item', 'ID não disponível')
                    preco = item.get('preco', 'Preço não disponível')
                    preco_especial = item.get('preco_especial', None)
                    descricao = item.get('descricao', '')
                    estoque = item.get('estoque', 0)
                    avaliacao = item.get('avaliacao', None)
                    
                    # Linha principal do produto
                    linha_produto = f"{nome} | ID: {id_item} | Preço: R$ {preco}"
                    
                    # Adicionar preço especial se existir
                    if preco_especial and preco_especial != preco:
                        linha_produto += f" | Preço especial (para alunos, professores e membros do Colégio Poliedro): R$ {preco_especial}"
                    
                    cardapio_formatado += linha_produto + "\n"
                    
                    # Adicionar descrição se existir
                    if descricao:
                        cardapio_formatado += f"   📝 {descricao}\n"
                    
                    # Adicionar informações extras
                    info_extra = []
                    if estoque is not None:
                        if estoque > 0:
                            info_extra.append(f"✅ Em estoque ({estoque} unidades)")
                        else:
                            info_extra.append("❌ Sem estoque")
                    
                    if avaliacao is not None:
                        info_extra.append(f"⭐ Avaliação: {avaliacao:.1f}/5")
                    
                    if info_extra:
                        cardapio_formatado += f"   {' | '.join(info_extra)}\n"
                    
                    cardapio_formatado += "\n"
                
                cardapio_formatado += "\n"
            
            # Adicionar informações finais
            total_produtos = len(pratos)
            cardapio_formatado += f"📊 **Total de produtos disponíveis: {total_produtos}**\n"
            cardapio_formatado += "💡 **Dica:** Mencione o nome ou ID do produto para fazer seu pedido!\n"
            
            return cardapio_formatado.strip()
            
        except requests.exceptions.RequestException as e:
            return f"❌ Erro de conexão com a API: {str(e)}"
        except json.JSONDecodeError as e:
            return f"❌ Erro ao processar resposta da API: {str(e)}"
        except Exception as e:
            return f"❌ Erro inesperado ao obter cardápio: {str(e)}"
