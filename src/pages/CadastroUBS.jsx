import { useState } from 'react';

const CadastroUBS = () => {
  const [form, setForm] = useState({ nome: '', endereco: '', cidade: '', telefone: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    alert(`UBS ${form.nome} cadastrada com sucesso!`);
    setForm({ nome: '', endereco: '', cidade: '', telefone: '' });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Unidade Básica de Saúde</h1>
      <p className="text-gray-500 mb-6">Preencha os dados da nova UBS.</p>
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block font-medium">Nome da UBS</label><input name="nome" value={form.nome} onChange={handleChange} className="w-full border p-3 rounded-xl" required /></div>
          <div><label className="block font-medium">Endereço</label><input name="endereco" value={form.endereco} onChange={handleChange} className="w-full border p-3 rounded-xl" required /></div>
          <div><label className="block font-medium">Cidade</label><input name="cidade" value={form.cidade} onChange={handleChange} className="w-full border p-3 rounded-xl" required /></div>
          <div><label className="block font-medium">Telefone</label><input name="telefone" value={form.telefone} onChange={handleChange} className="w-full border p-3 rounded-xl" required /></div>
          <button type="submit" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition">Cadastrar UBS</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroUBS;