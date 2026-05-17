import React, { useState, useEffect } from "react";
import {
  MantineProvider,
  Container,
  Grid,
  Card,
  Text,
  Title,
  TextInput,
  Button,
  Select,
  Table,
  Tabs,
  Badge,
  Group,
  Stack,
  Textarea,
  Modal,
} from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT (Modelagem de Classes) ---
export type StatusCasoDeUso =
  | "Não Iniciado"
  | "Em Desenvolvimento"
  | "Finalizado"
  | "Aprovado";

interface Pacote {
  id: string;
  nomePasta: string;
  caminhoDiretorio: string;
}

interface CasoDeUso {
  id: string;
  identificador: string; // UC-X ou UCE-X (RF04)
  nomeArquivo: string;
  status: StatusCasoDeUso; // <<Enumeration>> (RF03)
  conteudoTexto: string; // Conteúdo gerado via template (RF06)
  pacoteId: string; // Relacionamento / Associação de herança lógica
  tipoExtension: boolean;
}

export default function App() {
  // --- ESTADOS DE PERSISTÊNCIA ---
  const [pacotes, setPacotes] = useState<Pacote[]>(() => {
    const salvos = localStorage.getItem("uml_pacotes");
    return salvos
      ? JSON.parse(salvos)
      : [
          {
            id: "p1",
            nomePasta: "Autenticacao",
            caminhoDiretorio: "/src/modules/auth",
          },
          {
            id: "p2",
            nomePasta: "Financeiro",
            caminhoDiretorio: "/src/modules/finance",
          },
        ];
  });

  const [casosDeUso, setCasosDeUso] = useState<CasoDeUso[]>(() =>
    JSON.parse(localStorage.getItem("uml_casosdeuso") || "[]")
  );

  // --- ESTADOS DOS FORMULÁRIOS ---
  // Pacote (RF01)
  const [nomePasta, setNomePasta] = useState("");
  const [caminhoDiretorio, setCaminhoDiretorio] = useState("");

  // Caso de Uso (RF02)
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [pacoteSelecionado, setPacoteSelecionado] = useState<string | null>(
    "p1"
  );
  const [tipoExtension, setTipoExtension] = useState<string | null>("false");

  // Modal para Visualização/Edição de Texto (Método abrirTexto())
  const [casoDeUsoAtivo, setCasoDeUsoAtivo] = useState<CasoDeUso | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  // Modais de Manipulação (Métodos renomear() e moverPara())
  const [casoParaMover, setCasoParaMover] = useState<CasoDeUso | null>(null);
  const [novoPacoteId, setNovoPacoteId] = useState<string | null>("");

  const [casoParaRenomear, setCasoParaRenomear] = useState<CasoDeUso | null>(
    null
  );
  const [novoNomeArquivo, setNovoNomeArquivo] = useState("");

  // Sincronização Local
  useEffect(() => {
    localStorage.setItem("uml_pacotes", JSON.stringify(pacotes));
    localStorage.setItem("uml_casosdeuso", JSON.stringify(casosDeUso));
  }, [pacotes, casosDeUso]);

  // --- MÉTODOS OPERACIONAIS ---

  // RF01 – Gerenciar pacotes
  const handleCadastrarPacote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomePasta || !caminhoDiretorio) return;

    const novoPacote: Pacote = {
      id: crypto.randomUUID(),
      nomePasta: nomePasta.trim(),
      caminhoDiretorio: caminhoDiretorio.trim(),
    };

    setPacotes([...pacotes, novoPacote]);
    setNomePasta("");
    setCaminhoDiretorio("");
    notifications.show({
      title: "Pacote Criado",
      message: `Pasta "${novoPacote.nomePasta}" adicionada.`,
      color: "green",
    });
  };

  // RF04 – Identificação automática
  const gerarProximoIdentificador = (isExtension: boolean): string => {
    const prefixo = isExtension ? "UCE" : "UC";
    const filtrados = casosDeUso.filter((c) => c.tipoExtension === isExtension);
    const proximoNumero = filtrados.length + 1;
    return `${prefixo}-${String(proximoNumero).padStart(2, "0")}`;
  };

  // RF06 – Geração via template
  const obterTemplateTexto = (id: string, nome: string): string => {
    return `=========================================
CASO DE USO: ${id} - ${nome}
=========================================
1. ATORES PRINCIPAIS:
   - Usuário do Sistema

2. PRÉ-CONDIÇÕES:
   - Usuário autenticado no ambiente.

3. FLUXO PRINCIPAL:
   1. O sistema solicita os dados de entrada.
   2. O usuário preenche as informações necessárias.
   3. O sistema valida e processa a requisição de ${nome}.
   4. O sistema exibe mensagem de sucesso.

4. PÓS-CONDIÇÕES:
   - Dados persistidos com sucesso na base UML.`;
  };

  // RF02 – Gerenciar casos de uso
  const handleCadastrarCasoDeUso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeArquivo || !pacoteSelecionado) return;

    const isExtension = tipoExtension === "true";
    const identificadorAutomatico = gerarProximoIdentificador(isExtension); // Chamada do RF04
    const templateTexto = obterTemplateTexto(
      identificadorAutomatico,
      nomeArquivo
    ); // Chamada do RF06

    const novoUC: CasoDeUso = {
      id: crypto.randomUUID(),
      identificador: identificadorAutomatico,
      nomeArquivo: nomeArquivo.trim(),
      status: "Não Iniciado", // Enum padrão (RF03)
      conteudoTexto: templateTexto,
      pacoteId: pacoteSelecionado,
      tipoExtension: isExtension,
    };

    setCasosDeUso([...casosDeUso, novoUC]);
    setNomeArquivo("");
    notifications.show({
      title: "Caso de Uso Gerado",
      message: `Identificador: ${identificadorAutomatico} com template pré-definido.`,
      color: "blue",
    });
  };

  // RF03 – Controle de status
  const handleAlterarStatus = (id: string, novoStatus: StatusCasoDeUso) => {
    setCasosDeUso(
      casosDeUso.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
    );
    notifications.show({
      title: "Status Atualizado",
      message: `Caso de uso movido para "${novoStatus}".`,
      color: "teal",
    });
  };

  // Método: abrirTexto()
  const handleAbrirTexto = (uc: CasoDeUso) => {
    setCasoDeUsoAtivo(uc);
    setTextoEdicao(uc.conteudoTexto);
    setModalAberto(true);
  };

  // Salvar texto editado do Caso de Uso
  const handleSalvarTextoEditor = () => {
    if (!casoDeUsoAtivo) return;
    setCasosDeUso(
      casosDeUso.map((c) =>
        c.id === casoDeUsoAtivo.id ? { ...c, conteudoTexto: textoEdicao } : c
      )
    );
    setModalAberto(false);
    notifications.show({
      title: "Texto Salvo",
      message: "Documentação do caso de uso atualizada.",
      color: "green",
    });
  };

  // Método: renomear()
  const handleExecutarRenomear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!casoParaRenomear || !novoNomeArquivo) return;

    setCasosDeUso(
      casosDeUso.map((c) =>
        c.id === casoParaRenomear.id
          ? { ...c, nomeArquivo: novoNomeArquivo.trim() }
          : c
      )
    );
    notifications.show({
      title: "Arquivo Renomeado",
      message: `Novo nome: ${novoNomeArquivo}`,
      color: "orange",
    });
    setCasoParaRenomear(null);
    setNovoNomeArquivo("");
  };

  // Método: moverPara()
  const handleExecutarMover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!casoParaMover || !novoPacoteId) return;

    setCasosDeUso(
      casosDeUso.map((c) =>
        c.id === casoParaMover.id ? { ...c, pacoteId: novoPacoteId } : c
      )
    );
    notifications.show({
      title: "Arquivo Movido",
      message: "Caso de uso realocado para o novo pacote.",
      color: "indigo",
    });
    setCasoParaMover(null);
    setNovoPacoteId("");
  };

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      {/* Header */}
      <div className="bg-slate-900 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                UML CASE Tool — Explorer
              </Title>
              <Text size="sm" className="opacity-70">
                Gerenciador de Estruturas de Projeto e Casos de Uso
              </Text>
            </div>
            <Badge size="lg" color="blue" variant="filled">
              Questão 08
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="explorer" color="blue" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="explorer" className="font-medium">
              📁 Árvore de Projetos
            </Tabs.Tab>
            <Tabs.Tab value="criar_uc" className="font-medium">
              📝 Cadastrar Caso de Uso
            </Tabs.Tab>
            <Tabs.Tab value="pacotes" className="font-medium">
              📦 Gerenciar Pacotes
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: EXPLORADOR EM ÁRVORE (Exibe Casos de Uso agrupados por Pacotes) */}
          <Tabs.Panel value="explorer">
            <Stack gap="xl">
              {pacotes.map((p) => {
                const ucsDoPacote = casosDeUso.filter(
                  (c) => c.pacoteId === p.id
                );

                return (
                  <Card
                    key={p.id}
                    shadow="sm"
                    radius="md"
                    withBorder
                    className="border-l-4 border-l-blue-500"
                  >
                    <Group
                      justify="space-between"
                      className="bg-slate-50 p-3 -m-4 mb-4 rounded-t-md border-b"
                    >
                      <div>
                        <Text className="font-bold text-slate-800 text-lg">
                          📁 Pacote: {p.nomePasta}
                        </Text>
                        <Text size="xs" className="text-gray-400 font-mono">
                          {p.caminhoDiretorio}
                        </Text>
                      </div>
                      <Badge color="blue" variant="light">
                        {ucsDoPacote.length} Casos de Uso
                      </Badge>
                    </Group>

                    {ucsDoPacote.length === 0 ? (
                      <Text
                        size="sm"
                        className="text-center py-6 text-gray-400 italic"
                      >
                        Nenhum arquivo ou caso de uso mapeado neste diretório.
                      </Text>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table highlightOnHover verticalSpacing="xs">
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th style={{ width: "120px" }}>
                                ID (RF04)
                              </Table.Th>
                              <Table.Th>Nome do Arquivo</Table.Th>
                              <Table.Th style={{ width: "180px" }}>
                                Status (RF03)
                              </Table.Th>
                              <Table.Th style={{ width: "220px" }}>
                                Ações de Arquivo (RF05)
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {ucsDoPacote.map((uc) => (
                              <Table.Tr key={uc.id}>
                                <Table.Td>
                                  <Badge
                                    color={uc.tipoExtension ? "violet" : "blue"}
                                    variant="filled"
                                    size="sm"
                                  >
                                    {uc.identificador}
                                  </Badge>
                                </Table.Td>
                                <Table.Td className="font-medium text-slate-700">
                                  {uc.nomeArquivo}.xml
                                </Table.Td>
                                <Table.Td>
                                  <Select
                                    size="xs"
                                    data={[
                                      "Não Iniciado",
                                      "Em Desenvolvimento",
                                      "Finalizado",
                                      "Aprovado",
                                    ]}
                                    value={uc.status}
                                    onChange={(val) =>
                                      handleAlterarStatus(
                                        uc.id,
                                        val as StatusCasoDeUso
                                      )
                                    }
                                    styles={{
                                      input: {
                                        fontSize: "11px",
                                        fontWeight: 500,
                                      },
                                    }}
                                  />
                                </Table.Td>
                                <Table.Td>
                                  <Group gap="xs">
                                    <Button
                                      size="xs"
                                      color="blue"
                                      variant="light"
                                      onClick={() => handleAbrirTexto(uc)}
                                    >
                                      abrirTexto()
                                    </Button>
                                    <Button
                                      size="xs"
                                      color="orange"
                                      variant="outline"
                                      onClick={() => {
                                        setCasoParaRenomear(uc);
                                        setNovoNomeArquivo(uc.nomeArquivo);
                                      }}
                                    >
                                      renomear()
                                    </Button>
                                    <Button
                                      size="xs"
                                      color="indigo"
                                      variant="outline"
                                      onClick={() => {
                                        setCasoParaMover(uc);
                                        setNovoPacoteId(uc.pacoteId);
                                      }}
                                    >
                                      moverPara()
                                    </Button>
                                  </Group>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </div>
                    )}
                  </Card>
                );
              })}
            </Stack>
          </Tabs.Panel>

          {/* TAB 2: CADASTRAR CASO DE USO (RF02 + RF04 + RF06) */}
          <Tabs.Panel value="criar_uc">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} className="mb-4 text-gray-700">
                Novo Caso de Uso (Injeta Identificação e Template Automáticos)
              </Title>
              <form onSubmit={handleCadastrarCasoDeUso}>
                <Stack gap="sm">
                  <Select
                    label="Selecione o Pacote de Destino (Associação)"
                    placeholder="Escolha a pasta do projeto"
                    data={pacotes.map((p) => ({
                      value: p.id,
                      label: p.nomePasta,
                    }))}
                    value={pacoteSelecionado}
                    onChange={(val) => setPacoteSelecionado(val)}
                    required
                  />
                  <TextInput
                    label="Nome do Caso de Uso (Nome do Arquivo)"
                    placeholder="Ex: RealizarPagamento"
                    value={nomeArquivo}
                    onChange={(e) => setNomeArquivo(e.target.value)}
                    required
                  />
                  <Select
                    label="Tipo de Fluxo (RF04 - Identificação Sequencial)"
                    data={[
                      {
                        value: "false",
                        label: "Fluxo Base Comercial (Prefixo UC)",
                      },
                      {
                        value: "true",
                        label: "Fluxo de Extensão / Exceção (Prefixo UCE)",
                      },
                    ]}
                    value={tipoExtension}
                    onChange={(val) => setTipoExtension(val)}
                    required
                  />
                  <Button
                    type="submit"
                    color="blue"
                    className="mt-2"
                    fullWidth
                    size="md"
                  >
                    Gerar Caso de Uso com Template Estático (RF06)
                  </Button>
                </Stack>
              </form>
            </Card>
          </Tabs.Panel>

          {/* TAB 3: GERENCIAR PACOTES (RF01) */}
          <Tabs.Panel value="pacotes">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Cadastrar Nova Pasta
                  </Title>
                  <form onSubmit={handleCadastrarPacote}>
                    <Stack gap="sm">
                      <TextInput
                        label="Nome do Diretório (Pasta)"
                        placeholder="Ex: Relatorios"
                        value={nomePasta}
                        onChange={(e) => setNomePasta(e.target.value)}
                        required
                      />
                      <TextInput
                        label="Caminho Físico (Diretório)"
                        placeholder="Ex: /src/modules/reports"
                        value={caminhoDiretorio}
                        onChange={(e) => setCaminhoDiretorio(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar Diretório
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Diretórios Ativos no Sistema
                  </Title>
                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Nome da Pasta</Table.Th>
                        <Table.Th>Caminho de Diretório</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {pacotes.map((p) => (
                        <Table.Tr key={p.id}>
                          <Table.Td className="font-bold text-slate-700">
                            📁 {p.nomePasta}
                          </Table.Td>
                          <Table.Td className="font-mono text-xs text-gray-500">
                            {p.caminhoDiretorio}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Container>

      {/* --- MODAL DO MÉTODO: abrirTexto() --- */}
      <Modal
        opened={modalAberto}
        onClose={() => setModalAberto(false)}
        title={`Visualizador UML - Identificador: ${casoDeUsoAtivo?.identificador}`}
        size="lg"
      >
        <Stack gap="sm">
          <Text size="xs" color="dimmed">
            Edite a documentação textual do arquivo gerado automaticamente:
          </Text>
          <Textarea
            value={textoEdicao}
            onChange={(e) => setTextoEdicao(e.target.value)}
            rows={15}
            ff="monospace" /* Mudança aqui: de fontFamily para ff */
            className="text-xs"
          />
          <Group justify="flex-end" className="mt-2">
            <Button
              variant="outline"
              color="gray"
              onClick={() => setModalAberto(false)}
            >
              Fechar
            </Button>
            <Button color="blue" onClick={handleSalvarTextoEditor}>
              Salvar Alterações
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* --- MODAL OPERACIONAL: renomear() --- */}
      <Modal
        opened={casoParaRenomear !== null}
        onClose={() => setCasoParaRenomear(null)}
        title="Método: renomear()"
      >
        <form onSubmit={handleExecutarRenomear}>
          <Stack gap="sm">
            <Text size="sm">Alterar o nome físico do arquivo XML:</Text>
            <TextInput
              label="Nome Atual do Arquivo"
              value={casoParaRenomear?.nomeArquivo || ""}
              disabled
            />
            <TextInput
              label="Novo Nome (Sem Extensão)"
              value={novoNomeArquivo}
              onChange={(e) => setNovoNomeArquivo(e.target.value)}
              required
            />
            <Button type="submit" color="orange" fullWidth className="mt-2">
              Confirmar Novo Nome
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* --- MODAL OPERACIONAL: moverPara() --- */}
      <Modal
        opened={casoParaMover !== null}
        onClose={() => setCasoParaMover(null)}
        title="Método: moverPara()"
      >
        <form onSubmit={handleExecutarMover}>
          <Stack gap="sm">
            <Text size="sm">
              Alterar o diretório / associação lógica do caso de uso:
            </Text>
            <Select
              label="Selecione a Pasta Destino"
              data={pacotes.map((p) => ({ value: p.id, label: p.nomePasta }))}
              value={novoPacoteId}
              onChange={(val) => setNovoPacoteId(val)}
              required
            />
            <Button type="submit" color="indigo" fullWidth className="mt-2">
              Mover Arquivo
            </Button>
          </Stack>
        </form>
      </Modal>
    </MantineProvider>
  );
}
