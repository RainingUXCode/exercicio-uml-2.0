# 📝 TestGen — Sistema de Geração Aleatória de Testes de Fixação

Módulo de automação pedagógica e gestão de avaliações desenvolvido como solução para a **Questão 03** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um motor de inteligência educacional projetado para o cenário de Mariana, automatizando o gerenciamento de matrizes curriculares (disciplinas e matérias), a manutenção de um banco de questões objetivas com gabarito e a geração randômica de testes personalizados por amostragem baseada em série e bimestre.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa apoiar e informatizar a preparação de exercícios escolares para a primeira e segunda séries, mitigando o esforço manual na montagem de avaliações, garantindo a variedade de desafios através de sorteios aleatórios e agilizando a correção por meio de gabaritos indexados.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar disciplina:** Permite o registro das áreas fundamentais do conhecimento (ex: Matemática, Português) que servirão de base hierárquica para o sistema.
- **RF02 – Gerenciar matérias:** Módulo responsável por segmentar as disciplinas em tópicos específicos de conteúdo (ex: Adição, Divisão, Sinônimos), vinculando explicitamente cada matéria à sua respectiva série escolar.
- **RF03 – Cadastrar questões em banco:** Permite alimentar o acervo de perguntas objetivas, retendo o enunciado descritivo, o bimestre correspondente (1º, 2º, 3º ou 4º), a matéria a qual pertence e o gabarito oficial para correção.
- **RF04 – Gerar teste:** Engine de sorteio que monta uma avaliação aleatória a partir de parâmetros informados (número de questões desejadas e disciplina alvo), encapsulando o conjunto de questões selecionadas e carimbando a data de geração.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Usabilidade:** Interface fluida organizada em abas consecutivas, adaptada para que o usuário configure e dispare testes complexos com poucos cliques.
- **RNF02 – Confiabilidade:** Algoritmo de sorteio que assegura a distribuição randômica genuína das questões, impedindo duplicidade de enunciados em um mesmo teste gerado.
- **RNF03 – Disponibilidade:** Garantia de operação contínua do ambiente local para que o banco de dados de questões esteja acessível em tempo integral para consultas e impressões.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A solução adota padrões modernos de arquitetura SPA (Single Page Application) e desenvolvimento guiado por gerenciamento reativo de estados:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Fluxo segregado em `Tabs` operacionais (Matriz Curricular, Banco de Questões e Gerador de Testes). Renderização dos testes gerados em folhas de estilo limpas, prontas para visualização ou impressão física.
- **Módulo de Notificações Reativas:** O pacote `@mantine/notifications` injeta pop-ups visuais instantâneos de sucesso ao homologar questões e alertas laranjas caso o usuário tente gerar um teste com uma quantidade de questões maior do que o total disponível no acervo para aquela disciplina.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Disciplina` (`nomeDisc: String`)
  - `Materia` (`nomeMat: String`, `serie: Int`)
  - `Questao` (`enunciado: String`, `bimestre: Int`, `gabarito: String`)
  - `Teste` (`dataGeracao: Date`, `qtdQuestoes: Int`)
- **Lógica de Negócio Ativa (Métodos):**
  - `cadastrarDisciplina()` e `cadastrarMateria()`: Estruturam a árvore de pré-requisitos acadêmicos.
  - `listarMaterias()` e `editarMateria()`: Provêm controle e manutenção sobre os conteúdos atrelados às séries.
  - `cadastrarQuestao()` e `validarGabarito()`: Alimentam o acervo e garantem que nenhuma alternativa nula ou inválida seja inserida como resposta oficial.
  - `gerarTeste()`: Executa o algoritmo de amostragem aleatória sobre o subconjunto de questões filtradas pela disciplina.
  - `imprimirTeste()`: Prepara a formatação e aciona a API de impressão nativa do navegador (`window.print()`) para gerar a versão física ou PDF do teste acompanhado do gabarito.
- **Mecanismo de Persistência:** Listas estruturadas de objetos gerenciadas através de hooks do React e persistidas localmente via `localStorage` (Web Storage API) em formato de strings JSON, assegurando a retenção do banco de questões e dos testes gerados mesmo após reiniciar o navegador.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para carregar os componentes de formulários modulares, as tabelas de dados de questões e os painéis de notificações imediatas do gerador de testes, abra o terminal do seu VS Code na pasta raiz do seu projeto frontend (`vite-project/`) e execute os comandos:

```bash
# Instalação do núcleo de interface e ganchos de controle de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências extras de calendário, notificações e biblioteca de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-03-testes-fixacao/vite-project
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
