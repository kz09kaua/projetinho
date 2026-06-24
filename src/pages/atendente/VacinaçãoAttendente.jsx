// src/pages/VacinaçãoAttendente.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiSearch,
  HiUser,
  HiX,
  HiPlus,
  HiCheckCircle,
  HiClock,
  HiExclamation,
  HiBeaker,
  HiCalendar,
  HiDocumentDownload,
  HiChevronDown,
  HiChevronUp,
  HiFilter,
} from "react-icons/hi";
import Swal from "sweetalert2";

const VacinaçãoAttendente = () => {
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
  const [expandedVacina, setExpandedVacina] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Mock com mais dados
  const pacientesVacinaMock = [
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      sus: "1234 5678 9012",
      dataNasc: "15/03/1980",
      sexo: "Feminino",
      vacinas: [
        {
          id: 1,
          vacina: "COVID-19",
          dose: "4ª Dose",
          data: "12/05/2024",
          lote: "AB9023",
          status: "aplicada",
          proximaDose: null,
        },
        {
          id: 2,
          vacina: "Hepatite B",
          dose: "Dose Única",
          data: "08/02/2024",
          lote: "HP5521",
          status: "aplicada",
          proximaDose: null,
        },
        {
          id: 3,
          vacina: "Antitetânica",
          dose: "Reforço",
          data: null,
          lote: null,
          status: "pendente",
          proximaDose: "15/07/2024",
        },
        {
          id: 4,
          vacina: "Febre Amarela",
          dose: "Dose Única",
          data: "22/10/2023",
          lote: "FA008",
          status: "aplicada",
          proximaDose: null,
        },
        {
          id: 5,
          vacina: "Gripe",
          dose: "Dose Anual",
          data: null,
          lote: null,
          status: "pendente",
          proximaDose: "10/06/2024",
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
      vacinas: [
        {
          id: 6,
          vacina: "COVID-19",
          dose: "3ª Dose",
          data: "10/03/2024",
          lote: "AB1234",
          status: "aplicada",
          proximaDose: null,
        },
        {
          id: 7,
          vacina: "Gripe",
          dose: "Dose Anual",
          data: null,
          lote: null,
          status: "pendente",
          proximaDose: "20/06/2024",
        },
        {
          id: 8,
          vacina: "Hepatite B",
          dose: "2ª Dose",
          data: "05/04/2024",
          lote: "HP6632",
          status: "aplicada",
          proximaDose: "05/07/2024",
        },
      ],
    },
  ];

  const vacinasDisponiveis = [
    "COVID-19",
    "Gripe",
    "Febre Amarela",
    "Hepatite B",
    "Antitetânica",
    "HPV",
    "Tríplice Viral",
  ];

  const buscarPaciente = () => {
    const cpfLimpo = cpfBusca.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Swal.fire("CPF inválido", "Digite um CPF válido.", "warning");
      return;
    }
    const encontrado = pacientesVacinaMock.find((p) => p.cpf === cpfBusca);
    if (encontrado) {
      setPaciente(encontrado);
      setExpandedVacina(null);
      setFiltroStatus("todos");
    } else {
      Swal.fire("Não encontrado", "Nenhum paciente com esse CPF.", "error");
      setPaciente(null);
    }
  };

  const limparBusca = () => {
    setCpfBusca("");
    setPaciente(null);
  };

  const registrarVacina = async (vacinaExistente = null) => {
    const { value: formValues } = await Swal.fire({
      title: vacinaExistente
        ? `Registrar ${vacinaExistente.vacina} (${vacinaExistente.dose})`
        : "Registrar nova dose",
      html: `
        <input id="vacina" class="swal2-input" list="vacinas" placeholder="Vacina" value="${vacinaExistente ? vacinaExistente.vacina : ""}" required ${vacinaExistente ? "disabled" : ""}>
        <datalist id="vacinas">
          ${vacinasDisponiveis.map((v) => `<option value="${v}">`).join("")}
        </datalist>
        <input id="dose" class="swal2-input" placeholder="Dose (ex: 1ª, Reforço)" value="${vacinaExistente ? vacinaExistente.dose : ""}" required>
        <input id="lote" class="swal2-input" placeholder="Lote" required>
        <input id="data" type="date" class="swal2-input" value="${new Date().toISOString().split("T")[0]}" required>
        ${vacinaExistente ? "" : '<input id="proximaDose" type="date" class="swal2-input" placeholder="Próxima dose (se houver)">'}
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nomeVacina = vacinaExistente
          ? vacinaExistente.vacina
          : document.getElementById("vacina").value;
        const dose = document.getElementById("dose").value;
        const lote = document.getElementById("lote").value;
        const data = document.getElementById("data").value;
        const proximaDose = vacinaExistente
          ? null
          : document.getElementById("proximaDose").value;
        if (!nomeVacina || !dose || !lote || !data) {
          Swal.showValidationMessage("Preencha todos os campos obrigatórios");
          return false;
        }
        return {
          vacina: nomeVacina,
          dose,
          lote,
          data,
          proximaDose: proximaDose || null,
        };
      },
    });
    if (formValues) {
      if (vacinaExistente) {
        setPaciente((prev) => ({
          ...prev,
          vacinas: prev.vacinas.map((v) =>
            v.id === vacinaExistente.id
              ? {
                  ...v,
                  status: "aplicada",
                  lote: formValues.lote,
                  data: formValues.data,
                }
              : v,
          ),
        }));
      } else {
        const newId = Math.max(0, ...paciente.vacinas.map((v) => v.id)) + 1;
        setPaciente((prev) => ({
          ...prev,
          vacinas: [
            ...prev.vacinas,
            {
              id: newId,
              vacina: formValues.vacina,
              dose: formValues.dose,
              data: formValues.data,
              lote: formValues.lote,
              status: "aplicada",
              proximaDose: formValues.proximaDose,
            },
          ],
        }));
      }
      Swal.fire("Registrado!", "Dose aplicada com sucesso.", "success");
    }
  };

  const toggleExpandir = (id) => {
    setExpandedVacina(expandedVacina === id ? null : id);
  };

  const exportarCarteira = () => {
    if (!paciente) return;
    const linhas = paciente.vacinas
      .map(
        (v) =>
          `${v.vacina};${v.dose};${v.data || "Pendente"};${v.lote || "-"};${v.status};${v.proximaDose || "-"}`,
      )
      .join("\n");
    const cabecalho = "Vacina;Dose;Data;Lote;Status;Próxima Dose";
    const csv = `${cabecalho}\n${linhas}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `carteira_vacinacao_${paciente.nome.replace(/\s+/g, "_")}.csv`;
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

  const vacinasFiltradas = paciente
    ? filtroStatus === "todos"
      ? paciente.vacinas
      : paciente.vacinas.filter((v) => v.status === filtroStatus)
    : [];

  const getStatusIcon = (status) => {
    if (status === "aplicada")
      return <HiCheckCircle className="text-green-500" />;
    if (status === "pendente")
      return <HiExclamation className="text-yellow-500" />;
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiBeaker className="text-emerald-600" /> Carteira de Vacinação
            </h1>
            <p className="text-gray-500 mt-1">
              Busque um paciente e gerencie seu histórico vacinal.
            </p>
          </div>
          {paciente && (
            <button
              onClick={exportarCarteira}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition"
            >
              <HiDocumentDownload size={18} /> Exportar Carteira
            </button>
          )}
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                placeholder="CPF do paciente (ex: 123.456.789-00)"
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                maxLength={14}
              />
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={buscarPaciente}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              <HiSearch size={18} className="inline mr-1" /> Buscar
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

        {/* Resultado */}
        {paciente && (
          <>
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                  {paciente.nome.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-xl text-gray-800">
                    {paciente.nome}
                  </h2>
                  <p className="text-sm text-gray-500">
                    CPF: {paciente.cpf} | CNS: {paciente.sus}
                  </p>
                  <p className="text-sm text-gray-500">
                    Nasc.: {paciente.dataNasc} | Sexo: {paciente.sexo}
                  </p>
                </div>
                <button
                  onClick={() => registrarVacina(null)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  <HiPlus size={18} /> Nova Dose
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Registro de Doses
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFiltroStatus("todos")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtroStatus === "todos" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroStatus("aplicada")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtroStatus === "aplicada" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Aplicadas
                  </button>
                  <button
                    onClick={() => setFiltroStatus("pendente")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtroStatus === "pendente" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Pendentes
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {vacinasFiltradas.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Nenhuma dose encontrada com esse filtro.
                  </div>
                ) : (
                  vacinasFiltradas.map((v) => (
                    <div key={v.id} className="p-5">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleExpandir(v.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl ${v.status === "aplicada" ? "bg-green-50" : "bg-yellow-50"}`}
                          >
                            {getStatusIcon(v.status)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {v.vacina} – {v.dose}
                            </p>
                            <p className="text-sm text-gray-500">
                              {v.status === "aplicada"
                                ? `Aplicada em ${v.data} | Lote: ${v.lote}`
                                : v.proximaDose
                                  ? `Previsão: ${v.proximaDose}`
                                  : "Pendente"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {v.status === "pendente" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                registrarVacina(v);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                            >
                              Registrar
                            </button>
                          )}
                          {expandedVacina === v.id ? (
                            <HiChevronUp className="text-gray-400" />
                          ) : (
                            <HiChevronDown className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      {expandedVacina === v.id && (
                        <div className="mt-4 pl-12 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">
                              Data aplicação:
                            </span>{" "}
                            <span className="font-medium">{v.data || "—"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Lote:</span>{" "}
                            <span className="font-medium">{v.lote || "—"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Dose:</span>{" "}
                            <span className="font-medium">{v.dose}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Próxima dose:</span>{" "}
                            <span className="font-medium">
                              {v.proximaDose || "—"}
                            </span>
                          </div>
                          {v.status === "aplicada" && (
                            <div className="col-span-2">
                              <span className="text-gray-500">
                                Registrado por:
                              </span>{" "}
                              <span className="font-medium">
                                Atendente (Sistema)
                              </span>
                            </div>
                          )}
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
            <HiClock size={48} className="mx-auto mb-4 opacity-40" />
            <p>Nenhum paciente selecionado. Use a busca acima.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacinaçãoAttendente;
