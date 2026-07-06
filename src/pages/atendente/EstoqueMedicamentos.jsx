// src/pages/EstoqueMedicamentos.jsx
import { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { estoqueService } from "../../services/estoqueService";
import { dispensacoesService } from "../../services/dispensacoesService";
import {
  HiBeaker,
  HiSearch,
  HiPencil,
  HiTrash,
  HiExclamationCircle,
  HiCheckCircle,
  HiClipboardList,
  HiPlusCircle,
  HiMinusCircle,
  HiCalendar,
  HiCube,
} from "react-icons/hi";

// Função auxiliar para comparar datas (formato YYYY-MM-DD)
const compararDatas = (data1, data2) => {
  return data1.localeCompare(data2);
};

const EstoqueMedicamentos = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [medicamentos, setMedicamentos] = useState([]);
  const [logRetiradas, setLogRetiradas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Carregar medicamentos e log de dispensações
  useEffect(() => {
    const carregarDados = async () => {
      const medicamentosData = await estoqueService.listarMedicamentos();
      setMedicamentos(medicamentosData);
      
      const logData = await dispensacoesService.listar();
      setLogRetiradas(logData);
    };
    carregarDados();
  }, []);

  const hoje = new Date().toISOString().split("T")[0];

  const totalMedicamentos = medicamentos.length;
  const baixoEstoque = medicamentos.filter((m) => m.quantidade <= 10).length;
  const vencidos = medicamentos.filter((m) => compararDatas(m.validade, hoje) < 0).length;
  const validos = medicamentos.filter((m) => compararDatas(m.validade, hoje) >= 0).length;

  const medicamentosFiltrados = useMemo(() => {
    let resultado = medicamentos;
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      resultado = resultado.filter(
        (m) =>
          m.nome.toLowerCase().includes(termo) ||
          m.lote.toLowerCase().includes(termo)
      );
    }
    if (filtroStatus === "baixo")
      resultado = resultado.filter((m) => m.quantidade <= 10);
    else if (filtroStatus === "vencido")
      resultado = resultado.filter((m) => compararDatas(m.validade, hoje) < 0);
    else if (filtroStatus === "valido")
      resultado = resultado.filter((m) => compararDatas(m.validade, hoje) >= 0);
    return resultado;
  }, [medicamentos, termoBusca, filtroStatus, hoje]);

  // ----- DISPENSAR -----
  const retirarMedicamento = async (med) => {
    const { value: formValues } = await Swal.fire({
      title: `Dispensar – ${med.nome}`,
      html: `
        <input id="nomePaciente" class="swal2-input" placeholder="Nome do paciente" required>
        <input id="qtd" type="number" class="swal2-input" placeholder="Quantidade a retirar" value="1" min="1" max="${med.quantidade}" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nome = document.getElementById("nomePaciente").value.trim();
        const qtd = parseInt(document.getElementById("qtd").value);
        if (!nome) {
          Swal.showValidationMessage("Informe o nome do paciente");
          return false;
        }
        if (!qtd || qtd < 1 || qtd > med.quantidade) {
          Swal.showValidationMessage("Quantidade inválida");
          return false;
        }
        return { nome, qtd };
      },
    });
    if (formValues) {
      const novaQtd = med.quantidade - formValues.qtd;
      await estoqueService.atualizarMedicamento(med.id, { quantidade: novaQtd });
      setMedicamentos((prev) =>
        prev.map((m) =>
          m.id === med.id ? { ...m, quantidade: novaQtd } : m
        )
      );

      // Salva no histórico persistente
      const novaDispensacao = {
        data: new Date().toLocaleString(),
        medicamento: med.nome,
        paciente: formValues.nome,
        quantidade: formValues.qtd,
      };
      await dispensacoesService.adicionar(novaDispensacao);
      
      // Atualiza o estado local com o log completo
      const logAtualizado = await dispensacoesService.listar();
      setLogRetiradas(logAtualizado);

      Swal.fire(
        "Retirado!",
        `${formValues.qtd} unidade(s) dispensada(s) para ${formValues.nome}.`,
        "success"
      );
    }
  };

  // Adicionar estoque
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
      const novaQtd = med.quantidade + parseInt(quantidade);
      await estoqueService.atualizarMedicamento(med.id, { quantidade: novaQtd });
      setMedicamentos((prev) =>
        prev.map((m) =>
          m.id === med.id ? { ...m, quantidade: novaQtd } : m
        )
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

  // Adicionar novo medicamento
  const adicionarNovoMedicamento = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Novo medicamento",
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
          document.getElementById("quantidade").value
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
      const novoMedicamento = await estoqueService.criarMedicamento(formValues);
      setMedicamentos([...medicamentos, novoMedicamento]);
      Swal.fire("Adicionado!", "Medicamento cadastrado.", "success");
    }
  };

  // Editar (apenas admin)
  const editarMedicamento = async (med) => {
    if (!isAdmin) {
      Swal.fire("Acesso negado", "Apenas administradores podem editar.", "error");
      return;
    }
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
          document.getElementById("quantidade").value
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
      await estoqueService.atualizarMedicamento(med.id, formValues);
      setMedicamentos((prev) =>
        prev.map((m) => (m.id === med.id ? { ...m, ...formValues } : m))
      );
      Swal.fire("Atualizado!", "Medicamento editado.", "success");
    }
  };

  // Remover (apenas admin)
  const removerMedicamento = async (id) => {
    if (!isAdmin) {
      Swal.fire("Acesso negado", "Apenas administradores podem remover.", "error");
      return;
    }
    const result = await Swal.fire({
      title: "Remover medicamento?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
    });
    if (result.isConfirmed) {
      await estoqueService.deletarMedicamento(id);
      setMedicamentos(medicamentos.filter((m) => m.id !== id));
      Swal.fire("Removido!", "Medicamento removido do estoque.", "success");
    }
  };

  // ----- FUNÇÕES DE STATUS -----
  const getStatusEstoque = (qtd) => {
    if (qtd <= 5) return { cor: "bg-red-100 text-red-700", texto: "Crítico" };
    if (qtd <= 15) return { cor: "bg-yellow-100 text-yellow-700", texto: "Baixo" };
    return { cor: "bg-green-100 text-green-700", texto: "Normal" };
  };

  const getStatusValidade = (validade) => {
    const hojeStr = hoje;
    const diff = compararDatas(validade, hojeStr);
    if (diff < 0)
      return { cor: "text-red-600", bg: "bg-red-100 text-red-700", icone: HiExclamationCircle, label: "Vencido" };
    const dataValidade = new Date(validade);
    const dataHoje = new Date(hojeStr);
    const diffDias = Math.ceil((dataValidade - dataHoje) / (1000 * 60 * 60 * 24));
    if (diffDias <= 30)
      return { cor: "text-yellow-600", bg: "bg-yellow-100 text-yellow-700", icone: HiExclamationCircle, label: "Vence em breve" };
    return { cor: "text-green-600", bg: "bg-green-100 text-green-700", icone: HiCheckCircle, label: "Válido" };
  };

  const limparFiltros = () => {
    setTermoBusca("");
    setFiltroStatus("todos");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiBeaker className="text-blue-600" /> Estoque de Medicamentos
            </h1>
            <p className="text-gray-500 mt-1">
              Dispensação controlada e gestão de lotes.
            </p>
          </div>
          <button
            onClick={adicionarNovoMedicamento}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <HiPlusCircle size={20} /> Novo medicamento
          </button>
        </div>

        {/* CARDS ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Medicamentos",
              value: totalMedicamentos,
              icon: HiCube,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Baixo Estoque (≤10)",
              value: baixoEstoque,
              icon: HiExclamationCircle,
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Vencidos",
              value: vencidos,
              icon: HiCalendar,
              color: "from-red-500 to-red-600",
            },
            {
              label: "Válidos",
              value: validos,
              icon: HiCheckCircle,
              color: "from-green-500 to-green-600",
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

        {/* FILTROS */}
        <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou lote..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="todos">Todos os status</option>
            <option value="baixo">Estoque baixo (≤10)</option>
            <option value="vencido">Vencidos</option>
            <option value="valido">Dentro da validade</option>
          </select>
          <button
            onClick={limparFiltros}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <HiSearch className="text-gray-500" size={14} />
            Limpar Filtros
          </button>
          <span className="text-sm text-gray-500 ml-auto">
            {medicamentosFiltrados.length} de {medicamentos.length} registros
          </span>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Lista de Medicamentos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicamentosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {m.nome}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{m.lote}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{m.quantidade}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusEstoque.cor}`}
                            >
                              {statusEstoque.texto}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <ValIcon className={`${statusVal.cor} text-sm`} />
                            <span className={statusVal.cor}>{m.validade}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {statusVal.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusVal.bg}`}
                          >
                            {statusVal.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => adicionarEstoque(m)}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                              title="Adicionar estoque"
                            >
                              <HiPlusCircle size={16} />
                            </button>
                            <button
                              onClick={() => retirarMedicamento(m)}
                              className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
                              title="Retirar/Dispensar"
                            >
                              <HiMinusCircle size={16} />
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => editarMedicamento(m)}
                                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                  title="Editar"
                                >
                                  <HiPencil size={16} />
                                </button>
                                <button
                                  onClick={() => removerMedicamento(m.id)}
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
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

        {/* HISTÓRICO DE DISPENSAÇÕES - PERSISTENTE */}
        {logRetiradas.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-blue-50/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <HiClipboardList className="text-blue-600" /> Últimas dispensações
              </h3>
            </div>
            <div className="p-6 divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {logRetiradas.slice(0, 30).map((l, i) => (
                <div key={l.id || i} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {l.medicamento} ({l.quantidade} un.) → {l.paciente}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {l.data}
                  </span>
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