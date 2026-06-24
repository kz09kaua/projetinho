// src/pages/FilasAtendimentoAttendente.jsx
import { useState } from "react";
import { HiUserGroup, HiClock, HiUsers, HiExclamation } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import ChatAtendimento from "../../components/ChatAtendimento";
import Swal from "sweetalert2";

const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <Icon size={20} />
      </div>
    </div>
    <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
  </div>
);

const FilasAtendimentoAttendente = () => {
  const { user } = useAuth();

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [fila] = useState([
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

  const estatisticas = {
    totalPacientes: 24,
    emAtendimento: 5,
    tempoMedio: "12 min",
    prioridades: 3,
  };

  const chamarPaciente = (paciente) => {
    Swal.fire({
      title: `Chamar ${paciente.paciente}?`,
      text: `Senha: ${paciente.senha}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, chamar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Chamado!", `${paciente.paciente} foi chamado.`, "success");
      }
    });
  };

  const statusBadge = (status) => {
    if (status === "Em Atendimento") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiUserGroup className="text-blue-600" /> Painel de Filas
            </h1>
            <p className="text-gray-500 mt-1">Gerencie as filas e atendimentos da unidade.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2">
              <HiUserGroup size={18} /> Chamar Próximo
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition">
              Nova Fila
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Pacientes" value={estatisticas.totalPacientes} icon={HiUsers} />
          <MetricCard title="Em Atendimento" value={estatisticas.emAtendimento} icon={HiUserGroup} />
          <MetricCard title="Tempo Médio" value={estatisticas.tempoMedio} icon={HiClock} />
          <MetricCard title="Prioridades" value={estatisticas.prioridades} icon={HiExclamation} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pacientes na Fila</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fila.map((item) => (
              <div
                key={item.senha}
                className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${
                  item.prioridade === "Alta" ? "border-l-4 border-l-red-500" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <HiUserGroup size={22} />
                  </div>
                  <div className="flex gap-1">
                    {item.prioridade === "Alta" && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                        Prioridade
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-800">{item.paciente}</h4>
                <p className="text-sm text-gray-500 mb-3">Clínica Geral</p>
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div>
                    <p className="text-xs text-gray-400">Senha</p>
                    <p className="text-xl font-bold text-gray-800">{item.senha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Espera</p>
                    <p className="text-xl font-bold text-gray-800">{item.tempo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => chamarPaciente(item)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                  >
                    Chamar
                  </button>
                  <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChatAtendimento />
      </div>
    </div>
  );
};

export default FilasAtendimentoAttendente;