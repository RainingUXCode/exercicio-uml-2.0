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
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT (Modelagem de Classes) ---
interface Proprietario {
  id: string;
  nome: string;
  telefone: string;
}

interface Apartamento {
  id: string;
  numPorta: number;
  qtdQuartos: number;
  tipoOcupacao: string; // Proprietário, Inquilino, Vazio
  proprietarioId: string;
}

interface Despesa {
  id: string;
  referencia: string; // Ex: Janeiro/2026
  tipo: string; // Água, Luz, Manutenção
  valor: number;
}

interface CondominioMensal {
  id: string;
  apartamentoId: string;
  referencia: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valorTotal: number;
  percentualMulta: number;
  status: "Pendente" | "Pago em Dia" | "Pago com Atraso";
}

export default function App() {
  // --- ESTADOS DE PERSISTÊNCIA DOS DADOS ---
  const [proprietarios, setProprietarios] = useState<Proprietario[]>(() =>
    JSON.parse(localStorage.getItem("condo_proprietarios") || "[]")
  );
  const [apartamentos, setApartamentos] = useState<Apartamento[]>(() =>
    JSON.parse(localStorage.getItem("condo_apartamentos") || "[]")
  );
  const [despesas, setDespesas] = useState<Despesa[]>(() =>
    JSON.parse(localStorage.getItem("condo_despesas") || "[]")
  );
  const [condominios, setCondominios] = useState<CondominioMensal[]>(() =>
    JSON.parse(localStorage.getItem("condo_boletos") || "[]")
  );

  // --- ESTADOS DOS FORMULÁRIOS ---
  // Apartamento (RF01)
  const [numPorta, setNumPorta] = useState<string | number>(0);
  const [qtdQuartos, setQtdQuartos] = useState<string | number>(1);
  const [tipoOcupacao, setTipoOcupacao] = useState<string | null>(
    "Proprietário"
  );
  const [proprietarioIdSel, setProprietarioIdSel] = useState<string | null>("");

  // Proprietário (RF02)
  const [nomeProp, setNomeProp] = useState("");
  const [telProp, setTelProp] = useState("");

  // Despesa (RF03)
  const [referenciaDespesa, setReferenciaDespesa] = useState<string | null>(
    "Maio/2026"
  );
  const [tipoDespesa, setTipoDespesa] = useState("");
  const [valorDespesa, setValorDespesa] = useState<string | number>(0);

  // Pagamento (RF05)
  const [dataPagamentoForm, setDataPagamentoForm] = useState<Date | null>(
    new Date()
  );

  // Sincronização LocalStorage
  useEffect(() => {
    localStorage.setItem("condo_proprietarios", JSON.stringify(proprietarios));
    localStorage.setItem("condo_apartamentos", JSON.stringify(apartamentos));
    localStorage.setItem("condo_despesas", JSON.stringify(despesas));
    localStorage.setItem("condo_boletos", JSON.stringify(condominios));
  }, [proprietarios, apartamentos, despesas, condominios]);

  // --- MÉTODOS OPERACIONAIS ---

  // RF01 – Cadastrar apartamento
  const handleCadastrarApartamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numPorta || !proprietarioIdSel || !tipoOcupacao) return;

    const novoApto: Apartamento = {
      id: crypto.randomUUID(),
      numPorta: Number(numPorta),
      qtdQuartos: Number(qtdQuartos),
      tipoOcupacao,
      proprietarioId: proprietarioIdSel,
    };

    setApartamentos([...apartamentos, novoApto]);
    setNumPorta(0);
    notifications.show({
      title: "Apartamento Salvo",
      message: `Unidade ${novoApto.numPorta} vinculada com sucesso.`,
      color: "green",
    });
  };

  // Método: alterarOcupacao()
  const handleAlterarOcupacao = (id: string, novaOcupacao: string) => {
    setApartamentos(
      apartamentos.map((a) =>
        a.id === id ? { ...a, tipoOcupacao: novaOcupacao } : a
      )
    );
    notifications.show({
      title: "Ocupação Atualizada",
      message: "Tipo de ocupação da unidade alterado.",
      color: "blue",
    });
  };

  // RF02 – Gerenciar proprietários
  const handleCadastrarProprietario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProp) return;

    const novoProp: Proprietario = {
      id: crypto.randomUUID(),
      nome: nomeProp.trim(),
      telefone: telProp.trim(),
    };

    setProprietarios([...proprietarios, novoProp]);
    setNomeProp("");
    setTelProp("");
    notifications.show({
      title: "Proprietário Cadastrado",
      message: `Perfil de ${novoProp.nome} salvo.`,
      color: "teal",
    });
  };

  // Método: calcularCotaMensal() - Base do RF04 (Include)
  const calcularCotaMensal = (ref: string): number => {
    if (apartamentos.length === 0) return 0;
    const totalDespesasRef = despesas
      .filter((d) => d.referencia === ref)
      .reduce((sum, d) => sum + d.valor, 0);

    return totalDespesasRef / apartamentos.length;
  };

  // RF03 – Lançar despesas + RF04 – Calcular condomínio (Geração de boletos)
  const handleLancamentoDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenciaDespesa || !tipoDespesa || !valorDespesa) return;

    const novaDespesa: Despesa = {
      id: crypto.randomUUID(),
      referencia: referenciaDespesa,
      tipo: tipoDespesa.trim(),
      valor: Number(valorDespesa),
    };

    const listaDespesasAtualizada = [...despesas, novaDespesa];
    setDespesas(listaDespesasAtualizada);
    setTipoDespesa("");
    setValorDespesa(0);

    notifications.show({
      title: "Despesa Inserida",
      message: `Despesa de ${novaDespesa.tipo} adicionada à referência de ${referenciaDespesa}.`,
      color: "blue",
    });
  };

  // Método disparado manualmente para rodar a rotina de fechamento e cálculo (RF04)
  const handleGerarCotasMensais = () => {
    if (!referenciaDespesa || apartamentos.length === 0) {
      notifications.show({
        title: "Erro de Rotina",
        message: "Mapeie despesas e apartamentos antes de gerar as cotas.",
        color: "red",
      });
      return;
    }

    const valorCotaUnidade = calcularCotaMensal(referenciaDespesa);

    // Evita gerar duplicados para a mesma referência
    if (condominios.some((c) => c.referencia === referenciaDespesa)) {
      notifications.show({
        title: "Aviso",
        message: `As cotas para ${referenciaDespesa} já foram computadas.`,
        color: "yellow",
      });
      return;
    }

    const dataVencObj = new Date();
    dataVencObj.setDate(dataVencObj.getDate() + 10); // Vence em 10 dias por padrão

    const novasCotas: CondominioMensal[] = apartamentos.map((ap) => ({
      id: crypto.randomUUID(),
      apartamentoId: ap.id,
      referencia: referenciaDespesa,
      dataVencimento: dataVencObj.toLocaleDateString("pt-BR"),
      dataPagamento: null,
      valorTotal: valorCotaUnidade,
      percentualMulta: 10.0, // 10% fixo de multa por atraso
      status: "Pendente",
    }));

    setCondominios([...condominios, ...novasCotas]);
    notifications.show({
      title: "Cotas Geradas",
      message: `Cota de R$ ${valorCotaUnidade.toFixed(
        2
      )} calculada e lançada para cada uma das ${
        apartamentos.length
      } unidades.`,
      color: "green",
    });
  };

  // Método: calcularMulta() - Base do RF06 (Include do RF05)
  const calcularMulta = (boleto: CondominioMensal, dataPgto: Date): number => {
    const parts = boleto.dataVencimento.split("/");
    const vencimentoObj = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );

    // Se a data de pagamento passar da data de vencimento, aplica a penalidade
    if (dataPgto > vencimentoObj) {
      return (boleto.valorTotal * boleto.percentualMulta) / 100;
    }
    return 0;
  };

  // RF05 – Processar pagamentos + RF06 – Aplicar multas
  const handleProcessarPagamento = (idBoleto: string) => {
    if (!dataPagamentoForm) return;

    setCondominios(
      condominios.map((b) => {
        if (b.id !== idBoleto) return b;

        const multaAplicada = calcularMulta(b, dataPagamentoForm); // Invocação do RF06
        const temMulta = multaAplicada > 0;

        return {
          ...b,
          dataPagamento: dataPagamentoForm.toLocaleDateString("pt-BR"),
          valorTotal: b.valorTotal + multaAplicada,
          status: temMulta ? "Pago com Atraso" : "Pago em Dia", // Método verificarStatusPagamento() integrado
        };
      })
    );

    notifications.show({
      title: "Pagamento Processado",
      message: "Status financeiro atualizado na base do condomínio.",
      color: "green",
    });
  };

  // Método: emitirRecibo()
  const handleEmitirRecibo = (boleto: CondominioMensal) => {
    const apt = apartamentos.find((a) => a.id === boleto.apartamentoId);
    const prop = apt
      ? proprietarios.find((p) => p.id === apt.proprietarioId)
      : null;

    alert(`
      ================================================
      RECIBO DE QUITAÇÃO DE CONDOMÍNIO
      ================================================
      Referência Base: ${boleto.referencia}
      Unidade Residencial: Apartamento ${apt ? apt.numPorta : "-"}
      Proprietário: ${prop ? prop.nome : "Não Informado"}
      Vencimento Original: ${boleto.dataVencimento}
      Data da Operação: ${boleto.dataPagamento || "-"}
      ------------------------------------------------
      VALOR TOTAL PAGO: R$ ${boleto.valorTotal.toFixed(2)}
      STATUS FINANCEIRO: ${boleto.status.toUpperCase()}
      ================================================
    `);
  };

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      {/* Header */}
      <div className="bg-blue-700 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                CondoControl ERP
              </Title>
              <Text size="sm" className="opacity-80">
                Rateio de Despesas, Lançamento de Cotas e Controle de
                Inadimplência
              </Text>
            </div>
            <Badge
              size="lg"
              color="blue"
              variant="filled"
              className="bg-blue-800"
            >
              Questão 10
            </Badge>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="caixa" color="blue" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="caixa" className="font-medium">
              📊 Caixa e Lançamentos
            </Tabs.Tab>
            <Tabs.Tab value="cobrancas" className="font-medium">
              💵 Cobranças e Recibos
            </Tabs.Tab>
            <Tabs.Tab value="apartamentos" className="font-medium">
              🏢 Apartamentos e Moradores
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB 1: DESPESAS E CÁLCULO DE COTA (RF03 + RF04) */}
          <Tabs.Panel value="caixa">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Lançar Despesa do Mês
                  </Title>
                  <form onSubmit={handleLancamentoDespesa}>
                    <Stack gap="sm">
                      <Select
                        label="Mês de Referência"
                        data={["Maio/2026", "Junho/2026", "Julho/2026"]}
                        value={referenciaDespesa}
                        onChange={(val) => setReferenciaDespesa(val)}
                        required
                      />
                      <TextInput
                        label="Tipo de Despesa"
                        placeholder="Ex: Conta de Água, Manutenção Elevador"
                        value={tipoDespesa}
                        onChange={(e) => setTipoDespesa(e.target.value)}
                        required
                      />
                      <NumberInput
                        label="Valor Total da Nota (R$)"
                        min={0}
                        decimalScale={2}
                        value={valorDespesa}
                        onChange={(val) => setValorDespesa(val)}
                        required
                      />
                      <Button
                        type="submit"
                        color="blue"
                        fullWidth
                        className="mt-2"
                      >
                        Lançar Despesa
                      </Button>
                    </Stack>
                  </form>

                  <Divider className="my-4" />
                  <Title order={4} className="mb-2 text-gray-700 text-sm">
                    Fechamento de Rateio
                  </Title>
                  <Text size="xs" color="dimmed" className="mb-3">
                    O método divide o montante global de forma equitativa por
                    fração ideal.
                  </Text>
                  <Button
                    onClick={handleGerarCotasMensais}
                    color="green"
                    fullWidth
                    size="md"
                  >
                    Calcular Condomínio
                  </Button>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" radius="md" withBorder>
                  <Title order={4} className="mb-4 text-gray-700">
                    Notas e Despesas Mapeadas no Mês
                  </Title>
                  {despesas.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum custo lançado no caixa ainda.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Tipo/Origem</Table.Th>
                          <Table.Th>Referência</Table.Th>
                          <Table.Th style={{ textAlign: "right" }}>
                            Valor Comercial
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {despesas.map((d) => (
                          <Table.Tr key={d.id}>
                            <Table.Td className="font-semibold text-slate-700">
                              🧾 {d.tipo}
                            </Table.Td>
                            <Table.Td>
                              <Badge color="blue" variant="light">
                                {d.referencia}
                              </Badge>
                            </Table.Td>
                            <Table.Td
                              style={{ textAlign: "right" }}
                              className="font-bold text-red-600"
                            >
                              R$ {d.valor.toFixed(2)}
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

          {/* TAB 2: COBRANÇAS E PAGAMENTOS (RF05 + RF06) */}
          <Tabs.Panel value="cobrancas">
            <Stack gap="md">
              <Card shadow="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Text className="font-semibold text-sm text-gray-700">
                    Data da Operação Bancária:
                  </Text>
                  <DateInput
                    placeholder="Selecione data"
                    value={dataPagamentoForm}
                    onChange={(val) => setDataPagamentoForm(val as any)}
                    className="w-64"
                  />
                </Group>
              </Card>

              <Card shadow="sm" radius="md" withBorder>
                <Title order={4} className="mb-4 text-gray-700">
                  Painel Geral de Boletos Emitidos
                </Title>
                {condominios.length === 0 ? (
                  <Text size="sm" className="text-center py-8 text-gray-400">
                    Use a aba de Lançamentos para rodar a rotina de fechamento.
                  </Text>
                ) : (
                  <div className="overflow-x-auto">
                    <Table highlightOnHover verticalSpacing="xs">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Apto</Table.Th>
                          <Table.Th>Mês</Table.Th>
                          <Table.Th>Vencimento</Table.Th>
                          <Table.Th>Valor Atualizado</Table.Th>
                          <Table.Th>Status</Table.Th>
                          <Table.Th>Ações Operacionais</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {condominios.map((b) => {
                          const aptObj = apartamentos.find(
                            (a) => a.id === b.apartamentoId
                          );
                          return (
                            <Table.Tr key={b.id}>
                              <Table.Td className="font-bold text-slate-700">
                                🚪 Unidade {aptObj ? aptObj.numPorta : "-"}
                              </Table.Td>
                              <Table.Td>{b.referencia}</Table.Td>
                              <Table.Td className="font-mono text-xs">
                                {b.dataVencimento}
                              </Table.Td>
                              <Table.Td className="font-bold text-slate-800">
                                R$ {b.valorTotal.toFixed(2)}
                              </Table.Td>
                              <Table.Td>
                                <Badge
                                  color={
                                    b.status === "Pago em Dia"
                                      ? "green"
                                      : b.status === "Pago com Atraso"
                                      ? "orange"
                                      : "yellow"
                                  }
                                  variant="light"
                                >
                                  {b.status}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Group gap="xs">
                                  {b.status === "Pendente" ? (
                                    <Button
                                      size="xs"
                                      color="green"
                                      onClick={() =>
                                        handleProcessarPagamento(b.id)
                                      }
                                    >
                                      Processar Banco
                                    </Button>
                                  ) : (
                                    <Button
                                      size="xs"
                                      color="gray"
                                      variant="outline"
                                      onClick={() => handleEmitirRecibo(b)}
                                    >
                                      emitirRecibo()
                                    </Button>
                                  )}
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
            </Stack>
          </Tabs.Panel>

          {/* TAB 3: APARTAMENTOS E PROPRIETÁRIOS (RF01 + RF02) */}
          <Tabs.Panel value="apartamentos">
            <Grid>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap="md">
                  <Card shadow="sm" radius="md" withBorder>
                    <Title order={4} className="mb-4 text-gray-700">
                      Cadastrar Apartamento
                    </Title>
                    <form onSubmit={handleCadastrarApartamento}>
                      <Stack gap="sm">
                        <NumberInput
                          label="Número da Porta"
                          min={0}
                          value={numPorta}
                          onChange={(val) => setNumPorta(val)}
                          required
                        />
                        <NumberInput
                          label="Quantidade de Quartos"
                          min={1}
                          value={qtdQuartos}
                          onChange={(val) => setQtdQuartos(val)}
                          required
                        />
                        <Select
                          label="Tipo de Ocupação Inicial"
                          data={["Proprietário", "Inquilino", "Vazio"]}
                          value={tipoOcupacao}
                          onChange={(val) => setTipoOcupacao(val)}
                          required
                        />
                        <Select
                          label="Proprietário Responsável"
                          placeholder="Vincular titular"
                          data={proprietarios.map((p) => ({
                            value: p.id,
                            label: p.nome,
                          }))}
                          value={proprietarioIdSel}
                          onChange={(val) => setProprietarioIdSel(val)}
                          required
                        />
                        <Button
                          type="submit"
                          color="blue"
                          fullWidth
                          className="mt-2"
                        >
                          Mapear Unidade
                        </Button>
                      </Stack>
                    </form>
                  </Card>

                  <Card shadow="sm" radius="md" withBorder>
                    <Title order={4} className="mb-4 text-gray-700">
                      Cadastrar Proprietário
                    </Title>
                    <form onSubmit={handleCadastrarProprietario}>
                      <Stack gap="sm">
                        <TextInput
                          label="Nome Completo"
                          placeholder="Ex: Carlos Albuquerque"
                          value={nomeProp}
                          onChange={(e) => setNomeProp(e.target.value)}
                          required
                        />
                        <TextInput
                          label="Telefone de Contato"
                          placeholder="(83) 98888-8888"
                          value={telProp}
                          onChange={(e) => setTelProp(e.target.value)}
                        />
                        <Button type="submit" color="teal" fullWidth>
                          Registrar Titular
                        </Button>
                      </Stack>
                    </form>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 7 }}>
                <Card shadow="sm" radius="md" withBorder className="h-full">
                  <Title order={4} className="mb-4 text-gray-700">
                    Unidades Habitacionais Ativas
                  </Title>
                  {apartamentos.length === 0 ? (
                    <Text size="sm" className="text-center py-8 text-gray-400">
                      Nenhum apartamento mapeado no condomínio.
                    </Text>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nº Porta</Table.Th>
                          <Table.Th>Quartos</Table.Th>
                          <Table.Th>Titular Responsável</Table.Th>
                          <Table.Th>Ocupação (Método)</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {apartamentos.map((a) => {
                          const propObj = proprietarios.find(
                            (p) => p.id === a.proprietarioId
                          );
                          return (
                            <Table.Tr key={a.id}>
                              <Table.Td className="font-bold text-slate-700">
                                🚪 Apto {a.numPorta}
                              </Table.Td>
                              <Table.Td>{a.qtdQuartos} qto(s)</Table.Td>
                              <Table.Td>
                                {propObj ? propObj.nome : "Não encontrado"}
                              </Table.Td>
                              <Table.Td>
                                <Select
                                  size="xs"
                                  data={["Proprietário", "Inquilino", "Vazio"]}
                                  value={a.tipoOcupacao}
                                  onChange={(val) =>
                                    handleAlterarOcupacao(a.id, val || "Vazio")
                                  }
                                  styles={{
                                    input: { width: "120px", fontSize: "11px" },
                                  }}
                                />
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
