from pydantic import BaseModel
from sqlmodel import Session, select
from passlib.context import CryptContext
import jwt
from datetime import date, timedelta, timezone, datetime
import dotenv
import os

from api_util.db import get_session
from api_util.tables import Cliente

dotenv.load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    nome : str
    email : str
    tipo_cliente : str

class LoginModel(BaseModel):
    email : str
    senha : str

class CadastroModel(BaseModel):
    email : str
    senha: str
    primeiro_nome : str
    sobrenome : str
    telefone : str
    tipo_cliente : str
    data_nascimento : date

class Cadastro:
    @classmethod
    def fazer_cadastro(cls, cadastro: CadastroModel):
        session = get_session()
        try:
            if isinstance(session, Session):
                cliente = Cliente(
                nome=cadastro.primeiro_nome + " " + cadastro.sobrenome,
                email=cadastro.email,
                data_nascimento=cadastro.data_nascimento,
                hash_senha=get_password_hash(cadastro.senha),
                tipo_cliente=cadastro.tipo_cliente)
                session.add(cliente)
                session.commit()
        except:
            pass
        finally:
            session.close()


class Login:
    @classmethod
    def fazer_login(cls, login : LoginModel):
        session = get_session()
        try:
            if isinstance(session, Session):
                statement = select(Cliente).where(Cliente.email == login.email)
                cliente = session.exec(statement).one()
                if verify_password(login.senha, cliente.hash_senha):
                    return create_access_token(data={
                        "nome" : cliente.nome,
                        "email" : cliente.email,
                        "tipo_cliente":cliente.tipo_cliente
                    }, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        except:
            return None
        finally:
            session.close()


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

def get_current_user(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    email = payload.get("email")
    if email is None:
        return None
    user = select(Cliente).where(Cliente.email == email)
    if user is None:
        return None
    return user
