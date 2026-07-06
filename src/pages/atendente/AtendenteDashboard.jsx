// src/pages/atendente/AtendenteDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiUsers, HiCalendar, HiBell, HiTrendingUp, HiUserAdd,
  HiClipboardList, HiClock, HiOfficeBuilding,
} from "react-icons/hi";
import { consultasService } from "../../services/consultasService";
import { filasService } from "../../services/filasService";

const AtendenteDashboard = () => {
  const { user, ubsSelecionada, setUbsSelecionada } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "atendente" && !ubsSelecionada) {
      navigate("/selecionar-ubs", { replace: true });
    }
  }, [user, ubsSelecionada, navigate]);

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [horario, setHorario] = useState(new Date());
  const [stats, setStats] = useState({
    agendamentosHoje: 0,
    pacientesAguardando: 0,
    vacinasBaixoEstoque: 0,
    atendimentosHoje: 0,
  });
  const [filasResumo, setFilasResumo] = useState([]);

  const carregarDados = useCallback(async () => {
    if (!ubsSelecionada) return;
    try {
      const consultas = await consultasService.listar();
      const consultasUbs = consultas.filter(c => c.ubs === ubsSelecionada);
      const confirmadas = consultasUbs.filter(c => c.status === "Confirmado").length;
      const aguardando = consultasUbs.filter(c => c.status === "Aguardando").length;

      const filas = await filasService.listar();
      const filasUbs = filas.filter(f => f.ubs === ubsSelecionada);

      // Agrupa por especialidade para o resumo
      const resumo = {};
      filasUbs.forEach(f => {
        if (!resumo[f.especialidade]) {
          resumo[f.especialidade] = 0;
        }
        resumo[f.especialidade]++;
      });

      const resumoArray = Object.entries(resumo).map(([nome, pacientes]) => ({
        nome,
        pacientes,
        cor: ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-red-500"][
          Math.floor(Math.random() * 5)
        ],
      }));

      setStats({
        agendamentosHoje: consultasUbs.length,
        pacientesAguardando: filasUbs.length,
        vacinasBaixoEstoque: 0,
        atendimentosHoje: confirmadas,
      });
      setFilasResumo(resumoArray);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }, [ubsSelecionada]);

  useEffect(() => {
    const timer = setInterval(() => setHorario(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 10000);
    return () => clearInterval(interval);
  }, [carregarDados]);

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

  const horaFormatada = horario.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const dataFormatada = horario.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HiOfficeBuilding className="text-blue-600" size={20} />
            <span className="text-sm font-medium text-blue-700">
              🏥 Atendendo: <strong>{ubsSelecionada}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setUbsSelecionada(null);
              navigate("/selecionar-ubs");
            }}
            className="text-blue-600 underline text-xs"
          >
            Trocar UBS
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiClipboardList className="text-blue-600" /> Painel do Atendente
            </h1>
            <p className="text-gray-500 mt-1">Gerencie atendimentos, filas e estoques da unidade.</p>
          </div>
          <div className="bg-white border rounded-2xl px-5 py-3 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{horaFormatada}</p>
            <p className="text-sm text-gray-500 capitalize">{dataFormatada}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard title="Agendamentos Hoje" value={stats.agendamentosHoje} icon={HiCalendar} link="/agendamento" linkText="Ver agendamentos" />
          <MetricCard title="Aguardando Atendimento" value={stats.pacientesAguardando} icon={HiUsers} link="/gerenciar-filas" linkText="Gerenciar filas" />
          <MetricCard title="Alertas de Estoque" value={stats.vacinasBaixoEstoque} icon={HiBell} link="/estoque-vacinas" linkText="Ver estoque" />
          <MetricCard title="Atendimentos Hoje" value={stats.atendimentosHoje} icon={HiTrendingUp} link="/historico-medico" linkText="Ver histórico" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Atendimento Rápido</h2>
            <p className="text-gray-500 mb-6">Busque um paciente por CPF ou nome para ver histórico, vacinas e agendar consultas.</p>
            <Link to="/historico-medico" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md">
              <HiUserAdd size={20} /> Buscar Paciente
            </Link>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filas Agora</h2>
            {filasResumo.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum paciente na fila.</p>
            ) : (
              <div className="space-y-3">
                {filasResumo.map((fila) => (
                  <div key={fila.nome} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-3 h-3 rounded-full ${fila.cor} shadow-sm`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{fila.nome}</p>
                      <p className="text-xs text-gray-500">{fila.pacientes} paciente(s) aguardando</p>
                    </div>
                    <HiClock className="text-gray-400" size={16} />
                  </div>
                ))}
                <Link to="/gerenciar-filas" className="block text-center text-sm text-blue-600 hover:underline mt-2">
                  Ver todas as filas →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendenteDashboard;