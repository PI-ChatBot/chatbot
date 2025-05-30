import uuid
from pydantic.functional_validators import AfterValidator
from sqlalchemy import Time
from sqlalchemy.sql.annotation import Annotated
from sqlmodel import Field, Numeric, SQLModel, Text
from datetime import _Date


class Unidade(SQLModel, table=True):
    id_unidade : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(unique=True, max_length=100)
    endereco : str = Field(unique=True, max_length=200)


class Restaurante(SQLModel, table=True):
    id_restaurante : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_unidade : uuid.UUID = Field(foreign_key="unidade.id_unidade")
    nome : str = Field(unique=True, max_length=100)
    localizacao : str = Field(unique=True, max_length=70)

class Administrador(SQLModel, table=True):
    id_administrador :uuid.UUID = Field(default_factory=uuid.uuid4, primary_key = True)
    nome : str = Field(max_length=100)
    email : str = Field(unique=True, max_length=255)
    hash_senha : str = Field(min_length=60, max_length=60)
    funcao :str = Field(max_length=60)
    ativo : bool = Field(default=True)


class UnidadeAdministrador(SQLModel, table=True):
    id_unidade : uuid.UUID = Field(foreign_key="unidade.id_unidade")
    id_administrador : uuid.UUID = Field(foreign_key="unidade.id_unidade")

class HorarioFuncionamento(SQLModel, table=True):
    id_horario : uuid.UUID = Field(default_factory = uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    dia_semana : Annotated[int,AfterValidator(lambda value: value >=0 and value < 6)] = Field()
    hora_abertura : Time = Field()
    hora_fechamento : Time = Field()

class Telefone(SQLModel, table=True):
    id_telefone : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    tipo : str = Field(max_length=10)
    numero : str = Field(max_length=20)
    whatsapp : bool = Field(default=False)

class Categoria(SQLModel, table=True):
    id_categoria : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(max_length=100)
    icone : str | None = Field(default= None, max_length=255)

class Item(SQLModel, table=True):
    id_item :uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    id_categoria : uuid.UUID = Field(foreign_key = "categoria.id_categoria")
    nome : str = Field(max_length=100)
    descricao : Text = Field()
    estoque : Annotated[int, AfterValidator(lambda e : e >=0)]
    preco : Annotated[Numeric, AfterValidator(lambda p : p >=0)] = Field(max_digits=10, decimal_places=2)
    preco_especial : Annotated[Numeric, AfterValidator(lambda p : p >=0)] = Field(max_digits=10, decimal_places=2)
    imagem : str | None = Field(default = None, max_length=255)

class Ingrediente(SQLModel, table = True):
    id_ingrediente : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(max_length = 100)
    imagem : str | None = Field(default = None,max_length = 255)

class ItemIngrediente(SQLModel, table = True):
    id_item : uuid.UUID = Field(foreign_key="item.id_item")
    id_ingrediente : uuid.UUID = Field(foreign_key = "ingrediente.id_ingrediente")
    papel : str = Field(max_length=50)

class ItemComposicao(SQLModel, table = True):
    id_item : uuid.UUID = Field(foreign_key= "item.id_item")
    id_item_composto : uuid.UUID = Field(foreign_key="item.id_item")
    tipo_composicao : str = Field(max_length = 25)
    quantidade : Annotated[int, AfterValidator(lambda q : q >=0)]

class RestricaoAlimentar(SQLModel, table = True):
    id_restricao : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key = True)
    nome : str = Field(max_length = 100, unique=True)
    icone : str = Field(max_length=255, default=None)

class RestricaoAlimentarIngrediente(SQLModel, table = True):
    id_restricao : uuid.UUID = Field(foreign_key="restricao_alimentar.id_restricao")
    id_ingrediente : uuid.UUID = Field(foreign_key="ingrediente.id_ingrediente")

class Funcionario(SQLModel, table=True):
    id_funcionario : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key= True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    nome : str = Field(max_length=150)
    email : str = Field(max_length=255)
    hash_senha : str = Field(max_length=60, min_length=60)
    funcao : str = Field(max_length=60)
    ativo : bool = Field(default = True)

class Cliente(SQLModel, table = True):
    id_cliente : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    nome : str = Field(max_length=150)
    email : str = Field(max_length=255)
    hash_senha : str = Field(max_length=60, min_length=60)
    data_nascimento : _Date = Field()
    tipo_cliente : str = Field(max_length = 25)
    ativo : bool = Field(default = True)

class RestricaoCliente(SQLModel, table = True):
    id_cliente : uuid.UUID = Field(foreign_key="cliente.id_cliente")
    id_restricao : uuid.UUID = Field(foreign_key="restricao.id_restricao")

class Pedido(SQLModel, table = True):
    id_pedido : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    id_restaurante : uuid.UUID = Field(foreign_key="restaurante.id_restaurante")
    id_funcionario : uuid.UUID = Field(foreign_key="funcionario.id_funcionario")
    id_cliente : uuid.UUID = Field(foreign_key="cliente.id_cliente")
    nome_cliente : str = Field(max_length = 150)
    status : Annotated[str,
        AfterValidator(lambda s : s in {
        'pendente',
        'em_preparo',
        'pronto',
        'entregue',
        'cancelado'})] = Field()
    subtotal : Annotated[Numeric, AfterValidator(lambda s : s >=0)] = Field(max_digits=10, decimal_places=2)
    desconto : Annotated[Numeric, AfterValidator(lambda d : d >=0)] | None = Field(max_digits=10, decimal_places=2,default = None)
    codigo_retirada : str = Field(max_length=5)
    avaliacao : Annotated[int, AfterValidator (lambda a : 1<= a <= 5)] | None = Field(default = None)

class ItemPedido(SQLModel, table=True):
    id_item_pedido : uuid.UUID = Field(default_factory=uuid.uuid4, primary_key = True)
    id_pedido : uuid.UUID = Field(foreign_key="pedido.id_pedido")
    id_item : uuid.UUID = Field(foreign_key = "item.id_item")
    quantidade : Annotated[int, AfterValidator(lambda q : q > 0)] = Field()
    preco : Annotated[Numeric, AfterValidator(lambda p : p >=0)] = Field(max_digits=10, decimal_places=2)
    observacoes : Text | None = Field(default = None)

class RestricaoPedido(SQLModel, table=True):
    id_pedido : uuid.UUID = Field(foreign_key="pedido.id_pedido")
    id_restricao : uuid.UUID = Field(foreign_key = "restricao.id_restricao")
