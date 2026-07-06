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

const FilasAtendimento = () => {
  const auth = useAuth();
  const user = auth?.user;

  const [outrasFilas, setOutrasFilas] = useState([]);
  const [suaFila, setSuaFila] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarFilas = useCallback(async () => {
    try {
      setError(null);
      const filas = await filasService.listar();
      const minha = filas.find(f => f.paciente === user?.name);
      const restante = filas.filter(f => f.paciente !== user?.name);
      setSuaFila(minha || null);
      setOutrasFilas(restante);
    } catch (err) {
      console.error("Erro ao carregar filas:", err);
      setError("Erro ao carregar filas. Tente novamente.");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      carregarFilas();
    } else {
      setOutrasFilas([]);
      setSuaFila(null);
    }
  }, [user, carregarFilas]);

  const handleEntrarFila = async (fila) => {
    if (!user) {
      Swal.fire("Erro", "Usuário não autenticado.", "error");
      return;
    }
    if (suaFila) {
      const result = await Swal.fire({
        title: "Você já está em uma fila",
        text: "Deseja sair da fila atual e entrar nesta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, trocar",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await filasService.remover(suaFila.id);
          const filasEspecialidade = outrasFilas.filter(f => f.especialidade === fila.especialidade);
          const novaPosicao = filasEspecialidade.length + 1;
          const nova = await filasService.adicionar({
            paciente: user.name,
            prioridade: "Normal",
            tempo: "5 min",
            senha: `P-${Math.floor(Math.random() * 900) + 100}`,
            especialidade: fila.especialidade,
            status: "Aguardando",
            posicao: novaPosicao,
          });
          setSuaFila(nova);
          Swal.fire({ icon: "success", title: "Fila atualizada!", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
          await carregarFilas();
        } catch (err) {
          console.error(err);
          Swal.fire("Erro", "Não foi possível entrar na fila.", "error");
        } finally {
          setLoading(false);
        }
      }
    } else {
      setLoading(true);
      try {
        const filasEspecialidade = outrasFilas.filter(f => f.especialidade === fila.especialidade);
        const novaPosicao = filasEspecialidade.length + 1;
        const nova = await filasService.adicionar({
          paciente: user.name,
          prioridade: "Normal",
          tempo: "5 min",
          senha: `P-${Math.floor(Math.random() * 900) + 100}`,
          especialidade: fila.especialidade,
          status: "Aguardando",
          posicao: novaPosicao,
        });
        setSuaFila(nova);
        Swal.fire({ icon: "success", title: "Você entrou na fila!", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
        await carregarFilas();
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível entrar na fila.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSairFila = async () => {
    if (!suaFila) return;
    const result = await Swal.fire({
      title: "Sair da fila?",
      text: "Você perderá sua posição atual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sim, sair",
    });
    if (result.isConfirmed) {
      try {
        await filasService.remover(suaFila.id);
        setSuaFila(null);
        Swal.fire({ icon: "info", title: "Fila cancelada", toast: true, position: "top-end", showConfirmButton: false, timer: 1500 });
        await carregarFilas();
      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível sair da fila.", "error");
      }
    }
  };

  const verDetalhesFila = (fila) => {
    Swal.fire({
      title: `Detalhes - ${fila.especialidade}`,
      html: `<div style="text-align:left; line-height:1.8;">
        <p><strong>Especialidade:</strong> ${fila.especialidade}</p>
        <p><strong>Prioridade:</strong> ${fila.prioridade}</p>
        <p><strong>Senha atual:</strong> ${fila.senha}</p>
        <p><strong>Tempo estimado:</strong> ${fila.tempo}</p>
        <p><strong>Posição:</strong> ${fila.posicao ?? "—"}</p>
        <p><strong>Status:</strong> ${fila.status}</p>
      </div>`,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
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
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
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
          <button onClick={carregarFilas} className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm transition-all">
            <HiRefresh /> Atualizar Filas
          </button>
        </div>

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
                  <button onClick={handleSairFila} className="border border-white/60 hover:bg-white/10 px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2">
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
                  <p className="text-sm mt-2 opacity-80">Faltam {suaFila.posicao} pessoa(s) na sua frente</p>
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

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaStethoscope className="text-blue-600" /> Filas Disponíveis
          </h3>
          <span className="text-sm text-gray-400 bg-white px-4 py-1.5 rounded-full shadow-sm">{outrasFilas.length} filas ativas</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outrasFilas.map((fila) => {
            const isActive = suaFila && suaFila.especialidade === fila.especialidade;
            return (
              <div key={fila.id} className={`group bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isActive ? "border-blue-400 shadow-md ring-1 ring-blue-200" : "border-gray-200 hover:border-blue-300"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${fila.prioridade === "Alta" ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}`}>
                    <FaStethoscope size={24} />
                  </div>
                  {isActive && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Você está aqui</span>}
                </div>
                <h4 className="font-bold text-lg">{fila.especialidade}</h4>
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div><p className="text-xs text-gray-400">Senha Atual</p><p className="text-xl font-bold text-blue-700">{fila.senha}</p></div>
                  <div><p className="text-xs text-gray-400">Espera Méd.</p><p className="text-xl font-bold flex items-center gap-1"><HiClock className="text-blue-500" /> {fila.tempo}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEntrarFila(fila)} disabled={loading} className={`flex-1 py-2.5 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2 ${isActive ? "bg-green-100 text-green-700" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                    {loading ? "..." : isActive ? <HiCheckCircle className="text-green-600" /> : <HiArrowRight />}
                    {isActive ? "Na Fila" : "Entrar"}
                  </button>
                  <button onClick={() => verDetalhesFila(fila)} className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition" title="Ver detalhes">
                    <HiEye size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilasAtendimento;