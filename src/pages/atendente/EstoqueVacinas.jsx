// src/pages/EstoqueVacinas.jsx
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiBeaker,
  HiSearch,
  HiDownload,
  HiPencil,
  HiTrash,
  HiExclamationCircle,
  HiCheckCircle,
  HiUser,
  HiClipboardList,
  HiPlusCircle,
} from "react-icons/hi";

const EstoqueVacinas = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [vacinas, setVacinas] = useState([
    {
      id: 1,
      nome: "COVID-19",
      lote: "AB123",
      quantidade: 45,
      validade: "2025-12-31",
    },
    {
      id: 2,
      nome: "Gripe",
      lote: "GR789",
      quantidade: 8,
      validade: "2024-10-15",
    },
    {
      id: 3,
      nome: "Febre Amarela",
      lote: "FA456",
      quantidade: 5,
      validade: "2026-01-20",
    },
    {
      id: 4,
      nome: "Hepatite B",
      lote: "HB321",
      quantidade: 28,
      validade: "2025-06-10",
    },
  ]);

  const [logUso, setLogUso] = useState([]); // { data, vacina, paciente, cpf }
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const vacinasFiltradas = useMemo(() => {
    let resultado = vacinas;
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(
        (v) =>
          v.nome.toLowerCase().includes(termo) ||
          v.lote.toLowerCase().includes(termo),
      );
    }
    if (filtroStatus === "baixo") {
      resultado = resultado.filter((v) => v.quantidade <= 10);
    } else if (filtroStatus === "vencido") {
      resultado = resultado.filter((v) => new Date(v.validade) < new Date());
    } else if (filtroStatus === "valido") {
      resultado = resultado.filter((v) => new Date(v.validade) >= new Date());
    }
    return resultado;
  }, [vacinas, termoBusca, filtroStatus]);

  // Registrar uso (reduz 1 unidade) – somente atendente/admin
  const registrarUso = async (vacina) => {
    const { value: formValues } = await Swal.fire({
      title: `Registrar aplicação – ${vacina.nome}`,
      html: `
        <input id="cpfPaciente" class="swal2-input" placeholder="CPF do paciente (000.000.000-00)" required>
        <input id="nomePaciente" class="swal2-input" placeholder="Nome do paciente" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const cpf = document
          .getElementById("cpfPaciente")
          .value.replace(/\D/g, "");
        const nome = document.getElementById("nomePaciente").value.trim();
        if (cpf.length !== 11) {
          Swal.showValidationMessage("CPF deve ter 11 dígitos");
          return false;
        }
        if (!nome) {
          Swal.showValidationMessage("Informe o nome do paciente");
          return false;
        }
        return { cpf, nome };
      },
    });
    if (formValues) {
      setVacinas((prev) =>
        prev.map((v) =>
          v.id === vacina.id
            ? { ...v, quantidade: Math.max(0, v.quantidade - 1) }
            : v,
        ),
      );
      setLogUso((prev) => [
        ...prev,
        {
          data: new Date().toLocaleString(),
          vacina: vacina.nome,
          paciente: formValues.nome,
          cpf: formValues.cpf,
        },
      ]);
      Swal.fire(
        "Registrado!",
        "Uma dose foi debitada e vinculada ao paciente.",
        "success",
      );
    }
  };

  // Adicionar estoque (aumentar quantidade) – qualquer usuário
  const adicionarEstoque = async (vacina) => {
    const { value: quantidade } = await Swal.fire({
      title: `Adicionar doses de ${vacina.nome}`,
      input: "number",
      inputLabel: "Quantidade a adicionar",
      inputValue: 1,
      inputAttributes: { min: 1 },
      showCancelButton: true,
      confirmButtonText: "Adicionar",
    });
    if (quantidade && quantidade > 0) {
      setVacinas((prev) =>
        prev.map((v) =>
          v.id === vacina.id
            ? { ...v, quantidade: v.quantidade + parseInt(quantidade) }
            : v,
        ),
      );
      Swal.fire({
        icon: "success",
        title: "Estoque atualizado",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Adicionar novo tipo de vacina (só admin)
  const adicionarNovaVacina = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nova vacina (admin)",
      html: `
        <input id="nome" class="swal2-input" placeholder="Nome da vacina" required>
        <input id="lote" class="swal2-input" placeholder="Lote" required>
        <input id="quantidade" type="number" class="swal2-input" placeholder="Quantidade" required>
        <input id="validade" type="date" class="swal2-input" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nome = document.getElementById("nome").value;
        const lote = document.getElementById("lote").value;
        const quantidade = parseInt(
          document.getElementById("quantidade").value,
        );
        const validade = document.getElementById("validade").value;
        if (!nome || !lote || !quantidade || !validade) {
          Swal.showValidationMessage("Preencha todos os campos");
          return false;
        }
        return { nome, lote, quantidade, validade };
      },
    });
    if (formValues) {
      const newId = Math.max(0, ...vacinas.map((v) => v.id)) + 1;
      setVacinas([...vacinas, { id: newId, ...formValues }]);
      Swal.fire("Adicionada!", "Nova vacina cadastrada.", "success");
    }
  };

  // Editar vacina (só admin)
  const editarVacina = async (vacina) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar vacina (admin)",
      html: `
        <input id="nome" class="swal2-input" value="${vacina.nome}" required>
        <input id="lote" class="swal2-input" value="${vacina.lote}" required>
        <input id="quantidade" type="number" class="swal2-input" value="${vacina.quantidade}" required>
        <input id="validade" type="date" class="swal2-input" value="${vacina.validade}" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nome = document.getElementById("nome").value;
        const lote = document.getElementById("lote").value;
        const quantidade = parseInt(
          document.getElementById("quantidade").value,
        );
        const validade = document.getElementById("validade").value;
        if (!nome || !lote || !quantidade || !validade) {
          Swal.showValidationMessage("Preencha todos os campos");
          return false;
        }
        return { nome, lote, quantidade, validade };
      },
    });
    if (formValues) {
      setVacinas((prev) =>
        prev.map((v) => (v.id === vacina.id ? { ...v, ...formValues } : v)),
      );
      Swal.fire("Atualizada!", "Vacina editada com sucesso.", "success");
    }
  };

  // Remover vacina (só admin)
  const removerVacina = (id) => {
    Swal.fire({
      title: "Remover vacina?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
    }).then((result) => {
      if (result.isConfirmed) {
        setVacinas(vacinas.filter((v) => v.id !== id));
        Swal.fire("Removida!", "Vacina removida do estoque.", "success");
      }
    });
  };

  const exportarCSV = () => {
    const cabecalho = ["Nome", "Lote", "Quantidade", "Validade"];
    const linhas = vacinas.map((v) => [
      v.nome,
      v.lote,
      v.quantidade,
      v.validade,
    ]);
    const csv = [cabecalho, ...linhas].map((l) => l.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "estoque_vacinas.csv";
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

  const getStatusEstoque = (qtd) => {
    if (qtd <= 5) return { cor: "bg-red-100 text-red-700", texto: "Crítico" };
    if (qtd <= 15)
      return { cor: "bg-yellow-100 text-yellow-700", texto: "Baixo" };
    return { cor: "bg-green-100 text-green-700", texto: "Normal" };
  };

  const getStatusValidade = (validade) => {
    const hoje = new Date();
    const data = new Date(validade);
    const diff = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
    if (diff < 0)
      return {
        cor: "text-red-600",
        icone: HiExclamationCircle,
        label: "Vencida",
      };
    if (diff <= 30)
      return {
        cor: "text-yellow-600",
        icone: HiExclamationCircle,
        label: "Vence em breve",
      };
    return { cor: "text-green-600", icone: HiCheckCircle, label: "Válida" };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiBeaker className="text-emerald-600" /> Estoque de Vacinas
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie doses e registre aplicações.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition"
            >
              <HiDownload size={18} /> Exportar
            </button>
            {isAdmin && (
              <button
                onClick={adicionarNovaVacina}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition"
              >
                + Nova vacina
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou lote..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos os status</option>
            <option value="baixo">Estoque baixo (≤10)</option>
            <option value="vencido">Vencidas</option>
            <option value="valido">Dentro da validade</option>
          </select>
          <span className="text-sm text-gray-500">
            {vacinasFiltradas.length} de {vacinas.length} registros
          </span>
        </div>

        {/* Layout de Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vacinasFiltradas.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              Nenhuma vacina encontrada.
            </div>
          ) : (
            vacinasFiltradas.map((v) => {
              const statusEstoque = getStatusEstoque(v.quantidade);
              const statusVal = getStatusValidade(v.validade);
              const ValIcon = statusVal.icone;
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-6 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <HiBeaker className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{v.nome}</h3>
                        <p className="text-xs text-gray-500">Lote: {v.lote}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => editarVacina(v)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          title="Editar"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          onClick={() => removerVacina(v.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          title="Remover"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Quantidade</p>
                      <p className="text-xl font-bold text-gray-800">
                        {v.quantidade}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusEstoque.cor}`}
                      >
                        {statusEstoque.texto}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Validade</p>
                      <div className="flex items-center gap-1">
                        <ValIcon className={`${statusVal.cor} text-sm`} />
                        <span className={statusVal.cor}>{v.validade}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {statusVal.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => adicionarEstoque(v)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition flex items-center justify-center gap-1"
                    >
                      <HiPlusCircle size={16} /> Adicionar
                    </button>
                    <button
                      onClick={() => registrarUso(v)}
                      disabled={v.quantidade <= 0}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiUser size={16} /> Aplicar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Log de aplicações */}
        {logUso.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HiClipboardList className="text-emerald-600" /> Registro de
              aplicações recentes
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logUso.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {l.vacina} → {l.paciente}
                    </p>
                    <p className="text-xs text-gray-500">CPF: {l.cpf}</p>
                  </div>
                  <span className="text-xs text-gray-400">{l.data}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstoqueVacinas;
