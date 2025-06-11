from api_util.funcionario import LoginFuncionario, LoginFuncionarioModel
from fastapi import FastAPI, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from api_util.login import *
import json
from datetime import datetime
from api_util.pedido import atualizar_status_pedido, fazer_pedido, obter_pedidos_no_restaurante
from api_util.pratos import ItemCardapio, criar_prato, obter_pratos_por_restaurante
from api_util.restaurante import obter_restaurante_por_id
from chatbot import AgentController

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app.add_middleware(CORSMiddleware,
                   allow_origins="*",
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],
                   )

# Instanciar Agent Controller globalmente
agent_controller = AgentController()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/cadastro")
async def cadastrar(request: Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    cadastro = CadastroModel(
        primeiro_nome=body["primeiro_nome"],
        sobrenome=body["sobrenome"],
        data_nascimento=datetime.strptime(
            body["data_nascimento"], "%Y-%m-%d").date(),
        tipo_cliente=body["tipo_cliente"],
        telefone=body["telefone"],
        email=body["email"],
        senha=body["senha"]
    )
    cadastrado = Cadastro.fazer_cadastro(cadastro)
    if cadastrado is not None:
        return {"message": "Cadastro feito com sucesso"}
    else:
        return {"message": "Houve um erro ao realizar o cadastro"}


@app.post("/login")
async def fazer_login(request: Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    login = LoginModel(
        email=body["email"],
        senha=body["senha"]
    )
    (token, nome) = Login.fazer_login(login)
    if token == None:
        return {"message": "Login inválido"}
    else:
        return {"token": token, "nome": nome}


@app.post("/chatbot")
async def receber_chat(request: Request):
    '''
    Endpoint principal para o chatbot.
    Recebe mensagens do usuário, executa os agentes e retorna a resposta do chatbot escolhido.
    '''

    request_json = await request.json()

    # Verificar se os dados estão no formato esperado
    if "body" in request_json:
        # Formato serverless (com body como string JSON)
        body = json.loads(request_json["body"])
        chat_request = body["messages"]
    else:
        # Formato direto (dados JSON diretos)
        chat_request = request_json

    try:
        # Verificar se o token é válido
        messages_dict = [
            {'role': msg['role'], 'content': msg['content']}
            for msg in chat_request['messages']
        ]

        #
        input_data = {
            'input': {
                'messages': messages_dict
            }
        }

        # Obter resposta do Agent Controller
        response = agent_controller.get_response(input_data)
        # Se não retornar resposta
        if response is None:
            return {
                "error": "Mensagem não permitida pelo sistema de segurança."
            }

        return {
            "success": True,
            "response": response
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Erro interno do servidor: {str(e)}"
        }

@app.post("/pedido")
async def receber_pedido(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    token_cliente = body["token"]
    itens = body["itens"]

    pedido = fazer_pedido(token_cliente, itens)
    if pedido is not None:
        return {"pedido" : pedido}
    else:
        return {"message" : "erro ao criar o pedido"}



@app.get("/cozinha/pedidos")
async def obter_pedidos(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    token_funcionario = body["token"]

    pedidos = obter_pedidos_no_restaurante(token_funcionario)
    if pedidos is not None:
        return {"pedidos" : list(pedidos)}
    else:
        return {"message : erro ao obter os pedidos"}

@app.post("/cozinha/pedidos")
async def atualizar_pedido(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    token_funcionario = body["token"]
    id_pedido = body["id_pedido"]
    novo_status = body["status"]

    resultado = atualizar_status_pedido(token_funcionario, id_pedido, novo_status)
    if resultado is not None:
        return {"message" : "pedido atualizado com sucesso"}
    else:
        return {"message" : "ocorreu um erro ao alterar o status do pedido"}

@app.post("/cozinha/login")
async def fazer_login_cozinha(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    login = LoginFuncionarioModel(
        email=body["email"],
        senha=body["senha"]
    )
    (token, restaurantId) = LoginFuncionario.fazer_login(login)
    if token == None:
        return {"message": "Login inválido"}
    else:
        return {"token": token, "restaurantId": restaurantId}


# Função utilizada para cadastrar novos funcionários, deve ser usada só pelo admin
# @app.post("/cozinha/cadastro")
# async def cadastrar_funcionarios(request: Request):
#     request_json = await request.json()
#     body = json.loads(request_json["body"])
#     cadastro = CadastroFuncionarioModel(
#         id_restaurante=body["id_restaurante"],
#         nome=body["nome"],
#         email=body["email"],
#         senha=body["senha"],
#         funcao=body["funcao"]
#     )
#     cadastrado = CadastroFuncionario.fazer_cadastro(cadastro)
#     if cadastrado is not None:
#         return {"message": "Cadastro feito com sucesso"}
#     else:
#         return {"message": "Houve um erro ao realizar o cadastro"}

@app.post("/restaurante")
async def obter_restaurante(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    id_restaurante = body["id_restaurante"]
    restaurante = obter_restaurante_por_id(id_restaurante)
    print(restaurante)
    if restaurante is not None:
        return {"restaurante": restaurante}
    else:
        return {"message": "Houve um erro ao obter o restaurante"}

@app.post("/cozinha/pratos")
async def obter_pratos(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    id_restaurante = body["id_restaurante"]
    pratos = obter_pratos_por_restaurante(id_restaurante)
    print(pratos)
    if pratos is not None:
        return {"pratos" : pratos}
    else:
        return {"message" : "Houve um erro ao obter os pratos"}


@app.post("/cozinha/cardapio")
async def criar_pratos_cardapio(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    token_funcionario = body["token"]

    nome = body["nome"]
    preco = body["preco"]
    descricao = body["descricao"]
    categoria = body["categoria"]
    imagem = body["imagem"]
    promocional = body["promocional"]
    item = ItemCardapio(
        nome=nome,
        preco=preco,
        descricao=descricao,
        categoria=categoria,
        imagem=imagem,
        promocional=promocional
    )
    result = criar_prato(token_funcionario, item)
    if result is None:
        return {"message" : "Houve um erro ao criar o prato"}
    else:
        return {"message" : "O prato foi criado"}
