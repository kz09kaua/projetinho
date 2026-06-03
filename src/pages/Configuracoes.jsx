// src/pages/Configuracoes.jsx
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../contexts/AccessibilityContext';
import Swal from 'sweetalert2';

const Configuracoes = () => {
  // Estados reais (aplicados instantaneamente)
  const { theme, setTheme, fontSize, setFontSize, primaryColor, setPrimaryColor } = useTheme();
  const { modoSenior, setModoSenior, altoContraste, setAltoContraste } = useAccessibility();

  const [notifications, setNotifications] = useState({
    agendamentos: true,
    filas: true,
    vacinas: false,
  });

  const handleNotifChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    Swal.fire({
      icon: 'success',
      title: 'Notificação atualizada',
      text: `${key === 'agendamentos' ? 'Alertas de agendamento' : key === 'filas' ? 'Chamadas de fila' : 'Vacinas'} ${!notifications[key] ? 'ativados' : 'desativados'}.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const coresPreset = [
    { nome: 'Azul SUS', valor: '#0057B8' },
    { nome: 'Verde Saúde', valor: '#2e7d32' },
    { nome: 'Roxo Acessível', valor: '#6a1b9a' },
    { nome: 'Laranja', valor: '#e65100' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">⚙️ Configurações do Sistema</h1>
      <p className="text-gray-500 mb-8">Personalize a aparência e as preferências da sua conta.</p>

      {/* Aparência */}
      <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          </div>
          <h2 className="text-xl font-bold">Aparência</h2>
        </div>

        <div className="space-y-6">
          {/* Tema */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Tema do Sistema</p>
              <p className="text-sm text-gray-500">Claro ou escuro</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${theme === 'light' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Escuro
              </button>
            </div>
          </div>
          <hr />

          {/* Tamanho da fonte */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Tamanho da Fonte</span>
              <span className="text-primary font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">
                {fontSize}%
              </span>
            </div>
            <div className="relative pt-2">
              <input
                type="range"
                min="80"
                max="150"
                step="5"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="relative w-full mt-1 h-5">
                <div className="absolute text-xs text-gray-400 -translate-x-1/2" style={{ left: '0%' }}>80%</div>
                <div className="absolute text-xs text-gray-400 -translate-x-1/2" style={{ left: '21.43%' }}>95%</div>
                <div className="absolute text-xs text-gray-400 -translate-x-1/2" style={{ left: '50%' }}>115%</div>
                <div className="absolute text-xs text-gray-400 -translate-x-1/2" style={{ left: '71.43%' }}>130%</div>
                <div className="absolute text-xs text-gray-400 -translate-x-1/2" style={{ left: '100%' }}>150%</div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center transition-all">
              <p className="text-sm text-gray-500 mb-2">🔍 Pré-visualização</p>
              <p className="text-gray-700 dark:text-gray-300" style={{ fontSize: `${fontSize}%` }}>
                Este texto está com {fontSize}% do tamanho original.
              </p>
            </div>
          </div>
          <hr />

          {/* Cor principal */}
          <div>
            <p className="font-semibold mb-3">Cor Principal</p>
            <div className="flex gap-4 flex-wrap items-center">
              {coresPreset.map(cor => (
                <button
                  key={cor.valor}
                  onClick={() => setPrimaryColor(cor.valor)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${primaryColor === cor.valor ? 'border-black scale-110' : 'border-white'}`}
                  style={{ backgroundColor: cor.valor }}
                  title={cor.nome}
                />
              ))}
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-full border cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          </div>
          <h2 className="text-xl font-bold">Notificações</h2>
        </div>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span>Alertas de Agendamento</span>
            <input
              type="checkbox"
              checked={notifications.agendamentos}
              onChange={() => handleNotifChange('agendamentos')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </li>
          <li className="flex justify-between items-center">
            <span>Chamadas de Fila</span>
            <input
              type="checkbox"
              checked={notifications.filas}
              onChange={() => handleNotifChange('filas')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </li>
          <li className="flex justify-between items-center">
            <span>Vacinas Disponíveis</span>
            <input
              type="checkbox"
              checked={notifications.vacinas}
              onChange={() => handleNotifChange('vacinas')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </li>
        </ul>
      </div>

      {/* Acessibilidade (sem botão salvar) */}
      <div className="bg-blue-800 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          </div>
          <h2 className="text-xl font-bold">Acessibilidade</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between bg-white/10 p-4 rounded-xl cursor-pointer">
            <div>
              <p className="font-medium">Modo Sênior</p>
              <p className="text-xs opacity-80">Interface simplificada e maior</p>
            </div>
            <input
              type="checkbox"
              checked={modoSenior}
              onChange={(e) => setModoSenior(e.target.checked)}
              className="w-5 h-5 rounded border-white text-blue-600 focus:ring-white"
            />
          </label>
          <label className="flex items-center justify-between bg-white/10 p-4 rounded-xl cursor-pointer">
            <div>
              <p className="font-medium">Alto Contraste</p>
              <p className="text-xs opacity-80">Cores de alto contraste</p>
            </div>
            <input
              type="checkbox"
              checked={altoContraste}
              onChange={(e) => setAltoContraste(e.target.checked)}
              className="w-5 h-5 rounded border-white text-blue-600 focus:ring-white"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;