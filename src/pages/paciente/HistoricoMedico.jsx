// src/pages/HistoricoMedico.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar,
  HiClipboardList,
  HiLocationMarker,
  HiDownload,
  HiEye,
  HiSearch,
  HiFilter,
  HiUser,
  HiBadgeCheck,
  HiClock,
} from "react-icons/hi";
import { FaSyringe, FaStethoscope, FaHospitalAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const HistoricoMedico = () => {
  const [historico] = useState([
    {
      id: 1,
      data: "12/05/2024",
      medico: "Dr. Ricardo Silva",
      especialidade: "Clínica Geral",
      ubs: "UBS Central Lapa",
      diagnostico: "Gripe Sazonal",
      status: "Realizada",
    },
    {
      id: 2,
      data: "28/04/2024",
      medico: "Dra. Ana Costa",
      especialidade: "Pediatria",
      ubs: "UBS Vila Mariana",
      diagnostico: "Check-up Rotina",
      status: "Realizada",
    },
    {
      id: 3,
      data: "15/03/2024",
      medico: "Dr. João Mendes",
      especialidade: "Ortopedia",
      ubs: "UPA Central",
      diagnostico: "Entorse Tornozelo",
      status: "Realizada",
    },
    {
      id: 4,
      data: "02/02/2024",
      medico: "Dra. Beatriz Lima",
      especialidade: "Cardiologia",
      ubs: "UBS Sul",
      diagnostico: "Hipertensão Leve",
      status: "Realizada",
    },
    {
      id: 5,
      data: "20/01/2024",
      medico: "Dr. Pedro Alves",
      especialidade: "Dermatologia",
      ubs: "UBS Leste",
      diagnostico: "Dermatite Atópica",
      status: "Realizada",
    },
  ]);

  // Estado para filtros
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("Todas");

  // Obter lista única de especialidades para o filtro
  const especialidadesUnicas = useMemo(() => {
    const esp = historico.map((h) => h.especialidade);
    return ["Todas", ...new Set(esp)];
  }, [historico]);

  // Filtrar histórico
  const historicoFiltrado = useMemo(() => {
    let resultado = historico;
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(
        (h) =>
          h.medico.toLowerCase().includes(termo) ||
          h.diagnostico.toLowerCase().includes(termo) ||
          h.especialidade.toLowerCase().includes(termo) ||
          h.ubs.toLowerCase().includes(termo)
      );
    }
    if (filtroEspecialidade !== "Todas") {
      resultado = resultado.filter(
        (h) => h.especialidade === filtroEspecialidade
      );
    }
    return resultado;
  }, [historico, termoBusca, filtroEspecialidade]);

  // Estatísticas
  const totalConsultas = historico.length;
  const ultimaConsulta = historico.length > 0 ? historico[0].data : "Nenhuma";
  const especialidadesAtendidas = new Set(historico.map((h) => h.especialidade))
    .size;

  // Gerar relatório
  const gerarConteudoRelatorio = () => {
    let conteudo = "RELATÓRIO DE HISTÓRICO MÉDICO\n\n";
    conteudo += "Paciente: Maria Silva\n";
    conteudo +=
      "Data de emissão: " + new Date().toLocaleDateString("pt-BR") + "\n\n";
    conteudo += "CONSULTAS:\n";
    conteudo += "----------------------------------------\n";
    historico.forEach((h, i) => {
      conteudo += `${i + 1}. Data: ${h.data}\n`;
      conteudo += `   Médico: ${h.medico}\n`;
      conteudo += `   Especialidade: ${h.especialidade}\n`;
      conteudo += `   UBS: ${h.ubs}\n`;
      conteudo += `   Diagnóstico: ${h.diagnostico}\n\n`;
    });
    return conteudo;
  };

  // Baixar relatório
  const handleBaixarRelatorio = () => {
    const conteudo = gerarConteudoRelatorio();
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historico_medico_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "Relatório baixado!",
      text: "O arquivo foi salvo em seu dispositivo.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  // Ver detalhes da consulta
  const verDetalhesConsulta = (consulta) => {
    Swal.fire({
      title: `Consulta - ${consulta.diagnostico}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Data:</strong> ${consulta.data}</p>
          <p><strong>Médico:</strong> ${consulta.medico}</p>
          <p><strong>Especialidade:</strong> ${consulta.especialidade}</p>
          <p><strong>UBS:</strong> ${consulta.ubs}</p>
          <p><strong>Diagnóstico:</strong> ${consulta.diagnostico}</p>
          <p><strong>Status:</strong> <span class="text-green-600">${consulta.status}</span></p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  // Limpar filtros
  const limparFiltros = () => {
    setTermoBusca("");
    setFiltroEspecialidade("Todas");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiClipboardList className="text-blue-600" /> Histórico de Consultas
            </h1>
            <p className="text-gray-500">
              Visualize e baixe seus registros médicos anteriores.
            </p>
          </div>
          {/* Botão Baixar Relatório - Agora na cor AZUL */}
          <button
            onClick={handleBaixarRelatorio}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <HiDownload /> Baixar Relatório
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-400">Total de Consultas</p>
            <p className="text-3xl font-bold text-gray-800">{totalConsultas}</p>
            <div className="mt-2 text-xs text-gray-400">Última: {ultimaConsulta}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
            <p className="text-sm text-gray-400">Especialidades</p>
            <p className="text-2xl font-bold text-gray-800">{especialidadesAtendidas}</p>
            <p className="text-xs text-gray-400">diferentes áreas</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
            <p className="text-sm text-gray-400">Última UBS</p>
            <p className="text-lg font-bold text-gray-800 truncate">
              {historico.length > 0 ? historico[0].ubs : "N/A"}
            </p>
            <p className="text-xs text-gray-400">última consulta</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-80">Lembrete de Saúde</p>
                <p className="font-bold text-sm">Vacina de reforço disponível</p>
              </div>
              <FaSyringe size={24} className="opacity-60" />
            </div>
            <Link
              to="/agendamento"
              className="mt-3 inline-block bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              Agendar agora →
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por médico, diagnóstico, especialidade ou UBS..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiFilter className="text-gray-400" />
            <select
              value={filtroEspecialidade}
              onChange={(e) => setFiltroEspecialidade(e.target.value)}
              className="px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              {especialidadesUnicas.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={limparFiltros}
            className="px-4 py-2.5 text-gray-600 border rounded-xl hover:bg-gray-50 transition"
          >
            Limpar Filtros
          </button>
          <span className="text-sm text-gray-400 ml-auto">
            {historicoFiltrado.length} consulta(s) encontrada(s)
          </span>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Médico / Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    UBS / Unidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Diagnóstico
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historicoFiltrado.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <HiClipboardList className="text-4xl text-gray-300 mx-auto mb-2" />
                      <p>Nenhuma consulta encontrada com os filtros atuais.</p>
                      <button
                        onClick={limparFiltros}
                        className="mt-2 text-blue-600 hover:underline"
                      >
                        Limpar filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  historicoFiltrado.map((h) => (
                    <tr
                      key={h.id}
                      className="hover:bg-blue-50 transition group"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {h.data}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {h.medico}
                        </div>
                        <div className="text-xs text-gray-500">
                          {h.especialidade}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {h.ubs}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {h.diagnostico}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => verDetalhesConsulta(h)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition group-hover:bg-blue-50"
                          title="Visualizar"
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
      </div>
    </div>
  );
};

export default HistoricoMedico;