import uuid
from pydantic import BaseModel
from sqlmodel import Session, select
from passlib.context import CryptContext
import jwt
from datetime import timedelta, timezone, datetime
import dotenv
import os

from api_util.db import engine
from api_util.tables import Funcionario

dotenv.load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class CadastroFuncionarioModel(BaseModel):
    id_restaurante : uuid.UUID
    nome : str
    email : str
    senha : str
    funcao : str

class LoginFuncionarioModel(BaseModel):
    email : str
    senha : str


class CadastroFuncionario:
    @classmethod
    def fazer_cadastro(cls, cadastro: CadastroFuncionarioModel):
        session = Session(engine)
        print(cadastro)
        try:
            print("teste")
            funcionario = Funcionario(
                id_restaurante= cadastro.id_restaurante,
                nome = cadastro.nome,
                email = cadastro.email,
                hash_senha = get_password_hash(cadastro.senha),
                funcao = cadastro.funcao
            )
            session.add(funcionario)
            session.commit()
            return True
        except:
            return None
        finally:
            session.close()


class LoginFuncionario:
    @classmethod
    def fazer_login(cls, login : LoginFuncionarioModel):
        session = Session(engine)
        try:
            statement = select(Funcionario).where(Funcionario.email == login.email)
            funcionario = session.exec(statement).one()
            if verify_password(login.senha, funcionario.hash_senha):
                return (create_access_token(data={
                    "nome" : funcionario.nome,
                    "email" : funcionario.email,
                    "funcao":funcionario.funcao
                }, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)), funcionario.id_restaurante)
        except:
            return (None, None)
        finally:
            session.close()
        return (None, None)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_funcionario(token: str):
    session = Session(engine)
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    email = payload.get("email")
    if email is None:
        return None
    user = session.exec(select(Funcionario).where(Funcionario.email == email)).one()
    if user is None:
        return None
    return user
