// src/pages/VacinaçãoAttendente.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { pacientesService } from "../../services/pacientesService";
import { vacinasService } from "../../services/vacinasService";
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
  HiRefresh,
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

  const [busca, setBusca] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [expandedVacina, setExpandedVacina] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const sugestoesRef = useRef(null);

  // Dados reais vindos dos serviços
  const [pacientesReais, setPacientesReais] = useState([]);
  const [vacinasPorPaciente, setVacinasPorPaciente] = useState({});

  // Carrega dados usando os serviços (garante consistência)
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [pacientes, vacinas] = await Promise.all([
        pacientesService.listar(),
        vacinasService.listar(),
      ]);
      setPacientesReais(Array.isArray(pacientes) ? pacientes : []);
      setVacinasPorPaciente(vacinas || {});
      return { pacientes, vacinas };
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Swal.fire("Erro", "Não foi possível carregar os dados.", "error");
      return { pacientes: [], vacinas: {} };
    } finally {
      setCarregando(false);
    }
  };

  // Recarrega ao montar
  useEffect(() => {
    carregarDados();
  }, []);

  // Atualiza paciente quando as vacinas mudam
  useEffect(() => {
    if (paciente) {
      const vacinas = vacinasPorPaciente[paciente.nome] || [];
      setPaciente((prev) => ({
        ...prev,
        vacinas,
      }));
    }
  }, [vacinasPorPaciente, paciente]);

  // --- Funções auxiliares ---
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
      setBusca(formatarCPF(raw));
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
      p.nome?.toLowerCase().includes(termo.toLowerCase())
    );
  })();

  const selecionarSugestao = async (pacienteSug) => {
    setBusca(pacienteSug.nome);
    setMostrarSugestoes(false);
    const { vacinas } = await carregarDados();
    const vacinasPaciente = vacinas[pacienteSug.nome] || [];
    setPaciente({
      ...pacienteSug,
      vacinas: vacinasPaciente,
    });
    setExpandedVacina(null);
    setFiltroStatus("todos");
  };

  // --- Busca principal ---
  const buscarPaciente = async () => {
    const termoLimpo = busca.trim();
    if (termoLimpo === "") {
      Swal.fire("Campo vazio", "Digite um nome ou CPF.", "warning");
      return;
    }

    // Carrega dados frescos
    const { pacientes, vacinas } = await carregarDados();

    const cpfNumerico = apenasNumeros(termoLimpo);
    let encontrado = null;

    if (cpfNumerico.length === 11) {
      encontrado = pacientes.find((p) => apenasNumeros(p.cpf) === cpfNumerico);
    } else {
      encontrado = pacientes.find((p) =>
        p.nome?.toLowerCase().includes(termoLimpo.toLowerCase())
      );
    }

    if (encontrado) {
      const vacinasPaciente = vacinas[encontrado.nome] || [];
      setPaciente({
        ...encontrado,
        vacinas: vacinasPaciente,
      });
      setExpandedVacina(null);
      setFiltroStatus("todos");
    } else {
      Swal.fire("Não encontrado", "Nenhum paciente com esse nome ou CPF.", "error");
      setPaciente(null);
    }
  };

  const limparBusca = () => {
    setBusca("");
    setPaciente(null);
    setMostrarSugestoes(false);
  };

  // --- Vacinas disponíveis ---
  const vacinasDisponiveis = [
    "COVID-19",
    "Gripe",
    "Febre Amarela",
    "Hepatite B",
    "Antitetânica",
    "HPV",
    "Tríplice Viral",
    "Pneumocócica",
    "Meningite",
    "Rotavírus",
  ];

  // --- Registrar vacina (nova ou pendente) ---
  const registrarVacina = async (vacinaExistente = null) => {
    if (!paciente) {
      Swal.fire("Erro", "Selecione um paciente primeiro.", "error");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: vacinaExistente
        ? `Registrar ${vacinaExistente.vacina} (${vacinaExistente.dose})`
        : "Registrar nova dose",
      html: `
        <div style="text-align: left; max-width: 400px; margin: 0 auto;">
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Vacina</label>
            <input id="vacina" class="swal2-input" list="vacinas" placeholder="Selecione a vacina" value="${vacinaExistente ? vacinaExistente.vacina : ""}" ${vacinaExistente ? "disabled" : ""} style="width: 100%; box-sizing: border-box; margin-top: 4px;">
            <datalist id="vacinas">
              ${vacinasDisponiveis.map((v) => `<option value="${v}">`).join("")}
            </datalist>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Dose</label>
            <input id="dose" class="swal2-input" placeholder="Ex: 1ª, Reforço" value="${vacinaExistente ? vacinaExistente.dose : ""}" style="width: 100%; box-sizing: border-box; margin-top: 4px;" required>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Lote</label>
            <input id="lote" class="swal2-input" placeholder="Número do lote" style="width: 100%; box-sizing: border-box; margin-top: 4px;" required>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Data de Aplicação</label>
            <input id="data" type="date" class="swal2-input" value="${new Date().toISOString().split("T")[0]}" style="width: 100%; box-sizing: border-box; margin-top: 4px;" required>
          </div>
          ${vacinaExistente ? "" : `
          <div>
            <label style="font-weight: 600; font-size: 0.9rem; color: #333;">Próxima Dose (opcional)</label>
            <input id="proximaDose" type="date" class="swal2-input" style="width: 100%; box-sizing: border-box; margin-top: 4px;">
          </div>
          `}
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nomeVacina = vacinaExistente
          ? vacinaExistente.vacina
          : document.getElementById("vacina").value;
        const dose = document.getElementById("dose").value.trim();
        const lote = document.getElementById("lote").value.trim();
        const data = document.getElementById("data").value;
        const proximaDose = vacinaExistente
          ? null
          : document.getElementById("proximaDose").value;

        if (!nomeVacina || !dose || !lote || !data) {
          Swal.showValidationMessage("Preencha todos os campos obrigatórios.");
          return false;
        }
        if (dose.length < 2) {
          Swal.showValidationMessage("Dose inválida. Ex: 1ª, 2ª, Reforço.");
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
      confirmButtonText: vacinaExistente ? "Registrar Aplicação" : "Cadastrar Dose",
      confirmButtonColor: "#2563eb",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (formValues) {
      let vacinasAtuais = vacinasPorPaciente[paciente.nome] || [];

      if (vacinaExistente) {
        // Atualiza uma vacina pendente
        const updated = await vacinasService.atualizar(paciente.nome, vacinaExistente.id, {
          status: "aplicada",
          lote: formValues.lote,
          data: formValues.data,
          proximaDose: formValues.proximaDose || vacinaExistente.proximaDose,
        });
        vacinasAtuais = updated;
      } else {
        // Nova vacina
        const newId = Math.max(0, ...vacinasAtuais.map((v) => v.id), 0) + 1;
        const novaVacina = {
          id: newId,
          vacina: formValues.vacina,
          dose: formValues.dose,
          data: formValues.data,
          lote: formValues.lote,
          status: "aplicada",
          proximaDose: formValues.proximaDose,
        };
        vacinasAtuais = await vacinasService.adicionar(paciente.nome, novaVacina);
      }

      // Atualiza o estado local
      setVacinasPorPaciente((prev) => ({
        ...prev,
        [paciente.nome]: vacinasAtuais,
      }));
      setPaciente((prev) => ({
        ...prev,
        vacinas: vacinasAtuais,
      }));

      Swal.fire({
        icon: "success",
        title: "Registrado!",
        text: "Dose aplicada com sucesso.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // --- Expandir/contrair ---
  const toggleExpandir = (id) => {
    setExpandedVacina(expandedVacina === id ? null : id);
  };

  // --- Exportar carteira ---
  const exportarCarteira = () => {
    if (!paciente) return;
    const linhas = paciente.vacinas.map(
      (v) =>
        `${v.vacina};${v.dose};${v.data || "Pendente"};${v.lote || "-"};${v.status};${v.proximaDose || "-"}`
    );
    const cabecalho = "Vacina;Dose;Data;Lote;Status;Próxima Dose";
    const csv = "\uFEFF" + cabecalho + "\n" + linhas.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `carteira_vacinacao_${paciente.nome.replace(/\s+/g, "_")}.csv`;
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

  // --- Filtros ---
  const vacinasFiltradas = paciente
    ? filtroStatus === "todos"
      ? paciente.vacinas
      : paciente.vacinas.filter((v) => v.status === filtroStatus)
    : [];

  // --- Ícones de status ---
  const getStatusIcon = (status) => {
    if (status === "aplicada") return <HiCheckCircle className="text-blue-500" />;
    if (status === "pendente") return <HiExclamation className="text-yellow-500" />;
    return null;
  };

  // --- Render ---
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiBeaker className="text-blue-600" /> Carteira de Vacinação
            </h1>
            <p className="text-gray-500 mt-1">
              Busque por nome ou CPF e gerencie o histórico vacinal.
            </p>
          </div>
          <div className="flex gap-2">

            {paciente && (
              <button
                onClick={exportarCarteira}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition"
              >
                <HiDocumentDownload size={18} /> Exportar Carteira
              </button>
            )}
          </div>
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
                    buscarPaciente();
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
                onClick={buscarPaciente}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
              >
                <HiSearch size={18} /> Buscar
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

        {/* Paciente encontrado */}
        {paciente && (
          <>
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {paciente.nome.charAt(0)}
                </div>
                <div className="flex-1 w-full">
                  <h2 className="font-bold text-xl text-gray-800">{paciente.nome}</h2>
                  <p className="text-sm text-gray-500">CPF: {paciente.cpf} | CNS: {paciente.sus}</p>
                  <p className="text-sm text-gray-500">Nasc.: {paciente.dataNasc} | Sexo: {paciente.sexo}</p>
                </div>
                <button
                  onClick={() => registrarVacina(null)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shrink-0"
                >
                  <HiPlus size={18} /> Nova Dose
                </button>
              </div>
            </div>

            {/* Lista de vacinas */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Registro de Doses ({vacinasFiltradas.length})
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFiltroStatus("todos")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filtroStatus === "todos"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFiltroStatus("aplicada")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filtroStatus === "aplicada"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Aplicadas
                  </button>
                  <button
                    onClick={() => setFiltroStatus("pendente")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filtroStatus === "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
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
                    <div key={v.id} className="p-5 hover:bg-gray-50 transition">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleExpandir(v.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl ${
                              v.status === "aplicada" ? "bg-blue-50" : "bg-yellow-50"
                            }`}
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
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
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
                        <div
                          className="mt-4 pl-12 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <span className="text-gray-500">Data aplicação:</span>{" "}
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
                            <span className="font-medium">{v.proximaDose || "—"}</span>
                          </div>
                          {v.status === "aplicada" && (
                            <div className="col-span-2">
                              <span className="text-gray-500">Registrado por:</span>{" "}
                              <span className="font-medium">Atendente (Sistema)</span>
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

        {/* Estado vazio */}
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