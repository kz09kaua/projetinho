// src/pages/HistoricoMedico.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar,
  HiClipboardList,
  HiLocationMarker,
  HiDownload,
  HiEye,
} from "react-icons/hi";
import { FaSyringe } from "react-icons/fa";
import Swal from "sweetalert2";

const HistoricoMedico = () => {
  const [historico] = useState([
    {
      data: "12/05/2024",
      medico: "Dr. Ricardo Silva",
      especialidade: "Clínico Geral",
      ubs: "UBS Central Lapa",
      diagnostico: "Gripe Sazonal",
    },
    {
      data: "28/04/2024",
      medico: "Dra. Ana Costa",
      especialidade: "Pediatria",
      ubs: "UBS Vila Mariana",
      diagnostico: "Check-up Rotina",
    },
    {
      data: "15/03/2024",
      medico: "Dr. João Mendes",
      especialidade: "Ortopedia",
      ubs: "UPA Central",
      diagnostico: "Entorse Tornozelo",
    },
    {
      data: "02/02/2024",
      medico: "Dra. Beatriz Lima",
      especialidade: "Cardiologia",
      ubs: "UBS Sul",
      diagnostico: "Hipertensão Leve",
    },
  ]);

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

  const verDetalhesConsulta = (consulta) => {
    Swal.fire({
      title: `Consulta de ${consulta.diagnostico}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Data:</strong> ${consulta.data}</p>
          <p><strong>Médico:</strong> ${consulta.medico}</p>
          <p><strong>Especialidade:</strong> ${consulta.especialidade}</p>
          <p><strong>UBS:</strong> ${consulta.ubs}</p>
          <p><strong>Diagnóstico:</strong> ${consulta.diagnostico}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiClipboardList className="text-blue-600" /> Histórico de Consultas
          </h1>
          <p className="text-gray-500 mb-6">
            Visualize e baixe seus registros médicos anteriores.
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Total de Consultas</p>
            <p className="text-3xl font-bold">{historico.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-400">Última UBS</p>
            <p className="text-xl font-bold text-gray-800">UBS Vila Mariana</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Lembrete de Saúde</p>
              <p className="font-bold text-gray-800">
                Vacina de reforço disponível
              </p>
              <Link
                to="/vacinas"
                className="text-blue-700 text-sm font-medium hover:underline mt-1 flex items-center gap-1"
              >
                Agendar <HiCalendar size={14} />
              </Link>
            </div>
            <FaSyringe size={32} className="text-blue-200" />
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Médico/Especialidade
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
            <tbody className="divide-y divide-gray-200">
              {historico.map((h, idx) => (
                <tr key={idx} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-sm">{h.data}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{h.medico}</div>
                    <div className="text-xs text-gray-500">
                      {h.especialidade}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm flex items-center gap-1">
                    <HiLocationMarker className="text-blue-400" size={14} />{" "}
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
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                      title="Visualizar"
                    >
                      <HiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleBaixarRelatorio}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <HiDownload /> Baixar Relatório (TXT)
        </button>
      </div>
    </div>
  );
};

export default HistoricoMedico;
