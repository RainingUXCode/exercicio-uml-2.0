# 🎓 AProfControl — Sistema de Gestão de Cursos, Turmas e Matrículas

Módulo de administração escolar e controle de secretaria desenvolvido como solução para a **Questão 05** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um sistema de gestão acadêmica projetado para a empresa AProf, automatizando o controle do catálogo de cursos, a alocação de turmas com seus respectivos professores e o fluxo completo de cadastro de alunos, matrículas e homologação de pagamentos.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema atende à necessidade de informatização das rotinas operacionais e financeiras da instituição de ensino, eliminando controles manuais e garantindo a consistência entre a oferta de turmas, o cálculo de honorários docentes e o registro de adimplência dos estudantes.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar curso:** Registro das modalidades de aperfeiçoamento profissional oferecidas pela instituição, capturando o nome do curso, a carga horaria, o conteúdo programático e o valor comercial de investimento.
- **RF02 – Gerenciar turmas:** Controle de abertura, manutenção e fechamento de turmas vinculadas a um curso, estabelecendo os prazos de data de início e término, além do horário das aulas.
- **RF03 – Cadastrar professor:** Cadastro do corpo docente da instituição, mapeando o nome do professor, telefone celular e o valor estipulado para a sua hora/aula.
- **RF04 – Realizar matrícula:** Módulo que executa a vinculação formal de um estudante a uma turma ativa, registrando a data da matrícula e o valor efetivamente pago pelo ingresso no curso.
- **RF05 – Cadastrar aluno:** Registro cadastral completo dos estudantes contendo nome, CPF, RG, data de nascimento, endereço completo e telefones de contato.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Usabilidade:** Rápida alternância de telas e interface limpa organizada por abas, otimizando o tempo de atendimento da secretaria durante períodos de alta demanda de matrículas.
- **RNF02 – Consistência:** Regras de validação de dados que asseguram a integridade relacional, impedindo a matrícula de alunos em turmas inexistentes ou o cadastro de cpfs inválidos.
- **RNF03 – Disponibilidade:** Alta taxa de atividade do sistema em ambiente local para garantir que os processos de matrículas ocorram sem interrupções operacionais.
- **RNF04 – Manutenibilidade:** Estrutura de código componentizada e bem documentada, facilitando a expansão modular do sistema da primeira para a segunda versão da aplicação.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A aplicação adota os conceitos de componentização e desenvolvimento baseado em estado (State Management):

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Estruturação da interface em `Tabs` operacionais isoladas (Cursos, Turmas, Professores, Alunos e Matrículas). Utilização do componente `Table` para listagem de alunos matriculados e formulários com validação nativa.
- **Módulo de Notificações Reativas:** O pacote `@mantine/notifications` renderiza pop-ups visuais instantâneos de sucesso ao confirmar pagamentos e emitir comprovantes, ou alertas laranjas caso ocorram erros de concorrência ou dados ausentes.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes e Atributos Mapeados:**
  - `Curso` (`nomeCurso: String`, `cargaHoraria: Int`, `conteudoProgramatico: String`, `valorCurso: Double`)
  - `Turma` (`dataInicio: Date`, `dataTermino: Date`, `horario: Time`)
  - `Professor` (`nomeProf: String`, `celular: String`, `valorHoraAula: Double`)
  - `Aluno` (`nomeAluno: String`, `cpf: String`, `rg: String`, `dataNascimento: Date`, `telefone: String`)
  - `Matricula` (`dataMatricula: Date`, `valorPago: Double`)
- **Lógica de Negócio Ativa (Métodos):**
  - `alocarProfessor()`: Realiza a associação entre um docente cadastrado e uma turma aberta, respeitando os horários vigentes.
  - `listarAlunos()`: Filtra e exibe o censo de estudantes vinculados de forma ativa a uma determinada turma.
  - `confirmarPagamento()`: Homologa o valor pago no ato da matrícula contra o valor configurado no curso correspondente.
  - `emitirComprovante()`: Gera o extrato de confirmação de vaga unindo dados do aluno, curso, turma e pagamento.
- **Mecanismo de Persistência:** Listas de objetos em memória gerenciadas pelo React e armazenadas de forma segura localmente via `localStorage` (Web Storage API) em formato JSON strings, prevenindo a perda de dados ao recarregar a página.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para habilitar os calendários de vigência de turmas, os formulários com máscaras de documentos e as notificações flutuantes do sistema escolar, abra o terminal do seu VS Code na pasta raiz do seu projeto frontend (`vite-project/`) e execute os comandos abaixo:

```bash
# Instalação do núcleo de componentes e ganchos utilitários do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências extras de calendários, alertas visuais e tratamento de tempo
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-05-cursos-aperfeicoamento/vite-project
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
