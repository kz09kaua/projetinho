import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiCalendar,
  HiUser,
  HiClock,
  HiChartBar,
  HiPrinter,
  HiPlus,
  HiSearch,
} from "react-icons/hi";
import Swal from "sweetalert2";

const AgendamentoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  const [medicos] = useState([
    {
      id: 1,
      nome: "Dra. Ana",
      especialidade: "Clínica Geral",
      consultasHoje: 12,
    },
    {
      id: 2,
      nome: "Dr. Carlos",
      especialidade: "Cardiologia",
      consultasHoje: 8,
    },
    { id: 3, nome: "Dr. Paulo", especialidade: "Pediatria", consultasHoje: 6 },
  ]);

  const [totalConsultas] = useState(26);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gerenciamento de Agendamentos (Admin)
          </h1>
          <p className="text-gray-500">
            Controle total sobre consultas e horários.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <HiPlus /> Novo Agendamento
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <HiPrinter /> Relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between">
            <span className="text-gray-500">Consultas hoje</span>
            <HiCalendar size={24} className="text-blue-600" />
          </div>
          <p className="text-4xl font-bold mt-2">{totalConsultas}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between">
            <span className="text-gray-500">Médicos ativos</span>
            <HiUser size={24} className="text-green-600" />
          </div>
          <p className="text-4xl font-bold mt-2">{medicos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between">
            <span className="text-gray-500">Ocupação média</span>
            <HiChartBar size={24} className="text-purple-600" />
          </div>
          <p className="text-4xl font-bold mt-2">78%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Carga por Médico</h2>
        <div className="space-y-4">
          {medicos.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-bold">{m.nome}</p>
                <p className="text-sm text-gray-500">{m.especialidade}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{m.consultasHoje} consultas</p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(m.consultasHoje / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100">
            Bloquear agenda
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100">
            Adicionar médico
          </button>
          <button className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100">
            Feriados/Exceções
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100">
            Histórico de alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoAdmin;
