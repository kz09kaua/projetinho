import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Contador de tentativas de login (por sessão)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 60000; // 1 minuto

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ubsSelecionada, setUbsSelecionada] = useState(() => {
    // Recupera do localStorage se existir
    return localStorage.getItem("atendente_ubs") || null;
  });

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    if (ubsSelecionada) {
      localStorage.setItem("atendente_ubs", ubsSelecionada);
    } else {
      localStorage.removeItem("atendente_ubs");
    }
  }, [ubsSelecionada]);

  // Inicializa o estado do usuário ao carregar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = authService.getSession();
        if (session) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            authService.clearSession();
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
      // Reset após o tempo de bloqueio
      delete loginAttempts[email];
    }

    const userData = await authService.login(email, password);

    if (!userData) {
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
    setUser(userData);

    // Se for atendente, limpa a UBS selecionada anterior (força nova escolha)
    if (userData.role === "atendente") {
      setUbsSelecionada(null);
      localStorage.removeItem("atendente_ubs");
    }

    return userData;
  };

  // Logout
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUbsSelecionada(null);
  };

  // Registro de novo usuário
  const register = async (userData) => {
    const success = await authService.register(userData);
    return success;
  };

  // Atualizar perfil do usuário logado
  const updateUser = async (updatedData) => {
    if (!user?.id) return;

    const success = await authService.updateUser(user.id, updatedData);
    if (success) {
      setUser((prev) => ({
        ...prev,
        ...updatedData,
        name: updatedData.nome || updatedData.name || prev.name,
        nome: updatedData.nome || updatedData.name || prev.nome,
      }));
    }
  };

  // Atualizar outro usuário (usado pelo admin)
  const updateOtherUser = async (email, newData) => {
    const success = await authService.updateOtherUser(email, newData);
    if (success) {
      setUser((prev) => ({
        ...prev,
        name: newData.nome || prev.name,
        nome: newData.nome || prev.nome,
        role: newData.role || prev.role,
      }));
    }
  };

  // Buscar lista de usuários (para admin)
  const fetchUsersList = async () => {
    return await authService.fetchUsersList();
  };

  // Enviar email de redefinição de senha
  const resetPassword = async (email) => {
    const success = await authService.resetPassword(email);
    if (!success) {
      return false;
    }
    return true;
  };

  // Atualizar senha
  const updatePassword = async (newPassword) => {
    if (!user?.id) return false;
    const success = await authService.updatePassword(user.id, newPassword);
    return success;
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
        ubsSelecionada,
        setUbsSelecionada,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};