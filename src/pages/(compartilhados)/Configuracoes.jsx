// src/pages/(compartilhados)/Configuracoes.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { useAccessibility } from "../../contexts/AccessibilityContext";
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
  FaEyeSlash,
  FaUndo,
  FaSave,
  FaUserCircle,
  FaRegMoon,
  FaRegSun,
} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";

const Configuracoes = () => {
  const { user } = useAuth();
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

  // Notificações
  const [notifications, setNotifications] = useState({
    agendamentos: true,
    filas: true,
    vacinas: false,
    somChamada: false,
    lembretes: true,
  });

  // Preferências gerais
  const [idioma, setIdioma] = useState("pt-BR");
  const [formatoData, setFormatoData] = useState("dd/MM/yyyy");
  const [fonteSistema, setFonteSistema] = useState("Inter");

  // Estados para Admin
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

  // Fontes disponíveis
  const fontesDisponiveis = [
    "Inter",
    "Roboto",
    "Poppins",
    "Nunito",
    "Open Sans",
  ];

  // Abas
  const abasBase = [
    { id: "geral", label: "Geral", icon: FaCog },
    { id: "painel", label: "Painel", icon: FaTachometerAlt },
    { id: "filas", label: "Filas", icon: FaListAlt },
    { id: "agendamento", label: "Agendamento", icon: FaCalendarAlt },
    { id: "historico", label: "Histórico", icon: FaHistory },
    { id: "vacinas", label: "Vacinas", icon: FaSyringe },
    { id: "seguranca", label: "Segurança", icon: FaUserLock },
  ];
  if (user?.role === "admin") {
    abasBase.push({ id: "admin", label: "Administração", icon: FaShieldAlt });
  }
  const abas = abasBase;

  // ============================================================
  // FUNÇÕES DE NOTIFICAÇÃO
  // ============================================================
  const handleNotifChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    Swal.fire({
      icon: "success",
      title: "Notificação atualizada",
      text: `${key === "agendamentos" ? "Alertas de agendamento" : key === "filas" ? "Chamadas de fila" : key === "vacinas" ? "Vacinas" : key === "somChamada" ? "Som de chamada" : "Lembretes"} ${notifications[key] ? "desativados" : "ativados"}.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  // ============================================================
  // FUNÇÕES DE ADMIN (CRUD COM MODAIS E SENHA)
  // ============================================================
  const handleAddUBS = () => {
    Swal.fire({
      title: "Adicionar Unidade de Saúde",
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome da UBS" />
        <input id="swal-endereco" class="swal2-input" placeholder="Endereço" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value;
        const endereco = document.getElementById("swal-endereco").value;
        if (!nome || !endereco) {
          Swal.showValidationMessage("Preencha todos os campos.");
          return;
        }
        return { nome, endereco };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nova = {
          id: Date.now(),
          nome: result.value.nome,
          endereco: result.value.endereco,
        };
        setUbsList((prev) => [...prev, nova]);
        Swal.fire({
          icon: "success",
          title: "UBS adicionada!",
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
      title: "Exclusão segura",
      html: `
        <p>Digite a senha de autorização para remover <strong>${ubs.nome}</strong>:</p>
        <input id="swal-senha" class="swal2-input" type="password" placeholder="Senha de autorização" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remover",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage("Senha incorreta! Acesso negado.");
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUbsList((prev) => prev.filter((u) => u.id !== ubs.id));
        Swal.fire({
          icon: "success",
          title: "Removida!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleAddUsuario = () => {
    Swal.fire({
      title: "Adicionar Usuário",
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome completo" />
        <input id="swal-email" class="swal2-input" placeholder="E-mail" />
        <select id="swal-role" class="swal2-input">
          <option value="admin">Administrador</option>
          <option value="atendente">Atendente</option>
          <option value="paciente">Paciente</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value;
        const email = document.getElementById("swal-email").value;
        const role = document.getElementById("swal-role").value;
        if (!nome || !email) {
          Swal.showValidationMessage("Preencha todos os campos.");
          return;
        }
        return { nome, email, role };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const novo = {
          id: Date.now(),
          ...result.value,
        };
        setUsuarios((prev) => [...prev, novo]);
        Swal.fire({
          icon: "success",
          title: "Usuário adicionado!",
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
      title: "Exclusão segura",
      html: `
        <p>Digite a senha de autorização para remover <strong>${usuario.nome}</strong>:</p>
        <input id="swal-senha" class="swal2-input" type="password" placeholder="Senha de autorização" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remover",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage("Senha incorreta! Acesso negado.");
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
        Swal.fire({
          icon: "success",
          title: "Removido!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleEditUsuario = (usuario) => {
    Swal.fire({
      title: "Editar Usuário",
      html: `
        <input id="swal-nome" class="swal2-input" value="${usuario.nome}" placeholder="Nome completo" />
        <input id="swal-email" class="swal2-input" value="${usuario.email}" placeholder="E-mail" />
        <select id="swal-role" class="swal2-input">
          <option value="admin" ${usuario.role === "admin" ? "selected" : ""}>Administrador</option>
          <option value="atendente" ${usuario.role === "atendente" ? "selected" : ""}>Atendente</option>
          <option value="paciente" ${usuario.role === "paciente" ? "selected" : ""}>Paciente</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value;
        const email = document.getElementById("swal-email").value;
        const role = document.getElementById("swal-role").value;
        if (!nome || !email) {
          Swal.showValidationMessage("Preencha todos os campos.");
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
          title: "Atualizado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleAddMedico = () => {
    Swal.fire({
      title: "Adicionar Médico",
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome do médico" />
        <input id="swal-especialidade" class="swal2-input" placeholder="Especialidade" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nome = document.getElementById("swal-nome").value;
        const especialidade =
          document.getElementById("swal-especialidade").value;
        if (!nome || !especialidade) {
          Swal.showValidationMessage("Preencha todos os campos.");
          return;
        }
        return { nome, especialidade };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const novo = {
          id: Date.now(),
          nome: result.value.nome,
          especialidade: result.value.especialidade,
        };
        setMedicosList((prev) => [...prev, novo]);
        Swal.fire({
          icon: "success",
          title: "Médico adicionado!",
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
      title: "Exclusão segura",
      html: `
        <p>Digite a senha de autorização para remover <strong>${medico.nome}</strong>:</p>
        <input id="swal-senha" class="swal2-input" type="password" placeholder="Senha de autorização" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remover",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage("Senha incorreta! Acesso negado.");
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setMedicosList((prev) => prev.filter((m) => m.id !== medico.id));
        Swal.fire({
          icon: "success",
          title: "Removido!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const alterarSenha = () => {
    Swal.fire({
      title: "Alterar Senha",
      html: `
        <input id="senha-atual" type="password" class="swal2-input" placeholder="Senha atual" />
        <input id="nova-senha" type="password" class="swal2-input" placeholder="Nova senha (mínimo 6 caracteres)" />
        <input id="confirma-senha" type="password" class="swal2-input" placeholder="Confirmar nova senha" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Alterar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const atual = document.getElementById("senha-atual").value;
        const nova = document.getElementById("nova-senha").value;
        const confirma = document.getElementById("confirma-senha").value;
        if (!atual || !nova || !confirma) {
          Swal.showValidationMessage("Preencha todos os campos.");
          return false;
        }
        if (nova.length < 6) {
          Swal.showValidationMessage(
            "Nova senha deve ter no mínimo 6 caracteres.",
          );
          return false;
        }
        if (nova !== confirma) {
          Swal.showValidationMessage("Senhas não coincidem.");
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: "success",
          title: "Senha alterada!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // Restaurar configurações padrão
  const restaurarPadroes = () => {
    Swal.fire({
      title: "Restaurar configurações padrão?",
      text: "Isso irá redefinir todas as suas preferências para os valores iniciais.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, restaurar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simula restauração
        setTheme("light");
        setFontSize(100);
        setPrimaryColor("#0057B8");
        setIdioma("pt-BR");
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
          title: "Restaurado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // ============================================================
  // COMPONENTE RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho com gradiente */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 mb-8 shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAxIDAgMCA0MCAyMCAyMCAwIDAgMCAwLTQweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] bg-repeat" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-3">
                <FaCog className="text-3xl" />
                Configurações
              </h1>
              <p className="text-blue-100 mt-1 text-lg">
                Personalize sua experiência e gerencie o sistema
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={restaurarPadroes}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-medium transition text-white border border-white/20"
              >
                <FaUndo /> Restaurar padrões
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    icon: "success",
                    title: "Configurações salvas!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                }}
                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-medium transition shadow-lg"
              >
                <FaSave /> Salvar
              </button>
            </div>
          </div>
        </div>

        {/* Navegação por abas (mais elegante) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 mb-8 flex flex-wrap gap-1">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                abaAtiva === aba.id
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <aba.icon size={18} />
              <span className="hidden sm:inline">{aba.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo da aba */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Aba Geral */}
          {abaAtiva === "geral" && (
            <div className="space-y-10">
              {/* Aparência */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaPalette className="text-blue-600" /> Aparência
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tema */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <label className="block font-semibold text-gray-700 mb-3">
                      Tema do Sistema
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                          theme === "light"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaRegSun /> Claro
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                          theme === "dark"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaRegMoon /> Escuro
                      </button>
                    </div>
                  </div>

                  {/* Fonte */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <label className="block font-semibold text-gray-700 mb-3">
                      <FaFont className="inline mr-2 text-blue-600" />
                      Fonte do Sistema
                    </label>
                    <select
                      value={fonteSistema}
                      onChange={(e) => setFonteSistema(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">
                      <FaFont className="inline mr-2 text-blue-600" />
                      Tamanho da Fonte
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold">
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        ((fontSize - 20) / (180 - 20)) * 100
                      }%, #e5e7eb ${
                        ((fontSize - 20) / (180 - 20)) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>20%</span>
                    <span className="font-bold text-blue-700">100%</span>
                    <span>180%</span>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border text-center transition-all">
                    <p
                      className="text-gray-700"
                      style={{
                        fontSize: `${fontSize}%`,
                        fontFamily: fonteSistema,
                      }}
                    >
                      Texto de pré-visualização com {fontSize}% de tamanho.
                    </p>
                  </div>
                </div>

                {/* Cor principal */}
                <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="font-semibold text-gray-700 mb-4">
                    <FaPalette className="inline mr-2 text-blue-600" />
                    Cor Principal
                  </p>
                  <div className="flex gap-4 flex-wrap items-center">
                    {coresPreset.map((cor) => (
                      <button
                        key={cor.valor}
                        onClick={() => setPrimaryColor(cor.valor)}
                        className={`w-12 h-12 rounded-full border-3 transition-all ${
                          primaryColor === cor.valor
                            ? "border-gray-900 scale-110 shadow-lg ring-2 ring-blue-500"
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
                      className="w-12 h-12 rounded-full border cursor-pointer"
                    />
                  </div>
                </div>
              </section>

              {/* Preferências Regionais */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaGlobe className="text-blue-600" /> Preferências Regionais
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={idioma}
                      onChange={(e) => setIdioma(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <label className="block font-semibold text-gray-700 mb-2">
                      Formato de data
                    </label>
                    <select
                      value={formatoData}
                      onChange={(e) => setFormatoData(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                      <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Notificações */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaBell className="text-blue-600" /> Notificações
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition"
                    >
                      <span className="font-medium text-gray-700 capitalize">
                        {key === "agendamentos" && "Alertas de Agendamento"}
                        {key === "filas" && "Chamadas de Fila"}
                        {key === "vacinas" && "Vacinas Disponíveis"}
                        {key === "somChamada" && "Som de chamada"}
                        {key === "lembretes" && "Lembretes Gerais"}
                      </span>
                      <button
                        onClick={() => handleNotifChange(key)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          value ? "bg-blue-600" : "bg-gray-300"
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
              <section className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaEye className="text-white/80" /> Acessibilidade
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-sm p-5 rounded-xl cursor-pointer transition text-white">
                    <div>
                      <p className="font-medium">Modo Sênior</p>
                      <p className="text-xs opacity-80">
                        Interface simplificada e maior
                      </p>
                    </div>
                    <div
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        modoSenior ? "bg-white" : "bg-white/30"
                      }`}
                    >
                      <span
                        onClick={() => setModoSenior(!modoSenior)}
                        className={`absolute top-1 left-1 w-4 h-4 bg-blue-600 rounded-full transition-transform ${
                          modoSenior ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-sm p-5 rounded-xl cursor-pointer transition text-white">
                    <div>
                      <p className="font-medium">Alto Contraste</p>
                      <p className="text-xs opacity-80">
                        Cores de alto contraste
                      </p>
                    </div>
                    <div
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        altoContraste ? "bg-white" : "bg-white/30"
                      }`}
                    >
                      <span
                        onClick={() => setAltoContraste(!altoContraste)}
                        className={`absolute top-1 left-1 w-4 h-4 bg-blue-600 rounded-full transition-transform ${
                          altoContraste ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </section>
            </div>
          )}

          {/* Painel */}
          {abaAtiva === "painel" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaTachometerAlt className="text-blue-600" /> Configurações do
                Painel
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Visão geral ao entrar
                    </p>
                    <p className="text-sm text-gray-500">
                      Exibir resumo de consultas e filas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Notificações do painel
                    </p>
                    <p className="text-sm text-gray-500">
                      Receber alertas de novas senhas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Widget de métricas rápidas
                    </p>
                    <p className="text-sm text-gray-500">
                      Exibir cards de desempenho
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filas */}
          {abaAtiva === "filas" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaListAlt className="text-blue-600" /> Configurações de Filas
              </h2>
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block font-medium text-gray-700 mb-3">
                    Tempo médio de espera para prioridade
                  </label>
                  <select className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64">
                    <option>5 minutos</option>
                    <option>10 minutos</option>
                    <option selected>15 minutos</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Exibir posição na fila para pacientes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Notificar pacientes quando próximo
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Agendamento */}
          {abaAtiva === "agendamento" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaCalendarAlt className="text-blue-600" /> Configurações de
                Agendamento
              </h2>
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block font-medium text-gray-700 mb-3">
                    Dias de antecedência máxima
                  </label>
                  <select className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64">
                    <option>30 dias</option>
                    <option selected>60 dias</option>
                    <option>90 dias</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Permitir reagendamento online
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Enviar lembrete por e-mail 24h antes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Histórico */}
          {abaAtiva === "historico" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaHistory className="text-blue-600" /> Configurações de
                Histórico
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Compartilhar histórico com outras UBS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Manter histórico por tempo indeterminado
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Exportar histórico em CSV
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vacinas */}
          {abaAtiva === "vacinas" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaSyringe className="text-blue-600" /> Configurações de Vacinas
              </h2>
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block font-medium text-gray-700 mb-3">
                    Lembrete de campanhas
                  </label>
                  <select className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64">
                    <option>1 semana antes</option>
                    <option selected>2 semanas antes</option>
                    <option>1 mês antes</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Notificar quando estoque baixo
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition">
                  <div>
                    <p className="font-medium text-gray-700">
                      Alertar sobre vacinas vencendo
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Segurança */}
          {abaAtiva === "seguranca" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaUserLock className="text-blue-600" /> Segurança da Conta
              </h2>
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center p-5 bg-gray-50 rounded-xl border border-gray-200 gap-4 hover:border-blue-200 transition">
                  <div>
                    <p className="font-semibold text-gray-700">Alterar senha</p>
                    <p className="text-sm text-gray-500">
                      Mantenha sua conta protegida.
                    </p>
                  </div>
                  <button
                    onClick={alterarSenha}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm"
                  >
                    Alterar
                  </button>
                </div>
                <div className="flex flex-wrap justify-between items-center p-5 bg-gray-50 rounded-xl border border-gray-200 gap-4 hover:border-red-200 transition">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Encerrar sessão em outros dispositivos
                    </p>
                    <p className="text-sm text-gray-500">
                      Revogue todos os acessos ativos.
                    </p>
                  </div>
                  <button className="border border-red-500 text-red-500 px-6 py-2.5 rounded-xl font-medium hover:bg-red-50 transition">
                    Encerrar
                  </button>
                </div>
                <div className="flex flex-wrap justify-between items-center p-5 bg-gray-50 rounded-xl border border-gray-200 gap-4">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Autenticação em dois fatores
                    </p>
                    <p className="text-sm text-gray-500">
                      Adicione uma camada extra de segurança.
                    </p>
                  </div>
                  <button className="bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition">
                    Configurar
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-4">
                  * Funcionalidades simuladas para demonstração.
                </div>
              </div>
            </div>
          )}

          {/* Admin */}
          {abaAtiva === "admin" && user?.role === "admin" && (
            <div className="space-y-10">
              {/* Unidades */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FaBuilding className="text-blue-600" /> Unidades de Saúde
                  </h2>
                  <button
                    onClick={handleAddUBS}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
                  >
                    <FaPlus /> Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {ubsList.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      Nenhuma unidade cadastrada.
                    </p>
                  ) : (
                    ubsList.map((ubs) => (
                      <div
                        key={ubs.id}
                        className="flex flex-wrap justify-between items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {ubs.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ubs.endereco}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveUBS(ubs)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FaTrash size={14} /> Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Usuários */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FaUsersCog className="text-blue-600" /> Usuários do Sistema
                  </h2>
                  <button
                    onClick={handleAddUsuario}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
                  >
                    <FaPlus /> Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {usuarios.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      Nenhum usuário cadastrado.
                    </p>
                  ) : (
                    usuarios.map((us) => (
                      <div
                        key={us.id}
                        className="flex flex-wrap justify-between items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition gap-2"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{us.nome}</p>
                          <p className="text-sm text-gray-500">
                            {us.email} •{" "}
                            <span className="capitalize">{us.role}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUsuario(us)}
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
                          >
                            <FaEdit size={14} /> Editar
                          </button>
                          <button
                            onClick={() => handleRemoveUsuario(us)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <FaTrash size={14} /> Remover
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Médicos */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FaStethoscope className="text-blue-600" /> Médicos
                  </h2>
                  <button
                    onClick={handleAddMedico}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow-sm"
                  >
                    <FaPlus /> Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {medicosList.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      Nenhum médico cadastrado.
                    </p>
                  ) : (
                    medicosList.map((med) => (
                      <div
                        key={med.id}
                        className="flex flex-wrap justify-between items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {med.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {med.especialidade}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveMedico(med)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FaTrash size={14} /> Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Parâmetros Gerais */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaCog className="text-blue-600" /> Parâmetros Gerais
                </h2>
                <div className="space-y-5">
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <label className="block font-medium text-gray-700 mb-3">
                      Tempo máximo de espera (min)
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
                      className="w-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition">
                    <span className="font-medium text-gray-700">
                      Permitir autoagendamento
                    </span>
                    <input
                      type="checkbox"
                      checked={parametroSistema.permitirAutoAgendamento}
                      onChange={(e) =>
                        setParametroSistema({
                          ...parametroSistema,
                          permitirAutoAgendamento: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition">
                    <span className="font-medium text-gray-700">
                      Habilitar fila prioritária automática
                    </span>
                    <input
                      type="checkbox"
                      checked={parametroSistema.filaPrioritariaAutomatica}
                      onChange={(e) =>
                        setParametroSistema({
                          ...parametroSistema,
                          filaPrioritariaAutomatica: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition">
                    <span className="font-medium text-gray-700">
                      Notificar gestores sobre alta demanda
                    </span>
                    <input
                      type="checkbox"
                      checked={parametroSistema.notificarAltaDemanda}
                      onChange={(e) =>
                        setParametroSistema({
                          ...parametroSistema,
                          notificarAltaDemanda: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </div>
                </div>
              </section>

              {/* Logs */}
              <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <HiDocumentText className="text-blue-600" /> Logs de
                  Atividades
                </h2>
                <div className="bg-white p-4 rounded-xl max-h-48 overflow-y-auto text-xs font-mono border border-gray-200">
                  <p className="text-gray-600 py-1">
                    [2024-12-06 08:32] Admin fez login
                  </p>
                  <p className="text-gray-600 py-1">
                    [2024-12-06 08:35] Relatório de filas exportado
                  </p>
                  <p className="text-gray-600 py-1">
                    [2024-12-06 09:10] Novo usuário cadastrado:
                    atendente2@ubs.com
                  </p>
                  <p className="text-gray-600 py-1">
                    [2024-12-06 09:45] Sincronização com DataSUS concluída
                  </p>
                  <p className="text-gray-600 py-1">
                    [2024-12-06 10:15] Configurações de vacinas atualizadas
                  </p>
                </div>
                <button className="mt-4 text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
                  <FaFileDownload size={14} /> Baixar logs completos
                </button>
              </section>

              {/* Backup */}
              <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-3">
                  <FaShieldAlt /> Backup e Restauração
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm">
                    Gerar backup agora
                  </button>
                  <button className="border border-amber-600 text-amber-600 px-6 py-2.5 rounded-xl font-medium hover:bg-amber-100 transition">
                    Restaurar último backup
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
