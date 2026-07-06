import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE CONSULTAS / AGENDAMENTOS
// ============================================================

export const consultasService = {
  // Buscar todas as consultas
  async listar() {
    try {
      const data = await getAll(STORES.consultas);
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
    } catch (error) {
      console.error("Erro ao listar consultas:", error);
      return [];
    }
  },

  // Buscar consultas não arquivadas
  async listarAtivas() {
    try {
      const data = await query(STORES.consultas, { eq: { field: "arquivado", value: false } });
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
    } catch (error) {
      console.error("Erro ao listar consultas ativas:", error);
      return [];
    }
  },

  // Criar nova consulta
  async criar(consulta) {
    try {
      // Buscar o maior ID atual
      const allConsultas = await getAll(STORES.consultas);
      const newId = allConsultas.length > 0 
        ? Math.max(...allConsultas.map(c => c.id)) + 1 
        : 1;

      const data = {
        id: newId,
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
        arquivado: false,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.consultas, data);
      return data;
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      return null;
    }
  },

  // Atualizar status da consulta
  async atualizarStatus(id, status, senha) {
    try {
      const consulta = await get(STORES.consultas, id);
      if (!consulta) return false;

      const updateFields = { status };
      if (senha !== undefined) updateFields.senha = senha;

      const updated = { ...consulta, ...updateFields };
      await update(STORES.consultas, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return false;
    }
  },

  // Arquivar consulta
  async arquivar(id) {
    try {
      const consulta = await get(STORES.consultas, id);
      if (!consulta) return false;

      const updated = { ...consulta, arquivado: true };
      await update(STORES.consultas, updated);
      return true;
    } catch (error) {
      console.error("Erro ao arquivar consulta:", error);
      return false;
    }
  },

  // Deletar consulta
  async deletar(id) {
    try {
      await deleteItem(STORES.consultas, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
      return false;
    }
  },
};