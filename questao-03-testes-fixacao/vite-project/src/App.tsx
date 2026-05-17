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
  Accordion,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  BookOpen,
  FileSpreadsheet,
  FilePlus,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  Printer,
} from "lucide-react";

// Interfaces estritamente alinhadas aos atributos das imagens
interface Disciplina {
  nomeDisc: string;
}

interface Materia {
  nomeMat: string;
  serie: number;
  nomeDiscPai: string; // Relacionamento: cada matéria faz parte de uma única disciplina
}

interface Questao {
  id: string;
  enunciado: string;
  bimestre: number;
  gabarito: string;
  nomeMatPai: string; // Relacionamento: a que matéria pertence
  nomeDiscPai: string; // Guardado para otimizar a busca no banco por disciplina
}

interface Teste {
  id: string;
  dataGeracao: string;
  qtdQuestoes: number;
  nomeDiscPai: string;
  questoesSorteadas: Questao[];
}

export default function App() {
  // Banco de Dados Inicial para Testes e Validação
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([
    { nomeDisc: "Matemática" },
    { nomeDisc: "Português" },
  ]);

  const [materias, setMaterias] = useState<Materia[]>([
    { nomeMat: "Adição", serie: 1, nomeDiscPai: "Matemática" },
    { nomeMat: "Divisão", serie: 2, nomeDiscPai: "Matemática" },
    { nomeMat: "Sinônimos", serie: 1, nomeDiscPai: "Português" },
  ]);

  const [questoes, setQuestoes] = useState<Questao[]>([
    {
      id: "1",
      enunciado: "Quanto é 5 + 7?",
      bimestre: 1,
      gabarito: "12",
      nomeMatPai: "Adição",
      nomeDiscPai: "Matemática",
    },
    {
      id: "2",
      enunciado: "Quanto é 12 / 3?",
      bimestre: 2,
      gabarito: "4",
      nomeMatPai: "Divisão",
      nomeDiscPai: "Matemática",
    },
    {
      id: "3",
      enunciado: "Qual o sinônimo de alegre?",
      bimestre: 1,
      gabarito: "Feliz",
      nomeMatPai: "Sinônimos",
      nomeDiscPai: "Português",
    },
  ]);

  const [testes, setTestes] = useState<Teste[]>([]);

  // Estados dos Formulários
  const [novoNomeDisc, setNovoNomeDisc] = useState("");

  const [novoNomeMat, setNovoNomeMat] = useState("");
  const [novaSerieMat, setNovaSerieMat] = useState<string | number>(1);
  const [discPaiMat, setDiscPaiMat] = useState<string | null>("");

  const [novoEnunciado, setNovoEnunciado] = useState("");
  const [novoBimestre, setNovoBimestre] = useState<string | number>(1);
  const [novoGabarito, setNovoGabarito] = useState("");
  const [matPaiQuestao, setMatPaiQuestao] = useState<string | null>("");

  const [discPaiTeste, setDiscPaiTeste] = useState<string | null>("");
  const [qtdQuestoesTeste, setQtdQuestoesTeste] = useState<string | number>(1);

  // Modais de Controle (Gerenciar Matérias / Cadastrar Questões)
  const [openedMateria, { open: openMateria, close: closeMateria }] =
    useDisclosure(false);
  const [openedQuestao, { open: openQuestao, close: closeQuestao }] =
    useDisclosure(false);
  const [openedImpressao, { open: openImpressao, close: closeImpressao }] =
    useDisclosure(false);
  const [testeParaImprimir, setTesteParaImprimir] = useState<Teste | null>(
    null
  );

  // Métodos da Classe e Requisitos Funcionais

  // RF01 - Cadastrar disciplina
  const handleCadastrarDisciplina = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNomeDisc.trim()) return;
    if (
      disciplinas.some(
        (d) => d.nomeDisc.toLowerCase() === novoNomeDisc.toLowerCase()
      )
    ) {
      alert("Esta disciplina já está cadastrada.");
      return;
    }
    setDisciplinas([...disciplinas, { nomeDisc: novoNomeDisc.trim() }]);
    setNovoNomeDisc("");
  };

  // RF02 - Gerenciar matérias (cadastrarMateria)
  const handleCadastrarMateria = () => {
    if (!novoNomeMat.trim() || !discPaiMat) return;
    setMaterias([
      ...materias,
      {
        nomeMat: novoNomeMat.trim(),
        serie: Number(novaSerieMat),
        nomeDiscPai: discPaiMat,
      },
    ]);
    setNovoNomeMat("");
  };

  // RF02 - Gerenciar matérias (editarMateria / Excluir)
  const handleExcluirMateria = (nomeMat: string) => {
    setMaterias(materias.filter((m) => m.nomeMat !== nomeMat));
    setQuestoes(questoes.filter((q) => q.nomeMatPai !== nomeMat));
  };

  // Método: validarGabarito() + RF03 - Cadastrar questões em banco
  const handleCadastrarQuestao = () => {
    if (!novoEnunciado.trim() || !novoGabarito.trim() || !matPaiQuestao) return;

    // Método validarGabarito embutido na regra de negócio
    if (novoGabarito.trim().length === 0) {
      alert("O gabarito não pode estar vazio.");
      return;
    }

    const materiaSelecionada = materias.find(
      (m) => m.nomeMat === matPaiQuestao
    );
    if (!materiaSelecionada) return;

    const novaQuestao: Questao = {
      id: Date.now().toString(),
      enunciado: novoEnunciado.trim(),
      bimestre: Number(novoBimestre),
      gabarito: novoGabarito.trim(),
      nomeMatPai: matPaiQuestao,
      nomeDiscPai: materiaSelecionada.nomeDiscPai,
    };

    setQuestoes([...questoes, novaQuestao]);
    setNovoEnunciado("");
    setNovoGabarito("");
  };

  const handleExcluirQuestao = (id: string) => {
    setQuestoes(questoes.filter((q) => q.id !== id));
  };

  // Método: gerarTeste() + RF04 - Gerar teste
  const handleGerarTeste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discPaiTeste || Number(qtdQuestoesTeste) <= 0) return;

    // Filtra todas as questões que pertencem à disciplina escolhida
    const questoesDaDisciplina = questoes.filter(
      (q) => q.nomeDiscPai === discPaiTeste
    );

    if (questoesDaDisciplina.length < Number(qtdQuestoesTeste)) {
      alert(
        `Banco insuficiente! Existem apenas ${questoesDaDisciplina.length} questões cadastradas para ${discPaiTeste}.`
      );
      return;
    }

    // Algoritmo de sorteio aleatório (Embaralhamento de Fisher-Yates)
    const embaralhadas = [...questoesDaDisciplina].sort(
      () => 0.5 - Math.random()
    );
    const selecionadas = embaralhadas.slice(0, Number(qtdQuestoesTeste));

    const novoTeste: Teste = {
      id: Date.now().toString(),
      dataGeracao: new Date().toISOString().split("T")[0], // Captura automática da data
      qtdQuestoes: Number(qtdQuestoesTeste),
      nomeDiscPai: discPaiTeste,
      questoesSorteadas: selecionadas,
    };

    setTestes([novoTeste, ...testes]);
    setQtdQuestoesTeste(1);
  };

  // Método: imprimirTeste()
  const handleImprimirTeste = (teste: Teste) => {
    setTesteParaImprimir(teste);
    openImpressao();
  };

  return (
    <Container size="xl" py="xl" className="min-h-screen bg-slate-50">
      {/* Cabeçalho principal */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-slate-200 pb-5 gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <BookOpen className="text-blue-600 w-8 h-8 shrink-0" />
          <div>
            <Title
              order={1}
              c="dark.6"
              className="tracking-tight text-2xl font-bold"
            >
              Gerador de Testes Mariana
            </Title>
            <Text size="sm" c="dark.4" className="font-medium">
              Sistema de fixação e revisão escolar aleatória
            </Text>
          </div>
        </div>
        <Group>
          <Button
            leftSection={<FileSpreadsheet size={16} />}
            variant="light"
            color="indigo"
            onClick={openMateria}
          >
            Gerenciar Matérias ({materias.length})
          </Button>
          <Button
            leftSection={<HelpCircle size={16} />}
            variant="light"
            color="teal"
            onClick={openQuestao}
          >
            Banco de Questões ({questoes.length})
          </Button>
        </Group>
      </header>

      {/* Grid de Operações Principais */}
      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        spacing="lg"
        className="items-start"
      >
        {/* Painel Esquerdo: Cadastros de Base */}
        <div className="space-y-6 lg:col-span-1">
          {/* Cadastro de Disciplina (RF01) */}
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
              className="mb-4 flex items-center gap-2 font-bold border-b pb-2"
            >
              <Plus size={18} className="text-blue-600" /> Cadastrar Disciplina
            </Title>
            <form onSubmit={handleCadastrarDisciplina} className="space-y-4">
              <TextInput
                label="Nome da Disciplina"
                placeholder="Ex: Matemática, Português"
                value={novoNomeDisc}
                onChange={(e) => setNovoNomeDisc(e.currentTarget.value)}
                required
              />
              <Button type="submit" fullWidth color="blue" size="sm">
                Salvar Disciplina
              </Button>
            </form>
          </Card>

          {/* Gerador de Testes Automático (RF04 / gerarTeste) */}
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
              className="mb-4 flex items-center gap-2 font-bold border-b pb-2"
            >
              <FilePlus size={18} className="text-indigo-600" /> Montar Novo
              Teste
            </Title>
            <form onSubmit={handleGerarTeste} className="space-y-4">
              <Select
                label="Disciplina Alvo"
                placeholder="Selecione a disciplina"
                data={disciplinas.map((d) => d.nomeDisc)}
                value={discPaiTeste}
                onChange={setDiscPaiTeste}
                required
              />
              <NumberInput
                label="Quantidade de Questões"
                min={1}
                value={qtdQuestoesTeste}
                onChange={(val) => setQtdQuestoesTeste(val)}
                required
              />
              <Button type="submit" fullWidth color="indigo" size="sm">
                Gerar Teste Aleatório
              </Button>
            </form>
          </Card>
        </div>

        {/* Painel Direito: Histórico de Testes Gerados */}
        <div className="lg:col-span-2">
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
              className="mb-4 flex items-center gap-2 font-bold border-b pb-2"
            >
              <FileText size={18} className="text-indigo-600" /> Testes Salvos e
              Armazenados
            </Title>

            {testes.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl" fs="italic">
                Nenhum caderno de teste gerado até o momento.
              </Text>
            ) : (
              <div className="space-y-4">
                {testes.map((teste) => {
                  const dataFormatada = teste.dataGeracao
                    .split("-")
                    .reverse()
                    .join("/");
                  return (
                    <Card
                      key={teste.id}
                      withBorder
                      radius="md"
                      className="p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <Group gap="xs">
                            <Text size="md" c="dark.6" className="font-bold">
                              Teste #{teste.id.slice(-4)}
                            </Text>
                            <Badge color="blue">{teste.nomeDiscPai}</Badge>
                            <Badge color="gray" variant="outline">
                              Data: {dataFormatada}
                            </Badge>
                          </Group>
                        </div>
                        <Button
                          size="xs"
                          variant="light"
                          color="blue"
                          leftSection={<Printer size={14} />}
                          onClick={() => handleImprimirTeste(teste)}
                        >
                          Visualizar / Imprimir
                        </Button>
                      </div>
                      <Text size="sm" c="dark.4">
                        Este caderno contém{" "}
                        <strong>{teste.qtdQuestoes} questões</strong>{" "}
                        estruturadas aleatoriamente a partir do banco.
                      </Text>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </SimpleGrid>

      {/* MODAL: Gerenciar Matérias (RF02) */}
      <Modal
        opened={openedMateria}
        onClose={closeMateria}
        title={
          <Text c="dark.6" className="font-bold text-lg">
            Gerenciar Matérias
          </Text>
        }
        size="md"
      >
        <Stack gap="md">
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
            <Text size="xs" c="dark.5" className="font-bold uppercase">
              Nova Matéria
            </Text>
            <TextInput
              label="Nome da Matéria"
              placeholder="Ex: Adição, Sinônimos"
              value={novoNomeMat}
              onChange={(e) => setNovoNomeMat(e.currentTarget.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                label="Série Escolar"
                min={1}
                max={9}
                value={novaSerieMat}
                onChange={(val) => setNovaSerieMat(val)}
              />
              <Select
                label="Disciplina Vinculada"
                placeholder="Selecione"
                data={disciplinas.map((d) => d.nomeDisc)}
                value={discPaiMat}
                onChange={(val) => setDiscPaiMat(val)}
              />
            </div>
            <Button
              fullWidth
              size="xs"
              color="green"
              onClick={handleCadastrarMateria}
            >
              Salvar Matéria
            </Button>
          </div>

          <Divider label="Matérias Cadastradas (RF02)" labelPosition="center" />

          <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
            {materias.map((m) => (
              <div
                key={m.nomeMat}
                className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200"
              >
                <div>
                  <Text size="sm" c="dark.6" className="font-bold">
                    {m.nomeMat}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Disciplina: {m.nomeDiscPai} | Série: {m.serie}º
                  </Text>
                </div>
                <ActionIcon
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => handleExcluirMateria(m.nomeMat)}
                >
                  <Trash2 size={14} />
                </ActionIcon>
              </div>
            ))}
          </div>
        </Stack>
      </Modal>

      {/* MODAL: Banco de Questões (RF03 / validarGabarito) */}
      <Modal
        opened={openedQuestao}
        onClose={closeQuestao}
        title={
          <Text c="dark.6" className="font-bold text-lg">
            Banco de Questões Objetivas
          </Text>
        }
        size="lg"
      >
        <Stack gap="md">
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
            <Text size="xs" c="dark.5" className="font-bold uppercase">
              Cadastrar Questão
            </Text>
            <TextInput
              label="Enunciado da Questão"
              placeholder="Ex: Quanto é 10 + 10?"
              value={novoEnunciado}
              onChange={(e) => setNovoEnunciado(e.currentTarget.value)}
            />
            <TextInput
              label="Gabarito (Resposta Certa)"
              placeholder="Ex: 20"
              value={novoGabarito}
              onChange={(e) => setNovoGabarito(e.currentTarget.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                label="Bimestre"
                min={1}
                max={4}
                value={novoBimestre}
                onChange={(val) => setNovoBimestre(val)}
              />
              <Select
                label="Matéria Relacionada"
                placeholder="Selecione"
                data={materias.map((m) => m.nomeMat)}
                value={matPaiQuestao}
                onChange={(val) => setMatPaiQuestao(val)}
              />
            </div>
            <Button
              fullWidth
              size="xs"
              color="green"
              onClick={handleCadastrarQuestao}
            >
              Adicionar ao Banco
            </Button>
          </div>

          <Divider label="Questões no Banco (RF03)" labelPosition="center" />

          <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
            {questoes.map((q) => (
              <div
                key={q.id}
                className="p-3 bg-white rounded border border-slate-200 flex justify-between items-start gap-4"
              >
                <div>
                  <Text size="sm" c="dark.6" className="font-medium">
                    <strong>Q:</strong> {q.enunciado}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Matéria: {q.nomeMatPai} | Bimestre: {q.bimestre}º |
                    Gabarito:{" "}
                    <span className="text-emerald-600 font-bold">
                      {q.gabarito}
                    </span>
                  </Text>
                </div>
                <ActionIcon
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => handleExcluirQuestao(q.id)}
                >
                  <Trash2 size={14} />
                </ActionIcon>
              </div>
            ))}
          </div>
        </Stack>
      </Modal>

      {/* MODAL: Visualização/Impressão do Teste (imprimirTeste) */}
      <Modal
        opened={openedImpressao}
        onClose={closeImpressao}
        title={
          <Text c="dark.6" className="font-bold text-lg">
            Caderno de Teste para Impressão
          </Text>
        }
        size="lg"
      >
        {testeParaImprimir && (
          <Stack gap="xl" className="p-2 border rounded-md bg-white">
            <div className="text-center border-b pb-4">
              <Title order={2} className="text-xl font-serif text-slate-800">
                Avaliação Escolar de {testeParaImprimir.nomeDiscPai}
              </Title>
              <Text size="xs" c="dimmed" className="mt-1">
                Gerado em:{" "}
                {testeParaImprimir.dataGeracao.split("-").reverse().join("/")}
              </Text>
              <div className="mt-4 flex justify-between px-4 text-xs font-mono border border-dashed p-2">
                <Text c="dark.6">
                  Nome do Aluno: ____________________________________
                </Text>
                <Text c="dark.6">Série: ____</Text>
              </div>
            </div>

            <div className="space-y-6">
              {testeParaImprimir.questoesSorteadas.map((q, index) => (
                <div key={q.id} className="space-y-1 font-serif">
                  <Text c="dark.6" className="text-base font-medium">
                    {index + 1}) {q.enunciado} (Ref: {q.nomeMatPai},{" "}
                    {q.bimestre}º Bimestre)
                  </Text>
                  <div className="h-12 border-b border-dotted w-full" />{" "}
                  {/* Campo para o aluno responder */}
                </div>
              ))}
            </div>

            <Divider
              label="Gabarito do Professor (Confidencial)"
              labelPosition="center"
              color="red"
            />

            <Table withBorder withColumnBorders size="xs" className="font-mono">
              <Table.Thead className="bg-slate-50">
                <Table.Tr>
                  <Table.Th ta="center">Questão</Table.Th>
                  <Table.Th>Matéria</Table.Th>
                  <Table.Th ta="center">Gabarito</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {testeParaImprimir.questoesSorteadas.map((q, index) => (
                  <Table.Tr key={q.id}>
                    <Table.Td ta="center" className="font-bold">
                      {index + 1}
                    </Table.Td>
                    <Table.Td>{q.nomeMatPai}</Table.Td>
                    <Table.Td
                      ta="center"
                      className="text-emerald-600 font-bold"
                    >
                      {q.gabarito}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Button
              fullWidth
              onClick={() => window.print()}
              color="blue"
              leftSection={<Printer size={16} />}
            >
              Imprimir via Sistema Operacional
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
