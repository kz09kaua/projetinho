// src/pages/paciente/DashboardPaciente.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar, HiClipboardList, HiClock, HiUser, HiExclamationCircle,
  HiArrowRight, HiCheckCircle, HiBell, HiChartBar,
} from "react-icons/hi";
import { FaSyringe, FaFlask } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { filasService } from "../../services/filasService";

const DashboardPaciente = () => {
  const { user } = useAuth();
  const nomePaciente = user?.name || "Paciente";

  const [fila, setFila] = useState(null);

  useEffect(() => {
    const buscarFila = async () => {
      const filas = await filasService.listar();
      const minha = filas.find(f => f.paciente === user?.name);
      if (minha) setFila(minha);
    };
    if (user) buscarFila();
  }, [user]);

  const handleVerDetalhesFila = () => {
    if (!fila) return;
    Swal.fire({
      title: "Detalhes da sua fila",
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Senha:</strong> ${fila.senha}</p>
          <p><strong>Posição:</strong> ${fila.posicao}º</p>
          <p><strong>Tempo estimado:</strong> ${fila.tempo}</p>
          <p><strong>Especialidade:</strong> ${fila.especialidade}</p>
          <p><strong>Status:</strong> ${fila.status}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Fechar",
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiUser className="text-blue-600" /> Olá, {nomePaciente}
            </h1>
            <p className="text-gray-500">Sua consulta está confirmada para hoje.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Chamada Ativa
              </span>
            </div>
            {fila ? (
              <>
                <div className="text-center my-8">
                  <p className="text-gray-500 text-sm">Você é o número</p>
                  <span className="text-7xl font-black text-blue-600">{fila.posicao}</span>
                  <p className="text-gray-500 text-sm mt-1">da fila de espera</p>
                  <p className="text-sm text-gray-400 mt-3">
                    Senha: <strong className="text-blue-600">{fila.senha}</strong>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-400 uppercase">Senha Atual</p>
                    <p className="text-2xl font-black text-blue-700">{fila.senha}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-400 uppercase">Tempo Estimado</p>
                    <p className="text-2xl font-black text-blue-700">{fila.tempo}</p>
                  </div>
                </div>
                <button
                  onClick={handleVerDetalhesFila}
                  className="mt-4 text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  Ver detalhes <HiArrowRight size={14} />
                </button>
              </>
            ) : (
              <div className="text-center py-10 text-gray-400">
                Você não está em nenhuma fila no momento.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <HiCheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Check-in realizado</p>
                  <p className="text-xs text-gray-500">Compareça à sala indicada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link to="/agendamento" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiCalendar size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Agendamentos</p>
            <p className="text-xs text-gray-500">Próximo: 22/10</p>
          </Link>
          <Link to="/vacinação" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-green-100 group-hover:bg-green-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaSyringe size={24} className="text-green-700" />
            </div>
            <p className="font-bold text-gray-800">Vacinas</p>
            <p className="text-xs text-gray-500">1 pendente</p>
          </Link>
          <Link to="/historico-medico" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiClipboardList size={24} className="text-amber-700" />
            </div>
            <p className="font-bold text-gray-800">Histórico</p>
            <p className="text-xs text-gray-500">12 consultas</p>
          </Link>
          <Link to="/sus-conectado" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
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