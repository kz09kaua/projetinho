import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  HiUserCircle,
  HiPencil,
  HiSave,
  HiX,
  HiUsers,
  HiSearch,
  HiShieldCheck,
  HiKey,
  HiLogout,
  HiPhone,
  HiMail,
  HiIdentification,
  HiCalendar,
  HiLocationMarker,
  HiPhotograph,
  HiBell,
  HiClock,
  HiCheckCircle,
  HiExclamation,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import Swal from "sweetalert2";

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser, usersList, updateOtherUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Dados do próprio perfil
  const [formData, setFormData] = useState({
    nome: user?.name || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    cpf: user?.cpf || "",
    dataNascimento: user?.dataNascimento || "",
    endereco: user?.endereco || "",
    bio: user?.bio || "",
    genero: user?.genero || "",
    foto: user?.foto || "",
  });

  // Admin
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    nome: "",
    email: "",
    role: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    bio: "",
    genero: "",
  });

  // Notificações
  const [notifSettings, setNotifSettings] = useState({
    agendamentos: true,
    filas: true,
    vacinas: false,
    som: false,
    emailNotif: true,
  });

  // Histórico de atividades
  const [historico] = useState([
    { acao: "Login realizado", data: "18/06/2024 08:32", icone: "login" },
    { acao: "Perfil atualizado", data: "17/06/2024 15:10", icone: "edit" },
    { acao: "Consulta agendada", data: "16/06/2024 10:45", icone: "calendar" },
    { acao: "Senha alterada", data: "10/06/2024 14:20", icone: "key" },
  ]);

  if (!isOpen) return null;

  const isAdmin = user?.role === "admin";

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveProfile = () => {
    if (!formData.nome.trim()) {
      Swal.fire("Atenção", "O nome é obrigatório.", "warning");
      return;
    }
    updateUser({
      ...user,
      name: formData.nome,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
      endereco: formData.endereco,
      bio: formData.bio,
      genero: formData.genero,
      foto: formData.foto,
    });
    Swal.fire({
      icon: "success",
      title: "Perfil atualizado",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
    setEditMode(false);
  };

  const handleSaveNotif = () => {
    Swal.fire({
      icon: "success",
      title: "Preferências salvas",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const filteredUsers = (usersList || []).filter(
    (u) =>
      u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setAdminFormData({
      nome: u.nome || "",
      email: u.email || "",
      role: u.role || "paciente",
      telefone: u.telefone || "",
      cpf: u.cpf || "",
      dataNascimento: u.dataNascimento || "",
      endereco: u.endereco || "",
      bio: u.bio || "",
      genero: u.genero || "",
    });
  };

  const handleAdminSave = () => {
    if (!selectedUser || !adminFormData.nome.trim()) return;
    updateOtherUser(selectedUser.email, adminFormData);
    Swal.fire({
      icon: "success",
      title: "Usuário atualizado",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
    setSelectedUser(null);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Sair da conta?",
      text: "Você será redirecionado para a tela de login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sair",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        onClose();
      }
    });
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: "Alterar senha",
      html: `<input id="senha-atual" type="password" class="swal2-input" placeholder="Senha atual" required>
             <input id="nova-senha" type="password" class="swal2-input" placeholder="Nova senha" required>
             <input id="confirma-senha" type="password" class="swal2-input" placeholder="Confirmar nova senha" required>`,
      confirmButtonText: "Alterar",
      showCancelButton: true,
      preConfirm: () => {
        const atual = document.getElementById("senha-atual").value;
        const nova = document.getElementById("nova-senha").value;
        const confirma = document.getElementById("confirma-senha").value;
        if (!atual || !nova || !confirma) {
          Swal.showValidationMessage("Preencha todos os campos");
          return false;
        }
        if (nova.length < 6) {
          Swal.showValidationMessage("Mínimo 6 caracteres");
          return false;
        }
        if (nova !== confirma) {
          Swal.showValidationMessage("Senhas não coincidem");
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed)
        Swal.fire({
          icon: "success",
          title: "Senha alterada (simulação)",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
    });
  };

  const handleFotoUpload = () => {
    const cores = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
    ];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    setFormData({ ...formData, foto: corAleatoria });
    Swal.fire({
      icon: "success",
      title: "Foto atualizada (simulação)",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const renderIconeHistorico = (icone) => {
    switch (icone) {
      case "login":
        return <HiCheckCircle size={18} className="text-green-500" />;
      case "edit":
        return <HiPencil size={18} className="text-blue-500" />;
      case "calendar":
        return <HiCalendar size={18} className="text-purple-500" />;
      case "key":
        return <HiKey size={18} className="text-amber-500" />;
      default:
        return <HiExclamation size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl ring-1 ring-black/5">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <HiUserCircle size={28} className="text-blue-600" />
            Perfil do Usuário
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b dark:border-gray-700 overflow-x-auto">
          {[
            { id: "profile", label: "Meu Perfil", icon: HiUserCircle },
            { id: "notificacoes", label: "Notificações", icon: HiBell },
            { id: "historico", label: "Histórico", icon: HiClock },
            ...(isAdmin
              ? [{ id: "users", label: "Usuários", icon: HiUsers }]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* ABA PERFIL */}
          {activeTab === "profile" && (
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl"
                    style={{
                      backgroundColor: formData.foto || user?.foto || "#3b82f6",
                    }}
                  >
                    {getInitials(user?.name)}
                  </div>
                  <button
                    onClick={handleFotoUpload}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition shadow-lg"
                    title="Alterar foto"
                  >
                    <HiPhotograph size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-2xl text-gray-800 dark:text-gray-100">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1 justify-center sm:justify-start">
                    <HiShieldCheck size={16} /> {user?.role}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                  <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                    >
                      <HiPencil size={14} />{" "}
                      {editMode ? "Cancelar edição" : "Editar"}
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      <HiKey size={14} /> Senha
                    </button>
                  </div>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) =>
                          setFormData({ ...formData, nome: e.target.value })
                        }
                        className="w-full p-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full p-3 border dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                        className="w-full p-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={formData.cpf}
                        disabled
                        className="w-full p-3 border dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Data de nascimento
                      </label>
                      <input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dataNascimento: e.target.value,
                          })
                        }
                        className="w-full p-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Gênero
                      </label>
                      <select
                        value={formData.genero}
                        onChange={(e) =>
                          setFormData({ ...formData, genero: e.target.value })
                        }
                        className="w-full p-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                        <option value="nao_informar">
                          Prefiro não informar
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) =>
                        setFormData({ ...formData, endereco: e.target.value })
                      }
                      className="w-full p-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full p-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <HiSave size={18} /> Salvar todas as alterações
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: HiMail, label: "E-mail", value: user?.email },
                      {
                        icon: HiPhone,
                        label: "Telefone",
                        value: user?.telefone || "Não informado",
                      },
                      {
                        icon: HiIdentification,
                        label: "CPF",
                        value: user?.cpf || "Não informado",
                      },
                      {
                        icon: HiCalendar,
                        label: "Data de nascimento",
                        value: user?.dataNascimento || "Não informado",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      >
                        <item.icon size={20} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.label}
                          </p>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <HiLocationMarker size={20} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Endereço
                      </p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">
                        {user?.endereco || "Não informado"}
                      </p>
                    </div>
                  </div>
                  {user?.bio && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Bio
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {user?.bio}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <HiLogout size={18} /> Sair da conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA NOTIFICAÇÕES */}
          {activeTab === "notificacoes" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <HiBell size={24} className="text-blue-600" /> Preferências de
                Notificação
              </h3>
              {[
                { key: "agendamentos", label: "Alertas de agendamento" },
                { key: "filas", label: "Chamadas de fila" },
                { key: "vacinas", label: "Vacinas disponíveis" },
                { key: "som", label: "Som de chamada" },
                { key: "emailNotif", label: "Notificações por e-mail" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <span className="text-gray-800 dark:text-gray-200">
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={notifSettings[item.key]}
                    onChange={() =>
                      setNotifSettings((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                onClick={handleSaveNotif}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition shadow-md"
              >
                Salvar preferências
              </button>
            </div>
          )}

          {/* ABA HISTÓRICO */}
          {activeTab === "historico" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <HiClock size={24} className="text-blue-600" /> Atividades
                Recentes
              </h3>
              {historico.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center shadow">
                    {renderIconeHistorico(item.icone)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {item.acao}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.data}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ABA USUÁRIOS (admin) */}
          {isAdmin && activeTab === "users" && (
            <div className="space-y-4">
              <div className="relative">
                <HiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Nenhum usuário encontrado.
                  </p>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u.email}
                      onClick={() => handleSelectUser(u)}
                      className={`p-3 rounded-xl cursor-pointer border dark:border-gray-600 transition ${
                        selectedUser?.email === u.email
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          {getInitials(u.nome)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {u.nome}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {u.email} • {u.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {selectedUser && (
                <div className="border-t dark:border-gray-600 pt-4 space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    Editando: {selectedUser.nome}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome</label>
                      <input
                        type="text"
                        value={adminFormData.nome}
                        onChange={(e) =>
                          setAdminFormData({
                            ...adminFormData,
                            nome: e.target.value,
                          })
                        }
                        className="w-full p-2 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Função</label>
                      <select
                        value={adminFormData.role}
                        onChange={(e) =>
                          setAdminFormData({
                            ...adminFormData,
                            role: e.target.value,
                          })
                        }
                        className="w-full p-2 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      >
                        <option value="paciente">Paciente</option>
                        <option value="atendente">Atendente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <input
                        type="text"
                        value={adminFormData.telefone}
                        onChange={(e) =>
                          setAdminFormData({
                            ...adminFormData,
                            telefone: e.target.value,
                          })
                        }
                        className="w-full p-2 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CPF</label>
                      <input
                        type="text"
                        value={adminFormData.cpf}
                        onChange={(e) =>
                          setAdminFormData({
                            ...adminFormData,
                            cpf: e.target.value,
                          })
                        }
                        className="w-full p-2 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAdminSave}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <HiSave size={18} /> Salvar alterações do usuário
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
