// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas públicas
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/CadastroConta';
import EsqueceuSenha from './pages/EsqueceuSenha';
import RedefinirSenha from './pages/RedefinirSenha';

// Páginas protegidas (paciente, admin, atendente)
import Agendamento from './pages/Agendamento';
import Configuracoes from './pages/Configuracoes';
import DashboardPaciente from './pages/DashboardPaciente';
import FilasAtendimento from './pages/FilasAtendimento';
import HistoricoMedico from './pages/HistoricoMedico';
import PainelAdministrador from './pages/PainelAdministrador';
import SusConectado from './pages/SusConectado';
import Vacinação from './pages/Vacinação';
import ProcurarUBS from './pages/ProcurarUBS';

// Páginas do atendente
import AtendenteDashboard from './pages/AtendenteDashboard';
import GerenciarFilas from './pages/GerenciarFilas';
import EstoqueVacinas from './pages/EstoqueVacinas';
import EstoqueMedicamentos from './pages/EstoqueMedicamentos';
import AtendimentoPaciente from './pages/AtendimentoPaciente';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* ROTAS PRIVADAS COM LAYOUT */}
          <Route path="/dashboard-paciente" element={
            <ProtectedRoute><Layout><DashboardPaciente /></Layout></ProtectedRoute>
          } />
          <Route path="/agendamento" element={
            <ProtectedRoute><Layout><Agendamento /></Layout></ProtectedRoute>
          } />
          <Route path="/historico-medico" element={
            <ProtectedRoute><Layout><HistoricoMedico /></Layout></ProtectedRoute>
          } />
          <Route path="/vacinação" element={
            <ProtectedRoute><Layout><Vacinação /></Layout></ProtectedRoute>
          } />
          <Route path="/filas-atendimento" element={
            <ProtectedRoute><Layout><FilasAtendimento /></Layout></ProtectedRoute>
          } />
          <Route path="/sus-conectado" element={
            <ProtectedRoute><Layout><SusConectado /></Layout></ProtectedRoute>
          } />
          <Route path="/procurar-ubs" element={
            <ProtectedRoute><Layout><ProcurarUBS /></Layout></ProtectedRoute>
          } />

          {/* ROTAS ADMIN */}
          <Route path="/configuracoes" element={
            <ProtectedRoute allowedRoles={['admin']}><Layout><Configuracoes /></Layout></ProtectedRoute>
          } />
          <Route path="/painel-administrador" element={
            <ProtectedRoute allowedRoles={['admin']}><Layout><PainelAdministrador /></Layout></ProtectedRoute>
          } />

          {/* ROTAS ATENDENTE */}
          <Route path="/atendente-dashboard" element={
            <ProtectedRoute allowedRoles={['atendente']}><Layout><AtendenteDashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/gerenciar-filas" element={
            <ProtectedRoute allowedRoles={['atendente']}><Layout><GerenciarFilas /></Layout></ProtectedRoute>
          } />
          <Route path="/estoque-vacinas" element={
            <ProtectedRoute allowedRoles={['atendente']}><Layout><EstoqueVacinas /></Layout></ProtectedRoute>
          } />
          <Route path="/estoque-medicamentos" element={
            <ProtectedRoute allowedRoles={['atendente']}><Layout><EstoqueMedicamentos /></Layout></ProtectedRoute>
          } />
          <Route path="/atendimento-paciente" element={
            <ProtectedRoute allowedRoles={['atendente']}><Layout><AtendimentoPaciente /></Layout></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;