// src/pages/AgendamentoAttendente.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { pacientesService } from "../../services/pacientesService";
import { consultasService } from "../../services/consultasService";
import { historicoService } from "../../services/historicoService";
import {
  FaSearch,
  FaPlus,
  FaCalendarCheck,
  FaTimes,
  FaUser,
  FaClock,
  FaStethoscope,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaBan,
  FaHistory,
  FaUserPlus,
  FaFilter,
  FaTrashAlt,
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

  // ----- ESTADOS -----
  const [mostrarNovoAgendamento, setMostrarNovoAgendamento] = useState(false);
  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [ubsSelecionada, setUbsSelecionada] = useState("UBS Central");

  // Filtros da tabela
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroUbs, setFiltroUbs] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  // Histórico (modal)
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [pacienteHistorico, setPacienteHistorico] = useState(null);

  // ----- DADOS DO SUPABASE -----
  const [pacientes, setPacientes] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [historicoPacientes, setHistoricoPacientes] = useState({});

  // Carrega dados do Supabase ao montar
  useEffect(() => {
    const carregarDados = async () => {
      const [pacientesData, consultasData] = await Promise.all([
        pacientesService.listar(),
        consultasService.listar(),
      ]);
      setPacientes(pacientesData);
      setConsultas(consultasData);
    };
    carregarDados();
  }, []);

  // ----- ESTATÍSTICAS -----
  const totalConsultas = consultas.length;
  const confirmadas = consultas.filter((c) => c.status === "Confirmado").length;
  const aguardando = consultas.filter((c) => c.status === "Aguardando").length;
  const canceladas = consultas.filter((c) => c.status === "Cancelado").length;

  // ----- FILTROS -----
  const consultasFiltradas = consultas.filter((consulta) => {
    const matchTexto = consulta.paciente.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchUbs = filtroUbs === "Todas" || consulta.ubs === filtroUbs;
    const matchStatus = filtroStatus === "Todos" || consulta.status === filtroStatus;
    return matchTexto && matchUbs && matchStatus;
  });

  // ============================================================
  // FUNÇÃO PARA CADASTRAR NOVO PACIENTE (com máscaras e validação)
  // ============================================================
  const cadastrarNovoPaciente = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Cadastrar Novo Paciente",
      html: `
        <div style="text-align: left; max-width: 400px; margin: 0 auto;">
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Nome completo</label>
            <input id="nome" class="swal2-input" placeholder="Ex: João da Silva" style="width: 100%; box-sizing: border-box; margin-top: 4px;" required>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">CPF (ex: 123.456.789-00)</label>
            <input id="cpf" class="swal2-input" placeholder="Digite apenas números" style="width: 100%; box-sizing: border-box; margin-top: 4px;" maxlength="14" oninput="this.value = this.value.replace(/\\D/g,'').replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{2})/, '$1.$2.$3-$4')" required>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">CNS (ex: 1234 5678 9012)</label>
            <input id="sus" class="swal2-input" placeholder="Digite apenas números" style="width: 100%; box-sizing: border-box; margin-top: 4px;" maxlength="15" oninput="this.value = this.value.replace(/\\D/g,'').replace(/(\\d{4})(\\d{4})(\\d{4})(\\d{3})/, '$1 $2 $3 $4')" required>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Data de Nascimento</label>
            <input id="dataNasc" class="swal2-input" placeholder="dd/mm/aaaa" style="width: 100%; box-sizing: border-box; margin-top: 4px;" maxlength="10" oninput="this.value = this.value.replace(/\\D/g,'').replace(/(\\d{2})(\\d{2})(\\d{4})/, '$1/$2/$3')" required>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Sexo</label>
            <select id="sexo" class="swal2-input" style="width: 100%; box-sizing: border-box; margin-top: 4px;" required>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Alergias (separadas por vírgula)</label>
            <input id="alergias" class="swal2-input" placeholder="Ex: Penicilina, Dipirona" style="width: 100%; box-sizing: border-box; margin-top: 4px;">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Tipo Sanguíneo (ex: O+, A-)</label>
            <input id="tipoSanguineo" class="swal2-input" placeholder="Ex: O+, A-" style="width: 100%; box-sizing: border-box; margin-top: 4px;">
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nome = document.getElementById("nome").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const sus = document.getElementById("sus").value.trim();
        const dataNasc = document.getElementById("dataNasc").value.trim();
        const sexo = document.getElementById("sexo").value;
        const alergias = document.getElementById("alergias").value.trim();
        const tipoSanguineo = document.getElementById("tipoSanguineo").value.trim();

        if (!nome || nome.length < 3) {
          Swal.showValidationMessage("Nome obrigatório (mínimo 3 caracteres).");
          return false;
        }
        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
          Swal.showValidationMessage("CPF deve ter 11 dígitos (formato: 000.000.000-00).");
          return false;
        }
        const susLimpo = sus.replace(/\D/g, "");
        if (susLimpo.length !== 15) {
          Swal.showValidationMessage("CNS deve ter 15 dígitos (formato: 0000 0000 0000 000).");
          return false;
        }
        const dataLimpa = dataNasc.replace(/\D/g, "");
        if (dataLimpa.length !== 8) {
          Swal.showValidationMessage("Data de nascimento deve ter 8 dígitos (formato: dd/mm/aaaa).");
          return false;
        }
        const dia = parseInt(dataLimpa.substring(0, 2), 10);
        const mes = parseInt(dataLimpa.substring(2, 4), 10) - 1;
        const ano = parseInt(dataLimpa.substring(4, 8), 10);
        const dataObj = new Date(ano, mes, dia);
        if (dataObj.getFullYear() !== ano || dataObj.getMonth() !== mes || dataObj.getDate() !== dia) {
          Swal.showValidationMessage("Data de nascimento inválida.");
          return false;
        }
        if (!sexo) {
          Swal.showValidationMessage("Selecione o sexo.");
          return false;
        }
        const alergiasLimpo = alergias.replace(/[^a-zA-ZÀ-ú\s,]/g, "");
        if (alergias && alergias !== alergiasLimpo) {
          Swal.showValidationMessage("Alergias: use apenas letras, vírgulas e espaços.");
          return false;
        }
        const tipoLimpo = tipoSanguineo.replace(/[^a-zA-Z+-\s]/g, "");
        if (tipoSanguineo && tipoSanguineo !== tipoLimpo) {
          Swal.showValidationMessage("Tipo sanguíneo: use apenas letras, +, - e espaços.");
          return false;
        }

        return {
          nome,
          cpf: cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
          sus: susLimpo.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, "$1 $2 $3 $4"),
          dataNasc: dataLimpa.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3"),
          sexo,
          alergias: alergias ? alergias.split(",").map(a => a.trim()).filter(a => a) : ["Nenhuma"],
          tipoSanguineo: tipoSanguineo || "Não informado",
        };
      },
      confirmButtonText: "Cadastrar",
      confirmButtonColor: "#2563eb",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (formValues) {
      // Verifica duplicidade no Supabase
      const existe = await pacientesService.verificarDuplicidade(formValues.cpf, formValues.sus);
      if (existe) {
        Swal.fire("Erro", "Ja existe um paciente com esse CPF ou CNS.", "error");
        return;
      }

      const novoPaciente = await pacientesService.criar({
        ...formValues,
        ultimaConsulta: "Nunca",
      });

      if (!novoPaciente) {
        Swal.fire("Erro", "Erro ao cadastrar paciente.", "error");
        return;
      }

      setPacientes((prev) => [...prev, novoPaciente]);

      // CRIA UMA CONSULTA AUTOMATICAMENTE PARA O NOVO PACIENTE
      const hoje = new Date();
      const dataFormatada = hoje.toLocaleDateString("pt-BR");
      const horarioAtual = `${String(hoje.getHours()).padStart(2, "0")}:${String(hoje.getMinutes()).padStart(2, "0")}`;
      const novaConsultaData = {
        paciente: novoPaciente.nome,
        paciente_id: novoPaciente.id,
        data: dataFormatada,
        horario: horarioAtual,
        medico: "A definir",
        especialidade: "A agendar",
        status: "Aguardando",
        senha: `G-${Math.floor(Math.random() * 900) + 100}`,
        ubs: ubsSelecionada,
      };
      const novaConsulta = await consultasService.criar(novaConsultaData);
      if (novaConsulta) {
        setConsultas((prev) => [...prev, novaConsulta]);
      }

      // Seleciona o paciente para continuar agendando (opcional)
      setPacienteSelecionado(novoPaciente);
      setBuscaPaciente(novoPaciente.nome);

      Swal.fire({
        icon: "success",
        title: "Paciente cadastrado e consulta criada!",
        text: `${novoPaciente.nome} foi adicionado à fila de espera.`,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // ============================================================
  // HANDLERS (confirmar, cancelar, histórico, novo agendamento)
  // ============================================================
  const handleConfirmar = async (id) => {
    const success = await consultasService.atualizarStatus(id, "Confirmado");
    if (success) {
      setConsultas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Confirmado" } : c))
      );
      Swal.fire({
        icon: "success",
        title: "Confirmado!",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleCancelar = (id) => {
    Swal.fire({
      title: "Cancelar consulta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await consultasService.atualizarStatus(id, "Cancelado", "-");
        if (success) {
          setConsultas((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, status: "Cancelado", senha: "-" } : c
            )
          );
          Swal.fire("Cancelada", "Consulta cancelada com sucesso.", "success");
        }
      }
    });
  };

  const abrirHistorico = async (nomePaciente) => {
    const historico = await historicoService.listarPorPaciente(nomePaciente);
    setPacienteHistorico({ nome: nomePaciente, historico });
    setMostrarHistorico(true);
  };

  const handleNovoAgendamento = async () => {
    if (!pacienteSelecionado || !especialidadeSelecionada || !horarioSelecionado) {
      Swal.fire("Atencao", "Preencha todos os campos!", "warning");
      return;
    }
    const dataFormatada = `${String(dataSelecionada.getDate()).padStart(2, "0")}/${String(
      dataSelecionada.getMonth() + 1
    ).padStart(2, "0")}/${dataSelecionada.getFullYear()}`;
    const senha = `G-${Math.floor(Math.random() * 900) + 100}`;
    const novaConsultaData = {
      paciente: pacienteSelecionado.nome,
      paciente_id: pacienteSelecionado.id,
      data: dataFormatada,
      horario: horarioSelecionado,
      medico: "Dra. Ana",
      especialidade: especialidadeSelecionada,
      status: "Confirmado",
      senha,
      ubs: ubsSelecionada,
    };
    const novaConsulta = await consultasService.criar(novaConsultaData);
    if (novaConsulta) {
      setConsultas((prev) => [...prev, novaConsulta]);
    }
    setMostrarNovoAgendamento(false);
    setPacienteSelecionado(null);
    setEspecialidadeSelecionada("");
    setHorarioSelecionado("");
    Swal.fire("Agendado!", "Nova consulta registrada com sucesso.", "success");
  };

  // ----- NAVEGAÇÃO DE DATAS -----
  const mudarData = (dias) => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + dias);
    setDataSelecionada(novaData);
  };

  const gerarDias = () => {
    const dias = [];
    for (let i = -2; i <= 4; i++) {
      const d = new Date(dataSelecionada);
      d.setDate(d.getDate() + i);
      dias.push(d);
    }
    return dias;
  };

  const formatarData = (date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

  const isMesmoDia = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  // ----- LIMPAR FILTROS -----
  const limparFiltros = () => {
    setFiltroTexto("");
    setFiltroUbs("Todas");
    setFiltroStatus("Todos");
  };

  // ----- CORES DE STATUS -----
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

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarCheck className="text-blue-600" /> Central de Agendamentos
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie consultas e cadastre novos pacientes.
            </p>
          </div>
          <button
            onClick={() => setMostrarNovoAgendamento(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <FaPlus /> Novo Agendamento
          </button>
        </div>

        {/* CARDS ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Hoje", value: totalConsultas, icon: FaCalendarCheck, color: "from-blue-500 to-blue-600" },
            { label: "Confirmadas", value: confirmadas, icon: FaCheck, color: "from-green-500 to-green-600" },
            { label: "Aguardando", value: aguardando, icon: FaClock, color: "from-yellow-500 to-yellow-600" },
            { label: "Canceladas", value: canceladas, icon: FaBan, color: "from-red-500 to-red-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3 text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ===== MODAL NOVO AGENDAMENTO (com cadastro de paciente) ===== */}
        {mostrarNovoAgendamento && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold">Novo Agendamento</h2>
                <button
                  onClick={() => setMostrarNovoAgendamento(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                {/* Busca de Paciente + Botão Novo Paciente */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">Paciente</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nome, CPF ou CNS..."
                        value={buscaPaciente}
                        onChange={(e) => setBuscaPaciente(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                      {buscaPaciente && (
                        <div className="absolute z-20 left-0 right-0 mt-1 border rounded-xl divide-y max-h-48 overflow-y-auto bg-white shadow-lg">
                          {pacientes
                            .filter(
                              (p) =>
                                p.nome.toLowerCase().includes(buscaPaciente.toLowerCase()) ||
                                p.cpf.includes(buscaPaciente) ||
                                p.sus.includes(buscaPaciente)
                            )
                            .map((paciente) => (
                              <div
                                key={paciente.id}
                                onClick={() => {
                                  setPacienteSelecionado(paciente);
                                  setBuscaPaciente(paciente.nome);
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
                                    <p className="text-xs text-gray-500">CPF: {paciente.cpf} | CNS: {paciente.sus}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          {pacientes.filter(
                            (p) =>
                              p.nome.toLowerCase().includes(buscaPaciente.toLowerCase()) ||
                              p.cpf.includes(buscaPaciente) ||
                              p.sus.includes(buscaPaciente)
                          ).length === 0 && buscaPaciente.length > 0 && (
                            <div className="p-3 text-center text-gray-500">
                              Nenhum paciente encontrado.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={cadastrarNovoPaciente}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition whitespace-nowrap"
                    >
                      <FaUserPlus /> Novo Paciente
                    </button>
                  </div>
                  {pacienteSelecionado && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">{pacienteSelecionado.nome}</p>
                          <p className="text-sm text-gray-600">CPF: {pacienteSelecionado.cpf} | CNS: {pacienteSelecionado.sus}</p>
                          <p className="text-xs text-gray-500 mt-1">Última consulta: {pacienteSelecionado.ultimaConsulta || "Nunca"}</p>
                        </div>
                        <button
                          onClick={() => {
                            setPacienteSelecionado(null);
                            setBuscaPaciente("");
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Especialidade, UBS, Data, Horários */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-semibold mb-3">Especialidade</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Clínica Geral", "Cardiologia", "Ginecologia", "Pediatria", "Psicologia", "Dermatologia"].map((esp) => (
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
                    <label className="block font-semibold mb-3">Unidade de Saúde</label>
                    <select
                      value={ubsSelecionada}
                      onChange={(e) => setUbsSelecionada(e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
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
                          <button
                            onClick={() => mudarData(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <FaChevronLeft />
                          </button>
                          <span className="font-bold">
                            {dataSelecionada.toLocaleDateString("pt-BR")}
                          </span>
                          <button
                            onClick={() => mudarData(1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {gerarDias().map((dia, index) => (
                            <button
                              key={index}
                              onClick={() => setDataSelecionada(dia)}
                              className={`p-2 text-sm rounded-lg transition ${
                                isMesmoDia(dia, dataSelecionada)
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              {formatarData(dia)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-semibold mb-3">Horários Disponíveis</label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {[
                      "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
                      "10:00", "10:30", "11:00", "11:30", "13:00", "13:30",
                      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
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

        {/* MODAL HISTÓRICO */}
        {mostrarHistorico && pacienteHistorico && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaHistory className="text-blue-600" /> Histórico de {pacienteHistorico.nome}
                </h2>
                <button
                  onClick={() => setMostrarHistorico(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6">
                {pacienteHistorico.historico.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum histórico encontrado.</p>
                ) : (
                  <div className="space-y-3">
                    {pacienteHistorico.historico.map((item, idx) => (
                      <div
                        key={idx}
                        className="border rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 transition"
                      >
                        <div>
                          <p className="font-semibold">{item.data}</p>
                          <p className="text-sm text-gray-600">{item.medico} - {item.especialidade}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === "Realizada"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FILTROS DA TABELA */}
        <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por paciente..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <select
            value={filtroUbs}
            onChange={(e) => setFiltroUbs(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="Todas">Todas as UBS</option>
            <option value="UBS Central">UBS Central</option>
            <option value="UBS Norte">UBS Norte</option>
            <option value="UBS Sul">UBS Sul</option>
            <option value="UBS Leste">UBS Leste</option>
          </select>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Aguardando">Aguardando</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <button
            onClick={limparFiltros}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <FaTrashAlt className="text-gray-500" /> Limpar Filtros
          </button>
        </div>

        {/* TABELA DE CONSULTAS */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Consultas Agendadas</h2>
            <span className="text-sm text-gray-500">{consultasFiltradas.length} consulta(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Senha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {consultasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Nenhuma consulta encontrada.
                    </td>
                  </tr>
                ) : (
                  consultasFiltradas.map((consulta) => (
                    <tr key={consulta.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {consulta.paciente.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{consulta.paciente}</p>
                            <p className="text-xs text-gray-500">{consulta.ubs}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{consulta.data}</p>
                        <p className="text-sm text-gray-500">{consulta.horario}</p>
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
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            consulta.status
                          )}`}
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
                            onClick={() => abrirHistorico(consulta.paciente)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                            title="Histórico"
                          >
                            <FaHistory size={14} />
                          </button>
                        </div>
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

export default AgendamentoAttendente;