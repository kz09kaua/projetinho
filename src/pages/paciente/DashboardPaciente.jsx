// src/pages/paciente/DashboardPaciente.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar,
  HiClipboardList,
  HiClock,
  HiUser,
  HiExclamationCircle,
  HiArrowRight,
  HiCheckCircle,
  HiBell,
  HiChartBar,
  HiHome,
} from "react-icons/hi";
import { FaSyringe, FaFlask, FaHeartbeat } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

const DashboardPaciente = () => {
  const { user } = useAuth ? useAuth() : { user: null };
  const nomePaciente = user?.name || "Maria Silva";

  const [fila, setFila] = useState({
    senha: "A-142",
    posicao: 4,
    tempo: "12 min",
    especialidade: "Clínica Geral",
    sala: "03",
    status: "Aguardando",
  });

  const [chamadasAtivas] = useState([
    { senha: "A-45", especialidade: "Clínica", status: "Chamado" },
    { senha: "P-12", especialidade: "Pediatria", status: "Aguardando" },
  ]);

  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setFila((prev) => ({
        ...prev,
        posicao: Math.max(1, prev.posicao - 1),
        tempo: `${Math.max(1, parseInt(prev.tempo) - 1)} min`,
      }));
      setUltimaAtualizacao(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleVerDetalhesFila = () => {
    Swal.fire({
      title: "Detalhes da sua fila",
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Senha:</strong> ${fila.senha}</p>
          <p><strong>Posição:</strong> ${fila.posicao}º</p>
          <p><strong>Tempo estimado:</strong> ${fila.tempo}</p>
          <p><strong>Especialidade:</strong> ${fila.especialidade}</p>
          <p><strong>Sala:</strong> ${fila.sala}</p>
          <p><strong>Status:</strong> ${fila.status}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Fechar",
    });
  };

  const handleAjuda = () => {
    Swal.fire({
      title: "Precisa de ajuda?",
      text: "Um atendente será chamado para auxiliá-lo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Chamar atendente",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Atendente chamado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleNotificacao = () => {
    Swal.fire({
      title: "Notificações",
      html: `
        <div style="text-align:left;">
          <p>🔔 Você tem 2 notificações não lidas</p>
          <hr style="margin: 10px 0;" />
          <p>📅 Consulta confirmada para amanhã às 14h</p>
          <p>💉 Vacinação pendente - compareça ao posto</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Ver todas",
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiUser className="text-blue-600" /> Olá, {nomePaciente}
            </h1>
            <p className="text-gray-500">
              Sua consulta está confirmada para hoje.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNotificacao}
              className="relative p-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <HiBell size={22} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200">
              <p className="text-xs text-gray-400">Última atualização</p>
              <p className="text-sm font-medium text-gray-700">
                {ultimaAtualizacao.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status da Fila */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Chamada Ativa
              </span>
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase">Local</p>
                <p className="text-blue-700 text-xl font-bold">
                  Sala {fila.sala}
                </p>
              </div>
            </div>

            <div className="text-center my-8">
              <p className="text-gray-500 text-sm">Você é o número</p>
              <span className="text-7xl font-black text-blue-600">
                {fila.posicao}
              </span>
              <p className="text-gray-500 text-sm mt-1">da fila de espera</p>
              <p className="text-sm text-gray-400 mt-3">
                Senha: <strong className="text-blue-600">{fila.senha}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-400 uppercase">
                  Senha Atual
                </p>
                <p className="text-2xl font-black text-blue-700">{fila.senha}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-400 uppercase">
                  Tempo Estimado
                </p>
                <p className="text-2xl font-black text-blue-700">
                  {fila.tempo}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Check-in</span>
                <span>Triagem</span>
                <span className="text-blue-700 font-bold">Aguardando</span>
                <span>Finalizado</span>
              </div>
            </div>

            <button
              onClick={handleVerDetalhesFila}
              className="mt-4 text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 hover:text-blue-800 transition"
            >
              Ver detalhes <HiArrowRight size={14} />
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                <HiClock className="text-blue-400" /> Chamadas Ativas
              </h3>
              <div className="space-y-3">
                {chamadasAtivas.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/5"
                  >
                    <div>
                      <p className="text-xs text-gray-300">
                        {item.especialidade}
                      </p>
                      <p className="font-bold text-lg">{item.senha}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        item.status === "Chamado"
                          ? "bg-green-500 text-white animate-pulse"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAjuda}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-6 rounded-3xl flex justify-between items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-left">
                <p className="text-sm opacity-80">Precisa de ajuda?</p>
                <p className="font-bold text-lg">Falar com recepção</p>
              </div>
              <HiExclamationCircle size={32} className="opacity-80" />
            </button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <HiCheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Check-in realizado</p>
                  <p className="text-xs text-gray-500">Compareça à sala 03</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link
            to="/agendamento"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiCalendar size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Agendamentos</p>
            <p className="text-xs text-gray-500">Próximo: 22/10</p>
          </Link>

          <Link
            to="/vacinação"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 group-hover:bg-green-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaSyringe size={24} className="text-green-700" />
            </div>
            <p className="font-bold text-gray-800">Vacinas</p>
            <p className="text-xs text-gray-500">1 pendente</p>
          </Link>

          <Link
            to="/historico-medico"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiClipboardList size={24} className="text-amber-700" />
            </div>
            <p className="font-bold text-gray-800">Histórico</p>
            <p className="text-xs text-gray-500">12 consultas</p>
          </Link>

          <Link
            to="/sus-conectado"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaFlask size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Exames</p>
            <p className="text-xs text-gray-500">3 resultados</p>
          </Link>
        </div>


      </div>
    </div>
  );
};

export default DashboardPaciente;