# 🪓 HangmanGame — Motor de Execução e Gerenciamento do Jogo da Forca

Módulo de entretenimento digital e gamificação educacional desenvolvido como solução para a **Questão 07** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um motor lógico interativo que gerencia rodadas dinâmicas do tradicional Jogo da Forca, automatizando o sorteio de desafios (palavras ou frases), o controle incremental de erros com renderização visual do boneco, o cálculo algorítmico de pontuações acumuladas e a manutenção do ranking de maiores escores.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa prover uma plataforma lúdica computacional adaptada para o público infantil, eliminando a necessidade de controle em papel, automatizando as regras de pontuação bônus por letras ocultas e expandindo o vocabulário por meio de um banco de dados customizável.

### Requisitos Funcionais (RF)

- **RF01 – Gerenciar banco de palavras:** Permite a manutenção, inclusão e expansão do acervo de palavras e frases desafiadoras diretamente pela interface do jogador.
- **RF02 – Categorizar por temas:** Mapeamento estrutural que vincula cada palavra ou frase a um eixo temático específico (ex: Animais, Frutas, Objetos).
- **RF03 – Sorteio de rodada:** Mecanismo aleatório responsável por selecionar o tema da partida e definir se o desafio atual exibirá uma, duas ou três palavras combinadas, ou uma frase completa.
- **RF04 – Controle de erros:** Linha de verificação (acionada via relacionamento `<<include>>` no caso de uso) que monitora os palpites incorretos, popula o quadro de letras erradas e avança sequencialmente os estágios gráficos do boneco na forca.
- **RF05 – Cálculo de pontuação:** Engine matemática (acionada via relacionamento `<<include>>` no caso de uso) que computa os pontos do competidor ao final do desafio (100 pontos pela vitória acrescidos de 15 pontos fixos para cada letra que permaneceu encoberta).
- **RF06 – Ranking de escore:** Módulo de persistência que registra o nome do jogador e arquiva suas maiores pontuações para exibição em um quadro consolidado de líderes (High Scores).

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Confiabilidade:** Garantia de aleatoriedade real no sorteio de termos e integridade no armazenamento dos pontos obtidos sem riscos de manipulação de dados.
- **RNF02 – Desempenho:** Resposta reativa e atualização instantânea da interface gráfica a cada caractere digitado ou palpite submetido pelo usuário.
- **RNF03 – Usabilidade:** Interface lúdica, visualmente limpa e acessível, projetada especificamente para a interação autônoma de crianças e sobrinhos.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A aplicação adota os conceitos de design modular e gerenciamento reativo de estados baseados no ciclo de vida dos componentes:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Fluxo segmentado por `Tabs` operacionais (Tela de Jogo Ativo, Cadastro de Palavras/Temas e Painel de Líderes). Exibição das letras descobertas através de blocos estilizados de `Paper` e renderização das partes do boneco via layouts CSS dinâmicos.
- **Módulo de Mensagens Dinâmicas:** Uso do `@mantine/notifications` para disparar pop-ups verdes e festivos na homologação da vitória com o cálculo dos pontos, ou alertas vermelhos a cada erro cometido na rodada.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Jogador` (`nome: String`, `pontuacaoTotal: Int`)
  - `Rodada` (`errosCometidos: Int`, `letrasErradas: Char`, `letrasDescobertas: Char`)
  - `PalavraFrase` (`texto: String`)
  - `Tema` (`nomeTema: String`)
- **Lógica de Negócio Ativa (Métodos):**
  - `atualizarEscore()`: Consolida os pontos da partida atual no perfil histórico do jogador.
  - `sortearDesafio()`: Executa o algoritmo de sorteio de temas e quantidade de palavras ocultas.
  - `validarPalpite()`: Analisa o caractere inserido contra a string do desafio, revelando as posições corretas ou acionando o controle de erros.
  - `calcularPontos()`: Realiza a equação matemática multiplicando as dezenas encobertas restantes e somando à base de vitória.
- **Mecanismo de Persistência:** Listas de objetos convertidas e armazenadas via `localStorage` (Web Storage API) em formato JSON strings, assegurando a retenção do ranking e do banco de palavras inserido pelo usuário mesmo após reiniciar o navegador.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para habilitar o teclado virtual, os painéis organizadores e o motor de notificações imediatas do Jogo da Forca, abra o terminal do seu VS Code dentro do diretório do seu frontend (`vite-project/`) e execute:

```bash
# Instalação do núcleo de interface e utilitários de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação dos pacotes auxiliares de alertas visuais, calendários e suporte temporal
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-07-jogo-forca/vite-project
```

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

O terminal gerará um link local (geralmente http://localhost:5173). Copie e cole no seu navegador para testar o sistema completo de agendamento pediátrico.

## 🧑‍💻 Desenvolvido por:

- **Estudantes:** Anny Gabrielle Avelino Teixeira & Raínne Carvalho Lima
- **Instituição:** Unipê
- **Componente Curricular:** Modelagem de Software / Engenharia de Software
