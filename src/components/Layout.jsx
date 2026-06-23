import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useIdleTimer } from '../hooks/useIdleTimer';
import {
  HiOutlineBell,
  HiOutlineUserCircle,
  HiMenu,
  HiX,
} from 'react-icons/hi';
import {
  FaHome,
  FaListAlt,
  FaCalendarAlt,
  FaHistory,
  FaSyringe,
  FaCog,
} from 'react-icons/fa';
import UserProfileModal from './UserProfileModal';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useIdleTimer(30, logout);

  if (!user) return children;

  let painelLink = '/dashboard-paciente';
  if (user?.role === 'admin') painelLink = '/dashboard-paciente';
  else if (user?.role === 'atendente') painelLink = '/atendente-dashboard';

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center px-4 md:px-6 h-16 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
          <Link to="/dashboard-paciente" className="text-xl font-bold text-blue-700 dark:text-blue-400">
            Minha UBS
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to={painelLink} className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition text-sm lg:text-base">
            <FaHome size={16} /><span>Painel</span>
          </Link>
          <Link to="/filas-atendimento" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition text-sm lg:text-base">
            <FaListAlt size={16} /><span>Filas</span>
          </Link>
          <Link to="/agendamento" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition text-sm lg:text-base">
            <FaCalendarAlt size={16} /><span>Agendamento</span>
          </Link>
          <Link to="/historico-medico" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition text-sm lg:text-base">
            <FaHistory size={16} /><span>Histórico</span>
          </Link>
          <Link to="/vacinação" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition text-sm lg:text-base">
            <FaSyringe size={16} /><span>Vacinas</span>
          </Link>
          <Link to="/configuracoes" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition text-sm lg:text-base">
            <FaCog size={16} /><span>Configuração</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <HiOutlineBell size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
            <HiOutlineUserCircle size={24} className="text-gray-600 dark:text-gray-300" />
            <span className="text-sm hidden md:inline text-gray-700 dark:text-gray-200">{user?.name}</span>
          </button>
        </div>
      </header>

      {/* Sidebar (desktop fixa / mobile sobreposta) */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={closeSidebar} />
      )}

      <main className="pt-20 px-4 md:px-6 pb-10 md:ml-64 text-gray-800 dark:text-gray-100 transition-all duration-300">
        {children}
      </main>

      <UserProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      <footer className="w-full py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:ml-64">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-6 gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">© 2024 Minha UBS</p>
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500">Privacidade</a>
            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500">Termos de Uso</a>
            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500">Suporte</a>
            <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500">Portal Gov.br</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;