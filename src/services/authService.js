// ============================================================
// SERVIÇO DE AUTENTICAÇÃO LOCAL
// Substitui o Supabase Auth
// ============================================================

import { STORES, getAll, get, insert, update, query } from "../data/database";

// Contador de tentativas de login (por sessão)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 60000; // 1 minuto

// Gerenciar sessão no localStorage
const SESSION_KEY = "ubs_session";

export const authService = {
  // Verificar se o usuário está logado
  async getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;

    const profile = await get(STORES.profiles, session.userId);
    return profile;
  },

  // Obter sessão do localStorage
  getSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  // Salvar sessão no localStorage
  setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  // Limpar sessão
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  // Login com email e senha
  async login(email, password) {
    // Verificar bloqueio por tentativas
    const attempt = loginAttempts[email];
    if (attempt && attempt.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - attempt.lastAttempt;
      if (elapsed < BLOCK_TIME_MS) {
        const remaining = Math.ceil((BLOCK_TIME_MS - elapsed) / 1000);
        throw new Error(
          `Muitas tentativas. Tente novamente em ${remaining} segundos.`
        );
      }
      // Reset após o tempo de bloqueio
      delete loginAttempts[email];
    }

    // Buscar usuário pelo email
    const profiles = await query(STORES.profiles, { eq: { field: "email", value: email } });
    
    if (profiles.length === 0) {
      // Incrementar contador de tentativas
      if (!loginAttempts[email]) {
        loginAttempts[email] = { count: 0, lastAttempt: 0 };
      }
      loginAttempts[email].count += 1;
      loginAttempts[email].lastAttempt = Date.now();
      return null;
    }

    const user = profiles[0];

    // Verificar senha (em produção, usar hash!)
    if (user.senha_hash !== password) {
      // Incrementar contador de tentativas
      if (!loginAttempts[email]) {
        loginAttempts[email] = { count: 0, lastAttempt: 0 };
      }
      loginAttempts[email].count += 1;
      loginAttempts[email].lastAttempt = Date.now();
      return null;
    }

    // Login bem-sucedido - resetar tentativas
    delete loginAttempts[email];

    // Criar sessão
    const session = {
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    };

    this.setSession(session);

    return {
      id: user.id,
      name: user.nome,
      nome: user.nome,
      role: user.role,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone,
      dataNascimento: user.data_nascimento,
      endereco: user.endereco,
      bio: user.bio,
      genero: user.genero,
    };
  },

  // Logout
  async logout() {
    this.clearSession();
    return true;
  },

  // Registro de novo usuário
  async register(userData) {
    try {
      // Verificar se email já existe
      const existingProfiles = await query(STORES.profiles, { 
        eq: { field: "email", value: userData.email } 
      });
      
      if (existingProfiles.length > 0) {
        return false;
      }

      // Verificar se CPF já existe
      const existingByCpf = await query(STORES.profiles, { 
        eq: { field: "cpf", value: userData.cpf } 
      });
      
      if (existingByCpf.length > 0) {
        return false;
      }

      // Gerar novo ID
      const allProfiles = await getAll(STORES.profiles);
      const newId = allProfiles.length > 0 
        ? Math.max(...allProfiles.map(p => p.id)) + 1 
        : 1;

      // Criar perfil
      const profile = {
        id: newId,
        nome: userData.nome,
        email: userData.email,
        cpf: userData.cpf,
        telefone: userData.telefone,
        data_nascimento: userData.dataNascimento || null,
        endereco: userData.endereco || null,
        role: "paciente",
        senha_hash: userData.senha,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await insert(STORES.profiles, profile);

      return true;
    } catch (error) {
      console.error("Erro no registro:", error);
      return false;
    }
  },

  // Atualizar perfil do usuário logado
  async updateUser(userId, updatedData) {
    try {
      const profile = await get(STORES.profiles, userId);
      if (!profile) return false;

      const updateFields = {};
      if (updatedData.name !== undefined) updateFields.nome = updatedData.name;
      if (updatedData.nome !== undefined) updateFields.nome = updatedData.nome;
      if (updatedData.telefone !== undefined) updateFields.telefone = updatedData.telefone;
      if (updatedData.dataNascimento !== undefined) updateFields.data_nascimento = updatedData.dataNascimento;
      if (updatedData.endereco !== undefined) updateFields.endereco = updatedData.endereco;
      if (updatedData.bio !== undefined) updateFields.bio = updatedData.bio;
      if (updatedData.genero !== undefined) updateFields.genero = updatedData.genero;

      const updatedProfile = {
        ...profile,
        ...updateFields,
        updated_at: new Date().toISOString(),
      };

      await update(STORES.profiles, updatedProfile);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return false;
    }
  },

  // Atualizar outro usuário (usado pelo admin)
  async updateOtherUser(email, newData) {
    try {
      const profiles = await query(STORES.profiles, { 
        eq: { field: "email", value: email } 
      });

      if (profiles.length === 0) return false;

      const profile = profiles[0];
      const updateFields = {};
      if (newData.nome !== undefined) updateFields.nome = newData.nome;
      if (newData.role !== undefined) updateFields.role = newData.role;
      if (newData.email !== undefined) updateFields.email = newData.email;

      const updatedProfile = {
        ...profile,
        ...updateFields,
        updated_at: new Date().toISOString(),
      };

      await update(STORES.profiles, updatedProfile);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar outro usuário:", error);
      return false;
    }
  },

  // Buscar lista de usuários (para admin)
  async fetchUsersList() {
    try {
      const profiles = await getAll(STORES.profiles);
      return profiles.map((p) => ({
        nome: p.nome,
        email: p.email,
        cpf: p.cpf,
        telefone: p.telefone,
        role: p.role,
        dataNascimento: p.data_nascimento,
      }));
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  },

  // Redefinir senha (simulado - em produção enviaria email)
  async resetPassword(email) {
    try {
      const profiles = await query(STORES.profiles, { 
        eq: { field: "email", value: email } 
      });
      
      if (profiles.length === 0) return false;

      // Em produção, enviaria email com token
      // Por enquanto, apenas retorna sucesso
      return true;
    } catch (error) {
      console.error("Erro ao enviar reset:", error);
      return false;
    }
  },

  // Atualizar senha
  async updatePassword(userId, newPassword) {
    try {
      const profile = await get(STORES.profiles, userId);
      if (!profile) return false;

      const updatedProfile = {
        ...profile,
        senha_hash: newPassword,
        updated_at: new Date().toISOString(),
      };

      await update(STORES.profiles, updatedProfile);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      return false;
    }
  },
};