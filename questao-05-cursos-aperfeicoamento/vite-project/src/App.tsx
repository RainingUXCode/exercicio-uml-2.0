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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT ---
interface Curso {
  id: string;
  nomeCurso: string;
  cargaHoraria: number;
  conteudoProgramatico: string;
  valorCurso: number;
}

interface Turma {
  id: string;
  cursoId: string;
  dataInicio: string;
  dataTermino: string;
  horario: string;
  professorId: string | null;
}

interface Professor {
  id: string;
  nomeProf: string;
  celular: string;
  valorHoraAula: number;
}

interface Aluno {
  id: string;
  nomeAluno: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  telefone: string;
}

interface Matricula {
  id: string;
  alunoId: string;
  turmaId: string;
  dataMatricula: string;
  valorPago: number;
  pago: boolean;
}

export default function App() {
  // --- ESTADOS DA APLICAÇÃO ---
  const [cursos, setCursos] = useState<Curso[]>(() =>
    JSON.parse(localStorage.getItem("cursos") || "[]")
  );
  const [turmas, setTurmas] = useState<Turma[]>(() =>
    JSON.parse(localStorage.getItem("turmas") || "[]")
  );
  const [professores, setProfessores] = useState<Professor[]>(() =>
    JSON.parse(localStorage.getItem("professores") || "[]")
  );
  const [alunos, setAlunos] = useState<Aluno[]>(() =>
    JSON.parse(localStorage.getItem("alunos") || "[]")
  );
  const [matriculas, setMatriculas] = useState<Matricula[]>(() =>
    JSON.parse(localStorage.getItem("matriculas") || "[]")
  );

  // --- ESTADOS DOS FORMULÁRIOS ---
  const [nomeCurso, setNomeCurso] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState<string | number>(0);
  const [conteudoProgramatico, setConteudoProgramatico] = useState("");
  const [valorCurso, setValorCurso] = useState<string | number>(0);

  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataTermino, setDataTermino] = useState<Date | null>(null);
  const [horario, setHorario] = useState("");
  const [cursoSelecionado, setCursoSelecionado] = useState<string | null>("");
  const [professorAlocado, setProfessorAlocado] = useState<string | null>("");

  const [nomeProf, setNomeProf] = useState("");
  const [celularProf, setCelularProf] = useState("");
  const [valorHoraAula, setValorHoraAula] = useState<string | number>(0);

  const [nomeAluno, setNomeAluno] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [telefoneAluno, setTelefoneAluno] = useState("");

  const [alunoMatricula, setAlunoMatricula] = useState<string | null>("");
  const [turmaMatricula, setTurmaMatricula] = useState<string | null>("");
  const [valorPago, setValorPago] = useState<string | number>(0);

  useEffect(() => {
    localStorage.setItem("cursos", JSON.stringify(cursos));
    localStorage.setItem("turmas", JSON.stringify(turmas));
    localStorage.setItem("professores", JSON.stringify(professores));
    localStorage.setItem("alunos", JSON.stringify(alunos));
    localStorage.setItem("matriculas", JSON.stringify(matriculas));
  }, [cursos, turmas, professores, alunos, matriculas]);

  // --- MÉTODOS OPERACIONAIS ---

  const handleCadastrarCurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCurso) return;
    const novoCurso: Curso = {
      id: crypto.randomUUID(),
      nomeCurso,
      cargaHoraria: Number(cargaHoraria),
      conteudoProgramatico,
      valorCurso: Number(valorCurso),
    };
    setCursos([...cursos, novoCurso]);
    notifications.show({
      title: "Sucesso",
      message: `Curso "${nomeCurso}" cadastrado!`,
      color: "green",
    });
    setNomeCurso("");
    setCargaHoraria(0);
    setConteudoProgramatico("");
    setValorCurso(0);
  };

  const handleCadastrarTurma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoSelecionado || !dataInicio) return;

    const novaTurma: Turma = {
      id: crypto.randomUUID(),
      cursoId: cursoSelecionado,
      dataInicio:
        typeof dataInicio === "string"
          ? dataInicio
          : dataInicio
          ? (dataInicio as Date).toLocaleDateString("pt-BR")
          : "",
      dataTermino:
        typeof dataTermino === "string"
          ? dataTermino
          : dataTermino
          ? (dataTermino as Date).toLocaleDateString("pt-BR")
          : "Não informada",
      horario,
      professorId: professorAlocado || null,
    };

    setTurmas([...turmas, novaTurma]);
    notifications.show({
      title: "Sucesso",
      message: "Turma criada com sucesso!",
      color: "green",
    });
    setCursoSelecionado("");
    setProfessorAlocado("");
    setHorario("");
    setDataInicio(null);
    setDataTermino(null);
  };

  const handleCadastrarProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProf) return;
    const novoProf: Professor = {
      id: crypto.randomUUID(),
      nomeProf,
      celular: celularProf,
      valorHoraAula: Number(valorHoraAula),
    };
    setProfessores([...professores, novoProf]);
    notifications.show({
      title: "Sucesso",
      message: `Professor(a) ${nomeProf} cadastrado(a)!`,
      color: "green",
    });
    setNomeProf("");
    setCelularProf("");
    setValorHoraAula(0);
  };

  const handleCadastrarAluno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeAluno || !cpf) return;
    const novoAluno: Aluno = {
      id: crypto.randomUUID(),
      nomeAluno,
      cpf,
      rg,
      dataNascimento:
        typeof dataNascimento === "string"
          ? dataNascimento
          : dataNascimento
          ? (dataNascimento as Date).toLocaleDateString("pt-BR")
          : "",
      telefone: telefoneAluno,
    };
    setAlunos([...alunos, novoAluno]);
    notifications.show({
      title: "Sucesso",
      message: `Aluno(a) ${nomeAluno} cadastrado(a)!`,
      color: "green",
    });
    setNomeAluno("");
    setCpf("");
    setRg("");
    setDataNascimento(null);
    setTelefoneAluno("");
  };

  const handleRealizarMatricula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoMatricula || !turmaMatricula) return;

    const novaMatricula: Matricula = {
      id: crypto.randomUUID(),
      alunoId: alunoMatricula,
      turmaId: turmaMatricula,
      dataMatricula: new Date().toLocaleDateString("pt-BR"),
      valorPago: Number(valorPago),
      pago: false,
    };

    setMatriculas([...matriculas, novaMatricula]);
    notifications.show({
      title: "Matrícula Iniciada",
      message: "Matrícula registrada! Aguardando pagamento.",
      color: "blue",
    });
    setAlunoMatricula("");
    setTurmaMatricula("");
    setValorPago(0);
  };

  const handleConfirmarPagamento = (id: string) => {
    setMatriculas(
      matriculas.map((m) => (m.id === id ? { ...m, pago: true } : m))
    );
    notifications.show({
      title: "Pagamento Confirmado",
      message: "Status atualizado para Pago.",
      color: "green",
    });
  };

  const handleEmitirComprovante = (matricula: Matricula) => {
    const aluno = alunos.find((a) => a.id === matricula.alunoId);
    const turma = turmas.find((t) => t.id === matricula.turmaId);
    const curso = turma ? cursos.find((c) => c.id === turma.cursoId) : null;

    alert(`
      === COMPROVANTE DE MATRÍCULA ===
      Código da Matrícula: ${matricula.id.substring(0, 8)}
      Data de Emissão: ${matricula.dataMatricula}
      Aluno: ${aluno ? aluno.nomeAluno : "Desconhecido"} (CPF: ${
      aluno ? aluno.cpf : "-"
    })
      Curso: ${curso ? curso.nomeCurso : "Desconhecido"}
      Horário da Turma: ${turma ? turma.horario : "-"}
      Valor Pago: R$ ${matricula.valorPago.toFixed(2)}
      Status: ${matricula.pago ? "PAGO / HOMOLOGADO" : "PENDENTE"}
      ================================
    `);
  };

  const getAlunosDaTurma = (turmaId: string) => {
    const matriculasDaTurma = matriculas.filter((m) =>
      m.turmaId === Math.min.name ? "" : m.turmaId === turmaId
    );
    return matriculasDaTurma
      .map((m) => alunos.find((a) => a.id === m.alunoId))
      .filter((a): a is Aluno => !!a);
  };

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      <div className="bg-blue-600 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                Sistema de Gestão Acadêmica
              </Title>
              <Text size="sm" className="opacity-90">
                Controle de Cursos, Turmas e Matrículas
              </Text>
            </div>
            <Badge
              size="lg"
              color="blue"
              variant="filled"
              className="bg-blue-700"
            >
              Painel Operacional
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="matriculas" color="blue" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="matriculas" className="font-medium">
              📋 Matrículas
            </Tabs.Tab>
            <Tabs.Tab value="cursos" className="font-medium">
              📚 Cursos
            </Tabs.Tab>
            <Tabs.Tab value="turmas" className="font-medium">
              🏫 Turmas
            </Tabs.Tab>
            <Tabs.Tab value="professores" className="font-medium">
              👨‍🏫 Professores
            </Tabs.Tab>
            <Tabs.Tab value="alunos" className="font-medium">
              👤 Alunos
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB: MATRÍCULAS */}
          <Tabs.Panel value="matriculas">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Efetuar Nova Matrícula
                  </Title>
                  <form onSubmit={handleRealizarMatricula}>
                    <Stack gap="sm">
                      <Select
                        label="Selecione o Aluno"
                        placeholder="Escolha um aluno"
                        data={alunos.map((a) => ({
                          value: a.id,
                          label: `${a.nomeAluno} (${a.cpf})`,
                        }))}
                        value={alunoMatricula}
                        onChange={(val) => setAlunoMatricula(val)}
                        required
                      />
                      <Select
                        label="Selecione a Turma"
                        placeholder="Escolha a turma disponível"
                        data={turmas.map((t) => {
                          const c = cursos.find((cur) => cur.id === t.cursoId);
                          return {
                            value: t.id,
                            label: `${c ? c.nomeCurso : "Curso"} - Horário: ${
                              t.horario
                            }`,
                          };
                        })}
                        value={turmaMatricula}
                        onChange={(val) => setTurmaMatricula(val)}
                        required
                      />
                      <NumberInput
                        label="Valor Pago"
                        placeholder="0.00"
                        decimalScale={2}
                        fixedDecimalScale
                        prefix="R$ "
                        value={valorPago}
                        onChange={(val) => setValorPago(val)}
                        required
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Registrar Matrícula
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Registros de Matrículas e Pagamentos
                  </Title>
                  {matriculas.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhuma matrícula efetuada.
                    </Text>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Aluno</Table.Th>
                            <Table.Th>Curso / Horário</Table.Th>
                            <Table.Th>Valor Pago</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Ações</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {matriculas.map((m) => {
                            const aluno = alunos.find(
                              (a) => a.id === m.alunoId
                            );
                            const turma = turmas.find(
                              (t) => t.id === m.turmaId
                            );
                            const curso = turma
                              ? cursos.find((c) => c.id === turma.cursoId)
                              : null;
                            return (
                              <Table.Tr key={m.id}>
                                <Table.Td className="font-medium">
                                  {aluno ? aluno.nomeAluno : "Desconhecido"}
                                </Table.Td>
                                <Table.Td>
                                  {curso ? curso.nomeCurso : "Não definido"} (
                                  {turma ? turma.horario : "-"})
                                </Table.Td>
                                <Table.Td>R$ {m.valorPago.toFixed(2)}</Table.Td>
                                <Table.Td>
                                  <Badge
                                    color={m.pago ? "green" : "yellow"}
                                    variant="light"
                                  >
                                    {m.pago ? "Pago" : "Pendente"}
                                  </Badge>
                                </Table.Td>
                                <Table.Td>
                                  <Group gap="xs">
                                    {!m.pago && (
                                      <Button
                                        size="xs"
                                        color="green"
                                        onClick={() =>
                                          handleConfirmarPagamento(m.id)
                                        }
                                      >
                                        Confirmar
                                      </Button>
                                    )}
                                    <Button
                                      size="xs"
                                      color="gray"
                                      variant="outline"
                                      onClick={() => handleEmitirComprovante(m)}
                                    >
                                      Recibo
                                    </Button>
                                  </Group>
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

          {/* TAB: CURSOS */}
          <Tabs.Panel value="cursos">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cadastrar Novo Curso
                  </Title>
                  <form onSubmit={handleCadastrarCurso}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome do Curso"
                        value={nomeCurso}
                        onChange={(e) => setNomeCurso(e.target.value)}
                        placeholder="Ex: Engenharia de Software"
                        required
                      />
                      <NumberInput
                        label="Carga Horária (horas)"
                        value={cargaHoraria}
                        onChange={(val) => setCargaHoraria(val)}
                        min={0}
                        required
                      />
                      <TextInput
                        label="Conteúdo Programático"
                        value={conteudoProgramatico}
                        onChange={(e) =>
                          setConteudoProgramatico(e.target.value)
                        }
                        placeholder="Ex: Módulos, ementa..."
                      />
                      <NumberInput
                        label="Valor do Curso"
                        value={valorCurso}
                        onChange={(val) => setValorCurso(val)}
                        min={0}
                        decimalScale={2}
                        prefix="R$ "
                        required
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar Curso
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cursos Registrados
                  </Title>
                  {cursos.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum curso cadastrado ainda.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nome</Table.Th>
                          <Table.Th>Carga Horária</Table.Th>
                          <Table.Th>Preço</Table.Th>
                          <Table.Th>Ementa/Conteúdo</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {cursos.map((c) => (
                          <Table.Tr key={c.id}>
                            <Table.Td className="font-medium">
                              {c.nomeCurso}
                            </Table.Td>
                            <Table.Td>{c.cargaHoraria}h</Table.Td>
                            <Table.Td>R$ {c.valorCurso.toFixed(2)}</Table.Td>
                            <Table.Td className="text-sm text-gray-500 max-w-xs truncate">
                              {c.conteudoProgramatico || "Não especificado"}
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

          {/* TAB: TURMAS */}
          <Tabs.Panel value="turmas">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Gerenciar & Criar Turmas
                  </Title>
                  <form onSubmit={handleCadastrarTurma}>
                    <Stack gap="sm">
                      <Select
                        label="Curso Base"
                        placeholder="Selecione um curso"
                        data={cursos.map((c) => ({
                          value: c.id,
                          label: c.nomeCurso,
                        }))}
                        value={cursoSelecionado}
                        onChange={(val) => setCursoSelecionado(val)}
                        required
                      />
                      <Select
                        label="Alocar Professor"
                        placeholder="Vincular professor à turma"
                        data={professores.map((p) => ({
                          value: p.id,
                          label: p.nomeProf,
                        }))}
                        value={professorAlocado}
                        onChange={(val) => setProfessorAlocado(val)}
                        clearable
                      />
                      <DateInput
                        label="Data de Início"
                        placeholder="Selecione"
                        value={dataInicio}
                        onChange={(val) => setDataInicio(val as any)}
                        required
                      />
                      <DateInput
                        label="Data de Término"
                        placeholder="Selecione"
                        value={dataTermino}
                        onChange={(val) => setDataTermino(val as any)}
                      />
                      <TextInput
                        label="Horário das Aulas"
                        placeholder="Ex: 19:00 às 22:00"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Abrir Turma
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Painel de Turmas Ativas
                  </Title>
                  {turmas.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhuma turma aberta.
                    </Text>
                  ) : (
                    <Stack gap="xl">
                      {turmas.map((t) => {
                        const cursoObj = cursos.find((c) => c.id === t.cursoId);
                        const profObj = professores.find(
                          (p) => p.id === t.professorId
                        );
                        const listaAlunosInscritos = getAlunosDaTurma(t.id);

                        return (
                          <Paper
                            key={t.id}
                            withBorder
                            p="md"
                            className="p-4 bg-gray-50 border-gray-200 rounded-lg"
                          >
                            <Group justify="space-between" className="mb-2">
                              <div>
                                <Text
                                  size="lg"
                                  className="font-bold text-blue-700"
                                >
                                  {cursoObj
                                    ? cursoObj.nomeCurso
                                    : "Curso Removido"}
                                </Text>
                                <Text size="xs" className="text-gray-400">
                                  Período: {t.dataInicio} até {t.dataTermino}
                                </Text>
                              </div>
                              <Badge size="md" color="violet">
                                Horário: {t.horario}
                              </Badge>
                            </Group>

                            <Text size="sm" className="mb-3">
                              <strong>Professor Alocado:</strong>{" "}
                              {profObj ? (
                                profObj.nomeProf
                              ) : (
                                <span className="text-red-500">
                                  Nenhum alocado
                                </span>
                              )}
                            </Text>

                            <Divider
                              className="my-2"
                              label="Alunos Inscritos (Método: listarAlunos)"
                              labelPosition="left"
                            />
                            {listaAlunosInscritos.length === 0 ? (
                              <Text size="xs" className="italic text-gray-400">
                                Nenhum estudante matriculado nesta turma.
                              </Text>
                            ) : (
                              <ul className="list-disc pl-5 text-sm text-gray-600">
                                {listaAlunosInscritos.map((al, idx) => (
                                  <li key={idx}>
                                    {al.nomeAluno} (CPF: {al.cpf})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Paper>
                        );
                      })}
                    </Stack>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* TAB: PROFESSORES */}
          <Tabs.Panel value="professores">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cadastrar Professor
                  </Title>
                  <form onSubmit={handleCadastrarProfessor}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome Completo"
                        value={nomeProf}
                        onChange={(e) => setNomeProf(e.target.value)}
                        placeholder="Ex: Dr. Roberto Silva"
                        required
                      />
                      <TextInput
                        label="Telefone / Celular"
                        value={celularProf}
                        onChange={(e) => setCelularProf(e.target.value)}
                        placeholder="(83) 99999-9999"
                      />
                      <NumberInput
                        label="Valor da Hora/Aula"
                        value={valorHoraAula}
                        onChange={(val) => setValorHoraAula(val)}
                        min={0}
                        decimalScale={2}
                        prefix="R$ "
                        required
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar Professor
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Corpo Docente
                  </Title>
                  {professores.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum professor registrado.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nome</Table.Th>
                          <Table.Th>Contato Celular</Table.Th>
                          <Table.Th>Valor Hora/Aula</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {professores.map((p) => (
                          <Table.Tr key={p.id}>
                            <Table.Td className="font-medium">
                              {p.nomeProf}
                            </Table.Td>
                            <Table.Td>{p.celular || "Não cadastrado"}</Table.Td>
                            <Table.Td>R$ {p.valorHoraAula.toFixed(2)}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* TAB: ALUNOS */}
          <Tabs.Panel value="alunos">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cadastrar Aluno
                  </Title>
                  <form onSubmit={handleCadastrarAluno}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome do Aluno"
                        value={nomeAluno}
                        onChange={(e) => setNomeAluno(e.target.value)}
                        placeholder="Nome completo"
                        required
                      />
                      <TextInput
                        label="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        required
                      />
                      <TextInput
                        label="RG"
                        value={rg}
                        onChange={(e) => setRg(e.target.value)}
                        placeholder="0.000.000"
                      />
                      <DateInput
                        label="Data de Nascimento"
                        placeholder="Selecione data"
                        value={dataNascimento}
                        onChange={(val) => setDataNascimento(val as any)}
                      />
                      <TextInput
                        label="Telefone"
                        value={telefoneAluno}
                        onChange={(e) => setTelefoneAluno(e.target.value)}
                        placeholder="Contato"
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar Aluno
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Alunos Cadastrados
                  </Title>
                  {alunos.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum aluno cadastrado.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nome</Table.Th>
                          <Table.Th>CPF</Table.Th>
                          <Table.Th>RG</Table.Th>
                          <Table.Th>Nascimento</Table.Th>
                          <Table.Th>Telefone</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {alunos.map((a) => (
                          <Table.Tr key={a.id}>
                            <Table.Td className="font-medium">
                              {a.nomeAluno}
                            </Table.Td>
                            <Table.Td>{a.cpf}</Table.Td>
                            <Table.Td>{a.rg || "-"}</Table.Td>
                            <Table.Td>{a.dataNascimento || "-"}</Table.Td>
                            <Table.Td>{a.telefone || "-"}</Table.Td>
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
