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
  });

  const handleNotifChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    Swal.fire({
      icon: "success",
      title: "Notificação atualizada",
      text: `${
        key === "agendamentos"
          ? "Alertas de agendamento"
          : key === "filas"
            ? "Chamadas de fila"
            : key === "vacinas"
              ? "Vacinas"
              : "Som de chamada"
      } ${!notifications[key] ? "ativados" : "desativados"}.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  // Preferências gerais
  const [idioma, setIdioma] = useState("pt-BR");
  const [formatoData, setFormatoData] = useState("dd/MM/yyyy");
  const [preferenciaFila, setPreferenciaFila] = useState(true);

  // Estados para a aba Admin
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
  const [parametroSistema, setParametroSistema] = useState({
    tempoMaximoEspera: 30,
    permitirAutoAgendamento: true,
  });

  // Cores predefinidas
  const coresPreset = [
    { nome: "Azul SUS", valor: "#0057B8" },
    { nome: "Verde Saúde", valor: "#2e7d32" },
    { nome: "Roxo Acessível", valor: "#6a1b9a" },
    { nome: "Laranja", valor: "#e65100" },
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
    abasBase.push({ id: "admin", label: "Admin", icon: FaShieldAlt });
  }
  const abas = abasBase;

  // Função para alterar senha (simulada)
  const alterarSenha = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Alterar Senha",
      html: `
        <input id="senha-atual" type="password" class="swal2-input" placeholder="Senha atual" required>
        <input id="nova-senha" type="password" class="swal2-input" placeholder="Nova senha" required>
        <input id="confirma-senha" type="password" class="swal2-input" placeholder="Confirmar nova senha" required>
      `,
      confirmButtonText: "Alterar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const atual = document.getElementById("senha-atual").value;
        const nova = document.getElementById("nova-senha").value;
        const confirma = document.getElementById("confirma-senha").value;
        if (!atual || !nova || !confirma) {
          Swal.showValidationMessage("Preencha todos os campos");
          return false;
        }
        if (nova.length < 6) {
          Swal.showValidationMessage("Senha deve ter no mínimo 6 caracteres");
          return false;
        }
        if (nova !== confirma) {
          Swal.showValidationMessage("Senhas não coincidem");
          return false;
        }
        return true;
      },
    });
    if (formValues) {
      Swal.fire({
        icon: "success",
        title: "Senha alterada!",
        text: "Sua senha foi atualizada (simulação).",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        ⚙️ Configurações
      </h1>
      <p className="text-gray-500 mb-6">
        Personalize os módulos e as preferências do sistema.
      </p>

      {/* Navegação por abas */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {abas.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
              abaAtiva === aba.id
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <aba.icon size={16} />
            {aba.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        {/* Aba Geral */}
        {abaAtiva === "geral" && (
          <div className="space-y-8">
            {/* Aparência */}
            <div>
              <h2 className="text-xl font-bold mb-4">Aparência</h2>
              <div className="space-y-5">
                {/* Tema */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Tema do Sistema</p>
                    <p className="text-sm text-gray-500">Claro ou escuro</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        theme === "light"
                          ? "bg-blue-700 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Claro
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        theme === "dark"
                          ? "bg-blue-700 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Escuro
                    </button>
                  </div>
                </div>
                <hr />

                {/* Tamanho da fonte */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Tamanho da Fonte</span>
                    <span className="text-primary font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">
                      {fontSize}%
                    </span>
                  </div>
                  <div className="relative pt-2 pb-8">
                    <input
                      type="range"
                      min="20"
                      max="180"
                      step="5"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((fontSize - 20) / (180 - 20)) * 100}%, #e5e7eb ${((fontSize - 20) / (180 - 20)) * 100}%, #e5e7eb 100%)`,
                      }}
                    />
                    {/* Marcadores fixos */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                      <span>20%</span>
                      <span className="font-bold text-blue-700">100%</span>
                      <span>180%</span>
                    </div>
                    {/* Indicador central */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-blue-600/50 rounded-full pointer-events-none" />
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow pointer-events-none" />
                  </div>
                  {/* Pré‑visualização */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border text-center transition-all">
                    <p className="text-sm text-gray-500 mb-2">
                      🔍 Pré‑visualização
                    </p>
                    <p
                      className="text-gray-700"
                      style={{ fontSize: `${fontSize}%` }}
                    >
                      Este texto está com {fontSize}% do tamanho original.
                    </p>
                  </div>
                </div>
                <hr />

                {/* Cor principal */}
                <div>
                  <p className="font-semibold mb-3">Cor Principal</p>
                  <div className="flex gap-4 flex-wrap items-center">
                    {coresPreset.map((cor) => (
                      <button
                        key={cor.valor}
                        onClick={() => setPrimaryColor(cor.valor)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          primaryColor === cor.valor
                            ? "border-black scale-110"
                            : "border-white"
                        }`}
                        style={{ backgroundColor: cor.valor }}
                        title={cor.nome}
                      />
                    ))}
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-full border cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preferências Regionais */}
            <div>
              <h2 className="text-xl font-bold mb-4">Preferências Regionais</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">Idioma</label>
                  <select
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Formato de data
                  </label>
                  <select
                    value={formatoData}
                    onChange={(e) => setFormatoData(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                    <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                    <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div>
              <h2 className="text-xl font-bold mb-4">Notificações</h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span>Alertas de Agendamento</span>
                  <input
                    type="checkbox"
                    checked={notifications.agendamentos}
                    onChange={() => handleNotifChange("agendamentos")}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </li>
                <li className="flex justify-between items-center">
                  <span>Chamadas de Fila</span>
                  <input
                    type="checkbox"
                    checked={notifications.filas}
                    onChange={() => handleNotifChange("filas")}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </li>
                <li className="flex justify-between items-center">
                  <span>Vacinas Disponíveis</span>
                  <input
                    type="checkbox"
                    checked={notifications.vacinas}
                    onChange={() => handleNotifChange("vacinas")}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </li>
                <li className="flex justify-between items-center">
                  <span>Som de chamada de senha</span>
                  <input
                    type="checkbox"
                    checked={notifications.somChamada}
                    onChange={() => handleNotifChange("somChamada")}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </li>
              </ul>
            </div>

            {/* Acessibilidade */}
            <div className="bg-blue-800 text-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Acessibilidade</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center justify-between bg-white/10 p-4 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium">Modo Sênior</p>
                    <p className="text-xs opacity-80">
                      Interface simplificada e maior
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={modoSenior}
                    onChange={(e) => setModoSenior(e.target.checked)}
                    className="w-5 h-5 rounded border-white text-blue-600 focus:ring-white"
                  />
                </label>
                <label className="flex items-center justify-between bg-white/10 p-4 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium">Alto Contraste</p>
                    <p className="text-xs opacity-80">
                      Cores de alto contraste
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={altoContraste}
                    onChange={(e) => setAltoContraste(e.target.checked)}
                    className="w-5 h-5 rounded border-white text-blue-600 focus:ring-white"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Aba Painel */}
        {abaAtiva === "painel" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Configurações do Painel</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Visão geral ao entrar</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações do painel</p>
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
            </div>
          </div>
        )}

        {/* Aba Filas */}
        {abaAtiva === "filas" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Configurações de Filas</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Tempo médio de espera para prioridade
                </label>
                <select className="p-2 border rounded-lg w-64">
                  <option>5 minutos</option>
                  <option>10 minutos</option>
                  <option>15 minutos</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Exibir posição na fila para pacientes
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

        {/* Aba Agendamento */}
        {abaAtiva === "agendamento" && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Configurações de Agendamento
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Dias de antecedência máxima
                </label>
                <select className="p-2 border rounded-lg w-64">
                  <option>30 dias</option>
                  <option>60 dias</option>
                  <option>90 dias</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Permitir reagendamento online</p>
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

        {/* Aba Histórico */}
        {abaAtiva === "historico" && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Configurações de Histórico
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Compartilhar histórico com outras UBS
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

        {/* Aba Vacinas */}
        {abaAtiva === "vacinas" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Configurações de Vacinas</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  Lembrete de campanhas
                </label>
                <select className="p-2 border rounded-lg w-64">
                  <option>1 semana antes</option>
                  <option>2 semanas antes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Aba Segurança */}
        {abaAtiva === "seguranca" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Segurança da Conta</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold">Alterar senha</p>
                  <p className="text-sm text-gray-500">
                    Mantenha sua conta protegida.
                  </p>
                </div>
                <button
                  onClick={alterarSenha}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Alterar
                </button>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold">
                    Encerrar sessão em outros dispositivos
                  </p>
                  <p className="text-sm text-gray-500">
                    Revogue todos os acessos ativos.
                  </p>
                </div>
                <button className="border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-50 transition">
                  Encerrar
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-4">
                * Funcionalidades simuladas para demonstração.
              </div>
            </div>
          </div>
        )}

        {/* Aba Admin (somente admin) */}
        {abaAtiva === "admin" && (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaBuilding className="text-blue-600" /> Unidades de Saúde
              </h2>
              <div className="space-y-3 mb-4">
                {ubsList.map((ubs) => (
                  <div
                    key={ubs.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{ubs.nome}</p>
                      <p className="text-xs text-gray-500">{ubs.endereco}</p>
                    </div>
                    <button className="text-red-500 hover:underline text-sm">
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition">
                + Adicionar Unidade
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUsersCog className="text-blue-600" /> Usuários do Sistema
              </h2>
              <div className="space-y-3 mb-4">
                {usuarios.map((us) => (
                  <div
                    key={us.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{us.nome}</p>
                      <p className="text-xs text-gray-500">
                        {us.email} • {us.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:underline text-sm">
                        Editar
                      </button>
                      <button className="text-red-500 hover:underline text-sm">
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition">
                + Adicionar Usuário
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaStethoscope className="text-blue-600" /> Médicos
              </h2>
              <div className="space-y-3 mb-4">
                {[
                  { id: 1, nome: "Dra. Ana", especialidade: "Clínica Geral" },
                  { id: 2, nome: "Dr. Carlos", especialidade: "Cardiologia" },
                ].map((med) => (
                  <div
                    key={med.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{med.nome}</p>
                      <p className="text-xs text-gray-500">
                        {med.especialidade}
                      </p>
                    </div>
                    <button className="text-red-500 hover:underline text-sm">
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition">
                + Adicionar Médico
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCog className="text-blue-600" /> Parâmetros Gerais
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block font-medium mb-1">
                    Tempo máximo de espera (min)
                  </label>
                  <input
                    type="number"
                    value={parametroSistema.tempoMaximoEspera}
                    onChange={(e) =>
                      setParametroSistema({
                        ...parametroSistema,
                        tempoMaximoEspera: parseInt(e.target.value),
                      })
                    }
                    className="w-32 p-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Permitir autoagendamento</span>
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
                <div className="flex items-center justify-between">
                  <span>Habilitar fila prioritária automática</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Notificar gestores sobre alta demanda</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <HiDocumentText className="text-blue-600" /> Logs de Atividades
              </h2>
              <div className="bg-gray-50 p-4 rounded-xl max-h-48 overflow-y-auto text-xs font-mono">
                <p>[2024-12-06 08:32] Admin fez login</p>
                <p>[2024-12-06 08:35] Relatório de filas exportado</p>
                <p>
                  [2024-12-06 09:10] Novo usuário cadastrado: atendente2@ubs.com
                </p>
                <p>[2024-12-06 09:45] Sincronização com DataSUS concluída</p>
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:underline">
                Baixar logs completos
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-bold text-amber-800 mb-2">
                Backup e Restauração
              </h3>
              <div className="flex gap-4">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                  Gerar backup agora
                </button>
                <button className="border border-amber-600 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-100">
                  Restaurar último backup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
