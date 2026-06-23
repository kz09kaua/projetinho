// src/pages/FilasAtendimento.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiUser,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiEye,
} from "react-icons/hi";
import { FaStethoscope } from "react-icons/fa";
import Swal from "sweetalert2";

const FilasAtendimento = () => {
  const [outrasFilas] = useState([
    {
      id: 1,
      especialidade: "Clínica Geral",
      prioridade: "Normal",
      senha: "G-108",
      tempo: "10 min",
    },
    {
      id: 2,
      especialidade: "Clínica Geral",
      prioridade: "Alta",
      senha: "P-042",
      tempo: "5 min",
    },
    {
      id: 3,
      especialidade: "Pediatria",
      prioridade: "Normal",
      senha: "G-110",
      tempo: "15 min",
    },
  ]);

  const [suaFila] = useState({
    senha: "A-142",
    posicao: 4,
    tempo: "12 min",
    especialidade: "Clínica Geral",
  });

  const handleEntrarFila = (fila) => {
    Swal.fire({
      title: `Entrar na fila de ${fila.especialidade}?`,
      text: `Prioridade: ${fila.prioridade} | Tempo estimado: ${fila.tempo}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, entrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
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
      }
    });
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
      title: `Detalhes da fila - ${fila.especialidade}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Especialidade:</strong> ${fila.especialidade}</p>
          <p><strong>Prioridade:</strong> ${fila.prioridade}</p>
          <p><strong>Senha atual:</strong> ${fila.senha}</p>
          <p><strong>Tempo estimado:</strong> ${fila.tempo}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HiUser className="text-blue-600" /> Filas de Atendimento
          </h1>
          <p className="text-gray-500 mb-6">
            Acompanhe seu status e as senhas atuais da unidade.
          </p>
        </div>

        {/* Sua fila atual */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 mb-8 text-white shadow-lg">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="bg-green-500 px-4 py-1.5 rounded-full text-xs font-bold inline-block">
                Atendimento Ativo
              </span>
              <h2 className="text-2xl font-bold mt-3">
                Sua Fila Atual: {suaFila.especialidade}
              </h2>
              <p className="opacity-80">
                Unidade Básica Central • Consultório 04
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Detalhes da sua fila",
                      html: `
                        <div style="text-align:left; line-height:1.8;">
                          <p><strong>Senha:</strong> ${suaFila.senha}</p>
                          <p><strong>Posição:</strong> ${suaFila.posicao}º</p>
                          <p><strong>Tempo estimado:</strong> ${suaFila.tempo}</p>
                          <p><strong>Especialidade:</strong> ${suaFila.especialidade}</p>
                        </div>
                      `,
                      icon: "info",
                      confirmButtonColor: "#2563eb",
                      confirmButtonText: "Fechar",
                    });
                  }}
                  className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition shadow-md"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={handleSairFila}
                  className="border border-white hover:bg-white/10 px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  Sair da Fila
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl text-center">
              <p className="text-sm opacity-80">SUA SENHA</p>
              <p className="text-5xl font-black">{suaFila.senha}</p>
              <div className="mt-3">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>82%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full mt-1">
                  <div className="h-full w-[82%] bg-green-400 rounded-full" />
                </div>
                <p className="text-sm mt-2">
                  Faltam {suaFila.posicao} pessoas na sua frente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Outras filas */}
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaStethoscope className="text-blue-600" /> Outras Filas
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outrasFilas.map((fila) => (
            <div
              key={fila.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-lg transition hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    fila.prioridade === "Alta"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaStethoscope size={24} />
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    fila.prioridade === "Alta"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {fila.prioridade === "Alta" ? "PRIORIDADE" : "NORMAL"}
                </span>
              </div>
              <h4 className="font-bold text-lg">{fila.especialidade}</h4>
              <div className="grid grid-cols-2 gap-3 my-4">
                <div>
                  <p className="text-xs text-gray-400">Senha Atual</p>
                  <p className="text-xl font-bold">{fila.senha}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Espera Méd.</p>
                  <p className="text-xl font-bold text-blue-700">
                    {fila.tempo}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEntrarFila(fila)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-sm"
                >
                  Entrar na Fila
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilasAtendimento;
