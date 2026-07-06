// src/services/aplicacoesService.js
const STORAGE_KEY = 'aplicacoes_log';

const listar = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const adicionar = (aplicacao) => {
  const logs = listar();
  const novoLog = {
    ...aplicacao,
    id: Date.now(),
    data: aplicacao.data || new Date().toLocaleString(),
  };
  logs.push(novoLog);
  // Mantém apenas os últimos 200 registros para não sobrecarregar
  if (logs.length > 200) {
    logs.splice(0, logs.length - 200);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  return novoLog;
};

const limpar = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const aplicacoesService = {
  listar,
  adicionar,
  limpar,
};