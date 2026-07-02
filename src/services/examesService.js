import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE EXAMES (SUS Conectado)
// ============================================================

export const examesService = {
  // Buscar todos os exames
  async listar() {
    const { data, error } = await supabase
      .from("exames")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao listar exames:", error);
      return [];
    }

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
  },

  // Buscar exames de um paciente
  async listarPorPaciente(pacienteNome) {
    const { data, error } = await supabase
      .from("exames")
      .select("*")
      .eq("paciente_nome", pacienteNome)
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao buscar exames do paciente:", error);
      return [];
    }

    return data.map((e) => ({
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
  },

  // Criar exame
  async criar(exame) {
    const { data, error } = await supabase
      .from("exames")
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar exame:", error);
      return null;
    }
    return data;
  },

  // Atualizar exame
  async atualizar(id, dados) {
    const updateFields = {};
    if (dados.status !== undefined) updateFields.status = dados.status;
    if (dados.resultado !== undefined) updateFields.resultado = dados.resultado;
    if (dados.dataResultado !== undefined)
      updateFields.data_resultado = dados.dataResultado;
    if (dados.arquivado !== undefined) updateFields.arquivado = dados.arquivado;

    const { error } = await supabase
      .from("exames")
      .update(updateFields)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar exame:", error);
      return false;
    }
    return true;
  },

  // Deletar exame
  async deletar(id) {
    const { error } = await supabase.from("exames").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar exame:", error);
      return false;
    }
    return true;
  },
};
