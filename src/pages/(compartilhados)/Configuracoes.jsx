// src/pages/(compartilhados)/Configuracoes.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import {
  FaCog,
  FaTachometerAlt,
  FaListAlt,
  FaCalendarAlt,
  FaHistory,
  FaSyringe,
  FaShieldAlt,
  FaBuilding,
  FaUsersCog,
  FaStethoscope,
  FaUserLock,
  FaTrash,
  FaEdit,
  FaPlus,
  FaFileDownload,
  FaPalette,
  FaFont,
  FaGlobe,
  FaBell,
  FaEye,
  FaUndo,
  FaSave,
  FaRegMoon,
  FaRegSun,
  FaHome,
} from "react-icons/fa";
import { HiChevronDoubleLeft, HiDocumentText, HiUsers } from "react-icons/hi";

// ============================================================
// COMPONENTES REUTILIZÁVEIS
// ============================================================

const MetricCard = ({ title, value, icon: Icon, color = "blue", theme }) => {
  const colorMap = {
    blue: "from-blue-600 to-blue-700",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-rose-500 to-rose-600",
    teal: "from-teal-500 to-teal-600",
    indigo: "from-indigo-500 to-indigo-600",
    gray: "from-slate-500 to-slate-600",
  };
  const gradient = colorMap[color] || colorMap.blue;

  const isDark = theme === "dark";

  return (
    <div
      className={`group rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 flex-1 min-w-[140px] ${
        isDark
          ? "bg-slate-800/80 border-slate-700/80"
          : "bg-white/80 backdrop-blur-sm border-gray-100/80"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-medium uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold mt-1 group-hover:scale-105 transition-transform origin-left ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const ConfigToggle = ({
  label,
  description,
  defaultChecked = false,
  checked,
  onChange,
  theme,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const isDark = theme === "dark";

  const handleToggle = () => {
    const newValue = !isChecked;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalChecked(newValue);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition ${
        isDark
          ? "bg-slate-800/80 border-slate-700/80 hover:border-slate-600"
          : "bg-white/80 border-gray-100/80 hover:border-blue-200"
      }`}
    >
      <div>
        <p
          className={`font-medium ${isDark ? "text-slate-200" : "text-gray-700"}`}
        >
          {label}
        </p>
        {description && (
          <p
            className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}
          >
            {description}
          </p>
        )}
      </div>
      <div
        onClick={handleToggle}
        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
          isChecked ? "bg-blue-600" : isDark ? "bg-slate-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            isChecked ? "translate-x-6" : ""
          }`}
        />
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const Configuracoes = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    primaryColor,
    setPrimaryColor,
  } = useTheme();
  const { modoSenior, setModoSenior, altoContraste, setAltoContraste } =
    useAccessibility();

  const [abaAtiva, setAbaAtiva] = useState("geral");
  const isDark = theme === "dark";

  // Notificações
  const [notifications, setNotifications] = useState({
    agendamentos: true,
    filas: true,
    vacinas: false,
    somChamada: false,
    lembretes: true,
  });

  // Preferências gerais
  const [idioma, setIdioma] = useState(i18n.language || "pt");
  const [formatoData, setFormatoData] = useState("dd/MM/yyyy");
  const [fonteSistema, setFonteSistema] = useState("Inter");

  // Admin
  const [ubsList, setUbsList] = useState([
    { id: 1, nome: "UBS Central", endereco: "Rua Domingos Vieira, 100" },
    { id: 2, nome: "UBS Vila da Penha", endereco: "Av. JK, 500" },
  ]);
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Carlos Atendente",
      email: "atendente@ubs.com",
      role: "atendente",
    },
    {
      id: 2,
      nome: "Maria Paciente",
      email: "paciente@email.com",
      role: "paciente",
    },
  ]);
  const [medicosList, setMedicosList] = useState([
    { id: 1, nome: "Dra. Ana Paula", especialidade: "Clínica Geral" },
    { id: 2, nome: "Dr. Carlos Eduardo", especialidade: "Cardiologia" },
    { id: 3, nome: "Dr. Paulo Roberto", especialidade: "Pediatria" },
  ]);
  const [parametroSistema, setParametroSistema] = useState({
    tempoMaximoEspera: 30,
    permitirAutoAgendamento: true,
    notificarAltaDemanda: true,
    filaPrioritariaAutomatica: true,
  });

  const coresPreset = [
    { nome: "Azul SUS", valor: "#0057B8" },
    { nome: "Verde Saúde", valor: "#2e7d32" },
    { nome: "Roxo Acessível", valor: "#6a1b9a" },
    { nome: "Laranja", valor: "#e65100" },
    { nome: "Vermelho", valor: "#b71c1c" },
  ];

  const fontesDisponiveis = [
    "Inter",
    "Roboto",
    "Poppins",
    "Nunito",
    "Open Sans",
  ];

  // Abas
  const abasBase = [
    { id: "geral", label: t("configuracoes.abas.geral"), icon: FaCog },
    {
      id: "painel",
      label: t("configuracoes.abas.painel"),
      icon: FaTachometerAlt,
    },
    { id: "filas", label: t("configuracoes.abas.filas"), icon: FaListAlt },
    {
      id: "agendamento",
      label: t("configuracoes.abas.agendamento"),
      icon: FaCalendarAlt,
    },
    {
      id: "historico",
      label: t("configuracoes.abas.historico"),
      icon: FaHistory,
    },
    { id: "vacinas", label: t("configuracoes.abas.vacinas"), icon: FaSyringe },
    {
      id: "seguranca",
      label: t("configuracoes.abas.seguranca"),
      icon: FaUserLock,
    },
  ];
  if (user?.role === "admin") {
    abasBase.push({
      id: "admin",
      label: t("configuracoes.abas.admin"),
      icon: FaShieldAlt,
    });
  }
  const abas = abasBase;

  // ============================================================
  // MODAL PREMIUM
  // ============================================================
  const showPremiumModal = ({
    title,
    html,
    preConfirm,
    confirmText = "Salvar",
    cancelText = "Cancelar",
    icon = null,
    showCancel = true,
    width = 580,
  }) => {
    return Swal.fire({
      title,
      html,
      icon,
      showCancelButton: showCancel,
      confirmButtonColor: "#1e293b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      width,
      padding: "1.8rem",
      backdrop: "rgba(0,0,0,0.4)",
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        title: "text-2xl font-bold text-gray-800",
        confirmButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow-sm transition-all",
        cancelButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
        input:
          "rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      },
      preConfirm,
    });
  };

  // ============================================================
  // FUNÇÕES DE NOTIFICAÇÃO
  // ============================================================
  const handleNotifChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    const labelMap = {
      agendamentos: t("configuracoes.notificacoes.agendamentos_label"),
      filas: t("configuracoes.notificacoes.filas_label"),
      vacinas: t("configuracoes.notificacoes.vacinas_label"),
      somChamada: t("configuracoes.notificacoes.somChamada_label"),
      lembretes: t("configuracoes.notificacoes.lembretes_label"),
    };
    Swal.fire({
      icon: "success",
      title: notifications[key]
        ? t("configuracoes.notificacoes.desativado")
        : t("configuracoes.notificacoes.ativado"),
      text: `${labelMap[key]} ${notifications[key] ? t("configuracoes.notificacoes.desativados") : t("configuracoes.notificacoes.ativados")}.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  // ============================================================
  // CRUD ADMIN (UBS)
  // ============================================================
  const handleAddUBS = () => {
    showPremiumModal({
      title: t("configuracoes.admin.ubs.adicionar_titulo"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.ubs.nome")} <span class="text-red-500">*</span></label>
            <input id="swal-nome" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.admin.ubs.nome_placeholder")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.ubs.endereco")} <span class="text-red-500">*</span></label>
            <input id="swal-endereco" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.admin.ubs.endereco_placeholder")}" />
          </div>
          <p class="text-xs text-gray-400">* ${t("configuracoes.admin.campos_obrigatorios")}</p>
        </div>
      `,
      confirmText: t("configuracoes.admin.adicionar"),
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value.trim();
        const endereco = document.getElementById("swal-endereco").value.trim();
        if (!nome || !endereco) {
          Swal.showValidationMessage(t("configuracoes.admin.preencha_campos"));
          return;
        }
        return { nome, endereco };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUbsList((prev) => [...prev, { id: Date.now(), ...result.value }]);
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.ubs.adicionada"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleRemoveUBS = (ubs) => {
    Swal.fire({
      title: t("configuracoes.admin.exclusao_segura"),
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-600">${t("configuracoes.admin.digite_senha_remover")} <strong>${ubs.nome}</strong>:</p>
          <input id="swal-senha" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" type="password" placeholder="${t("configuracoes.admin.senha_autorizacao")}" />
        </div>
      `,
      focusConfirm: false,
      confirmText: t("configuracoes.admin.remover"),
      cancelText: t("configuracoes.admin.cancelar"),
      confirmButtonColor: "#dc2626",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage(t("configuracoes.admin.senha_incorreta"));
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUbsList((prev) => prev.filter((u) => u.id !== ubs.id));
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.removida"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // ============================================================
  // CRUD USUÁRIOS
  // ============================================================
  const handleAddUsuario = () => {
    showPremiumModal({
      title: t("configuracoes.admin.usuarios.adicionar_titulo"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.usuarios.nome")} <span class="text-red-500">*</span></label>
            <input id="swal-nome" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.admin.usuarios.nome_placeholder")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.usuarios.email")} <span class="text-red-500">*</span></label>
            <input id="swal-email" type="email" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.admin.usuarios.email_placeholder")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.usuarios.perfil")}</label>
            <select id="swal-role" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white">
              <option value="admin">${t("configuracoes.admin.usuarios.perfil_admin")}</option>
              <option value="atendente">${t("configuracoes.admin.usuarios.perfil_atendente")}</option>
              <option value="paciente">${t("configuracoes.admin.usuarios.perfil_paciente")}</option>
            </select>
          </div>
          <p class="text-xs text-gray-400">* ${t("configuracoes.admin.campos_obrigatorios")}</p>
        </div>
      `,
      confirmText: t("configuracoes.admin.adicionar"),
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const role = document.getElementById("swal-role").value;
        if (!nome || !email) {
          Swal.showValidationMessage(t("configuracoes.admin.preencha_campos"));
          return;
        }
        return { nome, email, role };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUsuarios((prev) => [...prev, { id: Date.now(), ...result.value }]);
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.usuarios.adicionado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleEditUsuario = (usuario) => {
    showPremiumModal({
      title: t("configuracoes.admin.usuarios.editar_titulo"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.usuarios.nome")} <span class="text-red-500">*</span></label>
            <input id="swal-nome" value="${usuario.nome}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.usuarios.email")} <span class="text-red-500">*</span></label>
            <input id="swal-email" type="email" value="${usuario.email}" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.usuarios.perfil")}</label>
            <select id="swal-role" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white">
              <option value="admin" ${usuario.role === "admin" ? "selected" : ""}>${t("configuracoes.admin.usuarios.perfil_admin")}</option>
              <option value="atendente" ${usuario.role === "atendente" ? "selected" : ""}>${t("configuracoes.admin.usuarios.perfil_atendente")}</option>
              <option value="paciente" ${usuario.role === "paciente" ? "selected" : ""}>${t("configuracoes.admin.usuarios.perfil_paciente")}</option>
            </select>
          </div>
          <p class="text-xs text-gray-400">* ${t("configuracoes.admin.campos_obrigatorios")}</p>
        </div>
      `,
      confirmText: t("configuracoes.admin.salvar"),
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const role = document.getElementById("swal-role").value;
        if (!nome || !email) {
          Swal.showValidationMessage(t("configuracoes.admin.preencha_campos"));
          return;
        }
        return { nome, email, role };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === usuario.id ? { ...u, ...result.value } : u,
          ),
        );
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.atualizado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleRemoveUsuario = (usuario) => {
    Swal.fire({
      title: t("configuracoes.admin.exclusao_segura"),
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-600">${t("configuracoes.admin.digite_senha_remover")} <strong>${usuario.nome}</strong>:</p>
          <input id="swal-senha" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" type="password" placeholder="${t("configuracoes.admin.senha_autorizacao")}" />
        </div>
      `,
      focusConfirm: false,
      confirmText: t("configuracoes.admin.remover"),
      cancelText: t("configuracoes.admin.cancelar"),
      confirmButtonColor: "#dc2626",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage(t("configuracoes.admin.senha_incorreta"));
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.removido"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // ============================================================
  // CRUD MÉDICOS
  // ============================================================
  const handleAddMedico = () => {
    showPremiumModal({
      title: t("configuracoes.admin.medicos.adicionar_titulo"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.medicos.nome")} <span class="text-red-500">*</span></label>
            <input id="swal-nome" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.admin.medicos.nome_placeholder")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.admin.medicos.especialidade")} <span class="text-red-500">*</span></label>
            <input id="swal-especialidade" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.admin.medicos.especialidade_placeholder")}" />
          </div>
          <p class="text-xs text-gray-400">* ${t("configuracoes.admin.campos_obrigatorios")}</p>
        </div>
      `,
      confirmText: t("configuracoes.admin.adicionar"),
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value.trim();
        const especialidade = document
          .getElementById("swal-especialidade")
          .value.trim();
        if (!nome || !especialidade) {
          Swal.showValidationMessage(t("configuracoes.admin.preencha_campos"));
          return;
        }
        return { nome, especialidade };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setMedicosList((prev) => [
          ...prev,
          { id: Date.now(), ...result.value },
        ]);
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.medicos.adicionado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleRemoveMedico = (medico) => {
    Swal.fire({
      title: t("configuracoes.admin.exclusao_segura"),
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-600">${t("configuracoes.admin.digite_senha_remover")} <strong>${medico.nome}</strong>:</p>
          <input id="swal-senha" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" type="password" placeholder="${t("configuracoes.admin.senha_autorizacao")}" />
        </div>
      `,
      focusConfirm: false,
      confirmText: t("configuracoes.admin.remover"),
      cancelText: t("configuracoes.admin.cancelar"),
      confirmButtonColor: "#dc2626",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage(t("configuracoes.admin.senha_incorreta"));
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setMedicosList((prev) => prev.filter((m) => m.id !== medico.id));
        Swal.fire({
          icon: "success",
          title: t("configuracoes.admin.removido"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // ============================================================
  // FUNÇÕES DE SEGURANÇA E RESTAURAÇÃO
  // ============================================================
  const alterarSenha = () => {
    showPremiumModal({
      title: t("configuracoes.seguranca.alterar_senha"),
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.seguranca.senha_atual")}</label>
            <input id="senha-atual" type="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.seguranca.senha_atual")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.seguranca.nova_senha")}</label>
            <input id="nova-senha" type="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.seguranca.nova_senha")}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">${t("configuracoes.seguranca.confirmar_senha")}</label>
            <input id="confirma-senha" type="password" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" placeholder="${t("configuracoes.seguranca.confirmar_senha")}" />
          </div>
          <p class="text-xs text-gray-400">${t("configuracoes.seguranca.senha_minimo")}</p>
        </div>
      `,
      confirmText: t("configuracoes.seguranca.alterar"),
      preConfirm: () => {
        const atual = document.getElementById("senha-atual").value;
        const nova = document.getElementById("nova-senha").value;
        const confirma = document.getElementById("confirma-senha").value;
        if (!atual || !nova || !confirma) {
          Swal.showValidationMessage(t("configuracoes.admin.preencha_campos"));
          return false;
        }
        if (nova.length < 6) {
          Swal.showValidationMessage(
            t("configuracoes.seguranca.senha_minimo_erro"),
          );
          return false;
        }
        if (nova !== confirma) {
          Swal.showValidationMessage(
            t("configuracoes.seguranca.senhas_nao_coincidem"),
          );
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: "success",
          title: t("configuracoes.seguranca.senha_alterada"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const restaurarPadroes = () => {
    Swal.fire({
      title: t("configuracoes.restaurar.titulo"),
      text: t("configuracoes.restaurar.descricao"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("configuracoes.restaurar.confirmar"),
      cancelButtonText: t("configuracoes.restaurar.cancelar"),
      customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        confirmButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all",
        cancelButton:
          "px-6 py-2.5 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setTheme("light");
        setFontSize(100);
        setPrimaryColor("#0057B8");
        setIdioma("pt");
        i18n.changeLanguage("pt");
        setFormatoData("dd/MM/yyyy");
        setFonteSistema("Inter");
        setNotifications({
          agendamentos: true,
          filas: true,
          vacinas: false,
          somChamada: false,
          lembretes: true,
        });
        setModoSenior(false);
        setAltoContraste(false);
        Swal.fire({
          icon: "success",
          title: t("configuracoes.restaurar.restaurado"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const salvarConfiguracoes = () => {
    Swal.fire({
      icon: "success",
      title: t("configuracoes.salvar.salvo"),
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // ============================================================
  // HEADER SECTION
  // ============================================================
  const HeaderSection = () => {
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <FaHome className="w-4 h-4" />
              <span>Dashboard</span>
              <HiChevronDoubleLeft className="w-3 h-3 rotate-180" />
              <span className="text-white font-medium">
                {t("configuracoes.titulo")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2">
              <FaCog className="w-7 h-7" />
              {t("configuracoes.titulo")}
            </h1>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
              <span>{t("configuracoes.subtitulo")}</span>
              <span className="w-1 h-1 rounded-full bg-white/30"></span>
              <span>{dataFormatada}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              {user?.nome?.charAt(0) || "A"}
            </div>
            <div className="text-white text-sm">
              <p className="font-medium">{user?.nome || "Admin"}</p>
              <p className="text-white/70 text-xs">Administrador</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    );
  };

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================
  return (
    <div
      className={`min-h-screen p-4 md:p-6 lg:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderSection />

        {/* Métricas */}
        <div className="flex flex-wrap gap-4">
          <MetricCard
            title={t("configuracoes.metricas.unidades")}
            value={ubsList.length}
            icon={FaBuilding}
            color="blue"
            theme={theme}
          />
          <MetricCard
            title={t("configuracoes.metricas.usuarios")}
            value={usuarios.length}
            icon={HiUsers}
            color="green"
            theme={theme}
          />
          <MetricCard
            title={t("configuracoes.metricas.medicos")}
            value={medicosList.length}
            icon={FaStethoscope}
            color="teal"
            theme={theme}
          />
          <MetricCard
            title={t("configuracoes.metricas.tema")}
            value={
              theme === "light"
                ? t("configuracoes.geral.claro")
                : t("configuracoes.geral.escuro")
            }
            icon={theme === "light" ? FaRegSun : FaRegMoon}
            color="amber"
            theme={theme}
          />
          <MetricCard
            title={t("configuracoes.metricas.fonte")}
            value={fonteSistema}
            icon={FaFont}
            color="indigo"
            theme={theme}
          />
        </div>

        {/* Abas */}
        <div
          className={`rounded-3xl border shadow-xl p-1.5 overflow-x-auto ${
            isDark
              ? "bg-slate-800/80 border-slate-700/80"
              : "bg-white/80 backdrop-blur-sm border-gray-100/80"
          }`}
        >
          <div className="flex flex-nowrap gap-1 min-w-max">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  abaAtiva === aba.id
                    ? "bg-slate-700 text-white shadow-md scale-105"
                    : isDark
                      ? "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <aba.icon size={18} />
                <span>{aba.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das abas */}
        <div
          className={`rounded-3xl border shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all ${
            isDark
              ? "bg-slate-800/80 border-slate-700/80"
              : "bg-white/80 backdrop-blur-sm border-gray-100/80"
          }`}
        >
          {/* Aba Geral */}
          {abaAtiva === "geral" && (
            <div className="space-y-10">
              {/* Aparência */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FaPalette className="text-blue-600" />{" "}
                  {t("configuracoes.geral.aparencia")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tema */}
                  <div
                    className={`rounded-xl p-5 shadow-sm border ${
                      isDark
                        ? "bg-slate-700/50 border-slate-600/50"
                        : "bg-white/80 border-gray-100/80"
                    }`}
                  >
                    <label
                      className={`block font-semibold mb-3 ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.geral.tema")}
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                          theme === "light"
                            ? "bg-slate-700 text-white shadow-md"
                            : isDark
                              ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaRegSun /> {t("configuracoes.geral.claro")}
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                          theme === "dark"
                            ? "bg-slate-700 text-white shadow-md"
                            : isDark
                              ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaRegMoon /> {t("configuracoes.geral.escuro")}
                      </button>
                    </div>
                  </div>

                  {/* Fonte */}
                  <div
                    className={`rounded-xl p-5 shadow-sm border ${
                      isDark
                        ? "bg-slate-700/50 border-slate-600/50"
                        : "bg-white/80 border-gray-100/80"
                    }`}
                  >
                    <label
                      className={`block font-semibold mb-3 ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      <FaFont className="inline mr-2 text-blue-600" />
                      {t("configuracoes.geral.fonte")}
                    </label>
                    <select
                      value={fonteSistema}
                      onChange={(e) => setFonteSistema(e.target.value)}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-slate-200"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {fontesDisponiveis.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tamanho da fonte */}
                <div
                  className={`mt-6 rounded-xl p-5 shadow-sm border ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50"
                      : "bg-white/80 border-gray-100/80"
                  }`}
                >
                  <div
                    className={`flex justify-between items-center mb-3 ${
                      isDark ? "text-slate-200" : "text-gray-700"
                    }`}
                  >
                    <span className="font-semibold">
                      <FaFont className="inline mr-2 text-blue-600" />
                      {t("configuracoes.geral.tamanhoFonte")}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        isDark
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {fontSize}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    step="5"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        ((fontSize - 20) / (180 - 20)) * 100
                      }%, ${isDark ? "#475569" : "#e5e7eb"} ${
                        ((fontSize - 20) / (180 - 20)) * 100
                      }%, ${isDark ? "#475569" : "#e5e7eb"} 100%)`,
                    }}
                  />
                  <div
                    className={`flex justify-between text-xs mt-2 ${
                      isDark ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    <span>20%</span>
                    <span className="font-bold text-blue-700">100%</span>
                    <span>180%</span>
                  </div>
                  <div
                    className={`mt-4 p-4 rounded-xl border text-center transition-all ${
                      isDark
                        ? "bg-slate-700/30 border-slate-600/50"
                        : "bg-gray-50/60 border-gray-200"
                    }`}
                  >
                    <p
                      className={isDark ? "text-slate-200" : "text-gray-700"}
                      style={{
                        fontSize: `${fontSize}%`,
                        fontFamily: fonteSistema,
                      }}
                    >
                      {t("configuracoes.geral.previsualizacao_texto")}{" "}
                      {fontSize} {t("configuracoes.geral.de_tamanho")}
                    </p>
                  </div>
                </div>

                {/* Cor principal */}
                <div
                  className={`mt-6 rounded-xl p-5 shadow-sm border ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50"
                      : "bg-white/80 border-gray-100/80"
                  }`}
                >
                  <p
                    className={`font-semibold mb-4 ${
                      isDark ? "text-slate-200" : "text-gray-700"
                    }`}
                  >
                    <FaPalette className="inline mr-2 text-blue-600" />
                    {t("configuracoes.geral.corPrincipal")}
                  </p>
                  <div className="flex gap-4 flex-wrap items-center">
                    {coresPreset.map((cor) => (
                      <button
                        key={cor.valor}
                        onClick={() => setPrimaryColor(cor.valor)}
                        className={`w-12 h-12 rounded-full border-3 transition-all ${
                          primaryColor === cor.valor
                            ? "border-gray-900 scale-110 shadow-lg ring-2 ring-blue-500"
                            : isDark
                              ? "border-slate-600 hover:scale-105"
                              : "border-white hover:scale-105"
                        }`}
                        style={{ backgroundColor: cor.valor }}
                        title={cor.nome}
                      />
                    ))}
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className={`w-12 h-12 rounded-full border cursor-pointer ${
                        isDark ? "bg-slate-700 border-slate-600" : "bg-white"
                      }`}
                    />
                  </div>
                </div>
              </section>

              {/* Preferências Regionais */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FaGlobe className="text-blue-600" />{" "}
                  {t("configuracoes.geral.preferenciasRegionais")}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className={`rounded-xl p-5 shadow-sm border ${
                      isDark
                        ? "bg-slate-700/50 border-slate-600/50"
                        : "bg-white/80 border-gray-100/80"
                    }`}
                  >
                    <label
                      className={`block font-semibold mb-2 ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.geral.idioma")}
                    </label>
                    <select
                      value={idioma}
                      onChange={(e) => {
                        const novoIdioma = e.target.value;
                        setIdioma(novoIdioma);
                        i18n.changeLanguage(novoIdioma);
                        Swal.fire({
                          icon: "success",
                          title: t("configuracoes.idioma_alterado"),
                          text: `${t("configuracoes.idioma_selecionado")}: ${
                            novoIdioma === "pt"
                              ? "Português"
                              : novoIdioma === "en"
                                ? "English"
                                : "Español"
                          }`,
                          toast: true,
                          position: "top-end",
                          showConfirmButton: false,
                          timer: 2000,
                          timerProgressBar: true,
                        });
                      }}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-slate-200"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="pt">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                    <div
                      className={`mt-2 text-xs ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.geral.idioma_atual")}:{" "}
                      {idioma === "pt"
                        ? "Português"
                        : idioma === "en"
                          ? "English"
                          : "Español"}
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-5 shadow-sm border ${
                      isDark
                        ? "bg-slate-700/50 border-slate-600/50"
                        : "bg-white/80 border-gray-100/80"
                    }`}
                  >
                    <label
                      className={`block font-semibold mb-2 ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.geral.formatoData")}
                    </label>
                    <select
                      value={formatoData}
                      onChange={(e) => {
                        setFormatoData(e.target.value);
                        const hoje = new Date();
                        let dataFormatada = "";
                        switch (e.target.value) {
                          case "dd/MM/yyyy":
                            dataFormatada = hoje.toLocaleDateString("pt-BR");
                            break;
                          case "MM/dd/yyyy":
                            dataFormatada = `${String(hoje.getMonth() + 1).padStart(2, "0")}/${String(hoje.getDate()).padStart(2, "0")}/${hoje.getFullYear()}`;
                            break;
                          case "yyyy-MM-dd":
                            dataFormatada = hoje.toISOString().split("T")[0];
                            break;
                          default:
                            dataFormatada = hoje.toLocaleDateString("pt-BR");
                        }
                        Swal.fire({
                          icon: "success",
                          title: t("configuracoes.formato_alterado"),
                          text: `${t("configuracoes.exemplo")}: ${dataFormatada}`,
                          toast: true,
                          position: "top-end",
                          showConfirmButton: false,
                          timer: 2000,
                          timerProgressBar: true,
                        });
                      }}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-slate-200"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                      <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                    </select>
                    <div
                      className={`mt-3 text-sm ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.data_atual")}:{" "}
                      {(() => {
                        const hoje = new Date();
                        switch (formatoData) {
                          case "dd/MM/yyyy":
                            return hoje.toLocaleDateString("pt-BR");
                          case "MM/dd/yyyy":
                            return `${String(hoje.getMonth() + 1).padStart(2, "0")}/${String(hoje.getDate()).padStart(2, "0")}/${hoje.getFullYear()}`;
                          case "yyyy-MM-dd":
                            return hoje.toISOString().split("T")[0];
                          default:
                            return hoje.toLocaleDateString("pt-BR");
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </section>

              {/* Notificações */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FaBell className="text-blue-600" />{" "}
                  {t("configuracoes.geral.notificacoes")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition ${
                        isDark
                          ? "bg-slate-700/50 border-slate-600/50 hover:border-slate-500"
                          : "bg-white/80 border-gray-100/80 hover:border-blue-200"
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          isDark ? "text-slate-200" : "text-gray-700"
                        } capitalize`}
                      >
                        {key === "agendamentos" &&
                          t("configuracoes.notificacoes.agendamentos_label")}
                        {key === "filas" &&
                          t("configuracoes.notificacoes.filas_label")}
                        {key === "vacinas" &&
                          t("configuracoes.notificacoes.vacinas_label")}
                        {key === "somChamada" &&
                          t("configuracoes.notificacoes.somChamada_label")}
                        {key === "lembretes" &&
                          t("configuracoes.notificacoes.lembretes_label")}
                      </span>
                      <button
                        onClick={() => handleNotifChange(key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          value
                            ? "bg-blue-600"
                            : isDark
                              ? "bg-slate-600"
                              : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            value ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Acessibilidade */}
              <section className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaEye className="text-white/80" />{" "}
                  {t("configuracoes.geral.acessibilidade")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-sm p-5 rounded-xl cursor-pointer transition text-white">
                    <div>
                      <p className="font-medium">
                        {t("configuracoes.geral.modoSenior")}
                      </p>
                      <p className="text-xs opacity-80">
                        {t("configuracoes.geral.modoSeniorDesc")}
                      </p>
                    </div>
                    <button
                      onClick={() => setModoSenior(!modoSenior)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        modoSenior ? "bg-white" : "bg-white/30"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-blue-600 rounded-full transition-transform ${
                          modoSenior ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </label>
                  <label className="flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-sm p-5 rounded-xl cursor-pointer transition text-white">
                    <div>
                      <p className="font-medium">
                        {t("configuracoes.geral.altoContraste")}
                      </p>
                      <p className="text-xs opacity-80">
                        {t("configuracoes.geral.altoContrasteDesc")}
                      </p>
                    </div>
                    <button
                      onClick={() => setAltoContraste(!altoContraste)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        altoContraste ? "bg-white" : "bg-white/30"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-blue-600 rounded-full transition-transform ${
                          altoContraste ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </section>
            </div>
          )}

          {/* Painel */}
          {abaAtiva === "painel" && (
            <div>
              <h2
                className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaTachometerAlt className="text-blue-600" />{" "}
                {t("configuracoes.abas.painel")}
              </h2>
              <div className="space-y-4">
                <ConfigToggle
                  label={t("configuracoes.painel.visao_geral")}
                  description={t("configuracoes.painel.visao_geral_desc")}
                  defaultChecked
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.painel.notificacoes")}
                  description={t("configuracoes.painel.notificacoes_desc")}
                  defaultChecked
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.painel.widget_metricas")}
                  description={t("configuracoes.painel.widget_metricas_desc")}
                  defaultChecked
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Filas */}
          {abaAtiva === "filas" && (
            <div>
              <h2
                className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaListAlt className="text-blue-600" />{" "}
                {t("configuracoes.abas.filas")}
              </h2>
              <div className="space-y-5">
                <div
                  className={`rounded-xl p-5 border ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50"
                      : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                  }`}
                >
                  <label
                    className={`block font-medium mb-3 ${
                      isDark ? "text-slate-200" : "text-gray-700"
                    }`}
                  >
                    {t("configuracoes.filas.tempo_espera")}
                  </label>
                  <select
                    className={`p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-slate-200"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option>5 {t("configuracoes.filas.minutos")}</option>
                    <option>10 {t("configuracoes.filas.minutos")}</option>
                    <option selected>
                      15 {t("configuracoes.filas.minutos")}
                    </option>
                  </select>
                </div>
                <ConfigToggle
                  label={t("configuracoes.filas.exibir_posicao")}
                  defaultChecked
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.filas.notificar_proximo")}
                  defaultChecked
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Agendamento */}
          {abaAtiva === "agendamento" && (
            <div>
              <h2
                className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaCalendarAlt className="text-blue-600" />{" "}
                {t("configuracoes.abas.agendamento")}
              </h2>
              <div className="space-y-5">
                <div
                  className={`rounded-xl p-5 border ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50"
                      : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                  }`}
                >
                  <label
                    className={`block font-medium mb-3 ${
                      isDark ? "text-slate-200" : "text-gray-700"
                    }`}
                  >
                    {t("configuracoes.agendamento.dias_antecedencia")}
                  </label>
                  <select
                    className={`p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-slate-200"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option>30 {t("configuracoes.agendamento.dias")}</option>
                    <option selected>
                      60 {t("configuracoes.agendamento.dias")}
                    </option>
                    <option>90 {t("configuracoes.agendamento.dias")}</option>
                  </select>
                </div>
                <ConfigToggle
                  label={t("configuracoes.agendamento.reagendamento_online")}
                  defaultChecked
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.agendamento.lembrete_email")}
                  defaultChecked
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Histórico */}
          {abaAtiva === "historico" && (
            <div>
              <h2
                className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaHistory className="text-blue-600" />{" "}
                {t("configuracoes.abas.historico")}
              </h2>
              <div className="space-y-4">
                <ConfigToggle
                  label={t("configuracoes.historico.compartilhar_ubs")}
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.historico.manter_indeterminado")}
                  defaultChecked
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.historico.exportar_csv")}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Vacinas */}
          {abaAtiva === "vacinas" && (
            <div>
              <h2
                className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaSyringe className="text-blue-600" />{" "}
                {t("configuracoes.abas.vacinas")}
              </h2>
              <div className="space-y-5">
                <div
                  className={`rounded-xl p-5 border ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50"
                      : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                  }`}
                >
                  <label
                    className={`block font-medium mb-3 ${
                      isDark ? "text-slate-200" : "text-gray-700"
                    }`}
                  >
                    {t("configuracoes.vacinas.lembrete_campanhas")}
                  </label>
                  <select
                    className={`p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-slate-200"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option>1 {t("configuracoes.vacinas.semana_antes")}</option>
                    <option selected>
                      2 {t("configuracoes.vacinas.semanas_antes")}
                    </option>
                    <option>1 {t("configuracoes.vacinas.mes_antes")}</option>
                  </select>
                </div>
                <ConfigToggle
                  label={t("configuracoes.vacinas.notificar_estoque_baixo")}
                  defaultChecked
                  theme={theme}
                />
                <ConfigToggle
                  label={t("configuracoes.vacinas.alertar_vencendo")}
                  defaultChecked
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Segurança */}
          {abaAtiva === "seguranca" && (
            <div>
              <h2
                className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaUserLock className="text-blue-600" />{" "}
                {t("configuracoes.abas.seguranca")}
              </h2>
              <div className="space-y-6">
                <div
                  className={`flex flex-wrap justify-between items-center p-5 rounded-xl border gap-4 transition ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50 hover:border-slate-500"
                      : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80 hover:border-blue-200"
                  }`}
                >
                  <div>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.seguranca.alterar_senha")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.seguranca.alterar_senha_desc")}
                    </p>
                  </div>
                  <button
                    onClick={alterarSenha}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm"
                  >
                    {t("configuracoes.seguranca.alterar")}
                  </button>
                </div>
                <div
                  className={`flex flex-wrap justify-between items-center p-5 rounded-xl border gap-4 transition ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50 hover:border-red-800"
                      : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80 hover:border-red-200"
                  }`}
                >
                  <div>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.seguranca.encerrar_sessoes")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.seguranca.encerrar_sessoes_desc")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "success",
                        title: t("configuracoes.seguranca.sessoes_encerradas"),
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }}
                    className="border border-red-500 text-red-500 px-6 py-2.5 rounded-xl font-medium hover:bg-red-50 transition"
                  >
                    {t("configuracoes.seguranca.encerrar")}
                  </button>
                </div>
                <div
                  className={`flex flex-wrap justify-between items-center p-5 rounded-xl border gap-4 ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50"
                      : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                  }`}
                >
                  <div>
                    <p
                      className={`font-semibold ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.seguranca.autenticacao_dois_fatores")}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t(
                        "configuracoes.seguranca.autenticacao_dois_fatores_desc",
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "info",
                        title: t("configuracoes.seguranca.em_breve"),
                        text: t("configuracoes.seguranca.em_breve_texto"),
                        confirmButtonColor: "#1e293b",
                      });
                    }}
                    className={`px-6 py-2.5 rounded-xl font-medium transition ${
                      isDark
                        ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {t("configuracoes.seguranca.configurar")}
                  </button>
                </div>
                <div
                  className={`text-xs mt-4 ${
                    isDark ? "text-slate-400" : "text-gray-400"
                  }`}
                >
                  * {t("configuracoes.seguranca.funcionalidades_simuladas")}
                </div>
              </div>
            </div>
          )}

          {/* Admin */}
          {abaAtiva === "admin" && user?.role === "admin" && (
            <div className="space-y-10">
              {/* Unidades */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold flex items-center gap-3 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <FaBuilding className="text-blue-600" />{" "}
                    {t("configuracoes.admin.ubs.titulo")}
                  </h2>
                  <button
                    onClick={handleAddUBS}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
                  >
                    <FaPlus /> {t("configuracoes.admin.adicionar")}
                  </button>
                </div>
                <div className="space-y-3">
                  {ubsList.length === 0 ? (
                    <p
                      className={`text-center py-6 ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.admin.ubs.nenhuma")}
                    </p>
                  ) : (
                    ubsList.map((ubs) => (
                      <div
                        key={ubs.id}
                        className={`flex flex-wrap justify-between items-center p-4 rounded-xl border transition ${
                          isDark
                            ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                            : "bg-white/80 border-gray-100/80 hover:border-blue-200"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-medium ${
                              isDark ? "text-slate-200" : "text-gray-800"
                            }`}
                          >
                            {ubs.nome}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            {ubs.endereco}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveUBS(ubs)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FaTrash size={14} />{" "}
                          {t("configuracoes.admin.remover")}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Usuários */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold flex items-center gap-3 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <FaUsersCog className="text-blue-600" />{" "}
                    {t("configuracoes.admin.usuarios.titulo")}
                  </h2>
                  <button
                    onClick={handleAddUsuario}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
                  >
                    <FaPlus /> {t("configuracoes.admin.adicionar")}
                  </button>
                </div>
                <div className="space-y-3">
                  {usuarios.length === 0 ? (
                    <p
                      className={`text-center py-6 ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.admin.usuarios.nenhum")}
                    </p>
                  ) : (
                    usuarios.map((us) => (
                      <div
                        key={us.id}
                        className={`flex flex-wrap justify-between items-center p-4 rounded-xl border gap-2 ${
                          isDark
                            ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                            : "bg-white/80 border-gray-100/80 hover:border-blue-200"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-medium ${
                              isDark ? "text-slate-200" : "text-gray-800"
                            }`}
                          >
                            {us.nome}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            {us.email} •{" "}
                            <span className="capitalize">{us.role}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUsuario(us)}
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
                          >
                            <FaEdit size={14} />{" "}
                            {t("configuracoes.admin.editar")}
                          </button>
                          <button
                            onClick={() => handleRemoveUsuario(us)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <FaTrash size={14} />{" "}
                            {t("configuracoes.admin.remover")}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Médicos */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`text-xl font-bold flex items-center gap-3 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <FaStethoscope className="text-blue-600" />{" "}
                    {t("configuracoes.admin.medicos.titulo")}
                  </h2>
                  <button
                    onClick={handleAddMedico}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
                  >
                    <FaPlus /> {t("configuracoes.admin.adicionar")}
                  </button>
                </div>
                <div className="space-y-3">
                  {medicosList.length === 0 ? (
                    <p
                      className={`text-center py-6 ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {t("configuracoes.admin.medicos.nenhum")}
                    </p>
                  ) : (
                    medicosList.map((med) => (
                      <div
                        key={med.id}
                        className={`flex flex-wrap justify-between items-center p-4 rounded-xl border transition ${
                          isDark
                            ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                            : "bg-white/80 border-gray-100/80 hover:border-blue-200"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-medium ${
                              isDark ? "text-slate-200" : "text-gray-800"
                            }`}
                          >
                            {med.nome}
                          </p>
                          <p
                            className={`text-sm ${
                              isDark ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            {med.especialidade}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveMedico(med)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FaTrash size={14} />{" "}
                          {t("configuracoes.admin.remover")}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Parâmetros Gerais */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FaCog className="text-blue-600" />{" "}
                  {t("configuracoes.admin.parametros.titulo")}
                </h2>
                <div className="space-y-5">
                  <div
                    className={`rounded-xl p-5 border ${
                      isDark
                        ? "bg-slate-800/50 border-slate-700/50"
                        : "bg-white/80 border-gray-100/80"
                    }`}
                  >
                    <label
                      className={`block font-medium mb-3 ${
                        isDark ? "text-slate-200" : "text-gray-700"
                      }`}
                    >
                      {t("configuracoes.admin.parametros.tempo_maximo")}
                    </label>
                    <input
                      type="number"
                      value={parametroSistema.tempoMaximoEspera}
                      onChange={(e) =>
                        setParametroSistema({
                          ...parametroSistema,
                          tempoMaximoEspera: parseInt(e.target.value) || 0,
                        })
                      }
                      className={`w-32 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-slate-200"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                  <ConfigToggle
                    label={t("configuracoes.admin.parametros.autoagendamento")}
                    checked={parametroSistema.permitirAutoAgendamento}
                    onChange={(checked) =>
                      setParametroSistema({
                        ...parametroSistema,
                        permitirAutoAgendamento: checked,
                      })
                    }
                    theme={theme}
                  />
                  <ConfigToggle
                    label={t("configuracoes.admin.parametros.fila_prioritaria")}
                    checked={parametroSistema.filaPrioritariaAutomatica}
                    onChange={(checked) =>
                      setParametroSistema({
                        ...parametroSistema,
                        filaPrioritariaAutomatica: checked,
                      })
                    }
                    theme={theme}
                  />
                  <ConfigToggle
                    label={t(
                      "configuracoes.admin.parametros.notificar_alta_demanda",
                    )}
                    checked={parametroSistema.notificarAltaDemanda}
                    onChange={(checked) =>
                      setParametroSistema({
                        ...parametroSistema,
                        notificarAltaDemanda: checked,
                      })
                    }
                    theme={theme}
                  />
                </div>
              </section>

              {/* Logs */}
              <section
                className={`rounded-2xl p-6 border ${
                  isDark
                    ? "bg-slate-700/50 border-slate-600/50"
                    : "bg-gray-50/60 backdrop-blur-sm border-gray-100/80"
                }`}
              >
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  <HiDocumentText className="text-blue-600" />{" "}
                  {t("configuracoes.admin.logs.titulo")}
                </h2>
                <div
                  className={`p-4 rounded-xl max-h-48 overflow-y-auto text-xs font-mono border ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700/50 text-slate-400"
                      : "bg-white/80 border-gray-100/80 text-gray-600"
                  }`}
                >
                  <p className="py-1">[2024-12-06 08:32] Admin fez login</p>
                  <p className="py-1">
                    [2024-12-06 08:35] Relatório de filas exportado
                  </p>
                  <p className="py-1">
                    [2024-12-06 09:10] Novo usuário cadastrado:
                    atendente2@ubs.com
                  </p>
                  <p className="py-1">
                    [2024-12-06 09:45] Sincronização com DataSUS concluída
                  </p>
                  <p className="py-1">
                    [2024-12-06 10:15] Configurações de vacinas atualizadas
                  </p>
                </div>
                <button
                  onClick={() => {
                    Swal.fire({
                      icon: "info",
                      title: t("configuracoes.admin.logs.download_titulo"),
                      text: t("configuracoes.admin.logs.download_desc"),
                      confirmButtonColor: "#1e293b",
                    });
                  }}
                  className="mt-4 text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
                >
                  <FaFileDownload size={14} />{" "}
                  {t("configuracoes.admin.logs.baixar")}
                </button>
              </section>

              {/* Backup */}
              <section
                className={`border rounded-2xl p-6 ${
                  isDark
                    ? "bg-amber-900/30 border-amber-700/50"
                    : "bg-amber-50/80 backdrop-blur-sm border-amber-200"
                }`}
              >
                <h3
                  className={`font-bold mb-4 flex items-center gap-3 ${
                    isDark ? "text-amber-300" : "text-amber-800"
                  }`}
                >
                  <FaShieldAlt /> {t("configuracoes.admin.backup.titulo")}
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "success",
                        title: t("configuracoes.admin.backup.gerado"),
                        text: t("configuracoes.admin.backup.gerado_texto"),
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }}
                    className={`px-6 py-2.5 rounded-xl font-medium transition shadow-sm ${
                      isDark
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    {t("configuracoes.admin.backup.gerar")}
                  </button>
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "info",
                        title: t("configuracoes.admin.backup.restaurar_titulo"),
                        text: t("configuracoes.admin.backup.restaurar_desc"),
                        confirmButtonColor: "#1e293b",
                      });
                    }}
                    className={`border px-6 py-2.5 rounded-xl font-medium transition ${
                      isDark
                        ? "border-amber-600 text-amber-400 hover:bg-amber-900/30"
                        : "border-amber-600 text-amber-600 hover:bg-amber-100"
                    }`}
                  >
                    {t("configuracoes.admin.backup.restaurar")}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* BOTÕES FLUTUANTES */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <button
            onClick={salvarConfiguracoes}
            className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title={t("configuracoes.salvar.titulo")}
          >
            <FaSave size={24} />
          </button>
          <button
            onClick={restaurarPadroes}
            className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title={t("configuracoes.restaurar.titulo")}
          >
            <FaUndo size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
