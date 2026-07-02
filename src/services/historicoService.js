import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE HISTORICO MEDICO
// ============================================================

export const historicoService = {
  // Buscar todo o historico
  async listar() {
    const { data, error } = await supabase
      .from("historico_medico")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao listar historico:", error);
      return [];
    }

    return data.map((h) => ({
      id: h.id,
      paciente: h.paciente_nome,
      paciente_id: h.paciente_id,
      data: h.data,
      medico: h.medico,
      especialidade: h.especialidade,
      ubs: h.ubs,
      diagnostico: h.diagnostico,
      observacao: h.observacao,
      status: h.status,
      arquivado: h.arquivado,
      dataArquivo: h.data_arquivo,
    }));
  },

  // Buscar historico de um paciente pelo nome
  async listarPorPaciente(nomePaciente) {
    const { data, error } = await supabase
      .from("historico_medico")
      .select("*")
      .eq("paciente_nome", nomePaciente)
      .order("id", { ascending: false });

    if (error) {
      console.error("Erro ao buscar historico do paciente:", error);
      return [];
    }

    return data.map((h) => ({
      id: h.id,
      data: h.data,
      medico: h.medico,
      especialidade: h.especialidade,
      ubs: h.ubs,
      diagnostico: h.diagnostico,
      observacao: h.observacao,
      status: h.status,
    }));
  },

  // Criar registro no historico
  async criar(registro) {
    const { data, error } = await supabase
      .from("historico_medico")
      .insert({
        paciente_id: registro.paciente_id || null,
        paciente_nome: registro.paciente || registro.paciente_nome,
        data: registro.data,
        medico: registro.medico,
        especialidade: registro.especialidade,
        ubs: registro.ubs || null,
        diagnostico: registro.diagnostico || null,
        observacao: registro.observacao || null,
        status: registro.status || "Realizada",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar historico:", error);
      return null;
    }
    return data;
  },

  // Arquivar registro
  async arquivar(id) {
    const { error } = await supabase
      .from("historico_medico")
      .update({ arquivado: true, data_arquivo: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Erro ao arquivar historico:", error);
      return false;
    }
    return true;
  },

  // Deletar registro
  async deletar(id) {
    const { error } = await supabase
      .from("historico_medico")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar historico:", error);
      return false;
    }
    return true;
  },
};
