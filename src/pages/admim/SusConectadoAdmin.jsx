import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiCloud,
  HiRefresh,
  HiDatabase,
  HiClock,
  HiUsers,
  HiClipboardList,
  HiTrendingUp,
  HiDocumentText,
  HiCog,
} from "react-icons/hi";
import Swal from "sweetalert2";

const SusConectadoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  const [indicadores, setIndicadores] = useState({
    coberturaVacinal: 78,
    mediaEspera: 45,
    leitosOcupados: 82,
    transplantes: 340,
    examesRealizados: 12890,
  });

  const [syncing, setSyncing] = useState(false);

  const sincronizar = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIndicadores((prev) => ({
      ...prev,
      coberturaVacinal: Math.floor(70 + Math.random() * 20),
      mediaEspera: Math.floor(30 + Math.random() * 30),
      leitosOcupados: Math.floor(70 + Math.random() * 25),
    }));
    setSyncing(false);
    Swal.fire("Sincronizado!", "", "success");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            SUS Conectado (Admin)
          </h1>
          <p className="text-gray-500">
            Painel de integração nacional e dados estratégicos.
          </p>
        </div>
        <button
          onClick={sincronizar}
          disabled={syncing}
          className="bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <HiRefresh className={syncing ? "animate-spin" : ""} /> Sincronizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border">
          <HiDatabase className="text-blue-600 text-2xl mb-2" />
          <p className="font-bold text-2xl">{indicadores.coberturaVacinal}%</p>
          <p className="text-gray-500">Cobertura vacinal (BR)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <HiClock className="text-amber-600 text-2xl mb-2" />
          <p className="font-bold text-2xl">{indicadores.mediaEspera} dias</p>
          <p className="text-gray-500">Média de espera por especialista</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <HiUsers className="text-red-600 text-2xl mb-2" />
          <p className="font-bold text-2xl">{indicadores.leitosOcupados}%</p>
          <p className="text-gray-500">Leitos SUS ocupados</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Ações de Administração</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100">
            Forçar sincronização
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100">
            Ver logs de integração
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100">
            Atualizar parâmetros DataSUS
          </button>
          <button className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100">
            Relatório gerencial
          </button>
        </div>
      </div>
    </div>
  );
};

export default SusConectadoAdmin;
