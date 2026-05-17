# 🎈 PartyManager — Sistema de Gestão de Aluguéis e Temas Infantis

Módulo de automação comercial e controle de locação de acervos desenvolvido como solução para a **Questão 04** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um sistema de gestão operacional projetado para o negócio de Rafaela, automatizando o agendamento de festas infantis, o controle de estoque dos itens componentes de cada tema e a aplicação dinâmica de descontos personalizados para clientes fidelizados.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa sanar gargalos operacionais do empreendimento, tais como a sobreposição de locação de um mesmo tema na mesma data, esquecimentos na composição dos itens de mesa e falta de rastreabilidade nos valores reais cobrados com desconto.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar cliente:** Registro cadastral dos tomadores de serviço, retendo o nome e o telefone de contato para fins de comunicação e auditoria de fidelidade.
- **RF02 – Gerenciar temas:** Controle do portfólio de decorações disponíveis, mapeando o nome do tema, o valor padrão de tabela do aluguel e a cor da toalha de mesa correspondente.
- **RF03 – Registrar aluguel:** Formalização da ordem de locação, vinculando o cliente e o tema escolhido ao endereço completo da festa, data do evento, horário de início e horário de término.
- **RF04 – Aplicar desconto:** Mecanismo condicional (acionado via relacionamento `<<extend>>` no caso de uso) que intercepta o fechamento do contrato para conceder abatimentos financeiros a clientes antigos, registrando o valor final realmente cobrado.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Confiabilidade:** Travas lógicas integradas que bloqueiam agendamentos concorrentes, impedindo que o mesmo tema seja alugado para eventos com choque de datas e horários.
- **RNF02 – Usabilidade:** Interface amigável baseada em painéis visuais limpos e segmentados por abas, agilizando o atendimento e fechamento de pedidos no balcão.
- **RNF03 – Integridade:** Garantia de consistência relacional na base de dados, assegurando que um tema não seja deletado se houver contratos de aluguel ativos atrelados a ele.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A solução adota padrões modernos de arquitetura desacoplada e desenvolvimento guiado por gerenciamento reativo de estados:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Estruturação do fluxo em `Tabs` operacionais isoladas (Clientes, Temas e Contratos de Aluguel). Uso do componente `Table` para auditoria de faturamento real e de componentes de formulários com validação estrita.
- **Módulo de Notificações Reativas:** O pacote `@mantine/notifications` renderiza alertas instantâneos de sucesso ao fechar o contrato e pop-ups laranjas acionados caso o gatilho de validação de disponibilidade de datas seja violado.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Cliente` (`nome: String`, `telefone: String`)
  - `Aluguel` (`dataFesta: Date`, `horaInicio: Time`, `horaFinal: Time`, `endereco: String`, `valorCobrado: Double`)
  - `Tema` (`nomeTema: String`, `valorAluguel: Double`, `corToalha: String`)
  - `ItemTema` (`nomeItem: String`)
- **Lógica de Negócio Ativa (Métodos):**
  - `calcularTotal()`: Soma os valores bases e consolida o faturamento bruto da ordem aberta.
  - `validarDisponibilidade()`: Varre a linha do tempo de locações para checar conflitos no tema e data escolhidos.
  - `registrarEndereco()`: Formata e valida a string de localização física do evento.
  - `cadastrarTema()` e `adicionarItem()`: Permitem a expansão do portfólio e a vinculação de sub-itens de composição (ex: castelo, boneca da Cinderela).
  - `calcularDesconto()`: Processa a redução do valor nominal da tabela com base na regra de fidelidade de clientes antigos.
  - `atualizarTelefone()`: Permite a retificação célere de dados de contato do cliente.
- **Mecanismo de Persistência:** Listas estruturadas em memória controladas pelo React e salvas de forma persistente localmente via `localStorage` (Web Storage API) em formato JSON, evitando perda de contratos ao recarregar a página.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para carregar os seletores de calendários de festas, os componentes de formulários modulares e os pop-ups utilitários de notificação, abra o terminal do seu VS Code dentro da pasta raiz do seu projeto frontend (`vite-project/`) e execute os comandos:

```bash
# Instalação do núcleo de interface e ganchos de controle de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências extras de calendário, notificações e manipulação de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-04-festas-infantis/vite-project
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
