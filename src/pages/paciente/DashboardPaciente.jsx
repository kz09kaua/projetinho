// src/pages/DashboardPaciente.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar,
  HiClipboardList,
  HiHeart,
  HiQrcode,
  HiClock,
  HiUser,
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowRight,
  HiEye,
} from "react-icons/hi";
import { FaSyringe, FaFlask } from "react-icons/fa";
import Swal from "sweetalert2";

const DashboardPaciente = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setFila((prev) => ({
        ...prev,
        posicao: Math.max(1, prev.posicao - 1),
        tempo: `${Math.max(1, parseInt(prev.tempo) - 1)} min`,
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckinQR = () => {
    Swal.fire({
      title: "Check-in via QR Code",
      text: "Leia o QR Code na recepção para confirmar sua presença.",
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Ok",
    });
  };

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
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  const handleAjuda = () => {
    Swal.fire({
      title: "Precisa de ajuda?",
      text: "Um atendente será chamado para auxiliá-lo.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiUser className="text-blue-600" /> Olá, Maria Silva
            </h1>
            <p className="text-gray-500">
              Sua consulta está confirmada para hoje.
            </p>
          </div>
          <button
            onClick={handleCheckinQR}
            className="bg-white hover:bg-gray-50 px-5 py-3 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 transition"
          >
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Check-in via
              </p>
              <p className="font-bold text-gray-800">QR Code</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HiQrcode size={28} className="text-blue-700" />
            </div>
          </button>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
              <span className="text-7xl font-black text-blue-700">
                {fila.posicao}
              </span>
              <p className="text-gray-500 text-sm mt-1">da fila de espera</p>
              <p className="text-sm text-gray-400 mt-3">
                Senha: <strong>{fila.senha}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Senha Atual
                </p>
                <p className="text-2xl font-black">{fila.senha}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-blue-400 uppercase">
                  Tempo Estimado
                </p>
                <p className="text-2xl font-black text-blue-700">
                  {fila.tempo}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-blue-700 rounded-full transition-all duration-500" />
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
              className="mt-4 text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              Ver detalhes <HiArrowRight size={14} />
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 text-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                <HiClock className="text-green-400" /> Ao Vivo
              </h3>
              <div className="space-y-3">
                {chamadasAtivas.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                  >
                    <div>
                      <p className="text-xs text-gray-300">
                        {item.especialidade}
                      </p>
                      <p className="font-bold text-lg">{item.senha}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.status === "Chamado"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-3xl flex justify-between items-center transition shadow-lg"
            >
              <div className="text-left">
                <p className="text-sm opacity-80">Precisa de ajuda?</p>
                <p className="font-bold text-lg">Falar com recepção</p>
              </div>
              <HiExclamationCircle size={32} className="opacity-80" />
            </button>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link
            to="/agendamento"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition flex items-center justify-center mb-3">
              <HiCalendar size={24} className="text-blue-700" />
            </div>
            <p className="font-bold text-gray-800">Agendamentos</p>
            <p className="text-xs text-gray-500">Próximo: 22/10</p>
          </Link>

          <Link
            to="/vacinas"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 group-hover:bg-green-200 transition flex items-center justify-center mb-3">
              <FaSyringe size={24} className="text-green-700" />
            </div>
            <p className="font-bold text-gray-800">Vacinas</p>
            <p className="text-xs text-gray-500">1 pendente</p>
          </Link>

          <Link
            to="/historico"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 transition flex items-center justify-center mb-3">
              <HiClipboardList size={24} className="text-amber-700" />
            </div>
            <p className="font-bold text-gray-800">Histórico</p>
            <p className="text-xs text-gray-500">12 consultas</p>
          </Link>

          <Link
            to="/sus-conectado"
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition flex items-center justify-center mb-3">
              <FaFlask size={24} className="text-purple-700" />
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
