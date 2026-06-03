import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLockClosed } from 'react-icons/hi';
import { Activity } from 'lucide-react';
import Swal from 'sweetalert2';

const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Token inválido.',
        confirmButtonColor: '#0057B8',
      }).then(() => navigate('/login'));

      return;
    }

    const resetTokens = JSON.parse(
      localStorage.getItem('reset_tokens') || '{}'
    );

    const tokenData = resetTokens[token];

    if (!tokenData) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Link inválido.',
        confirmButtonColor: '#0057B8',
      }).then(() => navigate('/esqueceu-senha'));

      return;
    }

    if (tokenData.expires < Date.now()) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Link expirado.',
        confirmButtonColor: '#0057B8',
      }).then(() => navigate('/esqueceu-senha'));

      return;
    }

    setTokenValido(true);
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novaSenha || !confirmarSenha) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Preencha todos os campos.',
        confirmButtonColor: '#0057B8',
      });

      return;
    }

    if (novaSenha !== confirmarSenha) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'As senhas não coincidem.',
        confirmButtonColor: '#0057B8',
      });

      return;
    }

    if (novaSenha.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'A senha deve ter no mínimo 6 caracteres.',
        confirmButtonColor: '#0057B8',
      });

      return;
    }

    setIsLoading(true);

    try {
      // Remove token usado
      const resetTokens = JSON.parse(
        localStorage.getItem('reset_tokens') || '{}'
      );

      delete resetTokens[token];

      localStorage.setItem(
        'reset_tokens',
        JSON.stringify(resetTokens)
      );

      console.log('Nova senha:', novaSenha);

      Swal.fire({
        icon: 'success',
        title: 'Senha redefinida!',
        text: 'Agora você pode fazer login com sua nova senha.',
        confirmButtonColor: '#0057B8',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao redefinir senha.',
        confirmButtonColor: '#0057B8',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-on-surface text-lg">
          Validando link...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Fundo blur */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg">
              <Activity
                size={28}
                className="text-on-primary"
              />
            </div>
          </div>

          <h2 className="text-3xl font-black text-on-surface tracking-tight">
            Redefinir senha
          </h2>

          <p className="text-on-surface-variant mt-2">
            Digite sua nova senha
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">
              Nova senha
            </label>

            <div className="relative">
              <HiLockClosed
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                size={18}
              />

              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary transition-all text-on-surface"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">
              Confirmar senha
            </label>

            <div className="relative">
              <HiLockClosed
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                size={18}
              />

              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary transition-all text-on-surface"
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold text-base rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading
              ? 'Redefinindo...'
              : 'Redefinir senha'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-primary text-sm font-bold hover:opacity-80 transition"
          >
            Voltar ao login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RedefinirSenha;

