// src/pages/Agendamento.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar,
  HiClock,
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
  HiEye,
} from "react-icons/hi";
import Swal from "sweetalert2";

const Agendamento = () => {
  const [consultas, setConsultas] = useState([
    {
      id: 1,
      data: "10/04/2025",
      horario: "09:00",
      medico: "Dra. Ana",
      especialidade: "Clínica Geral",
    },
    {
      id: 2,
      data: "15/04/2025",
      horario: "14:30",
      medico: "Dr. Carlos",
      especialidade: "Cardiologia",
    },
  ]);

  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(
    "UBS Santa Cecília - Central",
  );

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
  ];

  const diasCalendario = [
    28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ];
  const diaSelecionado = 6;

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
        const novaConsulta = {
          id: Date.now(),
          data: dataSelecionada,
          horario: horarioSelecionado,
          medico: "Médico designado",
          especialidade: especialidadeSelecionada,
        };
        setConsultas((prev) => [novaConsulta, ...prev]);
        Swal.fire({
          icon: "success",
          title: "Agendamento confirmado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
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
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

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
                <h3 className="font-bold text-gray-700">Dezembro 2024</h3>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <HiChevronLeft size={20} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition">
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
                  const isSelecionado = d === diaSelecionado;
                  const isDisponivel = d >= 4 && d <= 12;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (isDisponivel) {
                          setDataSelecionada("06/12/2024");
                        }
                      }}
                      className={`p-2 text-center rounded-lg text-sm transition ${
                        isSelecionado
                          ? "bg-blue-700 text-white font-bold"
                          : isDisponivel
                            ? "hover:bg-blue-50 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-700" />{" "}
                  Selecionado
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-200 border" />{" "}
                  Indisponível
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <label className="block font-bold text-gray-700 mb-3">
                Horários Disponíveis
              </label>
              <div className="grid grid-cols-3 gap-2">
                {horarios.map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorarioSelecionado(h)}
                    className={`p-2 border rounded-lg text-sm font-medium transition ${
                      horarioSelecionado === h
                        ? "bg-blue-700 text-white border-blue-700"
                        : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <HiClock className="inline mr-1" size={14} /> {h}
                  </button>
                ))}
              </div>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {consultas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
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
