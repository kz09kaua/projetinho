import { getAll, get, insert, update, deleteItem, STORES } from "../data/database";

export const filasService = {
  async listar() {
    const data = await getAll(STORES.filas_atendimento);
    return data.map(f => ({
      id: f.id,
      posicao: f.posicao,
      paciente: f.paciente_nome,
      prioridade: f.prioridade || "Normal",
      tempo: f.tempo || "10 min",
      senha: f.senha,
      status: f.status || "Aguardando",
      especialidade: f.especialidade,
      ubs: f.ubs || "UBS Central",
    }));
  },

  async adicionar(entrada) {
    const all = await getAll(STORES.filas_atendimento);
    const newId = all.length > 0 ? Math.max(...all.map(f => f.id)) + 1 : 1;
    const data = {
      id: newId,
      posicao: entrada.posicao || 1,
      paciente_nome: entrada.paciente,
      prioridade: entrada.prioridade || "Normal",
      tempo: entrada.tempo || "10 min",
      senha: entrada.senha || `P-${Math.floor(Math.random() * 900) + 100}`,
      status: entrada.status || "Aguardando",
      especialidade: entrada.especialidade || "Clínica Geral",
      ubs: entrada.ubs || "UBS Central",
      created_at: new Date().toISOString(),
    };
    await insert(STORES.filas_atendimento, data);
    return data;
  },

  async atualizarStatus(id, status) {
    const fila = await get(STORES.filas_atendimento, id);
    if (!fila) return false;
    await update(STORES.filas_atendimento, { ...fila, status });
    return true;
  },

  async remover(id) {
    await deleteItem(STORES.filas_atendimento, id);
    return true;
  },
};