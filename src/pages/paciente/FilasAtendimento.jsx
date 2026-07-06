// src/pages/paciente/FilasAtendimento.jsx
import { useState, useEffect, useCallback } from "react";
import {
  HiUser, HiClock, HiCheckCircle, HiEye, HiRefresh,
  HiLogout, HiInformationCircle, HiArrowRight,
} from "react-icons/hi";
import { FaStethoscope, FaUserMd, FaHospitalAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";
import { filasService } from "../../services/filasService";

// Função para remover acentos
const removerAcentos = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Mapeamento de sinônimos para nomes padronizados
const MAPA_ESPECIALIDADES = {
  "cardiologista": "Cardiologista",
  "clinica geral": "Clínica Geral",
  "clinico geral": "Clínica Geral",
  "ginecologista": "Ginecologista",
  "urologista": "Urologista",
  "pediatra": "Pediatra",
  "ortopedista": "Ortopedista",
  "dermatologista": "Dermatologista",
  "oftalmologista": "Oftalmologista",
  "psicologo": "Psicólogo",
  "psicologia": "Psicólogo",
  "a agendar": null,
  "agendar": null,
};

// === LISTA FIXA DE ESPECIALIDADES PARA EXIBIR ===
const ESPECIALIDADES_FIXAS = [
  { especialidade: "Cardiologista", tempoMedio: "8 min", senhaAtual: "C-101" },
  { especialidade: "Clínica Geral", tempoMedio: "6 min", senhaAtual: "CG-205" },
  { especialidade: "Ginecologista", tempoMedio: "10 min", senhaAtual: "G-312" },
  { especialidade: "Urologista", tempoMedio: "7 min", senhaAtual: "U-418" },
  { especialidade: "Pediatra", tempoMedio: "9 min", senhaAtual: "P-529" },
  { especialidade: "Ortopedista", tempoMedio: "12 min", senhaAtual: "O-631" },
  { especialidade: "Dermatologista", tempoMedio: "11 min", senhaAtual: "D-742" },
  { especialidade: "Oftalmologista", tempoMedio: "8 min", senhaAtual: "OF-853" },
  { especialidade: "Psicólogo", tempoMedio: "15 min", senhaAtual: "PS-964" },
];

const FilasAtendimento = () => {
  const auth = useAuth();
  const user = auth?.user;

  const [filasAgrupadas, setFilasAgrupadas] = useState([]);
  const [suaFila, setSuaFila] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizarEspecialidade = (nome) => {
    if (!nome) return null;
    const chave = removerAcentos(nome).toLowerCase().trim();
    if (MAPA_ESPECIALIDADES[chave] !== undefined) return MAPA_ESPECIALIDADES[chave];
    for (const [key, value] of Object.entries(MAPA_ESPECIALIDADES)) {
      if (chave.includes(key) || key.includes(chave)) return value;
    }
    return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  };

  // ===== CARREGA E MESCLA COM ESPECIALIDADES FIXAS =====
  const carregarFilas = useCallback(async () => {
    try {
      setError(null);
      const todas = await filasService.listar();

      const minha = todas.find(f => f.paciente === user?.name);
      setSuaFila(minha || null);

      const outras = todas.filter(f => f.paciente !== user?.name);

      // 1. Agrupa filas reais
      const gruposReais = {};
      outras.forEach(f => {
        let esp = normalizarEspecialidade(f.especialidade);
        if (!esp) return;
        if (!gruposReais[esp]) gruposReais[esp] = [];
        gruposReais[esp].push(f);
      });

      // 2. Converte para objetos
      const filasExistentes = Object.keys(gruposReais).map(esp => {
        const lista = gruposReais[esp];
        lista.sort((a, b) => (a.posicao || 0) - (b.posicao || 0));
        const primeiro = lista[0];
        return {
          especialidade: esp,
          total: lista.length,
          senhaAtual: primeiro?.senha || "---",
          tempoMedio: primeiro?.tempo || "5 min",
          pacientes: lista,
        };
      });

      // 3. Cria um mapa das existentes
      const mapaExistentes = {};
      filasExistentes.forEach(f => mapaExistentes[f.especialidade] = f);

      // 4. Monta a lista final mesclando com as fixas
      const listaFinal = ESPECIALIDADES_FIXAS.map(fixa => {
        if (mapaExistentes[fixa.especialidade]) {
          // Se já existe, usa os dados reais (mantém total e pacientes)
          return mapaExistentes[fixa.especialidade];
        } else {
          // Se não existe, cria com 0 pacientes
          return {
            especialidade: fixa.especialidade,
            total: 0,
            senhaAtual: fixa.senhaAtual,
            tempoMedio: fixa.tempoMedio,
            pacientes: [],
          };
        }
      });

      // Ordena por total (mais cheias primeiro)
      listaFinal.sort((a, b) => b.total - a.total);

      setFilasAgrupadas(listaFinal);
    } catch (err) {
      console.error("Erro ao carregar filas:", err);
      setError("Erro ao carregar filas. Tente novamente.");
    }
  }, [user]);

  useEffect(() => {
    if (user) carregarFilas();
    else {
      setFilasAgrupadas([]);
      setSuaFila(null);
    }
  }, [user, carregarFilas]);

  // ===== ENTRA NA FILA (cria se não existir) =====
  const handleEntrarFila = async (grupo) => {
    if (!user) {
      Swal.fire("Erro", "Usuário não autenticado.", "error");
      return;
    }
    if (loading) return;

    const especialidade = grupo.especialidade;

    if (suaFila && suaFila.especialidade === especialidade) {
      Swal.fire("Aviso", "Você já está nesta fila.", "info");
      return;
    }

    if (suaFila) {
      const result = await Swal.fire({
        title: "Trocar de fila?",
        text: `Você está na fila de ${suaFila.especialidade}. Deseja ir para ${especialidade}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, trocar",
        cancelButtonText: "Cancelar",
      });
      if (!result.isConfirmed) return;

      setLoading(true);
      try {
        await filasService.remover(suaFila.id);
        setSuaFila(null);
        await carregarFilas();
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível sair da fila atual.", "error");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const todas = await filasService.listar();
      const daEspecialidade = todas.filter(f => f.especialidade === especialidade && f.paciente !== user.name);
      const novaPosicao = daEspecialidade.length + 1;

      const nova = await filasService.adicionar({
        paciente: user.name,
        prioridade: "Normal",
        tempo: grupo.tempoMedio || "5 min",
        senha: `P-${Math.floor(Math.random() * 900) + 100}`,
        especialidade: especialidade,
        status: "Aguardando",
        posicao: novaPosicao,
      });

      setSuaFila(nova);
      await carregarFilas();

      Swal.fire({
        icon: "success",
        title: "Entrou na fila!",
        text: `Posição ${novaPosicao} na fila de ${especialidade}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Erro", "Não foi possível entrar na fila.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSairFila = async () => {
    if (!suaFila) return;
    if (loading) return;

    const result = await Swal.fire({
      title: "Sair da fila?",
      text: `Você sairá da fila de ${suaFila.especialidade}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sim, sair",
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await filasService.remover(suaFila.id);
        setSuaFila(null);
        await carregarFilas();
        Swal.fire({
          icon: "info",
          title: "Fila cancelada",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível sair da fila.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const verDetalhesGrupo = (grupo) => {
    const pacientesList = grupo.pacientes.length > 0
      ? grupo.pacientes.map(p => `• ${p.paciente} (Senha: ${p.senha})`).join('<br>')
      : "Nenhum paciente no momento.";

    Swal.fire({
      title: `Fila - ${grupo.especialidade}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Total de pacientes:</strong> ${grupo.total}</p>
          <p><strong>Senha atual:</strong> ${grupo.senhaAtual}</p>
          <p><strong>Tempo médio:</strong> ${grupo.tempoMedio}</p>
          <hr>
          <p><strong>Pacientes na fila:</strong></p>
          <div style="font-size:0.9rem;">${pacientesList}</div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
    });
  };

  const verDetalhesSuaFila = () => {
    if (!suaFila) return;
    Swal.fire({
      title: "Sua Fila",
      html: `<div style="text-align:left; line-height:1.8;">
        <p><strong>Especialidade:</strong> ${suaFila.especialidade}</p>
        <p><strong>Senha:</strong> ${suaFila.senha}</p>
        <p><strong>Posição:</strong> ${suaFila.posicao}º</p>
        <p><strong>Tempo estimado:</strong> ${suaFila.tempo}</p>
      </div>`,
      icon: "info",
      confirmButtonColor: "#2563eb",
    });
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button onClick={carregarFilas} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaHospitalAlt className="text-blue-600" /> Filas de Atendimento
            </h1>
            <p className="text-gray-500 flex items-center gap-1">
              <FaUserMd className="text-blue-400" /> Acompanhe seu status e as senhas atuais da unidade.
            </p>
          </div>
          <button
            onClick={carregarFilas}
            disabled={loading}
            className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm transition-all disabled:opacity-50"
          >
            <HiRefresh className={loading ? "animate-spin" : ""} /> Atualizar Filas
          </button>
        </div>

        {/* Minha Fila */}
        {suaFila ? (
          <div className="relative bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 mb-10 text-white shadow-xl overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10"><FaHospitalAlt size={160} /></div>
            <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="bg-green-400/30 px-4 py-1.5 rounded-full text-xs font-bold">ATENDIMENTO ATIVO</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Posição {suaFila.posicao}º</span>
                </div>
                <h2 className="text-2xl font-bold">{suaFila.especialidade}</h2>
                <p className="opacity-80 text-sm">Senha {suaFila.senha} • {suaFila.tempo} de espera</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button onClick={verDetalhesSuaFila} className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition shadow-md flex items-center gap-2">
                    <HiInformationCircle /> Detalhes
                  </button>
                  <button onClick={handleSairFila} disabled={loading} className="border border-white/60 hover:bg-white/10 px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 disabled:opacity-50">
                    <HiLogout /> Sair da Fila
                  </button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl text-center">
                <p className="text-sm opacity-80 uppercase tracking-wider">Sua Senha</p>
                <p className="text-5xl font-black tracking-wider">{suaFila.senha}</p>
                <div className="mt-3">
                  <div className="h-2 bg-white/30 rounded-full">
                    <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 100 - ((suaFila.posicao - 1) * 20))}%` }} />
                  </div>
                  <p className="text-sm mt-2 opacity-80">Faltam {suaFila.posicao - 1} pessoa(s) na sua frente</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10 text-center shadow-sm">
            <HiUser className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Você não está em nenhuma fila no momento.</p>
            <p className="text-sm text-gray-400 mt-1">Escolha uma das filas abaixo para entrar.</p>
          </div>
        )}

        {/* Filas Disponíveis (agrupadas) */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaStethoscope className="text-blue-600" /> Filas Disponíveis
          </h3>
          <span className="text-sm text-gray-400 bg-white px-4 py-1.5 rounded-full shadow-sm">{filasAgrupadas.length} especialidades</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filasAgrupadas.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 bg-white rounded-2xl p-8 border">
              <p>Não há filas disponíveis no momento.</p>
            </div>
          ) : (
            filasAgrupadas.map((grupo) => {
              const isActive = suaFila && suaFila.especialidade === grupo.especialidade;
              const isFull = grupo.total >= 20;
              const isEmpty = grupo.total === 0;
              return (
                <div key={grupo.especialidade} className={`group bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isActive ? "border-blue-400 shadow-md ring-1 ring-blue-200" : isFull ? "border-red-200" : isEmpty ? "border-gray-300 opacity-70" : "border-gray-200 hover:border-blue-300"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
                      <FaStethoscope size={24} />
                    </div>
                    <div className="flex gap-2">
                      {isActive && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Você está aqui</span>}
                      {isFull && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">Fila cheia</span>}
                      {isEmpty && <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-semibold">Vazia</span>}
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">{grupo.total} pacientes</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg">{grupo.especialidade}</h4>
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div><p className="text-xs text-gray-400">Senha Atual</p><p className="text-xl font-bold text-blue-700">{grupo.senhaAtual}</p></div>
                    <div><p className="text-xs text-gray-400">Espera Méd.</p><p className="text-xl font-bold flex items-center gap-1"><HiClock className="text-blue-500" /> {grupo.tempoMedio}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEntrarFila(grupo)}
                      disabled={loading || isFull}
                      className={`flex-1 py-2.5 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2 ${isActive ? "bg-green-100 text-green-700 cursor-default" : isFull ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    >
                      {loading ? "..." : isActive ? <HiCheckCircle className="text-green-600" /> : <HiArrowRight />}
                      {isActive ? "Na Fila" : isFull ? "Lotada" : "Entrar"}
                    </button>
                    <button onClick={() => verDetalhesGrupo(grupo)} className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition" title="Ver detalhes">
                      <HiEye size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FilasAtendimento;