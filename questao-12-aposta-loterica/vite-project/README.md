# 📊 LottoManager — Sistema de Gerenciamento e Conferência de Apostas

Módulo analítico desenvolvido como solução para a **Questão 12** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um ecossistema Full-Stack projetado para gerenciar modalidades de loteria, automatizar o cadastro de bilhetes semanais e executar a engine de apuração de prêmios por meio de algoritmos orientados a objetos e persistência relacional.

---

## 📋 Cenário de Negócio & Requisitos

O sistema visa solucionar o problema de controle de múltiplos cartões de apostas semanais, mitigando falhas humanas no processo manual de conferência de dezenas e cálculo de premiações.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar cartões apostados:** Permite registrar as dezenas escolhidas pelo usuário, vinculando-as a um concurso específico e a uma modalidade de loteria ativa.
- **RF02 – Registrar resultados do concurso:** Armazena os sorteios oficiais contendo as dezenas premiadas e o montante financeiro máximo estipulado para o prêmio.
- **RF03 – Conferência de apostas:** Computa de forma automática a interseção entre os conjuntos numéricos do cartão do usuário e o resultado oficial do concurso correspondente.
- **RF04 – Gerar relatório de premiação:** Listagem consolidada (acionada via relacionamento `<<include>>` no caso de uso) que exibe os cartões validados, a quantidade de acertos por bilhete e os valores fracionados de prêmio a receber.

### Requisitos Não-Funcionais (RNF)

- **RNF01 (Segurança):** Garantia de integridade e imutabilidade nos logs de palpites após a homologação do concurso.
- **RNF02 (Precisão):** O algoritmo de verificação e cálculo de acertos utiliza operações de conjuntos para assegurar exatidão matemática de 100%.
- **RNF03 (Usabilidade):** Interface limpa baseada em abas, permitindo alternar rapidamente entre cadastros e relatórios.
- **RNF04 (Integridade de Dados):** Restrições de chaves estrangeiras (`FOREIGN KEY`) configuradas com deleção em cascata (`ON DELETE CASCADE`) no banco relacional.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Dados

A aplicação adota o padrão de arquitetura desacoplada (Client-Server), distribuída em três camadas principais:

### 🎮 Frontend (Interface do Usuário)

- **Tecnologias:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de UI:** Mantine UI (`@mantine/core`, `@mantine/dates`, `@mantine/notifications`).
- **Papel:** Captura dados do usuário, executa validações preliminares de interface através do método `validarAposta()` e consome os endpoints HTTP do servidor.

### 🐍 Backend (Engine de Regras de Negócio)

- **Tecnologias:** Python, Flask, Flask-CORS.
- **Métodos Orientados a Objetos Implementados:**
  - `validar_aposta()`: Garante a consistência dos dados (impede números repetidos, fora do escopo de 1 a 60 ou quantidade divergente da modalidade).
  - `conferir_apostas()`: Executa o cruzamento de dados e gera o relatório estruturado em tempo real (RF04).

### 🛢️ Banco de Dados (Persistência)

- **Tecnologia:** MySQL 8.0.
- **Modelo Relacional (Mapeamento Lógico):**
  - `jogo` (PK `id`): Armazena as regras das modalidades (Mega-Sena, Quina).
  - `cartao_apostado` (PK `id`, FK `jogo_id`): Guarda os bilhetes cadastrados (dezenas salvas como string ordenada).
  - `concurso_resultado` (PK `id`, FK `jogo_id`): Guarda o resultado oficial e o valor do prêmio de cada concurso.

---

## 🚀 Como Executar o Projeto

### 🗄️ 1. Configuração do Banco de Dados (MySQL)

Abra o seu **MySQL Workbench** (ou gerenciador de sua preferência conectado em `localhost:3306`) e execute o script de criação do banco:

```sql
CREATE DATABASE IF NOT EXISTS sistema_loteria;
USE sistema_loteria;

CREATE TABLE jogo (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    qtdNumerosPermitidos INT NOT NULL
);

CREATE TABLE cartao_apostado (
    id VARCHAR(36) PRIMARY KEY,
    jogo_id VARCHAR(36) NOT NULL,
    numerosEscolhidos VARCHAR(255) NOT NULL,
    dataAposta VARCHAR(20) NOT NULL,
    concursoNumero INT NOT NULL,
    FOREIGN KEY (jogo_id) REFERENCES jogo(id) ON DELETE CASCADE
);

CREATE TABLE concurso_resultado (
    id VARCHAR(36) PRIMARY KEY,
    jogo_id VARCHAR(36) NOT NULL,
    concursoNumero INT NOT NULL,
    numeroSorteado VARCHAR(255) NOT NULL,
    dataSorteio VARCHAR(20) NOT NULL,
    valorPremio DOUBLE NOT NULL,
    FOREIGN KEY (jogo_id) REFERENCES jogo(id) ON DELETE CASCADE
);

INSERT INTO jogo (id, nome, qtdNumerosPermitidos) VALUES
('j1', 'Mega-Sena', 6),
('j2', 'Quina', 5);
```

### 🐍 2. Executando o Backend (Python Flask)

Navegue até a pasta do backend:

```bash
cd backend
```

Instale as dependências necessárias através do interpretador Python:

```bash
python -m pip install flask flask-cors mysql-connector-python
```

Abra o arquivo **app.py** e configure a senha da sua instância do MySQL no dicionário db_config.
Inicie o servidor:

```bash
python app.py
```

(O servidor estará ativo e escutando na porta http://localhost:5000)

### 💻 3. Executando o Frontend (React + Vite)

Abra um novo terminal e navegue até a pasta do frontend:

```bash
cd vite-project
```

Instale as dependências de pacotes do ecossistema Node:

```bash
npm install
```

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

Abra o endereço http://localhost:5173 no seu navegador de preferência.

## 🧑‍💻 Desenvolvido por:

- **Estudantes:** Anny Gabrielle Avelino Teixeira & Raínne Carvalho Lima
- **Instituição:** Unipê
- **Componente Curricular:** Modelagem de Software / Engenharia de Software
