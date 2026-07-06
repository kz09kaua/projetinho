// src/pages/paciente/DashboardPaciente.jsx
import { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);
  const [proximasConsultas, setProximasConsultas] = useState([]);
  const [vacinasPendentes, setVacinasPendentes] = useState(0);

  const buscarFila = useCallback(async () => {
    if (!user) return;
    try {
      const filas = await filasService.listar();
      const minha = filas.find(f => f.paciente === user.name);
      setFila(minha || null);
    } catch (error) {
      console.error("Erro ao buscar fila:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      buscarFila();
    } else {
      setFila(null);
    }
  }, [user, buscarFila]);

  // Simula dados de consultas e vacinas (pode integrar com serviços reais)
  useEffect(() => {
    // Exemplo: buscar dados de agendamentos/vacinas
    setProximasConsultas([
      { data: "15/07/2026", especialidade: "Clínica Geral", horario: "14:30" },
    ]);
    setVacinasPendentes(1);
  }, []);

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

  const handleSairFila = async () => {
    if (!fila) return;
    const result = await Swal.fire({
      title: "Sair da fila?",
      text: "Você perderá sua posição atual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sim, sair",
    });
    if (result.isConfirmed) {
      try {
        await filasService.remover(fila.id);
        setFila(null);
        Swal.fire({
          icon: "info",
          title: "Fila cancelada",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Erro ao sair da fila:", error);
        Swal.fire("Erro", "Não foi possível sair da fila.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiUser className="text-blue-600" /> Olá, {nomePaciente}
            </h1>
            <p className="text-gray-500">Acompanhe sua fila e próximos atendimentos.</p>
          </div>
          <button
            onClick={buscarFila}
            className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Atualizar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card principal – fila */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {fila ? "Na Fila de Atendimento" : "Aguardando Atendimento"}
              </span>
              {fila && (
                <button
                  onClick={handleSairFila}
                  className="text-red-500 text-xs hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Sair
                </button>
              )}
            </div>
            {fila ? (
              <>
                <div className="text-center my-8">
                  <p className="text-gray-500 text-sm">Você é o número</p>
                  <span className="text-7xl font-black text-blue-600">{fila.posicao}</span>
                  <p className="text-gray-500 text-sm mt-1">da fila de {fila.especialidade}</p>
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
                <HiUser className="text-5xl mx-auto mb-3 opacity-40" />
                <p>Você não está em nenhuma fila no momento.</p>
                <Link to="/filas-atendimento" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition">
                  Ver filas disponíveis
                </Link>
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

            {/* Próximas consultas */}
            {proximasConsultas.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <HiCalendar size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Próxima consulta</p>
                      <p className="text-xs text-gray-500">{proximasConsultas[0].data} às {proximasConsultas[0].horario}</p>
                    </div>
                  </div>
                  <Link to="/agendamento" className="text-blue-600 text-sm hover:underline">Ver</Link>
                </div>
              </div>
            )}

            {/* Vacinas pendentes */}
            {vacinasPendentes > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                      <FaSyringe size={24} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Vacinas pendentes</p>
                      <p className="text-xs text-gray-500">{vacinasPendentes} dose(s) em atraso</p>
                    </div>
                  </div>
                  <Link to="/vacinação" className="text-blue-600 text-sm hover:underline">Ver</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link to="/agendamento" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiCalendar size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Agendamentos</p>
            <p className="text-xs text-gray-500">Gerencie suas consultas</p>
          </Link>
          <Link to="/vacinação" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-green-100 group-hover:bg-green-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaSyringe size={24} className="text-green-700" />
            </div>
            <p className="font-bold text-gray-800">Vacinas</p>
            <p className="text-xs text-gray-500">Histórico e pendências</p>
          </Link>
          <Link to="/historico-medico" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiClipboardList size={24} className="text-amber-700" />
            </div>
            <p className="font-bold text-gray-800">Histórico</p>
            <p className="text-xs text-gray-500">Consultas realizadas</p>
          </Link>
          <Link to="/sus-conectado" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaFlask size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Exames</p>
            <p className="text-xs text-gray-500">Resultados e agendamentos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPaciente;