// src/pages/SusConectado.jsx - Versão redesenhada com paleta padronizada
import { useState, useEffect, useMemo } from "react";
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
  HiChartPie,
  HiTrendingUp,
  HiBadgeCheck,
  HiExternalLink,
} from "react-icons/hi";
import Swal from "sweetalert2";

// ----------------------------- DADOS MOCK -----------------------------
const EXAMES_MOCK = [
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
];

// ----------------------------- COMPONENTES REUTILIZÁVEIS -----------------------------

// Badge de status com ícone (estilo padronizado)
const StatusBadge = ({ status }) => {
  const config = {
    concluido: {
      label: "Concluído",
      bg: "bg-green-100",
      text: "text-green-700",
      icon: HiCheckCircle,
    },
    pendente: {
      label: "Pendente",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: HiClock,
    },
    agendado: {
      label: "Agendado",
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: HiBadgeCheck,
    },
  };
  const { label, bg, text, icon: Icon } = config[status] || config.pendente;
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      <Icon size={14} /> {label}
    </span>
  );
};

// Card de indicador (versão clean, sem gradiente pesado)
const IndicatorCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color = "blue",
  trend,
  trendValue,
}) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  };
  const { bg, text, border } = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-white rounded-2xl border ${border} p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold ${text} mt-1`}>
            {value}
            {unit && <span className="text-lg font-normal text-gray-400 ml-1">{unit}</span>}
          </p>
          {trend && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${
                trend === "up" ? "text-green-600" : "text-red-500"
              }`}
            >
              <HiTrendingUp className={trend === "down" ? "rotate-180" : ""} />
              {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bg} ${text}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Card de exame com design clean e borda sutil
const ExamCard = ({ exame, onDetalhes }) => {
  const borderColor = {
    concluido: "border-green-200 hover:border-green-400",
    pendente: "border-yellow-200 hover:border-yellow-400",
    agendado: "border-blue-200 hover:border-blue-400",
  }[exame.status];

  return (
    <div
      className={`bg-white rounded-2xl border-2 ${borderColor} p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
      onClick={() => onDetalhes(exame)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg">{exame.nome}</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium">Solicitante:</span> {exame.medicoSolicitante}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
            <span>📅 {exame.dataSolicitacao}</span>
            {exame.dataResultado && <span>✅ {exame.dataResultado}</span>}
          </div>
        </div>
        <StatusBadge status={exame.status} />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onDetalhes(exame);
          }}
        >
          Ver detalhes <HiExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

// ----------------------------- PÁGINA PRINCIPAL -----------------------------

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
  const [exames, setExames] = useState(EXAMES_MOCK);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const examesFiltrados = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return exames;
    return exames.filter(
      (e) =>
        e.nome.toLowerCase().includes(term) ||
        e.medicoSolicitante.toLowerCase().includes(term) ||
        e.status.toLowerCase().includes(term)
    );
  }, [exames, searchTerm]);

  const concluidos = examesFiltrados.filter((e) => e.status === "concluido").length;
  const pendentes = examesFiltrados.filter((e) => e.status === "pendente").length;
  const agendados = examesFiltrados.filter((e) => e.status === "agendado").length;

  // Simulação de API
  const fetchDados = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIndicadores({
      coberturaVacinal: Math.floor(70 + Math.random() * 20),
      mediaEspera: Math.floor(30 + Math.random() * 30),
      leitosOcupados: Math.floor(70 + Math.random() * 25),
    });
    const now = new Date();
    const hora = now.getHours().toString().padStart(2, "0");
    const minuto = now.getMinutes().toString().padStart(2, "0");
    setUbsData((prev) => ({
      ...prev,
      producaoMensal: Math.floor(900 + Math.random() * 200),
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
              ? "✅ Concluído"
              : exame.status === "pendente"
              ? "⏳ Pendente"
              : "📅 Agendado"
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiCloud className="text-blue-500" /> SUS Conectado
            </h1>
            <p className="text-gray-500 mt-1">
              Integração nacional – dados em tempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
          <button
              onClick={sincronizar}
              disabled={syncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <HiRefresh className={`${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Sincronizando..." : "Sincronizar"}
            </button>
          </div>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <IndicatorCard
            title="Cobertura Vacinal (BR)"
            value={indicadores.coberturaVacinal}
            unit="%"
            icon={HiDatabase}
            color="blue"
            trend="up"
            trendValue="+2% este mês"
          />
          <IndicatorCard
            title="Média de Espera"
            value={indicadores.mediaEspera}
            unit="dias"
            icon={HiClock}
            color="amber"
            trend="down"
            trendValue="-5 dias"
          />
          <IndicatorCard
            title="Leitos SUS Ocupados"
            value={indicadores.leitosOcupados}
            unit="%"
            icon={HiUsers}
            color="red"
            trend="up"
            trendValue="+3% hoje"
          />
          <IndicatorCard
            title="Produção Mensal"
            value={ubsData.producaoMensal}
            unit=""
            icon={HiTrendingUp}
            color="green"
            trend="up"
            trendValue="+12% vs mês passado"
          />
        </div>

        {/* Status da UBS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <HiClipboardList className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sua UBS</p>
                <p className="font-bold text-gray-800">
                  Código SUS: <span className="font-mono">{ubsData.codigoSUS}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Última sincronização: {ubsData.ultimaSincronizacao}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{ubsData.producaoMensal}</p>
                <p className="text-xs text-gray-400">atendimentos/mês</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{indicadores.coberturaVacinal}%</p>
                <p className="text-xs text-gray-400">cobertura nacional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Meus Exames */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <HiDocumentText className="text-purple-500" /> Meus Exames
            </h2>
            <p className="text-gray-500">Acompanhe seus exames solicitados</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
            <HiChartPie className="text-gray-400" />
            <span className="text-sm font-medium">
              <span className="text-green-600">{concluidos}</span> concluídos · 
              <span className="text-yellow-600"> {pendentes}</span> pendentes · 
              <span className="text-blue-600"> {agendados}</span> agendados
            </span>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar exame, médico ou status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition"
            />
            {searchTerm && (
              <button
                onClick={limparBusca}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Grid de exames */}
        {examesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <HiXCircle className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">Nenhum exame encontrado com esses critérios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examesFiltrados.map((exame) => (
              <ExamCard key={exame.id} exame={exame} onDetalhes={verDetalhesExame} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          Dados simulados para demonstração. Em produção, integre com a API oficial do DataSUS.
        </div>
      </div>
    </div>
  );
};

export default SusConectado;