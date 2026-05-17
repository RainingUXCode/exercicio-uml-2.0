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
  Checkbox,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT (Modelagem de Classes) ---
interface Pacente {
  id: string;
  nome: string;
  telefone: string;
  convenio: string; // "Particular", "Unimed", "Amil", etc.
}

interface Consultorio {
  id: string;
  bairro: string;
  endereco: string;
}

interface AgendaSemanal {
  id: string;
  consultorioId: string;
  diaSemana: string; // Segunda, Terça, etc.
  horaInicio: string; // HH:MM
  horaFim: string; // HH:MM
}

interface Consulta {
  id: string;
  pacienteId: string;
  consultorioId: string;
  data: string; // dd/mm/aaaa
  horario: string; // HH:MM
  ehRevisao: boolean; // Ativa RF05 (<<extend>>)
  ehEncaixe: boolean; // Ativa RF04 (<<extend>>)
  valorConsulta: number;
}

export default function App() {
  // --- ESTADOS DE PERSISTÊNCIA DOS DADOS ---
  const [pacientes, setPacientes] = useState<Pacente[]>(() =>
    JSON.parse(localStorage.getItem("med_pacientes") || "[]")
  );
  const [consultorios, setConsultorios] = useState<Consultorio[]>(() => {
    const salvos = localStorage.getItem("med_consultorios");
    return salvos
      ? JSON.parse(salvos)
      : [
          { id: "c1", bairro: "Centro", endereco: "Av. Epitácio Pessoa, 1000" },
          {
            id: "c2",
            bairro: "Mangabeira",
            endereco: "Rua Josefa Taveira, 250",
          },
        ];
  });

  const [agendas, setAgendas] = useState<AgendaSemanal[]>(() => {
    const salvas = localStorage.getItem("med_agendas");
    return salvas
      ? JSON.parse(salvas)
      : [
          {
            id: "ag1",
            consultorioId: "c1",
            diaSemana: "Segunda-Feira",
            horaInicio: "08:00",
            horaFim: "18:00",
          },
          {
            id: "ag2",
            consultorioId: "c2",
            diaSemana: "Quarta-Feira",
            horaInicio: "13:00",
            horaFim: "20:00",
          },
        ];
  });

  const [consultas, setConsultas] = useState<Consulta[]>(() =>
    JSON.parse(localStorage.getItem("med_consultas") || "[]")
  );

  // --- ESTADOS DOS FORMULÁRIOS ---
  // Paciente (RF06)
  const [nomePac, setNomePac] = useState("");
  const [telPac, setTelPac] = useState("");
  const [convenioPac, setConvenioPac] = useState<string | null>("Particular");

  // Consultório (RF01)
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");

  // Agenda (RF02)
  const [consultorioAgenda, setConsultorioAgenda] = useState<string | null>(
    "c1"
  );
  const [diaSemana, setDiaSemana] = useState<string | null>("Segunda-Feira");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  // Consulta (RF03)
  const [pacienteSel, setPacienteSel] = useState<string | null>("");
  const [consultorioSel, setConsultorioSel] = useState<string | null>("");
  const [dataConsultaForm, setDataConsultaForm] = useState<Date | null>(
    new Date()
  );
  const [horarioForm, setHorarioForm] = useState("");
  const [ehRevisao, setEhRevisao] = useState(false);
  const [ehEncaixe, setEhEncaixe] = useState(false);
  const [valorBase, setValorBase] = useState<string | number>(150);

  // Sincronização LocalStorage
  useEffect(() => {
    localStorage.setItem("med_pacientes", JSON.stringify(pacientes));
    localStorage.setItem("med_consultorios", JSON.stringify(consultorios));
    localStorage.setItem("med_agendas", JSON.stringify(agendas));
    localStorage.setItem("med_consultas", JSON.stringify(consultas));
  }, [pacientes, consultorios, agendas, consultas]);

  // --- MÉTODOS E REGRAS DE NEGÓCIO OO ---

  // RF06 – Cadastrar pacientes
  const handleCadastrarPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomePac || !convenioPac) return;

    const novoPac: Pacente = {
      id: crypto.randomUUID(),
      nome: nomePac.trim(),
      telefone: telPac.trim(),
      convenio: convenioPac,
    };

    setPacientes([...pacientes, novoPac]);
    setNomePac("");
    setTelPac("");
    notifications.show({
      title: "Paciente Cadastrado",
      message: `Perfil de ${novoPac.nome} salvo com sucesso.`,
      color: "green",
    });
  };

  // RF01 – Gerenciar locais de atendimento (Cadastrar Consultório)
  const handleCadastrarConsultorio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bairro || !endereco) return;

    const novoConsultorio: Consultorio = {
      id: crypto.randomUUID(),
      bairro: bairro.trim(),
      endereco: endereco.trim(),
    };

    setConsultorios([...consultorios, novoConsultorio]);
    setBairro("");
    setEndereco("");
    notifications.show({
      title: "Local Adicionado",
      message: `Consultório em ${novoConsultorio.bairro} registrado.`,
      color: "blue",
    });
  };

  // RF02 – Controlar agenda por local
  const handleCadastrarAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultorioAgenda || !diaSemana || !horaInicio || !horaFim) return;

    const novaAgenda: AgendaSemanal = {
      id: crypto.randomUUID(),
      consultorioId: consultorioAgenda,
      diaSemana,
      horaInicio,
      horaFim: horaFim,
    };

    setAgendas([...agendas, novaAgenda]);
    setHoraInicio("");
    setHoraFim("");
    notifications.show({
      title: "Agenda Atualizada",
      message: `Cronograma configurado para as estruturas de ${diaSemana}.`,
      color: "teal",
    });
  };

  // Método: validarDiaAtendimento()
  const validarDiaAtendimento = (
    consultorioId: string,
    dataObj: Date
  ): boolean => {
    const diasSemanasMap = [
      "Domingo",
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
    ];
    const diaEscolhido = diasSemanasMap[dataObj.getDay()];

    return agendas.some(
      (ag) =>
        ag.consultorioId === consultorioId && ag.diaSemana === diaEscolhido
    );
  };

  // Método: verificarDisponibilidade()
  const verificarDisponibilidade = (
    consultorioId: string,
    dataStr: string,
    horaStr: string,
    forceEncaixe: boolean
  ): boolean => {
    if (forceEncaixe) return true; // Se for marcado como Encaixe (RF04), pula a colisão estrita

    // Verifica se já existe consulta normal marcada no mesmo local, data e hora
    const conflito = consultas.some(
      (c) =>
        c.consultorioId === consultorioId &&
        c.data === dataStr &&
        c.horario === horaStr &&
        !c.ehEncaixe
    );

    return !conflito;
  };

  // Método: definirCobrança() + RF07 – Verificar convênios
  const definirCobranca = (
    valorInicial: number,
    pct: Pacente | undefined,
    revisao: boolean
  ): number => {
    if (revisao) return 0.0; // Método identificarConsultasDeRevisao() -> Valor Zero (RF05)

    if (pct && pct.convenio !== "Particular") {
      return valorInicial * 0.5; // Desconto automático de 50% para convênios cadastrados (RF07)
    }

    return valorInicial;
  };

  // RF03 – Marcar consultas (Invocando internamente os includes e extends do diagrama)
  const handleMarcarConsulta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSel || !consultorioSel || !dataConsultaForm || !horarioForm)
      return;

    // 1. Validação de Cronograma
    const diaValido = validarDiaAtendimento(consultorioSel, dataConsultaForm);
    if (!diaValido) {
      notifications.show({
        title: "Agendamento Recusado",
        message:
          "O consultório não possui horário de atendimento configurado para este dia da semana!",
        color: "red",
      });
      return;
    }

    const dataString = dataConsultaForm.toLocaleDateString("pt-BR");

    // 2. Validação de Conflito de Horário (RF04 – Gerenciar encaixes)
    const disponivel = verificarDisponibilidade(
      consultorioSel,
      dataString,
      horarioForm,
      ehEncaixe
    );
    if (!disponivel) {
      notifications.show({
        title: "Horário Ocupado",
        message:
          'Já existe um atendimento agendado para este horário. Marque a opção "Gerenciar Encaixe" se necessário.',
        color: "orange",
      });
      return;
    }

    const pacienteObj = pacientes.find((p) => p.id === pacienteSel);
    const valorFinalCalculado = definirCobranca(
      Number(valorBase),
      pacienteObj,
      ehRevisao
    );

    const novaConsulta: Consulta = {
      id: crypto.randomUUID(),
      pacienteId: pacienteSel,
      consultorioId: consultorioSel,
      data: dataString,
      horario: horarioForm,
      ehRevisao,
      ehEncaixe,
      valorConsulta: valorFinalCalculado,
    };

    setConsultas([...consultas, novaConsulta]);
    setPacienteSel("");
    setHorarioForm("");
    setEhRevisao(false);
    setEhEncaixe(false);
    notifications.show({
      title: "Consulta Marcada",
      message: `Agendamento homologado com sucesso! Valor cobrado: R$ ${valorFinalCalculado.toFixed(
        2
      )}`,
      color: "green",
    });
  };

  // Método: contarConsultasMesPlano()
  const contarConsultasMesPlano = (planoNome: string): number => {
    return consultas.filter((c) => {
      const pac = pacientes.find((p) => p.id === c.pacienteId);
      return pac && pac.convenio === planoNome;
    }).length;
  };

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      {/* Header */}
      <div className="bg-sky-700 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                CliniManager Pro — Sistema Integrado
              </Title>
              <Text size="sm" className="opacity-80">
                Mapeamento Imediato de Casos de Uso e Agendas Semanais
              </Text>
            </div>
            <Badge
              size="lg"
              color="sky"
              variant="filled"
              className="bg-sky-800"
            >
              Questão 11
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="consultas" color="sky" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="consultas" className="font-medium">
              📅 Marcar & Listar Consultas
            </Tabs.Tab>
            <Tabs.Tab value="pacientes" className="font-medium">
              👤 Pacientes e Convênios
            </Tabs.Tab>
            <Tabs.Tab value="locais" className="font-medium">
              🏢 Locais & Agendas Semanais
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: MARCAÇÃO DE CONSULTAS (RF03 + RF04 + RF05 + RF07) */}
          <Tabs.Panel value="consultas">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Agendar Consulta
                  </Title>
                  <form onSubmit={handleMarcarConsulta}>
                    <Stack gap="xs">
                      <Select
                        label="Selecione o Paciente"
                        placeholder="Escolha o paciente"
                        data={pacientes.map((p) => ({
                          value: p.id,
                          label: `${p.nome} (${p.convenio})`,
                        }))}
                        value={pacienteSel}
                        onChange={(val) => setPacienteSel(val)}
                        required
                      />
                      <Select
                        label="Consultório de Atendimento"
                        placeholder="Qual filial?"
                        data={consultorios.map((c) => ({
                          value: c.id,
                          label: `${c.bairro} — ${c.endereco}`,
                        }))}
                        value={consultorios.length > 0 ? consultorioSel : ""}
                        onChange={(val) => setConsultorioSel(val)}
                        required
                      />
                      <DateInput
                        label="Data da Consulta"
                        value={dataConsultaForm}
                        onChange={(val) => setDataConsultaForm(val as any)}
                        required
                      />
                      <TextInput
                        label="Horário (HH:MM)"
                        placeholder="Ex: 09:30"
                        value={horarioForm}
                        onChange={(e) => setHorarioForm(e.target.value)}
                        required
                      />
                      <NumberInput
                        label="Valor Base Particular (R$)"
                        min={0}
                        decimalScale={2}
                        value={valorBase}
                        onChange={(val) => setValorBase(val)}
                        required
                      />

                      <Divider
                        className="my-1"
                        label="Gatilhos de Extensão OO"
                        labelPosition="left"
                      />

                      <Checkbox
                        label="Consulta de Revisão (Retorno Gratuito)"
                        checked={ehRevisao}
                        onChange={(e) => setEhRevisao(e.currentTarget.checked)}
                      />
                      <Checkbox
                        label="Gerenciar Encaixe (Ignora conflito)"
                        checked={ehEncaixe}
                        onChange={(e) => setEhEncaixe(e.currentTarget.checked)}
                        className="mb-2"
                      />

                      <Button type="submit" color="sky" fullWidth size="md">
                        Confirmar Agendamento
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Agenda do Dia e Indicadores de Convênio
                  </Title>

                  {/* Método: contarConsultasMesPlano() Renderizado em formato de Cards Rápidos */}
                  <Group
                    gap="xs"
                    className="mb-6 bg-slate-50 p-3 rounded-lg border"
                  >
                    <div>
                      <Text size="xs" color="dimmed">
                        Particular:
                      </Text>
                      <Badge color="blue" size="lg">
                        {contarConsultasMesPlano("Particular")} guias
                      </Badge>
                    </div>
                    <div>
                      <Text size="xs" color="dimmed">
                        Plano Unimed:
                      </Text>
                      <Badge color="green" size="lg">
                        {contarConsultasMesPlano("Unimed")} guias
                      </Badge>
                    </div>
                    <div>
                      <Text size="xs" color="dimmed">
                        Plano Amil:
                      </Text>
                      <Badge color="orange" size="lg">
                        {contarConsultasMesPlano("Amil")} guias
                      </Badge>
                    </div>
                  </Group>

                  {consultas.length === 0 ? (
                    <Text size="sm" className="text-center py-12 text-gray-400">
                      Nenhuma consulta agendada na base.
                    </Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Paciente</Table.Th>
                            <Table.Th>Local</Table.Th>
                            <Table.Th>Data/Hora</Table.Th>
                            <Table.Th>Modalidade</Table.Th>
                            <Table.Th style={{ textAlign: "right" }}>
                              Valor Comercial
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {consultas.map((c) => {
                            const pac = pacientes.find(
                              (p) => p.id === c.pacienteId
                            );
                            const con = consultorios.find(
                              (o) => o.id === c.consultorioId
                            );
                            return (
                              <Table.Tr key={c.id}>
                                <Table.Td className="font-semibold text-slate-700">
                                  {pac ? pac.nome : "Removido"}
                                </Table.Td>
                                <Table.Td>
                                  {con ? con.bairro : "Removido"}
                                </Table.Td>
                                <Table.Td>
                                  {c.data} às {c.horario}
                                </Table.Td>
                                <Table.Td>
                                  <Group gap="5">
                                    {c.ehRevisao && (
                                      <Badge color="teal" size="xs">
                                        Revisão
                                      </Badge>
                                    )}
                                    {c.ehEncaixe && (
                                      <Badge color="orange" size="xs">
                                        Encaixe
                                      </Badge>
                                    )}
                                    {!c.ehRevisao && !c.ehEncaixe && (
                                      <Badge color="blue" size="xs">
                                        Regular
                                      </Badge>
                                    )}
                                  </Group>
                                </Table.Td>
                                <Table.Td
                                  style={{ textAlign: "right" }}
                                  className="font-bold text-slate-800"
                                >
                                  R$ {c.valorConsulta.toFixed(2)}
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

          {/* TAB 2: PACIENTES (RF06) */}
          <Tabs.Panel value="pacientes">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cadastrar Paciente
                  </Title>
                  <form onSubmit={handleCadastrarPaciente}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome do Paciente"
                        placeholder="Nome completo"
                        value={nomePac}
                        onChange={(e) => setNomePac(e.target.value)}
                        required
                      />
                      <TextInput
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        value={telPac}
                        onChange={(e) => setTelPac(e.target.value)}
                      />
                      <Select
                        label="Plano de Saúde / Convênio (RF07)"
                        data={[
                          "Particular",
                          "Unimed",
                          "Amil",
                          "Bradesco Saúde",
                        ]}
                        value={convenioPac}
                        onChange={(val) => setConvenioPac(val)}
                        required
                      />
                      <Button
                        type="submit"
                        color="sky"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar Paciente
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Fichas Clínicas Cadastradas
                  </Title>
                  {pacientes.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum paciente vinculado à clínica.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nome Completo</Table.Th>
                          <Table.Th>Telefone</Table.Th>
                          <Table.Th>Plano / Convênio</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {pacientes.map((p) => (
                          <Table.Tr key={p.id}>
                            <Table.Td className="font-semibold text-slate-700">
                              👤 {p.nome}
                            </Table.Td>
                            <Table.Td>{p.telefone || "-"}</Table.Td>
                            <Table.Td>
                              <Badge
                                color={
                                  p.convenio === "Particular" ? "gray" : "green"
                                }
                              >
                                {p.convenio}
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

          {/* TAB 3: LOCAIS E AGENDAS (RF01 + RF02) */}
          <Tabs.Panel value="locais">
            <Grid>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap="md">
                  <Card shadow="sm" radius="md" withBorder>
                    <Title order={4} className="mb-4 text-gray-700">
                      Cadastrar Consultório
                    </Title>
                    <form onSubmit={handleCadastrarConsultorio}>
                      <Stack gap="sm">
                        <TextInput
                          label="Bairro"
                          placeholder="Ex: Manaíra"
                          value={bairro}
                          onChange={(e) => setBairro(e.target.value)}
                          required
                        />
                        <TextInput
                          label="Endereço Completo"
                          placeholder="Ex: Av. Sapé, 450"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          required
                        />
                        <Button type="submit" color="sky" fullWidth>
                          Salvar Local
                        </Button>
                      </Stack>
                    </form>
                  </Card>

                  <Card shadow="sm" radius="md" withBorder>
                    <Title order={4} className="mb-4 text-gray-700">
                      Controlar Horários da Agenda
                    </Title>
                    <form onSubmit={handleCadastrarAgenda}>
                      <Stack gap="sm">
                        <Select
                          label="Consultório Alvo"
                          data={consultorios.map((c) => ({
                            value: c.id,
                            label: c.bairro,
                          }))}
                          value={consultorioAgenda}
                          onChange={(val) => setConsultorioAgenda(val)}
                          required
                        />
                        <Select
                          label="Dia da Semana"
                          data={[
                            "Segunda-Feira",
                            "Terça-Feira",
                            "Quarta-Feira",
                            "Quinta-Feira",
                            "Sexta-Feira",
                          ]}
                          value={diaSemana}
                          onChange={(val) => setDiaSemana(val)}
                          required
                        />
                        <TextInput
                          label="Hora de Início (HH:MM)"
                          placeholder="08:00"
                          value={horaInicio}
                          onChange={(e) => setHoraInicio(e.target.value)}
                          required
                        />
                        <TextInput
                          label="Hora de Término (HH:MM)"
                          placeholder="18:00"
                          value={horaFim}
                          onChange={(e) => setHoraFim(e.target.value)}
                          required
                        />
                        <Button type="submit" color="teal" fullWidth>
                          Vincular Cronograma
                        </Button>
                      </Stack>
                    </form>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 7 }}>
                <Card shadow="sm" radius="md" withBorder className="h-full">
                  <Title order={4} className="mb-4 text-gray-700">
                    Configuração de Cronogramas Ativos (validarDiaAtendimento)
                  </Title>
                  {agendas.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhuma restrição de dia semanal lançada.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Consultório</Table.Th>
                          <Table.Th>Dia de Atendimento</Table.Th>
                          <Table.Th>Expediente</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {agendas.map((ag) => {
                          const con = consultorios.find(
                            (o) => o.id === ag.consultorioId
                          );
                          return (
                            <Table.Tr key={ag.id}>
                              <Table.Td className="font-bold text-slate-700">
                                🏢 Bairro {con ? con.bairro : "Removido"}
                              </Table.Td>
                              <Table.Td>
                                <Badge color="teal" variant="light">
                                  {ag.diaSemana}
                                </Badge>
                              </Table.Td>
                              <Table.Td className="font-mono text-xs">
                                {ag.horaInicio} até {ag.horaFim}
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
        </Tabs>
      </Container>
    </MantineProvider>
  );
}
