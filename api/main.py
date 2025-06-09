from fastapi import FastAPI, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from api_util.login import *
import json
from datetime import datetime
from api_util.pedido import atualizar_status_pedido, obter_pedidos_no_restaurante
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
