import { useState } from "react";
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
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const DashboardAdmin = () => {
  const [dadosRelatorio] = useState({
    aguardando: 24,
    variacao: "-12% em relação a ontem",
    mediaEspera: 18,
    percentualFila: 75,
    medicosAtivos: 8,
    capacidade: 80,
    fila: [
      {
        nome: "Maria Oliveira",
        senha: "P-042",
        tempo: "Prioridade • 5 min",
        status: "Chamando",
        prioridade: "Prioridade",
      },
      {
        nome: "João dos Santos",
        senha: "G-108",
        tempo: "Aguardando 12 min",
        status: "Aguardando",
        prioridade: "Normal",
      },
      {
        nome: "Ana Paula Souza",
        senha: "G-112",
        tempo: "Aguardando 8 min",
        status: "Aguardando",
        prioridade: "Normal",
      },
    ],
  });

  const [metricas] = useState({
    totalUBS: 12,
    totalUsuarios: 350,
    totalConsultasMes: 1240,
    taxaCancelamento: 3.2,
    satisfacaoMedia: 4.7,
  });

  const [ubsResumo] = useState([
    { id: 1, nome: "UBS Central", pacientes: 24, medicos: 4 },
    { id: 2, nome: "UBS Vila da Penha", pacientes: 18, medicos: 3 },
    { id: 3, nome: "UBS São Cristóvão", pacientes: 15, medicos: 2 },
  ]);

  const [atividades] = useState([
    { acao: "Novo usuário cadastrado", tempo: "10 min atrás" },
    { acao: "Relatório de filas exportado", tempo: "1 hora atrás" },
    { acao: "Unidade UBS Norte sincronizada", tempo: "2 horas atrás" },
  ]);

  const [alertas] = useState([
    { tipo: "demanda", mensagem: "Alta demanda na UBS Central (24 pacientes)" },
    { tipo: "estoque", mensagem: "Vacina Gripe vencendo em 30 dias" },
  ]);

  const gerarRelatorioPDF = async () => {
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: RelatorioPDF } =
        await import("../../components/RelatorioPDF");
      if (!dadosRelatorio || !dadosRelatorio.fila)
        throw new Error("Dados incompletos");
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
        confirmButtonColor: "#0057B8",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Painel do Administrador
          </h1>
          <p className="text-gray-500">
            Visão gerencial completa da rede de saúde.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={gerarRelatorioPDF}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition"
          >
            <HiDocumentText size={18} /> Relatório Gerencial
          </button>
          <Link
            to="/configuracoes"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <HiCog size={18} /> Configurações
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm">Aguardando agora</span>
            <HiUsers size={24} className="text-blue-600" />
          </div>
          <p className="text-4xl font-bold mt-2">{dadosRelatorio.aguardando}</p>
          <p className="text-green-600 text-sm mt-1">
            {dadosRelatorio.variacao}
          </p>
        </div>
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm">Média de espera</span>
            <HiClock size={24} className="text-amber-600" />
          </div>
          <p className="text-4xl font-bold mt-2">
            {dadosRelatorio.mediaEspera}
            <span className="text-xl font-normal">min</span>
          </p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${dadosRelatorio.percentualFila}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm">Médicos ativos</span>
            <HiUserGroup size={24} className="text-green-600" />
          </div>
          <p className="text-4xl font-bold mt-2">
            {dadosRelatorio.medicosAtivos}
            <span className="text-xl font-normal">/10</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Capacidade {dadosRelatorio.capacidade}%
          </p>
        </div>
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm">Satisfação geral</span>
            <HiTrendingUp size={24} className="text-purple-600" />
          </div>
          <p className="text-4xl font-bold mt-2">{metricas.satisfacaoMedia}</p>
          <p className="text-purple-600 text-sm mt-1">Excelente</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6 col-span-2">
          <h2 className="text-xl font-bold mb-4">Fluxo de atendimento hoje</h2>
          <div className="h-40 flex items-end gap-1">
            {[40, 55, 70, 95, 80, 60, 30].map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-600 rounded-t hover:opacity-80 transition"
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
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-4">Resumo da rede</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Total de UBS</span>
              <span className="font-bold">{metricas.totalUBS}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Usuários cadastrados</span>
              <span className="font-bold">{metricas.totalUsuarios}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Consultas este mês</span>
              <span className="font-bold">{metricas.totalConsultasMes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxa de cancelamento</span>
              <span className="font-bold text-red-500">
                {metricas.taxaCancelamento}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Fila de Atendimento</h2>
            <Link
              to="/filas-atendimento"
              className="text-blue-600 text-sm hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {dadosRelatorio.fila.map((p, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg flex justify-between items-center ${p.prioridade === "Prioridade" ? "bg-red-50 border-l-4 border-red-500" : "bg-gray-50"}`}
              >
                <div>
                  <p className="font-bold text-gray-800">{p.nome}</p>
                  <p className="text-sm text-gray-500">
                    Senha: {p.senha} • {p.tempo} • {p.status}
                  </p>
                </div>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition">
                  Chamar
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Unidades de Saúde</h2>
            <Link
              to="/configuracoes"
              className="text-blue-600 text-sm hover:underline"
            >
              Gerenciar
            </Link>
          </div>
          <div className="space-y-3">
            {ubsResumo.map((ubs) => (
              <div
                key={ubs.id}
                className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <HiOfficeBuilding size={20} className="text-blue-600" />
                  <div>
                    <p className="font-bold text-gray-800">{ubs.nome}</p>
                    <p className="text-xs text-gray-500">
                      {ubs.pacientes} pacientes • {ubs.medicos} médicos
                    </p>
                  </div>
                </div>
                <Link
                  to="/filas-atendimento"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Ver fila
                </Link>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <HiPlus size={18} /> Adicionar UBS
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/agendamento"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <HiCalendar size={24} className="text-blue-700" />
          </div>
          <span className="font-medium text-sm">Agendamentos</span>
        </Link>
        <Link
          to="/gerenciar-filas"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <HiClipboardList size={24} className="text-green-700" />
          </div>
          <span className="font-medium text-sm">Gerenciar Filas</span>
        </Link>
        <Link
          to="/estoque-vacinas"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <HiChartBar size={24} className="text-purple-700" />
          </div>
          <span className="font-medium text-sm">Estoque Vacinas</span>
        </Link>
        <Link
          to="/configuracoes"
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <HiCog size={24} className="text-amber-700" />
          </div>
          <span className="font-medium text-sm">Configurações</span>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-4">Atividades recentes</h2>
          <div className="space-y-3 text-sm">
            {atividades.map((a, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-700">{a.acao}</span>
                <span className="text-gray-400">{a.tempo}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-bold mb-4">Alertas</h2>
          <div className="space-y-3">
            {alertas.map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl ${a.tipo === "demanda" ? "bg-red-50" : "bg-amber-50"}`}
              >
                <HiTrendingUp
                  className={
                    a.tipo === "demanda" ? "text-red-600" : "text-amber-600"
                  }
                />
                <span className="text-sm">{a.mensagem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
