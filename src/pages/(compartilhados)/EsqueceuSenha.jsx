
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { Activity } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';

const EsqueceuSenha = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Digite seu e-mail.',
        confirmButtonColor: '#0057B8',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await resetPassword(email);

      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'E-mail enviado!',
          text: 'Verifique sua caixa de entrada para redefinir sua senha.',
          confirmButtonColor: '#0057B8',
        });
        setEmail('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Nao foi possivel enviar o e-mail. Verifique o endereco informado.',
          confirmButtonColor: '#0057B8',
        });
      }
    } catch (error) {
      console.error('Erro ao enviar reset:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao enviar e-mail',
        text: 'Tente novamente mais tarde.',
        confirmButtonColor: '#0057B8',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            Esqueceu a senha?
          </h2>

          <p className="text-on-surface-variant mt-2">
            Informe seu e-mail para receber o link de redefinicao
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">
              E-mail
            </label>

            <div className="relative">
              <HiMail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                size={18}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary transition-all text-on-surface"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Botao */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-on-primary font-bold text-base rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading
              ? 'Enviando...'
              : 'Enviar link de redefinicao'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-on-surface-variant text-sm">
            Lembrou sua senha?{' '}
            <Link
              to="/login"
              className="font-bold text-primary hover:opacity-80 transition"
            >
              Voltar ao login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EsqueceuSenha;
