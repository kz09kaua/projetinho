// src/services/dispensacoesService.js
const STORAGE_KEY = '@dispensacoes_log';

const listar = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const adicionar = (dispensacao) => {
  const logs = listar();
  const novoLog = {
    ...dispensacao,
    id: Date.now(),
    data: dispensacao.data || new Date().toLocaleString(),
  };
  logs.push(novoLog);
  // Mantém apenas os últimos 300 registros
  if (logs.length > 300) {
    logs.splice(0, logs.length - 300);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  return novoLog;
};

const limpar = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const dispensacoesService = {
  listar,
  adicionar,
  limpar,
};