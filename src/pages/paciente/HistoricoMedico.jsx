// src/pages/paciente/HistoricoMedico.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { HiClipboardList, HiEye, HiSearch, HiFilter, HiDownload } from "react-icons/hi";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { historicoService } from "../../services/historicoService";
import { consultasService } from "../../services/consultasService";

const HistoricoMedico = () => {
  const { user } = useAuth();
  const [historico, setHistorico] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("Todas");

  const carregarHistorico = useCallback(async () => {
    if (!user?.name) {
      setHistorico([]);
      return;
    }

    try {
      // 1. Busca registros da tabela historico_medico
      const registrosHist = await historicoService.listarPorPaciente(user.name);

      // 2. Busca todas as consultas do paciente (case‑insensitive)
      const todasConsultas = await consultasService.listar();
      const consultasDoPaciente = todasConsultas.filter(
        c => c.paciente && c.paciente.toLowerCase() === user.name.toLowerCase()
      );

      const consultasMapeadas = consultasDoPaciente.map(c => ({
        id: `consulta-${c.id}`,
        data: c.data,
        medico: c.medico || "Médico designado",
        especialidade: c.especialidade,
        ubs: c.ubs || "Não informada",
        diagnostico: c.observacoes || c.status || "Consulta realizada",
        status: c.status === "Confirmado" ? "Realizada" : c.status,
        origem: "consulta",
      }));

      const historicoMapeado = registrosHist.map(h => ({
        id: `hist-${h.id}`,
        data: h.data,
        medico: h.medico || "Médico",
        especialidade: h.especialidade,
        ubs: h.ubs || "Não informada",
        diagnostico: h.diagnostico || "Sem diagnóstico",
        status: h.status || "Realizada",
        origem: "historico",
      }));

      // Combina e ordena por data (mais recente primeiro)
      const combinado = [...historicoMapeado, ...consultasMapeadas].sort((a, b) => {
        const [diaA, mesA, anoA] = (a.data || "01/01/2000").split("/").map(Number);
        const [diaB, mesB, anoB] = (b.data || "01/01/2000").split("/").map(Number);
        return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
      });

      setHistorico(combinado);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setHistorico([]);
    }
  }, [user]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const especialidadesUnicas = useMemo(() => {
    const esp = (historico || []).map((h) => h.especialidade).filter(Boolean);
    return ["Todas", ...new Set(esp)];
  }, [historico]);

  const historicoFiltrado = useMemo(() => {
    let resultado = historico;
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(
        (h) =>
          (h.medico || "").toLowerCase().includes(termo) ||
          (h.diagnostico || "").toLowerCase().includes(termo) ||
          (h.especialidade || "").toLowerCase().includes(termo) ||
          (h.ubs || "").toLowerCase().includes(termo)
      );
    }
    if (filtroEspecialidade !== "Todas") {
      resultado = resultado.filter((h) => h.especialidade === filtroEspecialidade);
    }
    return resultado;
  }, [historico, termoBusca, filtroEspecialidade]);

  const totalConsultas = historico.length;
  const ultimaConsulta = historico.length > 0 ? historico[0].data : "Nenhuma";
  const especialidadesAtendidas = new Set(historico.map((h) => h.especialidade).filter(Boolean)).size;

  const handleBaixarRelatorio = () => {
    let conteudo = "RELATÓRIO DE HISTÓRICO MÉDICO\n\n";
    conteudo += `Paciente: ${user?.name || "Paciente"}\n`;
    conteudo += "Data de emissão: " + new Date().toLocaleDateString("pt-BR") + "\n\n";
    historico.forEach((h, i) => {
      conteudo += `${i + 1}. Data: ${h.data}\n`;
      conteudo += `   Médico: ${h.medico || "—"}\n`;
      conteudo += `   Especialidade: ${h.especialidade || "—"}\n`;
      conteudo += `   UBS: ${h.ubs || "—"}\n`;
      conteudo += `   Diagnóstico: ${h.diagnostico || "—"}\n\n`;
    });
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historico_medico_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    Swal.fire({ icon: "success", title: "Relatório baixado!", toast: true, position: "top-end", showConfirmButton: false, timer: 2500 });
  };

  const verDetalhesConsulta = (consulta) => {
    Swal.fire({
      title: `Consulta - ${consulta.diagnostico || "Sem diagnóstico"}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Data:</strong> ${consulta.data}</p>
          <p><strong>Médico:</strong> ${consulta.medico || "—"}</p>
          <p><strong>Especialidade:</strong> ${consulta.especialidade || "—"}</p>
          <p><strong>UBS:</strong> ${consulta.ubs || "—"}</p>
          <p><strong>Diagnóstico:</strong> ${consulta.diagnostico || "—"}</p>
          <p><strong>Status:</strong> <span class="text-green-600">${consulta.status || "—"}</span></p>
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiClipboardList className="text-blue-600" /> Histórico de Consultas
            </h1>
            <p className="text-gray-500">Visualize e baixe seus registros médicos anteriores.</p>
          </div>
          <button onClick={handleBaixarRelatorio} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md">
            <HiDownload /> Baixar Relatório
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-400">Total de Consultas</p>
            <p className="text-3xl font-bold text-gray-800">{totalConsultas}</p>
            <p className="text-xs text-gray-400">Última: {ultimaConsulta}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-400">Especialidades</p>
            <p className="text-2xl font-bold text-gray-800">{especialidadesAtendidas}</p>
            <p className="text-xs text-gray-400">diferentes áreas</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-sm text-gray-400">Última UBS</p>
            <p className="text-lg font-bold text-gray-800 truncate">
              {historico.length > 0 ? historico[0].ubs : "N/A"}
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Lembrete de Saúde</p>
            <p className="font-bold text-sm">Mantenha suas consultas em dia</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por médico, diagnóstico, especialidade ou UBS..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiFilter className="text-gray-400" />
            <select
              value={filtroEspecialidade}
              onChange={(e) => setFiltroEspecialidade(e.target.value)}
              className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {especialidadesUnicas.map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
          <button onClick={limparFiltros} className="px-4 py-2.5 text-gray-600 border rounded-xl hover:bg-gray-50">
            Limpar Filtros
          </button>
          <span className="text-sm text-gray-400 ml-auto">{historicoFiltrado.length} consulta(s) encontrada(s)</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico / Especialidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UBS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historicoFiltrado.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <HiClipboardList className="text-4xl mx-auto mb-2 text-gray-300" />
                      <p>Nenhuma consulta encontrada.</p>
                    </td>
                  </tr>
                ) : (
                  historicoFiltrado.map((h) => (
                    <tr key={h.id} className="hover:bg-blue-50 transition group">
                      <td className="px-6 py-4 text-sm font-medium">{h.data}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{h.medico || "—"}</div>
                        <div className="text-xs text-gray-500">{h.especialidade || "—"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{h.ubs || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {h.diagnostico || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => verDetalhesConsulta(h)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
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
      </div>
    </div>
  );
};

export default HistoricoMedico;