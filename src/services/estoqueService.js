import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE ESTOQUE (Vacinas e Medicamentos)
// ============================================================

export const estoqueService = {
  // ---- VACINAS ----
  async listarVacinas() {
    try {
      const data = await getAll(STORES.estoque_vacinas);
      return data.map((v) => ({
        id: v.id,
        nome: v.nome,
        lote: v.lote,
        quantidade: v.quantidade,
        validade: v.validade,
      }));
    } catch (error) {
      console.error("Erro ao listar vacinas:", error);
      return [];
    }
  },

  async criarVacina(vacina) {
    try {
      const allVacinas = await getAll(STORES.estoque_vacinas);
      const newId = allVacinas.length > 0 
        ? Math.max(...allVacinas.map(v => v.id)) + 1 
        : 1;

      const data = {
        id: newId,
        nome: vacina.nome,
        lote: vacina.lote,
        quantidade: vacina.quantidade,
        validade: vacina.validade,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.estoque_vacinas, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar vacina:", error);
      return null;
    }
  },

  async atualizarVacina(id, dados) {
    try {
      const vacina = await get(STORES.estoque_vacinas, id);
      if (!vacina) return false;

      const updated = { ...vacina, ...dados };
      await update(STORES.estoque_vacinas, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar vacina:", error);
      return false;
    }
  },

  async deletarVacina(id) {
    try {
      await deleteItem(STORES.estoque_vacinas, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar vacina:", error);
      return false;
    }
  },

  // ---- MEDICAMENTOS ----
  async listarMedicamentos() {
    try {
      const data = await getAll(STORES.estoque_medicamentos);
      return data.map((m) => ({
        id: m.id,
        nome: m.nome,
        lote: m.lote,
        quantidade: m.quantidade,
        validade: m.validade,
      }));
    } catch (error) {
      console.error("Erro ao listar medicamentos:", error);
      return [];
    }
  },

  async criarMedicamento(medicamento) {
    try {
      const allMedicamentos = await getAll(STORES.estoque_medicamentos);
      const newId = allMedicamentos.length > 0 
        ? Math.max(...allMedicamentos.map(m => m.id)) + 1 
        : 1;

      const data = {
        id: newId,
        nome: medicamento.nome,
        lote: medicamento.lote,
        quantidade: medicamento.quantidade,
        validade: medicamento.validade,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.estoque_medicamentos, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar medicamento:", error);
      return null;
    }
  },

  async atualizarMedicamento(id, dados) {
    try {
      const medicamento = await get(STORES.estoque_medicamentos, id);
      if (!medicamento) return false;

      const updated = { ...medicamento, ...dados };
      await update(STORES.estoque_medicamentos, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar medicamento:", error);
      return false;
    }
  },

  async deletarMedicamento(id) {
    try {
      await deleteItem(STORES.estoque_medicamentos, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar medicamento:", error);
      return false;
    }
  },
};