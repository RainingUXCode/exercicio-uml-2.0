# 📝 TaskFlow — Sistema de Gestão de Projetos, Tarefas e Itens de Execução

Módulo de produtividade pessoal e controle logístico desenvolvido como solução para a **Questão 01** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste num motor de acompanhamento de projetos planeado para o cenário de Arnaldo, automatizando o registo de tarefas complexas, a fragmentação destas em itens menores de execução, o cálculo reativo e ponderado do progresso real e a movimentação automática de cartões para a listagem de concluídos assim que o teto de 100% é atingido.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa substituir controlos manuais e em papel (como listas de tarefas analógicas), mitigando o esquecimento de prazos-limite, a falta de precisão no cálculo de evolução de metas fracionadas e a desorganização visual do fluxo de trabalho.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar tarefa:** Registo estruturado de metas de entrega, capturando dados cruciais como o nome do objetivo, um detalhamento descritivo contextual, a data limite de execução e o nível de prioridade (parametrizado através de valores decimais/reais para suportar níveis intermédios).
- **RF02 – Gerenciar itens de execução:** Permite decompor uma tarefa principal numa sublista de passos operacionais detalhados, indexando a descrição da ação, a data efetiva de conclusão e a sua respetiva percentagem de peso sobre o todo.
- **RF03 – Calcular automaticamente o progresso:** Engine matemática reativa que varre os subitens validados como concluídos, soma os seus pesos e atualiza em tempo real o progresso global da tarefa principal.
- **RF04 – Realizar conclusão automaticamente:** Rotina de automação de fluxo (acionada via relacionamento `<<include>>` no caso de uso) que monitoriza o progresso global; ao computar exatamente 100% de execução, altera o status da tarefa e move-a imediatamente para a coleção de tarefas concluídas.
- **RF05 – Excluir tarefa:** Permite a remoção lógica ou física de registos do painel, garantindo que tarefas obsoletas ou concluídas possam ser limpas do histórico de trabalho.
- **RF06 – Listar tarefas:** Painel de visualização unificado que exibe a listagem cronológica e hierárquica das metas pendentes, facilitando a tomada de decisão com base no nível decimal de prioridade.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Segurança:** Restrição de acessos e garantias de integridade estrutural, assegurando que as percentagens de avanço não sofram adulterações externas fora das regras de negócio.
- **RNF02 – Armazenamento:** Capacidade de retenção de dados de forma leve e responsiva, suportando o armazenamento persistente local sem onerar o ecossistema do dispositivo.
- **RNF03 – Portabilidade:** Arquitetura híbrida e responsiva planeada nativamente para funcionar de forma integrada e fluida tanto em ecossistemas Web (browsers) como em dispositivos móveis (Smartphones).
- **RNF04 – Usabilidade:** Interface intuitiva baseada em padrões de cartões interativos (estilo Kanban), facilitando o acompanhamento visual do progresso de tarefas por parte de Arnaldo.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A aplicação foi desenhada sob os pilares da modularidade e do controlo reativo de estados, assegurando alta coesão e baixo acoplamento:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Segmentação do fluxo operacional através de `Tabs` lógicas (Tarefas Ativas, Adicionar Metas, e Histórico de Concluídas). Uso do componente `Progress` para renderizar visualmente barras de evolução de progresso e `NumberInput` para manipulação de prioridades decimais.
- **Módulo de Feedback Reativo:** O pacote `@mantine/notifications` emite pop-ups instantâneos verdes ao concluir subitens e notificações especiais com efeitos visuais de celebração quando uma tarefa principal atinge os 100% e é movida de lista.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Tarefa` (`nome: String`, `prioridade: Double`, `dataLimite: Date`, `percentualConcluido: Double`, `detalhamento: String`)
  - `ItemExecucao` (`descricao: String`, `percentualItem: Double`, `dataConclusao: Date`)
- **Lógica de Negócio Ativa (Métodos):**
  - `atualizarPercentual()`: Varre a coleção de subitens executados, totaliza as frações e atualiza o atributo `percentualConcluido` da classe pai.
  - `moverConcluidas()`: Monitoriza a transição de estado da tarefa. Se o valor for igual a 100, retira a instância do array ativo e injeta-a na lista de histórico.
  - `validarPercentual()`: Gatilho de segurança que impede que a soma dos pesos dos subitens de uma tarefa ultrapasse o teto matemático de 100%.
- **Mecanismo de Persistência:** Listas de objetos estruturadas em memória através de hooks de estado do React e sincronizadas de forma persistente no `localStorage` (Web Storage API) em formato de strings JSON, garantindo que o planeamento de tarefas não se perca ao reiniciar o dispositivo.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para habilitar os formulários de inserção de prioridades reais, as barras de progresso dinâmicas e o sistema de notificações que monitoriza as tarefas concluídas de Arnaldo, abra o terminal do seu VS Code na pasta raiz do seu projeto frontend (`vite-project/`) e execute os seguintes comandos:

```bash
# Instalação do núcleo de interface e ganchos de controlo de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências extras de calendário, alertas visuais e biblioteca de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-01-controle-tarefas/vite-project
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
