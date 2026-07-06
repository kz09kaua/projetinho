import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE HISTORICO MEDICO
// ============================================================

export const historicoService = {
  // Buscar todo o historico
  async listar() {
    try {
      const data = await getAll(STORES.historico_medico);
      return data.map((h) => ({
        id: h.id,
        paciente: h.paciente_nome,
        paciente_id: h.paciente_id,
        data: h.data,
        medico: h.medico,
        especialidade: h.especialidade,
        ubs: h.ubs,
        diagnostico: h.diagnostico,
        observacao: h.observacao,
        status: h.status,
        arquivado: h.arquivado,
        dataArquivo: h.data_arquivo,
      }));
    } catch (error) {
      console.error("Erro ao listar historico:", error);
      return [];
    }
  },

  // Buscar historico de um paciente pelo nome
  async listarPorPaciente(nomePaciente) {
    try {
      const data = await getAll(STORES.historico_medico);
      const filtered = data.filter(h => h.paciente_nome === nomePaciente);
      return filtered.map((h) => ({
        id: h.id,
        data: h.data,
        medico: h.medico,
        especialidade: h.especialidade,
        ubs: h.ubs,
        diagnostico: h.diagnostico,
        observacao: h.observacao,
        status: h.status,
      }));
    } catch (error) {
      console.error("Erro ao buscar historico do paciente:", error);
      return [];
    }
  },

  // Criar registro no historico
  async criar(registro) {
    try {
      const allHistorico = await getAll(STORES.historico_medico);
      const newId = allHistorico.length > 0 
        ? Math.max(...allHistorico.map(h => h.id)) + 1 
        : 1;

      const data = {
        id: newId,
        paciente_id: registro.paciente_id || null,
        paciente_nome: registro.paciente || registro.paciente_nome,
        data: registro.data,
        medico: registro.medico,
        especialidade: registro.especialidade,
        ubs: registro.ubs || null,
        diagnostico: registro.diagnostico || null,
        observacao: registro.observacao || null,
        status: registro.status || "Realizada",
        arquivado: false,
        data_arquivo: null,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.historico_medico, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar historico:", error);
      return null;
    }
  },

  // Arquivar registro
  async arquivar(id) {
    try {
      const registro = await get(STORES.historico_medico, id);
      if (!registro) return false;

      const updated = { 
        ...registro, 
        arquivado: true, 
        data_arquivo: new Date().toISOString() 
      };
      await update(STORES.historico_medico, updated);
      return true;
    } catch (error) {
      console.error("Erro ao arquivar historico:", error);
      return false;
    }
  },

  // Deletar registro
  async deletar(id) {
    try {
      await deleteItem(STORES.historico_medico, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar historico:", error);
      return false;
    }
  },
};