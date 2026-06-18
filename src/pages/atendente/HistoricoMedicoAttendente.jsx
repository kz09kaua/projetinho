// src/pages/HistoricoMedicoAttendente.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiSearch,
  HiUser,
  HiDocumentText,
  HiCalendar,
  HiLocationMarker,
  HiClipboardList,
  HiX,
} from "react-icons/hi";
import Swal from "sweetalert2";

const HistoricoMedicoAttendente = () => {
  const { user } = useAuth();

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [cpfBusca, setCpfBusca] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState(null);

  // Mock de pacientes e históricos
  const pacientesMock = [
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      sus: "1234 5678 9012",
      historico: [
        {
          id: 1,
          data: "12/05/2024",
          medico: "Dr. Ricardo Silva",
          especialidade: "Clínico Geral",
          ubs: "UBS Central Lapa",
          diagnostico: "Gripe Sazonal",
        },
        {
          id: 2,
          data: "28/04/2024",
          medico: "Dra. Ana Costa",
          especialidade: "Pediatria",
          ubs: "UBS Vila Mariana",
          diagnostico: "Check-up Rotina",
        },
      ],
    },
    {
      id: 2,
      nome: "José Santos",
      cpf: "987.654.321-00",
      sus: "9876 5432 1098",
      historico: [
        {
          id: 3,
          data: "15/03/2024",
          medico: "Dr. João Mendes",
          especialidade: "Ortopedia",
          ubs: "UPA Central",
          diagnostico: "Entorse Tornozelo",
        },
        {
          id: 4,
          data: "20/01/2024",
          medico: "Dra. Ana Costa",
          especialidade: "Cardiologia",
          ubs: "UBS Central",
          diagnostico: "Hipertensão Controlada",
        },
      ],
    },
  ];

  const buscarHistorico = () => {
    const cpfLimpo = cpfBusca.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Swal.fire(
        "CPF inválido",
        "Digite um CPF válido com 11 dígitos.",
        "warning",
      );
      return;
    }
    const encontrado = pacientesMock.find((p) => p.cpf === cpfBusca);
    if (encontrado) {
      setPaciente(encontrado);
      setHistorico(encontrado.historico);
      Swal.fire(
        "Paciente encontrado",
        `Histórico de ${encontrado.nome}`,
        "success",
      );
    } else {
      Swal.fire(
        "Não encontrado",
        "Nenhum paciente com esse CPF no sistema.",
        "error",
      );
      setPaciente(null);
      setHistorico(null);
    }
  };

  const limparBusca = () => {
    setCpfBusca("");
    setPaciente(null);
    setHistorico(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface">
            Histórico de Consultas - Atendente
          </h1>
          <p className="text-on-surface-variant">
            Busque o histórico médico de qualquer paciente cadastrado.
          </p>
        </div>
      </div>

      {/* Busca por CPF */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 mb-8">
        <label className="block text-sm font-bold mb-2">CPF do paciente</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              maxLength={14}
            />
            <HiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={buscarHistorico}
            className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition flex items-center gap-2"
          >
            <HiSearch size={18} /> Buscar
          </button>
          <button
            onClick={limparBusca}
            className="border border-gray-300 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            <HiX size={18} />
          </button>
        </div>
      </div>

      {/* Informações do paciente e histórico */}
      {paciente && (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <HiUser
                  className="text-blue-700 dark:text-blue-300"
                  size={24}
                />
              </div>
              <div>
                <p className="font-bold text-xl">{paciente.nome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  CPF: {paciente.cpf} | CNS: {paciente.sus}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold">
                Consultas Realizadas ({historico.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Médico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Especialidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Diagnóstico
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {historico.map((consulta) => (
                    <tr key={consulta.id}>
                      <td className="px-6 py-4 font-medium">{consulta.data}</td>
                      <td className="px-6 py-4">{consulta.medico}</td>
                      <td className="px-6 py-4">{consulta.especialidade}</td>
                      <td className="px-6 py-4 flex items-center gap-1">
                        <HiLocationMarker size={14} className="text-gray-400" />
                        {consulta.ubs}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                          {consulta.diagnostico}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!paciente && (
        <div className="text-center text-gray-500 mt-20">
          <HiDocumentText size={48} className="mx-auto mb-4 opacity-50" />
          <p>
            Utilize a busca por CPF para visualizar o histórico de um paciente.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoricoMedicoAttendente;
