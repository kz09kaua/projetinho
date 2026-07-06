const STORAGE_KEY = "minha_ubs_data_v5";

const STORES = {
  profiles: "profiles",
  pacientes: "pacientes",
  consultas: "consultas",
  historico_medico: "historico_medico",
  filas_atendimento: "filas_atendimento",
  estoque_vacinas: "estoque_vacinas",
  estoque_medicamentos: "estoque_medicamentos",
  exames: "exames",
  ubs: "ubs",
  medicos: "medicos",
  chat_mensagens: "chat_mensagens",
};

let db = {};

function initDb() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      db = JSON.parse(stored);
    } else {
      db = {};
      for (const key of Object.values(STORES)) {
        db[key] = [];
      }
      saveDb();
    }
  } catch (e) {
    console.error("Erro ao ler do localStorage:", e);
    db = {};
    for (const key of Object.values(STORES)) {
      db[key] = [];
    }
  }
}

function saveDb() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Erro ao salvar no localStorage:", e);
  }
}

export async function getAll(storeName) {
  initDb();
  return db[storeName] || [];
}

export async function get(storeName, id) {
  initDb();
  return (db[storeName] || []).find(item => item.id === id) || null;
}

export async function insert(storeName, data) {
  initDb();
  if (!db[storeName]) db[storeName] = [];
  db[storeName].push(data);
  saveDb();
  return data;
}

export async function update(storeName, data) {
  initDb();
  const index = (db[storeName] || []).findIndex(item => item.id === data.id);
  if (index >= 0) {
    db[storeName][index] = data;
    saveDb();
  }
  return data;
}

export async function deleteItem(storeName, id) {
  initDb();
  db[storeName] = (db[storeName] || []).filter(item => item.id !== id);
  saveDb();
  return true;
}

export async function query(storeName, options = {}) {
  const data = await getAll(storeName);
  let results = [...data];

  if (options.eq) {
    results = results.filter(item => item[options.eq.field] === options.eq.value);
  }

  if (options.in) {
    results = results.filter(item => options.in.values.includes(item[options.in.field]));
  }

  if (options.like) {
    const regex = new RegExp(options.like.pattern.replace(/%/g, ".*"), "i");
    results = results.filter(item => regex.test(item[options.like.field] || ""));
  }

  if (options.order) {
    const [field, direction] = options.order.split(" ");
    results.sort((a, b) => {
      if (a[field] < b[field]) return direction === "desc" ? 1 : -1;
      if (a[field] > b[field]) return direction === "desc" ? -1 : 1;
      return 0;
    });
  }

  if (options.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

// Dados demo, inseridos apenas se o banco estiver vazio
const demoUsers = [
  {
    id: 1,
    nome: "Admin UBS",
    email: "admin@ubs.com",
    senha_hash: "123456",
    cpf: "11111111111",
    telefone: "11999999999",
    data_nascimento: "01/01/1980",
    endereco: "Rua Admin, 100 - Centro",
    role: "admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nome: "Atendente UBS",
    email: "atendente@ubs.com",
    senha_hash: "123456",
    cpf: "22222222222",
    telefone: "11988888888",
    data_nascimento: "01/02/1985",
    endereco: "Rua Atendente, 200 - Centro",
    role: "atendente",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    nome: "Paciente User",
    email: "paciente@email.com",
    senha_hash: "123456",
    cpf: "33333333333",
    telefone: "11977777777",
    data_nascimento: "01/03/1990",
    endereco: "Rua Paciente, 300 - Centro",
    role: "paciente",
    created_at: new Date().toISOString(),
  },
];

export async function initDatabase() {
  initDb();
  const profilesExist = (db[STORES.profiles] || []).length > 0;
  const ubsExist = (db[STORES.ubs] || []).length > 0;

  if (!profilesExist) {
    for (const usuario of demoUsers) {
      await insert(STORES.profiles, usuario);
    }
  }

  if (!ubsExist) {
    const ubsList = [
      { id: 1, nome: "UBS Central", endereco: "Rua Principal, 100 - Centro" },
      { id: 2, nome: "UBS Norte", endereco: "Av. Norte, 500 - Zona Norte" },
      { id: 3, nome: "UBS Sul", endereco: "Rua do Sul, 200 - Zona Sul" },
      { id: 4, nome: "UBS Leste", endereco: "Av. Leste, 300 - Zona Leste" },
    ];
    for (const ubs of ubsList) await insert(STORES.ubs, ubs);

    const medicosList = [
      { id: 1, nome: "Dra. Ana", especialidade: "Clinica Geral" },
      { id: 2, nome: "Dr. Carlos", especialidade: "Cardiologia" },
      { id: 3, nome: "Dr. Paulo", especialidade: "Pediatria" },
      { id: 4, nome: "Dr. Joao", especialidade: "Ortopedia" },
      { id: 5, nome: "Dra. Maria", especialidade: "Ginecologia" },
      { id: 6, nome: "Dr. Lucas", especialidade: "Dermatologia" },
      { id: 7, nome: "Dra. Julia", especialidade: "Psicologia" },
    ];
    for (const medico of medicosList) await insert(STORES.medicos, medico);

    const pacientesList = [
      { id: 1, nome: "Jose Souza", cpf: "12345678900", numero_sus: "123456789012", data_nascimento: "15/03/1980", sexo: "Masculino", alergias: ["Nenhuma"], tipo_sanguineo: "O+", ultima_consulta: "10/11/2024" },
      { id: 2, nome: "Maria Lima", cpf: "98765432100", numero_sus: "987654321098", data_nascimento: "22/07/1990", sexo: "Feminino", alergias: ["Penicilina"], tipo_sanguineo: "A-", ultima_consulta: "05/11/2024" },
    ];
    for (const paciente of pacientesList) await insert(STORES.pacientes, paciente);

    const consultasList = [
      { id: 1, paciente_id: 1, paciente_nome: "Jose Souza", data: new Date().toISOString().split("T")[0], horario: "08:30", medico: "Dra. Ana", especialidade: "Clinica Geral", status: "Confirmado", senha: "G-108", ubs: "UBS Central", observacoes: null, arquivado: false },
      { id: 2, paciente_id: 2, paciente_nome: "Maria Lima", data: new Date().toISOString().split("T")[0], horario: "09:00", medico: "Dr. Carlos", especialidade: "Cardiologia", status: "Aguardando", senha: "G-109", ubs: "UBS Central", observacoes: null, arquivado: false },
    ];
    for (const consulta of consultasList) await insert(STORES.consultas, consulta);

    const historicoList = [
      { id: 1, paciente_id: 1, paciente_nome: "Jose Souza", data: "10/11/2024", medico: "Dr. Carlos", especialidade: "Cardiologia", ubs: "UBS Central", diagnostico: null, observacao: null, status: "Realizada", arquivado: false, data_arquivo: null },
    ];
    for (const hist of historicoList) await insert(STORES.historico_medico, hist);

    const filasList = [
      { id: 1, posicao: 1, paciente_nome: "Jose Souza", prioridade: "Normal", tempo: "15 min", senha: "G-108", status: "Em atendimento", especialidade: "Clinica Geral" },
      { id: 2, posicao: 2, paciente_nome: "Maria Lima", prioridade: "Prioritario", tempo: "25 min", senha: "G-109", status: "Aguardando", especialidade: "Cardiologia" },
    ];
    for (const fila of filasList) await insert(STORES.filas_atendimento, fila);

    const vacinasList = [
      { id: 1, nome: "COVID-19 Pfizer", lote: "PF-2024-001", quantidade: 150, validade: "2025-06-30" },
      { id: 2, nome: "Influenza", lote: "IN-2024-042", quantidade: 200, validade: "2025-03-15" },
    ];
    for (const vacina of vacinasList) await insert(STORES.estoque_vacinas, vacina);

    const medicamentosList = [
      { id: 1, nome: "Paracetamol 500mg", lote: "PC-2024-100", quantidade: 500, validade: "2025-08-30" },
      { id: 2, nome: "Ibuprofeno 400mg", lote: "IB-2024-055", quantidade: 300, validade: "2025-11-15" },
    ];
    for (const med of medicamentosList) await insert(STORES.estoque_medicamentos, med);

    const examesList = [
      { id: 1, paciente_id: 1, paciente_nome: "Jose Souza", nome: "Hemograma Completo", medico_solicitante: "Dr. Carlos", data_solicitacao: "01/11/2024", data_resultado: "05/11/2024", status: "Concluido", resultado: "Valores dentro da normalidade", prioridade: "Normal", tipo: "Sangue", arquivado: false },
    ];
    for (const exame of examesList) await insert(STORES.exames, exame);

    await insert(STORES.chat_mensagens, []);
  }

  console.log("Banco de dados pronto.");
}

export { db, STORES };