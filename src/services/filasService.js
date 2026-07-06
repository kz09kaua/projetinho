import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

export const filasService = {
  async listar() {
    try {
      const data = await getAll(STORES.filas_atendimento);
      return data.map((f) => ({
        id: f.id,
        posicao: f.posicao,
        paciente: f.paciente_nome,
        prioridade: f.prioridade,
        tempo: f.tempo,
        senha: f.senha,
        status: f.status,
        especialidade: f.especialidade,
      }));
    } catch (error) {
      console.error("Erro ao listar filas:", error);
      return [];
    }
  },

  async adicionar(entrada) {
    try {
      const allFilas = await getAll(STORES.filas_atendimento);
      const newId = allFilas.length > 0 ? Math.max(...allFilas.map(f => f.id)) + 1 : 1;
      const data = {
        id: newId,
        posicao: entrada.posicao || 1,
        paciente_nome: entrada.paciente,
        prioridade: entrada.prioridade || "Normal",
        tempo: entrada.tempo || "10 min",
        senha: entrada.senha || `P-${Math.floor(Math.random() * 900) + 100}`,
        status: entrada.status || "Aguardando",
        especialidade: entrada.especialidade || "Clínica Geral",
        created_at: new Date().toISOString(),
      };
      await insert(STORES.filas_atendimento, data);
      return data;
    } catch (error) {
      console.error("Erro ao adicionar na fila:", error);
      return null;
    }
  },

  async atualizarStatus(id, status) {
    try {
      const fila = await get(STORES.filas_atendimento, id);
      if (!fila) return false;
      const updated = { ...fila, status };
      await update(STORES.filas_atendimento, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar fila:", error);
      return false;
    }
  },

  async remover(id) {
    try {
      await deleteItem(STORES.filas_atendimento, id);
      return true;
    } catch (error) {
      console.error("Erro ao remover da fila:", error);
      return false;
    }
  },

  async reordenar(idsOrdenados) {
    try {
      const promises = idsOrdenados.map((id, index) => {
        return get(STORES.filas_atendimento, id).then((fila) => {
          if (fila) {
            return update(STORES.filas_atendimento, { ...fila, posicao: index + 1 });
          }
          return Promise.resolve();
        });
      });
      await Promise.all(promises);
      return true;
    } catch (error) {
      return false;
    }
  },
};