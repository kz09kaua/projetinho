import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("sus_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("sus_user");
      }
    }
    const storedUsers = localStorage.getItem("sus_users");
    if (storedUsers) {
      try {
        setUsersList(JSON.parse(storedUsers));
      } catch {
        localStorage.removeItem("sus_users");
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    let userData = null;

    // ADMIN
    if (email === "admin@ubs.com" && password === "123456") {
      userData = { name: "Administrador", role: "admin", email };
    }
    // ATENDENTE
    else if (email === "atendente@ubs.com" && password === "123456") {
      userData = { name: "Carlos Atendente", role: "atendente", email };
    }
    // PACIENTE DEMO (acesso garantido, sem depender do localStorage)
    else if (email === "paciente@email.com" && password === "123456") {
      userData = {
        name: "Maria Silva",
        role: "paciente",
        email,
        cpf: "123.456.789-00",
      };
    }
    // PACIENTES CADASTRADOS (apenas se não for o demo)
    else {
      try {
        const users = JSON.parse(localStorage.getItem("sus_users") || "[]");
        const found = users.find(
          (u) => u.email === email && u.senha === password,
        );
        if (found) {
          userData = {
            name: found.nome,
            role: "paciente",
            email: found.email,
            cpf: found.cpf,
            telefone: found.telefone,
            dataNascimento: found.dataNascimento,
            endereco: found.endereco,
            bio: found.bio,
            genero: found.genero,
          };
        }
      } catch (e) {
        // Se o JSON estiver corrompido, simplesmente não encontra o usuário
        console.warn("Erro ao ler usuários cadastrados, ignorando.", e);
      }
    }

    if (userData) {
      localStorage.setItem("sus_user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("sus_user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("sus_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    if (updatedUser.role === "paciente") {
      try {
        const users = JSON.parse(localStorage.getItem("sus_users") || "[]");
        const idx = users.findIndex((u) => u.email === updatedUser.email);
        if (idx !== -1) {
          users[idx] = {
            ...users[idx],
            nome: updatedUser.name,
            telefone: updatedUser.telefone,
          };
          localStorage.setItem("sus_users", JSON.stringify(users));
          setUsersList(users);
        }
      } catch {}
    }
  };

  const updateOtherUser = (email, newData) => {
    try {
      const users = JSON.parse(localStorage.getItem("sus_users") || "[]");
      const idx = users.findIndex((u) => u.email === email);
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          nome: newData.nome,
          role: newData.role,
          email: newData.email,
        };
        localStorage.setItem("sus_users", JSON.stringify(users));
        setUsersList(users);
        if (user?.email === email) {
          const updatedMe = { ...user, name: newData.nome, role: newData.role };
          localStorage.setItem("sus_user", JSON.stringify(updatedMe));
          setUser(updatedMe);
        }
      }
    } catch {}
  };

  const register = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem("sus_users") || "[]");
      const exists = users.find(
        (u) => u.email === userData.email || u.cpf === userData.cpf,
      );
      if (exists) return false;
      users.push(userData);
      localStorage.setItem("sus_users", JSON.stringify(users));
      setUsersList(users);
      return true;
    } catch {
      return false;
    }
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
        usersList,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
