// src/pages/SusConectadoAtendente.jsx
import { useState, useEffect } from "react";
import {
  HiCloud,
  HiRefresh,
  HiDatabase,
  HiClock,
  HiUsers,
  HiClipboardList,
  HiCalendar,
  HiLocationMarker,
  HiDocumentText,
  HiTrendingUp,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

const SusConectadoAtendente = () => {
  const { user } = useAuth();

  const [indicadores, setIndicadores] = useState({
    coberturaVacinal: 78,
    mediaEspera: 45,
    leitosOcupados: 82,
  });

  const [ubsData, setUbsData] = useState({
    codigoSUS: "1234567-89",
    producaoMensal: 980,
    ultimaSincronizacao: "Hoje, 08:32",
  });

  const [resumoFilas, setResumoFilas] = useState({
    clinicaGeral: 8,
    pediatria: 3,
    vacinacao: 5,
    totalPacientes: 16,
  });

  const [syncing, setSyncing] = useState(false);

  const fetchDados = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIndicadores({
          coberturaVacinal: Math.floor(70 + Math.random() * 20),
          mediaEspera: Math.floor(30 + Math.random() * 30),
          leitosOcupados: Math.floor(70 + Math.random() * 25),
        });
        setUbsData((prev) => ({
          ...prev,
          producaoMensal: Math.floor(900 + Math.random() * 200),
          ultimaSincronizacao: `Hoje, ${new Date().getHours().toString().padStart(2, "0")}:${new Date()
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        }));
        setResumoFilas({
          clinicaGeral: Math.floor(Math.random() * 15) + 5,
          pediatria: Math.floor(Math.random() * 5) + 1,
          vacinacao: Math.floor(Math.random() * 10) + 2,
          totalPacientes: Math.floor(Math.random() * 30) + 10,
        });
        resolve();
      }, 800);
    });
  };

  const sincronizar = async () => {
    setSyncing(true);
    await fetchDados();
    setSyncing(false);
    Swal.fire({
      icon: "success",
      title: "Sincronizado!",
      text: "Dados nacionais e da sua UBS foram atualizados.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  useEffect(() => {
    fetchDados();
  }, []);

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso negado</h1>
          <p className="text-gray-500">Esta área é restrita a atendentes.</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { to: "/gerenciar-filas", icon: HiClipboardList, title: "Gerenciar Filas", desc: "Acompanhe e chame pacientes" },
    { to: "/agendamento", icon: HiCalendar, title: "Agendamentos", desc: "Gerencie consultas e horários" },
    { to: "/estoque-vacinas", icon: HiTrendingUp, title: "Estoque de Vacinas", desc: "Controle de lotes e validades" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiCloud className="text-blue-600" /> SUS Conectado
            </h1>
            <p className="text-gray-500 mt-1">
              Monitoramento de indicadores nacionais e da sua unidade.
            </p>
          </div>
          <button
            onClick={sincronizar}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <HiRefresh className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>

        <div className="bg-white border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <HiCloud className="text-white text-xl" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Conexão com o DataSUS estabelecida</p>
            <p className="text-sm text-gray-500">Última sincronização: {ubsData.ultimaSincronizacao}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <HiDatabase size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Indicadores Nacionais</h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Cobertura vacinal (BR)</span>
                  <span className="font-bold text-gray-800">{indicadores.coberturaVacinal}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${indicadores.coberturaVacinal}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Média de espera por especialista</span>
                <span className="font-bold text-gray-800">{indicadores.mediaEspera} dias</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Leitos SUS ocupados</span>
                <span className="font-bold text-gray-800">{indicadores.leitosOcupados}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                <HiUsers size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Resumo da Unidade</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Código SUS</span>
                <span className="font-mono font-bold text-gray-800">{ubsData.codigoSUS}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Produção mensal</span>
                <span className="font-bold text-gray-800">{ubsData.producaoMensal} atendimentos</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Pacientes na fila hoje</span>
                <span className="font-bold text-gray-800">{resumoFilas.totalPacientes}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { label: "Clínica", value: resumoFilas.clinicaGeral, color: "from-blue-400 to-blue-500" },
                  { label: "Pediatria", value: resumoFilas.pediatria, color: "from-green-400 to-green-500" },
                  { label: "Vacinação", value: resumoFilas.vacinacao, color: "from-purple-400 to-purple-500" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 p-3 rounded-xl text-center border hover:shadow-sm transition"
                  >
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-bold text-lg text-gray-800">{item.value}</p>
                    <div className={`w-full h-1 mt-1 rounded-full bg-gradient-to-r ${item.color}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white rounded-2xl p-5 border hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <link.icon className="text-white text-2xl" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{link.title}</p>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HiDocumentText className="text-gray-400" />
            Registros de Sincronização
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiClock className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">Sincronização completa</p>
                  <p className="text-xs text-gray-500">DataSUS + UBS Central</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{ubsData.ultimaSincronizacao}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiLocationMarker className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">Atualização de estoque</p>
                  <p className="text-xs text-gray-500">Envio para base nacional</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Hoje, 07:45</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          Dados simulados para demonstração. Em produção, integre com a API oficial do DataSUS.
        </p>
      </div>
    </div>
  );
};

export default SusConectadoAtendente;