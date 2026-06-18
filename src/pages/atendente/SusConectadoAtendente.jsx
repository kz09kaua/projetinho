import { useState, useEffect } from "react";
import {
  HiCloud,
  HiRefresh,
  HiDatabase,
  HiClock,
  HiUsers,
  HiClipboardList,
  HiTrendingUp,
  HiCalendar,
  HiLocationMarker,
  HiDocumentText,
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchDados = async () => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const novosIndicadores = {
          coberturaVacinal: Math.floor(70 + Math.random() * 20),
          mediaEspera: Math.floor(30 + Math.random() * 30),
          leitosOcupados: Math.floor(70 + Math.random() * 25),
        };
        const novaProducao = Math.floor(900 + Math.random() * 200);
        const now = new Date();
        const hora = now.getHours().toString().padStart(2, "0");
        const minuto = now.getMinutes().toString().padStart(2, "0");

        setIndicadores(novosIndicadores);
        setUbsData((prev) => ({
          ...prev,
          producaoMensal: novaProducao,
          ultimaSincronizacao: `Hoje, ${hora}:${minuto}`,
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

  // Verificação extra de segurança (só atendente acessa)
  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Acesso negado</h1>
          <p className="text-on-surface-variant">
            Esta área é restrita a atendentes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface">
            🌐 SUS Conectado - Painel do Atendente
          </h1>
          <p className="text-on-surface-variant">
            Monitoramento de indicadores nacionais e da sua unidade.
          </p>
        </div>
        <button
          onClick={sincronizar}
          disabled={syncing}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          <HiRefresh className={`${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Sincronizando..." : "Sincronizar agora"}
        </button>
      </div>

      {/* Status da conexão */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
          <HiCloud className="text-green-700 dark:text-green-400 text-2xl" />
        </div>
        <div>
          <p className="font-bold text-green-800 dark:text-green-300">
            ✅ Conexão com o DataSUS estabelecida
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            Última sincronização: {ubsData.ultimaSincronizacao}
          </p>
        </div>
      </div>

      {/* Grid de cards principais */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Indicadores Nacionais */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <HiDatabase className="text-blue-700 dark:text-blue-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Indicadores Nacionais
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300">
                  Cobertura vacinal (BR)
                </span>
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {indicadores.coberturaVacinal}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${indicadores.coberturaVacinal}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Média de espera por especialista
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {indicadores.mediaEspera} dias
              </span>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Leitos SUS ocupados
              </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {indicadores.leitosOcupados}%
              </span>
            </div>
          </div>
        </div>

        {/* Dados da UBS + resumo de filas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <HiUsers className="text-green-700 dark:text-green-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Resumo da Unidade
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Código SUS
              </span>
              <span className="font-mono font-bold">{ubsData.codigoSUS}</span>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Produção mensal
              </span>
              <span className="font-bold text-green-700 dark:text-green-400">
                {ubsData.producaoMensal} atendimentos
              </span>
            </div>
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Pacientes na fila hoje
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {resumoFilas.totalPacientes}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Clínica
                </p>
                <p className="font-bold text-lg">{resumoFilas.clinicaGeral}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-center">
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Pediatria
                </p>
                <p className="font-bold text-lg">{resumoFilas.pediatria}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                <p className="text-xs text-green-600 dark:text-green-400">
                  Vacinação
                </p>
                <p className="font-bold text-lg">{resumoFilas.vacinacao}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <Link
          to="/gerenciar-filas"
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 border dark:border-gray-700 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <HiClipboardList className="text-amber-700 dark:text-amber-400 text-2xl" />
          </div>
          <div>
            <p className="font-bold">Gerenciar Filas</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Acompanhe e chame pacientes
            </p>
          </div>
        </Link>
        <Link
          to="/agendamento"
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 border dark:border-gray-700 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <HiCalendar className="text-blue-700 dark:text-blue-400 text-2xl" />
          </div>
          <div>
            <p className="font-bold">Agendamentos</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie consultas e horários
            </p>
          </div>
        </Link>
        <Link
          to="/estoque-vacinas"
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 border dark:border-gray-700 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <HiTrendingUp className="text-green-700 dark:text-green-400 text-2xl" />
          </div>
          <div>
            <p className="font-bold">Estoque de Vacinas</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Controle de lotes e validades
            </p>
          </div>
        </Link>
      </div>

      {/* Histórico de sincronizações */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <HiDocumentText className="text-gray-500" />
          Registros de Sincronização
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <HiClock className="text-gray-400" />
              <div>
                <p className="font-medium">Sincronização completa</p>
                <p className="text-xs text-gray-500">DataSUS + UBS Central</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {ubsData.ultimaSincronizacao}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <HiLocationMarker className="text-gray-400" />
              <div>
                <p className="font-medium">Atualização de estoque</p>
                <p className="text-xs text-gray-500">
                  Envio para base nacional
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">Hoje, 07:45</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700 pt-6">
        Dados simulados para demonstração. Em produção, integre com a API
        oficial do DataSUS.
      </div>
    </div>
  );
};

export default SusConectadoAtendente;
