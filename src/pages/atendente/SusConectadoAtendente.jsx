// src/pages/SusConectadoAtendente.jsx
import { useState, useEffect } from "react";
import {
  HiCloud,
  HiRefresh,
  HiDatabase,
  HiClock,
  HiUsers,
  HiClipboardList,
  HiCalendar,
  HiLocationMarker,
  HiDocumentText,
  HiTrendingUp,
  HiSearch,
  HiUser,
  HiX,
  HiPhotograph,
  HiHeart,
  HiShieldCheck,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext";

const SusConectadoAtendente = () => {
  const { user } = useAuth();

  const [indicadores, setIndicadores] = useState({
    coberturaVacinal: 78,
    mediaEspera: 45,
    leitosOcupados: 82,
  });

  const [ubsData, setUbsData] = useState({
    codigoSUS: "1234567-89",
    producaoMensal: 980,
    ultimaSincronizacao: "Hoje, 08:32",
  });

  const [resumoFilas, setResumoFilas] = useState({
    clinicaGeral: 8,
    pediatria: 3,
    vacinacao: 5,
    totalPacientes: 16,
  });

  const [syncing, setSyncing] = useState(false);
  const [busca, setBusca] = useState("");
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);

  // Mock de dados SUS – exames e vacinas vitalícias
  const pacientesSusMock = [
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      sus: "1234 5678 9012",
      exames: [
        {
          id: 1,
          tipo: "Radiografia de Tórax",
          data: "12/05/2024",
          resultado: "Sem alterações",
          unidade: "UPA Central",
        },
        {
          id: 2,
          tipo: "Canal Dentário (Endodontia)",
          data: "03/03/2024",
          resultado: "Concluído – dente 26",
          unidade: "CEO Centro",
        },
        {
          id: 3,
          tipo: "Mamografia",
          data: "10/11/2023",
          resultado: "BI-RADS 1 (normal)",
          unidade: "Hospital das Clínicas",
        },
        {
          id: 4,
          tipo: "Ultrassonografia Abdominal",
          data: "22/09/2023",
          resultado: "Fígado e vias biliares normais",
          unidade: "UBS Central Lapa",
        },
        {
          id: 5,
          tipo: "Hemograma Completo",
          data: "05/06/2023",
          resultado: "Dentro dos padrões",
          unidade: "UBS Central Lapa",
        },
      ],
      vacinas: [
        {
          id: 1,
          vacina: "BCG",
          dose: "Dose única",
          data: "15/03/1980",
          lote: "BCG8001",
        },
        {
          id: 2,
          vacina: "Hepatite B",
          dose: "1ª dose",
          data: "16/04/1980",
          lote: "HP0001",
        },
        {
          id: 3,
          vacina: "Hepatite B",
          dose: "2ª dose",
          data: "16/05/1980",
          lote: "HP0002",
        },
        {
          id: 4,
          vacina: "Hepatite B",
          dose: "3ª dose",
          data: "16/11/1980",
          lote: "HP0003",
        },
        {
          id: 5,
          vacina: "Poliomielite",
          dose: "1ª dose",
          data: "01/06/1980",
          lote: "POLIO01",
        },
        {
          id: 6,
          vacina: "Poliomielite",
          dose: "2ª dose",
          data: "01/08/1980",
          lote: "POLIO02",
        },
        {
          id: 7,
          vacina: "Poliomielite",
          dose: "3ª dose",
          data: "01/12/1980",
          lote: "POLIO03",
        },
        {
          id: 8,
          vacina: "Tríplice Viral",
          dose: "Dose única",
          data: "15/03/1981",
          lote: "TV0001",
        },
        {
          id: 9,
          vacina: "Febre Amarela",
          dose: "Dose única",
          data: "22/10/1990",
          lote: "FA008",
        },
        {
          id: 10,
          vacina: "Antitetânica",
          dose: "Reforço",
          data: "15/07/2005",
          lote: "TET2005",
        },
        {
          id: 11,
          vacina: "COVID-19",
          dose: "1ª dose",
          data: "10/01/2021",
          lote: "CV2101",
        },
        {
          id: 12,
          vacina: "COVID-19",
          dose: "2ª dose",
          data: "10/04/2021",
          lote: "CV2102",
        },
        {
          id: 13,
          vacina: "COVID-19",
          dose: "3ª dose",
          data: "10/10/2021",
          lote: "CV2103",
        },
        {
          id: 14,
          vacina: "COVID-19",
          dose: "4ª dose",
          data: "12/05/2024",
          lote: "AB9023",
        },
      ],
    },
    {
      id: 2,
      nome: "José Santos",
      cpf: "987.654.321-00",
      sus: "9876 5432 1098",
      exames: [],
      vacinas: [],
    },
  ];

  // Máscara de CPF
  const handleBuscaChange = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length <= 3) setBusca(valor);
    else if (valor.length <= 6)
      setBusca(valor.replace(/(\d{3})(\d{1,3})/, "$1.$2"));
    else if (valor.length <= 9)
      setBusca(valor.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3"));
    else
      setBusca(valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4"));
  };

  const buscarPaciente = () => {
    const termoLimpo = busca.trim();
    if (termoLimpo === "") {
      Swal.fire("Campo vazio", "Digite um nome ou CPF.", "warning");
      return;
    }
    const cpfNumerico = termoLimpo.replace(/\D/g, "");
    const encontrado = pacientesSusMock.find((p) => {
      if (cpfNumerico.length === 11)
        return p.cpf.replace(/\D/g, "") === cpfNumerico;
      return p.nome.toLowerCase().includes(termoLimpo.toLowerCase());
    });
    if (encontrado) {
      setPacienteEncontrado(encontrado);
    } else {
      Swal.fire(
        "Não encontrado",
        "Nenhum paciente com esse nome ou CPF.",
        "error",
      );
      setPacienteEncontrado(null);
    }
  };

  const limparBusca = () => {
    setBusca("");
    setPacienteEncontrado(null);
  };

  const fetchDados = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIndicadores({
          coberturaVacinal: Math.floor(70 + Math.random() * 20),
          mediaEspera: Math.floor(30 + Math.random() * 30),
          leitosOcupados: Math.floor(70 + Math.random() * 25),
        });
        setUbsData((prev) => ({
          ...prev,
          producaoMensal: Math.floor(900 + Math.random() * 200),
          ultimaSincronizacao: `Hoje, ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`,
        }));
        setResumoFilas({
          clinicaGeral: Math.floor(Math.random() * 15) + 5,
          pediatria: Math.floor(Math.random() * 5) + 1,
          vacinacao: Math.floor(Math.random() * 10) + 2,
          totalPacientes: Math.floor(Math.random() * 30) + 10,
        });
        resolve();
      }, 800);
    });
  };

  const sincronizar = async () => {
    setSyncing(true);
    await fetchDados();
    setSyncing(false);
    Swal.fire({
      icon: "success",
      title: "Sincronizado!",
      text: "Dados nacionais e da sua UBS foram atualizados.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  useEffect(() => {
    fetchDados();
  }, []);

  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso negado</h1>
          <p className="text-gray-500">Esta área é restrita a atendentes.</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    {
      to: "/gerenciar-filas",
      icon: HiClipboardList,
      title: "Gerenciar Filas",
      desc: "Acompanhe e chame pacientes",
    },
    {
      to: "/agendamento",
      icon: HiCalendar,
      title: "Agendamentos",
      desc: "Gerencie consultas e horários",
    },
    {
      to: "/estoque-vacinas",
      icon: HiTrendingUp,
      title: "Estoque de Vacinas",
      desc: "Controle de lotes e validades",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiCloud className="text-blue-600" /> SUS Conectado
            </h1>
            <p className="text-gray-500 mt-1">
              Monitoramento de indicadores nacionais e registros do paciente na
              rede SUS.
            </p>
          </div>
          <button
            onClick={sincronizar}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <HiRefresh className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>

        {/* Busca por CPF/Nome */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={busca}
                onChange={handleBuscaChange}
                placeholder="Nome ou CPF do paciente (ex: 123.456.789-00)"
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                maxLength={14}
              />
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={buscarPaciente}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <HiSearch size={18} /> Buscar
            </button>
            <button
              onClick={limparBusca}
              className="border p-3 rounded-xl hover:bg-gray-50 transition"
            >
              <HiX size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Exemplo: 123.456.789-00 (Maria Silva) – veja exames e vacinas do SUS
          </p>

          {/* Resultado da busca – Exames e Vacinas do DataSUS */}
          {pacienteEncontrado && (
            <div className="mt-6 space-y-6">
              {/* Identificação */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {pacienteEncontrado.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-800">
                    {pacienteEncontrado.nome}
                  </p>
                  <p className="text-sm text-gray-600">
                    CPF: {pacienteEncontrado.cpf} | CNS:{" "}
                    {pacienteEncontrado.sus}
                  </p>
                </div>
              </div>

              {/* Bloco de Exames */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <HiPhotograph className="text-purple-600" /> Exames realizados
                  na rede SUS
                </h3>
                {pacienteEncontrado.exames.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Nenhum exame registrado na base nacional.
                  </p>
                ) : (
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="p-3 text-left font-medium text-purple-700">
                            Tipo
                          </th>
                          <th className="p-3 text-left font-medium text-purple-700">
                            Data
                          </th>
                          <th className="p-3 text-left font-medium text-purple-700">
                            Resultado
                          </th>
                          <th className="p-3 text-left font-medium text-purple-700">
                            Unidade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pacienteEncontrado.exames.map((exame) => (
                          <tr key={exame.id} className="hover:bg-gray-50">
                            <td className="p-3 font-medium">{exame.tipo}</td>
                            <td className="p-3">{exame.data}</td>
                            <td className="p-3">{exame.resultado}</td>
                            <td className="p-3 flex items-center gap-1">
                              <HiLocationMarker
                                size={14}
                                className="text-gray-400"
                              />
                              {exame.unidade}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bloco de Vacinas */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <HiShieldCheck className="text-emerald-600" /> Carteira de
                  Vacinação (Registro Nacional)
                </h3>
                {pacienteEncontrado.vacinas.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Nenhuma vacina encontrada na base nacional.
                  </p>
                ) : (
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-emerald-50">
                        <tr>
                          <th className="p-3 text-left font-medium text-emerald-700">
                            Vacina
                          </th>
                          <th className="p-3 text-left font-medium text-emerald-700">
                            Dose
                          </th>
                          <th className="p-3 text-left font-medium text-emerald-700">
                            Data
                          </th>
                          <th className="p-3 text-left font-medium text-emerald-700">
                            Lote
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pacienteEncontrado.vacinas.map((v) => (
                          <tr key={v.id} className="hover:bg-gray-50">
                            <td className="p-3 font-medium">{v.vacina}</td>
                            <td className="p-3">{v.dose}</td>
                            <td className="p-3">{v.data}</td>
                            <td className="p-3">{v.lote}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Indicadores nacionais (permanece) */}
        <div className="bg-white border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <HiCloud className="text-white text-xl" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              Conexão com o DataSUS estabelecida
            </p>
            <p className="text-sm text-gray-500">
              Última sincronização: {ubsData.ultimaSincronizacao}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <HiDatabase size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Indicadores Nacionais
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Cobertura vacinal (BR)</span>
                  <span className="font-bold text-gray-800">
                    {indicadores.coberturaVacinal}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${indicadores.coberturaVacinal}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">
                  Média de espera por especialista
                </span>
                <span className="font-bold text-gray-800">
                  {indicadores.mediaEspera} dias
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Leitos SUS ocupados</span>
                <span className="font-bold text-gray-800">
                  {indicadores.leitosOcupados}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                <HiUsers size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Resumo da Unidade
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Código SUS</span>
                <span className="font-mono font-bold text-gray-800">
                  {ubsData.codigoSUS}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Produção mensal</span>
                <span className="font-bold text-gray-800">
                  {ubsData.producaoMensal} atendimentos
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600">Pacientes na fila hoje</span>
                <span className="font-bold text-gray-800">
                  {resumoFilas.totalPacientes}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  {
                    label: "Clínica",
                    value: resumoFilas.clinicaGeral,
                    color: "from-blue-400 to-blue-500",
                  },
                  {
                    label: "Pediatria",
                    value: resumoFilas.pediatria,
                    color: "from-green-400 to-green-500",
                  },
                  {
                    label: "Vacinação",
                    value: resumoFilas.vacinacao,
                    color: "from-purple-400 to-purple-500",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 p-3 rounded-xl text-center border hover:shadow-sm transition"
                  >
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-bold text-lg text-gray-800">
                      {item.value}
                    </p>
                    <div
                      className={`w-full h-1 mt-1 rounded-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white rounded-2xl p-5 border hover:shadow-md transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <link.icon className="text-white text-2xl" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{link.title}</p>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HiDocumentText className="text-gray-400" />
            Registros de Sincronização
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiClock className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">
                    Sincronização completa
                  </p>
                  <p className="text-xs text-gray-500">DataSUS + UBS Central</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {ubsData.ultimaSincronizacao}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <HiLocationMarker className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">
                    Atualização de estoque
                  </p>
                  <p className="text-xs text-gray-500">
                    Envio para base nacional
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Hoje, 07:45</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          Dados simulados para demonstração. Em produção, integre com a API
          oficial do DataSUS.
        </p>
      </div>
    </div>
  );
};

export default SusConectadoAtendente;
