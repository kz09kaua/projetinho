import { useState, useEffect } from "react";
import { HiCalendar, HiClipboardList, HiHeart, HiQrcode } from "react-icons/hi";

const DashboardPaciente = () => {
  const [fila, setFila] = useState({
    senha: "A-142",
    posicao: 4,
    tempo: "12 min",
  });

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Olá, Maria Silva</h1>
          <p className="text-gray-500">
            Sua consulta está confirmada para hoje.
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-4 border">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Check-in via
            </p>
            <p className="font-bold">QR Code</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <HiQrcode size={28} className="text-blue-700" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex justify-between items-start">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
              Chamada Ativa
            </span>
            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase">Local</p>
              <p className="text-blue-700 text-xl font-bold">Sala 03</p>
            </div>
          </div>
          <div className="text-center my-8">
            <p className="text-gray-500">Você é o número</p>
            <span className="text-6xl font-black text-blue-700">
              {fila.posicao}
            </span>
            <p className="text-gray-500">da fila de espera</p>
            <p className="text-sm text-gray-400 mt-2">Senha: {fila.senha}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
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
              <p className="text-2xl font-black text-blue-700">{fila.tempo}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-blue-700 rounded-full"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Check-in</span>
              <span>Triagem</span>
              <span className="text-blue-700 font-bold">Aguardando</span>
              <span>Finalizado</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 text-white rounded-3xl p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">Ao Vivo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                <div>
                  <p className="text-xs text-gray-300">Clínica</p>
                  <p className="font-bold">A-45</p>
                </div>
                <span className="text-green-400 text-xs">Chamado</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                <div>
                  <p className="text-xs text-gray-300">Pediatria</p>
                  <p className="font-bold">P-12</p>
                </div>
                <span className="text-blue-400 text-xs">Aguardando</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-700 text-white p-6 rounded-3xl flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Precisa de ajuda?</p>
              <p className="font-bold">Falar com recepção</p>
            </div>
            <HiHeart size={32} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow transition cursor-pointer">
          <HiCalendar size={28} className="text-blue-700 mb-3" />
          <p className="font-bold">Agendamentos</p>
          <p className="text-xs text-gray-500">Próximo: 22/10</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow transition cursor-pointer">
          <HiHeart size={28} className="text-green-700 mb-3" />
          <p className="font-bold">Vacinas</p>
          <p className="text-xs text-gray-500">1 pendente</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow transition cursor-pointer">
          <HiClipboardList size={28} className="text-amber-700 mb-3" />
          <p className="font-bold">Histórico</p>
          <p className="text-xs text-gray-500">12 consultas</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow transition cursor-pointer">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-3">
            <span className="text-purple-700 text-2xl">🔬</span>
          </div>
          <p className="font-bold">Exames</p>
          <p className="text-xs text-gray-500">3 resultados</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPaciente;
