// src/pages/admim/DashboardAdmin.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  HiUsers,
  HiClock,
  HiUserGroup,
  HiTrendingUp,
  HiCalendar,
  HiClipboardList,
  HiDocumentText,
  HiCog,
  HiOfficeBuilding,
  HiChartBar,
  HiPlus,
  HiExclamation,
  HiCheckCircle,
} from "react-icons/hi";

// ----------------------------- DADOS MOCK (separados para clareza) -----------------------------
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

// ----------------------------- COMPONENTES REUTILIZÁVEIS -----------------------------

const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend }) => (
  <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={22} />
      </div>
    </div>
    <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    {trend && (
      <p className={`text-sm mt-1 ${trend.includes("-") ? "text-red-500" : "text-green-500"}`}>
        {trend}
      </p>
    )}
  </div>
);

const FilaItem = ({ paciente, onChamar }) => {
  const isPrioridade = paciente.prioridade === "Prioridade";
  const statusColor = paciente.status === "Chamando" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";

  return (
    <div
      className={`p-4 rounded-xl flex justify-between items-center transition-all hover:shadow-md ${
        isPrioridade ? "bg-red-50 border-l-4 border-red-500" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div>
          <p className="font-bold text-gray-800">{paciente.nome}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Senha: {paciente.senha}</span>
            <span>•</span>
            <span>{paciente.tempo}</span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {paciente.status}
            </span>
            {isPrioridade && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-700">
                Prioridade
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => onChamar(paciente)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md flex items-center gap-1"
      >
        <HiCheckCircle size={16} /> Chamar
      </button>
    </div>
  );
};

const UBSItem = ({ ubs }) => (
  <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
        <HiOfficeBuilding size={20} />
      </div>
      <div>
        <p className="font-bold text-gray-800">{ubs.nome}</p>
        <p className="text-xs text-gray-500">
          {ubs.pacientes} pacientes • {ubs.medicos} médicos
        </p>
      </div>
    </div>
    <Link
      to="/filas-atendimento"
      className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
    >
      Ver fila <HiTrendingUp size={14} />
    </Link>
  </div>
);

const AtividadeItem = ({ atividade }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-700">{atividade.acao}</span>
    <span className="text-xs text-gray-400">{atividade.tempo}</span>
  </div>
);

const AlertaItem = ({ alerta }) => {
  const isDemanda = alerta.tipo === "demanda";
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${
        isDemanda ? "bg-red-50" : "bg-amber-50"
      }`}
    >
      <HiExclamation className={isDemanda ? "text-red-600" : "text-amber-600"} size={20} />
      <span className="text-sm text-gray-700">{alerta.mensagem}</span>
    </div>
  );
};

// ----------------------------- COMPONENTE PRINCIPAL -----------------------------

const DashboardAdmin = () => {
  // Estado para controlar dados (futuramente virá de API)
  const [fila, setFila] = useState(FILA_MOCK);
  const [ubsList, setUbsList] = useState(UBS_RESUMO);

  // Função para chamar paciente (abre modal de confirmação)
  const handleChamarPaciente = (paciente) => {
    Swal.fire({
      title: `Chamar ${paciente.nome}?`,
      text: `Senha ${paciente.senha} - ${paciente.prioridade}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, chamar agora",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simula chamada: remove da fila ou altera status
        setFila((prev) =>
          prev.map((p) =>
            p.id === paciente.id ? { ...p, status: "Chamando" } : p
          )
        );
        Swal.fire({
          icon: "success",
          title: "Paciente chamado!",
          text: `${paciente.nome} foi notificado.`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    });
  };

  // Função para adicionar nova UBS (abre modal com formulário)
  const handleAdicionarUBS = () => {
    Swal.fire({
      title: "Adicionar nova UBS",
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome da UBS" />
        <input id="swal-pacientes" class="swal2-input" placeholder="Nº de pacientes" type="number" />
        <input id="swal-medicos" class="swal2-input" placeholder="Nº de médicos" type="number" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value;
        const pacientes = parseInt(document.getElementById("swal-pacientes").value) || 0;
        const medicos = parseInt(document.getElementById("swal-medicos").value) || 0;
        if (!nome) {
          Swal.showValidationMessage("O nome é obrigatório");
          return;
        }
        return { nome, pacientes, medicos };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { nome, pacientes, medicos } = result.value;
        const novaUBS = {
          id: Date.now(),
          nome,
          pacientes,
          medicos,
        };
        setUbsList((prev) => [...prev, novaUBS]);
        Swal.fire({
          icon: "success",
          title: "UBS adicionada!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // Geração de relatório PDF (mantido com import dinâmico)
  const gerarRelatorioPDF = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: RelatorioPDF } = await import("../../components/RelatorioPDF");
      const dadosRelatorio = { fila, aguardando: METRICAS.aguardando, mediaEspera: METRICAS.mediaEspera };
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
        title: "Erro",
        text: "Não foi possível gerar o relatório. Verifique a dependência @react-pdf/renderer.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiUsers className="text-blue-600" /> Painel do Administrador
          </h1>
          <p className="text-gray-500">Visão gerencial completa da rede de saúde.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={gerarRelatorioPDF}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
          >
            <HiDocumentText size={18} /> Relatório Gerencial
          </button>
          <Link
            to="/configuracoes"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <HiCog size={18} /> Configurações
          </Link>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Aguardando agora"
          value={METRICAS.aguardando}
          trend={METRICAS.variacao}
          icon={HiUsers}
          color="blue"
        />
        <MetricCard
          title="Média de espera"
          value={`${METRICAS.mediaEspera}min`}
          subtitle={`Fila ${METRICAS.percentualFila}%`}
          icon={HiClock}
          color="amber"
        />
        <MetricCard
          title="Médicos ativos"
          value={`${METRICAS.medicosAtivos}/10`}
          subtitle={`Capacidade ${METRICAS.capacidade}%`}
          icon={HiUserGroup}
          color="green"
        />
        <MetricCard
          title="Satisfação geral"
          value={METRICAS.satisfacaoMedia}
          subtitle="Excelente"
          icon={HiTrendingUp}
          color="purple"
        />
      </div>

      {/* Gráfico + Resumo rede */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6 col-span-2 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold mb-4">Fluxo de atendimento hoje</h2>
          <div className="h-40 flex items-end gap-1">
            {[40, 55, 70, 95, 80, 60, 30].map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:opacity-80 transition transform origin-bottom hover:scale-y-105"
                style={{ height: `${v}%` }}
                title={`${v}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>08h</span>
            <span>10h</span>
            <span>12h</span>
            <span>14h</span>
            <span>16h</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold mb-4">Resumo da rede</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Total de UBS</span>
              <span className="font-bold">{METRICAS.totalUBS}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Usuários cadastrados</span>
              <span className="font-bold">{METRICAS.totalUsuarios}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Consultas este mês</span>
              <span className="font-bold">{METRICAS.totalConsultasMes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxa de cancelamento</span>
              <span className="font-bold text-red-500">{METRICAS.taxaCancelamento}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fila e UBS */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fila */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Fila de Atendimento</h2>
            <Link
              to="/filas-atendimento"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {fila.map((p) => (
              <FilaItem key={p.id} paciente={p} onChamar={handleChamarPaciente} />
            ))}
          </div>
        </div>

        {/* UBS */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Unidades de Saúde</h2>
            <Link
              to="/configuracoes"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Gerenciar
            </Link>
          </div>
          <div className="space-y-3">
            {ubsList.map((ubs) => (
              <UBSItem key={ubs.id} ubs={ubs} />
            ))}
          </div>
          <button
            onClick={handleAdicionarUBS}
            className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-600"
          >
            <HiPlus size={18} /> Adicionar UBS
          </button>
        </div>
      </div>

      {/* ========== ACESSO RÁPIDO CORRIGIDO ========== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/agendamento"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition flex items-center justify-center">
            <HiCalendar size={24} className="text-blue-700" />
          </div>
          <span className="font-medium text-sm">Agendamentos</span>
        </Link>
        <Link
          to="/filas-atendimento"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-200 transition flex items-center justify-center">
            <HiClipboardList size={24} className="text-green-700" />
          </div>
          <span className="font-medium text-sm">Gerenciar Filas</span>
        </Link>
        <Link
          to="/vacinação"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition flex items-center justify-center">
            <HiChartBar size={24} className="text-purple-700" />
          </div>
          <span className="font-medium text-sm">Estoque Vacinas</span>
        </Link>
        <Link
          to="/configuracoes"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-amber-200 transition flex items-center justify-center">
            <HiCog size={24} className="text-amber-700" />
          </div>
          <span className="font-medium text-sm">Configurações</span>
        </Link>
      </div>

      {/* Atividades e Alertas */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold mb-4">Atividades recentes</h2>
          <div className="space-y-1">
            {ATIVIDADES.map((a, i) => (
              <AtividadeItem key={i} atividade={a} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold mb-4">Alertas</h2>
          <div className="space-y-3">
            {ALERTAS.map((a, i) => (
              <AlertaItem key={i} alerta={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;