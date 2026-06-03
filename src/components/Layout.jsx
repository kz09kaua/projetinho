import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi';

const Layout = ({ children }) => {

  const { user } = useAuth();

  // páginas públicas
  if (!user) return children;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center px-6 h-16 w-full bg-white border-b border-slate-100 shadow-sm">

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard-paciente"
            className="text-xl font-bold text-blue-700 tracking-tight"
          >
            Minha UBS
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">

          <Link
            to="/dashboard-paciente"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Painel
          </Link>

          <Link
            to="/filas-atendimento"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Filas
          </Link>

          <Link
            to="/agendamento"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Agendamento
          </Link>

          <Link
            to="/historico-medico"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Histórico
          </Link>

          <Link
            to="/vacinação"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Vacinas
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/configuracoes"
              className="text-slate-600 hover:text-blue-700 transition"
            >
              Configuração
            </Link>
          )}

        </nav>

        <div className="flex items-center gap-4">

          <button className="p-2 rounded-full hover:bg-slate-100 transition">
            <HiOutlineBell
              size={20}
              className="text-slate-600"
            />
          </button>

          <div className="flex items-center gap-2">

            <HiOutlineUserCircle
              size={28}
              className="text-slate-600"
            />

            <span className="text-sm hidden md:inline">
              {user?.name}
            </span>

          </div>

        </div>

      </header>

      <Sidebar />

      <main className="md:ml-64 pt-20 px-6 pb-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t border-slate-100 md:ml-64">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">

          <p className="text-xs text-slate-500">
            © 2024 Minha UBS - Sistema de Gestão de Saúde Pública.
          </p>

          <div className="flex gap-6">

            <a href="#" className="text-xs text-slate-500 hover:text-blue-500">
              Privacidade
            </a>

            <a href="#" className="text-xs text-slate-500 hover:text-blue-500">
              Termos de Uso
            </a>

            <a href="#" className="text-xs text-slate-500 hover:text-blue-500">
              Suporte
            </a>

            <a href="#" className="text-xs text-slate-500 hover:text-blue-500">
              Portal Gov.br
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Layout;