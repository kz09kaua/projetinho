import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('sus_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao parsear usuário:', e);
        localStorage.removeItem('sus_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    let userData = null;
    // ADMIN
    if (email === 'admin@ubs.com' && password === '123456') {
      userData = { name: 'Administrador', role: 'admin', email };
    }
    // ATENDENTE
    else if (email === 'atendente@ubs.com' && password === '123456') {
      userData = { name: 'Carlos Atendente', role: 'atendente', email };
    }
    // PACIENTE CADASTRADO (via cadastro)
    else {
      const users = JSON.parse(localStorage.getItem('sus_users') || '[]');
      const found = users.find(u => u.email === email && u.senha === password);
      if (found) {
        userData = { name: found.nome, role: 'paciente', email: found.email, cpf: found.cpf };
      }
      // PACIENTE DEMO padrão
      else if (email === 'paciente@email.com' && password === '123456') {
        userData = { name: 'Maria Silva', role: 'paciente', email, cpf: '123.456.789-00' };
      }
    }
    if (userData) {
      localStorage.setItem('sus_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('sus_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};