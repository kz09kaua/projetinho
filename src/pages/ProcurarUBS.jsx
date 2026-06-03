// src/pages/ProcurarUBS.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder'; 
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';

// Ícones padrão do Leaflet corrigidos para funcionarem com o Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente que gerencia a busca (Caixa de Pesquisa)
const SearchControl = ({ setSearchResult }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const searchControl = new L.Control.Geocoder({
      defaultMarkGeocode: true,
      position: 'topright', // Posição da caixa de busca
      placeholder: 'Digite o nome da UBS, endereço ou bairro...',
      errorMessage: 'Nenhum resultado encontrado.',
    }).addTo(map);

    searchControl.on('markgeocode', (e) => {
      const { center, name } = e.geocode;
      setSearchResult({
        lat: center.lat,
        lng: center.lng,
        address: name,
      });
    });
    return () => map.removeControl(searchControl);
  }, [map, setSearchResult]);

  return null;
};

// Componente que obtém a localização do usuário
const UserLocation = ({ setUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.locate({ setView: true, maxZoom: 15 });
    map.on('locationfound', (e) => {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }, [map, setUserLocation]);

  return null;
};

// Dados fixos das UBS de Muriaé (atualize conforme sua necessidade)
const ubsList = [
  { id: 1, nome: 'UBS Central - Dr. João', endereco: 'Rua Domingos Vieira, 100, Centro', lat: -21.129, lng: -42.365 },
  { id: 2, nome: 'UBS Vila da Penha', endereco: 'Av. JK, 500, Vila da Penha', lat: -21.125, lng: -42.370 },
  { id: 3, nome: 'UBS São Cristóvão', endereco: 'Rua José Bonifácio, 50, São Cristóvão', lat: -21.135, lng: -42.360 },
  { id: 4, nome: 'UBS Santo Antônio', endereco: 'Praça Santana, 12, Santo Antônio', lat: -21.140, lng: -42.375 },
  { id: 5, nome: 'UBS João XXIII', endereco: 'Rua João Pinheiro, 200, João XXIII', lat: -21.145, lng: -42.380 },
  { id: 6, nome: 'UBS Primavera', endereco: 'Av. Rio Branco, 300, Primavera', lat: -21.120, lng: -42.358 },
];

const ProcurarUBS = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const position = [-21.129, -42.365]; // Centro aproximado de Muriaé

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <Search size={28} className="text-blue-700" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Procurar UBS</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
    Encontre a UBS mais próxima de você.
      </p>

      <MapContainer
        center={position}
        zoom={14}
        style={{ height: '550px', width: '100%', borderRadius: '24px', zIndex: 0 }}
      >
        {/* Camada do mapa */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Componentes internos */}
        <SearchControl setSearchResult={setSearchResult} />
        <UserLocation setUserLocation={setUserLocation} />

        {/* Marcação da sua Localização */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Sua localização atual</Popup>
          </Marker>
        )}

        {/* Marcação do Resultado da Pesquisa */}
        {searchResult && (
          <Marker position={[searchResult.lat, searchResult.lng]}>
            <Popup>
              <strong>Localização Encontrada</strong>
              <br />
              {searchResult.address}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Exibição dos Detalhes da Pesquisa */}
      {searchResult && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow border dark:border-gray-700">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Localização Encontrada</h3>
          <p className="text-gray-700 dark:text-gray-300">{searchResult.address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${searchResult.lat},${searchResult.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition"
          >
            Abrir rotas no Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default ProcurarUBS;