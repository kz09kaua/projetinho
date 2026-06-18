// src/pages/GerenciarFilas.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

const GerenciarFilas = () => {
  const { user } = useAuth();

  // Verifica se o usuário é atendente (se não for, exibe acesso negado)
  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Acesso negado</h1>
          <p className="text-on-surface-variant">
            Esta área é restrita a atendentes.
          </p>
        </div>
      </div>
    );
  }

  // Estrutura das filas (igual antes)
  const [filas, setFilas] = useState([
    {
      id: 1,
      especialidade: "Clínica Geral",
      pacientes: [
        { nome: "José Souza", cpf: "123.456.789-00", dataNasc: "15/03/1980" },
        { nome: "Maria Lima", cpf: "987.654.321-00", dataNasc: "22/07/1990" },
        { nome: "Pedro Santos", cpf: "456.789.123-00", dataNasc: "10/12/1975" },
      ],
    },
    {
      id: 2,
      especialidade: "Pediatria",
      pacientes: [
        { nome: "Lucas Mendes", cpf: "111.222.333-44", dataNasc: "05/05/2020" },
        { nome: "Sofia Costa", cpf: "555.666.777-88", dataNasc: "12/12/2021" },
      ],
    },
    {
      id: 3,
      especialidade: "Vacinação",
      pacientes: [
        {
          nome: "Fernanda Rocha",
          cpf: "999.888.777-66",
          dataNasc: "30/04/1995",
        },
        { nome: "Rafael Alves", cpf: "444.555.666-77", dataNasc: "17/09/1988" },
      ],
    },
  ]);

  const [searchTerms, setSearchTerms] = useState({ 0: "", 1: "", 2: "" });
  const [logRemocoes, setLogRemocoes] = useState([]); // opcional: armazenar justificativas

  const handleSearchChange = (idx, value) => {
    setSearchTerms((prev) => ({ ...prev, [idx]: value }));
  };

  const filtrarPacientes = (pacientes, termo) => {
    if (!termo.trim()) return pacientes;
    const lowerTermo = termo.toLowerCase();
    return pacientes.filter(
      (p) => p.nome.toLowerCase().includes(lowerTermo) || p.cpf.includes(termo),
    );
  };

  // Chamar o próximo da fila (primeiro)
  const chamarProximo = (especialidadeIndex) => {
    const fila = filas[especialidadeIndex];
    if (fila.pacientes.length === 0) {
      Swal.fire("Fila vazia", "Não há pacientes na fila.", "info");
      return;
    }
    const paciente = fila.pacientes[0];
    Swal.fire({
      title: "Chamar paciente",
      html: `
        <div class="text-left">
          <p><strong>Nome:</strong> ${paciente.nome}</p>
          <p><strong>CPF:</strong> ${paciente.cpf}</p>
          <p><strong>Data de Nasc.:</strong> ${paciente.dataNasc}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, chamar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const novasFilas = [...filas];
        novasFilas[especialidadeIndex].pacientes.shift();
        setFilas(novasFilas);
        Swal.fire("Chamado!", `${paciente.nome} foi chamado(a).`, "success");
      }
    });
  };

  // Chamar um paciente específico (fora de ordem)
  const chamarEspecifico = (especialidadeIndex, pacienteIndex, paciente) => {
    Swal.fire({
      title: "Chamar paciente fora de ordem?",
      html: `
        <div class="text-left">
          <p><strong>Nome:</strong> ${paciente.nome}</p>
          <p><strong>CPF:</strong> ${paciente.cpf}</p>
          <p><strong>Posição na fila:</strong> ${pacienteIndex + 1}º</p>
          <label class="block mt-3 font-medium">Justificativa (opcional):</label>
          <input id="justificativa" class="swal2-input" placeholder="Ex: urgência, idoso, etc.">
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, chamar agora",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const justificativa =
          document.getElementById("justificativa").value || "Não informada";
        return { justificativa };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const novasFilas = [...filas];
        // Remove o paciente da posição atual
        novasFilas[especialidadeIndex].pacientes.splice(pacienteIndex, 1);
        setFilas(novasFilas);
        Swal.fire({
          title: "Paciente chamado!",
          html: `${paciente.nome} foi chamado(a) para atendimento.<br><small>Justificativa: ${result.value.justificativa}</small>`,
          icon: "success",
        });
        // Opcional: salvar log
        setLogRemocoes((prev) => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            acao: "CHAMADA_ESPECIFICA",
            paciente: paciente.nome,
            especialidade: filas[especialidadeIndex].especialidade,
            justificativa: result.value.justificativa,
          },
        ]);
      }
    });
  };

  // Remover paciente da fila (com justificativa obrigatória)
  const removerPaciente = (especialidadeIndex, pacienteIndex, paciente) => {
    Swal.fire({
      title: "Remover paciente da fila",
      html: `
        <div class="text-left">
          <p><strong>Nome:</strong> ${paciente.nome}</p>
          <p><strong>CPF:</strong> ${paciente.cpf}</p>
          <label class="block mt-3 font-medium">Justificativa (obrigatória):</label>
          <input id="justificativa" class="swal2-input" placeholder="Ex: desistiu, ausente, etc." required>
        </div>
      `,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Remover",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const justificativa = document.getElementById("justificativa").value;
        if (!justificativa) {
          Swal.showValidationMessage("A justificativa é obrigatória");
          return false;
        }
        return { justificativa };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const novasFilas = [...filas];
        const removido = novasFilas[especialidadeIndex].pacientes.splice(
          pacienteIndex,
          1,
        )[0];
        setFilas(novasFilas);
        Swal.fire({
          title: "Paciente removido!",
          html: `${removido.nome} foi removido da fila.<br><small>Justificativa: ${result.value.justificativa}</small>`,
          icon: "info",
        });
        // Salvar log
        setLogRemocoes((prev) => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            acao: "REMOCAO",
            paciente: removido.nome,
            especialidade: filas[especialidadeIndex].especialidade,
            justificativa: result.value.justificativa,
          },
        ]);
      }
    });
  };

  // Adicionar paciente (já existente)
  const adicionarPaciente = async (especialidadeIndex) => {
    const { value: formValues } = await Swal.fire({
      title: "Adicionar paciente",
      html: `
        <input id="nome" class="swal2-input" placeholder="Nome completo" required>
        <input id="cpf" class="swal2-input" placeholder="CPF (000.000.000-00)" required>
        <input id="dataNasc" type="date" class="swal2-input" required>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const dataNasc = document.getElementById("dataNasc").value;
        if (!nome || !cpf || !dataNasc) {
          Swal.showValidationMessage("Preencha todos os campos");
          return false;
        }
        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
          Swal.showValidationMessage("CPF inválido (deve ter 11 dígitos)");
          return false;
        }
        return { nome, cpf, dataNasc };
      },
    });
    if (formValues) {
      const cpfExiste = filas[especialidadeIndex].pacientes.some(
        (p) => p.cpf === formValues.cpf,
      );
      if (cpfExiste) {
        Swal.fire(
          "Erro",
          "Este CPF já está na fila desta especialidade.",
          "error",
        );
        return;
      }
      const novasFilas = [...filas];
      novasFilas[especialidadeIndex].pacientes.push({
        nome: formValues.nome,
        cpf: formValues.cpf,
        dataNasc: formValues.dataNasc,
      });
      setFilas(novasFilas);
      Swal.fire(
        "Adicionado!",
        `${formValues.nome} foi adicionado à fila.`,
        "success",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-on-surface mb-2">
        Gerenciar Filas de Atendimento
      </h1>
      <p className="text-on-surface-variant mb-8">
        Chame o próximo paciente, adicione manualmente ou pesquise por nome/CPF.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {filas.map((fila, idx) => {
          const pacientesFiltrados = filtrarPacientes(
            fila.pacientes,
            searchTerms[idx],
          );
          return (
            <div
              key={fila.id}
              className="bg-surface rounded-2xl border p-6 shadow-sm flex flex-col"
            >
              <h2 className="text-xl font-black mb-4">{fila.especialidade}</h2>

              {/* Barra de pesquisa */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="🔍 Pesquisar por nome ou CPF..."
                  value={searchTerms[idx]}
                  onChange={(e) => handleSearchChange(idx, e.target.value)}
                  className="w-full p-2 border rounded-lg bg-surface-container-lowest text-on-surface"
                />
              </div>

              <div className="mb-4 flex-1">
                <p className="font-bold">
                  Pacientes na fila ({pacientesFiltrados.length})
                </p>
                {pacientesFiltrados.length === 0 ? (
                  <p className="text-gray-500">Nenhum paciente encontrado</p>
                ) : (
                  <ul className="mt-2 space-y-2 max-h-96 overflow-y-auto">
                    {pacientesFiltrados.map((p, i) => {
                      // Índice original do paciente na lista completa (para remoção)
                      const originalIndex = fila.pacientes.findIndex(
                        (pac) => pac.cpf === p.cpf,
                      );
                      return (
                        <li
                          key={i}
                          className="text-sm p-3 bg-surface-container-high rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-on-surface">
                                {p.nome}
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                CPF: {p.cpf}
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                Nasc: {p.dataNasc}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  chamarEspecifico(idx, originalIndex, p)
                                }
                                className="text-primary text-xs font-bold hover:underline"
                                title="Chamar fora de ordem"
                              >
                                Atender
                              </button>
                              <button
                                onClick={() =>
                                  removerPaciente(idx, originalIndex, p)
                                }
                                className="text-error text-xs font-bold hover:underline"
                                title="Remover da fila"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => chamarProximo(idx)}
                  className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-bold hover:opacity-90 transition"
                >
                  Chamar próximo
                </button>
                <button
                  onClick={() => adicionarPaciente(idx)}
                  className="flex-1 bg-secondary text-white py-2 rounded-xl font-bold hover:opacity-90 transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão para ver log (opcional) */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            if (logRemocoes.length === 0) {
              Swal.fire(
                "Nenhum registro",
                "Nenhuma ação registrada ainda.",
                "info",
              );
            } else {
              const logText = logRemocoes
                .map(
                  (l) =>
                    `${l.data} - ${l.acao} - ${l.paciente} (${l.especialidade}) - Just.: ${l.justificativa}`,
                )
                .join("\n");
              Swal.fire({
                title: "Histórico de Ações",
                html: `<pre class="text-left text-xs max-h-96 overflow-auto">${logText}</pre>`,
                confirmButtonText: "Fechar",
              });
            }
          }}
          className="text-sm text-primary underline"
        >
          Ver histórico de ações
        </button>
      </div>
    </div>
  );
};

export default GerenciarFilas;
