// src/pages/AtendenteDashboard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiUsers,
  HiCalendar,
  HiClipboardList,
  HiBell,
  HiTrendingUp,
  HiUserAdd,
  HiClock,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const AtendenteDashboard = () => {
  const [stats, setStats] = useState({
    agendamentosHoje: 24,
    pacientesAguardando: 12,
    vacinasBaixoEstoque: 3,
    atendimentosHoje: 18,
  });

  const [horario, setHorario] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHorario(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const horaFormatada = horario.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dataFormatada = horario.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface">
            Painel do Atendente
          </h1>
          <p className="text-on-surface-variant">
            Bem-vindo, atendente. Aqui você pode gerenciar atendimentos e
            estoques.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{horaFormatada}</p>
          <p className="text-sm text-on-surface-variant">{dataFormatada}</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-on-surface-variant">
                Agendamentos Hoje
              </p>
              <p className="text-3xl font-black text-on-surface mt-1">
                {stats.agendamentosHoje}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <HiCalendar className="text-primary text-2xl" />
            </div>
          </div>
          <Link
            to="/agendamento"
            className="text-xs text-primary mt-3 inline-block"
          >
            Ver agendamentos →
          </Link>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-on-surface-variant">
                Aguardando Atendimento
              </p>
              <p className="text-3xl font-black text-on-surface mt-1">
                {stats.pacientesAguardando}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <HiUsers className="text-amber-600 text-2xl" />
            </div>
          </div>
          <Link
            to="/gerenciar-filas"
            className="text-xs text-primary mt-3 inline-block"
          >
            Gerenciar filas →
          </Link>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-on-surface-variant">
                Alertas de Estoque
              </p>
              <p className="text-3xl font-black text-error mt-1">
                {stats.vacinasBaixoEstoque}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <HiBell className="text-error text-2xl" />
            </div>
          </div>
          <Link
            to="/estoque-vacinas"
            className="text-xs text-primary mt-3 inline-block"
          >
            Ver estoque →
          </Link>
        </div>

        <div className="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-on-surface-variant">
                Atendimentos Hoje
              </p>
              <p className="text-3xl font-black text-on-surface mt-1">
                {stats.atendimentosHoje}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <HiTrendingUp className="text-green-600 text-2xl" />
            </div>
          </div>
          <Link
            to="/historico-atendimentos"
            className="text-xs text-primary mt-3 inline-block"
          >
            Ver histórico →
          </Link>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-black mb-4">Atendimento Rápido</h2>
          <p className="opacity-90 mb-6">
            Busque um paciente por CPF para agendar consulta, registrar vacina
            ou ver histórico.
          </p>
          <Link
            to="/buscar-paciente"
            className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2 rounded-xl font-bold hover:bg-opacity-90 transition"
          >
            <HiUserAdd size={20} /> Buscar Paciente
          </Link>
        </div>

        <div className="bg-surface rounded-2xl border border-outline-variant p-6">
          <h2 className="text-xl font-black text-on-surface mb-4">
            Atendimentos do Dia
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-surface-container-high rounded-xl">
              <div>
                <p className="font-bold">Maria Silva</p>
                <p className="text-xs text-on-surface-variant">
                  Clínica Geral - 09:30
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Confirmado
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-container-high rounded-xl">
              <div>
                <p className="font-bold">João Santos</p>
                <p className="text-xs text-on-surface-variant">
                  Pediatria - 10:00
                </p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Aguardando
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-container-high rounded-xl">
              <div>
                <p className="font-bold">Ana Paula Costa</p>
                <p className="text-xs text-on-surface-variant">
                  Vacinação - 11:15
                </p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Agendado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendenteDashboard;
