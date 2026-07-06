// src/pages/atendente/GerenciarFilas.jsx
import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { HiUserGroup, HiSearch, HiPlus, HiX, HiRefresh } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import { filasService } from "../../services/filasService";
import ChatAtendimento from "../../components/ChatAtendimento";

const GerenciarFilas = () => {
  const { user, ubsSelecionada } = useAuth();

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso negado</h1>
          <p className="text-gray-500">Esta área é restrita a atendentes.</p>
        </div>
      </div>
    );
  }

  // Estado das filas agrupadas por especialidade
  const [filas, setFilas] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [logRemocoes, setLogRemocoes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para carregar e agrupar filas por especialidade (apenas da UBS do atendente)
  const carregarFilas = useCallback(async () => {
    if (!ubsSelecionada) return;

    setLoading(true);
    try {
      const todas = await filasService.listar();
      const daUbs = todas.filter(f => f.ubs === ubsSelecionada);

      // Agrupar por especialidade
      const grouped = {};
      daUbs.forEach(f => {
        const key = f.especialidade;
        if (!grouped[key]) {
          grouped[key] = {
            id: key, // usando a especialidade como id único do grupo
            especialidade: key,
            pacientes: [],
          };
        }
        grouped[key].pacientes.push({
          id: f.id,
          nome: f.paciente,
          cpf: f.cpf || "Não informado",
          dataNasc: f.dataNasc || "Não informado",
          posicao: f.posicao,
          senha: f.senha,
          prioridade: f.prioridade,
          status: f.status,
        });
      });

      // Ordenar pacientes dentro de cada especialidade pela posição
      Object.values(grouped).forEach(grupo => {
        grupo.pacientes.sort((a, b) => a.posicao - b.posicao);
      });

      const filasArray = Object.values(grouped);
      setFilas(filasArray);

      // Inicializar searchTerms para cada grupo
      const initialTerms = {};
      filasArray.forEach((_, idx) => {
        if (searchTerms[idx] === undefined) {
          initialTerms[idx] = "";
        } else {
          initialTerms[idx] = searchTerms[idx];
        }
      });
      setSearchTerms(initialTerms);
    } catch (error) {
      console.error("Erro ao carregar filas:", error);
    } finally {
      setLoading(false);
    }
  }, [ubsSelecionada]);

  // Carregar filas inicialmente e a cada 5 segundos (polling)
  useEffect(() => {
    carregarFilas();
    const interval = setInterval(carregarFilas, 5000);
    return () => clearInterval(interval);
  }, [carregarFilas]);

  // Atualizar searchTerms quando as filas mudarem (mantendo termos existentes)
  useEffect(() => {
    const updatedTerms = {};
    filas.forEach((_, idx) => {
      updatedTerms[idx] = searchTerms[idx] || "";
    });
    setSearchTerms(updatedTerms);
  }, [filas]);

  const handleSearchChange = (idx, value) => {
    setSearchTerms(prev => ({ ...prev, [idx]: value }));
  };

  const filtrarPacientes = (pacientes, termo) => {
    if (!termo || !termo.trim()) return pacientes;
    const lowerTermo = termo.toLowerCase();
    return pacientes.filter(
      p => p.nome.toLowerCase().includes(lowerTermo) || (p.cpf && p.cpf.includes(termo))
    );
  };

  // Chamar o próximo paciente da fila (primeiro da lista)
  const chamarProximo = async (idx) => {
    const fila = filas[idx];
    if (!fila || fila.pacientes.length === 0) {
      Swal.fire("Fila vazia", "Não há pacientes na fila.", "info");
      return;
    }
    const paciente = fila.pacientes[0];

    const result = await Swal.fire({
      title: "Chamar próximo",
      html: `<strong>${paciente.nome}</strong><br>CPF: ${paciente.cpf}<br>Senha: ${paciente.senha}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Chamar",
    });

    if (result.isConfirmed) {
      try {
        // Remove do banco (ou atualiza status para "Em Atendimento")
        await filasService.atualizarStatus(paciente.id, "Em Atendimento");
        Swal.fire("Chamado!", `${paciente.nome} foi chamado(a).`, "success");
        carregarFilas(); // atualiza a lista
      } catch (error) {
        Swal.fire("Erro", "Não foi possível chamar o paciente.", "error");
      }
    }
  };

  // Chamar paciente específico (fora de ordem)
  const chamarEspecifico = async (idx, pacienteIndex, paciente) => {
    const result = await Swal.fire({
      title: "Chamar fora de ordem?",
      html: `<strong>${paciente.nome}</strong> (posição ${pacienteIndex + 1})<br>Senha: ${paciente.senha}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, chamar agora",
      input: "text",
      inputPlaceholder: "Justificativa (opcional)",
    });

    if (result.isConfirmed) {
      const justificativa = result.value || "Não informada";
      try {
        await filasService.atualizarStatus(paciente.id, "Em Atendimento");
        setLogRemocoes(prev => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            acao: "CHAMADA_ESPECIFICA",
            paciente: paciente.nome,
            especialidade: filas[idx].especialidade,
            justificativa,
          },
        ]);
        Swal.fire("Chamado!", `${paciente.nome} chamado(a). Justificativa: ${justificativa}`, "success");
        carregarFilas();
      } catch (error) {
        Swal.fire("Erro", "Não foi possível chamar o paciente.", "error");
      }
    }
  };

  // Remover paciente da fila
  const removerPaciente = async (idx, pacienteIndex, paciente) => {
    const result = await Swal.fire({
      title: "Remover paciente",
      html: `<strong>${paciente.nome}</strong><br>Justificativa (obrigatória):`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Remover",
      input: "text",
      inputPlaceholder: "Ex: desistiu, ausente...",
      inputValidator: (value) => {
        if (!value) return "A justificativa é obrigatória!";
      },
    });

    if (result.isConfirmed) {
      try {
        await filasService.remover(paciente.id);
        setLogRemocoes(prev => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            acao: "REMOCAO",
            paciente: paciente.nome,
            especialidade: filas[idx].especialidade,
            justificativa: result.value,
          },
        ]);
        Swal.fire("Removido!", `${paciente.nome} removido. Justificativa: ${result.value}`, "info");
        carregarFilas();
      } catch (error) {
        Swal.fire("Erro", "Não foi possível remover o paciente.", "error");
      }
    }
  };

  // Adicionar paciente manualmente a uma especialidade
  const adicionarPaciente = async (idx) => {
    const fila = filas[idx];
    if (!fila) return;

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
          Swal.showValidationMessage("CPF inválido (11 dígitos)");
          return false;
        }
        return { nome, cpf, dataNasc };
      },
    });

    if (formValues) {
      // Verifica duplicidade de CPF na mesma especialidade
      const cpfExiste = fila.pacientes.some(p => p.cpf === formValues.cpf);
      if (cpfExiste) {
        Swal.fire("Erro", "CPF já está na fila.", "error");
        return;
      }

      try {
        const novaEntrada = await filasService.adicionar({
          paciente: formValues.nome,
          prioridade: "Normal",
          tempo: "10 min",
          senha: `G-${Math.floor(Math.random() * 900) + 100}`,
          especialidade: fila.especialidade,
          status: "Aguardando",
          posicao: fila.pacientes.length + 1,
          ubs: ubsSelecionada,
        });
        // Adiciona campos extras manualmente? O serviço não salva CPF/dataNasc diretamente,
        // mas podemos adicionar ao retorno (não são persistidos no banco padrão, mas podemos ajustar).
        // Para manter a funcionalidade, vamos apenas recarregar as filas.
        Swal.fire("Adicionado!", `${formValues.nome} adicionado à fila.`, "success");
        carregarFilas();
      } catch (error) {
        Swal.fire("Erro", "Não foi possível adicionar o paciente.", "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiUserGroup className="text-blue-600" /> Gerenciar Filas
          </h1>
          <p className="text-gray-500 mt-1">
            Chame o próximo paciente, adicione manualmente ou pesquise por nome/CPF – {ubsSelecionada}
          </p>
        </div>

        {loading && filas.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Carregando filas...</p>
          </div>
        ) : filas.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border p-8">
            <p className="text-gray-500">Nenhuma fila ativa nesta UBS.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filas.map((fila, idx) => {
              const pacientesFiltrados = filtrarPacientes(
                fila.pacientes,
                searchTerms[idx] || ""
              );
              return (
                <div
                  key={fila.id}
                  className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col hover:shadow-md transition"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    {fila.especialidade}
                  </h2>

                  <div className="relative mb-4">
                    <HiSearch className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      value={searchTerms[idx] || ""}
                      onChange={(e) => handleSearchChange(idx, e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex-1 mb-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      Pacientes ({pacientesFiltrados.length})
                    </p>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {pacientesFiltrados.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          Nenhum paciente encontrado.
                        </p>
                      ) : (
                        pacientesFiltrados.map((p, i) => {
                          // Encontrar o índice original no array completo para repassar às funções
                          const originalIndex = fila.pacientes.findIndex(
                            pac => pac.id === p.id
                          );
                          return (
                            <div
                              key={p.id || i}
                              className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex justify-between items-start"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {p.nome}
                                </p>
                                <p className="text-xs text-gray-500">
                                  CPF: {p.cpf}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Senha: {p.senha} | Posição: {p.posicao}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    chamarEspecifico(idx, originalIndex, p)
                                  }
                                  className="text-blue-600 text-xs font-semibold hover:underline"
                                >
                                  Atender
                                </button>
                                <button
                                  onClick={() =>
                                    removerPaciente(idx, originalIndex, p)
                                  }
                                  className="text-red-600 text-xs font-semibold hover:underline"
                                >
                                  <HiX size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => chamarProximo(idx)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
                    >
                      Próximo
                    </button>
                    <button
                      onClick={() => adicionarPaciente(idx)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1"
                    >
                      <HiPlus size={16} /> Adicionar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => {
              if (logRemocoes.length === 0) {
                Swal.fire(
                  "Nenhum registro",
                  "Nenhuma ação registrada.",
                  "info"
                );
              } else {
                const logText = logRemocoes
                  .map(
                    (l) =>
                      `${l.data} - ${l.acao} - ${l.paciente} (${l.especialidade}) - Just.: ${l.justificativa}`
                  )
                  .join("\n");
                Swal.fire({
                  title: "Histórico de Ações",
                  html: `<pre class="text-left text-xs max-h-96 overflow-auto">${logText}</pre>`,
                });
              }
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver histórico de ações
          </button>
        </div>
      </div>
      <ChatAtendimento />
    </div>
  );
};

export default GerenciarFilas;