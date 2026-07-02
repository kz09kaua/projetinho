// src/pages/EstoqueVacinas.jsx
import { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { estoqueService } from "../../services/estoqueService";
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

  const [pacientes, setPacientes] = useState([]);
  const [vacinas, setVacinas] = useState([]);

  const [logUso, setLogUso] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Carregar vacinas do Supabase
  useEffect(() => {
    estoqueService.listarVacinas().then(setVacinas);
  }, []);

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

  const registrarUso = async (vacina) => {
    if (pacientes.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Nenhum paciente cadastrado",
        text: "Não há pacientes cadastrados no sistema. Cadastre um paciente primeiro.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const pacientesOptions = pacientes.map((p) => ({
      id: p.id,
      nome: p.nome,
      cpf: p.cpf,
    }));

    const { value: pacienteSelecionado } = await Swal.fire({
      title: `Registrar aplicação – ${vacina.nome}`,
      html: `
        <div style="text-align:left;max-width:100%;">
          <div style="margin-bottom:20px;">
            <label style="display:block;text-align:left;font-weight:600;font-size:14px;color:#374151;margin-bottom:8px;">
              <span style="color:#ef4444;">*</span> Selecione o paciente
            </label>
            <select 
              id="pacienteSelect" 
              style="width:100%;padding:12px 14px;border-radius:10px;border:2px solid #e5e7eb;font-size:14px;background-color:white;transition:all 0.2s;cursor:pointer;outline:none;"
              onfocus="this.style.borderColor='#2563eb'"
              onblur="this.style.borderColor='#e5e7eb'"
            >
              <option value="">Selecione um paciente...</option>
              ${pacientesOptions.map((p) => `
                <option value="${p.id}">
                  ${p.nome} - CPF: ${p.cpf}
                </option>
              `).join('')}
            </select>
          </div>
          <div style="margin-bottom:8px;">
            <label style="display:block;text-align:left;font-weight:600;font-size:14px;color:#374151;margin-bottom:8px;">
              Observação <span style="color:#9ca3af;font-size:12px;">(opcional)</span>
            </label>
            <input 
              id="observacao" 
              placeholder="Ex: Dose de reforço, primeira dose, etc..." 
              style="width:100%;padding:12px 14px;border-radius:10px;border:2px solid #e5e7eb;font-size:14px;background-color:white;transition:all 0.2s;outline:none;"
              onfocus="this.style.borderColor='#2563eb'"
              onblur="this.style.borderColor='#e5e7eb'"
            >
          </div>
          <div style="text-align:left;font-size:12px;color:#9ca3af;margin-top:8px;">
            * Campo obrigatório
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Registrar aplicação",
      confirmButtonColor: "#2563eb",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#6b7280",
      width: 500,
      padding: '1.5rem',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'font-semibold px-6',
        cancelButton: 'font-semibold px-6',
        title: 'text-xl font-bold text-gray-800',
      },
      preConfirm: () => {
        const pacienteId = document.getElementById("pacienteSelect").value;
        const observacao = document.getElementById("observacao").value.trim();
        
        if (!pacienteId) {
          Swal.showValidationMessage("Selecione um paciente");
          return false;
        }
        
        const paciente = pacientes.find(p => p.id === parseInt(pacienteId));
        return { paciente, observacao };
      },
    });

    if (pacienteSelecionado) {
      const { paciente, observacao } = pacienteSelecionado;
      
      if (vacina.quantidade <= 0) {
        await Swal.fire({
          icon: "error",
          title: "Estoque insuficiente",
          text: "Não há doses disponíveis desta vacina.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }

      const confirmar = await Swal.fire({
        title: "Confirmar aplicação",
        html: `
          <div style="text-align:left;background:#f9fafb;padding:16px;border-radius:12px;max-width:100%;">
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;">
              <span style="font-weight:600;color:#4b5563;min-width:100px;text-align:left;">Paciente:</span>
              <span style="font-weight:500;color:#1f2937;text-align:left;">${paciente.nome}</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;">
              <span style="font-weight:600;color:#4b5563;min-width:100px;text-align:left;">CPF:</span>
              <span style="font-weight:500;color:#1f2937;text-align:left;">${paciente.cpf}</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;">
              <span style="font-weight:600;color:#4b5563;min-width:100px;text-align:left;">Vacina:</span>
              <span style="font-weight:500;color:#1f2937;text-align:left;">${vacina.nome}</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;">
              <span style="font-weight:600;color:#4b5563;min-width:100px;text-align:left;">Lote:</span>
              <span style="font-weight:500;color:#1f2937;text-align:left;">${vacina.lote}</span>
            </div>
            ${observacao ? `
              <div style="display:flex;align-items:flex-start;gap:12px;margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;">
                <span style="font-weight:600;color:#4b5563;min-width:100px;text-align:left;">Observação:</span>
                <span style="color:#6b7280;font-style:italic;text-align:left;">${observacao}</span>
              </div>
            ` : ''}
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar aplicação",
        confirmButtonColor: "#2563eb",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#6b7280",
        width: 500,
        padding: '1.5rem',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'font-semibold px-6',
          cancelButton: 'font-semibold px-6',
          title: 'text-xl font-bold text-gray-800',
        },
      });

      if (confirmar.isConfirmed) {
        const novaQtd = Math.max(0, vacina.quantidade - 1);
        await estoqueService.atualizarVacina(vacina.id, { quantidade: novaQtd });
        setVacinas((prev) =>
          prev.map((v) =>
            v.id === vacina.id
              ? { ...v, quantidade: novaQtd }
              : v,
          ),
        );

        setLogUso((prev) => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            vacina: vacina.nome,
            paciente: paciente.nome,
            cpf: paciente.cpf,
            observacao: observacao || "Sem observação",
          },
        ]);

        await Swal.fire({
          icon: "success",
          title: "Aplicação registrada com sucesso!",
          html: `
            <div style="text-align:center;margin-top:8px;">
              <div style="margin-bottom:6px;">
                <span style="font-weight:600;color:#4b5563;">Vacina:</span>
                <span style="font-weight:500;color:#1f2937;"> ${vacina.nome}</span>
              </div>
              <div style="margin-bottom:6px;">
                <span style="font-weight:600;color:#4b5563;">Paciente:</span>
                <span style="font-weight:500;color:#1f2937;"> ${paciente.nome}</span>
              </div>
              ${observacao ? `
                <div style="font-size:13px;color:#6b7280;margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;">
                  ${observacao}
                </div>
              ` : ''}
            </div>
          `,
          confirmButtonColor: "#2563eb",
          confirmButtonText: "OK",
          timer: 4000,
          timerProgressBar: true,
          width: 450,
          padding: '1.5rem',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'font-semibold px-6',
            title: 'text-xl font-bold text-gray-800',
          },
        });
      }
    }
  };

  const adicionarEstoque = async (vacina) => {
    const { value: quantidade } = await Swal.fire({
      title: `Adicionar doses de ${vacina.nome}`,
      input: "number",
      inputLabel: "Quantidade a adicionar",
      inputValue: 1,
      inputAttributes: { min: 1 },
      showCancelButton: true,
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#2563eb",
      width: 450,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'font-semibold px-6',
        cancelButton: 'font-semibold px-6',
        title: 'text-xl font-bold text-gray-800',
      },
    });
    if (quantidade && quantidade > 0) {
      const novaQtd = vacina.quantidade + parseInt(quantidade);
      await estoqueService.atualizarVacina(vacina.id, { quantidade: novaQtd });
      setVacinas((prev) =>
        prev.map((v) =>
          v.id === vacina.id
            ? { ...v, quantidade: novaQtd }
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
      width: 450,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'font-semibold px-6',
        cancelButton: 'font-semibold px-6',
        title: 'text-xl font-bold text-gray-800',
      },
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
      const novaVacina = await estoqueService.criarVacina(formValues);
      setVacinas([...vacinas, novaVacina]);
      Swal.fire({
        icon: "success",
        title: "Adicionada!",
        text: "Nova vacina cadastrada.",
        confirmButtonColor: "#2563eb",
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'font-semibold px-6',
          title: 'text-xl font-bold text-gray-800',
        },
      });
    }
  };

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
      width: 450,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'font-semibold px-6',
        cancelButton: 'font-semibold px-6',
        title: 'text-xl font-bold text-gray-800',
      },
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
      await estoqueService.atualizarVacina(vacina.id, formValues);
      setVacinas((prev) =>
        prev.map((v) => (v.id === vacina.id ? { ...v, ...formValues } : v)),
      );
      Swal.fire({
        icon: "success",
        title: "Atualizada!",
        text: "Vacina editada com sucesso.",
        confirmButtonColor: "#2563eb",
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'font-semibold px-6',
          title: 'text-xl font-bold text-gray-800',
        },
      });
    }
  };

  const removerVacina = async (id) => {
    const result = await Swal.fire({
      title: "Remover vacina?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      width: 450,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'font-semibold px-6',
        cancelButton: 'font-semibold px-6',
        title: 'text-xl font-bold text-gray-800',
      },
    });
    if (result.isConfirmed) {
      await estoqueService.deletarVacina(id);
      setVacinas(vacinas.filter((v) => v.id !== id));
      Swal.fire({
        icon: "success",
        title: "Removida!",
        text: "Vacina removida do estoque.",
        confirmButtonColor: "#2563eb",
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'font-semibold px-6',
          title: 'text-xl font-bold text-gray-800',
        },
      });
    }
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
    return { cor: "bg-blue-100 text-blue-700", texto: "Normal" };
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
    return { cor: "text-blue-600", icone: HiCheckCircle, label: "Válida" };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiBeaker className="text-blue-600" /> Estoque de Vacinas
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie doses e registre aplicações.
            </p>
          </div>
          <div className="flex gap-3">
           
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
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border rounded-xl px-4 py-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
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
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          title="Editar"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          onClick={() => removerVacina(v.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                          title="Remover"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Quantidade
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {v.quantidade}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusEstoque.cor}`}
                      >
                        {statusEstoque.texto}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Validade
                      </p>
                      <div className="flex items-center gap-1">
                        <ValIcon className={`${statusVal.cor} text-sm`} />
                        <span className={`${statusVal.cor} font-medium`}>
                          {v.validade}
                        </span>
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
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      <HiUser size={16} /> Aplicar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {logUso.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HiClipboardList className="text-blue-600" /> Registro de
              aplicações recentes
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logUso.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {l.vacina} → {l.paciente}
                    </p>
                    <p className="text-xs text-gray-500">CPF: {l.cpf}</p>
                    {l.observacao && (
                      <p className="text-xs text-gray-400 mt-1">
                        {l.observacao}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
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

export default EstoqueVacinas;