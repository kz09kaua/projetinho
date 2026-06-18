import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ChatAtendimento from "../../components/ChatAtendimento";

const FilasAtendimentoAttendente = () => {
  const { user } = useAuth();
  // Essa página é exclusiva para atendente, mas mantemos verificação interna
  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [fila, setFila] = useState([
    {
      posicao: 1,
      paciente: "José Souza",
      prioridade: "Normal",
      tempo: "10 min",
      senha: "G-108",
      status: "Aguardando",
    },
    {
      posicao: 2,
      paciente: "Maria Lima",
      prioridade: "Alta",
      tempo: "5 min",
      senha: "P-042",
      status: "Em Atendimento",
    },
    {
      posicao: 3,
      paciente: "Pedro Santos",
      prioridade: "Normal",
      tempo: "15 min",
      senha: "G-110",
      status: "Aguardando",
    },
  ]);

  const estatisticasAtendente = {
    totalPacientes: 24,
    emAtendimento: 5,
    tempoMedio: "12 min",
    prioridades: 3,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Painel de Filas
          </h1>
          <p className="text-gray-500">
            Gerencie as filas e atendimentos da unidade.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
            Chamar Próximo
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl">
            Nova Fila
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Pacientes</p>
          <p className="text-2xl font-bold text-blue-600">
            {estatisticasAtendente.totalPacientes}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Em Atendimento</p>
          <p className="text-2xl font-bold text-green-600">
            {estatisticasAtendente.emAtendimento}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Tempo Médio</p>
          <p className="text-2xl font-bold text-orange-600">
            {estatisticasAtendente.tempoMedio}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Prioridades</p>
          <p className="text-2xl font-bold text-red-600">
            {estatisticasAtendente.prioridades}
          </p>
        </div>
      </div>

      {/* Lista de filas */}
      <h3 className="text-xl font-bold mb-4">Todas as Filas</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fila.map((item) => (
          <div
            key={item.senha}
            className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl ${item.prioridade === "Alta" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}
              >
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <div className="flex gap-1">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.prioridade === "Alta"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100"
                  }`}
                >
                  {item.prioridade === "Alta" ? "PRIORIDADE" : "NORMAL"}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {item.status}
                </span>
              </div>
            </div>
            <h4 className="font-bold text-lg">{item.paciente}</h4>
            <p className="text-sm text-gray-500 mb-3">Clínica Geral</p>
            <div className="grid grid-cols-2 gap-3 my-4">
              <div>
                <p className="text-xs text-gray-400">Senha</p>
                <p className="text-xl font-bold">{item.senha}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Espera</p>
                <p className="text-xl font-bold">{item.tempo}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">
                Chamar
              </button>
              <button className="flex-1 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat exclusivo do atendente */}
      <ChatAtendimento />
    </div>
  );
};

export default FilasAtendimentoAttendente;
