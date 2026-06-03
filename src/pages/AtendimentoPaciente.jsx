// src/pages/AtendimentoPaciente.jsx
import { useState } from 'react';
import Swal from 'sweetalert2';

const AtendimentoPaciente = () => {
  const [cpf, setCpf] = useState('');
  const [paciente, setPaciente] = useState(null);

  const buscarPaciente = () => {
    const users = JSON.parse(localStorage.getItem('sus_users') || '[]');
    const found = users.find(u => u.cpf === cpf.replace(/\D/g, ''));
    if (found) {
      setPaciente(found);
      Swal.fire('Paciente encontrado', `Nome: ${found.nome}`, 'success');
    } else {
      Swal.fire('Não encontrado', 'CPF não cadastrado.', 'error');
      setPaciente(null);
    }
  };

  const agendarConsulta = () => {
    Swal.fire('Agendamento', `Consulta agendada para ${paciente.nome}`, 'info');
  };

  const registrarVacina = () => {
    Swal.fire('Vacina', `Vacina aplicada em ${paciente.nome}`, 'success');
  };

  if (!paciente) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-surface rounded-2xl shadow">
        <h1 className="text-2xl font-black mb-4">Atendimento ao Paciente</h1>
        <label className="block mb-2">CPF do paciente</label>
        <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} className="w-full p-3 border rounded-xl mb-4" />
        <button onClick={buscarPaciente} className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold">Buscar</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-surface rounded-2xl shadow">
      <h1 className="text-2xl font-black mb-2">Dados do Paciente</h1>
      <p><strong>Nome:</strong> {paciente.nome}</p>
      <p><strong>CPF:</strong> {paciente.cpf}</p>
      <p><strong>Telefone:</strong> {paciente.telefone}</p>
      <p><strong>Email:</strong> {paciente.email}</p>
      <div className="flex gap-4 mt-8">
        <button onClick={agendarConsulta} className="flex-1 bg-blue-600 text-white py-2 rounded-xl">Agendar consulta</button>
        <button onClick={registrarVacina} className="flex-1 bg-green-600 text-white py-2 rounded-xl">Registrar vacina</button>
        <button onClick={() => setPaciente(null)} className="flex-1 bg-gray-500 text-white py-2 rounded-xl">Voltar</button>
      </div>
    </div>
  );
};

export default AtendimentoPaciente;