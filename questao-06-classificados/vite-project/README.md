# 🌐 WebClassifieds — Portal de Classificados Virtuais e Automação de Ofertas

Módulo de comércio eletrônico e distribuição automatizada de mídia desenvolvido como solução para a **Questão 06** do simulado de Engenharia de Software e Modelagem de Sistemas. A aplicação consiste em um portal de anúncios web que gerencia a inserção de ofertas com base em regras estritas de contagem de palavras e precificação por tipo de exposição, automatizando o controle de expiração cronológica e a distribuição diária de resumos informativos via e-mail para listas de assinantes segmentadas por seções de interesse.

---

## 📋 Cenário de Negócio & Requisitos Oficiais

O sistema visa automatizar o serviço de classificados virtuais de Dalila, organizando o fluxo de receitas por anúncio (simples ou destaque), aplicando travas de segurança textuais para limites de descrição e otimizando o engajamento de usuários cadastrados por e-mail.

### Requisitos Funcionais (RF)

- **RF01 – Cadastrar anúncio:** Permite registrar ofertas capturando metadados fundamentais (título, valor do produto, dados e telefones de contato, observações e o texto descritivo).
- **RF02 – Diferenciar tipos de anúncio:** Mecanismo condicional (acionado via relacionamento `<<include>>` no caso de uso) que segmenta a inserção entre Anúncios Simples (limite de 20 palavras por R$ 2,00) e Anúncios Destaque de Página (limite de 50 palavras e inclusão de imagem por R$ 5,00).
- **RF03 – Gerenciar assinaturas:** Cadastro e manutenção de perfis de e-mail de usuários interessados em receber boletins informativos sem necessidade de tráfego direto no portal.
- **RF04 – Filtrar por seção:** Módulo de categorização que agrupa ofertas em seções lógicas (ex: Computador, Imóvel) para otimizar pesquisas e indexar os filtros de interesse dos assinantes.
- **RF05 – Controlar a expiração do anúncio:** Rotina interna (acionada via relacionamento `<<include>>` no caso de uso) que avalia a data de inserção e desativa o anúncio de forma autônoma após o ciclo limite de 15 dias de veiculação.

### Requisitos Não-Funcionais (RNF)

- **RNF01 – Desempenho:** Processamento otimizado na agregação e renderização de tabelas e contadores consolidados de ofertas gerados no resumo diário.
- **RNF02 – Eficiência:** Processamento em lote de envio em massa de e-mails de forma assíncrona, prevenindo lentidão no servidor de hospedagem.
- **RNF03 – Usabilidade:** Rápida inclusão de novos termos no formulário e navegação facilitada em abas para leitura de seções por usuários não técnicos.

---

## 🏗️ Arquitetura do Sistema & Engenharia de Software

A solução foi estruturada aplicando conceitos avançados de orientação a objetos (Polimorfismo e Herança) e componentização de interface:

### 🎮 Camada de Visão (Frontend)

- **Tecnologias Core:** React, TypeScript, Vite, Tailwind CSS.
- **Componentes de Interface (Mantine UI):** Emprego do componente `Tabs` para separação entre a visualização da timeline de anúncios públicos, o formulário de cadastro de ofertas e o gerenciador de assinaturas. Uso de tabelas estilizadas via `Table` para replicar o design dos relatórios de inserções e resumo consolidado.
- **Sistema Reativo de Alertas:** O pacote `@mantine/notifications` renderiza pop-ups imediatos de sucesso ao cadastrar e avisos vermelhos de erro caso o limite de palavras por tipo de anúncio seja ultrapassado.

### 💾 Camada de Dados & Métodos Implementados

- **Estrutura de Classes, Atributos e Relacionamento de Herança:**
  - `Anuncio` (Classe Base: `titulo: String`, `nomeContato: String`, `telefone1: String`, `telefone2: String`, `observacaoTelefone: String`, `valorProduto: Double`, `dataInsercao: Date`, `textoAnuncio: String`)
  - `AnuncioSimples` (Classe Filha: herda de `Anuncio` e adiciona `precoAnuncio: Double`)
  - `AnuncioDestaque` (Classe Filha: herda de `Anuncio` e adiciona `precoAnuncio: Double`, `imagem: Image`)
  - `Secao` (`nomeSecao: String`)
  - `Assinante` (`nome: String`, `email: String`)
- **Lógica de Negócio Ativa (Métodos):**
  - `verificarExpiracao()`: Varre a base calculando a diferença de dias frente à data atual para expirar registros obsoletos.
  - `validarLimite()`: Algoritmo de tokenização que quebra a string `textoAnuncio`, ignorando metadados e checando o limite de 20 ou 50 palavras.
  - `carregarImagem()`: Processa uploads e vincula buffers de imagem às instâncias de anúncios em destaque.
  - `receberResumoDiario()`: Consolida o censo de novas ofertas do dia e monta o template HTML de distribuição para os assinantes.
- **Mecanismo de Persistência:** Dados tipados salvos na Web Storage API (`localStorage`) em formato JSON, preservando a linha do tempo e as configurações de assinaturas a cada nova sessão.

---

## 🚀 Como Executar o Projeto & Instalar Dependências

### 📦 1. Instalação do Ecossistema Mantine UI

Para habilitar os contadores de palavras reativos, os gerenciadores de formulários e os pop-ups utilitários de notificação do portal, abra o terminal na pasta raiz do seu projeto frontend (`vite-project/`) e execute:

```bash
# Instalação do núcleo de interface e utilitários de gerenciamento de estado do Mantine
npm install @mantine/core @mantine/hooks

# Instalação das dependências extras de calendário, notificações e formatação cronológica
npm install @mantine/dates @mantine/notifications dayjs
```

### 💻 2. Inicialização do Servidor Local

Após a conclusão do download dos pacotes de componentes, execute os seguintes comandos para subir a aplicação:

Certifique-se de que o terminal está apontando para o diretório do frontend:

```bash
cd questao-06-classificados/vite-project
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
