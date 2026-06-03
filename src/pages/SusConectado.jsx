// src/pages/SusConectado.jsx - VERSÃO ORIGINAL (paciente/admin)
import { useState, useEffect } from "react";
import {
  HiCloud,
  HiRefresh,
  HiDatabase,
  HiClock,
  HiUsers,
  HiClipboardList,
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiSearch,
  HiX,
} from "react-icons/hi";
import Swal from "sweetalert2";

const SusConectado = () => {
  const [indicadores, setIndicadores] = useState({
    coberturaVacinal: 78,
    mediaEspera: 45,
    leitosOcupados: 82,
  });

  const [ubsData, setUbsData] = useState({
    codigoSUS: "1234567-89",
    producaoMensal: 980,
    ultimaSincronizacao: "Hoje, 08:32",
  });

  const [exames, setExames] = useState([
    {
      id: 1,
      nome: "Hemograma Completo",
      medicoSolicitante: "Dra. Ana Paula Costa",
      dataSolicitacao: "10/03/2025",
      dataResultado: "12/03/2025",
      status: "concluido",
      resultado: "Todos os parâmetros dentro da normalidade.",
    },
    {
      id: 2,
      nome: "Glicemia em Jejum",
      medicoSolicitante: "Dr. Ricardo Silva",
      dataSolicitacao: "10/03/2025",
      dataResultado: "11/03/2025",
      status: "concluido",
      resultado: "95 mg/dL (normal)",
    },
    {
      id: 3,
      nome: "Colesterol Total",
      medicoSolicitante: "Dra. Ana Paula Costa",
      dataSolicitacao: "20/03/2025",
      dataResultado: null,
      status: "pendente",
      resultado: "Aguardando resultado",
    },
    {
      id: 4,
      nome: "Ultrassom Abdômen",
      medicoSolicitante: "Dr. Carlos Eduardo",
      dataSolicitacao: "05/04/2025",
      dataResultado: null,
      status: "agendado",
      resultado: "Exame agendado para 15/04/2025",
    },
    {
      id: 5,
      nome: "Eletrocardiograma",
      medicoSolicitante: "Dra. Beatriz Menezes",
      dataSolicitacao: "01/04/2025",
      dataResultado: "03/04/2025",
      status: "concluido",
      resultado: "Normal - ritmo sinusal regular",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const examesFiltrados = exames.filter(
    (exame) =>
      exame.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exame.medicoSolicitante.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalExames = examesFiltrados.length;
  const concluidos = examesFiltrados.filter(
    (e) => e.status === "concluido",
  ).length;
  const pendentes = examesFiltrados.filter(
    (e) => e.status === "pendente",
  ).length;
  const agendados = examesFiltrados.filter(
    (e) => e.status === "agendado",
  ).length;

  const fetchDados = async () => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const novosIndicadores = {
          coberturaVacinal: Math.floor(70 + Math.random() * 20),
          mediaEspera: Math.floor(30 + Math.random() * 30),
          leitosOcupados: Math.floor(70 + Math.random() * 25),
        };
        const novaProducao = Math.floor(900 + Math.random() * 200);
        const now = new Date();
        const hora = now.getHours().toString().padStart(2, "0");
        const minuto = now.getMinutes().toString().padStart(2, "0");

        setIndicadores(novosIndicadores);
        setUbsData((prev) => ({
          ...prev,
          producaoMensal: novaProducao,
          ultimaSincronizacao: `Hoje, ${hora}:${minuto}`,
        }));
        resolve();
      }, 800);
    });
  };

  const sincronizar = async () => {
    setSyncing(true);
    await fetchDados();
    setSyncing(false);
    Swal.fire({
      icon: "success",
      title: "Sincronizado!",
      text: "Dados nacionais e da sua UBS foram atualizados.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const verDetalhesExame = (exame) => {
    Swal.fire({
      title: exame.nome,
      html: `
        <div style="text-align: left">
          <p><strong>Médico solicitante:</strong> ${exame.medicoSolicitante}</p>
          <p><strong>Data da solicitação:</strong> ${exame.dataSolicitacao}</p>
          <p><strong>Data do resultado:</strong> ${exame.dataResultado || "Não disponível"}</p>
          <p><strong>Status:</strong> ${exame.status === "concluido" ? "✅ Concluído" : exame.status === "pendente" ? "⏳ Pendente" : "📅 Agendado"}</p>
          <p><strong>Resultado/Informação:</strong> ${exame.resultado}</p>
        </div>
      `,
      icon: exame.status === "concluido" ? "success" : "info",
      confirmButtonColor: "#0057B8",
      confirmButtonText: "Fechar",
    });
  };

  const limparBusca = () => {
    setSearchTerm("");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        🌐 SUS Conectado - Integração Nacional
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Acompanhe indicadores do DataSUS e dados em tempo real da sua UBS.
      </p>

      {/* Status da conexão */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
            <HiCloud className="text-green-700 dark:text-green-400 text-2xl" />
          </div>
          <div>
            <p className="font-bold text-green-800 dark:text-green-300">
              ✅ Conexão com o DataSUS estabelecida em tempo real
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Última sincronização: {ubsData.ultimaSincronizacao}
            </p>
          </div>
        </div>
        <button
          onClick={sincronizar}
          disabled={syncing}
          className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50"
        >
          <HiRefresh className={`${syncing ? "animate-spin" : ""}`} />{" "}
          {syncing ? "Sincronizando..." : "Sincronizar agora"}
        </button>
      </div>

      {/* Grid de cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Indicadores Nacionais */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <HiDatabase className="text-blue-700 dark:text-blue-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Indicadores Nacionais
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">
                  Cobertura vacinal (BR)
                </span>
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {indicadores.coberturaVacinal}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${indicadores.coberturaVacinal}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Média de espera por especialista
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {indicadores.mediaEspera} dias
              </span>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Leitos SUS ocupados
              </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {indicadores.leitosOcupados}%
              </span>
            </div>
          </div>
          {isLoading && (
            <div className="mt-4 text-center text-gray-400 text-sm animate-pulse">
              Atualizando dados...
            </div>
          )}
        </div>

        {/* Dados da UBS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <HiUsers className="text-green-700 dark:text-green-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Dados da sua UBS
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Código SUS
              </span>
              <span className="font-mono font-bold">{ubsData.codigoSUS}</span>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Produção mensal
              </span>
              <span className="font-bold text-green-700 dark:text-green-400">
                {ubsData.producaoMensal} atendimentos
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <HiClock /> Última sincronização
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {ubsData.ultimaSincronizacao}
              </span>
            </div>
          </div>
          <button
            onClick={sincronizar}
            disabled={syncing}
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition disabled:opacity-50"
          >
            <HiRefresh className={syncing ? "animate-spin" : ""} />{" "}
            {syncing ? "Atualizando..." : "Atualizar dados"}
          </button>
        </div>
      </div>

      {/* Seção: Meus Exames */}
      <div className="mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <HiClipboardList className="text-purple-700 dark:text-purple-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Meus Exames
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Exames solicitados pelos médicos do SUS
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-sm flex-wrap">
            <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-green-700 dark:text-green-400">
              ✅ {concluidos} concluídos
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full text-yellow-700 dark:text-yellow-400">
              ⏳ {pendentes} pendentes
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-blue-700 dark:text-blue-400">
              📅 {agendados} agendados
            </div>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome do exame ou médico solicitante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiX />
              </button>
            )}
          </div>
        </div>

        {/* Cards dos exames */}
        {examesFiltrados.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center border dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum exame encontrado com os critérios informados.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examesFiltrados.map((exame) => (
              <div
                key={exame.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => verDetalhesExame(exame)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <HiDocumentText
                      className={`text-xl ${exame.status === "concluido" ? "text-green-600" : exame.status === "pendente" ? "text-yellow-600" : "text-blue-600"}`}
                    />
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">
                      {exame.nome}
                    </h3>
                  </div>
                  {exame.status === "concluido" ? (
                    <HiCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <HiXCircle className="text-gray-400 text-xl" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Médico: {exame.medicoSolicitante}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Solicitação: {exame.dataSolicitacao}
                </p>
                {exame.dataResultado && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Resultado: {exame.dataResultado}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t dark:border-gray-700 flex justify-between items-center">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${exame.status === "concluido" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-700" : exame.status === "pendente" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-700" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}
                  >
                    {exame.status === "concluido"
                      ? "Concluído"
                      : exame.status === "pendente"
                        ? "Pendente"
                        : "Agendado"}
                  </span>
                  <button
                    className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      verDetalhesExame(exame);
                    }}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700 pt-6">
        Dados simulados para demonstração. Em produção, integre com a API
        oficial do DataSUS.
      </div>
    </div>
  );
};

export default SusConectado;
