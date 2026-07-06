import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE EXAMES (SUS Conectado)
// ============================================================

export const examesService = {
  async listar() {
    try {
      const data = await getAll(STORES.exames);
      return data.map((e) => ({
        id: e.id,
        paciente_id: e.paciente_id,
        paciente_nome: e.paciente_nome,
        nome: e.nome,
        medicoSolicitante: e.medico_solicitante,
        dataSolicitacao: e.data_solicitacao,
        dataResultado: e.data_resultado,
        status: e.status,
        resultado: e.resultado,
        prioridade: e.prioridade,
        tipo: e.tipo,
        arquivado: e.arquivado,
      }));
    } catch (error) {
      console.error("Erro ao listar exames:", error);
      return [];
    }
  },

  async listarPorPaciente(pacienteNome) {
    try {
      const data = await getAll(STORES.exames);
      const filtered = data.filter(e => e.paciente_nome === pacienteNome);
      return filtered.map((e) => ({
        id: e.id,
        nome: e.nome,
        medicoSolicitante: e.medico_solicitante,
        dataSolicitacao: e.data_solicitacao,
        dataResultado: e.data_resultado,
        status: e.status,
        resultado: e.resultado,
        prioridade: e.prioridade,
        tipo: e.tipo,
        arquivado: e.arquivado,
      }));
    } catch (error) {
      console.error("Erro ao buscar exames do paciente:", error);
      return [];
    }
  },

  async criar(exame) {
    try {
      const allExames = await getAll(STORES.exames);
      const newId = allExames.length > 0 
        ? Math.max(...allExames.map(e => e.id)) + 1 
        : 1;

      const data = {
        id: newId,
        paciente_id: exame.paciente_id || null,
        paciente_nome: exame.paciente_nome || null,
        nome: exame.nome,
        medico_solicitante: exame.medicoSolicitante,
        data_solicitacao: exame.dataSolicitacao,
        data_resultado: exame.dataResultado || null,
        status: exame.status || "Pendente",
        resultado: exame.resultado || null,
        prioridade: exame.prioridade || "Normal",
        tipo: exame.tipo || null,
        arquivado: false,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.exames, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar exame:", error);
      return null;
    }
  },

  async atualizar(id, dados) {
    try {
      const exame = await get(STORES.exames, id);
      if (!exame) return false;

      const updateFields = {};
      if (dados.status !== undefined) updateFields.status = dados.status;
      if (dados.resultado !== undefined) updateFields.resultado = dados.resultado;
      if (dados.dataResultado !== undefined) updateFields.data_resultado = dados.dataResultado;
      if (dados.arquivado !== undefined) updateFields.arquivado = dados.arquivado;

      const updated = { ...exame, ...updateFields };
      await update(STORES.exames, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar exame:", error);
      return false;
    }
  },

  async deletar(id) {
    try {
      await deleteItem(STORES.exames, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar exame:", error);
      return false;
    }
  },
};