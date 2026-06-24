// src/pages/admim/HistoricoMedicoAdmin.jsx - Versão padronizada com filtros, design consistente e i18n
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  HiSearch,
  HiClipboardList,
  HiEye,
  HiPencil,
  HiTrash,
  HiX,
  HiArchive,
  HiRefresh,
  HiFilter,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiHome,
  HiDocumentText,
  HiUsers,
  HiCheckCircle,
  HiTrendingUp,
  HiTrendingDown,
  HiChartPie,
  HiAnnotation,
  HiCalendar,
  HiUser,
  HiOfficeBuilding,
  HiAcademicCap,
} from "react-icons/hi";
import { FaStethoscope } from "react-icons/fa";
import Swal from "sweetalert2";

// ============================================================
// DADOS MOCK - 50 REGISTROS COMPLETOS (mantidos)
// ============================================================
const generateRegistros = () => {
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
    "Diego Souza",
    "Bruna Lima",
    "Lucas Santos",
    "Amanda Oliveira",
    "Ricardo Pereira",
    "Fernanda Costa",
    "João Silva",
    "Mariana Santos",
    "Carlos Oliveira",
    "Patrícia Lima",
    "Roberto Santos",
    "Cristina Oliveira",
    "Paulo Souza",
    "Renata Lima",
    "Marcos Silva",
  ];

  const medicos = [
    "Dr. Ricardo Silva",
    "Dra. Ana Costa",
    "Dr. João Mendes",
    "Dra. Beatriz Lima",
    "Dr. Carlos Eduardo",
    "Dra. Patricia Gomes",
    "Dr. Marcos Pereira",
    "Dra. Fernanda Rocha",
    "Dr. Gustavo Silva",
    "Dra. Vanessa Almeida",
    "Dr. Anderson Freitas",
    "Dra. Camila Duarte",
    "Dr. Eduardo Campos",
    "Dra. Juliana Mendes",
    "Dr. Renato Silva",
    "Dra. Larissa Mendes",
    "Dr. Fábio Rocha",
    "Dr. Lucas Santos",
    "Dra. Mariana Oliveira",
    "Dr. Paulo Santos",
  ];

  const especialidades = [
    "Clínico Geral",
    "Pediatria",
    "Ortopedia",
    "Cardiologia",
    "Dermatologia",
    "Ginecologia",
    "Neurologia",
    "Oftalmologia",
    "Psiquiatria",
    "Endocrinologia",
    "Urologia",
    "Otorrinolaringologia",
    "Reumatologia",
    "Geriatria",
    "Hematologia",
    "Nefrologia",
    "Pneumologia",
    "Oncologia",
    "Infectologia",
    "Alergologia",
  ];

  const ubsList = [
    "UBS Central",
    "UBS Vila Mariana",
    "UPA Central",
    "UBS Sul",
    "UBS Leste",
    "UBS Oeste",
    "UBS Norte",
    "UBS Jardim Paulista",
    "UBS Mooca",
    "UBS Tatuapé",
    "UBS Saúde",
    "UBS Vila Olímpia",
    "UBS Butantã",
    "UBS Pinheiros",
    "UBS Faria Lima",
  ];

  const diagnosticos = [
    "Gripe Sazonal",
    "Check-up Rotina",
    "Entorse Tornozelo",
    "Hipertensão Leve",
    "Dermatite Atópica",
    "Cisto Ovariano",
    "Enxaqueca Crônica",
    "Miopia",
    "Ansiedade Generalizada",
    "Diabetes Tipo 2",
    "Infecção Urinária",
    "Varicela",
    "Fratura de Punho",
    "Arritmia Cardíaca",
    "Hipertensão Arterial",
    "Astigmatismo",
    "Endometriose",
    "Taquicardia Sinusal",
    "Infecção de Garganta",
    "Otite Média",
    "Bursite no Ombro",
    "Acne Vulgar",
    "Cefaleia Tensional",
    "Hipotireoidismo",
    "Litíase Renal",
    "Depressão",
    "Osteoporose",
    "Alergia Alimentar",
    "Bronquite Aguda",
    "Sinusite",
    "Tendinite",
    "Conjuntivite",
    "Gastrite",
    "Fibromialgia",
    "Artrite",
    "Cálculo Renal",
    "Hérnia de Disco",
    "Transtorno Bipolar",
    "Eczema",
    "Psoríase",
  ];

  const observacoes = [
    "Paciente relatou dor intensa",
    "Retorno em 30 dias",
    "Encaminhar para especialista",
    "Exames complementares solicitados",
    "Paciente com histórico familiar",
    "Necessita acompanhamento",
    "Sintomas persistentes",
    "Melhora significativa",
    "Manter medicação",
    "Alta médica",
    "Repouso recomendado",
    "Fisioterapia indicada",
    "Cirurgia agendada",
    "Exames normais",
    "Aguardando biópsia",
    "Tratamento em andamento",
    "Evolução favorável",
    "Paciente assintomático",
    "Necessita avaliação cardiológica",
    "Encaminhar para neurologia",
  ];

  const registros = [];
  const hoje = new Date();

  for (let i = 1; i <= 50; i++) {
    const paciente = pacientes[i % pacientes.length];
    const medico = medicos[i % medicos.length];
    const especialidade = especialidades[i % especialidades.length];
    const ubs = ubsList[i % ubsList.length];
    const diagnostico = diagnosticos[i % diagnosticos.length];
    const observacao = observacoes[i % observacoes.length];

    const data = new Date(hoje);
    data.setDate(data.getDate() - Math.floor(Math.random() * 730));
    const dataStr = data.toLocaleDateString("pt-BR");

    const arquivado = Math.random() < 0.2;

    registros.push({
      id: i,
      paciente,
      data: dataStr,
      medico,
      especialidade,
      ubs,
      diagnostico,
      observacao,
      arquivado,
      dataArquivo: arquivado
        ? new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("pt-BR")
        : null,
    });
  }

  registros.sort((a, b) => {
    const [diaA, mesA, anoA] = a.data.split("/");
    const [diaB, mesB, anoB] = b.data.split("/");
    return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
  });

  return registros;
};

// ============================================================
// COMPONENTES REUTILIZÁVEIS (padronizados com i18n)
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

const StatusBadge = ({ arquivado, t }) => {
  if (arquivado) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
        <HiArchive size={12} className="opacity-70" />
        {t("comum.arquivado")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {t("comum.ativo")}
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
const HistoricoMedicoAdmin = () => {
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

  const [registros, setRegistros] = useState(generateRegistros);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterEspecialidade, setFilterEspecialidade] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "data",
    direction: "desc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const especialidades = useMemo(() => {
    const unicas = [...new Set(registros.map((r) => r.especialidade))];
    return ["todas", ...unicas];
  }, [registros]);

  const filteredData = useMemo(() => {
    let result = registros;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.paciente.toLowerCase().includes(term) ||
          r.medico.toLowerCase().includes(term) ||
          r.especialidade.toLowerCase().includes(term) ||
          r.diagnostico.toLowerCase().includes(term) ||
          r.ubs.toLowerCase().includes(term) ||
          (r.observacao && r.observacao.toLowerCase().includes(term)),
      );
    }

    if (filterStatus === "ativos") {
      result = result.filter((r) => !r.arquivado);
    } else if (filterStatus === "arquivados") {
      result = result.filter((r) => r.arquivado);
    }

    if (filterEspecialidade !== "todas") {
      result = result.filter((r) => r.especialidade === filterEspecialidade);
    }

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
  }, [registros, searchTerm, filterStatus, filterEspecialidade, sortConfig]);

  const metrics = useMemo(() => {
    const total = filteredData.length;
    const ativos = registros.filter((r) => !r.arquivado).length;
    const arquivados = registros.filter((r) => r.arquivado).length;
    const especialidadesUnicas = [
      ...new Set(registros.map((r) => r.especialidade)),
    ].length;

    return {
      total,
      ativos,
      arquivados,
      especialidadesUnicas,
    };
  }, [registros]);

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
    setFilterStatus("todos");
    setFilterEspecialidade("todas");
    setCurrentPage(1);
  }, []);

  // ============================================================
  // MODAL PREMIUM (padronizado com i18n)
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
      Swal.fire({
        title: `<span style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">📋 ${t("historico.modais.visualizar_titulo")} ${registro.paciente}</span>`,
        html: `
        <div class="text-left space-y-3 p-1">
          <div class="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div class="p-2.5 bg-blue-50 rounded-full"><HiClipboardList class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="font-semibold text-gray-800 text-lg">${registro.paciente}</p>
              <p class="text-sm text-gray-500">ID: #${registro.id}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><span class="text-gray-500">${t("historico.tabela.medico")}:</span> <span class="font-medium">${registro.medico}</span></div>
            <div><span class="text-gray-500">${t("historico.tabela.especialidade")}:</span> <span class="font-medium">${registro.especialidade}</span></div>
            <div><span class="text-gray-500">${t("historico.tabela.data")}:</span> <span class="font-medium">${registro.data}</span></div>
            <div><span class="text-gray-500">${t("historico.tabela.ubs")}:</span> <span class="font-medium">${registro.ubs}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("historico.tabela.diagnostico")}:</span> <span class="font-medium text-blue-600">${registro.diagnostico}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("historico.modais.observacoes")}:</span> <span class="font-medium">${registro.observacao || t("historico.modais.nenhuma_observacao")}</span></div>
            <div class="col-span-2"><span class="text-gray-500">${t("comum.status")}:</span> <span class="font-medium">${registro.arquivado ? `📦 ${t("comum.arquivado")}` : `✅ ${t("comum.ativo")}`}</span></div>
            ${registro.dataArquivo ? `<div class="col-span-2"><span class="text-gray-500">${t("historico.modais.data_arquivamento")}:</span> <span class="font-medium">${registro.dataArquivo}</span></div>` : ""}
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

  const editarRegistro = useCallback(
    (registro) => {
      showPremiumModal({
        title: t("historico.modais.editar_titulo"),
        html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("historico.tabela.paciente")}</label>
            <input id="swal-paciente" value="${registro.paciente}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("historico.tabela.diagnostico")} <span class="text-red-500">*</span></label>
            <input id="swal-diagnostico" value="${registro.diagnostico}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("historico.modais.observacoes")}</label>
            <textarea id="swal-observacao" rows="3" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" style="resize: none;">${registro.observacao || ""}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("historico.tabela.data")}</label>
            <input id="swal-data" value="${registro.data}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50" disabled />
          </div>
        </div>
      `,
        confirmText: t("comum.salvar"),
        cancelText: t("comum.cancelar"),
        preConfirm: () => {
          const diagnostico = document
            .getElementById("swal-diagnostico")
            .value.trim();
          if (!diagnostico) {
            Swal.showValidationMessage(
              t("historico.modais.diagnostico_obrigatorio"),
            );
            return;
          }
          const observacao = document
            .getElementById("swal-observacao")
            .value.trim();
          return { diagnostico, observacao };
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          setRegistros((prev) =>
            prev.map((r) =>
              r.id === registro.id
                ? {
                    ...r,
                    diagnostico: result.value.diagnostico,
                    observacao: result.value.observacao,
                  }
                : r,
            ),
          );
          Swal.fire({
            icon: "success",
            title: t("historico.modais.sucesso_editar"),
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
        title: t("historico.modais.arquivar_titulo"),
        text: t("historico.modais.arquivar_texto", {
          paciente: registro.paciente,
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
          setRegistros((prev) =>
            prev.map((r) =>
              r.id === registro.id
                ? {
                    ...r,
                    arquivado: true,
                    dataArquivo: new Date().toLocaleDateString("pt-BR"),
                  }
                : r,
            ),
          );
          Swal.fire({
            icon: "success",
            title: t("historico.modais.sucesso_arquivar"),
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
      setRegistros((prev) =>
        prev.map((r) =>
          r.id === registro.id
            ? { ...r, arquivado: false, dataArquivo: null }
            : r,
        ),
      );
      Swal.fire({
        icon: "success",
        title: t("historico.modais.sucesso_desarquivar"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    },
    [t],
  );

  const excluirRegistro = useCallback(
    (registro) => {
      Swal.fire({
        title: t("historico.modais.excluir_titulo"),
        html: `
        <div class="text-left space-y-3">
          <p class="text-gray-600">${t("historico.modais.excluir_texto")} <strong>${registro.paciente}</strong>:</p>
          <input id="swal-senha" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" type="password" placeholder="${t("historico.modais.senha_autorizacao")}" />
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
            Swal.showValidationMessage(t("historico.modais.senha_incorreta"));
            return false;
          }
          return true;
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          setRegistros((prev) => prev.filter((r) => r.id !== registro.id));
          Swal.fire({
            icon: "success",
            title: t("historico.modais.sucesso_excluir"),
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

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderSection
          user={user}
          title={t("historico.titulo")}
          subtitle={t("historico.subtitulo")}
          icon={FaStethoscope}
          t={t}
        />

        <div className="flex flex-wrap gap-4">
          <MetricCard
            title={t("historico.metricas.total")}
            value={metrics.total}
            icon={HiClipboardList}
            color="blue"
            trend="up"
            trendValue="+12%"
            subtitle={t("historico.metricas.consultas")}
          />
          <MetricCard
            title={t("historico.metricas.ativos")}
            value={metrics.ativos}
            icon={HiCheckCircle}
            color="green"
            trend="up"
            trendValue="+8%"
            subtitle={t("historico.metricas.ativos_sub")}
          />
          <MetricCard
            title={t("historico.metricas.arquivados")}
            value={metrics.arquivados}
            icon={HiArchive}
            color="gray"
            trend="down"
            trendValue="-3%"
            subtitle={t("historico.metricas.arquivados_sub")}
          />
          <MetricCard
            title={t("historico.metricas.especialidades")}
            value={metrics.especialidadesUnicas}
            icon={HiChartPie}
            color="purple"
            trend="up"
            trendValue="+2"
            subtitle={t("historico.metricas.especialidades_sub")}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100/80 overflow-hidden backdrop-blur-sm">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterEspecialidade={filterEspecialidade}
            setFilterEspecialidade={setFilterEspecialidade}
            especialidades={especialidades}
            resetFilters={resetFilters}
            setCurrentPage={setCurrentPage}
            totalResults={filteredData.length}
            t={t}
          />
        </div>

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
            <HistoricoTable
              data={paginatedData}
              sortConfig={sortConfig}
              handleSort={handleSort}
              onVisualizar={visualizarRegistro}
              onEditar={editarRegistro}
              onArquivar={arquivarRegistro}
              onDesarquivar={desarquivarRegistro}
              onExcluir={excluirRegistro}
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
              {t("historico.abas.historico")}
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
  filterEspecialidade,
  setFilterEspecialidade,
  especialidades,
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
    filterStatus !== "todos" || filterEspecialidade !== "todas";

  return (
    <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("historico.filtros.buscar")}
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
            <option value="todos">{t("historico.filtros.todos")}</option>
            <option value="ativos">{t("historico.filtros.ativos")}</option>
            <option value="arquivados">
              {t("historico.filtros.arquivados")}
            </option>
          </select>

          <select
            value={filterEspecialidade}
            onChange={handleFilterChange(setFilterEspecialidade)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
          >
            {especialidades.map((esp) => (
              <option key={esp} value={esp}>
                {esp === "todas"
                  ? t("historico.filtros.todas_especialidades")
                  : esp}
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

const HistoricoTable = ({
  data,
  sortConfig,
  handleSort,
  onVisualizar,
  onEditar,
  onArquivar,
  onDesarquivar,
  onExcluir,
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
          <HiClipboardList className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">
          {t("historico.sem_dados")}
        </h3>
        <p className="text-gray-500 mt-1">{t("historico.sem_dados_texto")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition"
              onClick={() => handleSort("paciente")}
            >
              {t("historico.tabela.paciente")} {renderSortIcon("paciente")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition hidden sm:table-cell"
              onClick={() => handleSort("data")}
            >
              {t("historico.tabela.data")} {renderSortIcon("data")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              {t("historico.tabela.medico")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              {t("historico.tabela.especialidade")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("historico.tabela.diagnostico")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">
              {t("historico.tabela.observacao")}
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
                    <Avatar nome={registro.paciente} size="sm" />
                    <span className="font-medium text-gray-800 truncate max-w-[120px]">
                      {registro.paciente}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 hidden sm:table-cell">
                  {registro.data}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700 hidden md:table-cell truncate max-w-[120px]">
                  {registro.medico}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-500 hidden lg:table-cell">
                  {registro.especialidade}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {registro.diagnostico}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm hidden xl:table-cell truncate max-w-[150px]">
                  {registro.observacao ? (
                    <span className="flex items-center gap-1">
                      <HiAnnotation className="text-gray-400" size={14} />
                      {registro.observacao}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge arquivado={isArquivado} t={t} />
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExcluir(registro);
                      }}
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

const FooterSection = ({ t }) => {
  return (
    <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
      <p>{t("historico.footer.clique_linha")}</p>
      <p className="mt-1">© 2025 {t("historico.footer.titulo")}</p>
    </div>
  );
};

export default HistoricoMedicoAdmin;
