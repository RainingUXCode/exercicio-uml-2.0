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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT (Modelagem das Classes das Imagens) ---
interface Caixa {
  id: string;
  cor: string;
  etiqueta: string;
  numero: number;
}

interface Revista {
  id: string;
  tipoColecao: string;
  numEdicao: number;
  ano: number;
  caixaId: string; // Relacionamento OBRIGATÓRIO descrito no minicenário
}

interface Amigo {
  id: string;
  nome: string;
  nomeMae: string;
  telefone: string;
  localOrigem: string; // Prédio ou Escola
}

interface Emprestimo {
  id: string;
  amigoId: string;
  revistaId: string;
  dataEmprestimo: string;
  dataDevolucao: string | null; // Null significa que o empréstimo está ativo (pendente de devolução)
}

export default function App() {
  // --- ESTADOS DE PERSISTÊNCIA DOS DADOS ---
  const [caixas, setCaixas] = useState<Caixa[]>(() => {
    const salvas = localStorage.getItem("clube_caixas");
    return salvas
      ? JSON.parse(salvas)
      : [
          { id: "c1", cor: "Azul", etiqueta: "Super-Heróis", numero: 101 },
          {
            id: "c2",
            cor: "Vermelha",
            etiqueta: "Turma da Mônica",
            numero: 102,
          },
        ];
  });

  const [revistas, setRevistas] = useState<Revista[]>(() =>
    JSON.parse(localStorage.getItem("clube_revistas") || "[]")
  );
  const [amigos, setAmigos] = useState<Amigo[]>(() =>
    JSON.parse(localStorage.getItem("clube_amigos") || "[]")
  );
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>(() =>
    JSON.parse(localStorage.getItem("clube_emprestimos") || "[]")
  );

  // --- ESTADOS DOS FORMULÁRIOS ---
  // Revista (RF01)
  const [tipoColecao, setTipoColecao] = useState("");
  const [numEdicao, setNumEdicao] = useState<string | number>(0);
  const [anoRevista, setAnoRevista] = useState<string | number>(2026);
  const [caixaIdSelecionada, setCaixaIdSelecionada] = useState<string | null>(
    ""
  );

  // Caixa (RF02)
  const [corCaixa, setCorCaixa] = useState("");
  const [etiquetaCaixa, setEtiquetaCaixa] = useState("");
  const [numeroCaixa, setNumeroCaixa] = useState<string | number>(0);

  // Amigo (RF03)
  const [nomeAmigo, setNomeAmigo] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [telefoneAmigo, setTelefoneAmigo] = useState("");
  const [localOrigem, setLocalOrigem] = useState<string | null>("Prédio");

  // Empréstimo (RF04)
  const [amigoSelecionado, setAmigoSelecionado] = useState<string | null>("");
  const [revistaSelecionada, setRevistaSelecionada] = useState<string | null>(
    ""
  );
  const [dataEmprestimoForm, setDataEmprestimoForm] = useState<Date | null>(
    new Date()
  );

  // Sincronização automática com o LocalStorage
  useEffect(() => {
    localStorage.setItem("clube_caixas", JSON.stringify(caixas));
    localStorage.setItem("clube_revistas", JSON.stringify(revistas));
    localStorage.setItem("clube_amigos", JSON.stringify(amigos));
    localStorage.setItem("clube_emprestimos", JSON.stringify(emprestimos));
  }, [caixas, revistas, amigos, emprestimos]);

  // --- MÉTODOS OPERACIONAIS E REGRAS DE NEGÓCIO OO ---

  // RF01 – Cadastrar revista
  const handleCadastrarRevista = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoColecao || !caixaIdSelecionada) return;

    const novaRevista: Revista = {
      id: crypto.randomUUID(),
      tipoColecao: tipoColecao.trim(),
      numEdicao: Number(numEdicao),
      ano: Number(anoRevista),
      caixaId: caixaIdSelecionada,
    };

    setRevistas([...revistas, novaRevista]);
    setTipoColecao("");
    setNumEdicao(0);
    notifications.show({
      title: "Revista Cadastrada",
      message: `Revista "${tipoColecao}" guardada na caixa selecionada.`,
      color: "green",
    });
  };

  // RF02 – Gerenciar caixas
  const handleCadastrarCaixa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corCaixa || !etiquetaCaixa) return;

    const novaCaixa: Caixa = {
      id: crypto.randomUUID(),
      cor: corCaixa.trim(),
      etiqueta: etiquetaCaixa.trim(),
      numero: Number(numeroCaixa),
    };

    setCaixas([...caixas, novaCaixa]);
    setCorCaixa("");
    setEtiquetaCaixa("");
    setNumeroCaixa(0);
    notifications.show({
      title: "Caixa Adicionada",
      message: `Caixa Nº ${novaCaixa.numero} pronta para armazenar gibis.`,
      color: "blue",
    });
  };

  // RF03 – Cadastrar amigo
  const handleCadastrarAmigo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeAmigo || !localOrigem) return;

    const novoAmigo: Amigo = {
      id: crypto.randomUUID(),
      nome: nomeAmigo.trim(),
      nomeMae: nomeMae.trim(),
      telefone: telefoneAmigo.trim(),
      localOrigem: localOrigem,
    };

    setAmigos([...amigos, novoAmigo]);
    setNomeAmigo("");
    setNomeMae("");
    setTelefoneAmigo("");
    notifications.show({
      title: "Amigo Registrado",
      message: `"${novoAmigo.nome}" cadastrado no Clube da Leitura.`,
      color: "teal",
    });
  };

  // Método: verificarDisponibilidade() + Validações Estritas (RF05)
  const verificarDisponibilidade = (
    idRevista: string,
    idAmigo: string
  ): boolean => {
    // Regra 1: Verificar se a revista já está emprestada no momento (sem data de devolução)
    const revistaEmprestada = emprestimos.some(
      (emp) => emp.revistaId === idRevista && emp.dataDevolucao === null
    );
    if (revistaEmprestada) {
      notifications.show({
        title: "Validação Recusada",
        message: "Esta revista já está emprestada para outro amigo no momento!",
        color: "red",
      });
      return false;
    }

    // Regra 2: Verificar se o amigo já possui algum empréstimo ativo ("Cada criança só pode pegar uma revista por empréstimo")
    const amigoComGibi = emprestimos.some(
      (emp) => emp.amigoId === idAmigo && emp.dataDevolucao === null
    );
    if (amigoComGibi) {
      notifications.show({
        title: "Validação Recusada",
        message:
          "Este amigo já está com uma revista emprestada e precisa devolvê-la primeiro!",
        color: "red",
      });
      return false;
    }

    return true;
  };

  // RF04 – Registrar empréstimo (Invocando internamente a validação obrigatória do diagrama)
  const handleRegistrarEmprestimo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amigoSelecionado || !revistaSelecionada || !dataEmprestimoForm) return;

    // Dispara o método OO de Validação Obrigatória (RF05 / Include)
    const valido = verificarDisponibilidade(
      revistaSelecionada,
      amigoSelecionado
    );
    if (!valido) return;

    const novoEmprestimo: Emprestimo = {
      id: crypto.randomUUID(),
      amigoId: amigoSelecionado,
      revistaId: revistaSelecionada,
      dataEmprestimo: dataEmprestimoForm.toLocaleDateString("pt-BR"),
      dataDevolucao: null, // Inicia pendente de devolução
    };

    setEmprestimos([...emprestimos, novoEmprestimo]);
    setAmigoSelecionado("");
    setRevistaSelecionada("");
    notifications.show({
      title: "Empréstimo Homologado",
      message: "Movimentação autorizada e registrada com sucesso!",
      color: "green",
    });
  };

  // Método: registrarDevolucao()
  const handleRegistrarDevolucao = (idEmprestimo: string) => {
    setEmprestimos(
      emprestimos.map((emp) =>
        emp.id === idEmprestimo
          ? { ...emp, dataDevolucao: new Date().toLocaleDateString("pt-BR") }
          : emp
      )
    );
    notifications.show({
      title: "Devolução Concluída",
      message: "A revista retornou para a caixa e está disponível novamente.",
      color: "gray",
    });
  };

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      {/* Header */}
      <div className="bg-emerald-700 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                Clube da Leitura — Gestão Operacional
              </Title>
              <Text size="sm" className="opacity-80">
                Controle Arquitetural de Acervo de Gibis e Empréstimos Ativos
              </Text>
            </div>
            <Badge
              size="lg"
              color="emerald"
              variant="filled"
              className="bg-emerald-800"
            >
              Questão 09
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="emprestimos" color="emerald" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="emprestimos" className="font-medium">
              📖 Empréstimos Ativos
            </Tabs.Tab>
            <Tabs.Tab value="cadastro_revistas" className="font-medium">
              📚 Revistas e Caixas
            </Tabs.Tab>
            <Tabs.Tab value="amigos" className="font-medium">
              👦 Amigos do Clube
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: OPERAÇÃO DE EMPRÉSTIMOS (RF04 + RF05 + Métodos) */}
          <Tabs.Panel value="emprestimos">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Registrar Empréstimo
                  </Title>
                  <form onSubmit={handleRegistrarEmprestimo}>
                    <Stack gap="sm">
                      <Select
                        label="Amiguinho Solicitante"
                        placeholder="Quem vai pegar a revista?"
                        data={amigos.map((a) => ({
                          value: a.id,
                          label: `${a.nome} (${a.localOrigem})`,
                        }))}
                        value={amigoSelecionado}
                        onChange={(val) => setAmigoSelecionado(val)}
                        required
                      />
                      <Select
                        label="Revista / Gibi Solicitado"
                        placeholder="Selecione a edição do acervo"
                        data={revistas.map((r) => {
                          const cx = caixas.find((c) => c.id === r.caixaId);
                          return {
                            value: r.id,
                            label: `${r.tipoColecao} Edição Nº ${
                              r.numEdicao
                            } (Caixa: ${cx ? cx.cor : "-"})`,
                          };
                        })}
                        value={revistaSelecionada}
                        onChange={(val) => setRevistaSelecionada(val)}
                        required
                      />
                      <DateInput
                        label="Data do Empréstimo"
                        value={dataEmprestimoForm}
                        onChange={(val) => setDataEmprestimoForm(val as any)}
                        required
                      />
                      <Button
                        type="submit"
                        color="emerald"
                        fullWidth
                        size="md"
                        className="mt-2"
                      >
                        Autorizar e Registrar
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Fluxo e Histórico de Empréstimos
                  </Title>
                  {emprestimos.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhuma movimentação registrada no clube.
                    </Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Amigo</Table.Th>
                            <Table.Th>Gibi Solicitado</Table.Th>
                            <Table.Th>Empréstimo</Table.Th>
                            <Table.Th>Devolução</Table.Th>
                            <Table.Th>Ações OO</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {emprestimos.map((emp) => {
                            const amg = amigos.find(
                              (a) => a.id === emp.amigoId
                            );
                            const rev = revistas.find(
                              (r) => r.id === emp.revistaId
                            );
                            return (
                              <Table.Tr key={emp.id}>
                                <Table.Td className="font-medium text-slate-700">
                                  {amg ? amg.nome : "Removido"}
                                </Table.Td>
                                <Table.Td>
                                  {rev
                                    ? `${rev.tipoColecao} (Ed. ${rev.numEdicao})`
                                    : "Removido"}
                                </Table.Td>
                                <Table.Td>{emp.dataEmprestimo}</Table.Td>
                                <Table.Td>
                                  {emp.dataDevolucao ? (
                                    <Badge color="gray" variant="light">
                                      {emp.dataDevolucao}
                                    </Badge>
                                  ) : (
                                    <Badge color="green" variant="light">
                                      Em posse do amigo
                                    </Badge>
                                  )}
                                </Table.Td>
                                <Table.Td>
                                  {!emp.dataDevolucao ? (
                                    <Button
                                      size="xs"
                                      color="orange"
                                      onClick={() =>
                                        handleRegistrarDevolucao(emp.id)
                                      }
                                    >
                                      registrarDevolucao()
                                    </Button>
                                  ) : (
                                    <Text
                                      size="xs"
                                      color="dimmed"
                                      className="italic"
                                    >
                                      Arquivado
                                    </Text>
                                  )}
                                </Table.Td>
                              </Table.Tr>
                            );
                          })}
                        </Table.Tbody>
                      </Table>
                    </div>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* TAB 2: GERENCIAMENTO DE ACERVO (RF01 + RF02) */}
          <Tabs.Panel value="cadastro_revistas">
            <Grid>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap="md">
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={4} className="mb-4 text-gray-700">
                      Cadastrar Revista
                    </Title>
                    <form onSubmit={handleCadastrarRevista}>
                      <Stack gap="sm">
                        <TextInput
                          label="Tipo da Coleção (Nome do Gibi)"
                          placeholder="Ex: Cebolinha, Batman..."
                          value={tipoColecao}
                          onChange={(e) => setTipoColecao(e.target.value)}
                          required
                        />
                        <NumberInput
                          label="Número da Edição"
                          min={0}
                          value={numEdicao}
                          onChange={(val) => setNumEdicao(val)}
                          required
                        />
                        <NumberInput
                          label="Ano de Lançamento"
                          min={1900}
                          value={anoRevista}
                          onChange={(val) => setAnoRevista(val)}
                          required
                        />
                        <Select
                          label="Caixa Organizadora Alvo (Associação)"
                          placeholder="Onde ela ficará guardada?"
                          data={caixas.map((c) => ({
                            value: c.id,
                            label: `Caixa ${c.cor} - Etiqueta: ${c.etiqueta}`,
                          }))}
                          value={caixaIdSelecionada}
                          onChange={(val) => setCaixaIdSelecionada(val)}
                          required
                        />
                        <Button
                          type="submit"
                          color="emerald"
                          fullWidth
                          className="mt-2"
                        >
                          Salvar Revista
                        </Button>
                      </Stack>
                    </form>
                  </Card>

                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={4} className="mb-4 text-gray-700">
                      Gerenciar Caixas
                    </Title>
                    <form onSubmit={handleCadastrarCaixa}>
                      <Stack gap="sm">
                        <TextInput
                          label="Cor da Caixa"
                          placeholder="Ex: Verde, Azul, Amarela"
                          value={corCaixa}
                          onChange={(e) => setCorCaixa(e.target.value)}
                          required
                        />
                        <TextInput
                          label="Etiqueta Descritiva"
                          placeholder="Ex: Disney, Clássicos"
                          value={etiquetaCaixa}
                          onChange={(e) => setEtiquetaCaixa(e.target.value)}
                          required
                        />
                        <NumberInput
                          label="Número da Caixa"
                          min={0}
                          value={numeroCaixa}
                          onChange={(val) => setNumeroCaixa(val)}
                          required
                        />
                        <Button type="submit" color="blue" fullWidth>
                          Adicionar Caixa
                        </Button>
                      </Stack>
                    </form>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 7 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  className="h-full"
                >
                  <Title order={4} className="mb-4 text-gray-700">
                    Revistas Cadastradas e suas Caixas
                  </Title>
                  {revistas.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhuma revista cadastrada no acervo.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Coleção / Gibi</Table.Th>
                          <Table.Th>Edição</Table.Th>
                          <Table.Th>Ano</Table.Th>
                          <Table.Th>Caixa Organizadora</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {revistas.map((r) => {
                          const cx = caixas.find((c) => c.id === r.caixaId);
                          return (
                            <Table.Tr key={r.id}>
                              <Table.Td className="font-bold text-slate-700">
                                📖 {r.tipoColecao}
                              </Table.Td>
                              <Table.Td>Nº {r.numEdicao}</Table.Td>
                              <Table.Td>{r.ano}</Table.Td>
                              <Table.Td>
                                <Badge color="blue" variant="light">
                                  {cx
                                    ? `Caixa ${cx.cor} (${cx.etiqueta})`
                                    : "Indefinida"}
                                </Badge>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* TAB 3: CADASTRO DE AMIGOS (RF03) */}
          <Tabs.Panel value="amigos">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cadastrar Amigo
                  </Title>
                  <form onSubmit={handleCadastrarAmigo}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome do Amiguinho"
                        placeholder="Nome completo"
                        value={nomeAmigo}
                        onChange={(e) => setNomeAmigo(e.target.value)}
                        required
                      />
                      <TextInput
                        label="Nome da Mãe"
                        placeholder="Responsável"
                        value={nomeMae}
                        onChange={(e) => setNomeMae(e.target.value)}
                      />
                      <TextInput
                        label="Telefone de Contato"
                        placeholder="(00) 00000-0000"
                        value={telefoneAmigo}
                        onChange={(e) => setTelefoneAmigo(e.target.value)}
                      />
                      <Select
                        label="Local de Origem (Vizinhança)"
                        data={["Prédio", "Escola"]}
                        value={localOrigem}
                        onChange={(val) => setLocalOrigem(val)}
                        required
                      />
                      <Button
                        type="submit"
                        color="teal"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar Amigo
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Amigos Vinculados ao Clube
                  </Title>
                  {amigos.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum amiguinho cadastrado.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nome</Table.Th>
                          <Table.Th>Mãe</Table.Th>
                          <Table.Th>Telefone</Table.Th>
                          <Table.Th>Origem</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {amigos.map((a) => (
                          <Table.Tr key={a.id}>
                            <Table.Td className="font-semibold text-slate-700">
                              👦 {a.nome}
                            </Table.Td>
                            <Table.Td>{a.nomeMae || "-"}</Table.Td>
                            <Table.Td>{a.telefone || "-"}</Table.Td>
                            <Table.Td>
                              <Badge
                                color={
                                  a.localOrigem === "Prédio" ? "indigo" : "cyan"
                                }
                                variant="dot"
                              >
                                {a.localOrigem}
                              </Badge>
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
