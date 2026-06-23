// src/pages/HistoricoMedicoAdmin.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaStethoscope,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaHospital,
  FaTimes,
  FaArchive,
  FaUndo,
  FaFilter,
} from "react-icons/fa";
import Swal from "sweetalert2";

const HistoricoMedicoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  // 25 registros completos
  const initialRegistros = [
    {
      id: 1,
      paciente: "Maria Silva",
      data: "12/05/2024",
      medico: "Dr. Ricardo Silva",
      especialidade: "Clínico Geral",
      ubs: "UBS Central",
      diagnostico: "Gripe Sazonal",
      arquivado: false,
    },
    {
      id: 2,
      paciente: "José Santos",
      data: "28/04/2024",
      medico: "Dra. Ana Costa",
      especialidade: "Pediatria",
      ubs: "UBS Vila Mariana",
      diagnostico: "Check-up Rotina",
      arquivado: false,
    },
    {
      id: 3,
      paciente: "Pedro Alves",
      data: "15/03/2024",
      medico: "Dr. João Mendes",
      especialidade: "Ortopedia",
      ubs: "UPA Central",
      diagnostico: "Entorse Tornozelo",
      arquivado: false,
    },
    {
      id: 4,
      paciente: "Carla Souza",
      data: "02/06/2024",
      medico: "Dra. Beatriz Lima",
      especialidade: "Cardiologia",
      ubs: "UBS Sul",
      diagnostico: "Hipertensão Leve",
      arquivado: false,
    },
    {
      id: 5,
      paciente: "Fernanda Oliveira",
      data: "10/07/2024",
      medico: "Dr. Carlos Eduardo",
      especialidade: "Dermatologia",
      ubs: "UBS Leste",
      diagnostico: "Dermatite Atópica",
      arquivado: false,
    },
    {
      id: 6,
      paciente: "Roberto Nunes",
      data: "22/08/2024",
      medico: "Dra. Patricia Gomes",
      especialidade: "Ginecologia",
      ubs: "UBS Oeste",
      diagnostico: "Cisto Ovariano",
      arquivado: false,
    },
    {
      id: 7,
      paciente: "Juliana Castro",
      data: "05/09/2024",
      medico: "Dr. Marcos Pereira",
      especialidade: "Neurologia",
      ubs: "UBS Norte",
      diagnostico: "Enxaqueca Crônica",
      arquivado: false,
    },
    {
      id: 8,
      paciente: "Rafael Mendes",
      data: "18/10/2024",
      medico: "Dra. Fernanda Rocha",
      especialidade: "Oftalmologia",
      ubs: "UBS Central",
      diagnostico: "Miopia",
      arquivado: false,
    },
    {
      id: 9,
      paciente: "Amanda Lima",
      data: "30/11/2024",
      medico: "Dr. Gustavo Silva",
      especialidade: "Psiquiatria",
      ubs: "UBS Sul",
      diagnostico: "Ansiedade Generalizada",
      arquivado: false,
    },
    {
      id: 10,
      paciente: "Bruno Costa",
      data: "12/12/2024",
      medico: "Dra. Vanessa Almeida",
      especialidade: "Endocrinologia",
      ubs: "UBS Leste",
      diagnostico: "Diabetes Tipo 2",
      arquivado: false,
    },
    {
      id: 11,
      paciente: "Patrícia Santos",
      data: "25/01/2025",
      medico: "Dr. Anderson Freitas",
      especialidade: "Urologia",
      ubs: "UBS Oeste",
      diagnostico: "Infecção Urinária",
      arquivado: false,
    },
    {
      id: 12,
      paciente: "Lucas Ferreira",
      data: "08/02/2025",
      medico: "Dra. Camila Duarte",
      especialidade: "Pediatria",
      ubs: "UBS Norte",
      diagnostico: "Varicela",
      arquivado: false,
    },
    {
      id: 13,
      paciente: "Mariana Rocha",
      data: "20/03/2025",
      medico: "Dr. Eduardo Campos",
      especialidade: "Ortopedia",
      ubs: "UBS Central",
      diagnostico: "Fratura de Punho",
      arquivado: false,
    },
    {
      id: 14,
      paciente: "Tiago Oliveira",
      data: "02/04/2025",
      medico: "Dra. Juliana Mendes",
      especialidade: "Cardiologia",
      ubs: "UBS Sul",
      diagnostico: "Arritmia Cardíaca",
      arquivado: false,
    },
    {
      id: 15,
      paciente: "Beatriz Almeida",
      data: "15/05/2025",
      medico: "Dr. Renato Silva",
      especialidade: "Clínico Geral",
      ubs: "UBS Leste",
      diagnostico: "Hipertensão Arterial",
      arquivado: false,
    },
    // 16-25 novos
    {
      id: 16,
      paciente: "Gabriel Martins",
      data: "03/06/2025",
      medico: "Dra. Larissa Mendes",
      especialidade: "Oftalmologia",
      ubs: "UBS Central",
      diagnostico: "Astigmatismo",
      arquivado: false,
    },
    {
      id: 17,
      paciente: "Isabela Nogueira",
      data: "18/06/2025",
      medico: "Dr. Fábio Rocha",
      especialidade: "Ginecologia",
      ubs: "UBS Norte",
      diagnostico: "Endometriose",
      arquivado: false,
    },
    {
      id: 18,
      paciente: "Henrique Castro",
      data: "02/07/2025",
      medico: "Dra. Patricia Gomes",
      especialidade: "Cardiologia",
      ubs: "UBS Oeste",
      diagnostico: "Taquicardia Sinusal",
      arquivado: false,
    },
    {
      id: 19,
      paciente: "Camila Ferreira",
      data: "15/07/2025",
      medico: "Dr. Ricardo Silva",
      especialidade: "Clínico Geral",
      ubs: "UBS Sul",
      diagnostico: "Infecção de Garganta",
      arquivado: false,
    },
    {
      id: 20,
      paciente: "Rafaela Santos",
      data: "28/07/2025",
      medico: "Dra. Ana Costa",
      especialidade: "Pediatria",
      ubs: "UBS Leste",
      diagnostico: "Otite Média",
      arquivado: false,
    },
    {
      id: 21,
      paciente: "Eduardo Lima",
      data: "10/08/2025",
      medico: "Dr. João Mendes",
      especialidade: "Ortopedia",
      ubs: "UBS Central",
      diagnostico: "Bursite no Ombro",
      arquivado: false,
    },
    {
      id: 22,
      paciente: "Marina Oliveira",
      data: "22/08/2025",
      medico: "Dra. Beatriz Lima",
      especialidade: "Dermatologia",
      ubs: "UBS Norte",
      diagnostico: "Acne Vulgar",
      arquivado: false,
    },
    {
      id: 23,
      paciente: "Thiago Pereira",
      data: "05/09/2025",
      medico: "Dr. Carlos Eduardo",
      especialidade: "Neurologia",
      ubs: "UBS Oeste",
      diagnostico: "Cefaleia Tensional",
      arquivado: false,
    },
    {
      id: 24,
      paciente: "Leticia Costa",
      data: "18/09/2025",
      medico: "Dra. Fernanda Rocha",
      especialidade: "Endocrinologia",
      ubs: "UBS Sul",
      diagnostico: "Hipotireoidismo",
      arquivado: false,
    },
    {
      id: 25,
      paciente: "André Souza",
      data: "01/10/2025",
      medico: "Dr. Anderson Freitas",
      especialidade: "Urologia",
      ubs: "UBS Leste",
      diagnostico: "Litíase Renal",
      arquivado: false,
    },
  ];

  const [registros, setRegistros] = useState(initialRegistros);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("ativos");
  const itemsPerPage = 5;

  // Filtros
  const filtered = registros
    .filter((r) => {
      if (filterType === "ativos") return !r.arquivado;
      if (filterType === "arquivados") return r.arquivado;
      return true;
    })
    .filter(
      (r) =>
        r.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ubs.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const limparBusca = () => setSearchTerm("");
  const goToPage = (page) => setCurrentPage(page);

  // ===================== MODAL DE VISUALIZAÇÃO COM MAIS ESPAÇO =====================
  const visualizarRegistro = (registro) => {
    const statusLabel = registro.arquivado ? "Arquivado" : "Ativo";
    const statusColor = registro.arquivado ? "text-gray-500" : "text-green-600"; // verde para ativo

    Swal.fire({
      title: `<span style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">📋 Consulta de ${registro.paciente}</span>`,
      html: `
        <div style="text-align: left; font-family: 'Inter', sans-serif; max-width: 450px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 2rem; background: #f8fafc; padding: 1.5rem 2rem; border-radius: 1rem; border: 1px solid #e2e8f0;">
            <div><strong style="color: #475569;">Paciente</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.paciente}</span></div>
            <div><strong style="color: #475569;">Data</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.data}</span></div>
            <div><strong style="color: #475569;">Médico</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.medico}</span></div>
            <div><strong style="color: #475569;">Especialidade</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.especialidade}</span></div>
            <div><strong style="color: #475569;">UBS</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.ubs}</span></div>
            <div><strong style="color: #475569;">Diagnóstico</strong><br><span style="display: inline-block; background: #dbeafe; padding: 0.2rem 0.8rem; border-radius: 9999px; color: #1d4ed8; font-weight: 600;">${registro.diagnostico}</span></div>
          </div>
          <div style="margin-top: 1.5rem; text-align: center;">
            <span style="font-size: 1rem; font-weight: 600; color: ${statusColor};">Status: ${statusLabel}</span>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
      background: "#ffffff",
      customClass: {
        popup: "rounded-3xl shadow-2xl",
        confirmButton: "rounded-xl px-6 py-2.5 font-semibold",
      },
      showCloseButton: true,
      closeButtonColor: "#94a3b8",
    });
  };

  // ===================== FUNÇÕES DE AÇÃO (editar, arquivar, desarquivar, excluir) =====================
  const editarRegistro = (registro) => {
    Swal.fire({
      title: "Editar diagnóstico",
      html: `
        <input id="swal-diagnostico" class="swal2-input" placeholder="Novo diagnóstico" value="${registro.diagnostico}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const novoDiagnostico = document.getElementById("swal-diagnostico").value;
        if (!novoDiagnostico) {
          Swal.showValidationMessage("O diagnóstico é obrigatório");
          return;
        }
        return novoDiagnostico;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setRegistros((prev) =>
          prev.map((r) =>
            r.id === registro.id ? { ...r, diagnostico: result.value } : r
          )
        );
        Swal.fire({
          icon: "success",
          title: "Atualizado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const arquivarRegistro = (registro) => {
    Swal.fire({
      title: "Arquivar registro",
      text: `Deseja arquivar a consulta de ${registro.paciente}? O registro ficará oculto da lista ativa.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, arquivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setRegistros((prev) =>
          prev.map((r) =>
            r.id === registro.id ? { ...r, arquivado: true } : r
          )
        );
        Swal.fire({
          icon: "success",
          title: "Arquivado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const desarquivarRegistro = (registro) => {
    setRegistros((prev) =>
      prev.map((r) =>
        r.id === registro.id ? { ...r, arquivado: false } : r
      )
    );
    Swal.fire({
      icon: "success",
      title: "Desarquivado!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const excluirRegistro = (registro) => {
    Swal.fire({
      title: "Exclusão segura",
      html: `
        <p>Digite a senha de autorização para excluir permanentemente o registro de <strong>${registro.paciente}</strong>:</p>
        <input id="swal-senha" class="swal2-input" type="password" placeholder="Senha de autorização" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const senha = document.getElementById("swal-senha").value;
        if (senha !== "Autorizado123") {
          Swal.showValidationMessage("Senha incorreta! Acesso negado.");
          return false;
        }
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setRegistros((prev) => prev.filter((r) => r.id !== registro.id));
        Swal.fire({
          icon: "success",
          title: "Excluído!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaStethoscope className="text-blue-600" /> Histórico de Consultas
            </h1>
            <p className="text-gray-500">Acesso completo a todos os registros médicos.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              {filterType === "ativos" ? "Ativos" : "Arquivados"}: {totalItems}
            </span>
            {/* Botão de exportar removido */}
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <FaSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar por paciente, médico, especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 bg-transparent border-none focus:ring-0 outline-none text-gray-700"
            />
            {searchTerm && (
              <button onClick={limparBusca} className="text-gray-400 hover:text-gray-600 p-1">
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="ativos">Ativos</option>
              <option value="arquivados">Arquivados</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico / Esp.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UBS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Nenhum registro {filterType === "ativos" ? "ativo" : "arquivado"} encontrado.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={`hover:bg-blue-50 transition-colors cursor-pointer ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } ${r.arquivado ? "opacity-70" : ""}`}
                      onClick={() => visualizarRegistro(r)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaUser size={14} />
                          </div>
                          <span className="font-medium text-gray-800">{r.paciente}</span>
                          {r.arquivado && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Arquivado</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaCalendarAlt className="text-gray-400" size={12} />
                          {r.data}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{r.medico}</div>
                        <div className="text-xs text-gray-500">{r.especialidade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FaHospital className="text-blue-400" size={12} />
                          {r.ubs}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {r.diagnostico}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); visualizarRegistro(r); }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Visualizar"
                          >
                            <FaEye size={16} />
                          </button>
                          {!r.arquivado ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); editarRegistro(r); }}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                                title="Editar"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); arquivarRegistro(r); }}
                                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                title="Arquivar"
                              >
                                <FaArchive size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); desarquivarRegistro(r); }}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                              title="Desarquivar"
                            >
                              <FaUndo size={16} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); excluirRegistro(r); }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Excluir permanentemente"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems} registros
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Clique em qualquer linha para ver detalhes. Use as ações para editar, arquivar ou excluir (exclusão requer senha).
        </div>
      </div>
    </div>
  );
};

export default HistoricoMedicoAdmin;