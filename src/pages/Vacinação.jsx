// src/pages/Vacinação.jsx (versão com notificação local)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiClock,
  HiLocationMarker,
  HiBell,
  HiQrcode,
  HiExclamation,
  HiSelector
} from 'react-icons/hi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';

const MySwal = withReactContent(Swal);

const Vacinação = () => {
  const { user } = useAuth();

  const [historico] = useState([
    { id: 1, vacina: 'COVID-19', dose: '4ª Dose', data: '12/05/2024', lote: 'AB9023', status: 'aplicada' },
    { id: 2, vacina: 'Hepatite B', dose: 'Dose Única', data: '08/02/2024', lote: 'HP5521', status: 'aplicada' },
    { id: 3, vacina: 'Antitetânica', dose: 'Reforço', data: '15/10/2024', lote: 'TT9982', status: 'pendente' }
  ]);

  const pendentes = historico.filter((h) => h.status === 'pendente');
  const aplicadas = historico.filter((h) => h.status === 'aplicada');
  const vacinaPendente = pendentes[0];

  const [ubsProximas, setUbsProximas] = useState([]);
  const [ubsEscolhida, setUbsEscolhida] = useState('');
  const [carregandoUbs, setCarregandoUbs] = useState(false);
  const [notificacaoPermitida, setNotificacaoPermitida] = useState(false);

  // Verifica permissão de notificação ao carregar o componente
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificacaoPermitida(true);
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ubsVacinaPendente');
    if (saved) setUbsEscolhida(saved);
  }, []);

  useEffect(() => {
    if (ubsEscolhida) {
      localStorage.setItem('ubsVacinaPendente', ubsEscolhida);
    }
  }, [ubsEscolhida]);

  // Função para pedir permissão de notificação
  const pedirPermissaoNotificacao = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificacaoPermitida(true);
        Swal.fire({
          icon: 'success',
          title: 'Permissão concedida',
          text: 'Você receberá notificações no navegador.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
        return true;
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Permissão negada',
          text: 'Você não receberá notificações. Altere nas configurações do navegador se desejar.',
          confirmButtonColor: 'var(--primary-color)'
        });
        return false;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Não suportado',
        text: 'Seu navegador não suporta notificações.',
        confirmButtonColor: 'var(--primary-color)'
      });
      return false;
    }
  };

  // Função principal que substitui o envio de e-mail
  const enviarNotificacaoLocal = async () => {
    if (!ubsEscolhida) {
      Swal.fire('Atenção', 'Selecione uma UBS.', 'warning');
      return;
    }

    // Conteúdo da notificação
    const titulo = 'Lembrete de Vacinação';
    const corpo = `${vacinaPendente?.vacina} pendente. Compareça à ${ubsEscolhida} o mais breve possível.`;

    // Exibir um alerta com SweetAlert2 (sempre)
    Swal.fire({
      icon: 'info',
      title: 'Lembrete ativado',
      html: `
        <div style="text-align:left">
          <p><strong>Vacina:</strong> ${vacinaPendente?.vacina}</p>
          <p><strong>UBS:</strong> ${ubsEscolhida}</p>
          <p><strong>Paciente:</strong> ${user?.name || 'Maria Silva'}</p>
        </div>
      `,
      confirmButtonText: 'Ok',
      confirmButtonColor: 'var(--primary-color)',
      footer: 'Você será notificado novamente amanhã.'
    });

    // Tenta enviar notificação do navegador
    if (notificacaoPermitida) {
      try {
        const notification = new Notification(titulo, {
          body: corpo,
          icon: '/vite.svg', // ou use um ícone seu
          tag: 'lembrete-vacina',
          requireInteraction: true
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        // Fecha a notificação após 10 segundos
        setTimeout(() => notification.close(), 10000);
      } catch (err) {
        console.error('Erro ao criar notificação:', err);
      }
    } else {
      // Se não tem permissão, oferece pedir permissão
      const result = await Swal.fire({
        title: 'Receber notificações?',
        text: 'Ative as notificações para receber lembretes no navegador.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ativar',
        cancelButtonText: 'Agora não'
      });
      if (result.isConfirmed) {
        await pedirPermissaoNotificacao();
        // Se a permissão foi concedida, reenvia a notificação
        if (notificacaoPermitida) {
          enviarNotificacaoLocal();
        }
      }
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const buscarUbsProximas = async (lat, lng) => {
    setCarregandoUbs(true);
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
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const elementos = data.elements || [];
      const ubs = elementos
        .map((el) => {
          const latEl = el.lat || el.center?.lat;
          const lonEl = el.lon || el.center?.lon;
          if (!latEl || !lonEl) return null;
          return {
            id: el.id,
            nome: el.tags?.name || 'Unidade de Saúde',
            distance: haversineDistance(lat, lng, latEl, lonEl)
          };
        })
        .filter(Boolean);
      const nomes = new Set();
      const unicas = ubs.filter((u) => {
        if (nomes.has(u.nome)) return false;
        nomes.add(u.nome);
        return true;
      });
      unicas.sort((a, b) => a.distance - b.distance);
      setUbsProximas(unicas);
      if (unicas.length > 0 && !ubsEscolhida) {
        setUbsEscolhida(unicas[0].nome);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Não foi possível buscar UBS próximas.', 'error');
    } finally {
      setCarregandoUbs(false);
    }
  };

  const obterLocalizacaoEBuscarUBS = () => {
    if (!navigator.geolocation) {
      Swal.fire('Erro', 'Seu navegador não suporta geolocalização.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        buscarUbsProximas(position.coords.latitude, position.coords.longitude);
      },
      () => {
        Swal.fire('Erro', 'Não foi possível obter sua localização.', 'error');
      }
    );
  };

  useEffect(() => {
    obterLocalizacaoEBuscarUBS();
  }, []);

  const gerarDadosRelatorio = () => {
    const textoAplicadas = aplicadas.map((v) => `- ${v.vacina} (${v.data})`).join('\n');
    const textoPendentes = pendentes.map((v) => `- ${v.vacina}`).join('\n');
    return `
RELATÓRIO DE VACINAÇÃO
Paciente: ${user?.name || 'Maria Silva'}

TOMADAS:
${textoAplicadas}

PENDENTES:
${textoPendentes}
`;
  };

  const handleExibirCarteira = () => {
    MySwal.fire({
      title: 'Carteira Digital Oficial',
      html: (
        <div className="text-center p-2">
          <div className="bg-surface-container p-4 rounded-2xl mb-6 border border-outline-variant">
            <p className="font-bold text-lg">{user?.name || 'Maria Silva'}</p>
            <p className="text-sm font-semibold">CNS: 700 0000 0000 0000</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 rounded-xl">
            <QRCodeSVG value={gerarDadosRelatorio()} size={180} level="H" includeMargin />
          </div>
        </div>
      ),
      confirmButtonText: 'Fechar'
    });
  };

  const renderizarSelectUBS = () => {
    if (carregandoUbs) {
      return (
        <div className="w-full p-3 border rounded-xl text-center">
          Buscando UBS próximas...
        </div>
      );
    }
    return (
      <div className="relative">
        <select
          value={ubsEscolhida}
          onChange={(e) => setUbsEscolhida(e.target.value)}
          className="w-full p-3 border rounded-xl appearance-none"
        >
          {ubsProximas.map((ubs) => (
            <option key={ubs.id} value={ubs.nome}>
              {ubs.nome} - {ubs.distance.toFixed(1)} km
            </option>
          ))}
        </select>
        <HiSelector className="absolute right-3 top-1/2 -translate-y-1/2" size={18} />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black">Minha Carteira de Vacinação</h1>
          <p className="font-medium">Controle oficial de imunização.</p>
        </div>
        <button
          onClick={handleExibirCarteira}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl"
        >
          <HiQrcode size={22} />
          Gerar Relatório QR
        </button>
      </div>

      {pendentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-100 border-l-8 border-red-500 p-5 rounded-2xl mb-8"
        >
          <div className="flex items-center gap-4">
            <HiExclamation size={28} />
            <div>
              <p className="font-black text-lg">Vacinação Incompleta</p>
              <p>
                Dose de <strong>{vacinaPendente?.vacina}</strong> pendente.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <motion.div className="lg:col-span-2 bg-blue-600 rounded-3xl p-8 text-white">
          <div>
            <h2 className="text-2xl font-black">CERTIFICADO DE IMUNIZAÇÃO</h2>
            <div className="mt-10">
              <p className="text-2xl font-bold">{user?.name || 'Maria Silva'}</p>
            </div>
            <div className="flex gap-10 mt-10">
              <div>
                <p>Doses Aplicadas</p>
                <p className="text-3xl font-black">{aplicadas.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <HiClock size={24} />
              <span className="font-black">Próximo Registro</span>
            </div>
            <div className="p-5 rounded-2xl border mb-4">
              <p className="font-black text-xl">{vacinaPendente?.vacina || 'Nenhuma'}</p>
              <p className="font-bold mt-1">Reforço necessário</p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2">
                <HiLocationMarker size={16} />
                Unidade mais próxima:
              </label>
              {renderizarSelectUBS()}
            </div>
          </div>
          <button
            onClick={enviarNotificacaoLocal}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
          >
            <HiBell size={20} />
            Ativar Notificação
          </button>
        </motion.div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black">Histórico de Aplicações</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {historico.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border-2 flex gap-5"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  v.status === 'aplicada' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {v.status === 'aplicada' ? <HiCheckCircle size={30} /> : <HiClock size={30} />}
              </div>
              <div className="flex-1">
                <p className="font-black text-lg">{v.vacina}</p>
                <p className="font-bold text-sm">{v.dose}</p>
                <div className="flex gap-4 mt-3 text-[11px] font-bold uppercase">
                  <span>Lote: {v.lote}</span>
                  <span>Data: {v.data}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Vacinação;