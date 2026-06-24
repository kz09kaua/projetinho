// src/pages/EstoqueMedicamentos.jsx
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
  HiMinusCircle,
} from "react-icons/hi";

const EstoqueMedicamentos = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [medicamentos, setMedicamentos] = useState([
    {
      id: 1,
      nome: "Paracetamol 500mg",
      lote: "PAR001",
      quantidade: 120,
      validade: "2026-05-20",
    },
    {
      id: 2,
      nome: "Ibuprofeno 400mg",
      lote: "IBU002",
      quantidade: 7,
      validade: "2025-11-15",
    },
    {
      id: 3,
      nome: "Amoxicilina 500mg",
      lote: "AMX003",
      quantidade: 42,
      validade: "2024-12-10",
    },
    {
      id: 4,
      nome: "Losartana 50mg",
      lote: "LOS004",
      quantidade: 18,
      validade: "2026-02-28",
    },
  ]);

  const [logRetiradas, setLogRetiradas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const medicamentosFiltrados = useMemo(() => {
    let resultado = medicamentos;
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(
        (m) =>
          m.nome.toLowerCase().includes(termo) ||
          m.lote.toLowerCase().includes(termo),
      );
    }
    if (filtroStatus === "baixo")
      resultado = resultado.filter((m) => m.quantidade <= 10);
    else if (filtroStatus === "vencido")
      resultado = resultado.filter((m) => new Date(m.validade) < new Date());
    else if (filtroStatus === "valido")
      resultado = resultado.filter((m) => new Date(m.validade) >= new Date());
    return resultado;
  }, [medicamentos, termoBusca, filtroStatus]);

  // Retirar medicamento (dispensar) – vinculado a paciente
  const retirarMedicamento = async (med) => {
    const { value: formValues } = await Swal.fire({
      title: `Dispensar – ${med.nome}`,
      html: `
        <input id="cpfPaciente" class="swal2-input" placeholder="CPF do paciente" required>
        <input id="nomePaciente" class="swal2-input" placeholder="Nome do paciente" required>
        <input id="qtd" type="number" class="swal2-input" placeholder="Quantidade a retirar" value="1" min="1" max="${med.quantidade}" required>
        <input id="justificativa" class="swal2-input" placeholder="Justificativa" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const cpf = document
          .getElementById("cpfPaciente")
          .value.replace(/\D/g, "");
        const nome = document.getElementById("nomePaciente").value.trim();
        const qtd = parseInt(document.getElementById("qtd").value);
        const justificativa = document
          .getElementById("justificativa")
          .value.trim();
        if (cpf.length !== 11) {
          Swal.showValidationMessage("CPF inválido");
          return false;
        }
        if (!nome) {
          Swal.showValidationMessage("Informe o nome");
          return false;
        }
        if (!qtd || qtd < 1 || qtd > med.quantidade) {
          Swal.showValidationMessage("Quantidade inválida");
          return false;
        }
        if (!justificativa) {
          Swal.showValidationMessage("Justificativa obrigatória");
          return false;
        }
        return { cpf, nome, qtd, justificativa };
      },
    });
    if (formValues) {
      setMedicamentos((prev) =>
        prev.map((m) =>
          m.id === med.id
            ? { ...m, quantidade: m.quantidade - formValues.qtd }
            : m,
        ),
      );
      setLogRetiradas((prev) => [
        ...prev,
        {
          data: new Date().toLocaleString(),
          medicamento: med.nome,
          paciente: formValues.nome,
          cpf: formValues.cpf,
          quantidade: formValues.qtd,
          justificativa: formValues.justificativa,
        },
      ]);
      Swal.fire(
        "Retirado!",
        `${formValues.qtd} unidade(s) dispensada(s).`,
        "success",
      );
    }
  };

  // Adicionar estoque (aumentar quantidade)
  const adicionarEstoque = async (med) => {
    const { value: quantidade } = await Swal.fire({
      title: `Adicionar ao estoque de ${med.nome}`,
      input: "number",
      inputLabel: "Quantidade a adicionar",
      inputValue: 1,
      inputAttributes: { min: 1 },
      showCancelButton: true,
      confirmButtonText: "Adicionar",
    });
    if (quantidade && quantidade > 0) {
      setMedicamentos((prev) =>
        prev.map((m) =>
          m.id === med.id
            ? { ...m, quantidade: m.quantidade + parseInt(quantidade) }
            : m,
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

  // Adicionar novo tipo (só admin)
  const adicionarNovoMedicamento = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Novo medicamento (admin)",
      html: `
        <input id="nome" class="swal2-input" placeholder="Nome" required>
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
      const newId = Math.max(0, ...medicamentos.map((m) => m.id)) + 1;
      setMedicamentos([...medicamentos, { id: newId, ...formValues }]);
      Swal.fire("Adicionado!", "Medicamento cadastrado.", "success");
    }
  };

  // Editar (só admin)
  const editarMedicamento = async (med) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar medicamento (admin)",
      html: `
        <input id="nome" class="swal2-input" value="${med.nome}" required>
        <input id="lote" class="swal2-input" value="${med.lote}" required>
        <input id="quantidade" type="number" class="swal2-input" value="${med.quantidade}" required>
        <input id="validade" type="date" class="swal2-input" value="${med.validade}" required>
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
      setMedicamentos((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, ...formValues } : m)),
      );
      Swal.fire("Atualizado!", "Medicamento editado.", "success");
    }
  };

  // Remover (só admin)
  const removerMedicamento = (id) => {
    Swal.fire({
      title: "Remover medicamento?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
    }).then((result) => {
      if (result.isConfirmed) {
        setMedicamentos(medicamentos.filter((m) => m.id !== id));
        Swal.fire("Removido!", "Medicamento removido do estoque.", "success");
      }
    });
  };

  const exportarCSV = () => {
    const cabecalho = ["Nome", "Lote", "Quantidade", "Validade"];
    const linhas = medicamentos.map((m) => [
      m.nome,
      m.lote,
      m.quantidade,
      m.validade,
    ]);
    const csv = [cabecalho, ...linhas].map((l) => l.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "estoque_medicamentos.csv";
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
        label: "Vencido",
      };
    if (diff <= 30)
      return {
        cor: "text-yellow-600",
        icone: HiExclamationCircle,
        label: "Vence em breve",
      };
    return { cor: "text-green-600", icone: HiCheckCircle, label: "Válido" };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiBeaker className="text-purple-600" /> Estoque de Medicamentos
            </h1>
            <p className="text-gray-500 mt-1">
              Dispensação controlada e gestão de lotes.
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
                onClick={adicionarNovoMedicamento}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition"
              >
                + Novo medicamento
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
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500"
          >
            <option value="todos">Todos os status</option>
            <option value="baixo">Estoque baixo (≤10)</option>
            <option value="vencido">Vencidos</option>
            <option value="valido">Dentro da validade</option>
          </select>
          <span className="text-sm text-gray-500">
            {medicamentosFiltrados.length} de {medicamentos.length} registros
          </span>
        </div>

        {/* Tabela roxa/laranja */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50 border-b">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-purple-700">
                    Nome
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-purple-700">
                    Lote
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-purple-700">
                    Quantidade
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-purple-700">
                    Validade
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-purple-700">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-purple-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicamentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Nenhum medicamento encontrado.
                    </td>
                  </tr>
                ) : (
                  medicamentosFiltrados.map((m) => {
                    const statusEstoque = getStatusEstoque(m.quantidade);
                    const statusVal = getStatusValidade(m.validade);
                    const ValIcon = statusVal.icone;
                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-purple-50/30 transition-colors"
                      >
                        <td className="p-4 font-medium text-gray-800">
                          {m.nome}
                        </td>
                        <td className="p-4 text-gray-600">{m.lote}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{m.quantidade}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusEstoque.cor}`}
                            >
                              {statusEstoque.texto}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <ValIcon className={`${statusVal.cor} text-sm`} />
                            <span className={statusVal.cor}>{m.validade}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {statusVal.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              new Date(m.validade) < new Date()
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {new Date(m.validade) < new Date()
                              ? "Vencido"
                              : "Válido"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => adicionarEstoque(m)}
                              className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                              title="Adicionar estoque"
                            >
                              <HiPlusCircle size={16} />
                            </button>
                            <button
                              onClick={() => retirarMedicamento(m)}
                              className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
                              title="Retirar/Dispensar"
                            >
                              <HiMinusCircle size={16} />
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => editarMedicamento(m)}
                                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                  title="Editar"
                                >
                                  <HiPencil size={16} />
                                </button>
                                <button
                                  onClick={() => removerMedicamento(m.id)}
                                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                  title="Remover"
                                >
                                  <HiTrash size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {logRetiradas.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HiClipboardList className="text-purple-600" /> Últimas
              dispensações
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logRetiradas.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {l.medicamento} ({l.quantidade} un.) → {l.paciente}
                    </p>
                    <p className="text-xs text-gray-500">
                      CPF: {l.cpf} | Just.: {l.justificativa}
                    </p>
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

export default EstoqueMedicamentos;
