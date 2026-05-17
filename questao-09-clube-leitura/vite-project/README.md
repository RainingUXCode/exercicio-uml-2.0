# 📚 ComicControl — Sistema de Gestão e Empréstimo do Clube da Leitura

Módulo de controle logístico e organização de acervo desenvolvido como solução para a **Questão 09** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um ecossistema projetado para catalogar revistas em quadrinhos, gerenciar o armazenamento em caixas numeradas, cadastrar o círculo de amigos autorizados e monitorar o fluxo de empréstimos ativos com regras estritas de limite por usuário.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa apoiar o gerenciamento da coleção de gibis do Gustavo, mitigando extravios de exemplares através do controle rigoroso de devoluções e organizando o acervo físico de forma sistemática.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar revista:** Registro das revistas em quadrinhos da coleção, capturando o tipo da coleção (título), o número da edição e o ano de publicação.
- **RF02 – Gerenciar caixas:** Controle do armazenamento físico do acervo, indexando cada revista a uma caixa específica identificada por cor, etiqueta e numeração única.
- **RF03 – Cadastrar amigo:** Cadastro dos participantes do Clube da Leitura, armazenando dados como nome da criança, nome da mãe, telefone e o local de origem do vínculo (escola ou prédio).
- **RF04 – Registrar empréstimo:** Criação de ordens de movimentação que associam uma revista disponível a um amigo cadastrado, carimbando a data de retirada e a estimativa de devolução.
- **RF05 – Validar empréstimo:** Linha de verificação automatizada (acionada via relacionamento `<<include>>` no caso de uso) que impede a consolidação da retirada caso o amigo selecionado já possua outro empréstimo em aberto ou se a revista estiver indisponível.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Organização:** Estrutura taxonômica que garante a rastreabilidade imediata do local de repouso de qualquer exemplar (vínculo exato entre revista e caixa).
- **RNF02 – Eficiência:** Processamento ágil e verificação instantânea do histórico de pendências do usuário no momento da solicitação de um novo gibi.
- **RNF03 – Usabilidade:** Painel operacional dinâmico baseado em abas que simplifica a rotina de empréstimos e baixas rápidas de devolução.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A solução adota padrões modernos de desenvolvimento baseado em componentes modulares e controle reativo de estados:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Segmentação dos fluxos operacionais em `Tabs` distintos (Acervo de Revistas, Caixas, Amigos e Empréstimos). Entrada de dados de datas controlada por `DateInput` e tabelas responsivas para exibição de relatórios de devolução pendente.
- **Gerenciador de Alertas:** Uso do módulo `@mantine/notifications` para disparar pop-ups visuais imediatos de sucesso ao registrar devoluções e alertas vermelhos caso a regra de limite de "uma revista por criança" seja violada.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Revista` (`tipoColecao: String`, `numEdicao: Int`, `ano: Int`)
  - `Caixa` (`cor: String`, `etiqueta: String`, `numero: Int`)
  - `Amigo` (`nome: String`, `nomeMae: String`, `telefone: String`, `localOrigem: String`)
  - `Emprestimo` (`dataEmprestimo: Date`, `dataDevolucao: Date`)
- **Lógica de Negócio Ativa (Métodos):**
  - `verificarDisponibilidade()`: Avalia se o exemplar solicitado já está associado a uma ordem de empréstimo não finalizada.
  - `registrarDevolucao()`: Modifica o status da ordem vigente, liberando a revista para o acervo e limpando a pendência no cadastro do amigo.
- **Mecanismo de Persistência:** Estruturas de listas em memória gerenciadas pelo React e sincronizadas na Web Storage API (`localStorage`) em formato JSON, garantindo que nenhum histórico de empréstimo seja perdido com o fechamento do navegador.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para habilitar os formulários de cadastro, os seletores de calendário e os painéis de notificações reativas do Clube da Leitura, abra o terminal do seu VS Code na pasta raiz do seu projeto frontend (`vite-project/`) e execute os comandos abaixo:

```bash
# Instalação do núcleo de interface e ganchos de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências adicionais de calendário, alertas e tratamento de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-09-clube-leitura/vite-project
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
