// src/pages/Agendamento.jsx
import { useState, useEffect } from "react";
import {
  HiCalendar,
  HiClock,
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
  HiEye,
} from "react-icons/hi";
import Swal from "sweetalert2";

// Chave para armazenar no localStorage
const STORAGE_KEY = "@agendamento_consultas";

const Agendamento = () => {
  const [consultas, setConsultas] = useState([]);

  // Estados do formulário
  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(
    "UBS Santa Cecília - Central"
  );

  // Estados do calendário
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  // ===== CARREGAR DO LOCALSTORAGE AO MONTAR =====
  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
      try {
        const consultasSalvas = JSON.parse(dadosSalvos);
        // Ordena por data mais recente
        consultasSalvas.sort((a, b) => {
          const [dA, mA, yA] = a.data.split("/").map(Number);
          const [dB, mB, yB] = b.data.split("/").map(Number);
          const dateA = new Date(yA, mA - 1, dA);
          const dateB = new Date(yB, mB - 1, dB);
          return dateB - dateA;
        });
        setConsultas(consultasSalvas);
      } catch {
        setConsultas([]);
      }
    }
  }, []);

  // ===== SALVAR NO LOCALSTORAGE SEMPRE QUE CONSULTAS MUDAR =====
  useEffect(() => {
    if (consultas.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultas));
    } else {
      // Se estiver vazio, remove do localStorage (opcional)
      // localStorage.removeItem(STORAGE_KEY);
    }
  }, [consultas]);

  // ===== FUNÇÃO PARA VERIFICAR SE UM HORÁRIO ESTÁ DISPONÍVEL =====
  const isHorarioDisponivel = (data, horario) => {
    return !consultas.some(
      (c) => c.data === data && c.horario === horario
    );
  };

  // ===== DIAS LOTADOS FIXOS (COMO ESTAVA ANTES) =====
  const diasLotados = [2, 5, 8, 12, 15, 18, 22, 25, 28, 30];

  // ===== GERADOR DE DIAS DO CALENDÁRIO =====
  const gerarDiasCalendario = (mes, ano) => {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasDoMesAnterior = new Date(ano, mes, 0).getDate();

    const dias = [];
    // Dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
      dias.push({
        dia: diasDoMesAnterior - i,
        mes: mes - 1,
        ano: ano,
        isMesAtual: false,
        disponivel: false,
        lotado: false,
      });
    }
    // Dias do mês atual
    for (let i = 1; i <= diasNoMes; i++) {
      const data = new Date(ano, mes, i);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const disponivel = data >= hoje;
      const lotado = diasLotados.includes(i);
      dias.push({
        dia: i,
        mes: mes,
        ano: ano,
        isMesAtual: true,
        disponivel: disponivel && !lotado,
        lotado: lotado,
      });
    }
    // Dias do próximo mês para completar a grade (até 42 células)
    const totalDias = dias.length;
    const diasRestantes = 42 - totalDias;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({
        dia: i,
        mes: mes + 1,
        ano: ano,
        isMesAtual: false,
        disponivel: false,
        lotado: false,
      });
    }
    return dias;
  };

  const diasCalendario = gerarDiasCalendario(mesAtual, anoAtual);

  const nomeMes = (mes) => {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return meses[mes];
  };

  // Navegação do calendário
  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
    setDataSelecionada(null);
  };

  const mesSeguinte = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
    setDataSelecionada(null);
  };

  // Selecionar um dia
  const selecionarDia = (dia, mes, ano, disponivel, lotado) => {
    if (!disponivel || lotado) return;
    const dataFormatada = `${String(dia).padStart(2, "0")}/${String(mes + 1).padStart(2, "0")}/${ano}`;
    setDataSelecionada(dataFormatada);
    // Limpa horário selecionado ao mudar a data
    setHorarioSelecionado(null);
  };

  // ===== CONFIRMAR AGENDAMENTO COM PERSISTÊNCIA IMEDIATA =====
  const handleConfirmarAgendamento = () => {
    if (!especialidadeSelecionada || !dataSelecionada || !horarioSelecionado) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Selecione especialidade, data e horário.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // Verifica se já existe consulta para essa data/horário
    if (!isHorarioDisponivel(dataSelecionada, horarioSelecionado)) {
      Swal.fire({
        icon: "error",
        title: "Horário indisponível",
        text: "Já existe uma consulta agendada para esta data e horário.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // Verifica se o dia está na lista de lotados
    const [dia, mes, ano] = dataSelecionada.split("/").map(Number);
    if (diasLotados.includes(dia)) {
      Swal.fire({
        icon: "error",
        title: "Dia lotado",
        text: "Não há mais vagas disponíveis para esta data.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    Swal.fire({
      title: "Confirmar Agendamento",
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Especialidade:</strong> ${especialidadeSelecionada}</p>
          <p><strong>Unidade:</strong> ${unidadeSelecionada}</p>
          <p><strong>Data:</strong> ${dataSelecionada}</p>
          <p><strong>Horário:</strong> ${horarioSelecionado}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar Agendamento",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Verifica novamente para evitar race condition
        if (!isHorarioDisponivel(dataSelecionada, horarioSelecionado)) {
          Swal.fire({
            icon: "error",
            title: "Horário indisponível",
            text: "Infelizmente esse horário foi preenchido enquanto você confirmava.",
            confirmButtonColor: "#2563eb",
          });
          return;
        }

        const novaConsulta = {
          id: Date.now() + Math.random(),
          data: dataSelecionada,
          horario: horarioSelecionado,
          medico: "Médico designado",
          especialidade: especialidadeSelecionada,
          ubs: unidadeSelecionada,
        };

        // ===== ATUALIZA ESTADO E SALVA LOCALMENTE =====
        setConsultas((prev) => {
          const novasConsultas = [novaConsulta, ...prev];
          // Salva imediatamente no localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(novasConsultas));
          return novasConsultas;
        });

        Swal.fire({
          icon: "success",
          title: "Agendamento confirmado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });

        // Reset do formulário
        setEspecialidadeSelecionada(null);
        setDataSelecionada(null);
        setHorarioSelecionado(null);
      }
    });
  };

  const verDetalhesConsulta = (consulta) => {
    Swal.fire({
      title: `Consulta de ${consulta.especialidade}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Data:</strong> ${consulta.data}</p>
          <p><strong>Horário:</strong> ${consulta.horario}</p>
          <p><strong>Médico:</strong> ${consulta.medico}</p>
          <p><strong>Especialidade:</strong> ${consulta.especialidade}</p>
          <p><strong>Unidade:</strong> ${consulta.ubs || "Não informada"}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  // ===== ESPECIALIDADES E HORÁRIOS =====
  const especialidades = [
    "Clínica Geral",
    "Ginecologia",
    "Pediatria",
    "Psicologia",
    "Cardiologia",
    "Dermatologia",
  ];

  const horarios = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiCalendar className="text-blue-600" /> Novo Agendamento
          </h1>
          <p className="text-gray-500 mb-6">
            Selecione os detalhes da sua consulta abaixo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Especialidades e Unidade */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <label className="block font-bold text-gray-700 mb-4">
                Especialidade
              </label>
              <div className="grid grid-cols-2 gap-2">
                {especialidades.map((esp) => (
                  <button
                    key={esp}
                    onClick={() => setEspecialidadeSelecionada(esp)}
                    className={`p-3 border rounded-xl text-sm font-medium transition ${
                      especialidadeSelecionada === esp
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {esp}
                    {especialidadeSelecionada === esp && (
                      <HiCheckCircle
                        className="inline ml-2 text-blue-600"
                        size={16}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <label className="block font-bold text-gray-700 mb-3">
                Unidade de Saúde
              </label>
              <select
                value={unidadeSelecionada}
                onChange={(e) => setUnidadeSelecionada(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>UBS Santa Cecília - Central</option>
                <option>UBS Vila Maria - Norte</option>
                <option>UBS São Cristóvão - Sul</option>
              </select>
            </div>
          </div>

          {/* Calendário e Horários */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">
                  {nomeMes(mesAtual)} {anoAtual}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={mesAnterior}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <HiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={mesSeguinte}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <HiChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                <div>D</div>
                <div>S</div>
                <div>T</div>
                <div>Q</div>
                <div>Q</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {diasCalendario.map((d, i) => {
                  const diaStr = String(d.dia).padStart(2, "0");
                  const mesStr = String(d.mes + 1).padStart(2, "0");
                  const dataCompleta = `${diaStr}/${mesStr}/${d.ano}`;
                  const isSelecionado = dataSelecionada === dataCompleta;
                  let corClasse = "";
                  let titulo = "";
                  let onClick = () => {};

                  if (!d.isMesAtual) {
                    corClasse = "text-gray-300 cursor-not-allowed";
                    titulo = "Fora do mês";
                  } else if (d.lotado) {
                    corClasse = "bg-red-100 text-red-700 cursor-not-allowed font-bold";
                    titulo = "Dia lotado";
                  } else if (!d.disponivel) {
                    corClasse = "text-gray-300 cursor-not-allowed";
                    titulo = "Data indisponível";
                  } else if (isSelecionado) {
                    corClasse = "bg-blue-700 text-white font-bold";
                    titulo = "Selecionado";
                    onClick = () =>
                      selecionarDia(d.dia, d.mes, d.ano, d.disponivel, d.lotado);
                  } else {
                    corClasse = "hover:bg-blue-50 cursor-pointer";
                    titulo = "Disponível";
                    onClick = () =>
                      selecionarDia(d.dia, d.mes, d.ano, d.disponivel, d.lotado);
                  }

                  return (
                    <button
                      key={i}
                      onClick={onClick}
                      className={`p-2 text-center rounded-lg text-sm transition ${corClasse}`}
                      title={titulo}
                    >
                      {d.dia}
                      {d.lotado && d.isMesAtual && (
                        <span className="block text-[8px] uppercase text-red-600">
                          lotado
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-700" />{" "}
                  Selecionado
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-200 border" />{" "}
                  Indisponível
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-200 border border-red-400" />{" "}
                  Lotado
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <label className="block font-bold text-gray-700 mb-3">
                Horários Disponíveis
              </label>
              <div className="grid grid-cols-4 gap-2">
                {horarios.map((h) => {
                  const disponivel = dataSelecionada
                    ? isHorarioDisponivel(dataSelecionada, h)
                    : true;
                  return (
                    <button
                      key={h}
                      onClick={() => {
                        if (disponivel) setHorarioSelecionado(h);
                      }}
                      disabled={!disponivel || !dataSelecionada}
                      className={`p-2 border rounded-lg text-sm font-medium transition ${
                        horarioSelecionado === h
                          ? "bg-blue-700 text-white border-blue-700"
                          : disponivel && dataSelecionada
                          ? "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <HiClock className="inline mr-1" size={14} /> {h}
                    </button>
                  );
                })}
              </div>
              {!dataSelecionada && (
                <p className="text-xs text-gray-400 mt-2">
                  Selecione uma data primeiro.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Resumo e confirmação */}
        <div className="mt-8 bg-gradient-to-r from-blue-700 to-indigo-700 p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
          <div>
            <h4 className="text-xl font-bold">Confirmar Agendamento?</h4>
            <p className="opacity-90">
              {dataSelecionada || "Selecione uma data"} às{" "}
              {horarioSelecionado || "selecione um horário"}
            </p>
          </div>
          <button
            onClick={handleConfirmarAgendamento}
            className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-md"
          >
            AGENDAR AGORA
          </button>
        </div>

        {/* Próximas Consultas - Tabela estilizada */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HiCalendar className="text-blue-600" /> Próximas Consultas
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Horário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    UBS
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {consultas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Nenhuma consulta agendada.
                    </td>
                  </tr>
                ) : (
                  consultas.map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">{c.data}</td>
                      <td className="px-6 py-4 font-medium">{c.horario}</td>
                      <td className="px-6 py-4">{c.medico}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {c.especialidade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {c.ubs || "Não informada"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => verDetalhesConsulta(c)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Visualizar"
                        >
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