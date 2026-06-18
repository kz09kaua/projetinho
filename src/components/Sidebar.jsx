import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaHome,
  FaListAlt,
  FaCalendarAlt,
  FaHistory,
  FaClipboardList,
  FaCog,
  FaNetworkWired,
  FaSyringe,
  FaSearch,
  FaSignOutAlt,
  FaPills,
  FaTachometerAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    // Dashboard: apenas paciente e admin
    {
      path: "/dashboard-paciente",
      label: "Dashboard",
      icon: FaHome,
      roles: ["paciente", "admin"],
    },
    // Comuns a todos os perfis
    {
      path: "/filas-atendimento",
      label: "Filas",
      icon: FaListAlt,
      roles: ["paciente", "admin", "atendente"],
    },
    {
      path: "/agendamento",
      label: "Agendamento",
      icon: FaCalendarAlt,
      roles: ["paciente", "admin", "atendente"],
    },
    {
      path: "/historico-medico",
      label: "Histórico",
      icon: FaHistory,
      roles: ["paciente", "admin", "atendente"],
    },
    {
      path: "/vacinação",
      label: "Vacinas",
      icon: FaSyringe,
      roles: ["paciente", "admin", "atendente"],
    },
    {
      path: "/procurar-ubs",
      label: "Procurar UBS",
      icon: FaSearch,
      roles: ["paciente", "admin", "atendente"],
    },
    {
      path: "/sus-conectado",
      label: "SUS Conectado",
      icon: FaNetworkWired,
      roles: ["paciente", "admin", "atendente"],
    },
    {
      path: "/configuracoes",
      label: "Configurações",
      icon: FaCog,
      roles: ["paciente", "admin", "atendente"],
    },
    // Atendente
    {
      path: "/atendente-dashboard",
      label: "Painel Atendente",
      icon: FaTachometerAlt,
      roles: ["atendente"],
    },
    {
      path: "/gerenciar-filas",
      label: "Gerenciar Filas",
      icon: FaListAlt,
      roles: ["atendente"],
    },
    {
      path: "/estoque-vacinas",
      label: "Estoque Vacinas",
      icon: FaSyringe,
      roles: ["atendente"],
    },
    {
      path: "/estoque-medicamentos",
      label: "Estoque Medicamentos",
      icon: FaPills,
      roles: ["atendente"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "paciente"),
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-black text-blue-700">Minha UBS</h2>
        <p className="text-xs text-gray-500">Unidade de Saúde</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 mx-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="px-3 py-2 text-sm">
          <p className="font-medium text-gray-800">{user?.name || "Usuário"}</p>
          <p className="text-xs text-gray-500">
            {user?.role === "admin"
              ? "Administrador"
              : user?.role === "atendente"
                ? "Atendente"
                : "Paciente"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <FaSignOutAlt size={16} /> Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
