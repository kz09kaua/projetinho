// src/pages/atendente/GerenciarFilas.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { HiUserGroup, HiSearch, HiPlus, HiX, HiRefresh } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import { filasService } from "../../services/filasService";
import { pacientesService } from "../../services/pacientesService";

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

  const [filas, setFilas] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [logRemocoes, setLogRemocoes] = useState([]);
  const [pacientesCadastrados, setPacientesCadastrados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Carrega todos os pacientes cadastrados (para sugestões)
  const carregarPacientes = async () => {
    try {
      const data = await pacientesService.listar();
      setPacientesCadastrados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  // Carrega as filas da UBS e agrupa por especialidade
  const carregarFilas = async () => {
    if (!ubsSelecionada) return;
    setCarregando(true);
    try {
      const data = await filasService.listar();
      const filasDaUbs = data.filter(f => f.ubs === ubsSelecionada);
      const grouped = {};
      filasDaUbs.forEach(f => {
        const key = f.especialidade || "Geral";
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            especialidade: key,
            pacientes: [],
          };
        }
        grouped[key].pacientes.push({
          nome: f.paciente,
          cpf: f.cpf || "Não informado",
          dataNasc: f.dataNasc || "Não informado",
          id: f.id,
        });
      });
      // Ordenar por especialidade
      const filasArray = Object.values(grouped).sort((a, b) => a.especialidade.localeCompare(b.especialidade));
      setFilas(filasArray);
      // Inicializar searchTerms
      const initialTerms = {};
      filasArray.forEach((_, idx) => {
        initialTerms[idx] = "";
      });
      setSearchTerms(initialTerms);
    } catch (error) {
      console.error("Erro ao carregar filas:", error);
    } finally {
      setCarregando(false);
    }
  };

  // Carrega dados iniciais
  useEffect(() => {
    carregarPacientes();
    carregarFilas();
  }, [ubsSelecionada]);

  // Escuta eventos de atualização da fila
  useEffect(() => {
    const handleFilaAtualizada = () => {
      carregarFilas();
    };
    window.addEventListener('filaAtualizada', handleFilaAtualizada);
    return () => {
      window.removeEventListener('filaAtualizada', handleFilaAtualizada);
    };
  }, [ubsSelecionada]);

  const handleSearchChange = (idx, value) => {
    setSearchTerms((prev) => ({ ...prev, [idx]: value }));
  };

  const filtrarPacientes = (pacientes, termo) => {
    if (!termo.trim()) return pacientes;
    const lowerTermo = termo.toLowerCase();
    return pacientes.filter(
      (p) => p.nome.toLowerCase().includes(lowerTermo) || (p.cpf && p.cpf.includes(termo)),
    );
  };

  const chamarProximo = (idx) => {
    const fila = filas[idx];
    if (!fila || fila.pacientes.length === 0) {
      Swal.fire("Fila vazia", "Não há pacientes na fila.", "info");
      return;
    }
    const paciente = fila.pacientes[0];
    Swal.fire({
      title: "Chamar próximo",
      html: `<strong>${paciente.nome}</strong><br>CPF: ${paciente.cpf || "N/A"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Chamar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (paciente.id) {
          await filasService.remover(paciente.id);
        }
        const novasFilas = [...filas];
        novasFilas[idx].pacientes.shift();
        setFilas(novasFilas);
        window.dispatchEvent(new Event('filaAtualizada'));
        Swal.fire("Chamado!", `${paciente.nome} foi chamado(a).`, "success");
      }
    });
  };

  const chamarEspecifico = (idx, pacienteIndex, paciente) => {
    Swal.fire({
      title: "Chamar fora de ordem?",
      html: `<strong>${paciente.nome}</strong> (posição ${pacienteIndex + 1})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, chamar agora",
      input: "text",
      inputPlaceholder: "Justificativa (opcional)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const justificativa = result.value || "Não informada";
        if (paciente.id) {
          await filasService.remover(paciente.id);
        }
        const novasFilas = [...filas];
        novasFilas[idx].pacientes.splice(pacienteIndex, 1);
        setFilas(novasFilas);
        window.dispatchEvent(new Event('filaAtualizada'));
        Swal.fire(
          "Chamado!",
          `${paciente.nome} chamado(a). Justificativa: ${justificativa}`,
          "success",
        );
        setLogRemocoes((prev) => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            acao: "CHAMADA_ESPECIFICA",
            paciente: paciente.nome,
            especialidade: filas[idx].especialidade,
            justificativa,
          },
        ]);
      }
    });
  };

  const removerPaciente = (idx, pacienteIndex, paciente) => {
    Swal.fire({
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (paciente.id) {
          await filasService.remover(paciente.id);
        }
        const novasFilas = [...filas];
        const removido = novasFilas[idx].pacientes.splice(pacienteIndex, 1)[0];
        setFilas(novasFilas);
        window.dispatchEvent(new Event('filaAtualizada'));
        Swal.fire(
          "Removido!",
          `${removido.nome} removido. Justificativa: ${result.value}`,
          "info",
        );
        setLogRemocoes((prev) => [
          ...prev,
          {
            data: new Date().toLocaleString(),
            acao: "REMOCAO",
            paciente: removido.nome,
            especialidade: filas[idx].especialidade,
            justificativa: result.value,
          },
        ]);
      }
    });
  };

  // Adicionar paciente com seleção dos cadastrados
  const adicionarPaciente = async (idx) => {
    const especialidade = filas[idx].especialidade;

    // Mostra lista de pacientes cadastrados para seleção
    if (pacientesCadastrados.length === 0) {
      await carregarPacientes();
      if (pacientesCadastrados.length === 0) {
        Swal.fire("Nenhum paciente", "Cadastre um paciente primeiro no agendamento.", "warning");
        return;
      }
    }

    const opcoes = pacientesCadastrados.map(p => ({
      id: p.id,
      nome: p.nome,
      cpf: p.cpf,
      dataNasc: p.dataNasc,
    }));

    const { value: pacienteSelecionado } = await Swal.fire({
      title: `Adicionar paciente - ${especialidade}`,
      html: `
        <div style="text-align:left;max-width:100%;">
          <label style="display:block;font-weight:600;margin-bottom:8px;">Selecione o paciente</label>
          <select id="pacienteSelect" class="swal2-select" style="width:100%;padding:10px;border-radius:10px;">
            <option value="">Selecione...</option>
            ${opcoes.map(p => `
              <option value="${p.id}">${p.nome} - CPF: ${p.cpf}</option>
            `).join('')}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Adicionar",
      preConfirm: () => {
        const id = document.getElementById("pacienteSelect").value;
        if (!id) {
          Swal.showValidationMessage("Selecione um paciente");
          return false;
        }
        return pacientesCadastrados.find(p => p.id === parseInt(id));
      },
    });

    if (pacienteSelecionado) {
      // Verifica se já está na fila
      const jaNaFila = filas[idx].pacientes.some(p => p.cpf === pacienteSelecionado.cpf);
      if (jaNaFila) {
        Swal.fire("Erro", "Este paciente já está na fila.", "error");
        return;
      }

      const senha = `G-${Math.floor(Math.random() * 900) + 100}`;
      const novoItem = {
        paciente: pacienteSelecionado.nome,
        cpf: pacienteSelecionado.cpf,
        dataNasc: pacienteSelecionado.dataNasc,
        prioridade: "Normal",
        tempo: "10 min",
        senha: senha,
        especialidade: especialidade,
        status: "Aguardando",
        posicao: filas[idx].pacientes.length + 1,
        ubs: ubsSelecionada,
      };

      try {
        const novoPacienteFila = await filasService.adicionar(novoItem);
        const novasFilas = [...filas];
        novasFilas[idx].pacientes.push({
          nome: pacienteSelecionado.nome,
          cpf: pacienteSelecionado.cpf,
          dataNasc: pacienteSelecionado.dataNasc,
          id: novoPacienteFila.id,
        });
        setFilas(novasFilas);
        window.dispatchEvent(new Event('filaAtualizada'));
        Swal.fire(
          "Adicionado!",
          `${pacienteSelecionado.nome} adicionado à fila. Senha: ${senha}`,
          "success",
        );
      } catch (error) {
        console.error("Erro ao adicionar:", error);
        Swal.fire("Erro", "Não foi possível adicionar à fila.", "error");
      }
    }
  };

  // Recarregar dados
  const recarregar = () => {
    carregarFilas();
    carregarPacientes();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiUserGroup className="text-blue-600" /> Gerenciar Filas
            </h1>
            <p className="text-gray-500 mt-1">
              Chame o próximo paciente, adicione manualmente ou pesquise por nome/CPF – {ubsSelecionada}
            </p>
          </div>
          <button
            onClick={recarregar}
            disabled={carregando}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold transition"
          >
            <HiRefresh className={carregando ? "animate-spin" : ""} size={18} />
            Atualizar
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filas.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-2xl border">
              Nenhuma fila encontrada para esta UBS.
            </div>
          )}
          {filas.map((fila, idx) => {
            const pacientesFiltrados = filtrarPacientes(
              fila.pacientes,
              searchTerms[idx] || "",
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
                        const originalIndex = fila.pacientes.findIndex(
                          (pac) => pac.nome === p.nome && pac.cpf === p.cpf,
                        );
                        return (
                          <div
                            key={i}
                            className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition flex justify-between items-start"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {p.nome}
                              </p>
                              <p className="text-xs text-gray-500">
                                CPF: {p.cpf || "N/A"}
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

        <div className="text-center">
          <button
            onClick={() => {
              if (logRemocoes.length === 0) {
                Swal.fire(
                  "Nenhum registro",
                  "Nenhuma ação registrada.",
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
                });
              }
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver histórico de ações
          </button>
        </div>
      </div>
    </div>
  );
};

export default GerenciarFilas;