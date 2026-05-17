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
  Sparkles,
  Calendar,
  UserPlus,
  Layers,
  Plus,
  Trash2,
  TicketPercent,
  MapPin,
} from "lucide-react";

// Interfaces estritamente mapeadas a partir do seu diagrama de classes
interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

interface ItemTema {
  id: string;
  nomeItem: string;
}

interface Tema {
  id: string;
  nomeTema: string;
  valorAluguel: number;
  corToalha: string;
  itens: ItemTema[];
}

interface Aluguel {
  id: string;
  dataFesta: string;
  horaInicio: string;
  horaFinal: string;
  endereco: string;
  valorCobrado: number;
  clienteId: string;
  temaId: string;
}

export default function App() {
  // Banco de Dados Inicial (Mocked)
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: "c1", nome: "Mariana Silva", telefone: "83988884433" },
  ]);

  const [temas, setTemas] = useState<Tema[]>([
    {
      id: "t1",
      nomeTema: "Cinderela",
      valorAluguel: 250.0,
      corToalha: "Azul Claro",
      itens: [
        { id: "i1", nomeItem: "Castelo de MDF" },
        { id: "i2", nomeItem: "Boneca da Cinderela" },
      ],
    },
  ]);

  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);

  // Estados dos Formulários
  const [novoNomeCliente, setNovoNomeCliente] = useState("");
  const [novoTelefoneCliente, setNovoTelefoneCliente] = useState("");

  const [novoNomeTema, setNovoNomeTema] = useState("");
  const [novoValorAluguel, setNovoValorAluguel] = useState<string | number>(
    100
  );
  const [novaCorToalha, setNovaCorToalha] = useState("");

  const [novaDataFesta, setNovaDataFesta] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [novaHoraInicio, setNovaHoraInicio] = useState("14:00");
  const [novaHoraFinal, setNovaHoraFinal] = useState("18:00");
  const [novoEndereco, setNovoEndereco] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(
    ""
  );
  const [temaSelecionado, setTemaSelecionado] = useState<string | null>("");
  const [aplicarDescontoId, setAplicarDescontoId] = useState<string | null>("");
  const [porcentagemDesconto, setPorcentagemDesconto] = useState<
    string | number
  >(10);

  // Estados de Controle de Subitens (ItemTema)
  const [temaParaItens, setTemaParaItens] = useState<Tema | null>(null);
  const [novoNomeItem, setNovoNomeItem] = useState("");

  // Modais
  const [openedTemas, { open: openTemas, close: closeTemas }] =
    useDisclosure(false);
  const [openedDesconto, { open: openDesconto, close: closeDesconto }] =
    useDisclosure(false);

  // MÉTODOS DO SEU DIAGRAMA DE CLASSES

  // RF01 - Cadastrar cliente (+ atualizarTelefone)
  const handleCadastrarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNomeCliente.trim() || !novoTelefoneCliente.trim()) return;

    setClientes([
      ...clientes,
      {
        id: Date.now().toString(),
        nome: novoNomeCliente.trim(),
        telefone: novoTelefoneCliente.trim(),
      },
    ]);

    setNovoNomeCliente("");
    setNovoTelefoneCliente("");
  };

  // RF02 - Gerenciar temas (cadastrarTema)
  const handleCadastrarTema = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNomeTema.trim() || !novaCorToalha.trim()) return;

    setTemas([
      ...temas,
      {
        id: Date.now().toString(),
        nomeTema: novoNomeTema.trim(),
        valorAluguel: Number(novoValorAluguel),
        corToalha: novaCorToalha.trim(),
        itens: [],
      },
    ]);

    setNovoNomeTema("");
    setNovaCorToalha("");
  };

  // Método: adicionarItem()
  const handleAdicionarItemTema = () => {
    if (!novoNomeItem.trim() || !temaParaItens) return;

    const novoItem: ItemTema = {
      id: Date.now().toString(),
      nomeItem: novoNomeItem.trim(),
    };

    const temasAtualizados = temas.map((t) => {
      if (t.id === temaParaItens.id) {
        const novosItens = [...t.itens, novoItem];
        return { ...t, itens: novosItens };
      }
      return t;
    });

    setTemas(temasAtualizados);
    const temaAtualizado = temasAtualizados.find(
      (t) => t.id === temaParaItens.id
    );
    if (temaAtualizado) setTemaParaItens(temaAtualizado);
    setNovoNomeItem("");
  };

  // Método: calcularTotal() + validarDisponibilidade() + RF03 - Registrar aluguel
  const handleRegistrarAluguel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado || !temaSelecionado || !novoEndereco.trim()) return;

    const temaEscolhido = temas.find((t) => t.id === temaSelecionado);
    if (!temaEscolhido) return;

    // validarDisponibilidade(): Evita choque de aluguel do mesmo tema na mesma data
    const jaAlugado = alugueis.some(
      (a) => a.temaId === temaSelecionado && a.dataFesta === novaDataFesta
    );
    if (jaAlugado) {
      alert("Aviso: Este tema já está reservado para a data selecionada!");
      return;
    }

    const novoAluguel: Aluguel = {
      id: Date.now().toString(),
      dataFesta: novaDataFesta,
      horaInicio: novaHoraInicio,
      horaFinal: novaHoraFinal,
      endereco: novoEndereco.trim(),
      valorCobrado: temaEscolhido.valorAluguel, // calcularTotal() inicial base
      clienteId: clienteSelecionado,
      temaId: temaSelecionado,
    };

    setAlugueis([novoAluguel, ...alugueis]);
    setNovoEndereco("");
    setTemaSelecionado("");
  };

  // Método: calcularDesconto() + RF04 - Aplicar desconto
  const handleAplicarDesconto = () => {
    if (!aplicarDescontoId) return;

    setAlugueis(
      alugueis.map((aluguel) => {
        if (aluguel.id === aplicarDescontoId) {
          const reducao =
            (aluguel.valorCobrado * Number(porcentagemDesconto)) / 100;
          return {
            ...aluguel,
            valorCobrado: Number((aluguel.valorCobrado - reducao).toFixed(2)),
          };
        }
        return aluguel;
      })
    );

    closeDesconto();
  };

  const abrirModalDesconto = (id: string) => {
    setAplicarDescontoId(id);
    openDesconto();
  };

  const abrirModalItens = (tema: Tema) => {
    setTemaParaItens(tema);
    openTemas();
  };

  return (
    <Container size="xl" py="xl" className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-slate-200 pb-5 gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <Sparkles className="text-blue-600 w-8 h-8 shrink-0" />
          <div>
            <Title
              order={1}
              c="dark.6"
              className="tracking-tight text-2xl font-bold"
            >
              Rafaela Festas Infantis
            </Title>
            <Text size="sm" c="dark.4" className="font-medium">
              Sistema de Gestão de Acervos e Aluguel de Temas
            </Text>
          </div>
        </div>
        <Button
          leftSection={<Layers size={16} />}
          color="indigo"
          onClick={() => abrirModalItens(temas[0])}
        >
          Gerenciar Itens dos Temas
        </Button>
      </header>

      {/* Grid Principal */}
      <SimpleGrid
        cols={{ base: 1, lg: 3 }}
        spacing="lg"
        className="items-start"
      >
        {/* Painel Esquerdo: Cadastros de Clientes e Temas */}
        <div className="space-y-6 lg:col-span-1">
          {/* RF01: Cadastrar Cliente */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Title
              order={3}
              size="h5"
              c="dark.6"
              className="mb-3 flex items-center gap-2 font-bold border-b pb-1.5"
            >
              <UserPlus size={16} className="text-blue-600" /> Cadastrar Cliente
            </Title>
            <form onSubmit={handleCadastrarCliente} className="space-y-3">
              <TextInput
                label="Nome do Cliente"
                placeholder="Ex: Bruna Alencar"
                value={novoNomeCliente}
                onChange={(e) => setNovoNomeCliente(e.currentTarget.value)}
                required
              />
              <TextInput
                label="Telefone de Contato"
                placeholder="Ex: 83988881122"
                value={novoTelefoneCliente}
                onChange={(e) => setNovoTelefoneCliente(e.currentTarget.value)}
                required
              />
              <Button type="submit" fullWidth color="blue" size="xs">
                Salvar Cliente
              </Button>
            </form>
          </Card>

          {/* RF02: Cadastrar Tema */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Title
              order={3}
              size="h5"
              c="dark.6"
              className="mb-3 flex items-center gap-2 font-bold border-b pb-1.5"
            >
              <Layers size={16} className="text-indigo-600" /> Novo Tema de
              Festa
            </Title>
            <form onSubmit={handleCadastrarTema} className="space-y-3">
              <TextInput
                label="Nome do Tema"
                placeholder="Ex: Heróis, Safari"
                value={novoNomeTema}
                onChange={(e) => setNovoNomeTema(e.currentTarget.value)}
                required
              />
              <NumberInput
                label="Valor Base do Aluguel (R$)"
                min={0}
                value={novoValorAluguel}
                onChange={(val) => setNovoValorAluguel(val)}
                required
              />
              <TextInput
                label="Cor da Toalha da Mesa"
                placeholder="Ex: Rosa choque, Quadriculado"
                value={novaCorToalha}
                onChange={(e) => setNovaCorToalha(e.currentTarget.value)}
                required
              />
              <Button type="submit" fullWidth color="indigo" size="xs">
                Salvar Tema
              </Button>
            </form>
          </Card>
        </div>

        {/* Painel Central: Registrar Aluguel */}
        <div className="lg:col-span-1">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Title
              order={3}
              size="h5"
              c="dark.6"
              className="mb-3 flex items-center gap-2 font-bold border-b pb-1.5"
            >
              <Calendar size={16} className="text-emerald-600" /> Registrar Novo
              Aluguel
            </Title>
            <form onSubmit={handleRegistrarAluguel} className="space-y-3">
              <Select
                label="Selecione o Cliente"
                placeholder="Puxar cadastro"
                data={clientes.map((c) => ({ value: c.id, label: c.nome }))}
                value={clienteSelecionado}
                onChange={(val) => setClienteSelecionado(val)}
                required
              />
              <Select
                label="Selecione o Tema"
                placeholder="Puxar acervo"
                data={temas.map((t) => ({
                  value: t.id,
                  label: `${t.nomeTema} (R$ ${t.valorAluguel})`,
                }))}
                value={temaSelecionado}
                onChange={(val) => setTemaSelecionado(val)}
                required
              />
              <TextInput
                label="Data do Evento"
                type="date"
                value={novaDataFesta}
                onChange={(e) => setNovaDataFesta(e.currentTarget.value)}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Hora Início"
                  type="time"
                  value={novaHoraInicio}
                  onChange={(e) => setNovaHoraInicio(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Hora Término"
                  type="time"
                  value={novaHoraFinal}
                  onChange={(e) => setNovaHoraFinal(e.currentTarget.value)}
                  required
                />
              </div>
              <TextInput
                label="Endereço Completo da Festa"
                placeholder="Rua, Número e Bairro"
                value={novoEndereco}
                onChange={(e) => setNovoEndereco(e.currentTarget.value)}
                required
              />
              <Button type="submit" fullWidth color="emerald" size="xs">
                Concluir Reserva
              </Button>
            </form>
          </Card>
        </div>

        {/* Painel Direito: Histórico de Aluguéis e Auditoria Financeira */}
        <div className="lg:col-span-1">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Title
              order={3}
              size="h5"
              c="dark.6"
              className="mb-3 flex items-center gap-2 font-bold border-b pb-1.5"
            >
              <MapPin size={16} className="text-slate-600" /> Aluguéis
              Registrados
            </Title>

            {alugueis.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl" fs="italic" size="sm">
                Nenhum contrato ativo.
              </Text>
            ) : (
              <Stack gap="xs">
                {alugueis.map((a) => {
                  const cli = clientes.find((c) => c.id === a.clienteId);
                  const tem = temas.find((t) => t.id === a.temaId);
                  return (
                    <div
                      key={a.id}
                      className="p-3 bg-slate-50 rounded border text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <Text size="sm" c="dark.6" className="font-bold">
                          {cli?.nome || "Desconhecido"}
                        </Text>
                        <Badge color="green" size="sm">
                          R$ {a.valorCobrado.toFixed(2)}
                        </Badge>
                      </div>
                      <Text c="dark.5">
                        Tema escolhido: <strong>{tem?.nomeTema}</strong>
                      </Text>
                      <Text c="dark.4">
                        Data: {a.dataFesta.split("-").reverse().join("/")} (
                        {a.horaInicio} às {a.horaFinal})
                      </Text>
                      <Text c="dark.4" className="line-clamp-1">
                        End: {a.endereco}
                      </Text>

                      <Button
                        size="2xs"
                        variant="light"
                        color="orange"
                        fullWidth
                        mt="xs"
                        leftSection={<TicketPercent size={12} />}
                        onClick={() => abrirModalDesconto(a.id)}
                      >
                        Aplicar Desconto (RF04)
                      </Button>
                    </div>
                  );
                })}
              </Stack>
            )}
          </Card>
        </div>
      </SimpleGrid>

      {/* MODAL: Gerenciar Itens do Tema */}
      <Modal
        opened={openedTemas}
        onClose={closeTemas}
        title={
          <Text c="dark.6" className="font-bold">
            Gerenciar Itens do Acervo
          </Text>
        }
        size="md"
      >
        <Stack gap="sm">
          <Select
            label="Escolha o Tema para Visualizar/Modificar"
            data={temas.map((t) => ({ value: t.id, label: t.nomeTema }))}
            value={temaParaItens?.id || ""}
            onChange={(val) =>
              setTemaParaItens(temas.find((t) => t.id === val) || null)
            }
          />

          {temaParaItens && (
            <>
              <div className="p-3 bg-slate-50 border rounded text-xs space-y-1">
                <Text c="dark.6">
                  Cor padrão da Toalha:{" "}
                  <strong>{temaParaItens.corToalha}</strong>
                </Text>
                <Text c="dark.6">
                  Preço Base do Aluguel:{" "}
                  <strong>R$ {temaParaItens.valorAluguel.toFixed(2)}</strong>
                </Text>
              </div>

              <div className="bg-slate-100 p-2 rounded flex gap-2 items-end">
                <TextInput
                  placeholder="Ex: Boneca de feltro, Suporte de doces"
                  className="flex-1"
                  label="Novo Item Componente"
                  value={novoNomeItem}
                  onChange={(e) => setNovoNomeItem(e.currentTarget.value)}
                />
                <Button
                  size="xs"
                  color="blue"
                  onClick={handleAdicionarItemTema}
                >
                  adicionarItem()
                </Button>
              </div>

              <Text
                size="xs"
                className="font-bold uppercase text-slate-500 mt-2"
              >
                Peças inclusas neste tema:
              </Text>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {temaParaItens.itens.length === 0 ? (
                  <Text size="xs" c="dimmed" fs="italic">
                    Nenhum item atrelado a este tema ainda.
                  </Text>
                ) : (
                  temaParaItens.itens.map((item) => (
                    <div
                      key={item.id}
                      className="p-1.5 bg-white border text-xs rounded font-medium text-slate-700"
                    >
                      • {item.nomeItem}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </Stack>
      </Modal>

      {/* MODAL: Aplicar Desconto (RF04) */}
      <Modal
        opened={openedDesconto}
        onClose={closeDesconto}
        title={
          <Text c="dark.6" className="font-bold">
            Conceder Desconto Especial
          </Text>
        }
        size="xs"
      >
        <Stack gap="md">
          <NumberInput
            label="Porcentagem do Desconto (%)"
            min={0}
            max={100}
            value={porcentagemDesconto}
            onChange={(val) => setPorcentagemDesconto(val)}
          />
          <Button
            fullWidth
            color="orange"
            size="xs"
            onClick={handleAplicarDesconto}
          >
            Confirmar Abatimento
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
