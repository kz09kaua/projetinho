import { supabase } from "../lib/supabase";

// ============================================================
// SERVICO DE UBS E MEDICOS
// ============================================================

export const ubsService = {
  async listar() {
    const { data, error } = await supabase
      .from("ubs")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar UBS:", error);
      return [];
    }

    return data.map((u) => ({
      id: u.id,
      nome: u.nome,
      endereco: u.endereco,
    }));
  },

  async criar(ubs) {
    const { data, error } = await supabase
      .from("ubs")
      .insert({ nome: ubs.nome, endereco: ubs.endereco })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar UBS:", error);
      return null;
    }
    return data;
  },

  async deletar(id) {
    const { error } = await supabase.from("ubs").delete().eq("id", id);
    if (error) {
      console.error("Erro ao deletar UBS:", error);
      return false;
    }
    return true;
  },
};

export const medicosService = {
  async listar() {
    const { data, error } = await supabase
      .from("medicos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao listar medicos:", error);
      return [];
    }

    return data.map((m) => ({
      id: m.id,
      nome: m.nome,
      especialidade: m.especialidade,
    }));
  },

  async criar(medico) {
    const { data, error } = await supabase
      .from("medicos")
      .insert({ nome: medico.nome, especialidade: medico.especialidade })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar medico:", error);
      return null;
    }
    return data;
  },

  async deletar(id) {
    const { error } = await supabase.from("medicos").delete().eq("id", id);
    if (error) {
      console.error("Erro ao deletar medico:", error);
      return false;
    }
    return true;
  },
};

export const chatService = {
  async listarMensagens() {
    const { data, error } = await supabase
      .from("chat_mensagens")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao listar mensagens:", error);
      return [];
    }

    return data.map((m) => ({
      id: m.id,
      remetente: m.remetente,
      mensagem: m.mensagem,
      timestamp: m.created_at,
    }));
  },

  async enviarMensagem(remetente, mensagem) {
    const { data, error } = await supabase
      .from("chat_mensagens")
      .insert({ remetente, mensagem })
      .select()
      .single();

    if (error) {
      console.error("Erro ao enviar mensagem:", error);
      return null;
    }
    return data;
  },

  // Escutar novas mensagens em tempo real
  onNovaMensagem(callback) {
    const subscription = supabase
      .channel("chat_mensagens")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_mensagens" },
        (payload) => {
          callback({
            id: payload.new.id,
            remetente: payload.new.remetente,
            mensagem: payload.new.mensagem,
            timestamp: payload.new.created_at,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },
};
