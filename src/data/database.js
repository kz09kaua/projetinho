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
      for (const key of Object.values(STORES)) {
        if (!db[key]) db[key] = [];
      }
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

// Apenas os dados mínimos para o sistema funcionar (usuários e UBS)
const demoUsers = [
  {
    id: 1, nome: "Admin UBS", email: "admin@ubs.com", senha_hash: "123456",
    cpf: "11111111111", telefone: "11999999999", data_nascimento: "01/01/1980",
    endereco: "Rua Admin, 100 - Centro", role: "admin", created_at: new Date().toISOString()
  },
  {
    id: 2, nome: "Atendente UBS", email: "atendente@ubs.com", senha_hash: "123456",
    cpf: "22222222222", telefone: "11988888888", data_nascimento: "01/02/1985",
    endereco: "Rua Atendente, 200 - Centro", role: "atendente", created_at: new Date().toISOString()
  },
  {
    id: 3, nome: "Paciente User", email: "paciente@email.com", senha_hash: "123456",
    cpf: "33333333333", telefone: "11977777777", data_nascimento: "01/03/1990",
    endereco: "Rua Paciente, 300 - Centro", role: "paciente", created_at: new Date().toISOString()
  },
];

export async function initDatabase() {
  initDb();

  // 1. Insere os usuários padrão (se não existirem)
  if ((db[STORES.profiles] || []).length === 0) {
    for (const usuario of demoUsers) await insert(STORES.profiles, usuario);
  }

  // 2. Insere as UBS e médicos (apenas uma vez)
  if ((db[STORES.ubs] || []).length === 0) {
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
  }

  // 3. Nenhum dado de demonstração é inserido nas outras tabelas!
  //    (pacientes, consultas, filas, histórico, exames, estoques permanecem vazios)

  console.log("Banco de dados pronto – apenas usuários e UBS carregados.");
}

export { db, STORES };