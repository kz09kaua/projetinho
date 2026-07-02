import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE PACIENTES
// ============================================================

export const pacientesService = {
  // Buscar todos os pacientes
  async listar() {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar pacientes:", error);
      return [];
    }

    // Mapeia para o formato usado no frontend
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
  },

  // Buscar paciente por ID
  async buscarPorId(id) {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;

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
  },

  // Criar novo paciente
  async criar(paciente) {
    const { data, error } = await supabase
      .from("pacientes")
      .insert({
        nome: paciente.nome,
        cpf: paciente.cpf,
        numero_sus: paciente.sus,
        data_nascimento: paciente.dataNasc,
        sexo: paciente.sexo,
        alergias: paciente.alergias || ["Nenhuma"],
        tipo_sanguineo: paciente.tipoSanguineo || "Nao informado",
        ultima_consulta: paciente.ultimaConsulta || "Nunca",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar paciente:", error);
      return null;
    }

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
  },

  // Atualizar paciente
  async atualizar(id, dados) {
    const updateFields = {};
    if (dados.nome !== undefined) updateFields.nome = dados.nome;
    if (dados.cpf !== undefined) updateFields.cpf = dados.cpf;
    if (dados.sus !== undefined) updateFields.numero_sus = dados.sus;
    if (dados.dataNasc !== undefined)
      updateFields.data_nascimento = dados.dataNasc;
    if (dados.sexo !== undefined) updateFields.sexo = dados.sexo;
    if (dados.alergias !== undefined) updateFields.alergias = dados.alergias;
    if (dados.tipoSanguineo !== undefined)
      updateFields.tipo_sanguineo = dados.tipoSanguineo;
    if (dados.ultimaConsulta !== undefined)
      updateFields.ultima_consulta = dados.ultimaConsulta;

    const { error } = await supabase
      .from("pacientes")
      .update(updateFields)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar paciente:", error);
      return false;
    }
    return true;
  },

  // Deletar paciente
  async deletar(id) {
    const { error } = await supabase.from("pacientes").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar paciente:", error);
      return false;
    }
    return true;
  },

  // Verificar duplicidade por CPF ou SUS
  async verificarDuplicidade(cpf, sus) {
    const { data, error } = await supabase
      .from("pacientes")
      .select("id")
      .or(`cpf.eq.${cpf},numero_sus.eq.${sus}`);

    if (error) return false;
    return data.length > 0;
  },
};
