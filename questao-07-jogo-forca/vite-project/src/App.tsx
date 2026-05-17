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
  Divider,
  Paper,
} from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";

// --- INTERFACES PARA O TYPESCRIPT (Modelagem de Classes) ---
interface Tema {
  nomeTema: string;
}

interface PalavraFrase {
  texto: string;
  nomeTema: string;
}

interface Jogador {
  id: string;
  nome: string;
  pontuacaoTotal: number;
}

interface Rodada {
  palavraAtual: string;
  temaAtual: string;
  letrasDescobertas: string[]; // Atributo Char transformado em array controlado
  letrasErradas: string[]; // Atributo Char transformado em array controlado
  erroSCometidos: number;
  ativa: boolean;
  ganhou: boolean;
}

function DesenhoBoneco({ erros }: { erros: number }) {
  return (
    <div className="flex justify-center my-4">
      <svg
        height="200"
        width="180"
        className="bg-slate-100 p-2 rounded-lg border border-slate-200"
      >
        {/* Estrutura de madeira da Forca (Sempre visível) */}
        <line
          x1="20"
          y1="180"
          x2="100"
          y2="180"
          stroke="#475569"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="180"
          x2="50"
          y2="20"
          stroke="#475569"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="20"
          x2="120"
          y2="20"
          stroke="#475569"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="120"
          y1="20"
          x2="120"
          y2="40"
          stroke="#475569"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 1º Erro: Cabeça */}
        {erros >= 1 && (
          <circle
            cx="120"
            cy="55"
            r="15"
            stroke="#ef4444"
            strokeWidth="4"
            fill="none"
          />
        )}

        {/* 2º Erro: Tronco */}
        {erros >= 2 && (
          <line
            x1="120"
            y1="70"
            x2="120"
            y2="120"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* 3º Erro: Braço Esquerdo */}
        {erros >= 3 && (
          <line
            x1="120"
            y1="85"
            x2="95"
            y2="100"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* 4º Erro: Braço Direito */}
        {erros >= 4 && (
          <line
            x1="120"
            y1="85"
            x2="145"
            y2="100"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* 5º Erro: Perna Esquerda */}
        {erros >= 5 && (
          <line
            x1="120"
            y1="120"
            x2="100"
            y2="155"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* 6º Erro: Perna Direita (Fim de jogo) */}
        {erros >= 6 && (
          <line
            x1="120"
            y1="120"
            x2="140"
            y2="155"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}

export default function App() {
  // --- BANCO DE DADOS LOCAL (RF01 e RF02) ---
  const [temas] = useState<Tema[]>([
    { nomeTema: "Tecnologia" },
    { nomeTema: "Frutas" },
    { nomeTema: "Animais" },
  ]);

  const [bancoPalavras, setBancoPalavras] = useState<PalavraFrase[]>(() => {
    const salvas = localStorage.getItem("bancoPalavras");
    return salvas
      ? JSON.parse(salvas)
      : [
          { texto: "REACT", nomeTema: "Tecnologia" },
          { texto: "TYPESCRIPT", nomeTema: "Tecnologia" },
          { texto: "TAILWIND", nomeTema: "Tecnologia" },
          { texto: "ABACAXI", nomeTema: "Frutas" },
          { texto: "MORANGO", nomeTema: "Frutas" },
          { texto: "CACHORRO", nomeTema: "Animais" },
          { texto: "ELEFANTE", nomeTema: "Animais" },
        ];
  });

  const [jogadores, setJogadores] = useState<Jogador[]>(() =>
    JSON.parse(localStorage.getItem("jogadores") || "[]")
  );

  const [jogadorAtivo, setJogadorAtivo] = useState<string | null>(
    () => localStorage.getItem("jogadorAtivo") || null
  );

  // --- ESTADO DA RODADA ATUAL (Mecânica OO da Classe Rodada) ---
  const [rodada, setRodada] = useState<Rodada | null>(() => {
    const salva = localStorage.getItem("rodadaAtual");
    return salva ? JSON.parse(salva) : null;
  });

  // --- ESTADOS DE FORMULÁRIO ---
  const [novoTemaPalavra, setNovoTemaPalavra] = useState<string | null>(
    "Tecnologia"
  );
  const [novaPalavraTexto, setNovaPalavraTexto] = useState("");
  const [novoNomeJogador, setNovoNomeJogador] = useState("");
  const [palpiteLetra, setPalpiteLetra] = useState("");
  const [temaFiltroSorteio, setTemaFiltroSorteio] = useState<string | null>(
    "Todos"
  );

  // Sincronização LocalStorage
  useEffect(() => {
    localStorage.setItem("bancoPalavras", JSON.stringify(bancoPalavras));
    localStorage.setItem("jogadores", JSON.stringify(jogadores));
    if (jogadorAtivo) localStorage.setItem("jogadorAtivo", jogadorAtivo);
    if (rodada) localStorage.setItem("rodadaAtual", JSON.stringify(rodada));
    else localStorage.removeItem("rodadaAtual");
  }, [bancoPalavras, jogadores, jogadorAtivo, rodada]);

  // --- MÉTODOS E REQUISITOS DO DIAGRAMA ---

  // RF01 – Gerenciar banco de palavras
  const handleAdicionarPalavra = (e: React.FormEvent) => {
    e.preventDefault();
    const textoFormatado = novaPalavraTexto.trim().toUpperCase();
    if (!textoFormatado || !novoTemaPalavra) return;

    if (bancoPalavras.some((p) => p.texto === textoFormatado)) {
      notifications.show({
        title: "Aviso",
        message: "Esta palavra já existe no banco!",
        color: "yellow",
      });
      return;
    }

    const novaInstancia: PalavraFrase = {
      texto: textoFormatado,
      nomeTema: novoTemaPalavra,
    };

    setBancoPalavras([...bancoPalavras, novaInstancia]);
    notifications.show({
      title: "Sucesso",
      message: `Palavra "${textoFormatado}" adicionada!`,
      color: "green",
    });
    setNovaPalavraTexto("");
  };

  const handleCadastrarJogador = (e: React.FormEvent) => {
    e.preventDefault();
    const nome = novoNomeJogador.trim();
    if (!nome) return;

    const novoJogador: Jogador = {
      id: crypto.randomUUID(),
      nome,
      pontuacaoTotal: 0,
    };

    setJogadores([...jogadores, novoJogador]);
    if (!jogadorAtivo) setJogadorAtivo(novoJogador.id);
    setNovoNomeJogador("");
    notifications.show({
      title: "Jogador Pronto",
      message: `Boa sorte, ${nome}!`,
      color: "blue",
    });
  };

  // RF03 + Método: sortearDesafio()
  const handleSortearDesafio = () => {
    if (!jogadorAtivo) {
      notifications.show({
        title: "Atenção",
        message: "Cadastre ou selecione um jogador antes de iniciar.",
        color: "red",
      });
      return;
    }

    // Filtra palavras pelo tema escolhido se não for "Todos"
    const listaDisponivel =
      temaFiltroSorteio === "Todos"
        ? bancoPalavras
        : bancoPalavras.filter((p) => p.nomeTema === temaFiltroSorteio);

    if (listaDisponivel.length === 0) {
      notifications.show({
        title: "Erro",
        message: "Nenhuma palavra cadastrada para este tema.",
        color: "red",
      });
      return;
    }

    const itemSorteado =
      listaDisponivel[Math.floor(Math.random() * listaDisponivel.length)];

    // Inicializa a instância da classe Rodada
    const novaRodada: Rodada = {
      palavraAtual: itemSorteado.texto,
      temaAtual: itemSorteado.nomeTema,
      letrasDescobertas: [],
      letrasErradas: [],
      erroSCometidos: 0,
      ativa: true,
      ganhou: false,
    };

    setRodada(novaRodada);
    setPalpiteLetra("");
    notifications.show({
      title: "Jogo Iniciado",
      message: `Tema: ${itemSorteado.nomeTema}. Adivinhe a palavra!`,
      color: "violet",
    });
  };

  // Método: calcularPontos() - Base do RF05
  const calcularPontos = (erros: number): number => {
    const pontosAcertoPalavra = 100;
    // Letras salvas/encobertas antes da força = limite de 6 menos os erros cometidos
    const letrasSalvas = 6 - erros;
    const bonusLetras = letrasSalvas * 15;

    return pontosAcertoPalavra + bonusLetras;
  };

  // Método: atualizarEscore() - Base do RF06
  const atualizarEscore = (pontosGanhos: number) => {
    if (!jogadorAtivo) return;
    setJogadores((prev) =>
      prev.map((j) =>
        j.id === jogadorAtivo
          ? { ...j, pontuacaoTotal: j.pontuacaoTotal + pontosGanhos }
          : j
      )
    );
  };

  // Método: validarPalpite() - Contém a lógica de verificação (RF04 + RF05)
  const handleValidarPalpite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rodada || !rodada.ativa) return;

    const letra = palpiteLetra.trim().toUpperCase();
    if (!letra || letra.length !== 1) return;

    // Evita palpites repetidos
    if (
      rodada.letrasDescobertas.includes(letra) ||
      rodada.letrasErradas.includes(letra)
    ) {
      notifications.show({
        title: "Aviso",
        message: "Você já tentou esta letra!",
        color: "yellow",
      });
      setPalpiteLetra("");
      return;
    }

    const novaRodadaObj = { ...rodada };

    if (novaRodadaObj.palavraAtual.includes(letra)) {
      // Letra correta
      novaRodadaObj.letrasDescobertas = [
        ...novaRodadaObj.letrasDescobertas,
        letra,
      ];

      // Verifica condição de vitória (Todas as letras da palavra foram descobertas)
      const ganhouJogo = novaRodadaObj.palavraAtual
        .split("")
        .every((l) => novaRodadaObj.letrasDescobertas.includes(l));

      if (ganhouJogo) {
        novaRodadaObj.ativa = false;
        novaRodadaObj.ganhou = true;
        const pontosFinais = calcularPontos(novaRodadaObj.erroSCometidos);
        atualizarEscore(pontosFinais);
        notifications.show({
          title: "🏆 Vitória!",
          message: `Você descobriu a palavra! +${pontosFinais} pontos.`,
          color: "green",
          autoClose: 5000,
        });
      }
    } else {
      // Letra errada (RF04 – Controle de erros)
      novaRodadaObj.letrasErradas = [...novaRodadaObj.letrasErradas, letra];
      novaRodadaObj.erroSCometidos += 1;

      // Condição de derrota (Limite de 6 erros)
      if (novaRodadaObj.erroSCometidos >= 6) {
        novaRodadaObj.ativa = false;
        novaRodadaObj.ganhou = false;
        notifications.show({
          title: "💥 Fim de Jogo",
          message: `Você atingiu o limite de erros! A palavra era ${novaRodadaObj.palavraAtual}.`,
          color: "red",
          autoClose: 5000,
        });
      }
    }

    setRodada(novaRodadaObj);
    setPalpiteLetra("");
  };

  // Ordenação para o RF06 - Ranking de escore
  const rankingJogadores = [...jogadores].sort(
    (a, b) => b.pontuacaoTotal - a.pontuacaoTotal
  );

  return (
    <MantineProvider>
      <Notifications position="top-right" />

      {/* Topbar */}
      <div className="bg-indigo-700 text-white py-6 px-4 shadow-md mb-8">
        <Container size="xl">
          <Group justify="space-between">
            <div>
              <Title order={2} className="font-bold tracking-tight">
                Desafio WordGuessing Game
              </Title>
              <Text size="sm" className="opacity-80">
                Mapeamento Arquitetural de Engenharia OO
              </Text>
            </div>
            <Badge
              size="lg"
              color="indigo"
              variant="filled"
              className="bg-indigo-800"
            >
              Questão 07
            </Badge>
          </Group>
          <DesenhoBoneco erros={rodada.erroSCometidos} />

          {/* ... Renderização das Letras Escondidas que já existem abaixo ... */}
          <div className="flex flex-wrap gap-3 justify-center my-6">
            {/* loop das letras... */}
          </div>
        </Container>
      </div>

      <Container size="xl" className="pb-16">
        <Tabs defaultValue="partida" color="indigo" variant="outline">
          <Tabs.List className="mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <Tabs.Tab value="partida" className="font-medium">
              🎮 Partida Atual
            </Tabs.Tab>
            <Tabs.Tab value="banco" className="font-medium">
              🗂️ Banco de Palavras
            </Tabs.Tab>
            <Tabs.Tab value="ranking" className="font-medium">
              🏆 Ranking & Líderes
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB: JOGABILIDADE */}
          <Tabs.Panel value="partida">
            <Grid>
              {/* Coluna de Configurações e Jogador */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="md">
                  <Card shadow="sm" withBorder p="md">
                    <Title order={4} className="mb-3 text-gray-700">
                      Identificação do Jogador
                    </Title>
                    {jogadores.length > 0 && (
                      <Select
                        label="Jogador Ativo"
                        data={jogadores.map((j) => ({
                          value: j.id,
                          label: `${j.nome} (Score: ${j.pontuacaoTotal} pts)`,
                        }))}
                        value={jogadorAtivo}
                        onChange={(val) => setJogadorAtivo(val)}
                        className="mb-3"
                      />
                    )}
                    <form onSubmit={handleCadastrarJogador}>
                      <Group gap="xs" align="flex-end">
                        <TextInput
                          label="Novo Perfil"
                          placeholder="Digite o apelido"
                          value={novoNomeJogador}
                          onChange={(e) => setNovoNomeJogador(e.target.value)}
                          className="flex-grow"
                          required
                        />
                        <Button type="submit" color="indigo">
                          Criar
                        </Button>
                      </Group>
                    </form>
                  </Card>

                  <Card shadow="sm" withBorder p="md">
                    <Title order={4} className="mb-3 text-gray-700">
                      Nova Rodada
                    </Title>
                    <Select
                      label="Filtrar por Tema"
                      data={[
                        { value: "Todos", label: "Qualquer Tema" },
                        ...temas.map((t) => ({
                          value: t.nomeTema,
                          label: t.nomeTema,
                        })),
                      ]}
                      value={temaFiltroSorteio}
                      onChange={(val) => setTemaFiltroSorteio(val)}
                      className="mb-4"
                    />
                    <Button
                      onClick={handleSortearDesafio}
                      color="violet"
                      fullWidth
                      size="md"
                    >
                      MÉTODO: sortearDesafio()
                    </Button>
                  </Card>
                </Stack>
              </Grid.Col>

              {/* Coluna da Forca/Mecânica */}
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card
                  shadow="sm"
                  withBorder
                  p="lg"
                  className="h-full flex flex-col justify-between"
                >
                  {!rodada ? (
                    <div className="text-center py-16 my-auto">
                      <Text size="xl" className="font-bold text-gray-400 mb-2">
                        Nenhuma partida em andamento
                      </Text>
                      <Text size="sm" color="dimmed">
                        Selecione ou adicione um jogador e dispare o método de
                        sorteio ao lado.
                      </Text>
                    </div>
                  ) : (
                    <Stack gap="lg" className="w-full">
                      {/* Cabeçalho da rodada */}
                      <Group
                        justify="space-between"
                        className="bg-slate-50 p-3 rounded-lg border"
                      >
                        <div>
                          <Text size="xs" color="dimmed">
                            Tema da Rodada:
                          </Text>
                          <Badge color="violet" size="lg">
                            {rodada.temaAtual}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <Text size="xs" color="dimmed">
                            Erros:
                          </Text>
                          <Text size="md" className="font-bold text-red-600">
                            {rodada.erroSCometidos} de 6
                          </Text>
                        </div>
                      </Group>

                      {/* Renderização das Letras Escondidas */}
                      <div className="flex flex-wrap gap-3 justify-center my-6">
                        {rodada.palavraAtual.split("").map((letra, index) => {
                          const descoberta =
                            rodada.letrasDescobertas.includes(letra);
                          return (
                            <div
                              key={index}
                              className={`w-12 h-14 border-b-4 flex items-center justify-center text-2xl font-black rounded-t transition-colors
                                ${
                                  descoberta
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-slate-400 bg-slate-100 text-transparent"
                                }`}
                            >
                              {descoberta ? letra : "?"}
                            </div>
                          );
                        })}
                      </div>

                      {/* Histórico de Letras Erradas */}
                      <div>
                        <Text
                          size="xs"
                          className="font-semibold text-gray-500 mb-1"
                        >
                          Letras Erradas:
                        </Text>
                        {rodada.letrasErradas.length === 0 ? (
                          <Text size="xs" className="italic text-gray-400">
                            Nenhum palpite incorreto ainda.
                          </Text>
                        ) : (
                          <Group gap="xs">
                            {rodada.letrasErradas.map((l, i) => (
                              <Badge
                                key={i}
                                color="red"
                                variant="outline"
                                size="md"
                              >
                                {l}
                              </Badge>
                            ))}
                          </Group>
                        )}
                      </div>

                      {/* Formulário de Input ou Resultado */}
                      <Divider className="my-2" />

                      {rodada.ativa ? (
                        <form
                          onSubmit={handleValidarPalpite}
                          className="bg-slate-50 p-4 rounded-lg border"
                        >
                          <Text className="font-semibold text-sm mb-2 text-gray-700">
                            Efetuar Palpite (RF04)
                          </Text>
                          <Group gap="md" align="flex-end">
                            <TextInput
                              placeholder="A"
                              maxLength={1}
                              value={palpiteLetra}
                              onChange={(e) => setPalpiteLetra(e.target.value)}
                              className="w-24 text-center"
                              autoFocus
                            />
                            <Button
                              type="submit"
                              color="indigo"
                              className="flex-grow"
                            >
                              MÉTODO: validarPalpite()
                            </Button>
                          </Group>
                        </form>
                      ) : (
                        <Paper
                          p="md"
                          className={`text-center rounded-lg ${
                            rodada.ganhou
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <Title order={3} className="font-bold">
                            {rodada.ganhou
                              ? "🎉 Você Venceu!"
                              : "💥 Fim de Jogo!"}
                          </Title>
                          <Text size="sm" className="mt-1">
                            {rodada.ganhou
                              ? `Pontuação da rodada calculada: +${calcularPontos(
                                  rodada.erroSCometidos
                                )} pontos!`
                              : `A palavra correta era: ${rodada.palavraAtual}`}
                          </Text>
                        </Paper>
                      )}
                    </Stack>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* TAB: GERENCIAR PALAVRAS (RF01 + RF02) */}
          <Tabs.Panel value="banco">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" withBorder p="md">
                  <Title order={4} className="mb-4 text-gray-700">
                    Alimentar Banco
                  </Title>
                  <form onSubmit={handleAdicionarPalavra}>
                    <Stack gap="sm">
                      <Select
                        label="Associar ao Tema"
                        data={temas.map((t) => ({
                          value: t.nomeTema,
                          label: t.nomeTema,
                        }))}
                        value={novoTemaPalavra}
                        onChange={(val) => setNovoTemaPalavra(val)}
                        required
                      />
                      <TextInput
                        label="Nova Palavra/Frase"
                        placeholder="Ex: JAVASCRIPT"
                        value={novaPalavraTexto}
                        onChange={(e) => setNovaPalavraTexto(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        color="indigo"
                        fullWidth
                        className="mt-2"
                      >
                        Salvar no Banco
                      </Button>
                    </Stack>
                  </form>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" withBorder p="md">
                  <Title order={4} className="mb-4 text-gray-700">
                    Palavras Armazenadas
                  </Title>
                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Palavra / Desafio</Table.Th>
                        <Table.Th>Tema Vinculado</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {bancoPalavras.map((p, idx) => (
                        <Table.Tr key={idx}>
                          <Table.Td className="font-bold tracking-wider">
                            {p.texto}
                          </Table.Td>
                          <Table.Td>
                            <Badge color="violet" variant="light">
                              {p.nomeTema}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* TAB: RANKING (RF06) */}
          <Tabs.Panel value="ranking">
            <Card shadow="sm" withBorder p="lg">
              <Title order={3} className="text-slate-800 mb-1">
                Ranking de Escore
              </Title>
              <Text size="xs" color="dimmed" className="mb-4">
                Classificação global atualizada por meio do método
                atualizarEscore()
              </Text>

              {rankingJogadores.length === 0 ? (
                <Text size="sm" className="text-center py-8 text-gray-400">
                  Nenhum competidor registrado ainda.
                </Text>
              ) : (
                <Table highlightOnHover verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: "80px" }}>Posição</Table.Th>
                      <Table.Th>Nome do Competidor</Table.Th>
                      <Table.Th style={{ textAlign: "right" }}>
                        Escore Acumulado
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {rankingJogadores.map((j, index) => (
                      <Table.Tr
                        key={j.id}
                        className={
                          j.id === jogadorAtivo ? "bg-indigo-50/50" : ""
                        }
                      >
                        <Table.Td>
                          <Badge
                            color={
                              index === 0
                                ? "yellow"
                                : index === 1
                                ? "gray"
                                : index === 2
                                ? "orange"
                                : "indigo"
                            }
                            variant="filled"
                          >
                            {index + 1}º
                          </Badge>
                        </Table.Td>
                        <Table.Td className="font-semibold text-slate-700">
                          {j.nome}
                        </Table.Td>
                        <Table.Td
                          style={{ textAlign: "right" }}
                          className="font-black text-indigo-600"
                        >
                          {j.pontuacaoTotal} pts
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </MantineProvider>
  );
}
