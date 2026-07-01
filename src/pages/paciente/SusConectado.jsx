// src/pages/SusConectado.jsx
import { useState, useEffect, useMemo } from "react";
import {
  HiCloud,
  HiRefresh,
  HiDatabase,
  HiClock,
  HiUsers,
  HiClipboardList,
  HiDocumentText,
  HiSearch,
  HiX,
  HiEye,
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

  const examesFiltrados = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return exames;
    return exames.filter(
      (e) =>
        e.nome.toLowerCase().includes(term) ||
        e.medicoSolicitante.toLowerCase().includes(term),
    );
  }, [exames, searchTerm]);

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
    await new Promise((resolve) => setTimeout(resolve, 800));
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
    setIsLoading(false);
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
      timer: 2500,
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
        <div style="text-align: left; line-height: 1.8;">
          <p><strong>Médico solicitante:</strong> ${exame.medicoSolicitante}</p>
          <p><strong>Data da solicitação:</strong> ${exame.dataSolicitacao}</p>
          <p><strong>Data do resultado:</strong> ${exame.dataResultado || "Não disponível"}</p>
          <p><strong>Status:</strong> ${
            exame.status === "concluido"
              ? "Concluído"
              : exame.status === "pendente"
                ? "Pendente"
                : "Agendado"
          }</p>
          <p><strong>Resultado:</strong> ${exame.resultado}</p>
        </div>
      `,
      icon: exame.status === "concluido" ? "success" : "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  const limparBusca = () => setSearchTerm("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiCloud className="text-blue-600" /> SUS Conectado
            </h1>
            <p className="text-gray-500">
              Integração nacional – dados em tempo real
            </p>
          </div>
        </div>

        {/* Status da conexão - AGORA EM AZUL */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <HiCloud className="text-blue-700 text-2xl" />
            </div>
            <div>
              <p className="font-bold text-blue-800">
                Conexão com o DataSUS estabelecida
              </p>
              <p className="text-sm text-blue-700">
                Última sincronização: {ubsData.ultimaSincronizacao}
              </p>
            </div>
          </div>
          <button
            onClick={sincronizar}
            disabled={syncing}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-semibold transition disabled:opacity-50"
          >
            <HiRefresh className={syncing ? "animate-spin" : ""} />{" "}
            {syncing ? "Sincronizando..." : "Sincronizar agora"}
          </button>
        </div>

        {/* Cards de indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Cobertura Vacinal (BR)"
            value={`${indicadores.coberturaVacinal}%`}
            icon={HiDatabase}
            color="blue"
          />
          <MetricCard
            title="Média de Espera"
            value={`${indicadores.mediaEspera} dias`}
            icon={HiClock}
            color="amber"
          />
          <MetricCard
            title="Leitos SUS Ocupados"
            value={`${indicadores.leitosOcupados}%`}
            icon={HiUsers}
            color="red"
          />
          <MetricCard
            title="Produção Mensal"
            value={ubsData.producaoMensal}
            icon={HiDocumentText}
            color="green"
          />
        </div>

        {/* Seção Meus Exames */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <HiClipboardList className="text-purple-600" /> Meus Exames
              </h2>
              <p className="text-sm text-gray-500">
                Exames solicitados pelos médicos do SUS
              </p>
            </div>
            <div className="flex gap-2 text-sm flex-wrap">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                ✓ {concluidos} concluídos
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                ⏳ {pendentes} pendentes
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                📅 {agendados} agendados
              </span>
            </div>
          </div>

          {/* Busca */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar exame ou médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Exame
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Solicitação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {examesFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum exame encontrado.
                    </td>
                  </tr>
                ) : (
                  examesFiltrados.map((exame) => (
                    <tr
                      key={exame.id}
                      className="hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => verDetalhesExame(exame)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                        {exame.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exame.medicoSolicitante}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exame.dataSolicitacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exame.dataResultado || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={exame.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            verDetalhesExame(exame);
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Visualizar"
                        >
                          <HiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          Dados simulados para demonstração. Em produção, integre com a API
          oficial do DataSUS.
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };
  return (
    <div
      className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <Icon size={22} className="opacity-70" />
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    concluido: {
      label: "Concluído",
      bg: "bg-green-100",
      text: "text-green-700",
    },
    pendente: {
      label: "Pendente",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
    agendado: { label: "Agendado", bg: "bg-blue-100", text: "text-blue-700" },
  };
  const { label, bg, text } = config[status] || config.pendente;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

export default SusConectado;