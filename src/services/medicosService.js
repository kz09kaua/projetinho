import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE MECIDOS
// ============================================================

export const medicosService = {
  async listar() {
    try {
      const data = await getAll(STORES.medicos);
      return data.map((m) => ({
        id: m.id,
        nome: m.nome,
        especialidade: m.especialidade,
      }));
    } catch (error) {
      console.error("Erro ao listar medicos:", error);
      return [];
    }
  },

  async buscarPorId(id) {
    try {
      const data = await get(STORES.medicos, id);
      if (!data) return null;

      return {
        id: data.id,
        nome: data.nome,
        especialidade: data.especialidade,
      };
    } catch (error) {
      return null;
    }
  },

  async listarPorEspecialidade(especialidade) {
    try {
      const data = await getAll(STORES.medicos);
      const filtered = data.filter(m => m.especialidade === especialidade);
      return filtered.map((m) => ({
        id: m.id,
        nome: m.nome,
        especialidade: m.especialidade,
      }));
    } catch (error) {
      return [];
    }
  },

  async criar(medico) {
    try {
      const allMedicos = await getAll(STORES.medicos);
      const newId = allMedicos.length > 0 
        ? Math.max(...allMedicos.map(m => m.id)) + 1 
        : 1;

      const data = {
        id: newId,
        nome: medico.nome,
        especialidade: medico.especialidade,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.medicos, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar medico:", error);
      return null;
    }
  },

  async atualizar(id, dados) {
    try {
      const medico = await get(STORES.medicos, id);
      if (!medico) return false;

      const updated = { ...medico, ...dados };
      await update(STORES.medicos, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar medico:", error);
      return false;
    }
  },

  async deletar(id) {
    try {
      await deleteItem(STORES.medicos, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar medico:", error);
      return false;
    }
  },
};