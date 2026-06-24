// src/pages/HistoricoMedicoAttendente.jsx
import { useState } from "react";
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

const HistoricoMedicoAttendente = () => {
  const { user } = useAuth();

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [cpfBusca, setCpfBusca] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("todas");
  const [expandedConsulta, setExpandedConsulta] = useState(null);
  const [ordenacao, setOrdenacao] = useState("recente");

  // Mock enriquecido – paciente Maria Silva com histórico completo
  const pacientesMock = [
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      sus: "1234 5678 9012",
      dataNasc: "15/03/1980",
      sexo: "Feminino",
      alergias: ["Penicilina", "Dipirona"],
      tipoSanguineo: "O+",
      historico: [
        {
          id: 1,
          data: "20/06/2024",
          medico: "Dr. Ricardo Silva",
          especialidade: "Clínico Geral",
          ubs: "UBS Central Lapa",
          diagnostico: "Hipertensão Arterial – controle de rotina",
          prescricao: "Losartana 50mg 1x/dia",
          exames: "PA 130/85 mmHg, Hemograma normal",
          observacoes: "Manter medicação, retorno em 6 meses.",
        },
        {
          id: 2,
          data: "12/05/2024",
          medico: "Dr. Ricardo Silva",
          especialidade: "Clínico Geral",
          ubs: "UBS Central Lapa",
          diagnostico: "Gripe Sazonal",
          prescricao: "Paracetamol 500mg 8/8h por 5 dias",
          exames: "Hemograma (normal), teste rápido de gripe positivo",
          observacoes:
            "Paciente com febre alta e tosse seca. Afastamento de 3 dias.",
        },
        {
          id: 3,
          data: "28/04/2024",
          medico: "Dra. Ana Costa",
          especialidade: "Pediatria",
          ubs: "UBS Vila Mariana",
          diagnostico: "Check-up Rotina da filha (acompanhante)",
          prescricao: "Não se aplica",
          exames: "Colesterol, Glicemia (dentro do normal) da filha",
          observacoes:
            "Mãe trouxe a filha para consulta de rotina. Sem queixas.",
        },
        {
          id: 4,
          data: "10/01/2024",
          medico: "Dr. João Mendes",
          especialidade: "Ortopedia",
          ubs: "UPA Central",
          diagnostico: "Entorse Tornozelo Direito",
          prescricao: "Ibuprofeno 400mg 12/12h, repouso",
          exames: "Raio-X (sem fratura)",
          observacoes: "Encaminhada para fisioterapia após melhora do edema.",
        },
        {
          id: 5,
          data: "15/10/2023",
          medico: "Dra. Carla Nunes",
          especialidade: "Ginecologia",
          ubs: "UBS Central Lapa",
          diagnostico: "Exame Preventivo (Papanicolau) – normal",
          prescricao: "Não se aplica",
          exames: "Papanicolau (negativo para neoplasia)",
          observacoes: "Orientada sobre a importância do exame anual.",
        },
        {
          id: 6,
          data: "05/06/2023",
          medico: "Dr. Ricardo Silva",
          especialidade: "Clínico Geral",
          ubs: "UBS Central Lapa",
          diagnostico: "Check-up Rotina",
          prescricao: "Não se aplica",
          exames: "Glicemia (98 mg/dL), Colesterol total (190 mg/dL)",
          observacoes: "Orientação nutricional e atividade física.",
        },
      ],
    },
    {
      id: 2,
      nome: "José Santos",
      cpf: "987.654.321-00",
      sus: "9876 5432 1098",
      dataNasc: "22/07/1990",
      sexo: "Masculino",
      alergias: ["Nenhuma"],
      tipoSanguineo: "A-",
      historico: [
        {
          id: 7,
          data: "15/03/2024",
          medico: "Dr. João Mendes",
          especialidade: "Cardiologia",
          ubs: "UBS Central",
          diagnostico: "Hipertensão Controlada",
          prescricao: "Losartana 50mg 1x/dia",
          exames: "ECG (normal), MAPA 24h (130/85)",
          observacoes: "Manter medicação e retorno em 6 meses.",
        },
        {
          id: 8,
          data: "20/01/2024",
          medico: "Dra. Ana Costa",
          especialidade: "Clínico Geral",
          ubs: "UBS Central Lapa",
          diagnostico: "Check-up Rotina",
          prescricao: "Não se aplica",
          exames: "Glicemia (95 mg/dL), Colesterol (190 mg/dL)",
          observacoes: "Orientação nutricional.",
        },
      ],
    },
  ];

  const buscarHistorico = () => {
    const cpfLimpo = cpfBusca.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Swal.fire("CPF inválido", "Digite um CPF válido.", "warning");
      return;
    }
    const encontrado = pacientesMock.find((p) => p.cpf === cpfBusca);
    if (encontrado) {
      setPaciente(encontrado);
      setExpandedConsulta(null);
    } else {
      Swal.fire("Não encontrado", "Nenhum paciente com esse CPF.", "error");
      setPaciente(null);
    }
  };

  const limparBusca = () => {
    setCpfBusca("");
    setPaciente(null);
  };

  const toggleExpandir = (id) => {
    setExpandedConsulta(expandedConsulta === id ? null : id);
  };

  const exportarHistorico = () => {
    if (!paciente) return;
    const linhas = paciente.historico
      .map(
        (c) =>
          `${c.data};${c.medico};${c.especialidade};${c.ubs};${c.diagnostico}`,
      )
      .join("\n");
    const cabecalho = "Data;Médico;Especialidade;UBS;Diagnóstico";
    const csv = `${cabecalho}\n${linhas}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico_${paciente.nome.replace(/\s+/g, "_")}.csv`;
    link.click();
    Swal.fire({
      icon: "success",
      title: "Exportado!",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const consultasFiltradas = paciente
    ? paciente.historico
        .filter(
          (c) =>
            filtroEspecialidade === "todas" ||
            c.especialidade === filtroEspecialidade,
        )
        .sort((a, b) => {
          const dateA = new Date(a.data.split("/").reverse().join("-"));
          const dateB = new Date(b.data.split("/").reverse().join("-"));
          return ordenacao === "recente" ? dateB - dateA : dateA - dateB;
        })
    : [];

  const especialidades = paciente
    ? [...new Set(paciente.historico.map((c) => c.especialidade))]
    : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiDocumentText className="text-blue-600" /> Histórico de Consultas
          </h1>
          <p className="text-gray-500 mt-1">
            Visualize o prontuário completo do paciente.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                placeholder="CPF do paciente (ex: 123.456.789-00)"
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                maxLength={14}
              />
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={buscarHistorico}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <HiSearch size={18} /> Buscar
            </button>
            <button
              onClick={limparBusca}
              className="border p-3 rounded-xl hover:bg-gray-50 transition"
            >
              <HiX size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Exemplo: 123.456.789-00 (Maria Silva)
          </p>
        </div>

        {paciente && (
          <>
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {paciente.nome.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-2xl text-gray-800">
                    {paciente.nome}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">CPF:</span> {paciente.cpf}
                    </div>
                    <div>
                      <span className="text-gray-500">CNS:</span> {paciente.sus}
                    </div>
                    <div>
                      <span className="text-gray-500">Nasc.:</span>{" "}
                      {paciente.dataNasc}
                    </div>
                    <div>
                      <span className="text-gray-500">Sexo:</span>{" "}
                      {paciente.sexo}
                    </div>
                    <div>
                      <span className="text-gray-500">Tipo Sanguíneo:</span>{" "}
                      {paciente.tipoSanguineo}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Alergias:</span>
                      <span className="font-medium text-red-600">
                        {" "}
                        {paciente.alergias.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={exportarHistorico}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition"
                >
                  <HiDocumentDownload size={18} /> Exportar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Consultas ({consultasFiltradas.length})
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filtroEspecialidade}
                    onChange={(e) => setFiltroEspecialidade(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm bg-white"
                  >
                    <option value="todas">Todas especialidades</option>
                    {especialidades.map((esp) => (
                      <option key={esp} value={esp}>
                        {esp}
                      </option>
                    ))}
                  </select>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm bg-white"
                  >
                    <option value="recente">Mais recentes</option>
                    <option value="antigo">Mais antigas</option>
                  </select>
                </div>
              </div>

              <div className="divide-y">
                {consultasFiltradas.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Nenhuma consulta encontrada.
                  </div>
                ) : (
                  consultasFiltradas.map((c) => (
                    <div key={c.id} className="p-5">
                      <div
                        className="cursor-pointer flex justify-between items-center"
                        onClick={() => toggleExpandir(c.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-blue-50">
                            <HiCalendar className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {c.especialidade} – Dr(a). {c.medico}
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
                          <HiChevronUp className="text-gray-400" />
                        ) : (
                          <HiChevronDown className="text-gray-400" />
                        )}
                      </div>

                      {expandedConsulta === c.id && (
                        <div className="mt-4 pl-14 space-y-3 text-sm border-l-2 border-blue-100 ml-6">
                          <div>
                            <p className="font-medium text-gray-600">
                              Diagnóstico
                            </p>
                            <p className="text-gray-800">{c.diagnostico}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Prescrição
                            </p>
                            <p className="text-gray-800">{c.prescricao}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Exames</p>
                            <p className="text-gray-800">{c.exames}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Observações
                            </p>
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

        {!paciente && (
          <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border">
            <HiDocumentText size={48} className="mx-auto mb-4 opacity-40" />
            <p>
              Utilize a busca por CPF para visualizar o histórico de um
              paciente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoMedicoAttendente;
