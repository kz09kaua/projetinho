import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaHome, FaListAlt, FaCalendarAlt, FaHistory, FaClipboardList,
  FaCog, FaNetworkWired, FaSyringe, FaSearch, FaSignOutAlt,
  FaPills, FaTachometerAlt,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const menuItems = [
    { path: '/dashboard-paciente', label: 'Dashboard', icon: FaHome, roles: ['paciente', 'admin'] },
    { path: '/filas-atendimento', label: 'Filas', icon: FaListAlt, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/agendamento', label: 'Agendamento', icon: FaCalendarAlt, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/historico-medico', label: 'Histórico', icon: FaHistory, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/vacinação', label: 'Vacinas', icon: FaSyringe, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/procurar-ubs', label: 'Procurar UBS', icon: FaSearch, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/sus-conectado', label: 'SUS Conectado', icon: FaNetworkWired, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/configuracoes', label: 'Configurações', icon: FaCog, roles: ['paciente', 'admin', 'atendente'] },
    { path: '/atendente-dashboard', label: 'Painel Atendente', icon: FaTachometerAlt, roles: ['atendente'] },
    { path: '/gerenciar-filas', label: 'Gerenciar Filas', icon: FaListAlt, roles: ['atendente'] },
    { path: '/estoque-vacinas', label: 'Estoque Vacinas', icon: FaSyringe, roles: ['atendente'] },
    { path: '/estoque-medicamentos', label: 'Estoque Medicamentos', icon: FaPills, roles: ['atendente'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || 'paciente'));

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
    >
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-black text-blue-700 dark:text-blue-400">Minha UBS</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Unidade de Saúde</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 mx-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold border-l-4 border-blue-700 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div className="px-3 py-2 text-sm">
          <p className="font-medium text-gray-800 dark:text-gray-200">{user?.name || 'Usuário'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role === 'admin' ? 'Administrador' : user?.role === 'atendente' ? 'Atendente' : 'Paciente'}
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
          <FaSignOutAlt size={16} /> Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;