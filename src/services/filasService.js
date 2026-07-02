import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE FILAS DE ATENDIMENTO
// ============================================================

export const filasService = {
  // Buscar todas as filas
  async listar() {
    const { data, error } = await supabase
      .from("filas_atendimento")
      .select("*")
      .order("posicao", { ascending: true });

    if (error) {
      console.error("Erro ao listar filas:", error);
      return [];
    }

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
  },

  // Adicionar paciente a fila
  async adicionar(entrada) {
    const { data, error } = await supabase
      .from("filas_atendimento")
      .insert({
        posicao: entrada.posicao,
        paciente_nome: entrada.paciente,
        prioridade: entrada.prioridade || "Normal",
        tempo: entrada.tempo,
        senha: entrada.senha,
        status: entrada.status || "Aguardando",
        especialidade: entrada.especialidade,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar na fila:", error);
      return null;
    }

    return {
      id: data.id,
      posicao: data.posicao,
      paciente: data.paciente_nome,
      prioridade: data.prioridade,
      tempo: data.tempo,
      senha: data.senha,
      status: data.status,
      especialidade: data.especialidade,
    };
  },

  // Atualizar status na fila
  async atualizarStatus(id, status) {
    const { error } = await supabase
      .from("filas_atendimento")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar fila:", error);
      return false;
    }
    return true;
  },

  // Remover da fila
  async remover(id) {
    const { error } = await supabase
      .from("filas_atendimento")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao remover da fila:", error);
      return false;
    }
    return true;
  },

  // Reordenar posicoes
  async reordenar(idsOrdenados) {
    const promises = idsOrdenados.map((id, index) =>
      supabase
        .from("filas_atendimento")
        .update({ posicao: index + 1 })
        .eq("id", id)
    );

    const results = await Promise.all(promises);
    return results.every((r) => !r.error);
  },
};
