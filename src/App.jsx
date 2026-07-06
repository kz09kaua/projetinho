import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas públicas (compartilhadas)
import LandingPage from "./pages/(compartilhados)/LandingPage";
import Login from "./pages/(compartilhados)/Login";
import Cadastro from "./pages/(compartilhados)/CadastroConta";
import EsqueceuSenha from "./pages/(compartilhados)/EsqueceuSenha";
import RedefinirSenha from "./pages/(compartilhados)/RedefinirSenha";

// Páginas comuns (todos os perfis)
import ProcurarUBS from "./pages/(compartilhados)/ProcurarUBS";
import Configuracoes from "./pages/(compartilhados)/Configuracoes";

// Páginas base (paciente)
import FilasAtendimento from "./pages/paciente/FilasAtendimento";
import Agendamento from "./pages/paciente/Agendamento";
import HistoricoMedico from "./pages/paciente/HistoricoMedico";
import Vacinação from "./pages/paciente/Vacinação";
import SusConectado from "./pages/paciente/SusConectado";

// Páginas do atendente
import FilasAtendimentoAttendente from "./pages/atendente/FilasAtendimentoAttendente";
import AgendamentoAttendente from "./pages/atendente/AgendamentoAttendente";
import HistoricoMedicoAttendente from "./pages/atendente/HistoricoMedicoAttendente";
import VacinaçãoAttendente from "./pages/atendente/VacinaçãoAttendente";
import SusConectadoAtendente from "./pages/atendente/SusConectadoAtendente";
import AtendenteDashboard from "./pages/atendente/AtendenteDashboard";
import GerenciarFilas from "./pages/atendente/GerenciarFilas";
import EstoqueVacinas from "./pages/atendente/EstoqueVacinas";
import EstoqueMedicamentos from "./pages/atendente/EstoqueMedicamentos";
import SelecionarUBS from "./pages/atendente/SelecionarUBS"; // <-- NOVA

// Páginas do admin
import FilasAtendimentoAdmin from "./pages/admim/FilasAtendimentoAdmin";
import AgendamentoAdmin from "./pages/admim/AgendamentoAdmin";
import HistoricoMedicoAdmin from "./pages/admim/HistoricoMedicoAdmin";
import VacinaçãoAdmin from "./pages/admim/VacinaçãoAdmin";
import SusConectadoAdmin from "./pages/admim/SusConectadoAdmin";
import DashboardAdmin from "./pages/admim/DashboardAdmin";

// Dashboard do paciente
import DashboardPaciente from "./pages/paciente/DashboardPaciente";

import { useAuth } from "./contexts/AuthContext";

// Roteadores por perfil (já existentes)
const FilasRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <FilasAtendimentoAdmin />;
  if (user?.role === "atendente") return <FilasAtendimentoAttendente />;
  return <FilasAtendimento />;
};

const AgendamentoRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <AgendamentoAdmin />;
  if (user?.role === "atendente") return <AgendamentoAttendente />;
  return <Agendamento />;
};

const HistoricoRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <HistoricoMedicoAdmin />;
  if (user?.role === "atendente") return <HistoricoMedicoAttendente />;
  return <HistoricoMedico />;
};

const VacinaçãoRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <VacinaçãoAdmin />;
  if (user?.role === "atendente") return <VacinaçãoAttendente />;
  return <Vacinação />;
};

const SusConectadoRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <SusConectadoAdmin />;
  if (user?.role === "atendente") return <SusConectadoAtendente />;
  return <SusConectado />;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <DashboardAdmin />;
  if (user?.role === "atendente") return <AtendenteDashboard />;
  return <DashboardPaciente />;
};

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />

            {/* Rotas protegidas com Layout – comuns a todos */}
            <Route
              path="/procurar-ubs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProcurarUBS />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Configuracoes />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Rota DASHBOARD – adaptável por perfil */}
            <Route
              path="/dashboard-paciente"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Rotas unificadas por perfil */}
            <Route
              path="/filas-atendimento"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FilasRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agendamento"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AgendamentoRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/historico-medico"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HistoricoRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vacinação"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VacinaçãoRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sus-conectado"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SusConectadoRouter />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Rota exclusiva do ATENDENTE para selecionar UBS */}
            <Route
              path="/selecionar-ubs"
              element={
                <ProtectedRoute allowedRoles={["atendente"]}>
                  <SelecionarUBS />
                </ProtectedRoute>
              }
            />

            {/* Rotas exclusivas do ATENDENTE */}
            <Route
              path="/atendente-dashboard"
              element={
                <ProtectedRoute allowedRoles={["atendente"]}>
                  <Layout>
                    <AtendenteDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gerenciar-filas"
              element={
                <ProtectedRoute allowedRoles={["atendente"]}>
                  <Layout>
                    <GerenciarFilas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estoque-vacinas"
              element={
                <ProtectedRoute allowedRoles={["atendente"]}>
                  <Layout>
                    <EstoqueVacinas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estoque-medicamentos"
              element={
                <ProtectedRoute allowedRoles={["atendente"]}>
                  <Layout>
                    <EstoqueMedicamentos />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;