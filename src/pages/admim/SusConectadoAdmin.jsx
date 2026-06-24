// src/pages/admim/SusConectadoAdmin.jsx - Versão com i18n e padronização completa
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  HiTrendingDown,
  HiBadgeCheck,
  HiExternalLink,
  HiFilter,
  HiCalendar,
  HiUserGroup,
  HiViewGrid,
  HiViewList,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiHome,
  HiArchive,
  HiEye,
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
    prioridade: "alta",
    tipo: "sangue",
    arquivado: false,
  },
  {
    id: 2,
    nome: "Glicemia em Jejum",
    medicoSolicitante: "Dr. Ricardo Silva",
    dataSolicitacao: "10/03/2025",
    dataResultado: "11/03/2025",
    status: "concluido",
    resultado: "95 mg/dL (normal)",
    prioridade: "media",
    tipo: "sangue",
    arquivado: false,
  },
  {
    id: 3,
    nome: "Colesterol Total",
    medicoSolicitante: "Dra. Ana Paula Costa",
    dataSolicitacao: "20/03/2025",
    dataResultado: null,
    status: "pendente",
    resultado: "Aguardando resultado",
    prioridade: "media",
    tipo: "sangue",
    arquivado: false,
  },
  {
    id: 4,
    nome: "Ultrassom Abdômen",
    medicoSolicitante: "Dr. Carlos Eduardo",
    dataSolicitacao: "05/04/2025",
    dataResultado: null,
    status: "agendado",
    resultado: "Exame agendado para 15/04/2025",
    prioridade: "baixa",
    tipo: "imagem",
    arquivado: false,
  },
  {
    id: 5,
    nome: "Eletrocardiograma",
    medicoSolicitante: "Dra. Beatriz Menezes",
    dataSolicitacao: "01/04/2025",
    dataResultado: "03/04/2025",
    status: "concluido",
    resultado: "Normal - ritmo sinusal regular",
    prioridade: "alta",
    tipo: "cardiologia",
    arquivado: false,
  },
  {
    id: 6,
    nome: "Ressonância Magnética",
    medicoSolicitante: "Dr. Fernando Santos",
    dataSolicitacao: "15/04/2025",
    dataResultado: null,
    status: "pendente",
    resultado: "Em análise",
    prioridade: "alta",
    tipo: "imagem",
    arquivado: false,
  },
];

// ----------------------------- COMPONENTES REUTILIZÁVEIS -----------------------------

// Avatar com iniciais
const Avatar = ({ nome, size = "sm" }) => {
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const tamanho =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "md"
        ? "w-10 h-10 text-sm"
        : "w-12 h-12 text-base";
  return (
    <div
      className={`${tamanho} rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0`}
    >
      {iniciais}
    </div>
  );
};

// Badge de status com ícone e animação
const StatusBadge = ({ status, t }) => {
  const config = {
    concluido: {
      label: t("sus.status.concluido"),
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: HiCheckCircle,
    },
    pendente: {
      label: t("sus.status.pendente"),
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      icon: HiClock,
    },
    agendado: {
      label: t("sus.status.agendado"),
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      dot: "bg-sky-500",
      icon: HiCalendar,
    },
  };
  const {
    label,
    bg,
    text,
    border,
    dot,
    icon: Icon,
  } = config[status] || config.pendente;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
      <Icon size={12} className="opacity-70" />
    </span>
  );
};

// Badge de prioridade
const PriorityBadge = ({ prioridade, t }) => {
  const config = {
    alta: {
      label: t("sus.prioridade.alta"),
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    media: {
      label: t("sus.prioridade.media"),
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    baixa: {
      label: t("sus.prioridade.baixa"),
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
    },
  };
  const { label, bg, text, border } = config[prioridade] || config.media;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}
    >
      {label}
    </span>
  );
};

// Card de indicador com design moderno
const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color = "blue",
  trend,
  trendValue,
  subtitle,
}) => {
  const colorMap = {
    blue: "from-blue-600 to-blue-700",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-rose-500 to-rose-600",
    teal: "from-teal-500 to-teal-600",
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    gray: "from-slate-500 to-slate-600",
  };

  const gradient = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 min-w-[140px] flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {value}
            {unit && (
              <span className="text-sm font-normal text-gray-400 ml-1">
                {unit}
              </span>
            )}
          </p>
          {subtitle && (
            <p className="text-[10px] text-gray-400 truncate">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg flex-shrink-0`}
        >
          <Icon size={18} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-[10px]">
          {trend === "up" ? (
            <HiTrendingUp className="text-emerald-500" />
          ) : (
            <HiTrendingDown className="text-rose-500" />
          )}
          <span
            className={trend === "up" ? "text-emerald-600" : "text-rose-600"}
          >
            {trendValue}
          </span>
          <span className="text-gray-400">vs. anterior</span>
        </div>
      )}
    </div>
  );
};

// Card de exame com design moderno e interativo
const ExamCard = ({ exame, onDetalhes, t }) => {
  const borderColor = {
    concluido: "border-emerald-200 hover:border-emerald-400",
    pendente: "border-amber-200 hover:border-amber-400",
    agendado: "border-sky-200 hover:border-sky-400",
  }[exame.status];

  const isArquivado = exame.arquivado;

  return (
    <div
      className={`bg-white rounded-2xl border-2 ${borderColor} p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group ${isArquivado ? "opacity-60" : ""}`}
      onClick={() => onDetalhes(exame)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Avatar nome={exame.nome} size="sm" />
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                {exame.nome}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <HiUserGroup className="text-gray-400" />
              <span>{exame.medicoSolicitante}</span>
            </p>
          </div>
          <StatusBadge status={exame.status} t={t} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <PriorityBadge prioridade={exame.prioridade} t={t} />
          <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
            {exame.tipo}
          </span>
          {isArquivado && (
            <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
              <HiArchive className="inline mr-1" size={12} />
              {t("comum.arquivado")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1">
            <HiCalendar className="text-blue-400" />
            {exame.dataSolicitacao}
          </span>
          {exame.dataResultado && (
            <span className="flex items-center gap-1 text-emerald-600">
              <HiCheckCircle className="text-emerald-400" />
              {exame.dataResultado}
            </span>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDetalhes(exame);
            }}
          >
            {t("sus.ver_detalhes")} <HiExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------- PÁGINA PRINCIPAL -----------------------------

const SusConectado = () => {
  const { t } = useTranslation();

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
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [selectedPrioridade, setSelectedPrioridade] = useState("todas");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const examesFiltrados = useMemo(() => {
    let filtered = exames;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.nome.toLowerCase().includes(term) ||
          e.medicoSolicitante.toLowerCase().includes(term) ||
          e.status.toLowerCase().includes(term),
      );
    }

    if (selectedStatus !== "todos") {
      filtered = filtered.filter((e) => e.status === selectedStatus);
    }

    if (selectedPrioridade !== "todas") {
      filtered = filtered.filter((e) => e.prioridade === selectedPrioridade);
    }

    return filtered;
  }, [exames, searchTerm, selectedStatus, selectedPrioridade]);

  const stats = useMemo(() => {
    return {
      total: examesFiltrados.length,
      concluidos: examesFiltrados.filter((e) => e.status === "concluido")
        .length,
      pendentes: examesFiltrados.filter((e) => e.status === "pendente").length,
      agendados: examesFiltrados.filter((e) => e.status === "agendado").length,
      arquivados: exames.filter((e) => e.arquivado).length,
    };
  }, [examesFiltrados, exames]);

  const totalPages = Math.ceil(examesFiltrados.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return examesFiltrados.slice(start, start + itemsPerPage);
  }, [examesFiltrados, currentPage, itemsPerPage]);

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
      title: t("sus.sincronizado"),
      text: t("sus.sincronizado_texto"),
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

  const verDetalhesExame = useCallback(
    (exame) => {
      Swal.fire({
        title: exame.nome,
        html: `
        <div class="text-left space-y-3 p-1">
          <div class="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div class="p-2.5 bg-blue-50 rounded-full"><HiDocumentText class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="font-semibold text-gray-800 text-lg">${exame.nome}</p>
              <p class="text-sm text-gray-500">ID: #${exame.id}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span class="text-gray-500">${t("sus.medico")}:</span> <span class="font-medium">${exame.medicoSolicitante}</span></div>
            <div><span class="text-gray-500">${t("sus.tipo")}:</span> <span class="font-medium">${exame.tipo}</span></div>
            <div><span class="text-gray-500">${t("sus.data_solicitacao")}:</span> <span class="font-medium">${exame.dataSolicitacao}</span></div>
            <div><span class="text-gray-500">${t("sus.data_resultado")}:</span> <span class="font-medium">${exame.dataResultado || t("sus.nao_disponivel")}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("comum.status")}:</span> <span class="font-medium">${exame.status === "concluido" ? "✅ " + t("sus.status.concluido") : exame.status === "pendente" ? "⏳ " + t("sus.status.pendente") : "📅 " + t("sus.status.agendado")}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("sus.prioridade")}:</span> <span class="font-medium">${exame.prioridade === "alta" ? "🔴 " + t("sus.prioridade.alta") : exame.prioridade === "media" ? "🟡 " + t("sus.prioridade.media") : "🟢 " + t("sus.prioridade.baixa")}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("sus.resultado")}:</span> <span class="font-medium">${exame.resultado}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("comum.arquivado")}:</span> <span class="font-medium">${exame.arquivado ? t("comum.sim") : t("comum.nao")}</span></div>
          </div>
        </div>
      `,
        icon: exame.status === "concluido" ? "success" : "info",
        confirmButtonColor: "#1e293b",
        confirmButtonText: t("comum.fechar"),
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        },
      });
    },
    [t],
  );

  const limparBusca = () => setSearchTerm("");
  const limparFiltros = () => {
    setSelectedStatus("todos");
    setSelectedPrioridade("todas");
    setCurrentPage(1);
  };

  const handleArquivar = useCallback(
    (exame) => {
      Swal.fire({
        title: t("sus.arquivar_titulo"),
        text: t("sus.arquivar_texto", { nome: exame.nome }),
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e293b",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: t("comum.sim_arquivar"),
        cancelButtonText: t("comum.cancelar"),
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
          cancelButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setExames((prev) =>
            prev.map((e) =>
              e.id === exame.id ? { ...e, arquivado: true } : e,
            ),
          );
          Swal.fire({
            icon: "success",
            title: t("sus.arquivado_sucesso"),
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });
        }
      });
    },
    [t],
  );

  const handleDesarquivar = useCallback(
    (exame) => {
      Swal.fire({
        title: t("sus.desarquivar_titulo"),
        text: t("sus.desarquivar_texto", { nome: exame.nome }),
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#1e293b",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: t("comum.sim_desarquivar"),
        cancelButtonText: t("comum.cancelar"),
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
          cancelButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setExames((prev) =>
            prev.map((e) =>
              e.id === exame.id ? { ...e, arquivado: false } : e,
            ),
          );
          Swal.fire({
            icon: "success",
            title: t("sus.desarquivado_sucesso"),
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });
        }
      });
    },
    [t],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <HeaderSection t={t} />

        {/* Indicadores */}
        <MetricsGrid
          indicadores={indicadores}
          ubsData={ubsData}
          stats={stats}
          t={t}
        />

        {/* Status da UBS */}
        <UBSStatusCard ubsData={ubsData} indicadores={indicadores} t={t} />

        {/* Seção Meus Exames */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <HiDocumentText className="text-purple-500" />{" "}
              {t("sus.meus_exames")}
            </h2>
            <p className="text-gray-500">{t("sus.meus_exames_subtitulo")}</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition">
            <HiChartPie className="text-gray-400" />
            <span className="text-sm font-medium">
              <span className="text-emerald-600">{stats.concluidos}</span>{" "}
              {t("sus.concluidos")} ·
              <span className="text-amber-600"> {stats.pendentes}</span>{" "}
              {t("sus.pendentes")} ·
              <span className="text-sky-600"> {stats.agendados}</span>{" "}
              {t("sus.agendados")}
            </span>
          </div>
        </div>

        {/* Barra de pesquisa e filtros */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPrioridade={selectedPrioridade}
          setSelectedPrioridade={setSelectedPrioridade}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          limparFiltros={limparFiltros}
          limparBusca={limparBusca}
          setCurrentPage={setCurrentPage}
          totalResults={examesFiltrados.length}
          t={t}
        />

        {/* Grid/Lista de exames */}
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : examesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-xl border-2 border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiXCircle className="text-gray-300 text-5xl" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {t("sus.nenhum_exame")}
            </p>
            <p className="text-gray-400 text-sm">
              {t("sus.nenhum_exame_texto")}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((exame) => (
              <ExamCard
                key={exame.id}
                exame={exame}
                onDetalhes={verDetalhesExame}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <ExamsTable
              data={paginatedData}
              onDetalhes={verDetalhesExame}
              onArquivar={handleArquivar}
              onDesarquivar={handleDesarquivar}
              t={t}
            />
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={examesFiltrados.length}
            t={t}
          />
        )}

        {/* Rodapé */}
        <FooterSection t={t} />
      </div>
    </div>
  );
};

// ============================================================
// SUBCOMPONENTES (com i18n)
// ============================================================

const HeaderSection = ({ t }) => {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <HiHome className="w-4 h-4" />
            <span>Dashboard</span>
            <HiChevronDoubleLeft className="w-3 h-3 rotate-180" />
            <span className="text-white font-medium">{t("sus.titulo")}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2">
            <HiCloud className="w-7 h-7" />
            {t("sus.titulo")}
          </h1>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
            <span>{t("sus.subtitulo")}</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>{dataFormatada}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              Swal.fire({
                icon: "info",
                title: t("sus.sincronizar_titulo"),
                text: t("sus.sincronizar_texto"),
                confirmButtonColor: "#1e293b",
                confirmButtonText: t("comum.continuar"),
                customClass: {
                  popup: "rounded-3xl shadow-2xl border border-gray-100",
                  confirmButton:
                    "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
                },
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold border border-white/20 transition-all"
          >
            <HiRefresh />
            {t("comum.sincronizar")}
          </button>
        </div>
      </div>
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
    </div>
  );
};

const MetricsGrid = ({ indicadores, ubsData, stats, t }) => {
  const cards = [
    {
      title: t("sus.cobertura_vacinal"),
      value: indicadores.coberturaVacinal,
      unit: "%",
      icon: HiDatabase,
      color: "blue",
      trend: "up",
      trendValue: "+2%",
      subtitle: t("sus.este_mes"),
    },
    {
      title: t("sus.media_espera"),
      value: indicadores.mediaEspera,
      unit: "dias",
      icon: HiClock,
      color: "amber",
      trend: "down",
      trendValue: "-5 dias",
      subtitle: t("sus.reducao"),
    },
    {
      title: t("sus.leitos_ocupados"),
      value: indicadores.leitosOcupados,
      unit: "%",
      icon: HiUsers,
      color: "red",
      trend: "up",
      trendValue: "+3%",
      subtitle: t("sus.hoje"),
    },
    {
      title: t("sus.producao_mensal"),
      value: ubsData.producaoMensal,
      unit: "",
      icon: HiTrendingUp,
      color: "green",
      trend: "up",
      trendValue: "+12%",
      subtitle: t("sus.vs_mes_passado"),
    },
    {
      title: t("sus.total_exames"),
      value: stats.total,
      unit: "",
      icon: HiDocumentText,
      color: "purple",
      trend: "up",
      trendValue: "+8%",
      subtitle: t("sus.no_total"),
    },
    {
      title: t("comum.arquivados"),
      value: stats.arquivados,
      unit: "",
      icon: HiArchive,
      color: "gray",
      trend: "up",
      trendValue: "+2%",
      subtitle: t("sus.arquivados_sub"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {cards.map((card, idx) => (
        <MetricCard key={idx} {...card} />
      ))}
    </div>
  );
};

const UBSStatusCard = ({ ubsData, indicadores, t }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-full opacity-30 -translate-y-1/2 translate-x-1/4" />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <HiClipboardList className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              {t("sus.sua_ubs")}
            </p>
            <p className="font-bold text-gray-800 text-lg">
              {t("sus.codigo_sus")}:{" "}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {ubsData.codigoSUS}
              </span>
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <HiClock className="text-gray-400" />
              {t("sus.ultima_sincronizacao")}: {ubsData.ultimaSincronizacao}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {ubsData.producaoMensal}
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {t("sus.atendimentos_mes")}
            </p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {indicadores.coberturaVacinal}%
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {t("sus.cobertura_nacional")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedPrioridade,
  setSelectedPrioridade,
  showFilters,
  setShowFilters,
  viewMode,
  setViewMode,
  limparFiltros,
  limparBusca,
  setCurrentPage,
  totalResults,
  t,
}) => {
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const isFilterActive =
    selectedStatus !== "todos" || selectedPrioridade !== "todas";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("sus.buscar_exame")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
            />
            {searchTerm && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiX size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2.5 rounded-xl border ${
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              } hover:bg-gray-100 transition flex items-center gap-1`}
            >
              <HiFilter size={18} />
              <span className="hidden sm:inline text-sm">
                {t("comum.filtros")}
              </span>
              {isFilterActive && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              )}
            </button>

            <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-200"
                }`}
              >
                <HiViewGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-200"
                }`}
              >
                <HiViewList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros expansíveis */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {t("comum.status")}:
                </span>
                <select
                  value={selectedStatus}
                  onChange={handleFilterChange(setSelectedStatus)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                >
                  <option value="todos">{t("comum.todos")}</option>
                  <option value="concluido">{t("sus.status.concluido")}</option>
                  <option value="pendente">{t("sus.status.pendente")}</option>
                  <option value="agendado">{t("sus.status.agendado")}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {t("sus.prioridade")}:
                </span>
                <select
                  value={selectedPrioridade}
                  onChange={handleFilterChange(setSelectedPrioridade)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                >
                  <option value="todas">{t("sus.prioridade.todas")}</option>
                  <option value="alta">{t("sus.prioridade.alta")}</option>
                  <option value="media">{t("sus.prioridade.media")}</option>
                  <option value="baixa">{t("sus.prioridade.baixa")}</option>
                </select>
              </div>
              {isFilterActive && (
                <button
                  onClick={limparFiltros}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t("comum.limpar_filtros")}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <HiFilter className="w-4 h-4" />
          <span>
            <strong className="text-gray-700">{totalResults}</strong>{" "}
            {totalResults === 1 ? t("comum.resultado") : t("comum.resultados")}{" "}
            {totalResults === 1
              ? t("comum.encontrado")
              : t("comum.encontrados")}
          </span>
          {isFilterActive && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {t("comum.filtros_ativos")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ExamsTable = ({ data, onDetalhes, onArquivar, onDesarquivar, t }) => {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
          <HiDocumentText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">
          {t("sus.nenhum_exame")}
        </h3>
        <p className="text-gray-500 mt-1">{t("sus.nenhum_exame_texto")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("sus.exame")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              {t("sus.medico")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              {t("sus.tipo")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("sus.data")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("comum.status")}
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("comum.acoes")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((exame) => {
            const isArquivado = exame.arquivado;
            return (
              <tr
                key={exame.id}
                className={`group hover:bg-blue-50/50 transition-colors duration-200 ${isArquivado ? "opacity-60" : ""}`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar nome={exame.nome} size="sm" />
                    <div>
                      <span className="font-medium text-gray-800 truncate max-w-[150px] block">
                        {exame.nome}
                      </span>
                      <PriorityBadge prioridade={exame.prioridade} t={t} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 hidden md:table-cell truncate max-w-[120px]">
                  {exame.medicoSolicitante}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500 hidden sm:table-cell">
                  {exame.tipo}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {exame.dataSolicitacao}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={exame.status} t={t} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onDetalhes(exame)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                      title={t("comum.visualizar")}
                    >
                      <HiEye size={16} />
                    </button>
                    {!isArquivado ? (
                      <button
                        onClick={() => onArquivar(exame)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        title={t("comum.arquivar")}
                      >
                        <HiArchive size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onDesarquivar(exame)}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition"
                        title={t("comum.desarquivar")}
                      >
                        <HiRefresh size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  totalItems,
  t,
}) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-gray-500">
        {t("comum.mostrando")}{" "}
        <strong className="text-gray-700">{start}</strong> {t("comum.a")}{" "}
        <strong className="text-gray-700">{end}</strong> {t("comum.de")}{" "}
        <strong className="text-gray-700">{totalItems}</strong>{" "}
        {t("comum.registros")}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <HiChevronDoubleLeft size={16} />
        </button>
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <HiChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page;
          if (totalPages <= 5) page = i + 1;
          else if (currentPage <= 3) page = i + 1;
          else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
          else page = currentPage - 2 + i;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                page === currentPage
                  ? "bg-slate-700 text-white shadow-md"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <HiChevronRight size={16} />
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <HiChevronDoubleRight size={16} />
        </button>
      </div>
    </div>
  );
};

const FooterSection = ({ t }) => {
  return (
    <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
      <p>{t("sus.footer_dados")}</p>
      <p className="mt-1">{t("sus.footer_copyright")}</p>
    </div>
  );
};

export default SusConectado;
