CREATE TABLE unidade (
    id_unidade UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    PRIMARY KEY (id_unidade),
    UNIQUE (nome),
    UNIQUE (endereco)
)
CREATE TABLE administrador (
    id_administrador UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hash_senha VARCHAR(60) NOT NULL,
    funcao VARCHAR(60) NOT NULL,
    ativo BOOLEAN NOT NULL,
    PRIMARY KEY (id_administrador),
    UNIQUE (email)
)
CREATE TABLE categoria (
    id_categoria UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(255),
    PRIMARY KEY (id_categoria)
)
CREATE TABLE ingrediente (
    id_ingrediente UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    imagem VARCHAR(255),
    PRIMARY KEY (id_ingrediente)
)
CREATE TABLE restricao_alimentar (
    id_restricao UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_restricao),
    UNIQUE (nome)
)
CREATE TABLE cliente (
    id_cliente UUID NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hash_senha VARCHAR(60) NOT NULL,
    data_nascimento DATE NOT NULL,
    tipo_cliente VARCHAR(25) NOT NULL,
    ativo BOOLEAN NOT NULL,
    PRIMARY KEY (id_cliente)
)
CREATE TABLE restaurante (
    id_restaurante UUID NOT NULL,
    id_unidade UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(70) NOT NULL,
    PRIMARY KEY (id_restaurante),
    FOREIGN KEY (id_unidade) REFERENCES unidade (id_unidade),
    UNIQUE (nome),
    UNIQUE (localizacao)
)
CREATE TABLE unidade_administrador (
    id_unidade UUID NOT NULL,
    id_administrador UUID NOT NULL,
    PRIMARY KEY (id_unidade, id_administrador),
    FOREIGN KEY (id_unidade) REFERENCES unidade (id_unidade),
    FOREIGN KEY (id_administrador) REFERENCES unidade (id_unidade)
)
CREATE TABLE restricao_alimentar_ingrediente (
    id_restricao UUID NOT NULL,
    id_ingrediente UUID NOT NULL,
    PRIMARY KEY (id_restricao, id_ingrediente),
    FOREIGN KEY (id_restricao) REFERENCES restricao_alimentar (id_restricao),
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente (id_ingrediente)
)
CREATE TABLE restricao_cliente (
    id_cliente UUID NOT NULL,
    id_restricao UUID NOT NULL,
    PRIMARY KEY (id_cliente, id_restricao),
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente),
    FOREIGN KEY (id_restricao) REFERENCES restricao_alimentar (id_restricao)
)
CREATE TABLE horario_funcionamento (
    id_horario UUID NOT NULL,
    id_restaurante UUID NOT NULL,
    dia_semana INTEGER NOT NULL,
    hora_abertura TIME WITHOUT TIME ZONE NOT NULL,
    hora_fechamento TIME WITHOUT TIME ZONE NOT NULL,
    PRIMARY KEY (id_horario),
    FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante)
)
CREATE TABLE telefone (
    id_telefone UUID NOT NULL,
    id_restaurante UUID NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    whatsapp BOOLEAN NOT NULL,
    PRIMARY KEY (id_telefone),
    FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante)
)
CREATE TABLE item (
    id_item UUID NOT NULL,
    id_restaurante UUID NOT NULL,
    id_categoria UUID NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR NOT NULL,
    estoque INTEGER NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    preco_especial NUMERIC(10, 2) NOT NULL,
    imagem VARCHAR(255),
    PRIMARY KEY (id_item),
    FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante),
    FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
)
CREATE TABLE funcionario (
    id_funcionario UUID NOT NULL,
    id_restaurante UUID NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hash_senha VARCHAR(60) NOT NULL,
    funcao VARCHAR(60) NOT NULL,
    ativo BOOLEAN NOT NULL,
    PRIMARY KEY (id_funcionario),
    FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante)
)
CREATE TABLE item_ingrediente (
    id_item UUID NOT NULL,
    id_ingrediente UUID NOT NULL,
    papel VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_item, id_ingrediente),
    FOREIGN KEY (id_item) REFERENCES item (id_item),
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente (id_ingrediente)
)
CREATE TABLE item_composicao (
    id_item UUID NOT NULL,
    id_item_composto UUID NOT NULL,
    tipo_composicao VARCHAR(25) NOT NULL,
    quantidade INTEGER NOT NULL,
    PRIMARY KEY (id_item, id_item_composto),
    FOREIGN KEY (id_item) REFERENCES item (id_item),
    FOREIGN KEY (id_item_composto) REFERENCES item (id_item)
)
CREATE TABLE pedido (
    id_pedido UUID NOT NULL,
    id_restaurante UUID NOT NULL,
    id_funcionario UUID NOT NULL,
    id_cliente UUID NOT NULL,
    nome_cliente VARCHAR(150) NOT NULL,
    status VARCHAR NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    desconto NUMERIC(10, 2),
    codigo_retirada VARCHAR(5) NOT NULL,
    avaliacao INTEGER,
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario (id_funcionario),
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
)
CREATE TABLE item_pedido (
    id_item_pedido UUID NOT NULL,
    id_pedido UUID NOT NULL,
    id_item UUID NOT NULL,
    quantidade INTEGER NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    observacoes VARCHAR,
    PRIMARY KEY (id_item_pedido),
    FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    FOREIGN KEY (id_item) REFERENCES item (id_item)
)
CREATE TABLE restricao_pedido (
    id_pedido UUID NOT NULL,
    id_restricao UUID NOT NULL,
    PRIMARY KEY (id_pedido, id_restricao),
    FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    FOREIGN KEY (id_restricao) REFERENCES restricao_alimentar (id_restricao)
)
