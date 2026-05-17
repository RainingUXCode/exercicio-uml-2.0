import { useState } from "react";
import {
  Container,
  TextInput,
  NumberInput,
  Button,
  Card,
  Text,
  Progress,
  Group,
  Stack,
  Title,
  Textarea,
  Badge,
  ActionIcon,
  Modal,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Trash, Plus, Check, ListTodo, ClipboardList } from "lucide-react";

// Definição das Interfaces para o TypeScript
interface ItemExecucao {
  id: string;
  descricao: string;
  percentualItem: number;
  dataConclusao: string;
}

interface Tarefa {
  id: string;
  nome: string;
  prioridade: number;
  dataLimite: string;
  percentualConcluido: number;
  detalhamento: string;
  itensExecucao: ItemExecucao[];
}

export default function App() {
  // Estado tipado para a lista de tarefas
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    {
      id: "1",
      nome: "Aniversário do Fábio",
      prioridade: 1.1,
      dataLimite: "2005-08-06",
      percentualConcluido: 65,
      detalhamento:
        "Planejamento dos preparativos para a festa de aniversário do Fábio, no sábado, dia 6 de agosto.",
      itensExecucao: [
        {
          id: "i1",
          descricao: "Aluguel do salão e da animação",
          percentualItem: 20,
          dataConclusao: "2005-03-01",
        },
        {
          id: "i2",
          descricao: "Encomenda do bolo, salgados e doces",
          percentualItem: 20,
          dataConclusao: "2005-07-15",
        },
        {
          id: "i3",
          descricao: "Compra das bebidas",
          percentualItem: 5,
          dataConclusao: "",
        },
        {
          id: "i4",
          descricao: "Compra dos itens para decoração",
          percentualItem: 25,
          dataConclusao: "2005-07-01",
        },
        {
          id: "i5",
          descricao: "Arrumação do Salão",
          percentualItem: 30,
          dataConclusao: "",
        },
      ],
    },
  ]);

  // Estados dos formulários com inferência de tipo correta
  const [novoNome, setNovoNome] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState<string | number>(1.0);
  const [novaDataLimite, setNovaDataLimite] = useState("");
  const [novoDetalhamento, setNovoDetalhamento] = useState("");

  // Gerenciamento do modal
  const [opened, { open, close }] = useDisclosure(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(
    null
  );

  // Estados para criação de novo Item de Execução
  const [novaDescricaoItem, setNovaDescricaoItem] = useState("");
  const [novoPercentualItem, setNovoPercentualItem] = useState<string | number>(
    0
  );
  const [novaDataItem, setNovaDataItem] = useState("");

  // RF01 - Cadastrar tarefa
  const handleCadastrarTarefa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      nome: novoNome,
      prioridade: Number(novaPrioridade),
      dataLimite: novaDataLimite,
      percentualConcluido: 0,
      detalhamento: novoDetalhamento,
      itensExecucao: [],
    };

    setTarefas([...tarefas, novaTarefa]);

    // Reset form
    setNovoNome("");
    setNovaPrioridade(1.0);
    setNovaDataLimite("");
    setNovoDetalhamento("");
  };

  // RF05 - Excluir tarefa
  const handleExcluirTarefa = (id: string) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  // Método: calcular automaticamente o progresso (RF03)
  const atualizarLogicaTarefa = (itens: ItemExecucao[]): number => {
    const progressoTotal = itens.reduce((acc, item) => {
      return item.dataConclusao ? acc + item.percentualItem : acc;
    }, 0);
    return Math.min(progressoTotal, 100);
  };

  // RF02 - Gerenciar itens de execução (Adicionar item)
  const handleAdicionarItem = () => {
    if (!novaDescricaoItem.trim() || !tarefaSelecionada) return;

    const somaPesosExistentes = tarefaSelecionada.itensExecucao.reduce(
      (acc, cur) => acc + cur.percentualItem,
      0
    );
    if (somaPesosExistentes + Number(novoPercentualItem) > 100) {
      alert(
        "Erro: A soma dos percentuais dos itens de execução não pode ultrapassar 100%."
      );
      return;
    }

    const novoItem: ItemExecucao = {
      id: Date.now().toString(),
      descricao: novaDescricaoItem,
      percentualItem: Number(novoPercentualItem),
      dataConclusao: novaDataItem,
    };

    const novosItens = [...tarefaSelecionada.itensExecucao, novoItem];
    const novoPercentualTotal = atualizarLogicaTarefa(novosItens);

    const tarefasAtualizadas = tarefas.map((t) => {
      if (t.id === tarefaSelecionada.id) {
        return {
          ...t,
          itensExecucao: novosItens,
          percentualConcluido: novoPercentualTotal,
        };
      }
      return t;
    });

    setTarefas(tarefasAtualizadas);
    setTarefaSelecionada({
      ...tarefaSelecionada,
      itensExecucao: novosItens,
      percentualConcluido: novoPercentualTotal,
    });

    setNovaDescricaoItem("");
    setNovoPercentualItem(0);
    setNovaDataItem("");
  };

  // Método: atualizarPercentual()
  const handleAlternarConclusaoItem = (itemId: string, dataAtual: string) => {
    if (!tarefaSelecionada) return;

    const novosItens = tarefaSelecionada.itensExecucao.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          dataConclusao: item.dataConclusao
            ? ""
            : dataAtual || new Date().toISOString().split("T")[0],
        };
      }
      return item;
    });

    const novoPercentualTotal = atualizarLogicaTarefa(novosItens);

    const tarefasAtualizadas = tarefas.map((t) => {
      if (t.id === tarefaSelecionada.id) {
        return {
          ...t,
          itensExecucao: novosItens,
          percentualConcluido: novoPercentualTotal,
        };
      }
      return t;
    });

    setTarefas(tarefasAtualizadas);
    setTarefaSelecionada({
      ...tarefaSelecionada,
      itensExecucao: novosItens,
      percentualConcluido: novoPercentualTotal,
    });
  };

  // RF02 - Remover subitem
  const handleRemoverItem = (itemId: string) => {
    if (!tarefaSelecionada) return;

    const novosItens = tarefaSelecionada.itensExecucao.filter(
      (item) => item.id !== itemId
    );
    const novoPercentualTotal = atualizarLogicaTarefa(novosItens);

    const tarefasAtualizadas = tarefas.map((t) => {
      if (t.id === tarefaSelecionada.id) {
        return {
          ...t,
          itensExecucao: novosItens,
          percentualConcluido: novoPercentualTotal,
        };
      }
      return t;
    });

    setTarefas(tarefasAtualizadas);
    setTarefaSelecionada({
      ...tarefaSelecionada,
      itensExecucao: novosItens,
      percentualConcluido: novoPercentualTotal,
    });
  };

  const abrirGerenciadorItens = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
    open();
  };

  const tarefasAtivas = tarefas.filter((t) => t.percentualConcluido < 100);
  const tarefasConcluidas = tarefas.filter(
    (t) => t.percentualConcluido === 100
  );

  return (
    <Container size="xl" py="xl">
      <header className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-5">
        <ClipboardList className="text-blue-600 w-8 h-8" />
        <div>
          <Title
            order={1}
            className="tracking-tight text-slate-800 text-2xl font-bold"
          >
            Controle de Tarefas
          </Title>
          <Text size="sm" c="dimmed">
            Aplicação de Gerenciamento e Alocação de Atividades
          </Text>
        </div>
      </header>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <div className="md:col-span-1">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title
              order={3}
              size="h4"
              className="mb-4 text-slate-700 flex items-center gap-2"
            >
              <Plus size={18} /> Nova Tarefa
            </Title>
            <form onSubmit={handleCadastrarTarefa} className="space-y-4">
              <TextInput
                label="Nome da Tarefa"
                placeholder="Ex: Aniversário do Fábio"
                value={novoNome}
                onChange={(e) => setNovoNome(e.currentTarget.value)}
                required
              />
              <NumberInput
                label="Prioridade (Valor Real)"
                placeholder="Ex: 1.1"
                decimalScale={2}
                step={0.1}
                value={novaPrioridade}
                onChange={(val) => setNovaPrioridade(val)} // Correção TypeScript para NumberInput
                required
              />
              <TextInput
                label="Data Limite de Execução"
                type="date"
                value={novaDataLimite}
                onChange={(e) => setNovaDataLimite(e.currentTarget.value)}
              />
              <Textarea
                label="Detalhamento"
                placeholder="Descreva minuciosamente os objetivos da tarefa..."
                minRows={3}
                value={novoDetalhamento}
                onChange={(e) => setNovoDetalhamento(e.currentTarget.value)}
              />
              <Button type="submit" fullWidth color="blue" className="mt-2">
                Cadastrar Tarefa
              </Button>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <Title
              order={2}
              size="h3"
              className="text-slate-700 mb-3 flex items-center gap-2 font-semibold"
            >
              <ListTodo size={20} className="text-amber-500" /> Em Execução (
              {tarefasAtivas.length})
            </Title>
            {tarefasAtivas.length === 0 ? (
              <Text
                c="dimmed"
                fs="italic"
                className="p-4 bg-white rounded-lg border text-center"
              >
                Nenhuma tarefa pendente no momento.
              </Text>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tarefasAtivas.map((tarefa) => (
                  <CardComponent
                    key={tarefa.id}
                    tarefa={tarefa}
                    onExcluir={handleExcluirTarefa}
                    onGerenciar={abrirGerenciadorItens}
                  />
                ))}
              </div>
            )}
          </div>

          <Divider my="lg" />

          {
            <div>
              <Title
                order={2}
                size="h3"
                className="text-slate-700 mb-3 flex items-center gap-2 font-semibold"
              >
                <Check size={20} className="text-green-600" /> Concluídas (
                {tarefasConcluidas.length})
              </Title>
              {tarefasConcluidas.length === 0 ? (
                <Text
                  c="dimmed"
                  fs="italic"
                  className="p-4 bg-white rounded-lg border text-center"
                >
                  Nenhuma tarefa atingiu 100% de conclusão ainda.
                </Text>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {tarefasConcluidas.map((tarefa) => (
                    <CardComponent
                      key={tarefa.id}
                      tarefa={tarefa}
                      onExcluir={handleExcluirTarefa}
                      onGerenciar={abrirGerenciadorItens}
                      isConcluida
                    />
                  ))}
                </div>
              )}
            </div>
          }
        </div>
      </SimpleGrid>

      <Modal
        opened={opened}
        onClose={close}
        title={`Gerenciar Subitens: ${tarefaSelecionada?.nome}`}
        size="lg"
        radius="md"
      >
        {tarefaSelecionada && (
          <Stack gap="md">
            {" "}
            {/* Substituído 'spacing' por 'gap' */}
            <div>
              <Text size="xs" className="font-bold uppercase text-slate-400">
                Progresso Atual da Tarefa
              </Text>
              <div className="flex justify-between items-center mb-1">
                <Text size="sm" className="font-medium">
                  {tarefaSelecionada.percentualConcluido}% concluído
                </Text>
              </div>
              <Progress
                value={tarefaSelecionada.percentualConcluido}
                color="blue"
                size="md"
                radius="xl"
                animated
              />
            </div>
            <Divider
              label="Adicionar Item de Execução"
              labelPosition="center"
            />
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
              <TextInput
                label="Descrição do Item"
                placeholder="Ex: Compra das bebidas"
                value={novaDescricaoItem}
                onChange={(e) => setNovaDescricaoItem(e.currentTarget.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  label="Percentual de Peso (%)"
                  placeholder="Ex: 20"
                  max={100}
                  min={0}
                  value={novoPercentualItem}
                  onChange={(val) => setNovoPercentualItem(val)} // Correção TypeScript para NumberInput
                />
                <TextInput
                  label="Data de Conclusão (Opcional)"
                  type="date"
                  value={novaDataItem}
                  onChange={(e) => setNovaDataItem(e.currentTarget.value)}
                />
              </div>
              <Button
                fullWidth
                color="green"
                size="xs"
                onClick={handleAdicionarItem}
                className="mt-2"
              >
                Inserir Item na Lista
              </Button>
            </div>
            <Divider
              label="Lista de Itens de Execução Cadastrados"
              labelPosition="center"
            />
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {tarefaSelecionada.itensExecucao.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center" py="sm">
                  {" "}
                  {/* Substituído 'align' por 'ta' */}
                  Não há subitens atrelados a esta atividade.
                </Text>
              ) : (
                tarefaSelecionada.itensExecucao.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          size="sm"
                          color={item.dataConclusao ? "green" : "orange"}
                        >
                          {item.percentualItem}%
                        </Badge>
                        <Text
                          size="sm"
                          className={
                            item.dataConclusao
                              ? "line-through text-slate-400"
                              : "text-slate-700 font-medium"
                          }
                        >
                          {item.descricao}
                        </Text>
                      </div>
                      {item.dataConclusao && (
                        <Text size="xs" c="green" className="ml-14 font-medium">
                          Concluído em:{" "}
                          {item.dataConclusao.split("-").reverse().join("/")}
                        </Text>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <ActionIcon
                        variant="light"
                        color={item.dataConclusao ? "orange" : "green"}
                        size="sm"
                        onClick={() =>
                          handleAlternarConclusaoItem(
                            item.id,
                            new Date().toISOString().split("T")[0]
                          )
                        }
                        title={
                          item.dataConclusao
                            ? "Marcar como Pendente"
                            : "Marcar como Concluído"
                        }
                      >
                        <Check size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => handleRemoverItem(item.id)}
                      >
                        <Trash size={14} />
                      </ActionIcon>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

interface CardComponentProps {
  tarefa: Tarefa;
  onExcluir: (id: string) => void;
  onGerenciar: (tarefa: Tarefa) => void;
  isConcluida?: boolean;
}

function CardComponent({
  tarefa,
  onExcluir,
  onGerenciar,
  isConcluida = false,
}: CardComponentProps) {
  return (
    <Card
      shadow="xs"
      padding="md"
      radius="md"
      withBorder
      className="border-l-4 border-l-blue-500 bg-white"
    >
      <div className="flex justify-between items-start gap-4 mb-2">
        <div>
          <Group gap="xs" className="mb-1">
            {" "}
            {/* Substituído 'spacing' por 'gap' */}
            <Title
              order={4}
              size="h5"
              className={`text-base font-bold ${
                isConcluida ? "line-through text-slate-400" : "text-slate-800"
              }`}
            >
              {tarefa.nome}
            </Title>
            <Badge color="blue" variant="light" size="sm">
              P: {tarefa.prioridade}
            </Badge>
            {tarefa.dataLimite && (
              <Badge color="red" variant="outline" size="sm">
                Até: {tarefa.dataLimite.split("-").reverse().join("/")}
              </Badge>
            )}
          </Group>
          {tarefa.detalhamento && (
            <Text size="xs" c="dimmed" className="line-clamp-2 mt-1">
              {tarefa.detalhamento}
            </Text>
          )}
        </div>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => onExcluir(tarefa.id)}
          title="Excluir Tarefa"
        >
          <Trash size={16} />
        </ActionIcon>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between items-center mb-1.5">
          <Text size="xs" className="font-semibold text-slate-500">
            {tarefa.itensExecucao.filter((i) => i.dataConclusao).length} de{" "}
            {tarefa.itensExecucao.length} subitens resolvidos
          </Text>
          <Text size="xs" className="font-bold text-blue-600">
            {tarefa.percentualConcluido}%
          </Text>
        </div>
        <Progress
          value={tarefa.percentualConcluido}
          color={isConcluida ? "green" : "blue"}
          size="sm"
          radius="xl"
        />
      </div>

      <Button
        variant="light"
        color={isConcluida ? "teal" : "blue"}
        size="xs"
        fullWidth
        className="mt-3"
        onClick={() => onGerenciar(tarefa)}
      >
        {isConcluida
          ? "Revisar Itens Finalizados"
          : "Gerenciar Itens de Execução"}
      </Button>
    </Card>
  );
}
