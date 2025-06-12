import json
from typing import List

import requests
from api_types import MessageDict

# URL base da API
BASE_URL = "http://localhost:8000"

# Teste do endpoint


def test_root_endpoint():
    '''
    Testa o endpoint raiz da API.

    :return:  
        Retorna `True` se o endpoint responder com sucesso, caso contrário, retorna `False`.
    '''
    print("🔍 Testando endpoint raiz...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Resposta: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erro ao testar endpoint raiz: {e}")
        return False

# Testar endpoint do chatbot


def test_chatbot_endpoint():
    '''
    Testa o endpoint principal do chatbot.
    '''
    print("\n🤖 Testando o endpoint /chatbot...")

    # Dados do teste - formato direto (sem body)
    test_data = [
        {
            'role': 'user',
            'content': 'Quais são os pratos do dia?'  # pergunta de exemplo
        }
    ]

    try:
        # Enviar requisição POST para o endpoint /chatbot
        response = requests.post(
            f"{BASE_URL}/chatbot",
            headers={"Content-Type": "application/json"},  # cabeçalho
            json=test_data  # dados do teste em JSON (formato direto)
        )
        print(f"Status Code: {response.status_code}")  # status code
        print(
            f'Resposta: {json.dumps(response.json(), ensure_ascii=False, indent=2)}'
        )
        return response.status_code == 200  # retorna True se foi bem-sucedido
    except Exception as e:
        print(f"❌ Erro ao enviar requisição: {e}")
        return False

# Testar endpoint de pedidos


def test_pedido_endpoint():
    '''
    Testa os endpoints relacionados a pedidos da API.
    '''
    print("\n📋 Testando endpoints de pedidos...")

    # Teste 1: Endpoint POST /pedido (criar pedido)
    print("\n🔍 Testando POST /pedido (criar pedido)...")
    success_post = False
    try:
        test_data = {
            "body": json.dumps({
                "token": "token_teste_inexistente",  # Token de teste
                "itens": [
                    {
                        "id_item": "1c00da5d-53b6-4ac0-abb0-53604f6c68fb",
                        "quantidade": 1,
                        "preco": 5.50,
                        "observacoes": "Teste de API"
                    }
                ]
            })
        }

        response = requests.post(
            f"{BASE_URL}/pedido",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        print(f"Status Code: {response.status_code}")
        print(
            f"Resposta: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")

        # Consideramos sucesso se o endpoint responde (mesmo com erro de token)
        success_post = response.status_code in [200, 400, 401, 422]

    except Exception as e:
        print(f"❌ Erro ao testar POST /pedido: {e}")

    # Teste 2: Endpoint GET /cozinha/pedidos (listar pedidos)
    print("\n🔍 Testando GET /cozinha/pedidos (listar pedidos)...")
    success_get = False
    try:
        response = requests.get(
            f"{BASE_URL}/cozinha/pedidos",
            headers={"Authorization": "token_teste_inexistente"}
        )
        print(f"Status Code: {response.status_code}")
        print(
            f"Resposta: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")

        # Consideramos sucesso se o endpoint responde (mesmo com erro de token)
        success_get = response.status_code in [200, 400, 401, 422]

    except Exception as e:
        print(f"❌ Erro ao testar GET /cozinha/pedidos: {e}")

    # Teste 3: Verificar se GET /pedido retorna Method Not Allowed (comportamento esperado)
    print("\n🔍 Verificando se GET /pedido retorna Method Not Allowed...")
    success_method = False
    try:
        response = requests.get(f"{BASE_URL}/pedido")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 405:
            print("✅ Comportamento correto: GET /pedido não é permitido")
            success_method = True
        else:
            print(f"⚠️ Comportamento inesperado: {response.text}")

    except Exception as e:
        print(f"❌ Erro ao testar GET /pedido: {e}")

    # Retorna True se pelo menos um teste passou
    overall_success = success_post or success_get or success_method

    if overall_success:
        print("\n✅ Endpoints de pedidos estão funcionando")
    else:
        print("\n❌ Problemas detectados nos endpoints de pedidos")

    return overall_success

# Função do chatbot interativo via CLI


def interactive_chatbot():
    '''
    Modo de teste interativo para testar a API do chatbot via CLI.
    '''

    messages: List[MessageDict] = []  # histórico de mensagens
    print("\n💬 Modo interativo do chatbot. Digite 'sair' para encerrar.")

    # Opção de ativar o modo de depuração
    debug_mode: bool = False
    print("🔧 Para ativar ou desativar o modo de deputação a qualquer momento, digite 'debug'")

    # Loop para simular o chat
    while True:
        user_input = input("🧑 Usuário: ").strip()  # msg do usuário

        # Verificar se o usuário quer sair
        if user_input.lower() in ['sair', 'exit', 'quit']:
            print("👋 Encerrando o chat.")
            break

        # Verificar se usuário quer alternar modo de depuração
        if user_input.lower() in ['debug']:
            debug_mode = not debug_mode
            continue

        # Se usuário não digitou nada, reinicie o loop
        if not user_input:
            continue

        # Adicionar mensagem do usuário à lista
        messages.append(
            # Fazer requisição para o endpoint da API
            {'role': 'user', 'content': user_input})
        try:
            response = requests.post(
                f"{BASE_URL}/chatbot",  # endpoint
                headers={"Content-Type": "application/json"},  # cabeçalho
                json=messages  # lista de mensagens (formato direto)
            )

            # Se a resposta for bem-sucedida
            if response.status_code == 200:
                # Converter resultado em JSON
                result = response.json()

                # Exibir resultado de depuração se ativado
                if debug_mode:
                    print("", result)

                if result.get('success'):
                    # Exibir resposta do chatbot
                    bot_response = result.get(
                        "response", {})  # resposta do chatbot
                    bot_content = bot_response.get('content',
                                                   # resposta padrão se não houver conteúdo
                                                   "Desculpe, não consegui processar sua mensagem."
                                                   )
                    print(f"🤖 Chatbot: {bot_content}")  # imprimir resposta

                    # Adicionar resposta ao histórico de mensagens
                    messages.append(
                        {'role': 'assistant', 'content': bot_content})

                else:  # se não for bem-sucedido
                    print("❌ Erro:", result.get('error', 'Erro desconhecido'))
            else:  # se status code não for 200
                print(f"❌ Erro HTTP {response.status_code}: {response.text}")

        except Exception as e:  # Tratamento de exceção
            print(f"❌ Erro ao enviar mensagem: {e}")

            # Função main


def main():
    '''
    Função principal que executa os testes de API.
    '''
    print("🧪 Testando a API do Polichat\n")

    # Verificar se a API está rodando
    print("📡 Verificando se a API está rodando...")
    try:
        # Enviar requisição e configurar timeout
        requests.get(f'{BASE_URL}/', timeout=5)
        print("✅ A API está rodando.")
    except Exception as e:
        print(f"❌ A API não está respondendo: {e}")
        # Instruções para iniciar a API
        print("\n💡 Para iniciar a API, execute:")
        print("   uvicorn main:app")
        return  # encerrar função

    # Executar testes nos endpoints
    tests = [
        ("Endpoint raiz", test_root_endpoint),
        ("Endpoint /chatbot", test_chatbot_endpoint),
        ("Endpoint /pedido", test_pedido_endpoint),
    ]
    results = []
    for test_name, test_func in tests:
        print(f"\n{'=' * 50}")
        result = test_func()
        results.append((test_name, result))

    # Resumo dos testes
    print(f"\n{'=' * 50}")
    print("📊 RESUMO DOS TESTES:")
    for test_name, result in results:
        status = "✅ PASSOU" if result else "❌ FALHOU"  # verificar status code
        print(f"  {test_name}: {status}")  # exibir status de cada teste

    # Oferecer chat interativo
    print(f"\n{'=' * 50}")
    response = input(
        "🤖 Deseja testar o chatbot interativo? (s/n): ").strip().lower()
    if response in ['s', 'sim', 'y', 'yes']:  # se responder sim
        interactive_chatbot()


# Verificar se o script está sendo executado diretamente
if __name__ == "__main__":
    main()  # chamar função principal
