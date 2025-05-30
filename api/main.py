from typing import Annotated
from fastapi import Depends, FastAPI, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from api_util.login import *
import json
from chatbot.agents.guard_agent import GuardAgent
from chatbot.agents.classification_agent import ClassificationAgent

from api_types.message_type import Message
from typing import List

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app.add_middleware(CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/cadastro")
async def cadastrar(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    cadastro = CadastroModel(
        primeiro_nome = body["primeiro_nome"],
        sobrenome = body["sobrenome"],
        data_nascimento=datetime.strptime(body["data_nascimento"], "%Y-%m-%d").date(),
        tipo_cliente=body["tipo_cliente"],
        telefone=body["telefone"],
        email=body["email"],
        senha = body["senha"]
    )
    cadastrado = Cadastro.fazer_cadastro(cadastro)
    if cadastrado is not None:
        return {"message" : "Cadastro feito com sucesso"}
    else:
        return {"message" : "Houve um erro ao realizar o cadastro"}
    return cadastro


@app.post("/login")
async def fazer_login(request : Request):
    request_json = await request.json()
    body = json.loads(request_json["body"])
    login = LoginModel(
        email = body["email"],
        senha = body["senha"]
    )
    token = Login.fazer_login(login)
    if token == None:
        return {"message": "Login inválido"}
    else:
        return {"token" : token}


@app.post("/chatbot")
async def receber_chat():
    # Instanciar agentes
    guard_agent = GuardAgent()
    classification_agent = ClassificationAgent()

    # Lista de mensagens
    messages: List[Message] = []

    # Exibir histórico de mensagens entre o usuário e chatbot
    print("\n\n Mensagens: ***************")
    for message in messages:
        print(f'{message["role"]}: {message["content"]}')

    # Input da entrada do usuário
    prompt = input("Usuário: ")
    # adicionar a lista de msgs
    messages.append({'role': 'user', 'content': prompt})

    # 1º Executar Guard Agent
    guard_agent_response = guard_agent.get_response(messages)
    print("\n\tResposta do Guard Agent:", guard_agent_response)  # debug
    # Se não for permitido, exibir mensagem e reiniciar loop
    memory = guard_agent_response.get('memory', {})
    if memory.get('guard_decision') == 'not allowed':
        messages.append(guard_agent_response)

    # 2º Executar Classification Agent
    classification_agent_response = classification_agent.get_response(
        messages)
    # Agente escolhido
    chosen_agent = classification_agent_response.get(
        'memory', {}).get('classification_decision')
    print("\tResposta do Classification Agent:",  # debug
            classification_agent_response)
    print("\tAgente escolhido:",  # debug
            chosen_agent)

@app.get("/cozinha/pedidos")
async def obter_pedidos(token: Annotated[str, Depends(oauth2_scheme)]):
    pass
