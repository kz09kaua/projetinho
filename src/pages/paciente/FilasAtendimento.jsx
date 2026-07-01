// src/pages/FilasAtendimento.jsx
import { useState } from "react";
import {
  HiUser,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiEye,
  HiRefresh,
  HiLogout,
  HiInformationCircle,
} from "react-icons/hi";
import { FaStethoscope, FaUserMd, FaHospitalAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const FilasAtendimento = () => {
  const [outrasFilas, setOutrasFilas] = useState([
    {
      id: 1,
      especialidade: "Clínica Geral",
      prioridade: "Normal",
      senha: "G-108",
      tempo: "10 min",
      pessoasNaFila: 5,
      consultorio: "04",
      ubs: "UBS Santa Cecília - Central",
    },
    {
      id: 2,
      especialidade: "Pediatria",
      prioridade: "Normal",
      senha: "G-110",
      tempo: "15 min",
      pessoasNaFila: 8,
      consultorio: "07",
      ubs: "UBS Vila Maria - Norte",
    },
    {
      id: 3,
      especialidade: "Cardiologia",
      prioridade: "Alta",
      senha: "P-056",
      tempo: "8 min",
      pessoasNaFila: 3,
      consultorio: "05",
      ubs: "UBS Santa Cecília - Central",
    },
    {
      id: 4,
      especialidade: "Ortopedia",
      prioridade: "Normal",
      senha: "G-125",
      tempo: "20 min",
      pessoasNaFila: 6,
      consultorio: "09",
      ubs: "UBS São Cristóvão - Sul",
    },
    // Adicionei uma fila de Clínica Geral com prioridade Alta, mas com nome diferente para não confundir
    // Caso queira manter apenas uma, remova a de id 5 ou ajuste a especialidade.
    {
      id: 5,
      especialidade: "Clínica Geral - Prioritária",
      prioridade: "Alta",
      senha: "P-042",
      tempo: "5 min",
      pessoasNaFila: 2,
      consultorio: "02",
      ubs: "UBS Santa Cecília - Central",
    },
  ]);

  const [suaFila, setSuaFila] = useState({
    senha: "A-142",
    posicao: 4,
    tempo: "12 min",
    especialidade: "Clínica Geral",
    consultorio: "04",
    prioridade: "Normal",
    ubs: "UBS Santa Cecília - Central",
  });

  const [loading, setLoading] = useState(false);

  const handleEntrarFila = (fila) => {
    if (suaFila) {
      Swal.fire({
        title: "Você já está em uma fila",
        text: "Deseja sair da fila atual e entrar nesta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, trocar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          setTimeout(() => {
            setSuaFila({
              senha: fila.senha,
              posicao: Math.floor(Math.random() * 5) + 1,
              tempo: fila.tempo,
              especialidade: fila.especialidade,
              consultorio: fila.consultorio,
              prioridade: fila.prioridade,
              ubs: fila.ubs,
            });
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "Fila atualizada!",
              text: `Você entrou na fila de ${fila.especialidade}.`,
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
          }, 800);
        }
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSuaFila({
        senha: fila.senha,
        posicao: Math.floor(Math.random() * 5) + 1,
        tempo: fila.tempo,
        especialidade: fila.especialidade,
        consultorio: fila.consultorio,
        prioridade: fila.prioridade,
        ubs: fila.ubs,
      });
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Fila atualizada!",
        text: `Você entrou na fila de ${fila.especialidade}.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }, 800);
  };

  const handleSairFila = () => {
    Swal.fire({
      title: "Sair da fila?",
      text: "Você perderá sua posição atual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setSuaFila(null);
        Swal.fire({
          icon: "info",
          title: "Fila cancelada",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const verDetalhesFila = (fila) => {
    Swal.fire({
      title: `Detalhes - ${fila.especialidade}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Especialidade:</strong> ${fila.especialidade}</p>
          <p><strong>Prioridade:</strong> ${fila.prioridade}</p>
          <p><strong>Senha atual:</strong> ${fila.senha}</p>
          <p><strong>Tempo estimado:</strong> ${fila.tempo}</p>
          <p><strong>Pessoas na fila:</strong> ${fila.pessoasNaFila}</p>
          <p><strong>Consultório:</strong> ${fila.consultorio}</p>
          <p><strong>UBS:</strong> ${fila.ubs}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  const handleAtualizarFilas = () => {
    Swal.fire({
      title: "Atualizando filas...",
      text: "Buscando informações mais recentes.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1200,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        setTimeout(() => {
          const novasFilas = outrasFilas.map((f) => ({
            ...f,
            senha: `${f.senha.split("-")[0]}-${Math.floor(Math.random() * 900 + 100)}`,
            tempo: `${Math.floor(Math.random() * 20 + 5)} min`,
            pessoasNaFila: Math.floor(Math.random() * 10 + 1),
          }));
          setOutrasFilas(novasFilas);
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Filas atualizadas!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
        }, 1000);
      },
    });
  };

  const verDetalhesSuaFila = () => {
    if (!suaFila) return;
    Swal.fire({
      title: "Sua Fila",
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Especialidade:</strong> ${suaFila.especialidade}</p>
          <p><strong>Senha:</strong> ${suaFila.senha}</p>
          <p><strong>Posição:</strong> ${suaFila.posicao}º</p>
          <p><strong>Tempo estimado:</strong> ${suaFila.tempo}</p>
          <p><strong>Consultório:</strong> ${suaFila.consultorio || "Não informado"}</p>
          <p><strong>Prioridade:</strong> ${suaFila.prioridade || "Normal"}</p>
          <p><strong>UBS:</strong> ${suaFila.ubs || "Não informada"}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
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
            onClick={handleAtualizarFilas}
            className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm transition-all hover:shadow-md"
          >
            <HiRefresh className="text-lg" /> Atualizar Filas
          </button>
        </div>

        {/* Fila atual do paciente */}
        {suaFila ? (
          <div className="relative bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 mb-10 text-white shadow-xl overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <FaHospitalAlt size={160} />
            </div>
            <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="bg-green-400/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold border border-green-300/30">
                    {suaFila.prioridade === "Alta" ? "PRIORIDADE" : "ATENDIMENTO ATIVO"}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    Posição {suaFila.posicao}º
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    {suaFila.ubs}
                  </span>
                </div>
                <h2 className="text-2xl font-bold">{suaFila.especialidade}</h2>
                <p className="opacity-80 text-sm">
                  UBS {suaFila.ubs} • Consultório {suaFila.consultorio || "04"}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={verDetalhesSuaFila}
                    className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition shadow-md flex items-center gap-2"
                  >
                    <HiInformationCircle /> Detalhes
                  </button>
                  <button
                    onClick={handleSairFila}
                    className="border border-white/60 hover:bg-white/10 px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2"
                  >
                    <HiLogout /> Sair da Fila
                  </button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl text-center">
                <p className="text-sm opacity-80 uppercase tracking-wider">Sua Senha</p>
                <p className="text-5xl font-black tracking-wider">{suaFila.senha}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{Math.min(100, 100 - (suaFila.posicao - 1) * 20)}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full mt-1">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, 100 - (suaFila.posicao - 1) * 20)}%` }}
                    />
                  </div>
                  <p className="text-sm mt-2 opacity-80">
                    Faltam {suaFila.posicao} pessoa(s) na sua frente
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10 text-center shadow-sm">
            <HiUser className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Você não está em nenhuma fila no momento.</p>
            <p className="text-sm text-gray-400 mt-1">
              Escolha uma das filas abaixo para entrar.
            </p>
          </div>
        )}

        {/* Outras filas */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaStethoscope className="text-blue-600" /> Filas Disponíveis
          </h3>
          <span className="text-sm text-gray-400 bg-white px-4 py-1.5 rounded-full shadow-sm">
            {outrasFilas.length} filas ativas
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outrasFilas.map((fila) => {
            const isActive = suaFila && suaFila.especialidade === fila.especialidade;
            return (
              <div
                key={fila.id}
                className={`group bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isActive
                    ? "border-blue-400 shadow-md ring-1 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 rounded-xl ${
                      fila.prioridade === "Alta"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <FaStethoscope size={24} />
                  </div>
                 
                </div>
                <h4 className="font-bold text-lg">{fila.especialidade}</h4>
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div>
                    <p className="text-xs text-gray-400">Senha Atual</p>
                    <p className="text-xl font-bold text-blue-700">{fila.senha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Espera Méd.</p>
                    <p className="text-xl font-bold flex items-center gap-1">
                      <HiClock className="text-blue-500" /> {fila.tempo}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                  <HiUser className="text-gray-400" />
                  <span>{fila.pessoasNaFila} pessoa(s)</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>Consultório {fila.consultorio}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-xs bg-blue-50 px-2 py-0.5 rounded-full text-blue-700">
                    {fila.ubs}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEntrarFila(fila)}
                    disabled={loading}
                    className={`flex-1 py-2.5 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2 ${
                      isActive
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                    }`}
                  >
                    {loading ? (
                      <span className="animate-spin">🌀</span>
                    ) : isActive ? (
                      <HiCheckCircle className="text-green-600" />
                    ) : (
                      <HiArrowRight />
                    )}
                    {isActive ? "Na Fila" : "Entrar"}
                  </button>
                  <button
                    onClick={() => verDetalhesFila(fila)}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition"
                    title="Ver detalhes"
                  >
                    <HiEye size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé */}
        <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          <p>
            <HiInformationCircle className="inline mr-1" /> As filas são atualizadas em tempo real.
            As senhas e tempos são estimados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilasAtendimento;