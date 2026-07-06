// src/pages/paciente/DashboardPaciente.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar, HiClipboardList, HiClock, HiUser, HiExclamationCircle,
  HiArrowRight, HiCheckCircle, HiBell, HiChartBar, HiSpeakerphone,
} from "react-icons/hi";
import { FaSyringe, FaFlask } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { filasService } from "../../services/filasService";
import { consultasService } from "../../services/consultasService";

const DashboardPaciente = () => {
  const { user } = useAuth();
  const nomePaciente = user?.name || "Paciente";

  const [fila, setFila] = useState(null);
  const [pessoasNaFrente, setPessoasNaFrente] = useState(0);
  const [totalConsultas, setTotalConsultas] = useState(0);
  const [foiChamado, setFoiChamado] = useState(false);

  const carregarDados = useCallback(async () => {
    if (!user) return;
    try {
      const filas = await filasService.listar();
      const minha = filas.find(f => f.paciente === user.name);
      setFila(minha || null);

      if (minha) {
        // Verifica se foi chamado (status "Em Atendimento")
        if (minha.status === "Em Atendimento") {
          setFoiChamado(true);
          setPessoasNaFrente(0);
        } else {
          setFoiChamado(false);
          const frente = filas.filter(
            f => f.especialidade === minha.especialidade && f.ubs === minha.ubs && f.posicao < minha.posicao
          ).length;
          setPessoasNaFrente(frente);
        }
      } else {
        setPessoasNaFrente(0);
        setFoiChamado(false);
      }

      const consultas = await consultasService.listar();
      const minhasConsultas = consultas.filter(c => c.paciente === user.name && !c.arquivado);
      setTotalConsultas(minhasConsultas.length);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    }
  }, [user]);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 5000); // atualiza a cada 5s para detectar chamada
    return () => clearInterval(interval);
  }, [carregarDados]);

  const handleVerDetalhesFila = () => {
    if (!fila) return;
    Swal.fire({
      title: foiChamado ? "🔔 VOCÊ FOI CHAMADO!" : "Detalhes da sua fila",
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Senha:</strong> ${fila.senha}</p>
          <p><strong>Posição:</strong> ${fila.posicao}º</p>
          ${!foiChamado ? `<p><strong>Pessoas na frente:</strong> ${pessoasNaFrente}</p>` : ""}
          <p><strong>Especialidade:</strong> ${fila.especialidade}</p>
          <p><strong>UBS:</strong> ${fila.ubs || "UBS Central"}</p>
          <p><strong>Status:</strong> ${fila.status}</p>
          ${foiChamado ? '<p style="color: green; font-weight: bold;">Dirija-se ao consultório imediatamente!</p>' : ""}
        </div>
      `,
      icon: foiChamado ? "success" : "info",
      confirmButtonColor: foiChamado ? "#22c55e" : "#3b82f6",
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
            <p className="text-gray-500">Acompanhe sua posição na fila e consultas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-3xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 ${
            foiChamado 
              ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 animate-pulse" 
              : "bg-white border-gray-100"
          }`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                foiChamado 
                  ? "bg-white/30 text-white" 
                  : "bg-blue-50 text-blue-700"
              }`}>
                {foiChamado ? (
                  <>
                    <HiSpeakerphone className="text-white" />
                    VOCÊ FOI CHAMADO!
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    {fila ? "Sua posição na fila" : "Fila de espera"}
                  </>
                )}
              </span>
            </div>
            {fila ? (
              foiChamado ? (
                <>
                  <div className="text-center my-8">
                    <HiSpeakerphone className="text-white text-6xl mx-auto mb-4" />
                    <p className="text-white text-2xl font-bold">Compareça ao consultório!</p>
                    <p className="text-white text-lg mt-2">Sua senha <strong className="text-3xl">{fila.senha}</strong> foi chamada.</p>
                    <p className="text-white/80 mt-2">{fila.especialidade} • {fila.ubs || "UBS Central"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/30">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <p className="text-xs font-bold text-white/80 uppercase">Especialidade</p>
                      <p className="text-lg font-bold text-white">{fila.especialidade}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <p className="text-xs font-bold text-white/80 uppercase">Status</p>
                      <p className="text-2xl font-black text-white">CHAMADO</p>
                    </div>
                  </div>
                  <button onClick={handleVerDetalhesFila} className="mt-4 text-white text-sm font-medium hover:underline flex items-center gap-1">
                    Ver detalhes <HiArrowRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center my-8">
                    <p className="text-gray-500 text-sm">Sua senha é</p>
                    <span className="text-7xl font-black text-blue-600">{fila.senha}</span>
                    <p className="text-gray-500 text-sm mt-1">Posição: {fila.posicao}º • {pessoasNaFrente} pessoa(s) na frente</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-400 uppercase">Especialidade</p>
                      <p className="text-lg font-bold text-blue-700">{fila.especialidade}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-400 uppercase">Tempo Estimado</p>
                      <p className="text-2xl font-black text-blue-700">{fila.tempo}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, 100 - (pessoasNaFrente * 15))}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Progresso estimado</p>
                  </div>
                  <button onClick={handleVerDetalhesFila} className="mt-4 text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                    Ver detalhes <HiArrowRight size={14} />
                  </button>
                </>
              )
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>Você não está em nenhuma fila no momento.</p>
                <Link to="/agendamento" className="text-blue-600 hover:underline mt-2 inline-block">
                  Agendar uma consulta
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
                  <p className="font-bold text-gray-800">Consultas agendadas</p>
                  <p className="text-xs text-gray-500">{totalConsultas} consulta(s)</p>
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
            <p className="text-xs text-gray-500">Ver consultas</p>
          </Link>
          <Link to="/vacinação" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-green-100 group-hover:bg-green-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaSyringe size={24} className="text-green-700" />
            </div>
            <p className="font-bold text-gray-800">Vacinas</p>
            <p className="text-xs text-gray-500">Carteira vacinal</p>
          </Link>
          <Link to="/historico-medico" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 transition-all duration-300 flex items-center justify-center mb-3">
              <HiClipboardList size={24} className="text-amber-700" />
            </div>
            <p className="font-bold text-gray-800">Histórico</p>
            <p className="text-xs text-gray-500">Consultas passadas</p>
          </Link>
          <Link to="/sus-conectado" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 flex items-center justify-center mb-3">
              <FaFlask size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Exames</p>
            <p className="text-xs text-gray-500">Resultados</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPaciente;