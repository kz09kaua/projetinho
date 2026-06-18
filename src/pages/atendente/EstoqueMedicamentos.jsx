// src/pages/EstoqueMedicamentos.jsx
import { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const EstoqueMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([
    { id: 1, nome: 'Paracetamol 500mg', lote: 'PAR001', quantidade: 120, validade: '2026-05-20' },
    { id: 2, nome: 'Ibuprofeno 400mg', lote: 'IBU002', quantidade: 85, validade: '2025-11-15' },
    { id: 3, nome: 'Amoxicilina 500mg', lote: 'AMX003', quantidade: 42, validade: '2024-12-10' },
    { id: 4, nome: 'Losartana 50mg', lote: 'LOS004', quantidade: 18, validade: '2026-02-28' }
  ]);

  const atualizarQuantidade = (id, novaQtd) => {
    setMedicamentos(medicamentos.map(m => m.id === id ? { ...m, quantidade: Math.max(0, novaQtd) } : m));
    Swal.fire({
      icon: 'success',
      title: 'Atualizado',
      text: 'Quantidade alterada.',
      toast: true,
      position: 'top-end',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const adicionarMedicamento = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Novo medicamento',
      html: `
        <input id="nome" class="swal2-input" placeholder="Nome do medicamento" required>
        <input id="lote" class="swal2-input" placeholder="Lote" required>
        <input id="quantidade" type="number" class="swal2-input" placeholder="Quantidade" required>
        <input id="validade" type="date" class="swal2-input" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nome = document.getElementById('nome').value;
        const lote = document.getElementById('lote').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const validade = document.getElementById('validade').value;
        if (!nome || !lote || !quantidade || !validade) {
          Swal.showValidationMessage('Preencha todos os campos');
          return false;
        }
        return { nome, lote, quantidade, validade };
      }
    });
    if (formValues) {
      const newId = medicamentos.length + 1;
      setMedicamentos([...medicamentos, { id: newId, ...formValues }]);
      Swal.fire('Adicionado!', 'Medicamento cadastrado com sucesso.', 'success');
    }
  };

  const removerMedicamento = (id) => {
    Swal.fire({
      title: 'Remover medicamento?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover'
    }).then((result) => {
      if (result.isConfirmed) {
        setMedicamentos(medicamentos.filter(m => m.id !== id));
        Swal.fire('Removido!', 'Medicamento removido do estoque.', 'success');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface">Estoque de Medicamentos</h1>
          <p className="text-on-surface-variant">Controle de quantidades e validades.</p>
        </div>
        <button onClick={adicionarMedicamento} className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold shadow-md hover:opacity-90 transition">
          + Novo medicamento
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
        <table className="w-full bg-surface rounded-2xl border border-outline-variant">
          <thead className="bg-surface-container-high">
            <tr>
              <th className="p-3 text-left text-on-surface">Nome</th>
              <th className="p-3 text-left text-on-surface">Lote</th>
              <th className="p-3 text-left text-on-surface">Quantidade</th>
              <th className="p-3 text-left text-on-surface">Validade</th>
              <th className="p-3 text-left text-on-surface">Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.map(m => (
              <tr key={m.id} className="border-t border-outline-variant">
                <td className="p-3 text-on-surface">{m.nome}</td>
                <td className="p-3 text-on-surface">{m.lote}</td>
                <td className="p-3">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded bg-surface-container-lowest text-on-surface"
                    defaultValue={m.quantidade}
                    onBlur={(e) => atualizarQuantidade(m.id, parseInt(e.target.value))}
                    min="0"
                  />
                </td>
                <td className={`p-3 ${new Date(m.validade) < new Date() ? 'text-error' : 'text-on-surface'}`}>
                  {m.validade}
                </td>
                <td className="p-3">
                  <button onClick={() => removerMedicamento(m.id)} className="text-error hover:underline text-sm">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default EstoqueMedicamentos;