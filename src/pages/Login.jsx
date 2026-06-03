// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { HiUser, HiLockClosed } from 'react-icons/hi';
import { Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Não redireciona automaticamente se já estiver logado.
  // O usuário deve clicar em "Sair" para sair, ou fazer login com outra conta.
  // Se quiser redirecionar apenas após login bem-sucedido, faremos no handleSubmit.

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação simples para evitar envio vazio
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    const success = login(email, password);
    if (success) {
      // Redireciona baseado no role após login
      const stored = localStorage.getItem('sus_user');
      if (stored) {
        const loggedUser = JSON.parse(stored);
        if (loggedUser.role === 'admin') navigate('/painel-administrador');
        else if (loggedUser.role === 'atendente') navigate('/atendente-dashboard');
        else navigate('/dashboard-paciente');
      } else {
        navigate('/dashboard-paciente');
      }
    } else {
      setError('Credenciais inválidas. Use admin@ubs.com / 123456 (Admin), atendente@ubs.com / 123456 (Atendente) ou paciente@email.com / 123456 (Paciente)');
    }
  };

  // Limpa os campos ao montar o componente (evita autopreenchimento indesejado)
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant p-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg">
              <Activity size={28} className="text-on-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Minha UBS</h2>
          <p className="text-on-surface-variant mt-2">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">E-mail</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface placeholder:text-outline"
                placeholder="admin@ubs.com / atendente@ubs.com / paciente@email.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-on-surface">Senha</label>
              <Link to="/esqueceu-senha" className="text-xs font-bold text-primary hover:opacity-80 transition">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface placeholder:text-outline"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-error-container/30 border border-error text-error text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold text-base rounded-xl shadow-lg transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            Não possui conta?{' '}
            <Link to="/cadastro" className="font-bold text-primary hover:opacity-80 transition">
              Criar conta gratuita
            </Link>
          </p>
          <p className="text-xs text-outline mt-4">
            Demo: admin@ubs.com / 123456 (Admin) | atendente@ubs.com / 123456 (Atendente) | paciente@email.com / 123456 (Paciente)
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;