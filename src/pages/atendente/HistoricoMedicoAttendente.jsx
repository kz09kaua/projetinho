// src/pages/HistoricoMedicoAttendente.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiSearch,
  HiUser,
  HiDocumentText,
  HiLocationMarker,
  HiX,
  HiCalendar,
  HiClipboardList,
  HiFilter,
  HiChevronDown,
  HiChevronUp,
  HiClock,
  HiHeart,
  HiBeaker,
  HiDocumentDownload,
} from "react-icons/hi";
import Swal from "sweetalert2";

// Chaves do localStorage (mesmas usadas no Agendamento)
const STORAGE_KEY_PACIENTES = "@agendamento_pacientes";
const STORAGE_KEY_CONSULTAS = "@agendamento_consultas";

const HistoricoMedicoAttendente = () => {
  const { user } = useAuth();

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [busca, setBusca] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("todas");
  const [expandedConsulta, setExpandedConsulta] = useState(null);
  const [ordenacao, setOrdenacao] = useState("recente");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const sugestoesRef = useRef(null);

  // Dados reais vindos do localStorage
  const [pacientesReais, setPacientesReais] = useState([]);
  const [consultasReais, setConsultasReais] = useState([]);

  // Carrega dados do localStorage
  const carregarDados = () => {
    const pacientesSalvos = localStorage.getItem(STORAGE_KEY_PACIENTES);
    const consultasSalvas = localStorage.getItem(STORAGE_KEY_CONSULTAS);

    const pacientes = pacientesSalvos ? JSON.parse(pacientesSalvos) : [];
    const consultas = consultasSalvas ? JSON.parse(consultasSalvas) : [];

    setPacientesReais(pacientes);
    setConsultasReais(consultas);
  };

  // Recarrega ao montar e sempre que os dados mudarem no localStorage (para outras abas)
  useEffect(() => {
    carregarDados();

    // Escuta mudanças no localStorage (para sincronizar entre abas)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY_PACIENTES || e.key === STORAGE_KEY_CONSULTAS) {
        carregarDados();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Constrói o histórico de um paciente a partir das consultas confirmadas
  const construirHistorico = (nomePaciente) => {
    const consultasDoPaciente = consultasReais.filter(
      (c) => c.paciente === nomePaciente && c.status === "Confirmado"
    );
    return consultasDoPaciente.map((c) => ({
      id: c.id,
      data: c.data,
      medico: c.medico,
      especialidade: c.especialidade,
      ubs: c.ubs,
      diagnostico: c.especialidade === "A agendar" ? "Aguardando agendamento" : "Consulta confirmada",
      prescricao: "Pendente",
      exames: "Pendente",
      observacoes: c.especialidade === "A agendar" ? "Paciente aguarda definição de especialidade" : "Consulta registrada",
      status: "Realizada",
    }));
  };

  // --- Funções auxiliares (CPF, etc.) ---
  const apenasNumeros = (str) => str.replace(/\D/g, "");
  const formatarCPF = (valor) => {
    const nums = apenasNumeros(valor);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return nums.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    if (nums.length <= 9) return nums.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  };
  const isCPF = (texto) => /^[\d.\- ]+$/.test(texto) && apenasNumeros(texto).length >= 11;

  // --- Manipuladores do input ---
  const handleBuscaChange = (e) => {
    const raw = e.target.value;
    if (isCPF(raw) || apenasNumeros(raw).length > 0) {
      const formatado = formatarCPF(raw);
      setBusca(formatado);
      setMostrarSugestoes(false);
    } else {
      setBusca(raw);
      setMostrarSugestoes(raw.trim().length > 1);
    }
  };

  useEffect(() => {
    const handleClickFora = (e) => {
      if (sugestoesRef.current && !sugestoesRef.current.contains(e.target)) {
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // Sugestões baseadas nos pacientes reais
  const sugestoes = (() => {
    const termo = busca.trim();
    if (!termo || isCPF(termo) || termo.length < 2) return [];
    return pacientesReais.filter((p) =>
      p.nome.toLowerCase().includes(termo.toLowerCase())
    );
  })();

  const selecionarSugestao = (pacienteSug) => {
    setBusca(pacienteSug.nome);
    setMostrarSugestoes(false);
    // Monta o objeto paciente com histórico real
    const historico = construirHistorico(pacienteSug.nome);
    setPaciente({
      ...pacienteSug,
      historico,
    });
    setExpandedConsulta(null);
  };

  // --- Busca principal ---
  const buscarHistorico = async () => {
    const termo = busca.trim();
    if (termo === "") {
      Swal.fire("Campo vazio", "Digite um nome ou CPF.", "warning");
      return;
    }

    setBuscando(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cpfLimpo = apenasNumeros(termo);
    let encontrado = null;

    if (cpfLimpo.length === 11) {
      encontrado = pacientesReais.find((p) => apenasNumeros(p.cpf) === cpfLimpo);
    } else {
      encontrado = pacientesReais.find((p) =>
        p.nome.toLowerCase().includes(termo.toLowerCase())
      );
    }

    setBuscando(false);

    if (encontrado) {
      const historico = construirHistorico(encontrado.nome);
      setPaciente({
        ...encontrado,
        historico,
      });
      setExpandedConsulta(null);
    } else {
      Swal.fire("Não encontrado", "Nenhum paciente com esse nome ou CPF.", "error");
      setPaciente(null);
    }
  };

  const limparBusca = () => {
    setBusca("");
    setPaciente(null);
    setMostrarSugestoes(false);
    setExpandedConsulta(null);
  };

  // --- Expandir/contrair consulta ---
  const toggleExpandir = (id) => {
    setExpandedConsulta(expandedConsulta === id ? null : id);
  };

  // --- Exportar CSV (agora com dados reais) ---
  const exportarHistorico = () => {
    if (!paciente) return;
    const cabecalho = "Data;Médico;Especialidade;UBS;Diagnóstico;Prescrição;Exames;Observações";
    const linhas = paciente.historico.map((c) =>
      [
        c.data,
        c.medico,
        c.especialidade,
        c.ubs,
        c.diagnostico,
        c.prescricao,
        c.exames,
        c.observacoes,
      ].join(";")
    );
    const csv = "\uFEFF" + cabecalho + "\n" + linhas.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico_${paciente.nome.replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    Swal.fire({
      icon: "success",
      title: "Exportado!",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // --- Filtros e ordenação ---
  const consultasFiltradas = paciente
    ? paciente.historico
        .filter(
          (c) =>
            filtroEspecialidade === "todas" ||
            c.especialidade === filtroEspecialidade
        )
        .sort((a, b) => {
          const [dA, mA, yA] = a.data.split("/").map(Number);
          const [dB, mB, yB] = b.data.split("/").map(Number);
          const dateA = new Date(yA, mA - 1, dA);
          const dateB = new Date(yB, mB - 1, dB);
          return ordenacao === "recente" ? dateB - dateA : dateA - dateB;
        })
    : [];

  const especialidades = paciente
    ? [...new Set(paciente.historico.map((c) => c.especialidade))]
    : [];

  // --- Render ---
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiDocumentText className="text-blue-600" /> Histórico de Consultas
          </h1>
          <p className="text-gray-500 mt-1">
            Busque por nome ou CPF e acesse o prontuário completo.
          </p>
        </div>

        {/* Barra de busca */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-3 relative">
            <div className="relative flex-1" ref={sugestoesRef}>
              <input
                type="text"
                value={busca}
                onChange={handleBuscaChange}
                placeholder="Nome ou CPF (ex: 123.456.789-00)"
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    buscarHistorico();
                  }
                }}
              />
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              {mostrarSugestoes && sugestoes.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-56 overflow-y-auto">
                  {sugestoes.map((sug) => (
                    <div
                      key={sug.id}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition"
                      onClick={() => selecionarSugestao(sug)}
                    >
                      <HiUser className="text-gray-400" size={18} />
                      <div>
                        <p className="font-semibold text-gray-800">{sug.nome}</p>
                        <p className="text-xs text-gray-500">CPF: {sug.cpf}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={buscarHistorico}
                disabled={buscando}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
              >
                {buscando ? (
                  <span className="animate-pulse">Buscando...</span>
                ) : (
                  <>
                    <HiSearch size={18} /> Buscar
                  </>
                )}
              </button>
              <button
                onClick={limparBusca}
                className="border p-3 rounded-xl hover:bg-gray-50 transition"
                title="Limpar"
              >
                <HiX size={20} />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Digite pelo menos 2 letras para sugestões de nome ou insira um CPF completo.
          </p>
        </div>

        {/* Card do paciente (se encontrado) */}
        {paciente && (
          <>
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {paciente.nome.charAt(0)}
                </div>
                <div className="flex-1 w-full">
                  <h2 className="font-bold text-2xl text-gray-800">{paciente.nome}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                    <div><span className="text-gray-500">CPF:</span> {paciente.cpf}</div>
                    <div><span className="text-gray-500">CNS:</span> {paciente.sus}</div>
                    <div><span className="text-gray-500">Nasc.:</span> {paciente.dataNasc}</div>
                    <div><span className="text-gray-500">Sexo:</span> {paciente.sexo}</div>
                    <div><span className="text-gray-500">Tipo Sanguíneo:</span> {paciente.tipoSanguineo}</div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Alergias:</span>
                      <span className="font-medium text-red-600"> {paciente.alergias.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={exportarHistorico}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition shrink-0"
                >
                  <HiDocumentDownload size={18} /> Exportar
                </button>
              </div>
            </div>

            {/* Lista de consultas */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Consultas ({consultasFiltradas.length})
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filtroEspecialidade}
                    onChange={(e) => setFiltroEspecialidade(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todas">Todas especialidades</option>
                    {especialidades.map((esp) => (
                      <option key={esp} value={esp}>{esp}</option>
                    ))}
                  </select>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recente">Mais recentes</option>
                    <option value="antigo">Mais antigas</option>
                  </select>
                </div>
              </div>

              <div className="divide-y">
                {consultasFiltradas.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Nenhuma consulta encontrada com os filtros atuais.
                  </div>
                ) : (
                  consultasFiltradas.map((c) => (
                    <div
                      key={c.id}
                      className="p-5 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => toggleExpandir(c.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-blue-50 shrink-0">
                            <HiCalendar className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {c.especialidade} – {c.medico}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <HiLocationMarker size={14} /> {c.ubs} – {c.data}
                            </p>
                            <div className="mt-1">
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                {c.diagnostico}
                              </span>
                            </div>
                          </div>
                        </div>
                        {expandedConsulta === c.id ? (
                          <HiChevronUp className="text-gray-400 shrink-0" />
                        ) : (
                          <HiChevronDown className="text-gray-400 shrink-0" />
                        )}
                      </div>

                      {expandedConsulta === c.id && (
                        <div
                          className="mt-4 pl-14 space-y-3 text-sm border-l-2 border-blue-100 ml-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <p className="font-medium text-gray-600">Diagnóstico</p>
                            <p className="text-gray-800">{c.diagnostico}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Prescrição</p>
                            <p className="text-gray-800">{c.prescricao}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Exames</p>
                            <p className="text-gray-800">{c.exames}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Observações</p>
                            <p className="text-gray-800">{c.observacoes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Estado vazio */}
        {!paciente && (
          <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border">
            <HiDocumentText size={48} className="mx-auto mb-4 opacity-40" />
            <p>Utilize a busca por nome ou CPF para visualizar o histórico.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoMedicoAttendente;