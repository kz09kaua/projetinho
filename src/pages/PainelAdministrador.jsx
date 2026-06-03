// src/pages/PainelAdministrador.jsx
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { HiUsers, HiClock, HiUserGroup } from 'react-icons/hi';
import Swal from 'sweetalert2';
import RelatorioPDF from '../components/RelatorioPDF';

const PainelAdministrador = () => {
  const [dadosRelatorio] = useState({
    aguardando: 24,
    variacao: '-12% em relação a ontem',
    mediaEspera: 18,
    percentualFila: 75,
    medicosAtivos: 8,
    capacidade: 80,
    fila: [
      { nome: 'Maria Oliveira', senha: 'P-042', tempo: 'Prioridade • 5 min', status: 'Chamando', prioridade: 'Prioridade' },
      { nome: 'João dos Santos', senha: 'G-108', tempo: 'Aguardando 12 min', status: 'Aguardando', prioridade: 'Normal' },
      { nome: 'Ana Paula Souza', senha: 'G-112', tempo: 'Aguardando 8 min', status: 'Aguardando', prioridade: 'Normal' },
    ],
  });

  const gerarRelatorioPDF = async () => {
    try {
      // Validação simples
      if (!dadosRelatorio || !dadosRelatorio.fila) {
        throw new Error('Dados incompletos');
      }

      // Gera o PDF
      const blob = await pdf(<RelatorioPDF dados={dadosRelatorio} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_ubs_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      await Swal.fire({
        icon: 'success',
        title: 'Relatório gerado!',
        text: 'O PDF foi baixado com sucesso.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível gerar o relatório. Verifique a instalação do @react-pdf/renderer.',
        confirmButtonColor: '#0057B8',
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Painel do Administrador</h1>
        <button
          onClick={gerarRelatorioPDF}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2 transition shadow-md dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          📄 Relatórios
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Aguardando Agora</span>
            <HiUsers size={24} className="text-blue-700 dark:text-blue-400" />
          </div>
          <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-gray-100">24</p>
          <p className="text-green-600 text-sm">-12% em relação a ontem</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Média de Espera</span>
            <HiClock size={24} className="text-amber-700 dark:text-amber-400" />
          </div>
          <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-gray-100">18<span className="text-lg">min</span></p>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
            <div className="h-full w-3/4 bg-amber-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Médicos Ativos</span>
            <HiUserGroup size={24} className="text-green-700 dark:text-green-400" />
          </div>
          <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-gray-100">08<span className="text-lg">/10</span></p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Capacidade de 80%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Fila de Atendimento</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">Maria Oliveira</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Senha: P-042 • Prioridade</p>
              </div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition">CHAMAR</button>
            </div>
            <div className="border p-4 rounded-lg flex justify-between items-center dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">João dos Santos</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Senha: G-108 • Aguardando 12 min</p>
              </div>
              <button className="border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">Chamar</button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Fluxo do Dia</h3>
          <div className="h-32 flex items-end gap-1">
            {[40,55,70,95,80,60,30].map((h,i) => (
              <div key={i} className="flex-grow bg-blue-600 dark:bg-blue-500 rounded-t" style={{height: `${h}%`}} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>08h</span><span>10h</span><span>12h</span><span>14h</span><span>16h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelAdministrador;