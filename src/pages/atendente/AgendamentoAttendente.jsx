// src/pages/AgendamentoAttendente.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaSearch,
  FaPlus,
  FaCalendarCheck,
  FaTimes,
  FaUser,
  FaClock,
  FaStethoscope,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaBan,
  FaHistory,
  FaUserPlus,
  FaCalendarAlt,
  FaHospital,
} from "react-icons/fa";
import Swal from "sweetalert2";

const AgendamentoAttendente = () => {
  const { user } = useAuth();
  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [mostrarNovoAgendamento, setMostrarNovoAgendamento] = useState(false);
  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("06/12/2024");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [ubsSelecionada, setUbsSelecionada] = useState("UBS Central");

  const pacientes = [
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      sus: "1234 5678 9012",
      ultimaConsulta: "10/11/2024",
    },
    {
      id: 2,
      nome: "José Santos",
      cpf: "987.654.321-00",
      sus: "9876 5432 1098",
      ultimaConsulta: "05/11/2024",
    },
    {
      id: 3,
      nome: "Ana Oliveira",
      cpf: "456.789.123-00",
      sus: "4567 8912 3456",
      ultimaConsulta: "20/10/2024",
    },
  ];

  const [consultas, setConsultas] = useState([
    {
      id: 1,
      paciente: "Maria Silva",
      data: "06/12/2024",
      horario: "08:30",
      medico: "Dra. Ana",
      especialidade: "Clínica Geral",
      status: "Confirmado",
      senha: "G-108",
      ubs: "UBS Central",
    },
    {
      id: 2,
      paciente: "José Santos",
      data: "06/12/2024",
      horario: "09:00",
      medico: "Dr. Carlos",
      especialidade: "Cardiologia",
      status: "Aguardando",
      senha: "G-109",
      ubs: "UBS Central",
    },
    {
      id: 3,
      paciente: "Pedro Alves",
      data: "06/12/2024",
      horario: "10:30",
      medico: "Dra. Ana",
      especialidade: "Clínica Geral",
      status: "Confirmado",
      senha: "G-110",
      ubs: "UBS Central",
    },
    {
      id: 4,
      paciente: "Lucia Ferreira",
      data: "07/12/2024",
      horario: "14:00",
      medico: "Dr. Paulo",
      especialidade: "Pediatria",
      status: "Cancelado",
      senha: "-",
      ubs: "UBS Norte",
    },
  ]);

  const estatisticas = {
    totalConsultas: 24,
    confirmadas: 18,
    aguardando: 4,
    canceladas: 2,
    vagasDisponiveis: 8,
  };

  const handleConfirmar = (id) => {
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Confirmado" } : c)),
    );
    Swal.fire({
      icon: "success",
      title: "Confirmado!",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleCancelar = (id) => {
    Swal.fire({
      title: "Cancelar consulta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setConsultas((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, status: "Cancelado", senha: "-" } : c,
          ),
        );
        Swal.fire("Cancelada", "Consulta cancelada com sucesso.", "success");
      }
    });
  };

  const handleNovoAgendamento = () => {
    if (
      !pacienteSelecionado ||
      !especialidadeSelecionada ||
      !horarioSelecionado
    ) {
      Swal.fire("Atenção", "Preencha todos os campos!", "warning");
      return;
    }
    const novaConsulta = {
      id: consultas.length + 1,
      paciente: pacienteSelecionado.nome,
      data: dataSelecionada,
      horario: horarioSelecionado,
      medico: "Dra. Ana",
      especialidade: especialidadeSelecionada,
      status: "Confirmado",
      senha: `G-${Math.floor(Math.random() * 900) + 100}`,
      ubs: ubsSelecionada,
    };
    setConsultas((prev) => [...prev, novaConsulta]);
    setMostrarNovoAgendamento(false);
    setPacienteSelecionado(null);
    setEspecialidadeSelecionada("");
    setHorarioSelecionado("");
    Swal.fire("Agendado!", "Nova consulta registrada com sucesso.", "success");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-700";
      case "Aguardando":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarCheck className="text-blue-600" /> Central de
              Agendamentos
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie todas as consultas e agendamentos da unidade.
            </p>
          </div>
          <button
            onClick={() => setMostrarNovoAgendamento(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <FaPlus /> Novo Agendamento
          </button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              label: "Total Hoje",
              value: estatisticas.totalConsultas,
              icon: FaCalendarCheck,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Confirmadas",
              value: estatisticas.confirmadas,
              icon: FaCheck,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Aguardando",
              value: estatisticas.aguardando,
              icon: FaClock,
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Canceladas",
              value: estatisticas.canceladas,
              icon: FaBan,
              color: "from-red-500 to-red-600",
            },
            {
              label: "Vagas Disponíveis",
              value: estatisticas.vagasDisponiveis,
              icon: FaUserPlus,
              color: "from-indigo-500 to-indigo-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </span>
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
                >
                  <stat.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3 text-gray-800">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Modal de Novo Agendamento – mantido igual ao seu código, apenas ajustes visuais */}
        {mostrarNovoAgendamento && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Novo Agendamento</h2>
                <button
                  onClick={() => setMostrarNovoAgendamento(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                {/* Busca de Paciente */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Buscar Paciente
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, CPF ou CNS..."
                      value={buscaPaciente}
                      onChange={(e) => setBuscaPaciente(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {buscaPaciente && (
                    <div className="mt-2 border rounded-xl divide-y max-h-48 overflow-y-auto">
                      {pacientes
                        .filter(
                          (p) =>
                            p.nome
                              .toLowerCase()
                              .includes(buscaPaciente.toLowerCase()) ||
                            p.cpf.includes(buscaPaciente) ||
                            p.sus.includes(buscaPaciente),
                        )
                        .map((paciente) => (
                          <div
                            key={paciente.id}
                            onClick={() => {
                              setPacienteSelecionado(paciente);
                              setBuscaPaciente("");
                            }}
                            className={`p-3 hover:bg-blue-50 cursor-pointer transition ${
                              pacienteSelecionado?.id === paciente.id
                                ? "bg-blue-50 border-l-4 border-blue-600"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <FaUser className="text-gray-400" />
                              <div>
                                <p className="font-semibold">{paciente.nome}</p>
                                <p className="text-xs text-gray-500">
                                  CPF: {paciente.cpf} | CNS: {paciente.sus}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {pacienteSelecionado && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">
                            {pacienteSelecionado.nome}
                          </p>
                          <p className="text-sm text-gray-600">
                            CPF: {pacienteSelecionado.cpf} | CNS:{" "}
                            {pacienteSelecionado.sus}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Última consulta:{" "}
                            {pacienteSelecionado.ultimaConsulta}
                          </p>
                        </div>
                        <button
                          onClick={() => setPacienteSelecionado(null)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Restante do modal igual ao original, com pequenos ajustes de classes */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-semibold mb-3">
                      Especialidade
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Clínica Geral",
                        "Cardiologia",
                        "Ginecologia",
                        "Pediatria",
                        "Psicologia",
                        "Dermatologia",
                      ].map((esp) => (
                        <button
                          key={esp}
                          onClick={() => setEspecialidadeSelecionada(esp)}
                          className={`p-3 border rounded-xl text-sm transition ${
                            especialidadeSelecionada === esp
                              ? "bg-blue-600 text-white border-blue-600"
                              : "hover:border-blue-400"
                          }`}
                        >
                          <FaStethoscope className="inline mr-2" />
                          {esp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">
                      Unidade de Saúde
                    </label>
                    <select
                      value={ubsSelecionada}
                      onChange={(e) => setUbsSelecionada(e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option>UBS Central</option>
                      <option>UBS Norte</option>
                      <option>UBS Sul</option>
                      <option>UBS Leste</option>
                    </select>

                    <div className="mt-6">
                      <label className="block font-semibold mb-3">Data</label>
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="flex justify-between items-center mb-3">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <FaChevronLeft />
                          </button>
                          <span className="font-bold">{dataSelecionada}</span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <FaChevronRight />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {["06/12", "07/12", "08/12", "09/12"].map((data) => (
                            <button
                              key={data}
                              onClick={() => setDataSelecionada(data)}
                              className={`p-2 text-sm rounded-lg ${
                                dataSelecionada.includes(data)
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              {data}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-semibold mb-3">
                    Horários Disponíveis
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {[
                      "07:00",
                      "07:30",
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
                    ].map((h) => (
                      <button
                        key={h}
                        onClick={() => setHorarioSelecionado(h)}
                        className={`p-3 border rounded-lg text-sm transition ${
                          horarioSelecionado === h
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <FaClock className="inline mr-1" size={12} />
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNovoAgendamento}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md"
                >
                  CONFIRMAR AGENDAMENTO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros e busca */}
        <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar consulta..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FaFilter /> Filtros
          </button>
          <select className="px-4 py-2 border rounded-lg">
            <option>Todas as UBS</option>
            <option>UBS Central</option>
            <option>UBS Norte</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option>Todos os Status</option>
            <option>Confirmado</option>
            <option>Aguardando</option>
            <option>Cancelado</option>
          </select>
        </div>

        {/* Tabela de Consultas */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Consultas Agendadas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Senha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {consultas.map((consulta) => (
                  <tr key={consulta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {consulta.paciente.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{consulta.paciente}</p>
                          <p className="text-xs text-gray-500">
                            {consulta.ubs}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{consulta.data}</p>
                      <p className="text-sm text-gray-500">
                        {consulta.horario}
                      </p>
                    </td>
                    <td className="px-6 py-4">{consulta.medico}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1">
                        <FaStethoscope className="text-gray-400" size={12} />
                        {consulta.especialidade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold">
                        {consulta.senha}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(consulta.status)}`}
                      >
                        {consulta.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {consulta.status !== "Cancelado" && (
                          <>
                            <button
                              onClick={() => handleConfirmar(consulta.id)}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                              title="Confirmar"
                            >
                              <FaCheck size={14} />
                            </button>
                            <button
                              onClick={() => handleCancelar(consulta.id)}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                              title="Cancelar"
                            >
                              <FaBan size={14} />
                            </button>
                          </>
                        )}
                        <button
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                          title="Histórico"
                        >
                          <FaHistory size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoAttendente;
