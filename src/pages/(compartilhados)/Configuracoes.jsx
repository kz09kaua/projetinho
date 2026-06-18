import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useIdleTimer } from "../hooks/useIdleTimer";
import { HiOutlineBell, HiOutlineUserCircle } from "react-icons/hi";
import {
  FaHome,
  FaListAlt,
  FaCalendarAlt,
  FaHistory,
  FaSyringe,
  FaCog,
} from "react-icons/fa";
import UserProfileModal from "./UserProfileModal";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  useIdleTimer(30, logout);

  if (!user) return children;

  let painelLink = "/dashboard-paciente";
  if (user?.role === "admin") {
    painelLink = "/dashboard-paciente";
  } else if (user?.role === "atendente") {
    painelLink = "/atendente-dashboard";
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center px-6 h-16 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard-paciente"
            className="text-xl font-bold text-blue-700 dark:text-blue-400 tracking-tight"
          >
            Minha UBS
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={painelLink}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <FaHome size={16} />
            <span>Painel</span>
          </Link>
          <Link
            to="/filas-atendimento"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <FaListAlt size={16} />
            <span>Filas</span>
          </Link>
          <Link
            to="/agendamento"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <FaCalendarAlt size={16} />
            <span>Agendamento</span>
          </Link>
          <Link
            to="/historico-medico"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <FaHistory size={16} />
            <span>Histórico</span>
          </Link>
          <Link
            to="/vacinação"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <FaSyringe size={16} />
            <span>Vacinas</span>
          </Link>
          <Link
            to="/configuracoes"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition"
          >
            <FaCog size={16} />
            <span>Configuração</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <HiOutlineBell
              size={20}
              className="text-gray-600 dark:text-gray-300"
            />
          </button>

          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg transition"
          >
            <HiOutlineUserCircle
              size={28}
              className="text-gray-600 dark:text-gray-300"
            />
            <span className="text-sm hidden md:inline text-gray-700 dark:text-gray-200">
              {user?.name}
            </span>
          </button>
        </div>
      </header>

      <Sidebar />

      <main className="md:ml-64 pt-20 px-6 pb-10 text-gray-800 dark:text-gray-100">
        {children}
      </main>

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <footer className="w-full py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:ml-64">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Minha UBS - Sistema de Gestão de Saúde Pública.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500"
            >
              Privacidade
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500"
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500"
            >
              Suporte
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500"
            >
              Portal Gov.br
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
