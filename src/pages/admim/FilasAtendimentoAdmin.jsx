import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiUsers,
  HiClock,
  HiTrendingUp,
  HiPrinter,
  HiFilter,
  HiSearch,
  HiArrowRight,
  HiX,
} from "react-icons/hi";
import Swal from "sweetalert2";

const FilasAtendimentoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin") {
    return (
      <div className="text-center text-red-500 mt-20">Acesso restrito.</div>
    );
  }

  const [filas, setFilas] = useState([
    {
      id: 1,
      ubs: "UBS Central",
      especialidade: "Clínica Geral",
      pacientes: 8,
      tempoMedio: 14,
      prioridades: 2,
    },
    {
      id: 2,
      ubs: "UBS Norte",
      especialidade: "Pediatria",
      pacientes: 3,
      tempoMedio: 9,
      prioridades: 0,
    },
    {
      id: 3,
      ubs: "UBS Leste",
      especialidade: "Vacinação",
      pacientes: 5,
      tempoMedio: 6,
      prioridades: 1,
    },
  ]);

  const [ubsFiltro, setUbsFiltro] = useState("");

  const filtered = ubsFiltro ? filas.filter((f) => f.ubs === ubsFiltro) : filas;

  const exportarRelatorio = () => {
    Swal.fire({
      icon: "success",
      title: "Relatório exportado",
      text: "Um arquivo CSV foi gerado com os dados das filas.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Monitoramento de Filas (Admin)
          </h1>
          <p className="text-gray-500">Visão gerencial de todas as unidades.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportarRelatorio}
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <HiPrinter /> Exportar
          </button>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between">
            <span className="text-gray-500">Total de pacientes</span>
            <HiUsers size={24} className="text-blue-600" />
          </div>
          <p className="text-4xl font-bold mt-2">
            {filas.reduce((s, f) => s + f.pacientes, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between">
            <span className="text-gray-500">Tempo médio geral</span>
            <HiClock size={24} className="text-amber-600" />
          </div>
          <p className="text-4xl font-bold mt-2">
            {Math.round(
              filas.reduce((s, f) => s + f.tempoMedio, 0) / filas.length,
            )}{" "}
            min
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between">
            <span className="text-gray-500">Prioridades ativas</span>
            <HiTrendingUp size={24} className="text-red-600" />
          </div>
          <p className="text-4xl font-bold mt-2">
            {filas.reduce((s, f) => s + f.prioridades, 0)}
          </p>
        </div>
      </div>

      {/* Filtro */}
      <div className="bg-white p-4 rounded-2xl border mb-6 flex gap-4 items-center">
        <HiFilter className="text-gray-400" />
        <select
          value={ubsFiltro}
          onChange={(e) => setUbsFiltro(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">Todas as UBS</option>
          {[...new Set(filas.map((f) => f.ubs))].map((ubs) => (
            <option key={ubs} value={ubs}>
              {ubs}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de filas por UBS */}
      <div className="space-y-6">
        {filtered.map((fila) => (
          <div key={fila.id} className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {fila.ubs} - {fila.especialidade}
              </h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {fila.pacientes} pacientes
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tempo médio</p>
                <p className="font-bold">{fila.tempoMedio} min</p>
              </div>
              <div>
                <p className="text-gray-500">Prioridades</p>
                <p className="font-bold text-red-600">{fila.prioridades}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Abrir fila completa
              </button>
              <button className="border px-4 py-2 rounded-lg">Reordenar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilasAtendimentoAdmin;
