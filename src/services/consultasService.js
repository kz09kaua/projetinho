import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE CONSULTAS / AGENDAMENTOS
// ============================================================

export const consultasService = {
  // Buscar todas as consultas
  async listar() {
    const { data, error } = await supabase
      .from("consultas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar consultas:", error);
      return [];
    }

    return data.map((c) => ({
      id: c.id,
      paciente: c.paciente_nome,
      paciente_id: c.paciente_id,
      data: c.data,
      horario: c.horario,
      medico: c.medico,
      especialidade: c.especialidade,
      status: c.status,
      senha: c.senha,
      ubs: c.ubs,
      observacoes: c.observacoes,
      arquivado: c.arquivado,
    }));
  },

  // Buscar consultas nao arquivadas
  async listarAtivas() {
    const { data, error } = await supabase
      .from("consultas")
      .select("*")
      .eq("arquivado", false)
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar consultas ativas:", error);
      return [];
    }

    return data.map((c) => ({
      id: c.id,
      paciente: c.paciente_nome,
      paciente_id: c.paciente_id,
      data: c.data,
      horario: c.horario,
      medico: c.medico,
      especialidade: c.especialidade,
      status: c.status,
      senha: c.senha,
      ubs: c.ubs,
      observacoes: c.observacoes,
      arquivado: c.arquivado,
    }));
  },

  // Criar nova consulta
  async criar(consulta) {
    const { data, error } = await supabase
      .from("consultas")
      .insert({
        paciente_id: consulta.paciente_id || null,
        paciente_nome: consulta.paciente,
        data: consulta.data,
        horario: consulta.horario,
        medico: consulta.medico,
        especialidade: consulta.especialidade,
        status: consulta.status || "Aguardando",
        senha: consulta.senha,
        ubs: consulta.ubs,
        observacoes: consulta.observacoes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar consulta:", error);
      return null;
    }

    return {
      id: data.id,
      paciente: data.paciente_nome,
      paciente_id: data.paciente_id,
      data: data.data,
      horario: data.horario,
      medico: data.medico,
      especialidade: data.especialidade,
      status: data.status,
      senha: data.senha,
      ubs: data.ubs,
      observacoes: data.observacoes,
      arquivado: data.arquivado,
    };
  },

  // Atualizar status da consulta
  async atualizarStatus(id, status, senha) {
    const updateFields = { status };
    if (senha !== undefined) updateFields.senha = senha;

    const { error } = await supabase
      .from("consultas")
      .update(updateFields)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      return false;
    }
    return true;
  },

  // Arquivar consulta
  async arquivar(id) {
    const { error } = await supabase
      .from("consultas")
      .update({ arquivado: true })
      .eq("id", id);

    if (error) {
      console.error("Erro ao arquivar consulta:", error);
      return false;
    }
    return true;
  },

  // Deletar consulta
  async deletar(id) {
    const { error } = await supabase.from("consultas").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar consulta:", error);
      return false;
    }
    return true;
  },
};
