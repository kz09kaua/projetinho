import { useState } from 'react';

const Agendamento = () => {
  const [consultas, setConsultas] = useState([
    { id: 1, data: '10/04/2025', horario: '09:00', medico: 'Dra. Ana', especialidade: 'Clínica Geral' },
    { id: 2, data: '15/04/2025', horario: '14:30', medico: 'Dr. Carlos', especialidade: 'Cardiologia' },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Novo Agendamento</h1>
      <p className="text-gray-500 mb-6">Selecione os detalhes da sua consulta abaixo.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulário de especialidade e unidade */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <label className="block font-semibold mb-3">Especialidade</label>
          <div className="space-y-2">
            {['Clínica Geral', 'Ginecologia', 'Pediatria', 'Psicologia'].map(esp => (
              <button key={esp} className="w-full flex items-center justify-between p-3 border rounded-xl hover:border-blue-500 transition">
                <span>{esp}</span>
                <span className="material-symbols-outlined text-blue-600">check_circle</span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <label className="block font-semibold mb-2">Unidade de Saúde</label>
            <select className="w-full p-3 border rounded-xl">
              <option>UBS Santa Cecília - Central</option>
              <option>UBS Vila Maria - Norte</option>
            </select>
          </div>
        </div>

        {/* Calendário e horários */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Dezembro 2024</h3>
              <div className="flex gap-1">
                <button className="p-1">&lt;</button>
                <button className="p-1">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
              <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[28,29,30,1,2,3,4,5,6,7,8,9,10,11].map((d, i) => (
                <div key={i} className={`p-2 text-center rounded-lg cursor-pointer ${d === 6 ? 'bg-blue-700 text-white' : 'hover:bg-blue-50'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-700"></span> Selecionado</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200 border"></span> Indisponível</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <label className="block font-semibold mb-3">Horários Disponíveis</label>
            <div className="grid grid-cols-3 gap-2">
              {['08:00','08:30','09:00','09:30','10:00','10:30'].map(h => (
                <button key={h} className={`p-2 border rounded-lg text-sm ${h === '09:00' ? 'bg-blue-700 text-white' : 'hover:bg-blue-50'}`}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo e confirmação */}
      <div className="mt-8 bg-blue-700 p-6 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-xl font-bold">Confirmar Agendamento?</h4>
          <p>Sexta-feira, 06 de Dezembro às 09:00</p>
        </div>
        <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
          AGENDAR AGORA
        </button>
      </div>

      {/* Tabela de próximos agendamentos */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Próximas Consultas</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left">Data</th><th>Horário</th><th>Médico</th><th>Especialidade</th></tr>
            </thead>
            <tbody>
              {consultas.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="px-6 py-4">{c.data}</td><td>{c.horario}</td><td>{c.medico}</td><td>{c.especialidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;