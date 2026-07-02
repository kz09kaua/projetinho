import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Contador de tentativas de login (por sessao)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 60000; // 1 minuto

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca o perfil do usuario na tabela profiles
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }
    return data;
  };

  // Monta o objeto user a partir do perfil
  const buildUser = (profile) => {
    if (!profile) return null;
    return {
      id: profile.id,
      name: profile.nome,
      nome: profile.nome,
      role: profile.role,
      email: profile.email,
      cpf: profile.cpf,
      telefone: profile.telefone,
      dataNascimento: profile.data_nascimento,
      endereco: profile.endereco,
      bio: profile.bio,
      genero: profile.genero,
    };
  };

  // Inicializa o estado do usuario ao carregar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(buildUser(profile));
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Escuta mudancas de autenticacao
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(buildUser(profile));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Login com email e senha
  const login = async (email, password) => {
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
      // Reset apos o tempo de bloqueio
      delete loginAttempts[email];
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
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

    const profile = await fetchProfile(data.user.id);
    const userData = buildUser(profile);
    setUser(userData);
    return userData;
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Registro de novo usuario
  const register = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.senha,
      options: {
        data: {
          nome: userData.nome,
          cpf: userData.cpf,
          telefone: userData.telefone,
          role: "paciente",
        },
      },
    });

    if (error) {
      console.error("Erro no registro:", error);
      return false;
    }

    return true;
  };

  // Atualizar perfil do usuario logado
  const updateUser = async (updatedData) => {
    if (!user?.id) return;

    const updateFields = {};
    if (updatedData.name !== undefined) updateFields.nome = updatedData.name;
    if (updatedData.nome !== undefined) updateFields.nome = updatedData.nome;
    if (updatedData.telefone !== undefined)
      updateFields.telefone = updatedData.telefone;
    if (updatedData.dataNascimento !== undefined)
      updateFields.data_nascimento = updatedData.dataNascimento;
    if (updatedData.endereco !== undefined)
      updateFields.endereco = updatedData.endereco;
    if (updatedData.bio !== undefined) updateFields.bio = updatedData.bio;
    if (updatedData.genero !== undefined)
      updateFields.genero = updatedData.genero;

    const { error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", user.id);

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      return;
    }

    // Atualiza o state local
    const updatedUser = {
      ...user,
      ...updatedData,
      name: updatedData.nome || updatedData.name || user.name,
      nome: updatedData.nome || updatedData.name || user.nome,
    };
    setUser(updatedUser);
  };

  // Atualizar outro usuario (usado pelo admin)
  const updateOtherUser = async (email, newData) => {
    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (fetchError || !profiles) return;

    const updateFields = {};
    if (newData.nome !== undefined) updateFields.nome = newData.nome;
    if (newData.role !== undefined) updateFields.role = newData.role;
    if (newData.email !== undefined) updateFields.email = newData.email;

    const { error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", profiles.id);

    if (error) {
      console.error("Erro ao atualizar outro usuario:", error);
      return;
    }

    // Se for o proprio usuario, atualiza o state
    if (user?.email === email) {
      setUser((prev) => ({
        ...prev,
        name: newData.nome || prev.name,
        nome: newData.nome || prev.nome,
        role: newData.role || prev.role,
      }));
    }
  };

  // Buscar lista de usuarios (para admin)
  const fetchUsersList = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar usuarios:", error);
      return [];
    }

    return data.map((p) => ({
      nome: p.nome,
      email: p.email,
      cpf: p.cpf,
      telefone: p.telefone,
      role: p.role,
      dataNascimento: p.data_nascimento,
    }));
  };

  // Enviar email de redefinicao de senha
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) {
      console.error("Erro ao enviar reset:", error);
      return false;
    }
    return true;
  };

  // Atualizar senha
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Erro ao atualizar senha:", error);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        updateUser,
        updateOtherUser,
        register,
        fetchUsersList,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
