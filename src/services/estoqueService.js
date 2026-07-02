import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE ESTOQUE (Vacinas e Medicamentos)
// ============================================================

export const estoqueService = {
  // ---- VACINAS ----

  async listarVacinas() {
    const { data, error } = await supabase
      .from("estoque_vacinas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar vacinas:", error);
      return [];
    }

    return data.map((v) => ({
      id: v.id,
      nome: v.nome,
      lote: v.lote,
      quantidade: v.quantidade,
      validade: v.validade,
    }));
  },

  async criarVacina(vacina) {
    const { data, error } = await supabase
      .from("estoque_vacinas")
      .insert({
        nome: vacina.nome,
        lote: vacina.lote,
        quantidade: vacina.quantidade,
        validade: vacina.validade,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar vacina:", error);
      return null;
    }

    return {
      id: data.id,
      nome: data.nome,
      lote: data.lote,
      quantidade: data.quantidade,
      validade: data.validade,
    };
  },

  async atualizarVacina(id, dados) {
    const { error } = await supabase
      .from("estoque_vacinas")
      .update(dados)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar vacina:", error);
      return false;
    }
    return true;
  },

  async deletarVacina(id) {
    const { error } = await supabase
      .from("estoque_vacinas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar vacina:", error);
      return false;
    }
    return true;
  },

  // ---- MEDICAMENTOS ----

  async listarMedicamentos() {
    const { data, error } = await supabase
      .from("estoque_medicamentos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar medicamentos:", error);
      return [];
    }

    return data.map((m) => ({
      id: m.id,
      nome: m.nome,
      lote: m.lote,
      quantidade: m.quantidade,
      validade: m.validade,
    }));
  },

  async criarMedicamento(medicamento) {
    const { data, error } = await supabase
      .from("estoque_medicamentos")
      .insert({
        nome: medicamento.nome,
        lote: medicamento.lote,
        quantidade: medicamento.quantidade,
        validade: medicamento.validade,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar medicamento:", error);
      return null;
    }

    return {
      id: data.id,
      nome: data.nome,
      lote: data.lote,
      quantidade: data.quantidade,
      validade: data.validade,
    };
  },

  async atualizarMedicamento(id, dados) {
    const { error } = await supabase
      .from("estoque_medicamentos")
      .update(dados)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar medicamento:", error);
      return false;
    }
    return true;
  },

  async deletarMedicamento(id) {
    const { error } = await supabase
      .from("estoque_medicamentos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar medicamento:", error);
      return false;
    }
    return true;
  },
};
