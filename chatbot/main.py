from typing import Annotated
from fastapi import Depends, FastAPI, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from api_util.login import *
import json

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
        username = body["username"],
        password = body["password"]
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
        username = body["username"],
        password = body["password"]
    )
    token = Login.fazer_login(login)
    if token == None:
        return {"message": "Login inválido"}
    else:
        return {"token" : token}


@app.post("/chatbot")
async def receber_chat():
    pass

@app.get("/cozinha/pedidos")
async def obter_pedidos(token: Annotated[str, Depends(oauth2_scheme)]):
    pass
