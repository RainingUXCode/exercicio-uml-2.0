import { useState } from "react";
import {
  Container,
  TextInput,
  NumberInput,
  Button,
  Card,
  Text,
  Group,
  Stack,
  Title,
  Badge,
  ActionIcon,
  Modal,
  SimpleGrid,
  Divider,
  Table,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  Users,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Contato {
  nome: string;
  telefone: string;
}

interface Ligacao {
  id: string;
  data: string;
  hora: string;
  minutos: number;
  telefoneDestino: string;
  valorPulso: number;
  pulsosCalculados: number;
  valorTotalCalculado: number;
}

export default function App() {
  const [agenda, setAgenda] = useState<Contato[]>([
    { nome: "Bruna (Casa)", telefone: "83988887777" },
    { nome: "Mãe", telefone: "83999991122" },
  ]);

  const [ligacoes, setLigacoes] = useState<Ligacao[]>([
    {
      id: "1",
      data: "2026-05-13",
      hora: "14:30",
      minutos: 8,
      telefoneDestino: "83988887777",
      valorPulso: 0.08,
      pulsosCalculados: 3,
      valorTotalCalculado: 0.24,
    },
    {
      id: "2",
      data: "2026-05-17",
      hora: "10:00",
      minutos: 15,
      telefoneDestino: "83999991122",
      valorPulso: 0.08,
      pulsosCalculados: 1,
      valorTotalCalculado: 0.08,
    },
  ]);

  const [novoNomeContato, setNovoNomeContato] = useState("");
  const [novoTelefoneContato, setNovoTelefoneContato] = useState("");
  const [novaData, setNovaData] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [novaHora, setNovaHora] = useState("12:00");
  const [novosMinutos, setNovosMinutos] = useState<string | number>(0);
  const [telefoneDestino, setTelefoneDestino] = useState("");
  const [openedAgenda, { open: openAgenda, close: closeAgenda }] =
    useDisclosure(false);

  const calcularPulso = (dataString: string, minutosTotais: number): number => {
    const dataObjeto = new Date(dataString + "T00:00:00");
    const diaDaSemana = dataObjeto.getDay();
    const ehFimDeSemana = diaDaSemana === 0 || diaDaSemana === 6;

    if (ehFimDeSemana) return 1;
    return 1 + Math.floor(minutosTotais / 4);
  };

  const calcularValorTotal = (pulsos: number): number => {
    return Number((pulsos * 0.08).toFixed(2));
  };

  const handleRegistrarLigacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefoneDestino || Number(novosMinutos) < 0) return;

    const quantidadePulsos = calcularPulso(novaData, Number(novosMinutos));
    const valorTotal = calcularValorTotal(quantidadePulsos);

    const novaLigacao: Ligacao = {
      id: Date.now().toString(),
      data: novaData,
      hora: novaHora,
      minutos: Number(novosMinutos),
      telefoneDestino: telefoneDestino,
      valorPulso: 0.08,
      pulsosCalculados: quantidadePulsos,
      valorTotalCalculado: valorTotal,
    };

    setLigacoes([novaLigacao, ...ligacoes]);
    setNovosMinutos(0);
    setTelefoneDestino("");
  };

  const handleAdicionarContato = () => {
    if (!novoNomeContato.trim() || !novoTelefoneContato.trim()) return;
    setAgenda([
      ...agenda,
      { nome: novoNomeContato, telefone: novoTelefoneContato },
    ]);
    setNovoNomeContato("");
    setNovoTelefoneContato("");
  };

  const handleRemoverContato = (telefone: string) => {
    setAgenda(agenda.filter((c) => c.telefone !== telefone));
  };

  const custoTotalMensal = ligacoes.reduce(
    (acc, cur) => acc + cur.valorTotalCalculado,
    0
  );
  const totalPulsosMensal = ligacoes.reduce(
    (acc, cur) => acc + cur.pulsosCalculados,
    0
  );

  return (
    <Container size="xl" py="xl" className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-slate-200 pb-5 gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <PhoneCall className="text-blue-600 w-8 h-8 shrink-0" />
          <div>
            <Title
              order={1}
              c="dark.6"
              className="tracking-tight text-2xl font-bold"
            >
              ModemCall Control
            </Title>
            <Text size="sm" c="dark.4" className="font-medium">
              Controle e auditoria tarifária de ligações telefônicas
            </Text>
          </div>
        </div>
        <Button
          leftSection={<Users size={16} />}
          variant="filled"
          color="blue"
          onClick={openAgenda}
        >
          Gerenciar Agenda ({agenda.length})
        </Button>
      </header>

      {/* Cards de Métricas */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mb="xl" spacing="md">
        <Card
          withBorder
          padding="lg"
          radius="md"
          className="bg-white shadow-sm border-l-4 border-l-blue-600"
        >
          <Group gap="md">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <DollarSign size={24} />
            </div>
            <div>
              <Text
                size="xs"
                c="dark.3"
                className="font-bold uppercase tracking-wider"
              >
                Valor Total Acumulado
              </Text>
              <Title order={2} c="dark.6" className="font-extrabold text-2xl">
                R$ {custoTotalMensal.toFixed(2)}
              </Title>
            </div>
          </Group>
        </Card>

        <Card
          withBorder
          padding="lg"
          radius="md"
          className="bg-white shadow-sm border-l-4 border-l-indigo-600"
        >
          <Group gap="md">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <Phone size={24} />
            </div>
            <div>
              <Text
                size="xs"
                c="dark.3"
                className="font-bold uppercase tracking-wider"
              >
                Total de Pulsos Consumidos
              </Text>
              <Title order={2} c="dark.6" className="font-extrabold text-2xl">
                {totalPulsosMensal}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  pulsos
                </span>
              </Title>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Grid Principal */}
      <SimpleGrid
        cols={{ base: 1, lg: 3 }}
        spacing="lg"
        className="items-start"
      >
        {/* Formulário */}
        <div className="lg:col-span-1">
          <Card
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Title
              order={3}
              size="h4"
              c="dark.6"
              className="mb-5 flex items-center gap-2 font-bold border-b pb-2"
            >
              <PhoneForwarded size={18} className="text-blue-600" /> Registrar
              Ligação
            </Title>

            <form onSubmit={handleRegistrarLigacao} className="space-y-4">
              <TextInput
                label="Data da Ligação"
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.currentTarget.value)}
                required
              />
              <TextInput
                label="Hora do Início"
                type="time"
                value={novaHora}
                onChange={(e) => setNovaHora(e.currentTarget.value)}
                required
              />
              <NumberInput
                label="Minutos Utilizados"
                placeholder="Tempo em minutos"
                min={0}
                value={novosMinutos}
                onChange={(val) => setNovosMinutos(val)}
                required
              />

              <div className="space-y-2">
                <Select
                  label="Destinatário (Agenda)"
                  placeholder="Selecione um contato salvo"
                  data={agenda.map((c) => ({
                    value: c.telefone,
                    label: `${c.nome} (${c.telefone})`,
                  }))}
                  value={telefoneDestino}
                  onChange={(val) => setTelefoneDestino(val || "")}
                  clearable
                />
                <Divider
                  label="ou informe um número avulso"
                  labelPosition="center"
                  my="xs"
                />
                <TextInput
                  placeholder="Digite o telefone diretamente"
                  value={telefoneDestino}
                  onChange={(e) => setTelefoneDestino(e.currentTarget.value)}
                  required
                />
              </div>

              {Number(novosMinutos) > 0 && (
                <div className="p-3 bg-blue-50/50 rounded-lg border border-dashed border-blue-200 space-y-1 text-xs text-slate-700">
                  <Text className="font-bold text-blue-800 mb-1">
                    Simulador em Tempo Real:
                  </Text>
                  <Text>
                    Pulsos estimados:{" "}
                    <span className="font-bold">
                      {calcularPulso(novaData, Number(novosMinutos))}
                    </span>
                  </Text>
                  <Text>
                    Custo do pulso:{" "}
                    <span className="font-bold text-emerald-600">R$ 0,08</span>
                  </Text>
                  <Text>
                    Valor Estimado:{" "}
                    <span className="font-bold text-blue-600">
                      R${" "}
                      {calcularValorTotal(
                        calcularPulso(novaData, Number(novosMinutos))
                      ).toFixed(2)}
                    </span>
                  </Text>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                color="blue"
                size="md"
                className="mt-4 font-semibold shadow-sm"
              >
                Salvar Registro de Linha
              </Button>
            </form>
          </Card>
        </div>

        {/* Histórico */}
        <div className="lg:col-span-2 h-full">
          <Card
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            className="bg-white h-full"
          >
            <Title
              order={3}
              size="h4"
              c="dark.6"
              className="mb-5 flex items-center gap-2 font-bold border-b pb-2"
            >
              <Calendar size={18} className="text-indigo-600" /> Histórico de
              Chamadas Efetuadas
            </Title>

            {ligacoes.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl" fs="italic">
                Nenhum registro de ligação encontrado para o período.
              </Text>
            ) : (
              <div className="overflow-x-auto w-full">
                <Table
                  striped
                  highlightOnHover
                  verticalSpacing="md"
                  className="w-full min-w-[500px]"
                >
                  <Table.Thead className="bg-slate-50">
                    <Table.Tr>
                      <Table.Th>
                        <Text size="sm" c="dark.6" className="font-bold">
                          Data/Hora
                        </Text>
                      </Table.Th>
                      <Table.Th>
                        <Text size="sm" c="dark.6" className="font-bold">
                          Telefone Destino
                        </Text>
                      </Table.Th>
                      <Table.Th>
                        <Text size="sm" c="dark.6" className="font-bold">
                          Duração
                        </Text>
                      </Table.Th>
                      <Table.Th ta="center">
                        <Text size="sm" c="dark.6" className="font-bold">
                          Pulsos
                        </Text>
                      </Table.Th>
                      <Table.Th ta="right" className="pr-4">
                        <Text size="sm" c="dark.6" className="font-bold">
                          Valor Total
                        </Text>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {ligacoes.map((ligacao) => {
                      const dataFormatada = ligacao.data
                        .split("-")
                        .reverse()
                        .join("/");
                      const diaSemana = new Date(
                        ligacao.data + "T00:00:00"
                      ).getDay();
                      const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;

                      return (
                        <Table.Tr
                          key={ligacao.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <Table.Td>
                            <div className="flex flex-col">
                              <Text
                                size="sm"
                                c="dark.6"
                                className="font-semibold"
                              >
                                {dataFormatada}
                              </Text>
                              <Text
                                size="xs"
                                c="dimmed"
                                className="font-medium"
                              >
                                {ligacao.hora}
                              </Text>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <Text
                              size="sm"
                              c="dark.4"
                              className="font-mono font-medium"
                            >
                              {ligacao.telefoneDestino}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="dark.4">
                              {ligacao.minutos} min
                            </Text>
                          </Table.Td>
                          <Table.Td ta="center">
                            <Group gap={6} justify="center">
                              <Badge
                                color="indigo"
                                size="sm"
                                variant="light"
                                className="font-bold"
                              >
                                {ligacao.pulsosCalculados}
                              </Badge>
                              {ehFimDeSemana && (
                                <Badge
                                  color="green"
                                  size="xs"
                                  variant="filled"
                                  className="font-bold"
                                >
                                  FDS
                                </Badge>
                              )}
                            </Group>
                          </Table.Td>
                          <Table.Td ta="right" className="pr-4">
                            <Text size="sm" c="dark.6" className="font-bold">
                              R$ {ligacao.valorTotalCalculado.toFixed(2)}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </SimpleGrid>

      {/* Modal da Agenda */}
      <Modal
        opened={openedAgenda}
        onClose={closeAgenda}
        title={
          <Text size="md" c="dark.6" className="font-bold">
            Agenda de Telefones Interna
          </Text>
        }
        size="md"
        radius="md"
      >
        <Stack gap="md">
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
            <Text
              size="xs"
              c="dimmed"
              className="font-bold uppercase tracking-wider"
            >
              Novo Contato
            </Text>
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                placeholder="Nome"
                value={novoNomeContato}
                onChange={(e) => setNovoNomeContato(e.currentTarget.value)}
              />
              <TextInput
                placeholder="Telefone"
                value={novoTelefoneContato} // Value recebe estritamente a string do estado
                onChange={(e) => setNovoTelefoneContato(e.currentTarget.value)} // OnChange recebe a função de atualização
              />
            </div>
            <Button
              fullWidth
              size="xs"
              color="green"
              leftSection={<Plus size={14} />}
              onClick={handleAdicionarContato}
            >
              Adicionar à Agenda
            </Button>
          </div>

          <Divider label="Contatos Salvos" labelPosition="center" />

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {agenda.length === 0 ? (
              <Text size="xs" c="dimmed" ta="center" py="md">
                Agenda vazia.
              </Text>
            ) : (
              agenda.map((contato) => (
                <div
                  key={contato.telefone}
                  className="flex items-center justify-between p-3 bg-white rounded border hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <Text size="sm" c="dark.6" className="font-bold">
                      {contato.nome}
                    </Text>
                    <Text size="xs" c="dimmed" className="font-mono">
                      {contato.telefone}
                    </Text>
                  </div>
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={() => handleRemoverContato(contato.telefone)}
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </div>
              ))
            )}
          </div>
        </Stack>
      </Modal>
    </Container>
  );
}
