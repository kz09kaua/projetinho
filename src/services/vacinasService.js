// src/services/vacinasService.js
const STORAGE_KEY = '@vacinas_pacientes';

const listar = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const salvar = (vacinas) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vacinas));
};

const obterPorPaciente = (nomePaciente) => {
  const todas = listar();
  return todas[nomePaciente] || [];
};

const adicionar = (nomePaciente, vacina) => {
  const todas = listar();
  if (!todas[nomePaciente]) {
    todas[nomePaciente] = [];
  }
  // Gera um ID único
  const novoId = Math.max(0, ...todas[nomePaciente].map(v => v.id), 0) + 1;
  const novaVacina = { ...vacina, id: novoId };
  const novasVacinas = [...todas[nomePaciente], novaVacina];
  todas[nomePaciente] = novasVacinas;
  salvar(todas);
  return novasVacinas;
};

const atualizar = (nomePaciente, vacinaId, dadosAtualizados) => {
  const todas = listar();
  if (!todas[nomePaciente]) return [];
  const index = todas[nomePaciente].findIndex(v => v.id === vacinaId);
  if (index === -1) return todas[nomePaciente];
  todas[nomePaciente][index] = { ...todas[nomePaciente][index], ...dadosAtualizados };
  salvar(todas);
  return todas[nomePaciente];
};

const deletar = (nomePaciente, vacinaId) => {
  const todas = listar();
  if (!todas[nomePaciente]) return [];
  todas[nomePaciente] = todas[nomePaciente].filter(v => v.id !== vacinaId);
  salvar(todas);
  return todas[nomePaciente];
};

export const vacinasService = {
  listar,
  salvar,
  obterPorPaciente,
  adicionar,
  atualizar,
  deletar,
};