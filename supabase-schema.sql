-- ============================================================
-- MINHA UBS - Schema completo para Supabase
-- Execute este SQL no Editor SQL do Supabase (supabase.com)
-- ============================================================

-- 1) TABELA DE PERFIS (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  data_nascimento TEXT,
  endereco TEXT,
  bio TEXT,
  genero TEXT,
  role TEXT NOT NULL DEFAULT 'paciente' CHECK (role IN ('admin', 'atendente', 'paciente')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) TABELA DE PACIENTES (cadastro feito pelo atendente)
CREATE TABLE IF NOT EXISTS pacientes (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  numero_sus TEXT UNIQUE,
  data_nascimento TEXT,
  sexo TEXT CHECK (sexo IN ('Masculino', 'Feminino')),
  alergias TEXT[] DEFAULT ARRAY['Nenhuma'],
  tipo_sanguineo TEXT DEFAULT 'Nao informado',
  ultima_consulta TEXT DEFAULT 'Nunca',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) TABELA DE CONSULTAS / AGENDAMENTOS
CREATE TABLE IF NOT EXISTS consultas (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT REFERENCES pacientes(id) ON DELETE SET NULL,
  paciente_nome TEXT NOT NULL,
  data TEXT NOT NULL,
  horario TEXT NOT NULL,
  medico TEXT,
  especialidade TEXT,
  status TEXT DEFAULT 'Aguardando' CHECK (status IN ('Confirmado', 'Aguardando', 'Cancelado', 'Realizada')),
  senha TEXT,
  ubs TEXT,
  observacoes TEXT,
  arquivado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) TABELA DE HISTORICO MEDICO
CREATE TABLE IF NOT EXISTS historico_medico (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT REFERENCES pacientes(id) ON DELETE SET NULL,
  paciente_nome TEXT NOT NULL,
  data TEXT NOT NULL,
  medico TEXT,
  especialidade TEXT,
  ubs TEXT,
  diagnostico TEXT,
  observacao TEXT,
  status TEXT DEFAULT 'Realizada',
  arquivado BOOLEAN DEFAULT FALSE,
  data_arquivo TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) TABELA DE FILAS DE ATENDIMENTO
CREATE TABLE IF NOT EXISTS filas_atendimento (
  id BIGSERIAL PRIMARY KEY,
  posicao INT,
  paciente_nome TEXT NOT NULL,
  prioridade TEXT DEFAULT 'Normal' CHECK (prioridade IN ('Normal', 'Prioritario', 'Urgente', 'Prioritária', 'Urgência')),
  tempo TEXT,
  senha TEXT,
  status TEXT DEFAULT 'Aguardando' CHECK (status IN ('Aguardando', 'Em atendimento', 'Atendido', 'Desistiu')),
  especialidade TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6) TABELA DE ESTOQUE DE VACINAS
CREATE TABLE IF NOT EXISTS estoque_vacinas (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  lote TEXT,
  quantidade INT DEFAULT 0,
  validade DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7) TABELA DE ESTOQUE DE MEDICAMENTOS
CREATE TABLE IF NOT EXISTS estoque_medicamentos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  lote TEXT,
  quantidade INT DEFAULT 0,
  validade DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8) TABELA DE EXAMES (SUS Conectado)
CREATE TABLE IF NOT EXISTS exames (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT REFERENCES pacientes(id) ON DELETE SET NULL,
  paciente_nome TEXT,
  nome TEXT NOT NULL,
  medico_solicitante TEXT,
  data_solicitacao TEXT,
  data_resultado TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em andamento', 'Concluido', 'Concluído', 'Cancelado')),
  resultado TEXT,
  prioridade TEXT DEFAULT 'Normal',
  tipo TEXT,
  arquivado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9) TABELA DE UBS
CREATE TABLE IF NOT EXISTS ubs (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  endereco TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10) TABELA DE MEDICOS
CREATE TABLE IF NOT EXISTS medicos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  especialidade TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11) TABELA DE MENSAGENS DO CHAT
CREATE TABLE IF NOT EXISTS chat_mensagens (
  id BIGSERIAL PRIMARY KEY,
  remetente TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCAO PARA CRIAR PERFIL AUTOMATICAMENTE AO REGISTRAR
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, cpf, telefone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'paciente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil ao registrar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCAO PARA ATUALIZAR updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: usuarios podem ver e editar seu proprio perfil; admins veem todos
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios podem ver seu perfil"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuarios podem atualizar seu perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles podem ser inseridos pelo trigger"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Pacientes: todos autenticados podem ler/escrever
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler pacientes"
  ON pacientes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir pacientes"
  ON pacientes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar pacientes"
  ON pacientes FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar pacientes"
  ON pacientes FOR DELETE
  USING (auth.role() = 'authenticated');

-- Consultas
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler consultas"
  ON consultas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir consultas"
  ON consultas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar consultas"
  ON consultas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar consultas"
  ON consultas FOR DELETE
  USING (auth.role() = 'authenticated');

-- Historico Medico
ALTER TABLE historico_medico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler historico"
  ON historico_medico FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir historico"
  ON historico_medico FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar historico"
  ON historico_medico FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar historico"
  ON historico_medico FOR DELETE
  USING (auth.role() = 'authenticated');

-- Filas de Atendimento
ALTER TABLE filas_atendimento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler filas"
  ON filas_atendimento FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir filas"
  ON filas_atendimento FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar filas"
  ON filas_atendimento FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar filas"
  ON filas_atendimento FOR DELETE
  USING (auth.role() = 'authenticated');

-- Estoque Vacinas
ALTER TABLE estoque_vacinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler vacinas"
  ON estoque_vacinas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir vacinas"
  ON estoque_vacinas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar vacinas"
  ON estoque_vacinas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar vacinas"
  ON estoque_vacinas FOR DELETE
  USING (auth.role() = 'authenticated');

-- Estoque Medicamentos
ALTER TABLE estoque_medicamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler medicamentos"
  ON estoque_medicamentos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir medicamentos"
  ON estoque_medicamentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar medicamentos"
  ON estoque_medicamentos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar medicamentos"
  ON estoque_medicamentos FOR DELETE
  USING (auth.role() = 'authenticated');

-- Exames
ALTER TABLE exames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler exames"
  ON exames FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir exames"
  ON exames FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar exames"
  ON exames FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar exames"
  ON exames FOR DELETE
  USING (auth.role() = 'authenticated');

-- UBS
ALTER TABLE ubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler ubs"
  ON ubs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir ubs"
  ON ubs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar ubs"
  ON ubs FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar ubs"
  ON ubs FOR DELETE
  USING (auth.role() = 'authenticated');

-- Medicos
ALTER TABLE medicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler medicos"
  ON medicos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir medicos"
  ON medicos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem atualizar medicos"
  ON medicos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem deletar medicos"
  ON medicos FOR DELETE
  USING (auth.role() = 'authenticated');

-- Chat Mensagens
ALTER TABLE chat_mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados podem ler mensagens"
  ON chat_mensagens FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Autenticados podem inserir mensagens"
  ON chat_mensagens FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- DADOS INICIAIS (SEED)
-- ============================================================

-- UBS
INSERT INTO ubs (nome, endereco) VALUES
  ('UBS Central', 'Rua Principal, 100 - Centro'),
  ('UBS Norte', 'Av. Norte, 500 - Zona Norte'),
  ('UBS Sul', 'Rua do Sul, 200 - Zona Sul'),
  ('UBS Leste', 'Av. Leste, 300 - Zona Leste');

-- Medicos
INSERT INTO medicos (nome, especialidade) VALUES
  ('Dra. Ana', 'Clinica Geral'),
  ('Dr. Carlos', 'Cardiologia'),
  ('Dr. Paulo', 'Pediatria'),
  ('Dr. Joao', 'Ortopedia'),
  ('Dra. Maria', 'Ginecologia'),
  ('Dr. Lucas', 'Dermatologia'),
  ('Dra. Julia', 'Psicologia');

-- Pacientes
INSERT INTO pacientes (nome, cpf, numero_sus, data_nascimento, sexo, alergias, tipo_sanguineo, ultima_consulta) VALUES
  ('Jose Souza', '123.456.789-00', '1234 5678 9012', '15/03/1980', 'Masculino', ARRAY['Nenhuma'], 'O+', '10/11/2024'),
  ('Maria Lima', '987.654.321-00', '9876 5432 1098', '22/07/1990', 'Feminino', ARRAY['Penicilina'], 'A-', '05/11/2024'),
  ('Pedro Santos', '456.789.123-00', '4567 8912 3456', '10/12/1985', 'Masculino', ARRAY['Nenhuma'], 'B+', '20/10/2024'),
  ('Ana Oliveira', '789.123.456-00', '7890 1234 5678', '05/05/1995', 'Feminino', ARRAY['Dipirona'], 'AB+', '15/09/2024'),
  ('Carlos Ferreira', '321.654.987-00', '3216 5498 7012', '18/11/1978', 'Masculino', ARRAY['Nenhuma'], 'O-', '25/08/2024');

-- Consultas
INSERT INTO consultas (paciente_id, paciente_nome, data, horario, medico, especialidade, status, senha, ubs) VALUES
  (1, 'Jose Souza', TO_CHAR(NOW(), 'DD/MM/YYYY'), '08:30', 'Dra. Ana', 'Clinica Geral', 'Confirmado', 'G-108', 'UBS Central'),
  (2, 'Maria Lima', TO_CHAR(NOW(), 'DD/MM/YYYY'), '09:00', 'Dr. Carlos', 'Cardiologia', 'Aguardando', 'G-109', 'UBS Central'),
  (3, 'Pedro Santos', TO_CHAR(NOW(), 'DD/MM/YYYY'), '10:30', 'Dra. Ana', 'Clinica Geral', 'Confirmado', 'G-110', 'UBS Central'),
  (4, 'Ana Oliveira', TO_CHAR(NOW() + INTERVAL '1 day', 'DD/MM/YYYY'), '14:00', 'Dr. Paulo', 'Pediatria', 'Cancelado', '-', 'UBS Norte');

-- Historico Medico
INSERT INTO historico_medico (paciente_id, paciente_nome, data, medico, especialidade, status) VALUES
  (1, 'Jose Souza', '10/11/2024', 'Dr. Carlos', 'Cardiologia', 'Realizada'),
  (1, 'Jose Souza', '05/10/2024', 'Dra. Ana', 'Clinica Geral', 'Realizada'),
  (2, 'Maria Lima', '05/11/2024', 'Dra. Ana', 'Clinica Geral', 'Realizada'),
  (4, 'Ana Oliveira', '20/10/2024', 'Dr. Paulo', 'Pediatria', 'Realizada'),
  (4, 'Ana Oliveira', '15/09/2024', 'Dr. Carlos', 'Cardiologia', 'Realizada'),
  (5, 'Carlos Ferreira', '25/08/2024', 'Dr. Joao', 'Ortopedia', 'Realizada');

-- Estoque Vacinas (dados iniciais)
INSERT INTO estoque_vacinas (nome, lote, quantidade, validade) VALUES
  ('COVID-19 Pfizer', 'PF-2024-001', 150, '2025-06-30'),
  ('Influenza', 'IN-2024-042', 200, '2025-03-15'),
  ('Hepatite B', 'HB-2024-015', 80, '2025-12-31'),
  ('Tetano', 'TT-2024-008', 120, '2026-01-15'),
  ('Febre Amarela', 'FA-2024-023', 60, '2025-09-20');

-- Estoque Medicamentos (dados iniciais)
INSERT INTO estoque_medicamentos (nome, lote, quantidade, validade) VALUES
  ('Paracetamol 500mg', 'PC-2024-100', 500, '2025-08-30'),
  ('Ibuprofeno 400mg', 'IB-2024-055', 300, '2025-11-15'),
  ('Amoxicilina 500mg', 'AM-2024-033', 150, '2025-07-20'),
  ('Losartana 50mg', 'LS-2024-078', 200, '2026-02-28'),
  ('Metformina 850mg', 'MT-2024-012', 180, '2025-10-10');

-- Exames
INSERT INTO exames (paciente_id, paciente_nome, nome, medico_solicitante, data_solicitacao, data_resultado, status, resultado, prioridade, tipo) VALUES
  (1, 'Jose Souza', 'Hemograma Completo', 'Dr. Carlos', '01/11/2024', '05/11/2024', 'Concluido', 'Valores dentro da normalidade', 'Normal', 'Sangue'),
  (2, 'Maria Lima', 'Glicemia em Jejum', 'Dra. Ana', '10/11/2024', NULL, 'Pendente', NULL, 'Normal', 'Sangue'),
  (4, 'Ana Oliveira', 'Raio-X Torax', 'Dr. Paulo', '15/10/2024', '18/10/2024', 'Concluido', 'Sem alteracoes', 'Normal', 'Imagem');

-- Filas de Atendimento
INSERT INTO filas_atendimento (posicao, paciente_nome, prioridade, tempo, senha, status, especialidade) VALUES
  (1, 'Jose Souza', 'Normal', '15 min', 'G-108', 'Em atendimento', 'Clinica Geral'),
  (2, 'Maria Lima', 'Prioritario', '25 min', 'G-109', 'Aguardando', 'Cardiologia'),
  (3, 'Pedro Santos', 'Normal', '35 min', 'G-110', 'Aguardando', 'Clinica Geral');
