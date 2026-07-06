// src/pages/paciente/Agendamento.jsx
import { useState, useEffect } from "react";
import {
  HiCalendar, HiClock, HiCheckCircle, HiChevronLeft, HiChevronRight, HiEye,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { consultasService } from "../../services/consultasService";
import { filasService } from "../../services/filasService";

const Agendamento = () => {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [todasConsultas, setTodasConsultas] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("UBS Central");
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  const especialidades = [
    "Clínica Geral", "Ginecologia", "Pediatria", "Psicologia", "Cardiologia", "Dermatologia",
  ];
  const horarios = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  // Carrega consultas do paciente e todas as consultas para verificar disponibilidade
  useEffect(() => {
    if (user) {
      consultasService.listar().then(todas => {
        const minhas = todas.filter(c => c.paciente === user.name && !c.arquivado);
        setConsultas(minhas);
        setTodasConsultas(todas);
      });
    }
  }, [user]);

  // ==================== FUNÇÕES DO CALENDÁRIO (COM BLOQUEIO DE FDS) ====================
  const gerarDiasCalendario = (mes, ano) => {
    const primeiroDia = new Date(ano, mes, 1).getDay(); // 0=Dom, 6=Sáb
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasDoMesAnterior = new Date(ano, mes, 0).getDate();
    const dias = [];

    // Dias do mês anterior (todos indisponíveis)
    for (let i = primeiroDia - 1; i >= 0; i--) {
      dias.push({ dia: diasDoMesAnterior - i, mes: mes - 1, ano, isMesAtual: false, disponivel: false, lotado: false, fds: false });
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let i = 1; i <= diasNoMes; i++) {
      const data = new Date(ano, mes, i);
      const diaSemana = data.getDay(); // 0=Dom, 6=Sáb
      const ehFimDeSemana = diaSemana === 0 || diaSemana === 6; // sábado ou domingo
      const dataPassada = data < hoje;
      const disponivel = !dataPassada && !ehFimDeSemana;

      const dataStr = `${String(i).padStart(2, "0")}/${String(mes + 1).padStart(2, "0")}/${ano}`;
      const consultasNesseDia = todasConsultas.filter(c => c.data === dataStr && c.status !== "Cancelado");
      const lotado = disponivel && consultasNesseDia.length >= horarios.length;

      dias.push({
        dia: i,
        mes,
        ano,
        isMesAtual: true,
        disponivel: disponivel && !lotado,
        lotado,
        fds: ehFimDeSemana,
        passado: dataPassada,
      });
    }

    // Completar grade
    const totalDias = dias.length;
    for (let i = 1; i <= 42 - totalDias; i++) {
      dias.push({ dia: i, mes: mes + 1, ano, isMesAtual: false, disponivel: false, lotado: false, fds: false });
    }
    return dias;
  };

  // Verifica se um horário está disponível na data selecionada
  const horarioDisponivel = (horario) => {
    if (!dataSelecionada) return true;

    // Verifica se o horário já passou no dia de hoje
    const hoje = new Date();
    const [diaStr, mesStr, anoStr] = dataSelecionada.split("/");
    const dataSelecionadaObj = new Date(parseInt(anoStr), parseInt(mesStr) - 1, parseInt(diaStr));
    
    if (dataSelecionadaObj.toDateString() === hoje.toDateString()) {
      const [horaStr, minStr] = horario.split(":");
      const horarioObj = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), parseInt(horaStr), parseInt(minStr));
      if (horarioObj <= hoje) return false; // horário já passou
    }

    // Verifica se já existe consulta nesse horário
    return !todasConsultas.some(c => c.data === dataSelecionada && c.horario === horario && c.status !== "Cancelado");
  };

  const diasCalendario = gerarDiasCalendario(mesAtual, anoAtual);
  const nomeMes = (mes) => ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][mes];

  const mesAnterior = () => {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(anoAtual - 1); }
    else setMesAtual(mesAtual - 1);
    setDataSelecionada(null);
  };
  const mesSeguinte = () => {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(anoAtual + 1); }
    else setMesAtual(mesAtual + 1);
    setDataSelecionada(null);
  };
  const selecionarDia = (dia, mes, ano, disponivel, lotado) => {
    if (!disponivel || lotado) return;
    const dataFormatada = `${String(dia).padStart(2, "0")}/${String(mes + 1).padStart(2, "0")}/${ano}`;
    setDataSelecionada(dataFormatada);
    setHorarioSelecionado(null);
  };

  // ==================== CONFIRMAR AGENDAMENTO ====================
  const handleConfirmarAgendamento = async () => {
    if (!especialidadeSelecionada || !dataSelecionada || !horarioSelecionado) {
      Swal.fire("Campos incompletos", "Selecione especialidade, data e horário.", "warning");
      return;
    }
    if (!horarioDisponivel(horarioSelecionado)) {
      Swal.fire("Horário indisponível", "Este horário já foi agendado ou já passou.", "error");
      return;
    }

    // Verificação extra de segurança: não permite agendar em fim de semana
    const [diaStr, mesStr, anoStr] = dataSelecionada.split("/");
    const dataObj = new Date(parseInt(anoStr), parseInt(mesStr) - 1, parseInt(diaStr));
    if (dataObj.getDay() === 0 || dataObj.getDay() === 6) {
      Swal.fire("Indisponível", "Não é possível agendar aos sábados ou domingos.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirmar Agendamento",
      html: `<div style="text-align:left"><p><strong>Especialidade:</strong> ${especialidadeSelecionada}</p><p><strong>Unidade:</strong> ${unidadeSelecionada}</p><p><strong>Data:</strong> ${dataSelecionada}</p><p><strong>Horário:</strong> ${horarioSelecionado}</p></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    });

    if (result.isConfirmed) {
      const senha = `G-${Math.floor(Math.random() * 900) + 100}`;

      const novaConsulta = await consultasService.criar({
        paciente: user.name,
        paciente_id: user.id,
        data: dataSelecionada,
        horario: horarioSelecionado,
        medico: "Médico designado",
        especialidade: especialidadeSelecionada,
        ubs: unidadeSelecionada,
        status: "Confirmado",
        senha: senha,
      });

      if (novaConsulta) {
        try {
          const filasExistentes = await filasService.listar();
          const filasEspecialidade = filasExistentes.filter(
            f => f.especialidade === especialidadeSelecionada && f.ubs === unidadeSelecionada
          );
          const novaPosicao = filasEspecialidade.length + 1;
          await filasService.adicionar({
            paciente: user.name,
            prioridade: "Normal",
            tempo: "5 min",
            senha: senha,
            especialidade: especialidadeSelecionada,
            status: "Aguardando",
            posicao: novaPosicao,
            ubs: unidadeSelecionada,
          });
        } catch (error) {
          console.error("Erro ao adicionar na fila:", error);
        }

        setConsultas(prev => [novaConsulta, ...prev]);
        setTodasConsultas(prev => [...prev, novaConsulta]);
        Swal.fire({
          icon: "success",
          title: "Agendamento confirmado!",
          text: `Sua senha é ${senha}. Você foi adicionado à fila de ${especialidadeSelecionada}.`,
          confirmButtonColor: "#2563eb",
          timer: 3500,
        });
        setEspecialidadeSelecionada(null);
        setDataSelecionada(null);
        setHorarioSelecionado(null);
      } else {
        Swal.fire("Erro", "Não foi possível salvar o agendamento.", "error");
      }
    }
  };

  // ==================== RENDERIZAÇÃO ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiCalendar className="text-blue-600" /> Novo Agendamento
          </h1>
          <p className="text-gray-500 mb-6">Selecione os detalhes da sua consulta abaixo.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Especialidades e Unidade */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <label className="block font-bold text-gray-700 mb-4">Especialidade</label>
              <div className="grid grid-cols-2 gap-2">
                {especialidades.map(esp => (
                  <button key={esp} onClick={() => setEspecialidadeSelecionada(esp)}
                    className={`p-3 border rounded-xl text-sm font-medium transition ${especialidadeSelecionada === esp ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300"}`}>
                    {esp}{especialidadeSelecionada === esp && <HiCheckCircle className="inline ml-2 text-blue-600" size={16} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <label className="block font-bold text-gray-700 mb-3">Unidade de Saúde</label>
              <select value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)}
                className="w-full p-3 border rounded-xl">
                <option>UBS Central</option>
                <option>UBS Norte</option>
                <option>UBS Sul</option>
                <option>UBS Leste</option>
              </select>
            </div>
          </div>

          {/* Calendário e Horários */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">{nomeMes(mesAtual)} {anoAtual}</h3>
                <div className="flex gap-1">
                  <button onClick={mesAnterior} className="p-2 rounded-lg hover:bg-gray-100"><HiChevronLeft size={20} /></button>
                  <button onClick={mesSeguinte} className="p-2 rounded-lg hover:bg-gray-100"><HiChevronRight size={20} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {diasCalendario.map((d, i) => {
                  const dataCompleta = `${String(d.dia).padStart(2, "0")}/${String(d.mes + 1).padStart(2, "0")}/${d.ano}`;
                  const isSelecionado = dataSelecionada === dataCompleta;
                  let classe = "text-gray-300 cursor-not-allowed";
                  let onClick = null;
                  let label = "";

                  if (d.fds && d.isMesAtual) {
                    classe = "bg-gray-100 text-gray-400 cursor-not-allowed";
                    label = "FDS";
                  } else if (d.lotado) {
                    classe = "bg-red-200 text-red-700 cursor-not-allowed font-bold";
                    label = "lotado";
                  } else if (d.passado && d.isMesAtual) {
                    classe = "text-gray-300 cursor-not-allowed";
                  } else if (d.isMesAtual && d.disponivel) {
                    classe = isSelecionado ? "bg-blue-700 text-white font-bold" : "hover:bg-blue-50 cursor-pointer";
                    onClick = () => selecionarDia(d.dia, d.mes, d.ano, d.disponivel, d.lotado);
                  }

                  return (
                    <button key={i} onClick={onClick} disabled={!onClick}
                      className={`p-2 text-center rounded-lg text-sm transition ${classe}`}>
                      {d.dia}
                      {(d.fds || d.lotado) && d.isMesAtual && (
                        <span className="block text-[8px] uppercase">{d.fds ? "fds" : "lotado"}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-700" /> Selecionado</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 border" /> Indisponível</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-200 border border-red-400" /> Lotado</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-100 border" /> Fim de semana</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <label className="block font-bold text-gray-700 mb-3">Horários Disponíveis</label>
              <div className="grid grid-cols-4 gap-2">
                {horarios.map(h => {
                  const disponivel = horarioDisponivel(h);
                  return (
                    <button key={h}
                      onClick={() => disponivel && setHorarioSelecionado(h)}
                      disabled={!disponivel}
                      className={`p-2 border rounded-lg text-sm font-medium transition ${
                        !disponivel
                          ? "bg-red-100 text-red-400 border-red-200 cursor-not-allowed"
                          : horarioSelecionado === h
                            ? "bg-blue-700 text-white"
                            : "border-gray-200 hover:bg-blue-50"
                      }`}>
                      <HiClock className="inline mr-1" size={14} /> {h}
                      {!disponivel && <span className="block text-[10px] text-red-500">indisponível</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-700 to-indigo-700 p-6 rounded-3xl text-white flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">Confirmar Agendamento?</h4>
            <p>{dataSelecionada || "Selecione uma data"} às {horarioSelecionado || "selecione um horário"}</p>
          </div>
          <button onClick={handleConfirmarAgendamento} className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-md">
            AGENDAR AGORA
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HiCalendar className="text-blue-600" /> Minhas Consultas
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UBS</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {consultas.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Nenhuma consulta agendada.</td></tr>
                ) : (
                  consultas.map(c => (
                    <tr key={c.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{c.data}</td>
                      <td className="px-6 py-4 font-medium">{c.horario}</td>
                      <td className="px-6 py-4">{c.medico}</td>
                      <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{c.especialidade}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.ubs || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => Swal.fire({ title: c.especialidade, html: `<div style="text-align:left"><p><strong>Data:</strong> ${c.data}</p><p><strong>Horário:</strong> ${c.horario}</p><p><strong>Médico:</strong> ${c.medico}</p><p><strong>UBS:</strong> ${c.ubs}</p></div>`, icon: "info", confirmButtonColor: "#2563eb" })} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50">
                          <HiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;