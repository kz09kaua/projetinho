// src/pages/AtendenteDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiUsers,
  HiCalendar,
  HiBell,
  HiTrendingUp,
  HiUserAdd,
  HiClipboardList,
  HiClock,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const AtendenteDashboard = () => {
  const { user } = useAuth();

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [horario, setHorario] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHorario(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    agendamentosHoje: 24,
    pacientesAguardando: 12,
    vacinasBaixoEstoque: 3,
    atendimentosHoje: 18,
  };

  const filasResumo = [
    { nome: "Clínica Geral", pacientes: 8, cor: "bg-blue-500" },
    { nome: "Pediatria", pacientes: 3, cor: "bg-green-500" },
    { nome: "Vacinação", pacientes: 5, cor: "bg-purple-500" },
  ];

  const MetricCard = ({ title, value, icon: Icon, link, linkText }) => (
    <Link
      to={link}
      className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-bold mt-3 text-gray-800">{value}</p>
      {linkText && (
        <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
          {linkText} <span className="text-lg">→</span>
        </p>
      )}
    </Link>
  );

  const horaFormatada = horario.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dataFormatada = horario.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiClipboardList className="text-blue-600" /> Painel do Atendente
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie atendimentos, filas e estoques da unidade.
            </p>
          </div>
          <div className="bg-white border rounded-2xl px-5 py-3 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{horaFormatada}</p>
            <p className="text-sm text-gray-500 capitalize">{dataFormatada}</p>
          </div>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Agendamentos Hoje"
            value={stats.agendamentosHoje}
            icon={HiCalendar}
            link="/agendamento"
            linkText="Ver agendamentos"
          />
          <MetricCard
            title="Aguardando Atendimento"
            value={stats.pacientesAguardando}
            icon={HiUsers}
            link="/gerenciar-filas"
            linkText="Gerenciar filas"
          />
          <MetricCard
            title="Alertas de Estoque"
            value={stats.vacinasBaixoEstoque}
            icon={HiBell}
            link="/estoque-vacinas"
            linkText="Ver estoque"
          />
          <MetricCard
            title="Atendimentos Hoje"
            value={stats.atendimentosHoje}
            icon={HiTrendingUp}
            link="/historico-medico" // ✅ Corrigido para rota existente
            linkText="Ver histórico"
          />
        </div>

        {/* Atendimento rápido + Resumo das filas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Atendimento Rápido
            </h2>
            <p className="text-gray-500 mb-6">
              Busque um paciente por CPF ou nome para ver histórico, vacinas e
              agendar consultas.
            </p>
            <Link
              to="/historico-medico" // ✅ Link para a página de histórico (que possui busca)
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md"
            >
              <HiUserAdd size={20} /> Buscar Paciente
            </Link>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Filas Agora
            </h2>
            <div className="space-y-3">
              {filasResumo.map((fila) => (
                <div
                  key={fila.nome}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${fila.cor} shadow-sm`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {fila.nome}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fila.pacientes} paciente(s) aguardando
                    </p>
                  </div>
                  <HiClock className="text-gray-400" size={16} />
                </div>
              ))}
              <Link
                to="/gerenciar-filas"
                className="block text-center text-sm text-blue-600 hover:underline mt-2"
              >
                Ver todas as filas →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendenteDashboard;
