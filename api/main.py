from typing import Annotated
from fastapi import Depends, FastAPI, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from api_util.login import *
import json
from datetime import datetime
from api_types import ChatRequestModel
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
async def receber_chat(chat_request: ChatRequestModel):
    '''
    Endpoint principal para o chatbot.
    Recebe mensagens do usuário, executa os agentes e retorna a resposta do chatbot escolhido.
    '''

    try:
        # Verificar se o token é válido
        messages_dict = [
            {'role': msg.role, 'content': msg.content}
            for msg in chat_request.messages
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
async def obter_pedidos(token: Annotated[str, Depends(oauth2_scheme)]):
    pass
