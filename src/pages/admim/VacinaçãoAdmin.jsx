import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaSyringe,
  FaSearch,
  FaPlus,
  FaFileDownload,
  FaBuilding,
} from "react-icons/fa";
import Swal from "sweetalert2";

const VacinaçãoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  const [estoque, setEstoque] = useState([
    {
      id: 1,
      vacina: "COVID-19",
      ubs: "UBS Central",
      quantidade: 45,
      lote: "AB123",
      validade: "2025-12-31",
    },
    {
      id: 2,
      vacina: "Gripe",
      ubs: "UBS Norte",
      quantidade: 12,
      lote: "GR789",
      validade: "2024-10-15",
    },
    {
      id: 3,
      vacina: "Febre Amarela",
      ubs: "UBS Central",
      quantidade: 5,
      lote: "FA456",
      validade: "2026-01-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filtered = estoque.filter(
    (e) =>
      e.vacina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ubs.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const exportarRelatorio = () => {
    Swal.fire("Exportado!", "Relatório de estoque gerado.", "success");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestão de Vacinas (Admin)
          </h1>
          <p className="text-gray-500">
            Controle de estoque e campanhas em toda a rede.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <FaPlus /> Nova remessa
          </button>
          <button
            onClick={exportarRelatorio}
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <FaFileDownload /> Relatório
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-6 flex gap-4">
        <FaSearch className="text-gray-400 mt-2" />
        <input
          type="text"
          placeholder="Filtrar por vacina ou UBS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Vacina</th>
              <th className="px-6 py-3 text-left">UBS</th>
              <th className="px-6 py-3 text-left">Quantidade</th>
              <th className="px-6 py-3 text-left">Lote</th>
              <th className="px-6 py-3 text-left">Validade</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{e.vacina}</td>
                <td className="px-6 py-4">
                  <FaBuilding className="inline mr-1" size={12} />
                  {e.ubs}
                </td>
                <td className="px-6 py-4">{e.quantidade}</td>
                <td className="px-6 py-4">{e.lote}</td>
                <td className="px-6 py-4">{e.validade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacinaçãoAdmin;
