import React, { useState, useEffect } from "react";
import {
  MantineProvider,
  Container,
  Grid,
  Card,
  Text,
  Title,
  TextInput,
  NumberInput,
  Button,
  Select,
  Table,
  Tabs,
  Badge,
  Group,
  Stack,
  Paper,
  Divider,
  Textarea,
  FileInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT (Modelagem de Classes) ---
interface Secao {
  id: string;
  nomeSecao: string;
}

interface Assinante {
  id: string;
  nome: string;
  email: string;
}

interface AnuncioBase {
  id: string;
  titulo: string;
  nomeContato: string;
  telefone1: string;
  telefone2: string;
  observacaoTelefone: string;
  valorProduto: number;
  dataInsercao: string;
  textoAnuncio: string;
  secaoId: string;
  tipo: "Simples" | "Destaque";
  precoAnuncio: number;
  expirado: boolean;
  imagem?: string; // Atributo específico do AnuncioDestaque
}

export default function App() {
  // --- ESTADOS DE PERSISTÊNCIA ---
  const [secoes, setSecoes] = useState<Secao[]>(() => {
    const salvas = localStorage.getItem("secoes");
    return salvas
      ? JSON.parse(salvas)
      : [
          { id: "1", nomeSecao: "Eletrônicos" },
          { id: "2", nomeSecao: "Imóveis" },
          { id: "3", nomeSecao: "Veículos" },
        ];
  });
  const [assinantes, setAssinantes] = useState<Assinante[]>(() =>
    JSON.parse(localStorage.getItem("assinantes") || "[]")
  );
  const [anuncios, setAnuncios] = useState<AnuncioBase[]>(() =>
    JSON.parse(localStorage.getItem("anuncios") || "[]")
  );

  // --- ESTADOS DOS FORMULÁRIOS ---
  // Anúncio
  const [titulo, setTitulo] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [observacaoTelefone, setObservacaoTelefone] = useState("");
  const [valorProduto, setValorProduto] = useState<string | number>(0);
  const [dataInsercao, setDataInsercao] = useState<Date | null>(new Date());
  const [textoAnuncio, setTextoAnuncio] = useState("");
  const [secaoSelecionada, setSecaoSelecionada] = useState<string | null>("");
  const [tipoAnuncio, setTipoAnuncio] = useState<string | null>("Simples");
  const [precoAnuncio, setPrecoAnuncio] = useState<string | number>(0);
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);

  // Assinante
  const [nomeAssinante, setNomeAssinante] = useState("");
  const [emailAssinante, setEmailAssinante] = useState("");

  // Filtro de Seção
  const [filtroSecao, setFiltroSecao] = useState<string | null>("Todos");

  useEffect(() => {
    localStorage.setItem("secoes", JSON.stringify(secoes));
    localStorage.setItem("assinantes", JSON.stringify(assinantes));
    localStorage.setItem("anuncios", JSON.stringify(anuncios));
  }, [secoes, assinantes, anuncios]);

  // --- MÉTODOS E REQUISITOS DO DIAGRAMA ---

  // Método: validarLimite() - Simula a regra de negócio de limite de anúncios ativos
  const validarLimite = (): boolean => {
    const ativos = anuncios.filter((a) => !a.expirado).length;
    if (ativos >= 20) {
      // Limite hipotético para demonstração do método
      notifications.show({
        title: "Limite Excedido",
        message: "Limite máximo de anúncios ativos atingido!",
        color: "red",
      });
      return false;
    }
    return true;
  };

  // Método: carregarImagem() - Transforma a imagem em string Base64 para persistir no estado
  const carregarImagem = (file: File | null): Promise<string> => {
    return new Promise((resolve) => {
      if (!file) resolve("");
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // RF01 + RF02: Cadastrar anúncio com diferenciação de tipos
  const handleCadastrarAnuncio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !secaoSelecionada) return;

    if (!validarLimite()) return;

    let imagemBase64 = "";
    if (tipoAnuncio === "Destaque" && arquivoImagem) {
      imagemBase64 = await carregarImagem(arquivoImagem); // Chamada do método carregarImagem()
    }

    const novoAnuncio: AnuncioBase = {
      id: crypto.randomUUID(),
      titulo,
      nomeContato,
      telefone1,
      telefone2,
      observacaoTelefone,
      valorProduto: Number(valorProduto),
      dataInsercao: dataInsercao
        ? dataInsercao.toLocaleDateString("pt-BR")
        : new Date().toLocaleDateString("pt-BR"),
      textoAnuncio,
      secaoId: secaoSelecionada,
      tipo: tipoAnuncio as "Simples" | "Destaque",
      precoAnuncio: Number(precoAnuncio),
      expirado: false, // Inicia ativo para controle posterior de expiração
      imagem: imagemBase64 || undefined,
    };

    setAnuncios([...anuncios, novoAnuncio]);
    notifications.show({
      title: "Anúncio Publicado",
      message: `Anúncio do tipo ${tipoAnuncio} cadastrado com sucesso!`,
      color: "green",
    });

    // Limpar formulário
    setTitulo("");
    setNomeContato("");
    setTelefone1("");
    setTelefone2("");
    setObservacaoTelefone("");
    setValorProduto(0);
    setTextoAnuncio("");
    setArquivoImagem(null);
    setPrecoAnuncio(0);
  };

  // RF03: Gerenciar assinaturas (Cadastrar Assinante)
  const handleCadastrarAssinante = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeAssinante || !emailAssinante) return;

    const novoAssinante: Assinante = {
      id: crypto.randomUUID(),
      nome: nomeAssinante,
      email: emailAssinante,
    };

    setAssinantes([...assinantes, novoAssinante]);
    notifications.show({
      title: "Inscrição Ativa",
      message: `${nomeAssinante} agora é um assinante!`,
      color: "teal",
    });
    setNomeAssinante("");
    setEmailAssinante("");
  };

  // RF05 + Método: verificarExpiracao() - Altera manualmente o status do anúncio
  const handleVerificarExpiracao = (id: string) => {
    setAnuncios(
      anuncios.map((a) => (a.id === id ? { ...a, expirado: !a.expirado } : a))
    );
    notifications.show({
      title: "Status de Expiração",
      message: "Controle de expiração do anúncio atualizado.",
      color: "orange",
    });
  };

  // Método: receberResumoDiario() - Simula o envio de e-mail informativo aos assinantes ativos
  const handleReceberResumoDiario = (email: string) => {
    const totalAtivos = anuncios.filter((a) => !a.expirado).length;
    alert(`
      [Simulação de Email Enviado para: ${email}]
      Assunto: Resumo Diário de Classificados
      -----------------------------------------------
      Olá Assinante, temos atualmente ${totalAtivos} anúncio(s) ativo(s) na plataforma esperando por você!
      Acesse a aplicação para filtrar as novidades por seção.
    `);
  };

  // RF04: Filtrar por seção
  const anunciosFiltrados =
    filtroSecao === "Todos"
      ? anuncios
      : anuncios.filter((a) => a.secaoId === filtroSecao);

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      {/* Header */}
      <div className="bg-slate-800 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                Portal de Classificados & Anúncios
              </Title>
              <Text size="sm" className="opacity-80">
                Mapeamento e Execução Orientada a Objetos
              </Text>
            </div>
            <Badge size="lg" color="orange" variant="filled">
              Questão 06
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="anuncios" color="orange" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="anuncios" className="font-medium">
              📢 Painel de Anúncios
            </Tabs.Tab>
            <Tabs.Tab value="criar" className="font-medium">
              ✍️ Publicar Anúncio
            </Tabs.Tab>
            <Tabs.Tab value="assinaturas" className="font-medium">
              🤝 Assinaturas & Resumos
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB: VISUALIZAR E FILTRAR ANÚNCIOS (RF04 + RF05) */}
          <Tabs.Panel value="anuncios">
            <Stack gap="md">
              <Card shadow="sm" withBorder p="md">
                <Group justify="space-between">
                  <Text className="font-bold text-gray-700">
                    Filtrar por Seção:
                  </Text>
                  <Select
                    placeholder="Filtrar seção"
                    data={[
                      { value: "Todos", label: "Ver Todas as Seções" },
                      ...secoes.map((s) => ({
                        value: s.id,
                        label: s.nomeSecao,
                      })),
                    ]}
                    value={filtroSecao}
                    onChange={(val) => setFiltroSecao(val)}
                    className="w-64"
                  />
                </Group>
              </Card>

              {anunciosFiltrados.length === 0 ? (
                <Text
                  size="sm"
                  className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed"
                >
                  Nenhum anúncio encontrado para a seção selecionada.
                </Text>
              ) : (
                <Grid>
                  {anunciosFiltrados.map((a) => {
                    const secaoObj = secoes.find((s) => s.id === a.secaoId);
                    return (
                      <Grid.Col span={{ base: 12, md: 6 }} key={a.id}>
                        <Card
                          shadow="sm"
                          padding="lg"
                          radius="md"
                          withBorder
                          className={`h-full relative ${
                            a.expirado ? "bg-gray-100 opacity-60" : ""
                          }`}
                        >
                          <Group justify="space-between" className="mb-2">
                            <Badge
                              color={a.tipo === "Destaque" ? "purple" : "blue"}
                              variant="filled"
                            >
                              Anúncio {a.tipo}
                            </Badge>
                            <Badge color={secaoObj ? "gray" : "red"}>
                              {secaoObj ? secaoObj.nomeSecao : "Sem seção"}
                            </Badge>
                          </Group>

                          <Title
                            order={3}
                            className={`text-xl font-bold ${
                              a.expirado
                                ? "line-through text-gray-500"
                                : "text-slate-800"
                            }`}
                          >
                            {a.titulo}
                          </Title>
                          <Text size="xs" color="dimmed" className="mb-2">
                            Inserido em: {a.dataInsercao}
                          </Text>

                          {a.tipo === "Destaque" && a.imagem && (
                            <div className="my-3 rounded-md overflow-hidden border bg-black flex justify-center max-h-48">
                              <img
                                src={a.imagem}
                                alt="Destaque"
                                className="object-contain max-h-48 w-full"
                              />
                            </div>
                          )}

                          <Text
                            size="sm"
                            className="text-gray-600 line-clamp-3 mb-4 flex-grow"
                          >
                            {a.textoAnuncio}
                          </Text>

                          <Divider className="my-2" />

                          <Group justify="space-between" className="mt-2">
                            <div>
                              <Text size="xs" color="dimmed">
                                Valor do Produto:
                              </Text>
                              <Text
                                size="md"
                                className="font-bold text-green-600"
                              >
                                R$ {a.valorProduto.toFixed(2)}
                              </Text>
                            </div>
                            <div>
                              <Text size="xs" color="dimmed">
                                Custo do Anúncio:
                              </Text>
                              <Text
                                size="sm"
                                className="font-semibold text-gray-700"
                              >
                                R$ {a.precoAnuncio.toFixed(2)}
                              </Text>
                            </div>
                          </Group>

                          <div className="bg-slate-50 p-2 rounded mt-3 text-xs text-gray-600">
                            <strong>Contato:</strong> {a.nomeContato} |{" "}
                            {a.telefone1} {a.telefone2 && `/ ${a.telefone2}`}{" "}
                            <br />
                            <span className="italic">
                              Obs: {a.observacaoTelefone || "Nenhuma"}
                            </span>
                          </div>

                          <Group justify="flex-end" className="mt-4">
                            <Button
                              size="xs"
                              variant="light"
                              color={a.expirado ? "green" : "orange"}
                              onClick={() => handleVerificarExpiracao(a.id)}
                            >
                              {a.expirado
                                ? "Reativar Anúncio"
                                : "RF05 – Forçar Expiração"}
                            </Button>
                          </Group>
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              )}
            </Stack>
          </Tabs.Panel>

          {/* TAB: CADASTRAR ANÚNCIO (RF01 + RF02) */}
          <Tabs.Panel value="criar">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} className="mb-4 text-gray-700">
                Preencha os Atributos da Classe Anuncio
              </Title>
              <form onSubmit={handleCadastrarAnuncio}>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <TextInput
                        label="Título do Anúncio"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                      />
                      <TextInput
                        label="Nome do Contato"
                        value={nomeContato}
                        onChange={(e) => setNomeContato(e.target.value)}
                        required
                      />
                      <TextInput
                        label="Telefone 1"
                        placeholder="(00) 00000-0000"
                        value={telefone1}
                        onChange={(e) => setTelefone1(e.target.value)}
                        required
                      />
                      <TextInput
                        label="Telefone 2 (Opcional)"
                        placeholder="(00) 00000-0000"
                        value={telefone2}
                        onChange={(e) => setTelefone2(e.target.value)}
                      />
                      <TextInput
                        label="Observações do Telefone"
                        placeholder="Ex: Apenas WhatsApp"
                        value={observacaoTelefone}
                        onChange={(e) => setObservacaoTelefone(e.target.value)}
                      />
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <NumberInput
                        label="Valor do Produto (R$)"
                        min={0}
                        decimalScale={2}
                        value={valorProduto}
                        onChange={(val) => setValorProduto(val)}
                        required
                      />
                      <DateInput
                        label="Data de Inserção"
                        value={dataInsercao}
                        onChange={(val) => setDataInsercao(val as any)}
                        required
                      />
                      <Select
                        label="Seção Alvo"
                        placeholder="Escolha a seção"
                        data={secoes.map((s) => ({
                          value: s.id,
                          label: s.nomeSecao,
                        }))}
                        value={secaoSelecionada}
                        onChange={(val) => setSecaoSelecionada(val)}
                        required
                      />
                      <Select
                        label="Tipo de Anúncio (Especialização)"
                        data={[
                          { value: "Simples", label: "Anúncio Simples" },
                          { value: "Destaque", label: "Anúncio Destaque" },
                        ]}
                        value={tipoAnuncio}
                        onChange={(val) => setTipoAnuncio(val)}
                        required
                      />
                      <NumberInput
                        label="Preço cobrado pelo Anúncio (R$)"
                        min={0}
                        decimalScale={2}
                        value={precoAnuncio}
                        onChange={(val) => setPrecoAnuncio(val)}
                        required
                      />
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Textarea
                      label="Texto do Anúncio (Descrição)"
                      rows={3}
                      value={textoAnuncio}
                      onChange={(e) => setTextoAnuncio(e.target.value)}
                      required
                    />
                  </Grid.Col>

                  {tipoAnuncio === "Destaque" && (
                    <Grid.Col span={12}>
                      <FileInput
                        label="Atributo Especial: Carregar Imagem do Destaque"
                        placeholder="Selecione um arquivo de imagem"
                        accept="image/*"
                        value={arquivoImagem}
                        onChange={setArquivoImagem}
                        required
                      />
                    </Grid.Col>
                  )}

                  <Grid.Col span={12} className="mt-2">
                    <Button type="submit" color="orange" fullWidth size="md">
                      Publicar Anúncio
                    </Button>
                  </Grid.Col>
                </Grid>
              </form>
            </Card>
          </Tabs.Panel>

          {/* TAB: GERENCIAR ASSINATURAS (RF03) */}
          <Tabs.Panel value="assinaturas">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    RF03 – Ingressar Assinante
                  </Title>
                  <form onSubmit={handleCadastrarAssinante}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome Completo"
                        value={nomeAssinante}
                        onChange={(e) => setNomeAssinante(e.target.value)}
                        required
                      />
                      <TextInput
                        label="E-mail"
                        type="email"
                        placeholder="nome@provedor.com"
                        value={emailAssinante}
                        onChange={(e) => setEmailAssinante(e.target.value)}
                        required
                      />
                      <Button type="submit" color="teal" fullWidth>
                        Registrar Assinatura
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Lista de Assinantes Cadastrados
                  </Title>
                  {assinantes.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum assinante associado ao sistema.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nome</Table.Th>
                          <Table.Th>E-mail</Table.Th>
                          <Table.Th>Ações OO</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {assinantes.map((ass) => (
                          <Table.Tr key={ass.id}>
                            <Table.Td className="font-medium">
                              {ass.nome}
                            </Table.Td>
                            <Table.Td>{ass.email}</Table.Td>
                            <Table.Td>
                              <Button
                                size="xs"
                                color="teal"
                                variant="outline"
                                onClick={() =>
                                  handleReceberResumoDiario(ass.email)
                                }
                              >
                                Método: receberResumoDiario()
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </MantineProvider>
  );
}
