# 🌲 CaseTree — Sistema de Gerenciamento e Documentação de Casos de Uso

Módulo de automação de engenharia de software e modelagem visual desenvolvido como solução para a **Questão 08** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em uma ferramenta CASE (Computer-Aided Software Engineering) projetada para catalogar e organizar arquivos de especificação de requisitos em estruturas de árvore, agrupando-os por pacotes lógicos e controlando o ciclo de vida dos casos de uso de um projeto.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa apoiar pequenas empresas desenvolvedoras que utilizam a UML em sua rotina de documentação, oferecendo uma ferramenta centralizada para o controle de status, pesquisas textuais globais e refatoração de nomenclatura de arquivos.

### Requisitos Funcionais (RF)

- **RF01 – Gerenciar pacotes:** Criação e controle dos agrupamentos lógicos de documentação, onde o nome de cada pacote reflete diretamente o nome da pasta física do projeto (diretório).
- **RF02 – Gerenciar casos de uso:** Registro de arquivos de especificação de requisitos, onde o nome de exibição do caso de uso é derivado do nome do próprio arquivo físico.
- **RF03 – Controle de status:** Gerenciamento do ciclo de vida dos requisitos através de uma enumeração de estados rígida (Não Iniciado, Em Desenvolvimento, Finalizado ou Aprovado).
- **RF04 – Identificação automática:** Algoritmo utilitário que injeta o prefixo sequencial adequado aos documentos (prefixo `UC` para casos de uso de base e `UCE` para casos de uso de extensão).
- **RF05 – Manipulação de arquivos:** Módulo que gerencia o sistema de arquivos local, permitindo abrir o texto descritivo interno, renomear registros e mover casos de uso entre diferentes pacotes.
- **RF06 – Geração via template:** Geração automatizada de novos arquivos base estruturados com placeholders a partir de um arquivo padrão (template) pré-configurado.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Usabilidade:** Exibição hierárquica e limpa dos arquivos organizados em nós de árvores dinâmicas (Tree View), facilitando a navegação operacional de equipes de analistas.
- **RNF02 – Integridade:** Mecanismo de sincronização que garante que qualquer alteração de pacote ou nomenclatura na interface gráfica seja replicada com exatidão no sistema de arquivos do sistema operacional.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A aplicação foi estruturada seguindo o padrão de design modular, focado em alta coesão estrutural e controle reativo de fluxos:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Uso do componente `Tabs` para separação entre o painel de árvore e a tela de pesquisa textual global. Emprego de menus contextuais para acionar ações de renomear e mover elementos.
- **Módulo Reativo de Feedback:** O pacote `@mantine/notifications` renderiza pop-ups instantâneos de sucesso ao alterar estados ou emitir novos arquivos via template, disparando alertas laranjas caso ocorram erros de leitura em disco.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes, Atributos e Tipos Enumerados:**
  - `Pacote` (`nomePasta: String`, `caminhoDiretorio: String`)
  - `CasoDeUso` (`identificador: String`, `nomeArquivo: String`, `status: Enumeration`, `conteudoTexto: String`)
  - `<<Enumeration>> Status` (Não Iniciado, Em Desenvolvimento, Finalizado, Aprovado)
- **Lógica de Negócio Ativa (Métodos):**
  - `listarCasosDeUso()`: Carrega e monta a visualização em árvore lendo o diretório do projeto.
  - `renomear()`: Altera a propriedade identificadora e o arquivo em disco correspondente.
  - `moverPara()`: Modifica a associação do caso de uso atual, atualizando seu caminho para o novo pacote destino.
  - `abrirTexto()`: Realiza a leitura e renderiza o conteúdo textual interno do documento selecionado.
- **Mecanismo de Persistência:** Estado estruturado indexado e persistido por meio do `localStorage` (Web Storage API) em formato JSON strings, mantendo as árvores salvas e indexadas localmente.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para carregar a árvore de navegação de pacotes, os formulários de inserção via template e os blocos de notificações utilitárias do sistema, abra o terminal na pasta raiz do seu projeto frontend (`vite-project/`) e digite:

```bash
# Instalação do núcleo de interface e ganchos de controle de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências extras de gerenciamento de layouts, alertas e ícones
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-08-ferramenta-uml/vite-project
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
