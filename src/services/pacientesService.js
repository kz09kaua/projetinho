import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE PACIENTES
// ============================================================

export const pacientesService = {
  // Buscar todos os pacientes
  async listar() {
    try {
      const data = await getAll(STORES.pacientes);
      return data.map((p) => ({
        id: p.id,
        nome: p.nome,
        cpf: p.cpf,
        sus: p.numero_sus,
        dataNasc: p.data_nascimento,
        sexo: p.sexo,
        alergias: p.alergias || ["Nenhuma"],
        tipoSanguineo: p.tipo_sanguineo || "Nao informado",
        ultimaConsulta: p.ultima_consulta || "Nunca",
      }));
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
      return [];
    }
  },

  // Buscar paciente por ID
  async buscarPorId(id) {
    try {
      const data = await get(STORES.pacientes, id);
      if (!data) return null;

      return {
        id: data.id,
        nome: data.nome,
        cpf: data.cpf,
        sus: data.numero_sus,
        dataNasc: data.data_nascimento,
        sexo: data.sexo,
        alergias: data.alergias || ["Nenhuma"],
        tipoSanguineo: data.tipo_sanguineo || "Nao informado",
        ultimaConsulta: data.ultima_consulta || "Nunca",
      };
    } catch (error) {
      return null;
    }
  },

  // Criar novo paciente
  async criar(paciente) {
    try {
      const allPacientes = await getAll(STORES.pacientes);
      const newId = allPacientes.length > 0 
        ? Math.max(...allPacientes.map(p => p.id)) + 1 
        : 1;

      const data = {
        id: newId,
        nome: paciente.nome,
        cpf: paciente.cpf,
        numero_sus: paciente.sus,
        data_nascimento: paciente.dataNasc,
        sexo: paciente.sexo,
        alergias: paciente.alergias || ["Nenhuma"],
        tipo_sanguineo: paciente.tipoSanguineo || "Nao informado",
        ultima_consulta: paciente.ultimaConsulta || "Nunca",
        created_at: new Date().toISOString(),
      };

      await insert(STORES.pacientes, data);
      return {
        id: data.id,
        nome: data.nome,
        cpf: data.cpf,
        sus: data.numero_sus,
        dataNasc: data.data_nascimento,
        sexo: data.sexo,
        alergias: data.alergias,
        tipoSanguineo: data.tipo_sanguineo,
        ultimaConsulta: data.ultima_consulta,
      };
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      return null;
    }
  },

  // Atualizar paciente
  async atualizar(id, dados) {
    try {
      const paciente = await get(STORES.pacientes, id);
      if (!paciente) return false;

      const updateFields = {};
      if (dados.nome !== undefined) updateFields.nome = dados.nome;
      if (dados.cpf !== undefined) updateFields.cpf = dados.cpf;
      if (dados.sus !== undefined) updateFields.numero_sus = dados.sus;
      if (dados.dataNasc !== undefined) updateFields.data_nascimento = dados.dataNasc;
      if (dados.sexo !== undefined) updateFields.sexo = dados.sexo;
      if (dados.alergias !== undefined) updateFields.alergias = dados.alergias;
      if (dados.tipoSanguineo !== undefined) updateFields.tipo_sanguineo = dados.tipoSanguineo;
      if (dados.ultimaConsulta !== undefined) updateFields.ultima_consulta = dados.ultimaConsulta;

      const updated = { ...paciente, ...updateFields };
      await update(STORES.pacientes, updated);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      return false;
    }
  },

  // Deletar paciente
  async deletar(id) {
    try {
      await deleteItem(STORES.pacientes, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      return false;
    }
  },

  // Verificar duplicidade por CPF ou SUS
  async verificarDuplicidade(cpf, sus) {
    try {
      const data = await getAll(STORES.pacientes);
      return data.some(p => p.cpf === cpf || p.numero_sus === sus);
    } catch (error) {
      return false;
    }
  },
};