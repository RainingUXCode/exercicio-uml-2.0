# 📞 ModemCall — Sistema de Controle e Tarifação de Ligações Telefônicas

Módulo de auditoria de telecomunicações e automação de chamadas desenvolvido como solução para a **Questão 02** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um sistema de tarifação computacional projetado para o cenário de Bruna, automatizando o registro de chamadas via modem, o gerenciamento de uma agenda eletrônica de contatos e o cálculo algorítmico do número de pulsos e valor financeiro total com base em critérios de tempo e regras promocionais cronológicas.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa apoiar o controle financeiro doméstico, permitindo a conferência e a auditoria da fatura telefônica mensal contra os registros locais para checar a exatidão dos valores cobrados pela operadora.

### Requisitos Funcionais (RF)

- **RF01 – Registrar ligação:** Módulo core responsável por capturar os metadados da chamada (data, hora de início e número de destino) e computar a quantidade de minutos consumidos no exato momento em que a ligação é encerrada pelo modem.
- **RF02 – Gerenciar agenda:** Controle de contatos telefônicos locais, permitindo o armazenamento sistemático do nome da pessoa de contato e seu respectivo número de telefone.
- **RF03 – Selecionar destinatário:** Mecanismo dinâmico (acionado via relacionamento `<<extend>>` no caso de uso) que intercepta o fluxo de discagem para permitir que o usuário escolha um contato existente na agenda ou digite um número diretamente no terminal.
- **RF04 – Calcular pulsos:** Engine matemática (acionada via relacionamento `<<include>>` no caso de uso) que processa as regras de bilhetagem: contabiliza 1 pulso inicial fixo ao completar a chamada e injeta 1 pulso adicional a cada 4 minutos fechados de conversação (exceto em finais de semana promocionais, onde qualquer ligação custa exatamente 1 pulso).
- **RF05 – Listar ligações:** Filtro analítico de histórico que permite listar as chamadas efetuadas em um determinado período de tempo, exibindo o relatório consolidado com o valor acumulado a pagar.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Usabilidade:** Interface fluida projetada para o ecossistema desktop/web que agiliza a discagem direta e a busca rápida de nomes na agenda.
- **RNF02 – Desempenho:** Resposta em tempo real ao processar o encerramento da chamada, calculando e atualizando instantaneamente os contadores e o log do sistema.
- **RNF03 – Confiabilidade:** Precisão absoluta no relógio interno da aplicação para garantir a identificação correta dos finais de semana para aplicação automática do bônus promocional.
- **RNF04 – Disponibilidade:** Alta prontidão do serviço integrado ao modem para garantir que nenhuma chamada seja efetuada pelo computador sem o devido registro em plano de fundo.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A aplicação foi estruturada aplicando conceitos modernos de desenvolvimento baseado em eventos e controle dinâmico de estados:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Fluxo organizado em `Tabs` (Painel de Discagem/Chamada Ativa, Agenda de Contatos e Extrato de Ligações). O painel de histórico utiliza tabelas dinâmicas providas pelo componente `Table`.
- **Sistema Reativo de Alertas:** O pacote `@mantine/notifications` renderiza pop-ups flutuantes na tela emitindo um aviso sonoro/visual de chamada completada (mostrando a contagem de pulsos) e alertas de sucesso ao salvar novos números de telefone.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Contato` (`nome: String`, `telefone: String`)
  - `Ligacao` (`data: Date`, `hora: Time`, `minutos: Int`, `telefoneDestino: String`, `valorPulso: Double`)
- **Lógica de Negócio Ativa (Métodos):**
  - `calcularPulso()`: Avalia o tempo em minutos e o dia da semana. Se for sábado ou domingo, fixa o retorno em `1`. Caso contrário, executa a equação matemática: $Pulsos = 1 + \lfloor Minutos / 4 \rfloor$.
  - `calcularValorTotal()`: Multiplica o montante final de pulsos acumulados no período pelo valor padrão de tabela estipulado para chamadas locais (R$ 0,08 por pulso).
- **Mecanismo de Persistência:** Listas de contatos e o histórico de bilhetagem do modem gerenciados em memória e espelhados em tempo real na Web Storage API (`localStorage`) em formato JSON, impedindo a perda de registros mesmo que a aplicação seja reiniciada.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para carregar os gerenciadores de tempo de chamada, formulários de contatos e os pop-ups de status de linha telefônica, abra o terminal na pasta raiz do seu projeto frontend (`vite-project/`) e execute os comandos:

```bash
# Instalação do núcleo de interface e ganchos de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências complementares de calendário, notificações e manipulação de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-02-ligacoes-telefonicas/vite-project
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
