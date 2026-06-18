// src/pages/VacinaçãoAttendente.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiSearch,
  HiUser,
  HiX,
  HiPlus,
  HiCheckCircle,
  HiClock,
  HiExclamation,
} from "react-icons/hi";
import Swal from "sweetalert2";

const VacinaçãoAttendente = () => {
  const { user } = useAuth();
  if (user?.role !== "atendente") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Acesso restrito a atendentes.</p>
      </div>
    );
  }

  const [cpfBusca, setCpfBusca] = useState("");
  const [paciente, setPaciente] = useState(null);

  // Mock de dados de vacinação
  const pacientesVacinaMock = [
    {
      id: 1,
      nome: "Maria Silva",
      cpf: "123.456.789-00",
      sus: "1234 5678 9012",
      vacinas: [
        {
          id: 1,
          vacina: "COVID-19",
          dose: "4ª Dose",
          data: "12/05/2024",
          lote: "AB9023",
          status: "aplicada",
        },
        {
          id: 2,
          vacina: "Hepatite B",
          dose: "Dose Única",
          data: "08/02/2024",
          lote: "HP5521",
          status: "aplicada",
        },
        {
          id: 3,
          vacina: "Antitetânica",
          dose: "Reforço",
          data: null,
          lote: null,
          status: "pendente",
        },
      ],
    },
    {
      id: 2,
      nome: "José Santos",
      cpf: "987.654.321-00",
      sus: "9876 5432 1098",
      vacinas: [
        {
          id: 4,
          vacina: "COVID-19",
          dose: "3ª Dose",
          data: "10/03/2024",
          lote: "AB1234",
          status: "aplicada",
        },
        {
          id: 5,
          vacina: "Gripe",
          dose: "Dose Anual",
          data: null,
          lote: null,
          status: "pendente",
        },
      ],
    },
  ];

  const buscarPaciente = () => {
    const cpfLimpo = cpfBusca.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Swal.fire("CPF inválido", "Digite um CPF válido.", "warning");
      return;
    }
    const encontrado = pacientesVacinaMock.find((p) => p.cpf === cpfBusca);
    if (encontrado) {
      setPaciente(encontrado);
      Swal.fire(
        "Paciente encontrado",
        `Carteira de ${encontrado.nome}`,
        "success",
      );
    } else {
      Swal.fire("Não encontrado", "Nenhum paciente com esse CPF.", "error");
      setPaciente(null);
    }
  };

  const limparBusca = () => {
    setCpfBusca("");
    setPaciente(null);
  };

  const registrarVacina = async (vacina) => {
    const { value: formValues } = await Swal.fire({
      title: `Registrar aplicação - ${vacina.vacina}`,
      html: `
        <input id="lote" class="swal2-input" placeholder="Lote" required>
        <input id="data" type="date" class="swal2-input" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const lote = document.getElementById("lote").value;
        const data = document.getElementById("data").value;
        if (!lote || !data) {
          Swal.showValidationMessage("Preencha todos os campos");
          return false;
        }
        return { lote, data };
      },
    });
    if (formValues) {
      // Atualiza o estado local
      setPaciente((prev) => ({
        ...prev,
        vacinas: prev.vacinas.map((v) =>
          v.id === vacina.id
            ? {
                ...v,
                status: "aplicada",
                lote: formValues.lote,
                data: formValues.data,
              }
            : v,
        ),
      }));
      Swal.fire(
        "Registrado!",
        `Vacina ${vacina.vacina} registrada com sucesso.`,
        "success",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-on-surface mb-2">
        Carteira de Vacinação - Atendente
      </h1>
      <p className="text-on-surface-variant mb-8">
        Busque um paciente para visualizar e registrar vacinas.
      </p>

      {/* Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
              placeholder="CPF do paciente"
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
              maxLength={14}
            />
            <HiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={buscarPaciente}
            className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800"
          >
            Buscar
          </button>
          <button
            onClick={limparBusca}
            className="border p-3 rounded-xl hover:bg-gray-50"
          >
            <HiX size={20} />
          </button>
        </div>
      </div>

      {paciente && (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border flex items-center gap-3">
            <HiUser className="text-blue-700" size={24} />
            <div>
              <p className="font-bold text-xl">{paciente.nome}</p>
              <p className="text-sm">
                CPF: {paciente.cpf} | CNS: {paciente.sus}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Registro de Doses</h2>
            </div>
            <div className="divide-y">
              {paciente.vacinas.map((v) => (
                <div
                  key={v.id}
                  className="p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {v.vacina} - {v.dose}
                    </p>
                    {v.status === "aplicada" ? (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <HiCheckCircle size={16} /> Aplicada em {v.data} (Lote:{" "}
                        {v.lote})
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <HiExclamation size={16} /> Pendente
                      </p>
                    )}
                  </div>
                  {v.status === "pendente" && (
                    <button
                      onClick={() => registrarVacina(v)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition"
                    >
                      <HiPlus className="inline mr-1" /> Registrar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!paciente && (
        <div className="text-center text-gray-500 mt-20">
          <HiClock size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum paciente selecionado. Use a busca acima.</p>
        </div>
      )}
    </div>
  );
};

export default VacinaçãoAttendente;
