// src/pages/admim/VacinacaoAdmin.jsx - Versão com i18n e padronização completa
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  HiSearch,
  HiX,
  HiFilter,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiHome,
  HiClipboardList,
  HiTrendingUp,
  HiTrendingDown,
  HiChartPie,
  HiOfficeBuilding,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiXCircle,
  HiEye,
  HiPencil,
  HiArchive,
  HiRefresh,
  HiPlus,
  HiDocumentReport,
  HiUser,
} from "react-icons/hi";
import { FaSyringe } from "react-icons/fa";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ============================================================
// DADOS MOCK - 34 REGISTROS
// ============================================================
const generateEstoque = () => {
  const vacinas = [
    {
      nome: "COVID-19 (Pfizer)",
      status: "disponivel",
      qtd: 45,
      lote: "AB123",
      validade: "2025-12-31",
    },
    {
      nome: "Gripe (Influenza)",
      status: "disponivel",
      qtd: 12,
      lote: "GR789",
      validade: "2024-10-15",
    },
    {
      nome: "Hepatite B",
      status: "disponivel",
      qtd: 30,
      lote: "HB234",
      validade: "2025-11-10",
    },
    {
      nome: "Pneumocócica 10-valente",
      status: "disponivel",
      qtd: 22,
      lote: "PN789",
      validade: "2025-08-15",
    },
    {
      nome: "Meningocócica C",
      status: "disponivel",
      qtd: 14,
      lote: "MC456",
      validade: "2025-04-20",
    },
    {
      nome: "Difteria, Tétano, Pertussis (dTpa)",
      status: "disponivel",
      qtd: 20,
      lote: "DT789",
      validade: "2025-10-10",
    },
    {
      nome: "Poliomielite (VIP)",
      status: "disponivel",
      qtd: 25,
      lote: "PO456",
      validade: "2025-07-30",
    },
    {
      nome: "Difteria-Tétano (dT adulto)",
      status: "disponivel",
      qtd: 13,
      lote: "DT123",
      validade: "2026-01-15",
    },
    {
      nome: "Sarampo, Caxumba, Rubéola (SCR)",
      status: "disponivel",
      qtd: 18,
      lote: "SCR456",
      validade: "2025-09-30",
    },
    {
      nome: "Hepatite A (pediátrica)",
      status: "disponivel",
      qtd: 15,
      lote: "HAP789",
      validade: "2025-12-01",
    },
    {
      nome: "Febre Amarela",
      status: "critico",
      qtd: 5,
      lote: "FA456",
      validade: "2026-01-20",
    },
    {
      nome: "Tríplice Viral",
      status: "critico",
      qtd: 18,
      lote: "TV567",
      validade: "2024-09-30",
    },
    {
      nome: "DTP (Tríplice Bacteriana)",
      status: "critico",
      qtd: 8,
      lote: "DTP321",
      validade: "2025-02-28",
    },
    {
      nome: "Hepatite A",
      status: "critico",
      qtd: 9,
      lote: "HA789",
      validade: "2025-06-30",
    },
    {
      nome: "Varicela (Catapora)",
      status: "critico",
      qtd: 4,
      lote: "VC123",
      validade: "2024-11-15",
    },
    {
      nome: "Febre Tifoide",
      status: "critico",
      qtd: 7,
      lote: "FT123",
      validade: "2025-03-25",
    },
    {
      nome: "Cólera",
      status: "critico",
      qtd: 11,
      lote: "CO456",
      validade: "2025-12-05",
    },
    {
      nome: "Encefalite Japonesa",
      status: "critico",
      qtd: 3,
      lote: "EJ789",
      validade: "2024-08-20",
    },
    {
      nome: "Pneumocócica 23-valente",
      status: "critico",
      qtd: 6,
      lote: "PN789",
      validade: "2026-02-10",
    },
    {
      nome: "Hepatite A (pediátrica)",
      status: "critico",
      qtd: 8,
      lote: "HA456",
      validade: "2026-03-01",
    },
    {
      nome: "HPV (Quadrivalente)",
      status: "esgotado",
      qtd: 0,
      lote: "HPV890",
      validade: "2025-07-01",
    },
    {
      nome: "Rotavírus",
      status: "esgotado",
      qtd: 0,
      lote: "RV123",
      validade: "2024-12-01",
    },
    {
      nome: "HPV (Bivalente)",
      status: "esgotado",
      qtd: 0,
      lote: "HPV456",
      validade: "2025-09-01",
    },
    {
      nome: "Raiva",
      status: "esgotado",
      qtd: 0,
      lote: "RA123",
      validade: "2025-05-15",
    },
    {
      nome: "Tétano (dT)",
      status: "esgotado",
      qtd: 0,
      lote: "DT123",
      validade: "2025-11-20",
    },
    {
      nome: "Meningocócica ACWY",
      status: "esgotado",
      qtd: 0,
      lote: "MC789",
      validade: "2024-12-20",
    },
    {
      nome: "Rotavírus (monovalente)",
      status: "esgotado",
      qtd: 0,
      lote: "RV456",
      validade: "2025-04-05",
    },
    {
      nome: "Caxumba (monovalente)",
      status: "esgotado",
      qtd: 0,
      lote: "CX456",
      validade: "2025-06-01",
    },
    {
      nome: "BCG (tuberculose)",
      status: "esgotado",
      qtd: 0,
      lote: "BCG123",
      validade: "2024-12-31",
    },
    {
      nome: "HPV (9-valente)",
      status: "esgotado",
      qtd: 0,
      lote: "HPV999",
      validade: "2025-08-15",
    },
  ];

  const ubsList = [
    "UBS Central",
    "UBS Norte",
    "UBS Sul",
    "UBS Leste",
    "UBS Oeste",
  ];

  return vacinas.map((v, index) => ({
    id: index + 1,
    vacina: v.nome,
    ubs: ubsList[index % ubsList.length],
    quantidade: v.qtd,
    lote: v.lote,
    validade: v.validade,
    status: v.status,
    arquivado: Math.random() < 0.1,
  }));
};

// ============================================================
// COMPONENTES REUTILIZÁVEIS (com i18n)
// ============================================================

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

const StatusBadge = ({ status, t }) => {
  const config = {
    disponivel: {
      label: t("vacinas.status.disponivel"),
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: HiCheckCircle,
    },
    critico: {
      label: t("vacinas.status.critico"),
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      icon: HiExclamationCircle,
    },
    esgotado: {
      label: t("vacinas.status.esgotado"),
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
      icon: HiXCircle,
    },
  };
  const {
    label,
    bg,
    text,
    border,
    dot,
    icon: Icon,
  } = config[status] || config.disponivel;
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

const MetricCard = ({
  title,
  value,
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
          <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
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

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const VacinacaoAdmin = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <HiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("comum.acesso_restrito")}
          </h2>
          <p className="text-gray-600 mt-2">
            {t("comum.acesso_restrito_texto")}
          </p>
        </div>
      </div>
    );
  }

  const [estoque, setEstoque] = useState(generateEstoque);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterUBS, setFilterUBS] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "vacina",
    direction: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Extrair UBS únicas para filtro
  const ubsList = useMemo(() => {
    const unicas = [...new Set(estoque.map((r) => r.ubs))];
    return ["todas", ...unicas];
  }, [estoque]);

  // Filtrar e ordenar
  const filteredData = useMemo(() => {
    let result = estoque;

    // Busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.vacina.toLowerCase().includes(term) ||
          r.ubs.toLowerCase().includes(term) ||
          r.lote.toLowerCase().includes(term),
      );
    }

    // Filtro de status
    if (filterStatus !== "todos") {
      result = result.filter((r) => r.status === filterStatus);
    }

    // Filtro de UBS
    if (filterUBS !== "todas") {
      result = result.filter((r) => r.ubs === filterUBS);
    }

    // Ordenação
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [estoque, searchTerm, filterStatus, filterUBS, sortConfig]);

  // Métricas
  const metrics = useMemo(() => {
    const total = filteredData.length;
    const disponiveis = filteredData.filter(
      (r) => r.status === "disponivel" && !r.arquivado,
    ).length;
    const criticos = filteredData.filter(
      (r) => r.status === "critico" && !r.arquivado,
    ).length;
    const esgotados = filteredData.filter(
      (r) => r.status === "esgotado" && !r.arquivado,
    ).length;
    const totalDoses = filteredData.reduce((acc, r) => acc + r.quantidade, 0);

    return {
      total,
      disponiveis,
      criticos,
      esgotados,
      totalDoses,
    };
  }, [filteredData]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setFilterStatus("todos");
    setFilterUBS("todas");
    setCurrentPage(1);
  }, []);

  // ============================================================
  // MODAL PREMIUM (com i18n)
  // ============================================================
  const showPremiumModal = ({
    title,
    html,
    preConfirm,
    confirmText = t("comum.salvar"),
    cancelText = t("comum.cancelar"),
    icon = null,
    showCancel = true,
    width = 580,
  }) => {
    return Swal.fire({
      title,
      html,
      icon,
      showCancelButton: showCancel,
      confirmButtonColor: "#1e293b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      width,
      padding: "1.8rem",
      backdrop: "rgba(0,0,0,0.4)",
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        title: "text-2xl font-bold text-gray-800",
        confirmButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        cancelButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
        input:
          "rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      },
      preConfirm,
    });
  };

  // ============================================================
  // HANDLERS CRUD (com i18n)
  // ============================================================

  const visualizarRegistro = useCallback(
    (registro) => {
      const statusMap = {
        disponivel: {
          label: t("vacinas.status.disponivel"),
          color: "text-emerald-600",
          bg: "#dcfce7",
        },
        critico: {
          label: t("vacinas.status.critico"),
          color: "text-amber-600",
          bg: "#fef3c7",
        },
        esgotado: {
          label: t("vacinas.status.esgotado"),
          color: "text-rose-500",
          bg: "#fee2e2",
        },
      };
      const { label, color, bg } =
        statusMap[registro.status] || statusMap.esgotado;

      Swal.fire({
        title: `<span style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">💉 ${registro.vacina}</span>`,
        html: `
        <div class="text-left space-y-3 p-1">
          <div class="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div class="p-2.5 bg-blue-50 rounded-full"><FaSyringe class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="font-semibold text-gray-800 text-lg">${registro.vacina}</p>
              <p class="text-sm text-gray-500">ID: #${registro.id}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span class="text-gray-500">${t("vacinas.ubs")}:</span> <span class="font-medium">${registro.ubs}</span></div>
            <div><span class="text-gray-500">${t("vacinas.quantidade")}:</span> <span class="font-medium">${registro.quantidade} ${t("vacinas.doses")}</span></div>
            <div><span class="text-gray-500">${t("vacinas.lote")}:</span> <span class="font-medium font-mono">${registro.lote}</span></div>
            <div><span class="text-gray-500">${t("vacinas.validade")}:</span> <span class="font-medium">${registro.validade}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("comum.status")}:</span> <span class="font-medium" style="color: ${color}; background: ${bg}; padding: 0.2rem 0.8rem; border-radius: 9999px;">${label}</span></div>
            ${registro.arquivado ? `<div class="col-span-2"><span class="text-gray-500">${t("comum.status")}:</span> <span class="font-medium">📦 ${t("comum.arquivado")}</span></div>` : ""}
          </div>
        </div>
      `,
        icon: "info",
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

  const novoLote = useCallback(() => {
    const ubsOptions = ubsList
      .filter((u) => u !== "todas")
      .map((u) => `<option value="${u}">${u}</option>`)
      .join("");

    showPremiumModal({
      title: t("vacinas.modais.novo_lote_titulo"),
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.vacina")} <span class="text-red-500">*</span></label>
            <input id="swal-vacina" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("vacinas.modais.nome_vacina")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.ubs")} <span class="text-red-500">*</span></label>
            <select id="swal-ubs" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white">
              ${ubsOptions}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.quantidade")} <span class="text-red-500">*</span></label>
              <input id="swal-quantidade" type="number" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.lote")} <span class="text-red-500">*</span></label>
              <input id="swal-lote" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("vacinas.modais.codigo_lote")}" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.validade")} <span class="text-red-500">*</span></label>
            <input id="swal-validade" type="date" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
          </div>
        </div>
      `,
      confirmText: t("comum.adicionar"),
      cancelText: t("comum.cancelar"),
      preConfirm: () => {
        const vacina = document.getElementById("swal-vacina").value.trim();
        const ubs = document.getElementById("swal-ubs").value;
        const quantidade =
          parseInt(document.getElementById("swal-quantidade").value) || 0;
        const lote = document
          .getElementById("swal-lote")
          .value.trim()
          .toUpperCase();
        const validade = document.getElementById("swal-validade").value;

        if (!vacina || !ubs || !lote || !validade) {
          Swal.showValidationMessage(t("vacinas.modais.campos_obrigatorios"));
          return;
        }

        let status = "esgotado";
        if (quantidade > 10) status = "disponivel";
        else if (quantidade > 0) status = "critico";

        return { vacina, ubs, quantidade, lote, validade, status };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { vacina, ubs, quantidade, lote, validade, status } =
          result.value;
        const novoId = Math.max(...estoque.map((e) => e.id)) + 1;
        setEstoque((prev) => [
          ...prev,
          {
            id: novoId,
            vacina,
            ubs,
            quantidade,
            lote,
            validade,
            status,
            arquivado: false,
          },
        ]);
        Swal.fire({
          icon: "success",
          title: t("vacinas.modais.lote_adicionado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  }, [estoque, ubsList, showPremiumModal, t]);

  const editarRegistro = useCallback(
    (registro) => {
      showPremiumModal({
        title: t("vacinas.modais.editar_lote_titulo"),
        html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.vacina")}</label>
            <input id="swal-vacina" value="${registro.vacina}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.ubs")}</label>
            <input id="swal-ubs" value="${registro.ubs}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50" disabled />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.quantidade")} <span class="text-red-500">*</span></label>
              <input id="swal-quantidade" type="number" value="${registro.quantidade}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.lote")} <span class="text-red-500">*</span></label>
              <input id="swal-lote" value="${registro.lote}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("vacinas.validade")} <span class="text-red-500">*</span></label>
            <input id="swal-validade" type="date" value="${registro.validade}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
          </div>
        </div>
      `,
        confirmText: t("comum.salvar"),
        cancelText: t("comum.cancelar"),
        preConfirm: () => {
          const quantidade =
            parseInt(document.getElementById("swal-quantidade").value) || 0;
          const lote = document
            .getElementById("swal-lote")
            .value.trim()
            .toUpperCase();
          const validade = document.getElementById("swal-validade").value;

          if (!lote || !validade) {
            Swal.showValidationMessage(t("vacinas.modais.campos_obrigatorios"));
            return;
          }

          let status = "esgotado";
          if (quantidade > 10) status = "disponivel";
          else if (quantidade > 0) status = "critico";

          return { quantidade, lote, validade, status };
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const { quantidade, lote, validade, status } = result.value;
          setEstoque((prev) =>
            prev.map((e) =>
              e.id === registro.id
                ? { ...e, quantidade, lote, validade, status }
                : e,
            ),
          );
          Swal.fire({
            icon: "success",
            title: t("vacinas.modais.atualizado"),
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });
        }
      });
    },
    [showPremiumModal, t],
  );

  const arquivarRegistro = useCallback(
    (registro) => {
      Swal.fire({
        title: t("vacinas.modais.arquivar_titulo"),
        text: t("vacinas.modais.arquivar_texto", {
          lote: registro.lote,
          vacina: registro.vacina,
        }),
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
          setEstoque((prev) =>
            prev.map((e) =>
              e.id === registro.id ? { ...e, arquivado: true } : e,
            ),
          );
          Swal.fire({
            icon: "success",
            title: t("vacinas.modais.arquivado_sucesso"),
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

  const desarquivarRegistro = useCallback(
    (registro) => {
      setEstoque((prev) =>
        prev.map((e) =>
          e.id === registro.id ? { ...e, arquivado: false } : e,
        ),
      );
      Swal.fire({
        icon: "success",
        title: t("vacinas.modais.desarquivado_sucesso"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    },
    [t],
  );

  // ============================================================
  // EXPORTAÇÃO PDF (com i18n)
  // ============================================================
  const exportarRelatorio = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("vacinas.modais.sem_dados"),
        text: t("vacinas.modais.sem_dados_texto"),
        confirmButtonColor: "#1e293b",
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        },
      });
      return;
    }

    try {
      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(20);
      doc.setTextColor("#1e293b");
      doc.text(t("vacinas.pdf.titulo"), pageWidth / 2, 20, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setTextColor("#64748b");
      const dataStr = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(
        `${t("vacinas.pdf.gerado_em")}: ${dataStr}`,
        pageWidth - 20,
        28,
        { align: "right" },
      );
      doc.text(
        `${t("vacinas.pdf.total_registros")}: ${filteredData.length}`,
        20,
        28,
      );

      doc.setDrawColor("#cbd5e1");
      doc.line(20, 32, pageWidth - 20, 32);

      const headers = [
        t("vacinas.vacina"),
        t("vacinas.ubs"),
        t("vacinas.quantidade"),
        t("vacinas.lote"),
        t("vacinas.validade"),
        t("comum.status"),
      ];
      const rows = filteredData.map((e) => [
        e.vacina,
        e.ubs,
        e.quantidade.toString(),
        e.lote,
        e.validade,
        e.status === "disponivel"
          ? t("vacinas.status.disponivel")
          : e.status === "critico"
            ? t("vacinas.status.critico")
            : t("vacinas.status.esgotado"),
      ]);

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 38,
        theme: "striped",
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          lineColor: "#e2e8f0",
          lineWidth: 0.1,
          textColor: "#1e293b",
        },
        headStyles: {
          fillColor: "#1e293b",
          textColor: "#ffffff",
          fontStyle: "bold",
          halign: "center",
          fontSize: 9,
        },
        alternateRowStyles: { fillColor: "#f1f5f9" },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
        },
        margin: { left: 20, right: 20 },
        didDrawPage: function (data) {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(8);
          doc.setTextColor("#94a3b8");
          doc.text(
            `${t("vacinas.pdf.pagina")} ${currentPage} ${t("vacinas.pdf.de")} ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" },
          );
          doc.text(
            t("vacinas.pdf.rodape"),
            pageWidth - 20,
            doc.internal.pageSize.getHeight() - 10,
            { align: "right" },
          );
        },
      });

      doc.save(
        `relatorio_vacinas_${new Date().toISOString().slice(0, 10)}.pdf`,
      );

      Swal.fire({
        icon: "success",
        title: t("vacinas.modais.pdf_gerado"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("vacinas.modais.erro_pdf"),
        text: t("vacinas.modais.erro_pdf_texto"),
        confirmButtonColor: "#1e293b",
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        },
      });
    }
  }, [filteredData, t]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - padronizado com i18n */}
        <HeaderSection
          user={user}
          title={t("vacinas.titulo")}
          subtitle={t("vacinas.subtitulo")}
          icon={FaSyringe}
          t={t}
        />

        {/* Métricas - 4 cards */}
        <div className="flex flex-wrap gap-4">
          <MetricCard
            title={t("vacinas.metricas.total_lotes")}
            value={metrics.total}
            icon={HiClipboardList}
            color="blue"
            trend="up"
            trendValue="+5%"
            subtitle={t("vacinas.metricas.lotes")}
          />
          <MetricCard
            title={t("vacinas.metricas.doses_disponiveis")}
            value={metrics.totalDoses}
            icon={HiCheckCircle}
            color="green"
            trend="up"
            trendValue="+12%"
            subtitle={t("vacinas.metricas.doses")}
          />
          <MetricCard
            title={t("vacinas.metricas.criticos")}
            value={metrics.criticos}
            icon={HiExclamationCircle}
            color="amber"
            trend="down"
            trendValue="-8%"
            subtitle={t("vacinas.metricas.em_atencao")}
          />
          <MetricCard
            title={t("vacinas.metricas.esgotados")}
            value={metrics.esgotados}
            icon={HiXCircle}
            color="red"
            trend="up"
            trendValue="+3%"
            subtitle={t("vacinas.metricas.reposicao")}
          />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100/80 overflow-hidden backdrop-blur-sm">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterUBS={filterUBS}
            setFilterUBS={setFilterUBS}
            ubsList={ubsList}
            resetFilters={resetFilters}
            setCurrentPage={setCurrentPage}
            totalResults={filteredData.length}
            t={t}
          />
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden backdrop-blur-sm">
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
          ) : (
            <VacinacaoTable
              data={paginatedData}
              sortConfig={sortConfig}
              handleSort={handleSort}
              onVisualizar={visualizarRegistro}
              onEditar={editarRegistro}
              onArquivar={arquivarRegistro}
              onDesarquivar={desarquivarRegistro}
              t={t}
            />
          )}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              t={t}
            />
          )}
        </div>

        {/* Botões flutuantes */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <button
            onClick={novoLote}
            className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title={t("vacinas.novo_lote")}
          >
            <HiPlus size={24} />
          </button>
          <button
            onClick={exportarRelatorio}
            className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title={t("vacinas.exportar_pdf")}
          >
            <HiDocumentReport size={24} />
          </button>
        </div>

        {/* Rodapé */}
        <FooterSection t={t} />
      </div>
    </div>
  );
};

// ============================================================
// SUBCOMPONENTES (com i18n)
// ============================================================

const HeaderSection = ({ user, title, subtitle, icon: Icon, t }) => {
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
            <span className="text-white font-medium">
              {t("vacinas.abas.vacinas")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2">
            <Icon className="w-7 h-7" />
            {title}
          </h1>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
            <span>{subtitle}</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>{dataFormatada}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            {user?.nome?.charAt(0) || "A"}
          </div>
          <div className="text-white text-sm">
            <p className="font-medium">{user?.nome || "Admin"}</p>
            <p className="text-white/70 text-xs">Administrador</p>
          </div>
        </div>
      </div>
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
    </div>
  );
};

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterUBS,
  setFilterUBS,
  ubsList,
  resetFilters,
  setCurrentPage,
  totalResults,
  t,
}) => {
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const isFilterActive = filterStatus !== "todos" || filterUBS !== "todas";

  return (
    <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("vacinas.filtros.buscar")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={handleFilterChange(setFilterStatus)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          >
            <option value="todos">{t("vacinas.filtros.todos_status")}</option>
            <option value="disponivel">{t("vacinas.status.disponivel")}</option>
            <option value="critico">{t("vacinas.status.critico")}</option>
            <option value="esgotado">{t("vacinas.status.esgotado")}</option>
          </select>

          <select
            value={filterUBS}
            onChange={handleFilterChange(setFilterUBS)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          >
            {ubsList.map((ubs) => (
              <option key={ubs} value={ubs}>
                {ubs === "todas" ? t("vacinas.filtros.todas_ubs") : ubs}
              </option>
            ))}
          </select>

          {isFilterActive && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-sm text-blue-600 hover:bg-blue-50 transition font-medium"
            >
              {t("comum.limpar_filtros")}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <HiFilter className="w-4 h-4" />
        <span>
          <strong className="text-gray-700">{totalResults}</strong>{" "}
          {totalResults === 1 ? t("comum.registro") : t("comum.registros")}{" "}
          {totalResults === 1 ? t("comum.encontrado") : t("comum.encontrados")}
        </span>
        {isFilterActive && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {t("comum.filtros_ativos")}
          </span>
        )}
      </div>
    </div>
  );
};

const VacinacaoTable = ({
  data,
  sortConfig,
  handleSort,
  onVisualizar,
  onEditar,
  onArquivar,
  onDesarquivar,
  t,
}) => {
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return (
        <HiChevronDoubleLeft className="inline ml-1 text-gray-300 opacity-50" />
      );
    return sortConfig.direction === "asc" ? (
      <HiChevronDoubleLeft className="inline ml-1 text-blue-600 rotate-90" />
    ) : (
      <HiChevronDoubleLeft className="inline ml-1 text-blue-600 -rotate-90" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
          <FaSyringe className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">
          {t("vacinas.sem_dados")}
        </h3>
        <p className="text-gray-500 mt-1">{t("vacinas.sem_dados_texto")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("vacina")}
            >
              {t("vacinas.vacina")} {renderSortIcon("vacina")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("ubs")}
            >
              {t("vacinas.ubs")} {renderSortIcon("ubs")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("quantidade")}
            >
              {t("vacinas.quantidade")} {renderSortIcon("quantidade")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("vacinas.lote")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("vacinas.validade")}
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
          {data.map((registro) => {
            const isArquivado = registro.arquivado;
            return (
              <tr
                key={registro.id}
                className={`group hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer ${isArquivado ? "opacity-60" : ""}`}
                onClick={() => onVisualizar(registro)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar nome={registro.vacina} size="sm" />
                    <span className="font-medium text-gray-800 truncate max-w-[150px]">
                      {registro.vacina}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <HiOfficeBuilding className="text-blue-400" size={14} />
                    {registro.ubs}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`font-semibold ${registro.quantidade === 0 ? "text-rose-500" : "text-gray-800"}`}
                  >
                    {registro.quantidade}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                    {registro.lote}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {registro.validade}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={registro.status} t={t} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisualizar(registro);
                      }}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                      title={t("comum.visualizar")}
                    >
                      <HiEye size={16} />
                    </button>
                    {!isArquivado ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditar(registro);
                          }}
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 transition"
                          title={t("comum.editar")}
                        >
                          <HiPencil size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onArquivar(registro);
                          }}
                          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                          title={t("comum.arquivar")}
                        >
                          <HiArchive size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDesarquivar(registro);
                        }}
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
    <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
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
      <p>{t("vacinas.footer.clique_linha")}</p>
      <p className="mt-1">{t("vacinas.footer.copyright")}</p>
    </div>
  );
};

export default VacinacaoAdmin;
