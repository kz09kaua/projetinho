import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaStethoscope,
  FaFileDownload,
} from "react-icons/fa";
import Swal from "sweetalert2";

const HistoricoMedicoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  const [registros, setRegistros] = useState([
    {
      id: 1,
      paciente: "Maria Silva",
      data: "12/05/2024",
      medico: "Dr. Ricardo Silva",
      especialidade: "Clínico Geral",
      ubs: "UBS Central",
      diagnostico: "Gripe Sazonal",
    },
    {
      id: 2,
      paciente: "José Santos",
      data: "28/04/2024",
      medico: "Dra. Ana Costa",
      especialidade: "Pediatria",
      ubs: "UBS Vila Mariana",
      diagnostico: "Check-up Rotina",
    },
    {
      id: 3,
      paciente: "Pedro Alves",
      data: "15/03/2024",
      medico: "Dr. João Mendes",
      especialidade: "Ortopedia",
      ubs: "UPA Central",
      diagnostico: "Entorse Tornozelo",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = registros.filter(
    (r) =>
      r.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.medico.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const exportarCSV = () => {
    Swal.fire("Exportado!", "Arquivo CSV gerado.", "success");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Histórico de Consultas (Admin)
          </h1>
          <p className="text-gray-500">
            Acesso completo a todos os registros médicos.
          </p>
        </div>
        <button
          onClick={exportarCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <FaFileDownload /> Exportar tudo
        </button>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6 flex gap-4 items-center">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por paciente ou médico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Paciente</th>
              <th className="px-6 py-3 text-left">Data</th>
              <th className="px-6 py-3 text-left">Médico / Esp.</th>
              <th className="px-6 py-3 text-left">UBS</th>
              <th className="px-6 py-3 text-left">Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" size={14} />
                  {r.paciente}
                </td>
                <td className="px-6 py-4">
                  <FaCalendarAlt className="inline mr-1" size={12} />
                  {r.data}
                </td>
                <td className="px-6 py-4">
                  {r.medico} <br />
                  <span className="text-xs text-gray-500">
                    {r.especialidade}
                  </span>
                </td>
                <td className="px-6 py-4">{r.ubs}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {r.diagnostico}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoMedicoAdmin;
