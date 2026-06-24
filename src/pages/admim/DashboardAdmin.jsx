// src/pages/admim/DashboardAdmin.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import {
  HiUsers,
  HiClock,
  HiUserGroup,
  HiTrendingUp,
  HiTrendingDown,
  HiCalendar,
  HiClipboardList,
  HiDocumentText,
  HiCog,
  HiOfficeBuilding,
  HiChartBar,
  HiPlus,
  HiExclamation,
  HiCheckCircle,
  HiBell,
  HiHome,
  HiChevronDoubleLeft,
} from "react-icons/hi";

// ----------------------------- DADOS MOCK -----------------------------
const METRICAS = {
  aguardando: 24,
  variacao: "-12% em relação a ontem",
  mediaEspera: 18,
  percentualFila: 75,
  medicosAtivos: 8,
  capacidade: 80,
  satisfacaoMedia: 4.7,
  totalUBS: 12,
  totalUsuarios: 350,
  totalConsultasMes: 1240,
  taxaCancelamento: 3.2,
};

const FILA_MOCK = [
  {
    id: 1,
    nome: "Maria Oliveira",
    senha: "P-042",
    tempo: "5 min",
    status: "Chamando",
    prioridade: "Prioridade",
  },
  {
    id: 2,
    nome: "João dos Santos",
    senha: "G-108",
    tempo: "12 min",
    status: "Aguardando",
    prioridade: "Normal",
  },
  {
    id: 3,
    nome: "Ana Paula Souza",
    senha: "G-112",
    tempo: "8 min",
    status: "Aguardando",
    prioridade: "Normal",
  },
];

const UBS_RESUMO = [
  { id: 1, nome: "UBS Central", pacientes: 24, medicos: 4 },
  { id: 2, nome: "UBS Vila da Penha", pacientes: 18, medicos: 3 },
  { id: 3, nome: "UBS São Cristóvão", pacientes: 15, medicos: 2 },
];

const ATIVIDADES = [
  { acao: "Novo usuário cadastrado", tempo: "10 min atrás" },
  { acao: "Relatório de filas exportado", tempo: "1 hora atrás" },
  { acao: "Unidade UBS Norte sincronizada", tempo: "2 horas atrás" },
];

const ALERTAS = [
  { tipo: "demanda", mensagem: "Alta demanda na UBS Central (24 pacientes)" },
  { tipo: "estoque", mensagem: "Vacina Gripe vencendo em 30 dias" },
];

// ============================================================
// COMPONENTES REUTILIZÁVEIS (com tradução)
// ============================================================

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}) => {
  const colorMap = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
    },
    amber: {
      bg: "from-amber-500 to-amber-600",
      light: "bg-amber-50",
      text: "text-amber-600",
    },
    green: {
      bg: "from-emerald-500 to-emerald-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
    },
    teal: {
      bg: "from-teal-500 to-teal-600",
      light: "bg-teal-50",
      text: "text-teal-600",
    },
    indigo: {
      bg: "from-indigo-500 to-indigo-600",
      light: "bg-indigo-50",
      text: "text-indigo-600",
    },
    red: {
      bg: "from-rose-500 to-rose-600",
      light: "bg-rose-50",
      text: "text-rose-600",
    },
    slate: {
      bg: "from-slate-500 to-slate-700",
      light: "bg-slate-100",
      text: "text-slate-700",
    },
  };
  const { bg, light, text } = colorMap[color] || colorMap.blue;
  const isTrendUp = trend && !trend.includes("-");

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-1 group-hover:scale-105 transition-transform origin-left">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${bg} text-white shadow-lg group-hover:scale-110 transition`}
        >
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <p
          className={`text-xs font-medium mt-3 flex items-center gap-1 ${isTrendUp ? "text-emerald-600" : "text-rose-600"}`}
        >
          {isTrendUp ? (
            <HiTrendingUp size={14} />
          ) : (
            <HiTrendingDown size={14} />
          )}
          {trend}
        </p>
      )}
    </div>
  );
};

const FilaItem = ({ paciente, onChamar, t }) => {
  const isPrioridade = paciente.prioridade === "Prioridade";
  const isChamando = paciente.status === "Chamando";

  return (
    <div
      className={`p-4 rounded-xl transition-all hover:shadow-md flex items-center justify-between ${
        isPrioridade
          ? "bg-rose-50/80 border-l-4 border-rose-500"
          : "bg-gray-50/60 border-l-4 border-transparent"
      } ${isChamando ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-bold text-gray-800 truncate">{paciente.nome}</p>
          <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
            {paciente.senha}
          </span>
          {isPrioridade && (
            <span className="text-xs font-semibold bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full">
              {t("dashboard.filaAtendimento.prioridade")}
            </span>
          )}
          {isChamando && (
            <span className="text-xs font-semibold bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full animate-pulse">
              {t("dashboard.filaAtendimento.chamando")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span>{paciente.tempo}</span>
          <span>•</span>
          <span>{paciente.status}</span>
        </div>
      </div>
      <button
        onClick={() => onChamar(paciente)}
        className="ml-3 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md flex items-center gap-1 flex-shrink-0"
      >
        <HiCheckCircle size={16} /> {t("dashboard.filaAtendimento.chamar")}
      </button>
    </div>
  );
};

const UBSItem = ({ ubs, t }) => (
  <div className="p-4 bg-gray-50/60 rounded-xl flex items-center justify-between hover:bg-gray-100/60 transition border border-gray-100/60">
    <div className="flex items-center gap-3 min-w-0">
      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
        <HiOfficeBuilding size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-gray-800 truncate">{ubs.nome}</p>
        <p className="text-xs text-gray-500">
          {ubs.pacientes} {t("dashboard.ubs.pacientes")} • {ubs.medicos}{" "}
          {t("dashboard.ubs.medicos")}
        </p>
      </div>
    </div>
    <Link
      to="/filas-atendimento"
      className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 flex-shrink-0"
    >
      {t("dashboard.ubs.verFila")} <HiTrendingUp size={14} />
    </Link>
  </div>
);

const AtividadeItem = ({ atividade }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-gray-700 text-sm">{atividade.acao}</span>
    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
      {atividade.tempo}
    </span>
  </div>
);

const AlertaItem = ({ alerta }) => {
  const isDemanda = alerta.tipo === "demanda";
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl ${
        isDemanda
          ? "bg-rose-50/80 border border-rose-200"
          : "bg-amber-50/80 border border-amber-200"
      }`}
    >
      <HiExclamation
        className={`flex-shrink-0 mt-0.5 ${isDemanda ? "text-rose-600" : "text-amber-600"}`}
        size={20}
      />
      <span className="text-sm text-gray-700">{alerta.mensagem}</span>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const DashboardAdmin = () => {
  const { t } = useTranslation();
  const [fila, setFila] = useState(FILA_MOCK);
  const [ubsList, setUbsList] = useState(UBS_RESUMO);

  // Chamar paciente
  const handleChamarPaciente = (paciente) => {
    Swal.fire({
      title: t("dashboard.modais.chamarTitulo", { nome: paciente.nome }),
      text: t("dashboard.modais.chamarTexto", {
        senha: paciente.senha,
        prioridade: paciente.prioridade,
      }),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e293b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("dashboard.modais.chamarConfirmar"),
      cancelButtonText: t("dashboard.modais.chamarCancelar"),
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        confirmButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        cancelButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setFila((prev) =>
          prev.map((p) =>
            p.id === paciente.id ? { ...p, status: "Chamando" } : p,
          ),
        );
        Swal.fire({
          icon: "success",
          title: t("dashboard.modais.chamarSucesso"),
          text: t("dashboard.modais.chamarMensagem", { nome: paciente.nome }),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  // Adicionar UBS
  const handleAdicionarUBS = () => {
    Swal.fire({
      title: t("dashboard.modais.adicionarUBSTitulo"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("dashboard.modais.adicionarUBSNome")} <span class="text-red-500">*</span></label>
            <input id="swal-nome" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="Ex: UBS Jardim" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("dashboard.modais.adicionarUBSPacientes")}</label>
              <input id="swal-pacientes" type="number" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("dashboard.modais.adicionarUBSMedicos")}</label>
              <input id="swal-medicos" type="number" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="0" />
            </div>
          </div>
          <p class="text-xs text-gray-400">* Campos obrigatórios</p>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#1e293b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("comum.adicionar"),
      cancelButtonText: t("comum.cancelar"),
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        confirmButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        cancelButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
      },
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value.trim();
        const pacientes =
          parseInt(document.getElementById("swal-pacientes").value) || 0;
        const medicos =
          parseInt(document.getElementById("swal-medicos").value) || 0;
        if (!nome) {
          Swal.showValidationMessage("O nome é obrigatório");
          return;
        }
        return { nome, pacientes, medicos };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { nome, pacientes, medicos } = result.value;
        const novaUBS = { id: Date.now(), nome, pacientes, medicos };
        setUbsList((prev) => [...prev, novaUBS]);
        Swal.fire({
          icon: "success",
          title: t("dashboard.modais.adicionarUBSSucesso"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // Relatório PDF
  const gerarRelatorioPDF = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: RelatorioPDF } =
        await import("../../components/RelatorioPDF");
      const dadosRelatorio = {
        fila,
        aguardando: METRICAS.aguardando,
        mediaEspera: METRICAS.mediaEspera,
      };
      const blob = await pdf(<RelatorioPDF dados={dadosRelatorio} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio_ubs_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      Swal.fire({
        icon: "success",
        title: "Relatório gerado!",
        text: "O PDF foi baixado com sucesso.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("dashboard.modais.erro"),
        text: t("dashboard.modais.erroRelatorio"),
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
  // HEADER SECTION
  // ============================================================
  const HeaderSection = ({ user, title, subtitle, icon: Icon }) => {
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
                {t("dashboard.abas.administrativo")}
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

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderSection
          user={{ nome: "" }}
          title={t("dashboard.titulo")}
          subtitle={t("dashboard.subtitulo")}
          icon={HiUsers}
        />

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t("dashboard.metricas.aguardando")}
            value={METRICAS.aguardando}
            trend={METRICAS.variacao}
            icon={HiUsers}
            color="blue"
          />
          <MetricCard
            title={t("dashboard.metricas.mediaEspera")}
            value={`${METRICAS.mediaEspera}min`}
            subtitle={`${t("dashboard.metricas.fila")} ${METRICAS.percentualFila}%`}
            icon={HiClock}
            color="amber"
          />
          <MetricCard
            title={t("dashboard.metricas.medicosAtivos")}
            value={`${METRICAS.medicosAtivos}/10`}
            subtitle={`${t("dashboard.metricas.capacidade")} ${METRICAS.capacidade}%`}
            icon={HiUserGroup}
            color="green"
          />
          <MetricCard
            title={t("dashboard.metricas.satisfacao")}
            value={METRICAS.satisfacaoMedia}
            subtitle={t("dashboard.metricas.excelente")}
            icon={HiTrendingUp}
            color="teal"
          />
        </div>

        {/* GRÁFICO + RESUMO */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiChartBar className="text-blue-600" />{" "}
              {t("dashboard.grafico.titulo")}
            </h2>
            <div className="h-44 flex items-end gap-1.5 px-1">
              {[40, 55, 70, 95, 80, 60, 30, 45, 65, 85, 50, 35].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:opacity-80 transition transform origin-bottom hover:scale-y-105 relative group"
                  style={{ height: `${v}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {v}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>08h</span>
              <span>09h</span>
              <span>10h</span>
              <span>11h</span>
              <span>12h</span>
              <span>13h</span>
              <span>14h</span>
              <span>15h</span>
              <span>16h</span>
              <span>17h</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("dashboard.resumo.titulo")}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">
                  {t("dashboard.resumo.totalUBS")}
                </span>
                <span className="font-bold text-gray-800">
                  {METRICAS.totalUBS}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">
                  {t("dashboard.resumo.usuarios")}
                </span>
                <span className="font-bold text-gray-800">
                  {METRICAS.totalUsuarios}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">
                  {t("dashboard.resumo.consultas")}
                </span>
                <span className="font-bold text-gray-800">
                  {METRICAS.totalConsultasMes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {t("dashboard.resumo.cancelamento")}
                </span>
                <span className="font-bold text-rose-600">
                  {METRICAS.taxaCancelamento}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FILA e UBS */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <HiClipboardList className="text-blue-600" />{" "}
                {t("dashboard.filaAtendimento.titulo")}
              </h2>
              <Link
                to="/filas-atendimento"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {t("dashboard.filaAtendimento.verTodas")}
              </Link>
            </div>
            <div className="space-y-3">
              {fila.map((p) => (
                <FilaItem
                  key={p.id}
                  paciente={p}
                  onChamar={handleChamarPaciente}
                  t={t}
                />
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <HiOfficeBuilding className="text-blue-600" />{" "}
                {t("dashboard.ubs.titulo")}
              </h2>
              <Link
                to="/configuracoes"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {t("dashboard.ubs.gerenciar")}
              </Link>
            </div>
            <div className="space-y-3">
              {ubsList.map((ubs) => (
                <UBSItem key={ubs.id} ubs={ubs} t={t} />
              ))}
            </div>
            <button
              onClick={handleAdicionarUBS}
              className="w-full mt-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50/70 transition flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-600"
            >
              <HiPlus size={18} /> {t("dashboard.ubs.adicionar")}
            </button>
          </div>
        </div>

        {/* ACESSO RÁPIDO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/agendamento"
            className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-blue-500/30">
              <HiCalendar size={28} className="text-white" />
            </div>
            <span className="font-medium text-sm text-gray-700">
              {t("dashboard.acessoRapido.agendamentos")}
            </span>
          </Link>
          <Link
            to="/filas-atendimento"
            className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <HiClipboardList size={28} className="text-white" />
            </div>
            <span className="font-medium text-sm text-gray-700">
              {t("dashboard.acessoRapido.gerenciarFilas")}
            </span>
          </Link>
          <Link
            to="/vacinação"
            className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <HiChartBar size={28} className="text-white" />
            </div>
            <span className="font-medium text-sm text-gray-700">
              {t("dashboard.acessoRapido.estoqueVacinas")}
            </span>
          </Link>
          <Link
            to="/configuracoes"
            className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-amber-500/30">
              <HiCog size={28} className="text-white" />
            </div>
            <span className="font-medium text-sm text-gray-700">
              {t("dashboard.acessoRapido.configuracoes")}
            </span>
          </Link>
        </div>

        {/* ATIVIDADES e ALERTAS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiBell className="text-blue-600" />{" "}
              {t("dashboard.atividades.titulo")}
            </h2>
            <div className="space-y-1">
              {ATIVIDADES.map((a, i) => (
                <AtividadeItem key={i} atividade={a} />
              ))}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6 hover:shadow-2xl transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiExclamation className="text-amber-600" />{" "}
              {t("dashboard.alertas.titulo")}
            </h2>
            <div className="space-y-3">
              {ALERTAS.map((a, i) => (
                <AlertaItem key={i} alerta={a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
