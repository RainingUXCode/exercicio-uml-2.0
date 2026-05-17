# 👶 PediatriaControl — Sistema de Agendamento e Triagem Clínica

Módulo de gerenciamento de fluxos médicos e controle de agendas desenvolvido como solução para a **Questão 11** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um ecossistema SPA (Single Page Application) projetado para gerenciar locais físicos de atendimento, automatizar a marcação de consultas infantis, gerenciar filas de encaixe sob demanda e validar a elegibilidade de convênios de saúde em tempo real.

---

## 📋 Cenário de Negócio & Requisitos

O sistema resolve problemas críticos de logística em clínicas pediátricas multimédicas, como a sobreposição de horários em salas físicas, o controle financeiro de consultas de revisão (puericultura) e a alocação dinâmica de encaixes de emergência.

### Requisitos Funcionais (RF)

- **RF01 – Gerenciar locais de atendimento:** Permite o cadastramento e controle dos consultórios físicos e filiais onde os pediatras atendem.
- **RF02 – Controlar agenda por local:** Vincula faixas de horários semanais disponíveis (dias, início e fim) a um consultório específico para evitar conflitos de salas.
- **RF03 – Marcar consultas:** Realiza o agendamento de atendimentos casando as chaves do paciente, médico, horário vago e local físico.
- **RF04 – Gerenciar encaixes:** Permite a inserção de consultas emergenciais na agenda, ativando uma flag de prioridade (`ehEncaixe`) sem sobrescrever os horários agendados.
- **RF05 – Identificar consultas de revisão:** Identifica se o atendimento é um retorno preventivo (`ehRevisao`), aplicando as regras de isenção de cobrança de honorários dentro do prazo legal.
- **RF06 – Cadastrar pacientes:** Registro cadastral das crianças (nome, contato) e mapeamento do plano de saúde ativo.
- **RF07 – Verificar convênios:** Valida de forma automatizada se o plano informado é coberto pelo consultório antes de consolidar a marcação.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Segurança:** Restrição rigorosa no acesso e visualização de históricos clínicos e dados sensíveis dos menores de idade.
- **RNF02 – Eficiência:** Processamento imediato do algoritmo de busca por brechas na agenda e cálculo de concorrência de horários.
- **RNF03 – Usabilidade:** Interface dividida em abas e painéis limpos, permitindo que o operador da recepção gerencie encaixes de forma ágil.
- **RNF04 – Integridade de dados:** Validações de concorrência que impedem que dois médicos ocupem a mesma sala física no mesmo instante ou que um paciente possua agendamentos duplicados.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

O sistema adota os princípios de componentização e desenvolvimento baseado em estado (State Management):

### 🎮 Camada de Visão (Frontend)

- **Tecnologias:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Utilização de `Tabs` para alternância de fluxos, `Table` para visualização das agendas por local e `Modal` para disparar os encaixes de urgência.
- **Módulo de Notificações:** `@mantine/notifications` injeta alertas visuais de sucesso ao agendar e pop-ups vermelhos caso o convênio seja recusado no teste de elegibilidade.

### 💾 Camada de Dados (Persistência)

- **Estrutura Relacional Simbólica (Mapeada em Classes):**
  - `Paciente` (nome, telefone, convenio)
  - `Consultorio` (bairro, endereco)
  - `Consulta` (data, horario, ehRevisao, ehEncaixe, valorConsulta)
  - `AgendaSemanal` (diaSemana, horaInicio, horaFim)
- **Mecanismo:** Os arrays de objetos estruturados que simulam as tabelas do banco de dados são mapeados através de hooks `useState` e sincronizados automaticamente na Web Storage API (`localStorage`) via JSON strings.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para que a interface gráfica renderize os seletores de data, as tabelas de consultas e os pop-ups de triagem corretamente, é necessário instalar o núcleo do Mantine e seus gerenciadores auxiliares. Abra o terminal do seu VS Code na pasta raiz do seu projeto frontend (`vite-project/`) e execute:

```bash
# Instalação do núcleo e ganchos de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação dos módulos de calendário, notificações reativas e manipulação de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-11-pediatria/vite-project
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
