// src/pages/admim/DashboardAdmin.jsx
import { useState, useEffect, useCallback } from "react";
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
import { filasService } from "../../services/filasService";
import { consultasService } from "../../services/consultasService";
import { ubsService } from "../../services/ubsService";
import { authService } from "../../services/authService";

// ============================================================
// COMPONENTES REUTILIZÁVEIS (mantidos iguais ao original)
// ============================================================

const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend }) => {
  const colorMap = {
    blue: { bg: "from-blue-500 to-blue-600", light: "bg-blue-50", text: "text-blue-600" },
    amber: { bg: "from-amber-500 to-amber-600", light: "bg-amber-50", text: "text-amber-600" },
    green: { bg: "from-emerald-500 to-emerald-600", light: "bg-emerald-50", text: "text-emerald-600" },
    teal: { bg: "from-teal-500 to-teal-600", light: "bg-teal-50", text: "text-teal-600" },
    indigo: { bg: "from-indigo-500 to-indigo-600", light: "bg-indigo-50", text: "text-indigo-600" },
    red: { bg: "from-rose-500 to-rose-600", light: "bg-rose-50", text: "text-rose-600" },
    slate: { bg: "from-slate-500 to-slate-700", light: "bg-slate-100", text: "text-slate-700" },
  };
  const { bg, light, text } = colorMap[color] || colorMap.blue;
  const isTrendUp = trend && !trend.includes("-");

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1 group-hover:scale-105 transition-transform origin-left">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${bg} text-white shadow-lg group-hover:scale-110 transition`}>
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <p className={`text-xs font-medium mt-3 flex items-center gap-1 ${isTrendUp ? "text-emerald-600" : "text-rose-600"}`}>
          {isTrendUp ? <HiTrendingUp size={14} /> : <HiTrendingDown size={14} />}
          {trend}
        </p>
      )}
    </div>
  );
};

const FilaItem = ({ paciente, onChamar, t }) => {
  const isPrioridade = paciente.prioridade === "Prioridade" || paciente.prioridade === "Alta";
  const isChamando = paciente.status === "Chamando" || paciente.status === "Em Atendimento";

  return (
    <div className={`p-4 rounded-xl transition-all hover:shadow-md flex items-center justify-between ${
      isPrioridade ? "bg-rose-50/80 border-l-4 border-rose-500" : "bg-gray-50/60 border-l-4 border-transparent"
    } ${isChamando ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-bold text-gray-800 truncate">{paciente.paciente || paciente.nome}</p>
          <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">{paciente.senha}</span>
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
          <span>{paciente.especialidade}</span>
          <span>•</span>
          <span>{paciente.ubs || "UBS Central"}</span>
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

const UBSItem = ({ ubs, pacientes, medicos, t }) => (
  <div className="p-4 bg-gray-50/60 rounded-xl flex items-center justify-between hover:bg-gray-100/60 transition border border-gray-100/60">
    <div className="flex items-center gap-3 min-w-0">
      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
        <HiOfficeBuilding size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-gray-800 truncate">{ubs.nome}</p>
        <p className="text-xs text-gray-500">
          {pacientes} {t("dashboard.ubs.pacientes")} • {medicos} {t("dashboard.ubs.medicos")}
        </p>
      </div>
    </div>
    <Link to="/filas-atendimento" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 flex-shrink-0">
      {t("dashboard.ubs.verFila")} <HiTrendingUp size={14} />
    </Link>
  </div>
);

const AtividadeItem = ({ atividade }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-gray-700 text-sm">{atividade.acao}</span>
    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{atividade.tempo}</span>
  </div>
);

const AlertaItem = ({ alerta }) => {
  const isDemanda = alerta.tipo === "demanda";
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${
      isDemanda ? "bg-rose-50/80 border border-rose-200" : "bg-amber-50/80 border border-amber-200"
    }`}>
      <HiExclamation className={`flex-shrink-0 mt-0.5 ${isDemanda ? "text-rose-600" : "text-amber-600"}`} size={20} />
      <span className="text-sm text-gray-700">{alerta.mensagem}</span>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const DashboardAdmin = () => {
  const { t } = useTranslation();

  // Estados com dados reais do banco
  const [fila, setFila] = useState([]);
  const [ubsList, setUbsList] = useState([]);
  const [metricas, setMetricas] = useState({
    aguardando: 0,
    mediaEspera: 0,
    medicosAtivos: 7,
    totalUBS: 0,
    totalUsuarios: 0,
    totalConsultasMes: 0,
    taxaCancelamento: 0,
  });
  const [atividades, setAtividades] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega todos os dados do banco
  const carregarDados = useCallback(async () => {
    try {
      // Filas
      const filas = await filasService.listar();
      setFila(filas.slice(0, 10)); // mostra até 10 pacientes

      // UBS
      const ubs = await ubsService.listar();
      setUbsList(ubs);

      // Conta pacientes por UBS
      const pacientesPorUbs = {};
      filas.forEach(f => {
        const nomeUbs = f.ubs || "UBS Central";
        pacientesPorUbs[nomeUbs] = (pacientesPorUbs[nomeUbs] || 0) + 1;
      });

      // Consultas
      const consultas = await consultasService.listar();
      const totalConsultas = consultas.length;
      const canceladas = consultas.filter(c => c.status === "Cancelado").length;
      const taxaCancel = totalConsultas > 0 ? ((canceladas / totalConsultas) * 100).toFixed(1) : 0;

      // Usuários
      const usuarios = await authService.fetchUsersList();
      const totalUsuarios = usuarios.length;

      // Tempo médio de espera (mock: calculado como 12 min se houver fila)
      const tempoMedio = filas.length > 0 ? Math.round(Math.random() * 20 + 5) : 0;

      setMetricas({
        aguardando: filas.length,
        mediaEspera: tempoMedio,
        medicosAtivos: 7,
        totalUBS: ubs.length,
        totalUsuarios,
        totalConsultasMes: totalConsultas,
        taxaCancelamento: parseFloat(taxaCancel),
      });

      // Atividades recentes (baseadas em dados reais)
      const ativs = [];
      if (totalConsultas > 0) ativs.push({ acao: `${totalConsultas} consultas registradas no sistema`, tempo: "agora" });
      if (usuarios.length > 3) ativs.push({ acao: `${usuarios.length} usuários cadastrados`, tempo: "agora" });
      ativs.push({ acao: "Painel do administrador atualizado", tempo: "agora" });
      setAtividades(ativs);

      // Alertas
      const alts = [];
      const ubsComMaisPacientes = Object.entries(pacientesPorUbs).sort((a, b) => b[1] - a[1])[0];
      if (ubsComMaisPacientes && ubsComMaisPacientes[1] > 5) {
        alts.push({ tipo: "demanda", mensagem: `Alta demanda na ${ubsComMaisPacientes[0]} (${ubsComMaisPacientes[1]} pacientes)` });
      }
      if (alts.length === 0) alts.push({ tipo: "info", mensagem: "Sistema operando normalmente." });
      setAlertas(alts);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard admin:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 15000); // atualiza a cada 15s
    return () => clearInterval(interval);
  }, [carregarDados]);

  // Chamar paciente (admin pode ver, mas a ação é mais demonstrativa)
  const handleChamarPaciente = (paciente) => {
    Swal.fire({
      title: t("dashboard.modais.chamarTitulo", { nome: paciente.paciente || paciente.nome }),
      text: t("dashboard.modais.chamarTexto", { senha: paciente.senha, prioridade: paciente.prioridade || "Normal" }),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e293b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("dashboard.modais.chamarConfirmar"),
      cancelButtonText: t("dashboard.modais.chamarCancelar"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Apenas atualiza o status visualmente (não remove da fila, pois é admin)
        Swal.fire({
          icon: "success",
          title: t("dashboard.modais.chamarSucesso"),
          text: t("dashboard.modais.chamarMensagem", { nome: paciente.paciente || paciente.nome }),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    });
  };

  // Adicionar UBS (agora salva no banco)
  const handleAdicionarUBS = async () => {
    const { value: formValues } = await Swal.fire({
      title: t("dashboard.modais.adicionarUBSTitulo"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("dashboard.modais.adicionarUBSNome")} <span class="text-red-500">*</span></label>
            <input id="swal-nome" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="Ex: UBS Jardim" />
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
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value.trim();
        if (!nome) {
          Swal.showValidationMessage("O nome é obrigatório");
          return false;
        }
        return { nome };
      },
    });

    if (formValues) {
      try {
        const novaUBS = await ubsService.criar({ nome: formValues.nome, endereco: "" });
        setUbsList(prev => [...prev, novaUBS]);
        Swal.fire({
          icon: "success",
          title: t("dashboard.modais.adicionarUBSSucesso"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        Swal.fire("Erro", "Não foi possível adicionar a UBS.", "error");
      }
    }
  };

  // Relatório PDF (simplificado)
  const gerarRelatorioPDF = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: RelatorioPDF } = await import("../../components/RelatorioPDF");
      const dadosRelatorio = {
        fila,
        aguardando: metricas.aguardando,
        mediaEspera: metricas.mediaEspera,
        medicosAtivos: metricas.medicosAtivos,
        capacidade: 80,
        percentualFila: fila.length > 0 ? Math.round((metricas.aguardando / (metricas.aguardando + 5)) * 100) : 0,
        variacao: "-12% em relação a ontem",
      };
      const blob = await pdf(<RelatorioPDF dados={dadosRelatorio} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio_ubs_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      Swal.fire({ icon: "success", title: "Relatório gerado!", toast: true, timer: 2000, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível gerar o relatório.", confirmButtonColor: "#1e293b" });
    }
  };

  // ============================================================
  // HEADER SECTION
  // ============================================================
  const HeaderSection = ({ title, subtitle, icon: Icon }) => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <HiHome className="w-4 h-4" />
              <span>Dashboard</span>
              <HiChevronDoubleLeft className="w-3 h-3 rotate-180" />
              <span className="text-white font-medium">{t("dashboard.abas.administrativo")}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2">
              <Icon className="w-7 h-7" />{title}
            </h1>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
              <span>{subtitle}</span>
              <span className="w-1 h-1 rounded-full bg-white/30"></span>
              <span>{dataFormatada}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">A</div>
            <div className="text-white text-sm">
              <p className="font-medium">Administrador</p>
              <p className="text-white/70 text-xs">Painel Geral</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <p className="text-gray-500">Carregando painel do administrador...</p>
      </div>
    );
  }

  // Prepara dados das UBS com contagem de pacientes
  const ubsComDados = ubsList.map(ubs => {
    const pacientesNaUbs = fila.filter(f => (f.ubs || "UBS Central") === ubs.nome).length;
    const medicosNaUbs = Math.floor(Math.random() * 5) + 1; // mock: entre 1 e 5 médicos por UBS
    return { ...ubs, pacientes: pacientesNaUbs, medicos: medicosNaUbs };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderSection
          title={t("dashboard.titulo")}
          subtitle={t("dashboard.subtitulo")}
          icon={HiUsers}
        />

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title={t("dashboard.metricas.aguardando")} value={metricas.aguardando} icon={HiUsers} color="blue" />
          <MetricCard title={t("dashboard.metricas.mediaEspera")} value={`${metricas.mediaEspera}min`} subtitle={`${t("dashboard.metricas.fila")} ${fila.length > 0 ? Math.round((fila.length / (fila.length + 5)) * 100) : 0}%`} icon={HiClock} color="amber" />
          <MetricCard title={t("dashboard.metricas.medicosAtivos")} value={`${metricas.medicosAtivos}/10`} subtitle={`${t("dashboard.metricas.capacidade")} 80%`} icon={HiUserGroup} color="green" />
          <MetricCard title={t("dashboard.metricas.satisfacao")} value="4.7" subtitle={t("dashboard.metricas.excelente")} icon={HiTrendingUp} color="teal" />
        </div>

        {/* GRÁFICO + RESUMO */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiChartBar className="text-blue-600" /> {t("dashboard.grafico.titulo")}
            </h2>
            <div className="h-44 flex items-end gap-1.5 px-1">
              {[40, 55, 70, 95, 80, 60, 30, 45, 65, 85, 50, 35].map((v, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:opacity-80 transition relative group" style={{ height: `${v}%` }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">{v}%</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>08h</span><span>09h</span><span>10h</span><span>11h</span><span>12h</span><span>13h</span><span>14h</span><span>15h</span><span>16h</span><span>17h</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t("dashboard.resumo.titulo")}</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t("dashboard.resumo.totalUBS")}</span>
                <span className="font-bold text-gray-800">{metricas.totalUBS}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t("dashboard.resumo.usuarios")}</span>
                <span className="font-bold text-gray-800">{metricas.totalUsuarios}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t("dashboard.resumo.consultas")}</span>
                <span className="font-bold text-gray-800">{metricas.totalConsultasMes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("dashboard.resumo.cancelamento")}</span>
                <span className="font-bold text-rose-600">{metricas.taxaCancelamento}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* FILA e UBS */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <HiClipboardList className="text-blue-600" /> {t("dashboard.filaAtendimento.titulo")}
              </h2>
              <Link to="/filas-atendimento" className="text-blue-600 text-sm font-medium hover:underline">
                {t("dashboard.filaAtendimento.verTodas")}
              </Link>
            </div>
            <div className="space-y-3">
              {fila.slice(0, 5).map((p) => (
                <FilaItem key={p.id} paciente={p} onChamar={handleChamarPaciente} t={t} />
              ))}
              {fila.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum paciente na fila.</p>}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <HiOfficeBuilding className="text-blue-600" /> {t("dashboard.ubs.titulo")}
              </h2>
              <Link to="/configuracoes" className="text-blue-600 text-sm font-medium hover:underline">
                {t("dashboard.ubs.gerenciar")}
              </Link>
            </div>
            <div className="space-y-3">
              {ubsComDados.map((ubs) => (
                <UBSItem key={ubs.id} ubs={ubs} pacientes={ubs.pacientes} medicos={ubs.medicos} t={t} />
              ))}
            </div>
            <button onClick={handleAdicionarUBS} className="w-full mt-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50/70 transition flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-600">
              <HiPlus size={18} /> {t("dashboard.ubs.adicionar")}
            </button>
          </div>
        </div>

        {/* ACESSO RÁPIDO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/agendamento" className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-blue-500/30"><HiCalendar size={28} className="text-white" /></div>
            <span className="font-medium text-sm text-gray-700">{t("dashboard.acessoRapido.agendamentos")}</span>
          </Link>
          <Link to="/filas-atendimento" className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-emerald-500/30"><HiClipboardList size={28} className="text-white" /></div>
            <span className="font-medium text-sm text-gray-700">{t("dashboard.acessoRapido.gerenciarFilas")}</span>
          </Link>
          <Link to="/vacinação" className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-indigo-500/30"><HiChartBar size={28} className="text-white" /></div>
            <span className="font-medium text-sm text-gray-700">{t("dashboard.acessoRapido.estoqueVacinas")}</span>
          </Link>
          <Link to="/configuracoes" className="group bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-gray-100/80 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 group-hover:scale-110 transition flex items-center justify-center shadow-lg shadow-amber-500/30"><HiCog size={28} className="text-white" /></div>
            <span className="font-medium text-sm text-gray-700">{t("dashboard.acessoRapido.configuracoes")}</span>
          </Link>
        </div>

        {/* ATIVIDADES e ALERTAS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiBell className="text-blue-600" /> {t("dashboard.atividades.titulo")}
            </h2>
            <div className="space-y-1">
              {atividades.map((a, i) => <AtividadeItem key={i} atividade={a} />)}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiExclamation className="text-amber-600" /> {t("dashboard.alertas.titulo")}
            </h2>
            <div className="space-y-3">
              {alertas.map((a, i) => <AlertaItem key={i} alerta={a} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;