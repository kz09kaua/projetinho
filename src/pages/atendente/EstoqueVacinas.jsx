// src/pages/EstoqueVacinas.jsx
import { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const EstoqueVacinas = () => {
  const [vacinas, setVacinas] = useState([
    { id: 1, nome: 'COVID-19', lote: 'AB123', quantidade: 45, validade: '2025-12-31' },
    { id: 2, nome: 'Gripe', lote: 'GR789', quantidade: 12, validade: '2024-10-15' },
    { id: 3, nome: 'Febre Amarela', lote: 'FA456', quantidade: 5, validade: '2026-01-20' },
    { id: 4, nome: 'Hepatite B', lote: 'HB321', quantidade: 28, validade: '2025-06-10' }
  ]);

  const atualizarQuantidade = (id, novaQtd) => {
    setVacinas(vacinas.map(v => v.id === id ? { ...v, quantidade: Math.max(0, novaQtd) } : v));
    Swal.fire({
      icon: 'success',
      title: 'Atualizado',
      text: 'Quantidade alterada com sucesso.',
      toast: true,
      position: 'top-end',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const adicionarVacina = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nova vacina',
      html: `
        <input id="nome" class="swal2-input" placeholder="Nome da vacina" required>
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
      const newId = vacinas.length + 1;
      setVacinas([...vacinas, { id: newId, ...formValues }]);
      Swal.fire('Adicionada!', 'Vacina cadastrada com sucesso.', 'success');
    }
  };

  const removerVacina = (id) => {
    Swal.fire({
      title: 'Remover vacina?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover'
    }).then((result) => {
      if (result.isConfirmed) {
        setVacinas(vacinas.filter(v => v.id !== id));
        Swal.fire('Removida!', 'Vacina removida do estoque.', 'success');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface">Estoque de Vacinas</h1>
          <p className="text-on-surface-variant">Controle de quantidades e validades.</p>
        </div>
        <button onClick={adicionarVacina} className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold shadow-md hover:opacity-90 transition">
          + Nova vacina
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
            {vacinas.map(v => (
              <tr key={v.id} className="border-t border-outline-variant">
                <td className="p-3 text-on-surface">{v.nome}</td>
                <td className="p-3 text-on-surface">{v.lote}</td>
                <td className="p-3">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded bg-surface-container-lowest text-on-surface"
                    defaultValue={v.quantidade}
                    onBlur={(e) => atualizarQuantidade(v.id, parseInt(e.target.value))}
                    min="0"
                  />
                </td>
                <td className={`p-3 ${new Date(v.validade) < new Date() ? 'text-error' : 'text-on-surface'}`}>
                  {v.validade}
                </td>
                <td className="p-3">
                  <button onClick={() => removerVacina(v.id)} className="text-error hover:underline text-sm">
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

export default EstoqueVacinas;