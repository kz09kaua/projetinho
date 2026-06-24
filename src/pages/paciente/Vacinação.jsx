// src/pages/Vacinacao.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiLocationMarker,
  HiBell,
  HiQrcode,
  HiExclamation,
  HiEye,
} from "react-icons/hi";
import { FaSyringe } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../contexts/AuthContext";

const MySwal = withReactContent(Swal);

// Lista de UBS fixa como fallback
const UBS_FALLBACK = [
  { id: 0, nome: "UBS Santa Cecília - Central", distance: 1.2 },
  { id: 1, nome: "UBS Vila Mariana", distance: 2.5 },
  { id: 2, nome: "UBS Lapa", distance: 3.0 },
  { id: 3, nome: "UBS Pinheiros", distance: 4.1 },
];

const Vacinacao = () => {
  const auth = useAuth ? useAuth() : { user: null };
  const user = auth?.user;

  const [historico] = useState([
    {
      id: 1,
      vacina: "COVID-19",
      dose: "4ª Dose",
      data: "12/05/2024",
      lote: "AB9023",
      status: "aplicada",
    },
    {
      id: 2,
      vacina: "Hepatite B",
      dose: "Dose Única",
      data: "08/02/2024",
      lote: "HP5521",
      status: "aplicada",
    },
    {
      id: 3,
      vacina: "Antitetânica",
      dose: "Reforço",
      data: "15/10/2024",
      lote: "TT9982",
      status: "pendente",
    },
    {
      id: 4,
      vacina: "Febre Amarela",
      dose: "Dose Única",
      data: "20/01/2023",
      lote: "FA7890",
      status: "aplicada",
    },
  ]);

  const pendentes = historico.filter((h) => h.status === "pendente");
  const aplicadas = historico.filter((h) => h.status === "aplicada");
  const vacinaPendente = pendentes[0];

  const [ubsProximas, setUbsProximas] = useState([]);
  const [ubsEscolhida, setUbsEscolhida] = useState("");
  const [carregandoUbs, setCarregandoUbs] = useState(false);
  const [notificacaoPermitida, setNotificacaoPermitida] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState(false);

  // Verifica permissão de notificação já concedida
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificacaoPermitida(true);
    }
  }, []);

  // Carregar UBS escolhida do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ubsVacinaPendente");
    if (saved) setUbsEscolhida(saved);
  }, []);

  // Persistir escolha
  useEffect(() => {
    if (ubsEscolhida) localStorage.setItem("ubsVacinaPendente", ubsEscolhida);
  }, [ubsEscolhida]);

  // Função para distância (Haversine)
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Buscar UBS reais via Overpass
  const buscarUbsProximas = async (lat, lng) => {
    setCarregandoUbs(true);
    setErroLocalizacao(false);
    const query = `
      [out:json];
      (
        node["amenity"="clinic"](around:5000, ${lat}, ${lng});
        node["amenity"="hospital"](around:5000, ${lat}, ${lng});
        node["healthcare"="clinic"](around:5000, ${lat}, ${lng});
        way["amenity"="clinic"](around:5000, ${lat}, ${lng});
        way["healthcare"="clinic"](around:5000, ${lat}, ${lng});
      );
      out body;
    `;
    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("API indisponível");
      const data = await response.json();
      const elementos = data.elements || [];
      const ubs = elementos
        .map((el) => {
          const latEl = el.lat || el.center?.lat;
          const lonEl = el.lon || el.center?.lon;
          if (!latEl || !lonEl) return null;
          return {
            id: el.id,
            nome: el.tags?.name || "Unidade de Saúde",
            distance: haversineDistance(lat, lng, latEl, lonEl),
          };
        })
        .filter(Boolean);
      // Remover duplicatas por nome
      const nomes = new Set();
      const unicas = ubs.filter((u) => {
        if (nomes.has(u.nome)) return false;
        nomes.add(u.nome);
        return true;
      });
      unicas.sort((a, b) => a.distance - b.distance);
      if (unicas.length > 0) {
        setUbsProximas(unicas);
        if (!ubsEscolhida) setUbsEscolhida(unicas[0].nome);
      } else {
        throw new Error("Nenhuma UBS encontrada na região");
      }
    } catch (error) {
      console.error("Erro ao buscar UBS:", error);
      // Usa fallback
      setUbsProximas(UBS_FALLBACK);
      if (!ubsEscolhida) setUbsEscolhida(UBS_FALLBACK[0].nome);
      Swal.fire({
        icon: "warning",
        title: "UBS offline?",
        text: "Não foi possível buscar UBS online. Exibindo unidades padrão.",
        timer: 3000,
        showConfirmButton: true,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setCarregandoUbs(false);
    }
  };

  // Obter localização e acionar busca
  const obterLocalizacaoEBuscarUBS = () => {
    if (!navigator.geolocation) {
      // Sem API de geolocalização: usa fallback direto
      setUbsProximas(UBS_FALLBACK);
      if (!ubsEscolhida) setUbsEscolhida(UBS_FALLBACK[0].nome);
      setCarregandoUbs(false);
      Swal.fire({
        icon: "info",
        title: "Geolocalização não suportada",
        text: "Exibindo unidades padrão.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        buscarUbsProximas(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erro de geolocalização:", error);
        // Se negado ou erro, usa fallback
        setUbsProximas(UBS_FALLBACK);
        if (!ubsEscolhida) setUbsEscolhida(UBS_FALLBACK[0].nome);
        setCarregandoUbs(false);
        setErroLocalizacao(true);
        Swal.fire({
          icon: "warning",
          title: "Localização não disponível",
          text: "Permita o acesso à localização ou selecione uma UBS da lista padrão.",
          confirmButtonColor: "#2563eb",
        });
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  useEffect(() => {
    obterLocalizacaoEBuscarUBS();
  }, []);

  // Notificações
  const pedirPermissaoNotificacao = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificacaoPermitida(true);
        return true;
      } else {
        Swal.fire({
          icon: "warning",
          title: "Permissão negada",
          text: "Para receber lembretes, permita notificações nas configurações do navegador.",
          confirmButtonColor: "#2563eb",
        });
        return false;
      }
    }
    return false;
  };

  const enviarNotificacaoLocal = async () => {
    if (!ubsEscolhida) {
      Swal.fire("Atenção", "Selecione uma UBS.", "warning");
      return;
    }

    // Mostra resumo
    Swal.fire({
      icon: "info",
      title: "Lembrete ativado",
      html: `
        <div style="text-align:left">
          <p><strong>Vacina:</strong> ${vacinaPendente?.vacina || "Não especificada"}</p>
          <p><strong>UBS:</strong> ${ubsEscolhida}</p>
          <p><strong>Paciente:</strong> ${user?.name || "Maria Silva"}</p>
        </div>
      `,
      confirmButtonText: "Ok",
      confirmButtonColor: "#2563eb",
    });

    // Tenta enviar notificação nativa
    if (notificacaoPermitida) {
      try {
        const notification = new Notification("Lembrete de Vacinação", {
          body: `${vacinaPendente?.vacina || "Vacina"} pendente. Compareça à ${ubsEscolhida}.`,
          icon: "/vite.svg",
        });
        setTimeout(() => notification.close(), 10000);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Se não permitida, oferece ativar
      const result = await Swal.fire({
        title: "Deseja ativar notificações?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ativar",
        cancelButtonText: "Agora não",
      });
      if (result.isConfirmed) {
        const permitiu = await pedirPermissaoNotificacao();
        if (permitiu) {
          // Tenta novamente
          enviarNotificacaoLocal();
        }
      }
    }
  };

  // QR Code
  const gerarDadosRelatorio = () => {
    const textoAplicadas = aplicadas
      .map((v) => `- ${v.vacina} (${v.data})`)
      .join("\n");
    const textoPendentes = pendentes.map((v) => `- ${v.vacina}`).join("\n");
    return `RELATÓRIO DE VACINAÇÃO\nPaciente: ${user?.name || "Maria Silva"}\n\nTOMADAS:\n${textoAplicadas}\n\nPENDENTES:\n${textoPendentes}`;
  };

  const handleExibirCarteira = () => {
    MySwal.fire({
      title: "Carteira Digital Oficial",
      html: (
        <div className="text-center p-2">
          <div className="bg-gray-100 p-4 rounded-2xl mb-6">
            <p className="font-bold text-lg">{user?.name || "Maria Silva"}</p>
            <p className="text-sm font-semibold">CNS: 700 0000 0000 0000</p>
          </div>
          <div className="flex justify-center p-6">
            <QRCodeSVG
              value={gerarDadosRelatorio()}
              size={180}
              level="H"
              includeMargin
            />
          </div>
        </div>
      ),
      confirmButtonText: "Fechar",
    });
  };

  const verDetalhesVacina = (vacina) => {
    Swal.fire({
      title: vacina.vacina,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Dose:</strong> ${vacina.dose}</p>
          <p><strong>Data:</strong> ${vacina.data}</p>
          <p><strong>Lote:</strong> ${vacina.lote}</p>
          <p><strong>Status:</strong> ${vacina.status === "aplicada" ? "Aplicada" : "Pendente"}</p>
        </div>
      `,
      icon: vacina.status === "aplicada" ? "success" : "warning",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaSyringe className="text-blue-600" /> Minha Carteira de
              Vacinação
            </h1>
            <p className="text-gray-500">Controle oficial de imunização.</p>
          </div>
          <button
            onClick={handleExibirCarteira}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <HiQrcode /> Gerar Relatório QR
          </button>
        </div>

        {/* Alerta de vacina pendente */}
        {pendentes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border-l-8 border-red-500 p-5 rounded-2xl mb-6"
          >
            <div className="flex items-center gap-4">
              <HiExclamation size={28} className="text-red-600" />
              <div>
                <p className="font-bold text-lg text-red-800">
                  Vacinação Incompleta
                </p>
                <p className="text-red-700">
                  Dose de <strong>{vacinaPendente?.vacina}</strong> pendente.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Certificado de Imunização</p>
            <p className="text-2xl font-bold mt-1">
              {user?.name || "Maria Silva"}
            </p>
            <p className="text-3xl font-black mt-4">
              {aplicadas.length} doses aplicadas
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-400">Próximo Registro</p>
            <p className="text-xl font-bold text-gray-800">
              {vacinaPendente?.vacina || "Nenhuma"}
            </p>
            <p className="text-sm text-gray-500">Reforço necessário</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <HiLocationMarker /> Unidade mais próxima
            </p>
            <div className="mt-2">
              {carregandoUbs ? (
                <p className="text-gray-500">Buscando...</p>
              ) : (
                <select
                  value={ubsEscolhida}
                  onChange={(e) => setUbsEscolhida(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {ubsProximas.map((ubs) => (
                    <option key={ubs.id} value={ubs.nome}>
                      {ubs.nome} - {ubs.distance.toFixed(1)} km
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              onClick={enviarNotificacaoLocal}
              disabled={carregandoUbs || !ubsEscolhida}
              className={`w-full mt-3 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                carregandoUbs || !ubsEscolhida
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <HiBell /> Ativar Notificação
            </button>
          </div>
        </div>

        {/* Histórico de aplicações */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Histórico de Aplicações
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vacina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historico.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => verDetalhesVacina(v)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {v.vacina}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{v.dose}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{v.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {v.lote}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          v.status === "aplicada"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {v.status === "aplicada" ? "Aplicada" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          verDetalhesVacina(v);
                        }}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        title="Visualizar"
                      >
                        <HiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vacinacao;
