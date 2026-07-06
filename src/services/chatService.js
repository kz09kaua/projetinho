import { getAll, get, insert, update, deleteItem, query, STORES } from "../data/database";

// ============================================================
// SERVICO DE CHAT
// ============================================================

export const chatService = {
  async listarMensagens() {
    try {
      const data = await getAll(STORES.chat_mensagens);
      return data.map((m) => ({
        id: m.id,
        remetente: m.remitente,
        destinatario: m.destinatario,
        mensagem: m.mensagem,
        data: m.created_at,
      }));
    } catch (error) {
      console.error("Erro ao listar mensagens:", error);
      return [];
    }
  },

  async enviarMensagem(mensagem) {
    try {
      const allMensagens = await getAll(STORES.chat_mensagens);
      const newId = allMensagens.length > 0 
        ? Math.max(...allMensagens.map(m => m.id)) + 1 
        : 1;

      const data = {
        id: newId,
        remitente: mensagem.remitente,
        destinatario: mensagem.destinatario,
        mensagem: mensagem.mensagem,
        created_at: new Date().toISOString(),
      };

      await insert(STORES.chat_mensagens, data);
      return data;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return null;
    }
  },

  async buscarPorUsuario(usuario) {
    try {
      const data = await getAll(STORES.chat_mensagens);
      const filtered = data.filter(
        (m) => m.remitente === usuario || m.destinatario === usuario
      );
      return filtered.map((m) => ({
        id: m.id,
        remetente: m.remitente,
        destinatario: m.destinatario,
        mensagem: m.mensagem,
        data: m.created_at,
      }));
    } catch (error) {
      return [];
    }
  },

  async deletar(id) {
    try {
      await deleteItem(STORES.chat_mensagens, id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      return false;
    }
  },
};