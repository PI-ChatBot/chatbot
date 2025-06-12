import datetime
import decimal
from typing import Annotated
import uuid
from pydantic.functional_validators import BeforeValidator
from sqlmodel import Field, SQLModel
from datetime import time


class Unidade(SQLModel, table=True):
    # metadata = MetaData(schema="local")
    id_unidade : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(unique=True, max_length=100)
    endereco : str = Field(unique=True, max_length=200)


class Restaurante(SQLModel, table=True):
    # metadata = MetaData(schema="local")
    id_restaurante : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_unidade : uuid.UUID = Field(foreign_key="unidade.id_unidade")
    nome : str = Field(unique=True, max_length=100)
    localizacao : str = Field(unique=True, max_length=70)

class Administrador(SQLModel, table=True):
    # metadata = MetaData(schema="usuario")
    id_administrador :uuid.UUID = Field(default_factory=uuid.uuid4, primary_key = True)
    nome : str = Field(max_length=100)
    email : str = Field(unique=True, max_length=255)
    hash_senha : str = Field(min_length=60, max_length=60)
    funcao :str = Field(max_length=60)
    ativo : bool = Field(default=True)


class UnidadeAdministrador(SQLModel, table=True):
    __tablename__ :str = "unidade_administrador"
    # metadata = MetaData(schema="local")
    id_unidade : uuid.UUID = Field(foreign_key="unidade.id_unidade", primary_key=True)
    id_administrador : uuid.UUID = Field(foreign_key="unidade.id_unidade", primary_key=True)

class HorarioFuncionamento(SQLModel, table=True):
    __tablename__ : str = "horario_funcionamento"
    # metadata = MetaData(schema="info")
    id_horario : uuid.UUID = Field(default_factory = uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    dia_semana : Annotated[int, BeforeValidator(lambda value: value >=0 and value < 6)] = Field()
    hora_abertura : time = Field()
    hora_fechamento : time = Field()


class Telefone(SQLModel, table=True):
    # metadata = MetaData(schema="info")
    id_telefone : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    tipo : str = Field(max_length=10)
    numero : str = Field(max_length=20)
    whatsapp : bool = Field(default=False)

class Categoria(SQLModel, table=True):
    # metadata = MetaData(schema="cardapio")
    id_categoria : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(max_length=100)
    icone : str | None = Field(default= None, max_length=255)

class Item(SQLModel, table=True):
    # metadata = MetaData(schema="cardapio")
    id_item :uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    id_categoria : uuid.UUID = Field(foreign_key = "categoria.id_categoria")
    nome : str = Field(max_length=100)
    descricao : str = Field()
    estoque : Annotated[int, BeforeValidator(lambda e : e >=0)]
    preco : Annotated[decimal.Decimal, BeforeValidator(lambda p : p >=0)] = Field(max_digits=10, decimal_places=2)
    preco_especial : Annotated[decimal.Decimal, BeforeValidator(lambda p : p >=0)] = Field(max_digits=10, decimal_places=2)
    imagem : str | None = Field(default = None, max_length=255)

class Ingrediente(SQLModel, table = True):
    # metadata = MetaData(schema="cardapio")
    id_ingrediente : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(max_length = 100)
    imagem : str | None = Field(default = None,max_length = 255)

class ItemIngrediente(SQLModel, table = True):
    __tablename__ : str = "item_ingrediente"
    # metadata = MetaData(schema="cardapio")
    id_item : uuid.UUID = Field(foreign_key="item.id_item", primary_key=True)
    id_ingrediente : uuid.UUID = Field(foreign_key = "ingrediente.id_ingrediente", primary_key=True)
    papel : str = Field(max_length=50)

class ItemComposicao(SQLModel, table = True):
    __tablename__ : str = "item_composicao"
    # metadata = MetaData(schema="cardapio")
    id_item : uuid.UUID = Field(foreign_key= "item.id_item", primary_key=True)
    id_item_composto : uuid.UUID = Field(foreign_key="item.id_item", primary_key=True)
    tipo_composicao : str = Field(max_length = 25)
    quantidade : Annotated[int, BeforeValidator(lambda q : q >=0)]

class RestricaoAlimentar(SQLModel, table = True):
    __tablename__ : str = "restricao_alimentar"
    # metadata = MetaData(schema="restricao")
    id_restricao : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key = True)
    nome : str = Field(max_length = 100, unique=True)
    icone : str = Field(max_length=255, default=None)

class RestricaoAlimentarIngrediente(SQLModel, table = True):
    __tablename__ : str = "restricao_alimentar_ingrediente"
    # metadata = MetaData(schema="restricao")
    id_restricao : uuid.UUID = Field(foreign_key="restricao_alimentar.id_restricao", primary_key = True)
    id_ingrediente : uuid.UUID = Field(foreign_key="ingrediente.id_ingrediente", primary_key = True)

class Funcionario(SQLModel, table=True):
    # metadata = MetaData(schema="usuario")
    id_funcionario : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key= True)
    id_restaurante : uuid.UUID | None= Field(foreign_key="restaurante.id_restaurante")
    nome : str = Field(max_length=150)
    email : str = Field(max_length=255)
    hash_senha : str = Field(max_length=60, min_length=60)
    funcao : str = Field(max_length=60)
    ativo : bool = Field(default = True)

class Cliente(SQLModel, table = True):
    # metadata = MetaData(schema="usuario")
    id_cliente : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(max_length=150)
    email : str = Field(max_length=255)
    hash_senha : str = Field(max_length=60, min_length=60)
    data_nascimento : datetime.date = Field()
    tipo_cliente : str = Field(max_length = 25)
    ativo : bool = Field(default = True)

class RestricaoCliente(SQLModel, table = True):
    __tablename__ : str = "restricao_cliente"
    # metadata = MetaData(schema="restricao")
    id_cliente : uuid.UUID = Field(foreign_key="cliente.id_cliente", primary_key = True)
    id_restricao : uuid.UUID = Field(foreign_key="restricao_alimentar.id_restricao", primary_key = True)

class Pedido(SQLModel, table = True):
    # metadata = MetaData(schema="pedido")
    id_pedido : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    id_funcionario : uuid.UUID = Field(foreign_key="funcionario.id_funcionario")
    id_cliente : uuid.UUID = Field(foreign_key="cliente.id_cliente")
    nome_cliente : str = Field(max_length = 150)
    status : Annotated[str,
        BeforeValidator(lambda s : s in {
        'pendente',
        'em_preparo',
        'pronto',
        'entregue',
        'cancelado'})] = Field()
    subtotal : Annotated[decimal.Decimal, BeforeValidator(lambda s : s >=0)] = Field(max_digits=10, decimal_places=2)
    desconto : Annotated[decimal.Decimal, BeforeValidator(lambda d : d >=0)] | None = Field(max_digits=10, decimal_places=2,default = None)
    codigo_retirada : str = Field(max_length=5)
    avaliacao : Annotated[int, BeforeValidator (lambda a : 1<= a <= 5)] | None = Field(default = None)

class ItemPedido(SQLModel, table=True):
    __tablename__ : str = "item_pedido"
    # metadata = MetaData(schema="pedido")
    id_item_pedido : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key = True)
    id_pedido : uuid.UUID = Field(foreign_key="pedido.id_pedido")
    id_item : uuid.UUID = Field(foreign_key = "item.id_item")
    quantidade : Annotated[int, BeforeValidator(lambda q : q > 0)] = Field()
    preco : Annotated[decimal.Decimal, BeforeValidator(lambda p : p >=0)] = Field(max_digits=10, decimal_places=2)
    observacoes : str = Field(default = "")

class RestricaoPedido(SQLModel, table=True):
    __tablename__ : str = "restricao_pedido"
    # metadata = MetaData(schema="restricao")
    id_pedido : uuid.UUID = Field(foreign_key="pedido.id_pedido", primary_key=True)
    id_restricao : uuid.UUID = Field(foreign_key = "restricao_alimentar.id_restricao", primary_key=True)
