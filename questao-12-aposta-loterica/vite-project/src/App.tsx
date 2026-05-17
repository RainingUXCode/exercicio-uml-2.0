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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Notifications, notifications } from "@mantine/notifications";

interface Jogo {
  id: string;
  nome: string;
  qtdNumerosPermitidos: number;
}

export default function App() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [jogoSelecionado, setJogoSelecionado] = useState<string | null>("j1");

  // Formulários
  const [concursoAposta, setConcursoAposta] = useState<string | number>(1001);
  const [dataAposta, setDataAposta] = useState<Date | null>(new Date());
  const [numerosApostaInput, setNumerosApostaInput] = useState("");

  const [concursoSorteio, setConcursoSorteio] = useState<string | number>(1001);
  const [dataSorteio, setDataSorteio] = useState<Date | null>(new Date());
  const [numerosSorteioInput, setNumerosSorteioInput] = useState("");
  const [valorPremio, setValorPremio] = useState<string | number>(5000000);

  const [concursoFiltro, setConcursoFiltro] = useState<string | number>(1001);
  const [relatorio, setRelatorio] = useState<any>(null);

  // Carrega as modalidades de jogos configuradas no MySQL via API Python
  useEffect(() => {
    fetch("http://localhost:5000/api/jogos")
      .then((res) => res.json())
      .then((data) => setJogos(data))
      .catch(() =>
        notifications.show({
          title: "Servidor Offline",
          message:
            "O backend em Python precisa estar rodando para conectar ao MySQL!",
          color: "red",
        })
      );
  }, []);

  // RF01 – Cadastrar cartões apostados no MySQL
  const handleCadastrarCartao = (e: React.FormEvent) => {
    e.preventDefault();
    const listaNumeros = numerosApostaInput
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    fetch("http://localhost:5000/api/cartoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jogo_id: jogoSelecionado,
        concursoNumero: concursoAposta,
        dataAposta: dataAposta?.toLocaleDateString("pt-BR"),
        numeros: listaNumeros,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        notifications.show({
          title: "Aposta Registrada",
          message: data.message,
          color: "green",
        });
        setNumerosApostaInput("");
      })
      .catch((err) =>
        notifications.show({
          title: "Erro MySQL",
          message: err.message,
          color: "red",
        })
      );
  };

  // RF02 – Registrar resultados do concurso no MySQL
  const handleRegistrarResultado = (e: React.FormEvent) => {
    e.preventDefault();
    const listaNumeros = numerosSorteioInput
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    fetch("http://localhost:5000/api/resultados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jogo_id: jogoSelecionado,
        concursoNumero: concursoSorteio,
        dataSorteio: dataSorteio?.toLocaleDateString("pt-BR"),
        valorPremio: valorPremio,
        numeros: listaNumeros,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        notifications.show({
          title: "Sucesso",
          message: data.message,
          color: "green",
        });
        setNumerosSorteioInput("");
      })
      .catch((err) =>
        notifications.show({
          title: "Erro MySQL",
          message: err.message,
          color: "red",
        })
      );
  };

  // RF03 + RF04 (Conferência de Apostas + Relatório de Premiação dinâmico do Banco)
  const handleConferirApostas = () => {
    fetch(
      `http://localhost:5000/api/conferência/${jogoSelecionado}/${concursoFiltro}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRelatorio(data);
        if (data.concursoRegistrado) {
          notifications.show({
            title: "Conferência Realizada",
            message: "Relatório estruturado gerado via querys relacionais!",
            color: "blue",
          });
        }
      })
      .catch(() =>
        notifications.show({
          title: "Erro na Requisição",
          message: "Não foi possível conectar ao servidor Python.",
          color: "red",
        })
      );
  };

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      <div className="bg-blue-800 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                LottoManager Full-Stack
              </Title>
              <Text size="sm" className="opacity-80">
                Persistência Relacional Ativa (MySQL via Python Flask)
              </Text>
            </div>
            <Badge size="lg" color="indigo" variant="filled">
              Questão 12
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="conferência" color="blue" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="conferência" className="font-medium">
              📊 Conferência & Relatórios
            </Tabs.Tab>
            <Tabs.Tab value="cartoes" className="font-medium">
              🎟️ Registrar Cartões
            </Tabs.Tab>
            <Tabs.Tab value="concursos" className="font-medium">
              🏆 Resultados Oficiais
            </Tabs.Tab>
          </Tabs.List>

          <Card shadow="xs" className="mb-6" withBorder>
            <Select
              label="Modalidade de Loteria Ativa"
              placeholder="Carregando jogos do banco de dados..."
              data={jogos.map((j) => ({
                value: j.id,
                label: `${j.nome} (Requer ${j.qtdNumerosPermitidos} dezenas)`,
              }))}
              value={jogoSelecionado}
              onChange={(val) => {
                setJogoSelecionado(val);
                setRelatorio(null);
              }}
            />
          </Card>

          <Tabs.Panel value="conferência">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-3 text-gray-700">
                    Painel de Auditoria
                  </Title>
                  <Stack gap="sm">
                    <NumberInput
                      label="Número do Concurso"
                      value={concursoFiltro}
                      onChange={(val) => setConcursoFiltro(val || 0)}
                      required
                    />
                    <Button
                      onClick={handleConferirApostas}
                      color="blue"
                      fullWidth
                      size="md"
                    >
                      MÉTODO: conferirAcertos()
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                {!relatorio ? (
                  <Card
                    shadow="sm"
                    radius="md"
                    withBorder
                    className="text-center py-12 text-gray-400 italic"
                  >
                    Informe o concurso ao lado para acionar a verificação das
                    apostas.
                  </Card>
                ) : !relatorio.concursoRegistrado ? (
                  <Card
                    shadow="sm"
                    radius="md"
                    withBorder
                    className="bg-yellow-50 border-yellow-200 text-yellow-800"
                  >
                    {relatorio.mensagem}
                  </Card>
                ) : (
                  <Stack gap="md">
                    <Paper p="md" withBorder className="bg-slate-50">
                      <Title order={4} className="text-blue-700 mb-2">
                        Relatório de Premiação Concluído
                      </Title>
                      <Text size="sm">
                        <strong>Data do Sorteio:</strong>{" "}
                        {relatorio.dataSorteio}
                      </Text>
                      <Text size="sm" className="flex items-center gap-2 mt-1">
                        <strong>Dezenas Sorteadas Oficiais:</strong>
                        {relatorio.numerosOficiais.map((n: number) => (
                          <Badge
                            key={n}
                            color="blue"
                            variant="filled"
                            size="sm"
                          >
                            {n}
                          </Badge>
                        ))}
                      </Text>
                    </Paper>

                    <Card shadow="sm" radius="md" withBorder>
                      <Title order={5} className="mb-3 text-slate-700">
                        Cartões do Carlos Analisados
                      </Title>
                      {relatorio.cartoes.length === 0 ? (
                        <Text size="sm" className="italic text-gray-400">
                          Carlos não possui apostas salvas neste concurso.
                        </Text>
                      ) : (
                        <Table highlightOnHover>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Seus Números Apostados</Table.Th>
                              <Table.Th>Dezenas Acertadas</Table.Th>
                              <Table.Th>Total Acertos</Table.Th>
                              <Table.Th style={{ textAlign: "right" }}>
                                Prêmio (R$)
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {relatorio.cartoes.map((c: any) => (
                              <Table.Tr key={c.id}>
                                <Table.Td className="font-mono text-xs">
                                  {c.numerosApostados.join(", ")}
                                </Table.Td>
                                <Table.Td className="text-green-600 font-bold font-mono text-xs">
                                  {c.numerosAcertados.length > 0
                                    ? c.numerosAcertados.join(", ")
                                    : "-"}
                                </Table.Td>
                                <Table.Td>
                                  <Badge
                                    color={c.qtdAcertos >= 4 ? "green" : "gray"}
                                  >
                                    {c.qtdAcertos} acertos
                                  </Badge>
                                </Table.Td>
                                <Table.Td
                                  style={{ textAlign: "right" }}
                                  className="font-bold text-emerald-600"
                                >
                                  R$ {c.valorGanho.toFixed(2)}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      )}
                    </Card>
                  </Stack>
                )}
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="cartoes">
            <Card shadow="sm" radius="md" withBorder>
              <Title order={4} className="mb-4 text-gray-700">
                Salvar Cartão Apostado no Banco
              </Title>
              <form onSubmit={handleCadastrarCartao}>
                <Stack gap="sm">
                  <Grid>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Número do Concurso"
                        value={concursoAposta}
                        onChange={(val) => setConcursoAposta(val || 0)}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DateInput
                        label="Data da Aposta"
                        value={dataAposta}
                        onChange={(val) => setDataAposta(val as any)}
                        required
                      />
                    </Grid.Col>
                  </Grid>
                  <TextInput
                    label="Informe os Números (Separados por vírgula)"
                    placeholder="Ex: 5, 14, 23, 36, 47, 52"
                    value={numerosApostaInput}
                    onChange={(e) => setNumerosApostaInput(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    color="blue"
                    fullWidth
                    size="md"
                    className="mt-2"
                  >
                    Persistir no MySQL
                  </Button>
                </Stack>
              </form>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="concursos">
            <Card shadow="sm" radius="md" withBorder>
              <Title order={4} className="mb-4 text-gray-700">
                Registrar Sorteio Oficial do Concurso
              </Title>
              <form onSubmit={handleRegistrarResultado}>
                <Stack gap="sm">
                  <Grid>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Número do Concurso"
                        value={concursoSorteio}
                        onChange={(val) => setConcursoSorteio(val || 0)}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <DateInput
                        label="Data do Sorteio"
                        value={dataSorteio}
                        onChange={(val) => setDataSorteio(val as any)}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Montante do Prêmio Máximo (R$)"
                        min={0}
                        value={valorPremio}
                        onChange={(val) => setValorPremio(val || 0)}
                        required
                      />
                    </Grid.Col>
                  </Grid>
                  <TextInput
                    label="Dezenas Sorteadas Oficiais (Separadas por vírgula)"
                    placeholder="Ex: 5, 14, 23, 36, 47, 52"
                    value={numerosSorteioInput}
                    onChange={(e) => setNumerosSorteioInput(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    color="indigo"
                    fullWidth
                    size="md"
                    className="mt-2"
                  >
                    Salvar Resultado no MySQL
                  </Button>
                </Stack>
              </form>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </MantineProvider>
  );
}
