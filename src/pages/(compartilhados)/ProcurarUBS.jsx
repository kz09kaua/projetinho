// src/pages/ProcurarUBS.jsx - Versão com i18n e padronização completa
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  HiSearch,
  HiLocationMarker,
  HiOfficeBuilding,
  HiBadgeCheck,
  HiEye,
  HiX,
  HiRefresh,
  HiChevronDoubleLeft,
  HiHome,
  HiUser,
  HiClock,
  HiPhone,
} from "react-icons/hi";
import { FaSyringe } from "react-icons/fa";

// ============================================================
// CONFIGURAÇÃO DE ÍCONES LEAFLET
// ============================================================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Ícones personalizados
const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// ============================================================
// DADOS FIXOS DAS UBS (Muriaé - MG)
// ============================================================
const ubsList = [
  {
    id: 1,
    nome: "UBS Central - Dr. João",
    endereco: "Rua Domingos Vieira, 100, Centro",
    lat: -21.129,
    lng: -42.365,
    telefone: "(32) 3221-1000",
    horario: "07:00 - 17:00",
  },
  {
    id: 2,
    nome: "UBS Vila da Penha",
    endereco: "Av. JK, 500, Vila da Penha",
    lat: -21.125,
    lng: -42.37,
    telefone: "(32) 3221-2000",
    horario: "07:00 - 17:00",
  },
  {
    id: 3,
    nome: "UBS São Cristóvão",
    endereco: "Rua José Bonifácio, 50, São Cristóvão",
    lat: -21.135,
    lng: -42.36,
    telefone: "(32) 3221-3000",
    horario: "07:00 - 17:00",
  },
  {
    id: 4,
    nome: "UBS Santo Antônio",
    endereco: "Praça Santana, 12, Santo Antônio",
    lat: -21.14,
    lng: -42.375,
    telefone: "(32) 3221-4000",
    horario: "07:00 - 17:00",
  },
  {
    id: 5,
    nome: "UBS João XXIII",
    endereco: "Rua João Pinheiro, 200, João XXIII",
    lat: -21.145,
    lng: -42.38,
    telefone: "(32) 3221-5000",
    horario: "07:00 - 17:00",
  },
  {
    id: 6,
    nome: "UBS Primavera",
    endereco: "Av. Rio Branco, 300, Primavera",
    lat: -21.12,
    lng: -42.358,
    telefone: "(32) 3221-6000",
    horario: "07:00 - 17:00",
  },
  {
    id: 7,
    nome: "UBS Industrial",
    endereco: "Rua das Indústrias, 200, Industrial",
    lat: -21.115,
    lng: -42.345,
    telefone: "(32) 3221-7000",
    horario: "07:00 - 17:00",
  },
  {
    id: 8,
    nome: "UBS Santa Rita",
    endereco: "Av. Santa Rita, 150, Santa Rita",
    lat: -21.15,
    lng: -42.39,
    telefone: "(32) 3221-8000",
    horario: "07:00 - 17:00",
  },
];

// ============================================================
// COMPONENTES REUTILIZÁVEIS (padronizados com i18n)
// ============================================================

const Avatar = ({ nome, size = "sm" }) => {
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const tamanho =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "md"
        ? "w-10 h-10 text-sm"
        : "w-12 h-12 text-base";
  return (
    <div
      className={`${tamanho} rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0`}
    >
      {iniciais}
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => {
  const colorMap = {
    blue: "from-blue-600 to-blue-700",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-rose-500 to-rose-600",
    teal: "from-teal-500 to-teal-600",
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    gray: "from-slate-500 to-slate-600",
  };

  const gradient = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 min-w-[140px] flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-[10px] text-gray-400 truncate">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg flex-shrink-0`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTES AUXILIARES DO MAPA
// ============================================================

// Componente para centralizar o mapa
const MapCenter = ({ lat, lng, zoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], zoom);
    }
  }, [lat, lng, zoom, map]);
  return null;
};

// Componente para carregar a localização do usuário automaticamente
const LocateUser = ({ setUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
    const handleLocationFound = (e) => {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("locationfound", handleLocationFound);
    return () => {
      map.off("locationfound", handleLocationFound);
    };
  }, [map, setUserLocation]);

  return null;
};

// ============================================================
// FUNÇÕES DE UTILIDADE
// ============================================================
const calcularDistancia = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatarDistancia = (dist) => {
  if (dist < 1) return `${Math.round(dist * 1000)} m`;
  return `${dist.toFixed(1)} km`;
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const ProcurarUBS = () => {
  const { t } = useTranslation();

  // ===== ESTADOS =====
  const [userLocation, setUserLocation] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUBS, setSelectedUBS] = useState(null);
  const [mapCenter, setMapCenter] = useState([-21.129, -42.365]);
  const [mapZoom, setMapZoom] = useState(14);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const mapRef = useRef(null);

  // ===== CALCULAR DISTÂNCIAS =====
  const ubsComDistancia = useMemo(() => {
    return ubsList.map((ubs) => {
      let distancia = null;
      if (userLocation) {
        distancia = calcularDistancia(
          userLocation.lat,
          userLocation.lng,
          ubs.lat,
          ubs.lng,
        );
      }
      return { ...ubs, distancia };
    });
  }, [userLocation]);

  // ===== UBS MAIS PRÓXIMA =====
  const ubsMaisProxima = useMemo(() => {
    if (!userLocation) return null;
    const comDistancia = ubsComDistancia.filter((u) => u.distancia !== null);
    if (comDistancia.length === 0) return null;
    return comDistancia.reduce((a, b) => (a.distancia < b.distancia ? a : b));
  }, [ubsComDistancia, userLocation]);

  // ===== FILTRO DE BUSCA (sugestões) =====
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchSuggestions([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = ubsList.filter(
      (ubs) =>
        ubs.nome.toLowerCase().includes(lower) ||
        ubs.endereco.toLowerCase().includes(lower),
    );
    setSearchSuggestions(filtered);
  }, [searchTerm]);

  // ===== HANDLERS =====
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchSuggestions.length === 0) return;
    const first = searchSuggestions[0];
    setSearchResult({
      lat: first.lat,
      lng: first.lng,
      address: first.endereco,
      name: first.nome,
    });
    setMapCenter([first.lat, first.lng]);
    setMapZoom(16);
    setSearchTerm(first.nome);
    setSearchSuggestions([]);
  };

  const handleSelectUBS = (ubs) => {
    setSelectedUBS(ubs);
    setMapCenter([ubs.lat, ubs.lng]);
    setMapZoom(16);
    setSearchResult({
      lat: ubs.lat,
      lng: ubs.lng,
      address: ubs.endereco,
      name: ubs.nome,
    });
  };

  const handleVerNoMapa = (ubs) => {
    setMapCenter([ubs.lat, ubs.lng]);
    setMapZoom(16);
    setSelectedUBS(ubs);
  };

  const handleRotas = (ubs) => {
    const origem = userLocation
      ? `${userLocation.lat},${userLocation.lng}`
      : "";
    const destino = `${ubs.lat},${ubs.lng}`;
    const url = `https://www.google.com/maps/dir/${origem}/${destino}`;
    window.open(url, "_blank");
  };

  const handleCentralizar = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(15);
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - padronizado com i18n */}
        <HeaderSection t={t} />

        {/* Seção Principal: Mapa + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Sidebar */}
          <div
            className={`
            lg:w-1/3 xl:w-1/4 order-2 lg:order-1
            ${showSidebar ? "block" : "hidden lg:block"}
          `}
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden h-[700px] flex flex-col">
              {/* Barra de pesquisa */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <HiSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t("procurar_ubs.pesquisar")}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                    />
                  </div>
                  {searchSuggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((ubs) => (
                        <button
                          key={ubs.id}
                          onClick={() => handleSelectUBS(ubs)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition flex items-center gap-2"
                        >
                          <HiLocationMarker
                            size={16}
                            className="text-blue-600"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {ubs.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                              {ubs.endereco}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>

              {/* Lista de UBS */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-700">
                    {t("procurar_ubs.todas_ubs")}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {ubsComDistancia.length} {t("procurar_ubs.unidades")}
                  </span>
                </div>

                {ubsComDistancia.map((ubs) => (
                  <div
                    key={ubs.id}
                    className={`
                      p-3 rounded-xl border transition cursor-pointer
                      ${
                        selectedUBS?.id === ubs.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }
                    `}
                    onClick={() => handleSelectUBS(ubs)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Avatar nome={ubs.nome} size="sm" />
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {ubs.nome}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {ubs.endereco}
                        </p>
                        {ubs.distancia !== null && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            {formatarDistancia(ubs.distancia)}{" "}
                            {t("procurar_ubs.de_distancia")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerNoMapa(ubs);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title={t("comum.visualizar")}
                        >
                          <HiEye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRotas(ubs);
                          }}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                          title={t("procurar_ubs.rotas")}
                        >
                          <HiLocationMarker size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* UBS mais próxima */}
              {ubsMaisProxima && (
                <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                  <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                    <HiBadgeCheck size={18} />
                    <span>{t("procurar_ubs.ubs_mais_proxima")}</span>
                  </div>
                  <p className="font-bold text-gray-800">
                    {ubsMaisProxima.nome}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ubsMaisProxima.endereco}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {formatarDistancia(ubsMaisProxima.distancia)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mapa */}
          <div
            className={`
            flex-1 order-1 lg:order-2
            ${showSidebar ? "" : "w-full"}
          `}
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden relative h-[700px]">
              {/* Botões de controle */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="bg-white p-2.5 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition"
                >
                  {showSidebar ? (
                    <HiX size={20} />
                  ) : (
                    <HiOfficeBuilding size={20} />
                  )}
                </button>
                {userLocation && (
                  <button
                    onClick={handleCentralizar}
                    className="bg-white p-2.5 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition"
                    title={t("procurar_ubs.centralizar")}
                  >
                    <HiLocationMarker size={20} className="text-blue-600" />
                  </button>
                )}
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              )}

              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "100%", width: "100%" }}
                whenReady={() => setIsLoading(false)}
                ref={mapRef}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocateUser setUserLocation={setUserLocation} />
                {mapCenter && (
                  <MapCenter
                    lat={mapCenter[0]}
                    lng={mapCenter[1]}
                    zoom={mapZoom}
                  />
                )}

                {/* Marcador do usuário */}
                {userLocation && (
                  <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={createIcon("blue")}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong className="text-gray-800">
                          📍 {t("procurar_ubs.sua_localizacao")}
                        </strong>
                        <p className="text-sm text-gray-600">
                          {t("procurar_ubs.voce_esta_aqui")}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Marcadores das UBS */}
                {ubsList.map((ubs) => (
                  <Marker
                    key={ubs.id}
                    position={[ubs.lat, ubs.lng]}
                    icon={createIcon("red")}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h4 className="font-bold text-gray-800">{ubs.nome}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {ubs.endereco}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <HiPhone size={12} /> {ubs.telefone}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <HiClock size={12} /> {ubs.horario}
                        </p>
                        {userLocation && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            {formatarDistancia(
                              calcularDistancia(
                                userLocation.lat,
                                userLocation.lng,
                                ubs.lat,
                                ubs.lng,
                              ),
                            )}
                          </p>
                        )}
                        <button
                          onClick={() => handleRotas(ubs)}
                          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
                        >
                          <HiLocationMarker size={16} />{" "}
                          {t("procurar_ubs.rotas")}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Marcador do resultado da pesquisa */}
                {searchResult && (
                  <Marker
                    position={[searchResult.lat, searchResult.lng]}
                    icon={createIcon("green")}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong className="text-gray-800">
                          🔍 {t("procurar_ubs.resultado")}
                        </strong>
                        <p className="text-sm text-gray-600">
                          {searchResult.address}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {/* Card de detalhes */}
            {searchResult && (
              <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <HiLocationMarker size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {searchResult.name || t("procurar_ubs.localizacao")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {searchResult.address}
                    </p>
                    {ubsMaisProxima && (
                      <p className="text-sm text-blue-600 font-medium">
                        {t("procurar_ubs.ubs_mais_proxima")}:{" "}
                        {ubsMaisProxima.nome} (
                        {formatarDistancia(ubsMaisProxima.distancia)})
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${searchResult.lat},${searchResult.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-md"
                >
                  <HiLocationMarker size={18} />
                  {t("procurar_ubs.abrir_rotas")}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <FooterSection t={t} />
      </div>
    </div>
  );
};

// ============================================================
// SUBCOMPONENTES (com i18n)
// ============================================================

const HeaderSection = ({ t }) => {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <HiHome className="w-4 h-4" />
            <span>Dashboard</span>
            <HiChevronDoubleLeft className="w-3 h-3 rotate-180" />
            <span className="text-white font-medium">
              {t("procurar_ubs.titulo")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2">
            <HiLocationMarker className="w-7 h-7" />
            {t("procurar_ubs.titulo")}
          </h1>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
            <span>{t("procurar_ubs.subtitulo")}</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>{dataFormatada}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            <HiUser className="w-4 h-4" />
          </div>
          <div className="text-white text-sm">
            <p className="font-medium">{t("procurar_ubs.localizacao_ativa")}</p>
            <p className="text-white/70 text-xs">
              {t("procurar_ubs.permissao_concedida")}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
    </div>
  );
};

const FooterSection = ({ t }) => {
  return (
    <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
      <p>{t("procurar_ubs.footer.clique_ubs")}</p>
      <p className="mt-1">{t("procurar_ubs.footer.copyright")}</p>
    </div>
  );
};

export default ProcurarUBS;
