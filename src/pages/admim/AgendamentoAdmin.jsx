// src/pages/AgendamentoAdmin.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  HiCalendar,
  HiClock,
  HiChartBar,
  HiPrinter,
  HiPlus,
  HiSearch,
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiFilter,
  HiSortAscending,
  HiSortDescending,
  HiArchive,
  HiArrowNarrowLeft,
  HiUser,
  HiHome,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiTrendingUp,
  HiTrendingDown,
} from "react-icons/hi";
import Swal from "sweetalert2";

// ============================================================
// DADOS MOCKADOS (mantidos)
// ============================================================
const medicosMock = [
  { id: 1, nome: "Dra. Ana Paula Costa", especialidade: "Clínica Geral" },
  { id: 2, nome: "Dr. Carlos Eduardo Silva", especialidade: "Cardiologia" },
  { id: 3, nome: "Dr. Paulo Roberto Lima", especialidade: "Pediatria" },
  { id: 4, nome: "Dra. Mariana Oliveira", especialidade: "Ginecologia" },
  { id: 5, nome: "Dr. João Mendes", especialidade: "Ortopedia" },
  { id: 6, nome: "Dra. Fernanda Rocha", especialidade: "Oftalmologia" },
  { id: 7, nome: "Dr. Ricardo Santos", especialidade: "Dermatologia" },
  { id: 8, nome: "Dra. Beatriz Lima", especialidade: "Neurologia" },
  { id: 9, nome: "Dr. André Freitas", especialidade: "Urologia" },
  { id: 10, nome: "Dra. Camila Duarte", especialidade: "Endocrinologia" },
  { id: 11, nome: "Dr. Gustavo Silva", especialidade: "Psiquiatria" },
  { id: 12, nome: "Dra. Patricia Gomes", especialidade: "Cardiologia" },
  { id: 13, nome: "Dr. Marcos Pereira", especialidade: "Ortopedia" },
  { id: 14, nome: "Dra. Larissa Mendes", especialidade: "Ginecologia" },
  { id: 15, nome: "Dr. Eduardo Campos", especialidade: "Clínica Geral" },
];

const statusOptions = ["Confirmado", "Pendente", "Cancelado", "Concluído"];

const generateAgendamentos = () => {
  const pacientes = [
    "Maria Silva",
    "José Santos",
    "Pedro Alves",
    "Carla Souza",
    "Fernanda Oliveira",
    "Roberto Nunes",
    "Juliana Castro",
    "Rafael Mendes",
    "Amanda Lima",
    "Bruno Costa",
    "Patrícia Santos",
    "Lucas Ferreira",
    "Mariana Rocha",
    "Tiago Oliveira",
    "Beatriz Almeida",
    "Gabriel Martins",
    "Isabela Nogueira",
    "Henrique Castro",
    "Camila Ferreira",
    "Rafaela Santos",
    "Eduardo Lima",
    "Marina Oliveira",
    "Thiago Pereira",
    "Letícia Costa",
    "André Souza",
    "Paula Mendes",
    "Felipe Rodrigues",
    "Carolina Alves",
    "Daniel Oliveira",
    "Vanessa Santos",
  ];

  const agendamentos = [];
  for (let i = 1; i <= 50; i++) {
    const medico = medicosMock[Math.floor(Math.random() * medicosMock.length)];
    const paciente = pacientes[Math.floor(Math.random() * pacientes.length)];
    const status =
      statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const ano = 2025;
    const data = `${dia}/${mes}/${ano}`;
    const hora = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60),
    ).padStart(2, "0")}`;
    agendamentos.push({
      id: i,
      paciente,
      medico: medico.nome,
      especialidade: medico.especialidade,
      data,
      horario: hora,
      status,
      observacoes: `Observação ${i}`,
      arquivado: false,
    });
  }
  return agendamentos;
};

const initialAgendamentos = generateAgendamentos();

// ============================================================
// COMPONENTES AUXILIARES (com tradução)
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
  const statusMap = {
    Confirmado: t("agendamento.status.confirmado"),
    Pendente: t("agendamento.status.pendente"),
    Cancelado: t("agendamento.status.cancelado"),
    Concluído: t("agendamento.status.concluido"),
  };

  const config = {
    Confirmado: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: HiCheckCircle,
    },
    Pendente: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      icon: HiClock,
    },
    Cancelado: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
      icon: HiXCircle,
    },
    Concluído: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      dot: "bg-sky-500",
      icon: HiCheckCircle,
    },
  };
  const {
    bg,
    text,
    border,
    dot,
    icon: Icon,
  } = config[status] || config.Pendente;
  const label = statusMap[status] || status;
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
  color,
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
const AgendamentoAdmin = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.role !== "admin")
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
          <p className="text-gray-600 mt-2">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );

  const [agendamentos, setAgendamentos] = useState(initialAgendamentos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterMedico, setFilterMedico] = useState("Todos");
  const [filterDate, setFilterDate] = useState("");
  const [filterArchive, setFilterArchive] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "data",
    direction: "asc",
  });
  const itemsPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    let result = agendamentos.filter((item) => {
      if (filterArchive === "arquivados" && !item.arquivado) return false;
      const matchSearch =
        item.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        filterStatus === "Todos" || item.status === filterStatus;
      const matchMedico =
        filterMedico === "Todos" || item.medico === filterMedico;
      const matchDate = filterDate === "" || item.data === filterDate;
      return matchSearch && matchStatus && matchMedico && matchDate;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "data") {
          const [diaA, mesA, anoA] = aVal.split("/");
          const [diaB, mesB, anoB] = bVal.split("/");
          aVal = new Date(`${anoA}-${mesA}-${diaA}`);
          bVal = new Date(`${anoB}-${mesB}-${diaB}`);
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [
    agendamentos,
    searchTerm,
    filterStatus,
    filterMedico,
    filterDate,
    filterArchive,
    sortConfig,
  ]);

  const metrics = useMemo(() => {
    const total = filteredData.length;
    const confirmados = filteredData.filter(
      (a) => a.status === "Confirmado",
    ).length;
    const pendentes = filteredData.filter(
      (a) => a.status === "Pendente",
    ).length;
    const cancelados = filteredData.filter(
      (a) => a.status === "Cancelado",
    ).length;
    const concluidos = filteredData.filter(
      (a) => a.status === "Concluído",
    ).length;
    const ocupacao = total > 0 ? Math.round((confirmados / total) * 100) : 0;
    const arquivados = agendamentos.filter((a) => a.arquivado).length;

    const trends = {
      total: { value: "+8%", type: "up" },
      confirmados: { value: "+12%", type: "up" },
      pendentes: { value: "-3%", type: "down" },
      cancelados: { value: "-5%", type: "down" },
      concluidos: { value: "+6%", type: "up" },
      ocupacao: { value: "+4%", type: "up" },
      arquivados: { value: "+2%", type: "up" },
    };

    return {
      total,
      confirmados,
      pendentes,
      cancelados,
      concluidos,
      ocupacao,
      arquivados,
      trends,
    };
  }, [filteredData, agendamentos]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setFilterStatus("Todos");
    setFilterMedico("Todos");
    setFilterDate("");
    setFilterArchive("todos");
    setCurrentPage(1);
  }, []);

  // ============================================================
  // MODAL AUXILIAR (com tradução)
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
  // HANDLERS CRUD (com tradução)
  // ============================================================

  const handleNovoAgendamento = () => {
    const medicoOptions = medicosMock
      .map(
        (m) =>
          `<option value="${m.nome}">${m.nome} - ${m.especialidade}</option>`,
      )
      .join("");

    showPremiumModal({
      title: t("agendamento.modais.novo"),
      html: `
        <div class="space-y-4 text-left">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.paciente")} <span class="text-red-500">*</span></label>
              <input id="swal-paciente" placeholder="${t("agendamento.modais.nome_completo")}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.medico")} <span class="text-red-500">*</span></label>
              <select id="swal-medico" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white">
                ${medicoOptions}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.data")} <span class="text-red-500">*</span></label>
              <input id="swal-data" type="date" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.horario")} <span class="text-red-500">*</span></label>
              <input id="swal-horario" type="time" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.modais.observacoes")}</label>
            <textarea id="swal-observacoes" rows="2" placeholder="${t("agendamento.modais.observacoes_placeholder")}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"></textarea>
          </div>
          <p class="text-xs text-gray-400">* ${t("agendamento.modais.campos_obrigatorios")}</p>
        </div>
      `,
      confirmText: t("agendamento.novo"),
      preConfirm: () => {
        const paciente = document.getElementById("swal-paciente").value.trim();
        const medico = document.getElementById("swal-medico").value;
        const data = document.getElementById("swal-data").value;
        const horario = document.getElementById("swal-horario").value;
        const observacoes = document
          .getElementById("swal-observacoes")
          .value.trim();

        if (!paciente || !medico || !data || !horario) {
          Swal.showValidationMessage(
            t("agendamento.modais.campos_obrigatorios"),
          );
          return;
        }

        const dataAtual = new Date();
        const dataSelecionada = new Date(data + "T" + horario);
        if (dataSelecionada < dataAtual) {
          Swal.showValidationMessage(t("agendamento.modais.data_passado"));
          return;
        }

        const medicoObj = medicosMock.find((m) => m.nome === medico);
        return {
          paciente,
          medico,
          especialidade: medicoObj ? medicoObj.especialidade : "",
          data: data.split("-").reverse().join("/"),
          horario,
          observacoes,
          status: "Pendente",
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const novo = { id: Date.now(), ...result.value, arquivado: false };
        setAgendamentos((prev) => [novo, ...prev]);
        Swal.fire({
          icon: "success",
          title: t("agendamento.modais.criado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleEditar = (agendamento) => {
    const medicoOptions = medicosMock
      .map(
        (m) =>
          `<option value="${m.nome}" ${m.nome === agendamento.medico ? "selected" : ""}>${m.nome} - ${
            m.especialidade
          }</option>`,
      )
      .join("");

    const statusOptionsHtml = statusOptions
      .map(
        (s) =>
          `<option value="${s}" ${s === agendamento.status ? "selected" : ""}>${t("agendamento.status." + s.toLowerCase())}</option>`,
      )
      .join("");

    showPremiumModal({
      title: t("agendamento.modais.editar"),
      html: `
        <div class="space-y-4 text-left">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.paciente")} <span class="text-red-500">*</span></label>
              <input id="swal-paciente" value="${agendamento.paciente}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.medico")} <span class="text-red-500">*</span></label>
              <select id="swal-medico" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white">
                ${medicoOptions}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.data")} <span class="text-red-500">*</span></label>
              <input id="swal-data" type="date" value="${agendamento.data.split("/").reverse().join("-")}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.tabela.horario")} <span class="text-red-500">*</span></label>
              <input id="swal-horario" type="time" value="${agendamento.horario}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("agendamento.modais.observacoes")}</label>
              <textarea id="swal-observacoes" rows="2" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none">${agendamento.observacoes || ""}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("comum.status")}</label>
              <select id="swal-status" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white">
                ${statusOptionsHtml}
              </select>
            </div>
          </div>
          <p class="text-xs text-gray-400">* ${t("agendamento.modais.campos_obrigatorios")}</p>
        </div>
      `,
      confirmText: t("comum.salvar"),
      preConfirm: () => {
        const paciente = document.getElementById("swal-paciente").value.trim();
        const medico = document.getElementById("swal-medico").value;
        const data = document.getElementById("swal-data").value;
        const horario = document.getElementById("swal-horario").value;
        const observacoes = document
          .getElementById("swal-observacoes")
          .value.trim();
        const status = document.getElementById("swal-status").value;

        if (!paciente || !medico || !data || !horario) {
          Swal.showValidationMessage(
            t("agendamento.modais.campos_obrigatorios"),
          );
          return;
        }

        const medicoObj = medicosMock.find((m) => m.nome === medico);
        return {
          paciente,
          medico,
          especialidade: medicoObj ? medicoObj.especialidade : "",
          data: data.split("-").reverse().join("/"),
          horario,
          observacoes,
          status,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === agendamento.id ? { ...a, ...result.value } : a,
          ),
        );
        Swal.fire({
          icon: "success",
          title: t("agendamento.modais.atualizado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleVisualizar = (agendamento) => {
    Swal.fire({
      title: t("agendamento.modais.visualizar", {
        paciente: agendamento.paciente,
      }),
      html: `
        <div class="text-left space-y-3 p-1">
          <div class="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div class="p-2.5 bg-blue-50 rounded-full"><HiUser class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="font-semibold text-gray-800 text-lg">${agendamento.paciente}</p>
              <p class="text-sm text-gray-500">ID: #${agendamento.id}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span class="text-gray-500">${t("agendamento.tabela.medico")}:</span> <span class="font-medium">${agendamento.medico}</span></div>
            <div><span class="text-gray-500">${t("agendamento.tabela.especialidade")}:</span> <span class="font-medium">${agendamento.especialidade}</span></div>
            <div><span class="text-gray-500">${t("agendamento.tabela.data")}:</span> <span class="font-medium">${agendamento.data}</span></div>
            <div><span class="text-gray-500">${t("agendamento.tabela.horario")}:</span> <span class="font-medium">${agendamento.horario}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("comum.status")}:</span> <span class="font-medium">${agendamento.status}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("agendamento.modais.observacoes")}:</span> <span class="font-medium">${agendamento.observacoes || t("agendamento.modais.nenhuma")}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("agendamento.modais.arquivado")}:</span> <span class="font-medium">${agendamento.arquivado ? t("comum.sim") : t("comum.nao")}</span></div>
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
  };

  const handleArquivar = (agendamento) => {
    Swal.fire({
      title: t("agendamento.modais.arquivar"),
      text: t("agendamento.modais.arquivar_texto", {
        paciente: agendamento.paciente,
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
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === agendamento.id ? { ...a, arquivado: true } : a,
          ),
        );
        Swal.fire({
          icon: "success",
          title: t("agendamento.modais.arquivado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleDesarquivar = (agendamento) => {
    Swal.fire({
      title: t("agendamento.modais.desarquivar"),
      text: t("agendamento.modais.desarquivar_texto", {
        paciente: agendamento.paciente,
      }),
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
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === agendamento.id ? { ...a, arquivado: false } : a,
          ),
        );
        Swal.fire({
          icon: "success",
          title: t("agendamento.modais.desarquivado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleExcluir = (agendamento) => {
    Swal.fire({
      title: t("agendamento.modais.excluir"),
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-600">${t("agendamento.modais.excluir_texto")} <strong>${agendamento.paciente}</strong>:</p>
          <input id="swal-senha" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" type="password" placeholder="${t("agendamento.modais.senha_autorizacao")}" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("comum.excluir"),
      cancelButtonText: t("comum.cancelar"),
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        confirmButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all",
        cancelButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
      },
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage(t("agendamento.modais.senha_incorreta"));
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setAgendamentos((prev) => prev.filter((a) => a.id !== agendamento.id));
        Swal.fire({
          icon: "success",
          title: t("agendamento.modais.excluido"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  // ============================================================
  // RELATÓRIO PDF (mantido)
  // ============================================================
  const handleRelatorio = async () => {
    if (filteredData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("comum.sem_dados"),
        text: t("agendamento.modais.sem_dados_relatorio"),
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
      const jspdfModule = await import("jspdf");
      await import("jspdf-autotable");
      const jsPDF = jspdfModule.default;

      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(20);
      doc.setTextColor("#1e293b");
      doc.text(t("agendamento.relatorio_titulo"), pageWidth / 2, 20, {
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
        `${t("agendamento.gerado_em")}: ${dataStr}`,
        pageWidth - 20,
        28,
        { align: "right" },
      );
      doc.text(
        `${t("agendamento.total_consultas")}: ${filteredData.length}`,
        20,
        28,
      );

      doc.setDrawColor("#cbd5e1");
      doc.line(20, 32, pageWidth - 20, 32);

      const headers = [
        t("agendamento.tabela.paciente"),
        t("agendamento.tabela.medico"),
        t("agendamento.tabela.especialidade"),
        t("agendamento.tabela.data"),
        t("agendamento.tabela.horario"),
        t("comum.status"),
        t("agendamento.modais.arquivado"),
      ];
      const rows = filteredData.map((a) => [
        a.paciente,
        a.medico,
        a.especialidade,
        a.data,
        a.horario,
        a.status,
        a.arquivado ? t("comum.sim") : t("comum.nao"),
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
        },
        headStyles: {
          fillColor: "#1e293b",
          textColor: "#fff",
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: { fillColor: "#f1f5f9" },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 30 },
          2: { cellWidth: 22 },
          3: { cellWidth: 18 },
          4: { cellWidth: 18 },
          5: { cellWidth: 20 },
          6: { cellWidth: 18 },
        },
        margin: { left: 20, right: 20 },
        didDrawPage: function (data) {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(8);
          doc.setTextColor("#94a3b8");
          doc.text(
            `${t("agendamento.pagina")} ${currentPage} ${t("agendamento.de")} ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" },
          );
          doc.text(
            "Minha UBS - Sistema de Gestão",
            pageWidth - 20,
            doc.internal.pageSize.getHeight() - 10,
            { align: "right" },
          );
        },
      });

      doc.save(
        `relatorio_agendamentos_${new Date().toISOString().slice(0, 10)}.pdf`,
      );

      Swal.fire({
        icon: "success",
        title: t("agendamento.pdf_gerado"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("comum.erro"),
        text: t("agendamento.modais.erro_pdf"),
        confirmButtonColor: "#1e293b",
        customClass: {
          popup: "rounded-3xl shadow-2xl border border-gray-100",
          confirmButton:
            "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        },
      });
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderSection user={user} t={t} />
        <MetricsGrid metrics={metrics} t={t} />
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden backdrop-blur-sm">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterMedico={filterMedico}
            setFilterMedico={setFilterMedico}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterArchive={filterArchive}
            setFilterArchive={setFilterArchive}
            resetFilters={resetFilters}
            setCurrentPage={setCurrentPage}
            totalResults={filteredData.length}
            t={t}
          />
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
            <AppointmentsTable
              data={paginatedData}
              sortConfig={sortConfig}
              handleSort={handleSort}
              handleVisualizar={handleVisualizar}
              handleEditar={handleEditar}
              handleArquivar={handleArquivar}
              handleDesarquivar={handleDesarquivar}
              handleExcluir={handleExcluir}
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
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <button
            onClick={handleNovoAgendamento}
            className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title={t("agendamento.novo")}
          >
            <HiPlus size={24} />
          </button>
          <button
            onClick={handleRelatorio}
            className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title={t("agendamento.relatorio")}
          >
            <HiPrinter size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUBCOMPONENTES (com tradução)
// ============================================================

const HeaderSection = ({ user, t }) => {
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
              {t("agendamento.abas.agendamentos")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2">
            <HiCalendar className="w-7 h-7" />
            {t("agendamento.titulo")}
          </h1>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
            <span>{t("agendamento.subtitulo")}</span>
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

const MetricsGrid = ({ metrics, t }) => {
  const cards = [
    {
      title: t("agendamento.metricas.total"),
      value: metrics.total,
      icon: HiCalendar,
      color: "blue",
      trend: metrics.trends.total.type,
      trendValue: metrics.trends.total.value,
      subtitle: t("agendamento.metricas.total_subtitle"),
    },
    {
      title: t("agendamento.metricas.confirmados"),
      value: metrics.confirmados,
      icon: HiCheckCircle,
      color: "green",
      trend: metrics.trends.confirmados.type,
      trendValue: metrics.trends.confirmados.value,
      subtitle: t("agendamento.metricas.confirmados_subtitle"),
    },
    {
      title: t("agendamento.metricas.pendentes"),
      value: metrics.pendentes,
      icon: HiClock,
      color: "amber",
      trend: metrics.trends.pendentes.type,
      trendValue: metrics.trends.pendentes.value,
      subtitle: t("agendamento.metricas.pendentes_subtitle"),
    },
    {
      title: t("agendamento.metricas.cancelados"),
      value: metrics.cancelados,
      icon: HiXCircle,
      color: "red",
      trend: metrics.trends.cancelados.type,
      trendValue: metrics.trends.cancelados.value,
      subtitle: t("agendamento.metricas.cancelados_subtitle"),
    },
    {
      title: t("agendamento.metricas.concluidos"),
      value: metrics.concluidos,
      icon: HiUsers,
      color: "teal",
      trend: metrics.trends.concluidos.type,
      trendValue: metrics.trends.concluidos.value,
      subtitle: t("agendamento.metricas.concluidos_subtitle"),
    },
    {
      title: t("agendamento.metricas.ocupacao"),
      value: `${metrics.ocupacao}%`,
      icon: HiChartBar,
      color: "indigo",
      trend: metrics.trends.ocupacao.type,
      trendValue: metrics.trends.ocupacao.value,
      subtitle: t("agendamento.metricas.ocupacao_subtitle"),
    },
    {
      title: t("agendamento.metricas.arquivados"),
      value: metrics.arquivados,
      icon: HiArchive,
      color: "gray",
      trend: metrics.trends.arquivados.type,
      trendValue: metrics.trends.arquivados.value,
      subtitle: t("agendamento.metricas.arquivados_subtitle"),
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

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterMedico,
  setFilterMedico,
  filterDate,
  setFilterDate,
  filterArchive,
  setFilterArchive,
  resetFilters,
  setCurrentPage,
  totalResults,
  t,
}) => {
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const isFilterActive =
    searchTerm ||
    filterStatus !== "Todos" ||
    filterMedico !== "Todos" ||
    filterDate ||
    filterArchive !== "todos";

  return (
    <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("agendamento.buscar")}
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
            <option value="Todos">{t("agendamento.filtros.status")}</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {t("agendamento.status." + s.toLowerCase())}
              </option>
            ))}
          </select>

          <select
            value={filterMedico}
            onChange={handleFilterChange(setFilterMedico)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          >
            <option value="Todos">{t("agendamento.filtros.medico")}</option>
            {medicosMock.map((m) => (
              <option key={m.id} value={m.nome}>
                {m.nome}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={handleFilterChange(setFilterDate)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
            />
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={filterArchive}
            onChange={handleFilterChange(setFilterArchive)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          >
            <option value="todos">{t("agendamento.filtros.todos")}</option>
            <option value="arquivados">
              {t("agendamento.filtros.arquivados")}
            </option>
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
          {totalResults === 1 ? t("comum.resultado") : t("comum.resultados")}{" "}
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

const AppointmentsTable = ({
  data,
  sortConfig,
  handleSort,
  handleVisualizar,
  handleEditar,
  handleArquivar,
  handleDesarquivar,
  handleExcluir,
  t,
}) => {
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <HiSortAscending className="inline ml-1 text-gray-300" />;
    return sortConfig.direction === "asc" ? (
      <HiSortAscending className="inline ml-1 text-blue-600" />
    ) : (
      <HiSortDescending className="inline ml-1 text-blue-600" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
          <HiCalendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">
          {t("agendamento.sem_dados")}
        </h3>
        <p className="text-gray-500 mt-1">{t("agendamento.sem_dados_texto")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("paciente")}
            >
              {t("agendamento.tabela.paciente")} {renderSortIcon("paciente")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("medico")}
            >
              {t("agendamento.tabela.medico")} {renderSortIcon("medico")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition hidden md:table-cell"
              onClick={() => handleSort("especialidade")}
            >
              {t("agendamento.tabela.especialidade")}{" "}
              {renderSortIcon("especialidade")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("data")}
            >
              {t("agendamento.tabela.data")} {renderSortIcon("data")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition hidden sm:table-cell"
              onClick={() => handleSort("horario")}
            >
              {t("agendamento.tabela.horario")} {renderSortIcon("horario")}
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
          {data.map((agendamento) => {
            const isArquivado = agendamento.arquivado;
            return (
              <tr
                key={agendamento.id}
                className={`group hover:bg-blue-50/50 transition-colors duration-200 ${isArquivado ? "opacity-60" : ""}`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar nome={agendamento.paciente} size="sm" />
                    <span className="font-medium text-gray-800 truncate max-w-[120px]">
                      {agendamento.paciente}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 truncate max-w-[120px]">
                  {agendamento.medico}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500 hidden md:table-cell">
                  {agendamento.especialidade}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {agendamento.data}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 hidden sm:table-cell">
                  {agendamento.horario}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={agendamento.status} t={t} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleVisualizar(agendamento)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                      title={t("comum.visualizar")}
                    >
                      <HiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditar(agendamento)}
                      className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 transition"
                      title={t("comum.editar")}
                    >
                      <HiPencil size={16} />
                    </button>
                    {!isArquivado ? (
                      <button
                        onClick={() => handleArquivar(agendamento)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        title={t("comum.arquivar")}
                      >
                        <HiArchive size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDesarquivar(agendamento)}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition"
                        title={t("comum.desarquivar")}
                      >
                        <HiArrowNarrowLeft size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleExcluir(agendamento)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                      title={t("comum.excluir")}
                    >
                      <HiTrash size={16} />
                    </button>
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

export default AgendamentoAdmin;
