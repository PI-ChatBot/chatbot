from pydantic import BaseModel

class LoginModel(BaseModel):
    username : str
    password : str

class CadastroModel(BaseModel):
    username : str
    password: str

class Cadastro:
    @classmethod
    def fazer_cadastro(cls, cadastro: CadastroModel):
        pass

class Login:
    @classmethod
    def fazer_login(cls, login : LoginModel):
        pass
