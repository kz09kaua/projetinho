const HistoricoMedico = () => {
  const historico = [
    { data: '12/05/2024', medico: 'Dr. Ricardo Silva', especialidade: 'Clínico Geral', ubs: 'UBS Central Lapa', diagnostico: 'Gripe Sazonal' },
    { data: '28/04/2024', medico: 'Dra. Ana Costa', especialidade: 'Pediatria', ubs: 'UBS Vila Mariana', diagnostico: 'Check-up Rotina' },
    { data: '15/03/2024', medico: 'Dr. João Mendes', especialidade: 'Ortopedia', ubs: 'UPA Central', diagnostico: 'Entorse Tornozelo' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Histórico de Consultas</h1>
      <p className="text-gray-500 mb-6">Visualize e baixe seus registros médicos anteriores.</p>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-700 text-white p-5 rounded-2xl"><p className="text-sm opacity-80">Total de Consultas</p><p className="text-3xl font-bold">24</p></div>
        <div className="bg-white p-5 rounded-2xl border"><p className="text-sm text-gray-400">Última UBS</p><p className="text-xl font-bold">UBS Vila Mariana</p></div>
        <div className="bg-white p-5 rounded-2xl border flex justify-between items-center">
          <div><p className="text-sm text-gray-400">Lembrete de Saúde</p><p className="font-bold">Vacina de reforço disponível</p><button className="text-blue-700 text-sm mt-1">Agendar →</button></div>
          <span className="text-4xl opacity-20">💉</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-6 py-3 text-left">Data</th><th>Médico/Especialidade</th><th>UBS / Unidade</th><th>Diagnóstico</th></tr>
          </thead>
          <tbody>
            {historico.map((h, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-6 py-4">{h.data}</td>
                <td><div className="font-medium">{h.medico}</div><div className="text-xs text-gray-500">{h.especialidade}</div></td>
                <td>{h.ubs}</td>
                <td><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">{h.diagnostico}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoMedico;