// src/pages/paciente/HistoricoMedico.jsx
import { useState, useEffect, useMemo } from "react";
import { HiClipboardList, HiEye, HiSearch, HiFilter, HiDownload, HiUser, HiCalendar, HiClock, HiLocationMarker, HiChevronRight } from "react-icons/hi";
import { FaStethoscope, FaHospitalAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { historicoService } from "../../services/historicoService";

// Dados mockados para demonstração (caso não haja histórico real)
const DADOS_MOCK = [
  {
    id: 1,
    data: "15/06/2026",
    horario: "09:00",
    medico: "Dra. Ana Silva",
    especialidade: "Clínica Geral",
    ubs: "UBS Central Lapa",
    diagnostico: "Hipertensão arterial – monitoramento",
    status: "Realizada",
  },
  {
    id: 2,
    data: "22/05/2026",
    horario: "14:30",
    medico: "Dr. Carlos Alberto",
    especialidade: "Cardiologia",
    ubs: "UBS Central Lapa",
    diagnostico: "Check-up cardiológico – eletro normal",
    status: "Realizada",
  },
  {
    id: 3,
    data: "10/04/2026",
    horario: "10:00",
    medico: "Dra. Beatriz Mendes",
    especialidade: "Ginecologia",
    ubs: "UBS Norte",
    diagnostico: "Preventivo anual – resultado normal",
    status: "Realizada",
  },
  {
    id: 4,
    data: "05/03/2026",
    horario: "16:00",
    medico: "Dr. Fernando Rocha",
    especialidade: "Ortopedia",
    ubs: "UBS Leste",
    diagnostico: "Tendinite no ombro – encaminhamento para fisioterapia",
    status: "Realizada",
  },
  {
    id: 5,
    data: "18/02/2026",
    horario: "11:30",
    medico: "Dra. Patrícia Lima",
    especialidade: "Dermatologia",
    ubs: "UBS Sul",
    diagnostico: "Avaliação de lesão cutânea – biópsia agendada",
    status: "Realizada",
  },
  {
    id: 6,
    data: "02/01/2026",
    horario: "15:00",
    medico: "Dr. Marcos Oliveira",
    especialidade: "Psicologia",
    ubs: "UBS Central Lapa",
    diagnostico: "Acompanhamento psicológico – evolução positiva",
    status: "Realizada",
  },
];

const HistoricoMedico = () => {
  const { user } = useAuth();
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("Todas");

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!user?.name) {
        setHistorico(DADOS_MOCK);
        setCarregando(false);
        return;
      }
      try {
        const dados = await historicoService.listarPorPaciente(user.name);
        if (dados && dados.length > 0) {
          setHistorico(dados);
        } else {
          // Se não houver dados reais, usa mock
          setHistorico(DADOS_MOCK);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        setHistorico(DADOS_MOCK);
      } finally {
        setCarregando(false);
      }
    };
    carregarHistorico();
  }, [user]);

  const especialidadesUnicas = useMemo(() => {
    const esp = historico.map((h) => h.especialidade);
    return ["Todas", ...new Set(esp)];
  }, [historico]);

  const historicoFiltrado = useMemo(() => {
    let resultado = historico;
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(
        (h) =>
          h.medico.toLowerCase().includes(termo) ||
          h.diagnostico?.toLowerCase().includes(termo) ||
          h.especialidade.toLowerCase().includes(termo) ||
          h.ubs.toLowerCase().includes(termo)
      );
    }
    if (filtroEspecialidade !== "Todas") {
      resultado = resultado.filter((h) => h.especialidade === filtroEspecialidade);
    }
    return resultado;
  }, [historico, termoBusca, filtroEspecialidade]);

  const totalConsultas = historico.length;
  const ultimaConsulta = historico.length > 0 ? historico[0].data : "Nenhuma";
  const especialidadesAtendidas = new Set(historico.map((h) => h.especialidade)).size;

  const handleBaixarRelatorio = () => {
    let conteudo = "RELATÓRIO DE HISTÓRICO MÉDICO\n\n";
    conteudo += `Paciente: ${user?.name || "Não informado"}\n`;
    conteudo += "Data de emissão: " + new Date().toLocaleDateString("pt-BR") + "\n\n";
    historico.forEach((h, i) => {
      conteudo += `${i + 1}. Data: ${h.data} ${h.horario ? `às ${h.horario}` : ""}\n`;
      conteudo += `   Médico: ${h.medico}\n`;
      conteudo += `   Especialidade: ${h.especialidade}\n`;
      conteudo += `   UBS: ${h.ubs}\n`;
      conteudo += `   Diagnóstico: ${h.diagnostico || "—"}\n\n`;
    });
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historico_medico_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    Swal.fire({
      icon: "success",
      title: "Relatório baixado!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const verDetalhesConsulta = (consulta) => {
    Swal.fire({
      title: `Consulta de ${consulta.especialidade}`,
      html: `
        <div style="text-align:left; line-height:2;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-weight:600; color:#4b5563;">📅 Data:</span>
            <span style="font-weight:500;">${consulta.data}</span>
            ${consulta.horario ? `<span style="font-weight:500; color:#6b7280;">• ${consulta.horario}</span>` : ""}
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-weight:600; color:#4b5563;">👨‍⚕️ Médico:</span>
            <span style="font-weight:500;">${consulta.medico}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-weight:600; color:#4b5563;">🏥 Especialidade:</span>
            <span style="font-weight:500;">${consulta.especialidade}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-weight:600; color:#4b5563;">📍 UBS:</span>
            <span style="font-weight:500;">${consulta.ubs}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="font-weight:600; color:#4b5563;">📋 Diagnóstico:</span>
            <span style="font-weight:500; color:#1f2937;">${consulta.diagnostico || "—"}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:600; color:#4b5563;">📌 Status:</span>
            <span style="font-weight:600; color:#16a34a;">${consulta.status || "Realizada"}</span>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  const limparFiltros = () => {
    setTermoBusca("");
    setFiltroEspecialidade("Todas");
  };

  // Renderiza skeleton enquanto carrega
  if (carregando) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiClipboardList className="text-blue-600" /> Histórico de Consultas
            </h1>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <HiUser className="text-blue-400" size={16} />
              {user?.name || "Paciente"} – visualize e baixe seus registros médicos
            </p>
          </div>
          <button
            onClick={handleBaixarRelatorio}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <HiDownload size={18} /> Baixar Relatório
          </button>
        </div>

        {/* Cards de resumo com ícones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition">
                <HiCalendar className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</p>
                <p className="text-2xl font-bold text-gray-800">{totalConsultas}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Última: {ultimaConsulta}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition">
                <FaStethoscope className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Especialidades</p>
                <p className="text-2xl font-bold text-gray-800">{especialidadesAtendidas}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">diferentes áreas</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition">
                <FaHospitalAlt className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Última UBS</p>
                <p className="text-lg font-bold text-gray-800 truncate max-w-[120px]">
                  {historico.length > 0 ? historico[0].ubs : "N/A"}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">unidade de saúde</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <HiClipboardList size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm opacity-90">Lembrete de Saúde</p>
              <p className="font-bold text-sm">Mantenha suas consultas em dia</p>
            </div>
          </div>
        </div>

        {/* Filtros com design melhorado */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por médico, diagnóstico, especialidade ou UBS..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 hover:bg-white transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiFilter className="text-gray-400" size={18} />
            <select
              value={filtroEspecialidade}
              onChange={(e) => setFiltroEspecialidade(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 hover:bg-white transition"
            >
              {especialidadesUnicas.map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
          <button
            onClick={limparFiltros}
            className="px-4 py-2.5 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-1"
          >
            <HiClipboardList size={16} /> Limpar
          </button>
          <span className="text-sm text-gray-400 ml-auto bg-gray-100 px-3 py-1 rounded-full">
            {historicoFiltrado.length} consulta(s)
          </span>
        </div>

        {/* Tabela estilizada com design moderno */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Médico / Especialidade</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">UBS</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historicoFiltrado.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <HiClipboardList className="text-5xl mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium text-gray-400">Nenhuma consulta encontrada</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {historico.length === 0
                          ? "Você ainda não tem consultas registradas."
                          : "Tente ajustar os filtros para ver mais resultados."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  historicoFiltrado.map((h) => (
                    <tr key={h.id} className="hover:bg-blue-50/50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <HiCalendar className="text-gray-400" size={14} />
                          <span className="text-sm font-medium">{h.data}</span>
                          {h.horario && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <HiClock size={12} /> {h.horario}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{h.medico}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FaStethoscope size={12} className="text-blue-400" />
                          {h.especialidade}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <HiLocationMarker size={14} className="text-gray-400" />
                          {h.ubs}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
                          {h.diagnostico || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => verDetalhesConsulta(h)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition group-hover:scale-110"
                          title="Ver detalhes"
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

        {/* Rodapé informativo */}
        {historico.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-6 border-t border-gray-200 pt-6">
            {historico === DADOS_MOCK ? (
              "Dados de exemplo para demonstração. Conecte-se ao sistema para ver seu histórico real."
            ) : (
              `Histórico real carregado com ${historico.length} consulta(s).`
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoricoMedico;