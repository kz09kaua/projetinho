import { useState } from "react";

const FilasAtendimento = () => {
  const [fila, setFila] = useState([
    {
      posicao: 1,
      paciente: "José Souza",
      prioridade: "Normal",
      tempo: "10 min",
      senha: "G-108",
    },
    {
      posicao: 2,
      paciente: "Maria Lima",
      prioridade: "Alta",
      tempo: "5 min",
      senha: "P-042",
    },
    {
      posicao: 3,
      paciente: "Pedro Santos",
      prioridade: "Normal",
      tempo: "15 min",
      senha: "G-110",
    },
  ]);

  const [suaFila, setSuaFila] = useState({
    senha: "A-142",
    posicao: 4,
    tempo: "12 min",
    especialidade: "Clínica Geral",
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Filas de Atendimento
      </h1>
      <p className="text-gray-500 mb-6">
        Acompanhe seu status e as senhas atuais da unidade.
      </p>

      {/* Sua fila atual */}
      <div className="bg-blue-700 p-6 rounded-3xl text-white mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="bg-green-500 px-3 py-1 rounded-full text-xs">
              Atendimento Ativo
            </span>
            <h2 className="text-2xl font-bold mt-2">
              Sua Fila Atual: {suaFila.especialidade}
            </h2>
            <p className="opacity-80">
              Unidade Básica Central • Consultório 04
            </p>
            <div className="flex gap-3 mt-4">
              <button className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold">
                Ver Detalhes
              </button>
              <button className="border border-white px-5 py-2 rounded-xl">
                Sair da Fila
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur p-5 rounded-2xl text-center">
            <p className="text-sm opacity-80">SUA SENHA</p>
            <p className="text-5xl font-black">{suaFila.senha}</p>
            <div className="mt-3">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>82%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full mt-1">
                <div className="h-full w-[82%] bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm mt-2">
                Faltam {suaFila.posicao} pessoas na sua frente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outras filas */}
      <h3 className="text-xl font-bold mb-4">Outras Filas</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fila.map((item) => (
          <div
            key={item.senha}
            className="bg-white rounded-2xl p-5 shadow-sm border"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl ${item.prioridade === "Alta" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}
              >
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${item.prioridade === "Alta" ? "bg-red-100 text-red-800" : "bg-gray-100"}`}
              >
                {item.prioridade === "Alta" ? "PRIORIDADE" : "NORMAL"}
              </span>
            </div>
            <h4 className="font-bold text-lg">Clínica Geral</h4>
            <div className="grid grid-cols-2 gap-3 my-4">
              <div>
                <p className="text-xs text-gray-400">Senha Atual</p>
                <p className="text-xl font-bold">{item.senha}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Espera Méd.</p>
                <p className="text-xl font-bold">{item.tempo}</p>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-700 text-white rounded-xl font-semibold">
              Entrar na Fila
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilasAtendimento;
