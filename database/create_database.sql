-- Script DDL (PostgreSQL) para criar o banco de dados
-- -----------------------------------------------------
-- Criar tabelas
-- Extensão uuid-ossp: gera UUIDs para PKs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Unidade do Colégio
CREATE TABLE IF NOT EXISTS unidade (
    -- ID da unidade (PK)
    id_unidade UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- nome da unidade
    nome VARCHAR(100) NOT NULL UNIQUE,
    -- endereço da unidade
    endereco VARCHAR(200) NOT NULL UNIQUE
);
-- Restaurante ou Lanchonete
CREATE TABLE IF NOT EXISTS restaurante (
    -- ID do restaurante (PK)
    id_restaurante UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Unidade do restaurante (FK)
    id_unidade UUID NOT NULL,
    -- Nome do restaurante
    nome VARCHAR(100) NOT NULL UNIQUE,
    -- Localização do restaurante
    localizacao VARCHAR(70) NOT NULL,
    -- FK Unidade
    CONSTRAINT fk_unidade FOREIGN KEY (id_unidade) REFERENCES unidade (id_unidade) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Administrador do colégio responsável por gerenciar unidades e restaurantes
CREATE TABLE IF NOT EXISTS administrador(
    -- ID do administrador
    id_administrador UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Nome do administrador
    nome VARCHAR(100) NOT NULL,
    -- E-mail do administrador
    email VARCHAR(255) NOT NULL UNIQUE,
    -- Hash da senha do administrador
    hash_senha CHAR(60),
    -- Função do administrador (diretor, coordenador, etc)
    funcao VARCHAR(60) NOT NULL,
    -- Se o administrador está ativo ou inativo (demitido)
    ativo BOOLEAN DEFAULT TRUE
);
-- Relação entre unidade e administrador
CREATE TABLE IF NOT EXISTS unidade_administrador(
    -- ID da unidade (FK)
    id_unidade UUID NOT NULL,
    -- ID do administrador (FK)
    id_administrador UUID NOT NULL,
    -- FK Unidade
    CONSTRAINT fk_unidade FOREIGN KEY (id_unidade) REFERENCES unidade (id_unidade) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Administrador
    CONSTRAINT fk_administrador FOREIGN KEY (id_administrador) REFERENCES administrador (id_administrador) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Horário de funcionamento do restaurante
CREATE TABLE IF NOT EXISTS horario_funcionamento(
    -- ID do horário (PK)
    id_horario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ID do restaurante (FK)
    id_restaurante UUID NOT NULL,
    -- Dia da semana (0 = domingo, 1 = segunda, ..., 6 = sábado)
    dia_semana INT NOT NULL CHECK (
        dia_semana >= 0
        AND dia_semana <= 6
    ),
    -- Hora de abertura
    hora_abertura TIME NOT NULL,
    -- Hora de fechamento
    hora_fechamento TIME NOT NULL,
    -- FK Restaurante
    CONSTRAINT fk_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Telefones do restaurante
CREATE TABLE IF NOT EXISTS telefone(
    -- ID do telefone (PK)
    id_telefone UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ID do restaurante (FK)
    id_restaurante UUID NOT NULL,
    -- Tipo do telefone (fixo, celular, fax)
    tipo VARCHAR(10) NOT NULL,
    -- Número do telefone
    numero VARCHAR(20) NOT NULL UNIQUE,
    -- Se possui WhatsApp
    whatsapp BOOLEAN DEFAULT FALSE,
    -- FK Restaurante
    CONSTRAINT fk_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Categoria dos itens
CREATE TABLE IF NOT EXISTS categoria(
    -- ID da categoria (PK)
    id_categoria UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Nome da categoria
    nome VARCHAR(100) NOT NULL UNIQUE,
    -- Ícone ou imagem da categoria (URI)
    icone VARCHAR(255) DEFAULT NULL
);
-- Item do cardápio do restaurante
CREATE TABLE IF NOT EXISTS item(
    -- ID do item (PK)
    id_item UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ID do restaurante (FK)
    id_restaurante UUID NOT NULL,
    -- ID da categoria (FK)
    id_categoria UUID NOT NULL,
    -- Nome do item
    nome VARCHAR(100) NOT NULL,
    -- Descrição
    descricao TEXT NOT NULL,
    -- Estoque
    estoque INT NOT NULL CHECK (estoque >= 0),
    -- Preço
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    -- Preço promocional (para membros do colégio)
    preco_especial NUMERIC(10, 2) DEFAULT NULL CHECK (preco_especial >= 0),
    -- Imagem do item (URI)
    imagem VARCHAR(255) DEFAULT NULL,
    -- FK Restaurante
    CONSTRAINT fk_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Categoria
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Ingrediente do item do cardápio
CREATE TABLE IF NOT EXISTS ingrediente(
    -- ID do ingrediente (PK)
    id_ingrediente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Nome do ingrediente
    nome VARCHAR(100) NOT NULL,
    -- Imagem (URI)
    imagem VARCHAR(255) DEFAULT NULL
);
-- Relação entre item do cardápio e ingrediente
CREATE TABLE IF NOT EXISTS item_ingrediente(
    -- ID do item (FK)
    id_item UUID NOT NULL,
    -- ID do ingrediente (FK)
    id_ingrediente UUID NOT NULL,
    -- Papel do ingrediente (tempero, molho, acompanhamento...)
    papel VARCHAR(50) NOT NULL,
    -- FK Item
    CONSTRAINT fk_item FOREIGN KEY (id_item) REFERENCES item (id_item) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Ingrediente
    CONSTRAINT fk_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES ingrediente (id_ingrediente) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Relação de composição entre itens do cardápio
CREATE TABLE IF NOT EXISTS item_composicao(
    -- ID do item (FK)
    id_item UUID NOT NULL,
    -- ID do item composto (FK)
    id_item_composto UUID NOT NULL,
    -- Tipo de composição (principal, acompanhamento, bebida, etc)
    tipo_composicao VARCHAR(25) NOT NULL,
    -- Quantidade
    quantidade INT NOT NULL CHECK (quantidade > 0),
    -- FK Item
    CONSTRAINT fk_item FOREIGN KEY (id_item) REFERENCES item (id_item) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Item Composto
    CONSTRAINT fk_item_composto FOREIGN KEY (id_item_composto) REFERENCES item (id_item) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Restrição alimentar
CREATE TABLE IF NOT EXISTS restricao_alimentar(
    -- ID da restrição (PK)
    id_restricao UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Nome da restrição
    nome VARCHAR(100) NOT NULL UNIQUE,
    -- Ícone ou imagem da restrição (URI)
    icone VARCHAR(255) DEFAULT NULL
);
-- Relação entre restrição alimentar e ingrediente
CREATE TABLE IF NOT EXISTS restricao_alimentar_ingrediente(
    -- ID da restrição (FK)
    id_restricao UUID NOT NULL,
    -- ID do ingrediente (FK)
    id_ingrediente UUID NOT NULL,
    -- FK Restrição
    CONSTRAINT fk_restricao FOREIGN KEY (id_restricao) REFERENCES restricao_alimentar (id_restricao) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Ingrediente
    CONSTRAINT fk_ingrediente FOREIGN KEY (id_ingrediente) REFERENCES ingrediente (id_ingrediente) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Funcionário do restaurante responsável por preparar os pratos
CREATE TABLE IF NOT EXISTS funcionario(
    -- ID do funcionário (PK)
    id_funcionario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ID do restaurante (FK)
    id_restaurante UUID NOT NULL,
    -- Nome do funcionário
    nome VARCHAR(150) NOT NULL,
    -- E-mail do funcionário
    email VARCHAR(255) NOT NULL UNIQUE,
    -- Hash da senha do funcionário
    hash_senha CHAR(60),
    -- Função do funcionário (cozinheiro, atendente, etc)
    funcao VARCHAR(60) NOT NULL,
    -- Se o funcionário está ativo ou inativo (demitido)
    ativo BOOLEAN DEFAULT TRUE,
    -- FK Restaurante
    CONSTRAINT fk_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Cliente que realiza um pedido
CREATE TABLE IF NOT EXISTS cliente(
    -- ID do cliente (PK)
    id_cliente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Nome do cliente
    nome VARCHAR(150) NOT NULL,
    -- E-mail do cliente
    email VARCHAR(255) NOT NULL UNIQUE,
    -- Hash da senha do cliente
    hash_senha CHAR(60),
    -- Data de nascimento do cliente
    data_nascimento DATE NOT NULL,
    -- Tipo de cliente (aluno, professor, coordenador, etc)
    tipo_cliente VARCHAR(25) NOT NULL,
    -- Se o cliente está ativo ou inativo (desativado)
    ativo BOOLEAN DEFAULT TRUE
);
-- Restrições alimentares do cliente
CREATE TABLE IF NOT EXISTS restricao_cliente(
    -- ID do cliente (FK)
    id_cliente UUID NOT NULL,
    -- ID da restrição (FK)
    id_restricao UUID NOT NULL,
    -- FK Cliente
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Restrição
    CONSTRAINT fk_restricao FOREIGN KEY (id_restricao) REFERENCES restricao_alimentar (id_restricao) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Pedido realizado ao restaurante
CREATE TABLE IF NOT EXISTS pedido(
    -- ID do pedido (PK)
    id_pedido UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ID do restaurante (FK)
    id_restaurante UUID NOT NULL,
    -- ID do funcionário (FK)
    id_funcionario UUID NULL,
    -- ID do cliente (FK)
    id_cliente UUID NULL,
    -- Nome do cliente
    nome_cliente VARCHAR(150) NOT NULL,
    -- Status do pedido (pendente, em preparo, pronto, entregue, cancelado)
    status VARCHAR(20) NOT NULL CHECK (
        status IN (
            'pendente',
            'em_preparo',
            'pronto',
            'entregue',
            'cancelado'
        )
    ),
    -- Subtotal do pedido
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    -- Desconto do pedido
    desconto NUMERIC(10, 2) DEFAULT NULL CHECK (desconto >= 0),
    -- Código de retirada do pedido
    codigo_retirada VARCHAR(5) NOT NULL,
    -- Avaliação do pedido (1 a 5)
    avaliacao INT DEFAULT NULL CHECK (
        avaliacao >= 1
        AND avaliacao <= 5
    ),
    -- FKs:
    -- FK Restaurante
    CONSTRAINT fk_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurante (id_restaurante) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Funcionário
    CONSTRAINT fk_funcionario FOREIGN KEY (id_funcionario) REFERENCES funcionario (id_funcionario) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Cliente
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Item no pedido
CREATE TABLE IF NOT EXISTS item_pedido(
    -- ID do item no pedido (PK)
    id_item_pedido UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ID do pedido (FK)
    id_pedido UUID NOT NULL,
    -- ID do item (FK)
    id_item UUID NOT NULL,
    -- Quantidade
    quantidade INT NOT NULL CHECK (quantidade > 0),
    -- Preço no pedido (em caso de alteração de preço)
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    -- Observações
    observacoes TEXT DEFAULT NULL,
    -- FKs:
    -- FK Pedido
    CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Item
    CONSTRAINT fk_item FOREIGN KEY (id_item) REFERENCES item (id_item) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Restrições alimentares anotadas no pedido
CREATE TABLE IF NOT EXISTS restricao_pedido(
    -- ID do pedido (FK)
    id_pedido UUID NOT NULL,
    -- ID da restrição (FK)
    id_restricao UUID NOT NULL,
    -- FK Pedido
    CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
    -- FK Restrição
    CONSTRAINT fk_restricao FOREIGN KEY (id_restricao) REFERENCES restricao_alimentar (id_restricao) ON DELETE CASCADE ON UPDATE CASCADE
);