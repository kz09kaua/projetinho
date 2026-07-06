import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE UBS (Unidades de Saude Basica)
// ============================================================

export const ubsService = {
  async listar() {
    try {
      const data = await getAll(STORES.ubs);
      return data.map((u) => ({
        id: u.id,
        nome: u.nome,
        endereco: u.endereco,
      }));
    } catch (error) {
      console.error("Erro ao listar UBS:", error);
      return [];
    }
  },

  async buscarPorId(id) {
    try {
      const data = await get(STORES.ubs, id);
      if (!data) return null;

      return {
        id: data.id,
        nome: data.nome,
        endereco: data.endereco,
      };
    } catch (error) {
      return null;
    }
  },

  async criar(ubs) {
    try {
      const allUbs = await getAll(STORES.ubs);
      const newId = allUbs.length > 0 
        ? Math.max(...allUbs.map(u => u.id)) + 1 
        : 1;

      const data = {
        id: newId,
        nome: ubs.nome,
        endereco: ubs.endereco,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.ubs, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar UBS:", error);
      return null;
    }
  },

  async atualizar(id, dados) {
    try {
      const ubs = await get(STORES.ubs, id);
      if (!ubs) return false;

      const updated = { ...ubs, ...dados };
      await update(STORES.ubs, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar UBS:", error);
      return false;
    }
  },

  async deletar(id) {
    try {
      await deleteItem(STORES.ubs, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar UBS:", error);
      return false;
    }
  },
};