CREATE DATABASE IF NOT EXISTS sistema_loteria;
USE sistema_loteria;

-- Tabela de Jogos (Ex: Mega-Sena, Quina)
CREATE TABLE IF NOT EXISTS jogo (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    qtdNumerosPermitidos INT NOT NULL
);

-- Tabela de Cartões Apostados (RF01)
CREATE TABLE IF NOT EXISTS cartao_apostado (
    id VARCHAR(36) PRIMARY KEY,
    jogo_id VARCHAR(36) NOT NULL,
    numerosEscolhidos VARCHAR(255) NOT NULL, -- Salvo como String separada por vírgula
    dataAposta VARCHAR(20) NOT NULL,
    concursoNumero INT NOT NULL,
    FOREIGN KEY (jogo_id) REFERENCES jogo(id) ON DELETE CASCADE
);

-- Tabela de Resultados do Concurso (RF02)
CREATE TABLE IF NOT EXISTS concurso_resultado (
    id VARCHAR(36) PRIMARY KEY,
    jogo_id VARCHAR(36) NOT NULL,
    concursoNumero INT NOT NULL,
    numeroSorteado VARCHAR(255) NOT NULL, -- Salvo como String separada por vírgula
    dataSorteio VARCHAR(20) NOT NULL,
    valorPremio DOUBLE NOT NULL,
    FOREIGN KEY (jogo_id) REFERENCES jogo(id) ON DELETE CASCADE
);

-- Inserção de dados iniciais para testes
INSERT INTO jogo (id, nome, qtdNumerosPermitidos) VALUES 
('j1', 'Mega-Sena', 6),
('j2', 'Quina', 5);

SELECT * FROM concurso_resultado;
SELECT * FROM cartao_apostado;