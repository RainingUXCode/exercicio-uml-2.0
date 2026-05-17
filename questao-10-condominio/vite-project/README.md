# 🏢 CondomínioControl — Sistema de Gestão e Rateio de Despesas Mensais

Módulo de automação financeira e controle administrativo desenvolvido como solução para a **Questão 10** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um ecossistema projetado para gerenciar unidades residenciais, automatizar o lançamento de despesas fixas ou variáveis, calcular a cota condominial proporcional por fração ideal (número de quartos) e processar pagamentos com aplicação dinâmica de multas por atraso.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa apoiar a administração e a prestação de contas do condomínio, eliminando cálculos manuais complexos de rateio fracionado e organizando o histórico de adimplência das unidades.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar apartamento:** Registro das unidades do condomínio, contendo o número da porta, a quantidade de quartos para fins de cálculo de rateio e o tipo de ocupação atual.
- **RF02 – Gerenciar proprietários:** Controle do cadastro das pessoas que possuem imóveis no prédio, suportando o cenário onde um único proprietário possui múltiplos apartamentos.
- **RF03 – Lançar despesas:** Registro das contas do condomínio (fixas ou variáveis) atreladas a um mês de referência, permitindo também lançamentos isolados para unidades específicas (ex: taxa de salão de festas).
- **RF04 – Calcular condomínio:** Engine automatizada que realiza o somatório de quartos de todo o prédio, divide o valor total das despesas por esse coeficiente e multiplica pelo número de quartos correspondente de cada apartamento.
- **RF05 – Processar pagamentos:** Controle da baixa dos boletos emitidos, registrando a data em que o pagamento foi efetuado e o montante financeiro final recebido.
- **RF06 – Aplicar multas:** Aplicação automática de taxa de 2% para pagamentos em atraso dentro do mês corrente, ou atualização automática para 5% caso o condômino opte por postergar o pagamento da multa para o condomínio do mês subsequente.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Segurança:** Restrição no acesso aos dados de contato dos proprietários e integridade nos registros de balanços financeiros do condomínio.
- **RNF02 – Eficiência:** Processamento imediato do cálculo de rateio total do prédio, mesmo sob o lançamento concomitante de múltiplas despesas.
- **RNF03 – Usabilidade:** Interface amigável baseada em fluxos visuais claros, simplificando a operação direta realizada pela síndica.
- **RNF04 – Precisão matemática:** Garantia de exatidão de centavos no cálculo de divisão proporcional e aplicação dos percentuais de juros e multas acumuladas.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A solução foi estruturada utilizando padrões modernos de desenvolvimento de software baseados em componentização avançada:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Utilização do sistema de `Tabs` para segmentar os painéis de apartamentos, lançamentos de despesas e conferência de caixa. Entrada de dados via `NumberInput` para controle preciso de valores monetários.
- **Gerenciador de Notificações:** Uso do `@mantine/notifications` para exibir alertas verdes instantâneos na homologação de pagamentos e avisos laranjas caso uma unidade seja sinalizada com multa pendente.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Apartamento` (`numPorta: Int`, `qtdQuartos: Int`, `tipoOcupacao: String`)
  - `Proprietario` (`nome: String`, `telefone: String`)
  - `Despesa` (`referencia: String`, `tipo: String`, `valor: Double`)
  - `CondominioMensal` (`dataVencimento: Date`, `dataPagamento: Date`, `valorTotal: Double`, `percentualMulta: Double`)
- **Lógica de Negócio Ativa (Métodos):**
  - `calcularCotaMensal()`: Executa o algoritmo de divisão proporcional baseado no censo de quartos do prédio.
  - `alterarOcupacao()`: Atualiza dinamicamente o status da porta (proprietário, inquilino ou vazio).
  - `calcularMulta()`: Avalia o atraso e aplica o gatilho de 2% ou 5% conforme a regra de postergação.
  - `verificarStatusPagamento()` e `emitirRecibo()`: Atualizam o fluxo de caixa do condomínio.
- **Mecanismo de Persistência:** Dados estruturados salvos localmente via `localStorage` (Web Storage API) em formato JSON, mantendo as informações seguras contra recarregamentos de página.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para habilitar os seletores de data de vencimento, os blocos de notificações reativas e os componentes de formulários do sistema de condomínio, navegue até a pasta raiz do seu projeto frontend (`vite-project/`) pelo terminal e execute:

```bash
# Instalação do núcleo e ganchos de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências de calendário, notificações e biblioteca de tratamento de datas
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-10-condominio/vite-project
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
