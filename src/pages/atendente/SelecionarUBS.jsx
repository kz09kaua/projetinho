import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ubsService } from "../../services/ubsService";
import { HiOfficeBuilding } from "react-icons/hi";

const SelecionarUBS = () => {
  const { user, ubsSelecionada, setUbsSelecionada } = useAuth();
  const navigate = useNavigate();
  const [ubsList, setUbsList] = useState([]);

  useEffect(() => {
    ubsService.listar().then(setUbsList);
  }, []);

  // Se já tem UBS selecionada, redireciona para dashboard
  useEffect(() => {
    if (ubsSelecionada) {
      navigate("/atendente-dashboard", { replace: true });
    }
  }, [ubsSelecionada, navigate]);

  const handleSelect = (ubs) => {
    setUbsSelecionada(ubs.nome);
    navigate("/atendente-dashboard");
  };

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <HiOfficeBuilding className="mx-auto text-blue-600" size={48} />
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            Selecione sua UBS
          </h1>
          <p className="text-gray-500">
            Em qual unidade você está atendendo hoje?
          </p>
        </div>
        <div className="space-y-3">
          {ubsList.map((ubs) => (
            <button
              key={ubs.id}
              onClick={() => handleSelect(ubs)}
              className="w-full p-4 text-left border rounded-xl hover:bg-blue-50 hover:border-blue-300 transition font-medium text-gray-700"
            >
              {ubs.nome}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelecionarUBS;