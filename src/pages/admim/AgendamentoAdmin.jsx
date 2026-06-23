// src/pages/AgendamentoAdmin.jsx
import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiCalendar,
  HiClock,
  HiChartBar,
  HiPrinter,
  HiPlus,
  HiSearch,
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiFilter,
  HiSortAscending,
  HiSortDescending,
  HiArchive,
  HiArrowNarrowLeft,
} from "react-icons/hi";
import Swal from "sweetalert2";

// ============================================================
// DADOS MOCKADOS (15 médicos, 50 consultas)
// ============================================================
const medicosMock = [
  { id: 1, nome: "Dra. Ana Paula Costa", especialidade: "Clínica Geral" },
  { id: 2, nome: "Dr. Carlos Eduardo Silva", especialidade: "Cardiologia" },
  { id: 3, nome: "Dr. Paulo Roberto Lima", especialidade: "Pediatria" },
  { id: 4, nome: "Dra. Mariana Oliveira", especialidade: "Ginecologia" },
  { id: 5, nome: "Dr. João Mendes", especialidade: "Ortopedia" },
  { id: 6, nome: "Dra. Fernanda Rocha", especialidade: "Oftalmologia" },
  { id: 7, nome: "Dr. Ricardo Santos", especialidade: "Dermatologia" },
  { id: 8, nome: "Dra. Beatriz Lima", especialidade: "Neurologia" },
  { id: 9, nome: "Dr. André Freitas", especialidade: "Urologia" },
  { id: 10, nome: "Dra. Camila Duarte", especialidade: "Endocrinologia" },
  { id: 11, nome: "Dr. Gustavo Silva", especialidade: "Psiquiatria" },
  { id: 12, nome: "Dra. Patricia Gomes", especialidade: "Cardiologia" },
  { id: 13, nome: "Dr. Marcos Pereira", especialidade: "Ortopedia" },
  { id: 14, nome: "Dra. Larissa Mendes", especialidade: "Ginecologia" },
  { id: 15, nome: "Dr. Eduardo Campos", especialidade: "Clínica Geral" },
];

const statusOptions = ["Confirmado", "Pendente", "Cancelado", "Concluído"];

const generateAgendamentos = () => {
  const pacientes = [
    "Maria Silva", "José Santos", "Pedro Alves", "Carla Souza", "Fernanda Oliveira",
    "Roberto Nunes", "Juliana Castro", "Rafael Mendes", "Amanda Lima", "Bruno Costa",
    "Patrícia Santos", "Lucas Ferreira", "Mariana Rocha", "Tiago Oliveira", "Beatriz Almeida",
    "Gabriel Martins", "Isabela Nogueira", "Henrique Castro", "Camila Ferreira", "Rafaela Santos",
    "Eduardo Lima", "Marina Oliveira", "Thiago Pereira", "Letícia Costa", "André Souza",
    "Paula Mendes", "Felipe Rodrigues", "Carolina Alves", "Daniel Oliveira", "Vanessa Santos",
  ];

  const agendamentos = [];
  for (let i = 1; i <= 50; i++) {
    const medico = medicosMock[Math.floor(Math.random() * medicosMock.length)];
    const paciente = pacientes[Math.floor(Math.random() * pacientes.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const ano = 2025;
    const data = `${dia}/${mes}/${ano}`;
    const hora = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;
    agendamentos.push({
      id: i,
      paciente,
      medico: medico.nome,
      especialidade: medico.especialidade,
      data,
      horario: hora,
      status,
      observacoes: `Observação ${i}`,
      arquivado: false,
    });
  }
  return agendamentos;
};

const initialAgendamentos = generateAgendamentos();

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const AgendamentoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  const [agendamentos, setAgendamentos] = useState(initialAgendamentos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterMedico, setFilterMedico] = useState("Todos");
  const [filterDate, setFilterDate] = useState("");
  const [filterArchive, setFilterArchive] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "data", direction: "asc" });
  const itemsPerPage = 8;

  const filteredData = useMemo(() => {
    let result = agendamentos.filter((item) => {
      if (filterArchive === "arquivados" && !item.arquivado) return false;
      const matchSearch =
        item.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "Todos" || item.status === filterStatus;
      const matchMedico = filterMedico === "Todos" || item.medico === filterMedico;
      const matchDate = filterDate === "" || item.data === filterDate;
      return matchSearch && matchStatus && matchMedico && matchDate;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "data") {
          const [diaA, mesA, anoA] = aVal.split("/");
          const [diaB, mesB, anoB] = bVal.split("/");
          aVal = new Date(`${anoA}-${mesA}-${diaA}`);
          bVal = new Date(`${anoB}-${mesB}-${diaB}`);
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [agendamentos, searchTerm, filterStatus, filterMedico, filterDate, filterArchive, sortConfig]);

  const metrics = useMemo(() => {
    const total = filteredData.length;
    const confirmados = filteredData.filter((a) => a.status === "Confirmado").length;
    const pendentes = filteredData.filter((a) => a.status === "Pendente").length;
    const cancelados = filteredData.filter((a) => a.status === "Cancelado").length;
    const concluidos = filteredData.filter((a) => a.status === "Concluído").length;
    const medicosAtivos = new Set(filteredData.map((a) => a.medico)).size;
    const ocupacao = total > 0 ? Math.round((confirmados / total) * 100) : 0;
    const arquivados = agendamentos.filter((a) => a.arquivado).length;
    return { total, confirmados, pendentes, cancelados, concluidos, medicosAtivos, ocupacao, arquivados };
  }, [filteredData, agendamentos]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ============================================================
  // CRUD CORRIGIDO (MODAL "NOVO AGENDAMENTO")
  // ============================================================
  const handleNovoAgendamento = () => {
    Swal.fire({
      title: 'Novo Agendamento',
      html: `
        <div style="text-align: left; max-width: 100%; padding: 0; margin: 0; box-sizing: border-box;">
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Paciente</label>
              <input id="swal-paciente" placeholder="Nome completo do paciente" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;" />
            </div>
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Médico</label>
              <select id="swal-medico" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; background: white; box-sizing: border-box; appearance: auto;">
                ${medicosMock.map((m) => `<option value="${m.nome}">${m.nome} - ${m.especialidade}</option>`).join("")}
              </select>
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Data</label>
              <input id="swal-data" type="date" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;" />
            </div>
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Horário</label>
              <input id="swal-horario" type="time" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;" />
            </div>
          </div>
          <div style="margin-bottom: 8px; box-sizing: border-box;">
            <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Observações</label>
            <textarea id="swal-observacoes" placeholder="Informações adicionais (opcional)" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; resize: none; min-height: 60px; box-sizing: border-box; background: white;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agendar',
      cancelButtonText: 'Cancelar',
      width: 560,
      padding: '1.5rem',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
      },
      preConfirm: () => {
        const paciente = document.getElementById('swal-paciente').value.trim();
        const medico = document.getElementById('swal-medico').value;
        const data = document.getElementById('swal-data').value;
        const horario = document.getElementById('swal-horario').value;
        const observacoes = document.getElementById('swal-observacoes').value.trim();

        if (!paciente || !medico || !data || !horario) {
          Swal.showValidationMessage('Preencha todos os campos obrigatórios.');
          return;
        }

        const dataAtual = new Date();
        const dataSelecionada = new Date(data + 'T' + horario);
        if (dataSelecionada < dataAtual) {
          Swal.showValidationMessage('A data/hora não pode ser no passado.');
          return;
        }

        const medicoObj = medicosMock.find((m) => m.nome === medico);
        return {
          paciente,
          medico,
          especialidade: medicoObj ? medicoObj.especialidade : '',
          data: data.split('-').reverse().join('/'),
          horario,
          observacoes,
          status: 'Pendente',
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const novo = { id: Date.now(), ...result.value, arquivado: false };
        setAgendamentos((prev) => [novo, ...prev]);
        Swal.fire({
          icon: 'success',
          title: 'Agendamento criado!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // ============================================================
  // MODAL DE EDIÇÃO CORRIGIDO
  // ============================================================
  const handleEditar = (agendamento) => {
    const medicoOptions = medicosMock.map(
      (m) =>
        `<option value="${m.nome}" ${m.nome === agendamento.medico ? "selected" : ""}>${m.nome} - ${m.especialidade}</option>`
    ).join("");

    const statusOptionsHtml = statusOptions.map(
      (s) =>
        `<option value="${s}" ${s === agendamento.status ? "selected" : ""}>${s}</option>`
    ).join("");

    Swal.fire({
      title: "Editar Agendamento",
      html: `
        <div style="text-align: left; max-width: 100%; padding: 0; margin: 0; box-sizing: border-box;">
          <!-- Linha Paciente e Médico -->
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Paciente</label>
              <input id="swal-paciente" value="${agendamento.paciente}" placeholder="Paciente" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;" />
            </div>
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Médico</label>
              <select id="swal-medico" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; background: white; box-sizing: border-box; appearance: auto;">
                ${medicoOptions}
              </select>
            </div>
          </div>
          <!-- Linha Data e Horário -->
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Data</label>
              <input id="swal-data" type="date" value="${agendamento.data.split("/").reverse().join("-")}" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;" />
            </div>
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Horário</label>
              <input id="swal-horario" type="time" value="${agendamento.horario}" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; box-sizing: border-box; background: white;" />
            </div>
          </div>
          <!-- Linha Observações e Status -->
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Observações</label>
              <textarea id="swal-observacoes" placeholder="Observações" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; resize: none; min-height: 60px; box-sizing: border-box; background: white;">${agendamento.observacoes || ""}</textarea>
            </div>
            <div style="flex: 1 1 calc(50% - 6px); min-width: 150px; box-sizing: border-box;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #1e293b; font-size: 0.9rem;">Status</label>
              <select id="swal-status" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; background: white; box-sizing: border-box; appearance: auto;">
                ${statusOptionsHtml}
              </select>
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      width: 560,
      padding: "1.5rem",
      customClass: {
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        confirmButton: "swal-custom-confirm",
        cancelButton: "swal-custom-cancel",
      },
      preConfirm: () => {
        const paciente = document.getElementById("swal-paciente").value.trim();
        const medico = document.getElementById("swal-medico").value;
        const data = document.getElementById("swal-data").value;
        const horario = document.getElementById("swal-horario").value;
        const observacoes = document.getElementById("swal-observacoes").value.trim();
        const status = document.getElementById("swal-status").value;

        if (!paciente || !medico || !data || !horario) {
          Swal.showValidationMessage("Preencha todos os campos obrigatórios.");
          return;
        }

        const medicoObj = medicosMock.find((m) => m.nome === medico);
        return {
          paciente,
          medico,
          especialidade: medicoObj ? medicoObj.especialidade : "",
          data: data.split("-").reverse().join("/"),
          horario,
          observacoes,
          status,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setAgendamentos((prev) =>
          prev.map((a) => (a.id === agendamento.id ? { ...a, ...result.value } : a))
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

  // ============================================================
  // DEMAIS FUNÇÕES (ARQUIVAR, EXCLUIR, RELATÓRIO, ETC)
  // ============================================================
  const handleArquivar = (agendamento) => {
    Swal.fire({
      title: "Arquivar agendamento",
      text: `Deseja arquivar a consulta de ${agendamento.paciente}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, arquivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setAgendamentos((prev) =>
          prev.map((a) => (a.id === agendamento.id ? { ...a, arquivado: true } : a))
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

  const handleDesarquivar = (agendamento) => {
    Swal.fire({
      title: "Desarquivar agendamento",
      text: `Restaurar a consulta de ${agendamento.paciente}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desarquivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setAgendamentos((prev) =>
          prev.map((a) => (a.id === agendamento.id ? { ...a, arquivado: false } : a))
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
      }
    });
  };

  const handleExcluir = (agendamento) => {
    Swal.fire({
      title: "Exclusão segura",
      html: `
        <p>Digite a senha de autorização para excluir permanentemente o agendamento de <strong>${agendamento.paciente}</strong>:</p>
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
        setAgendamentos((prev) => prev.filter((a) => a.id !== agendamento.id));
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

  const handleVisualizar = (agendamento) => {
    Swal.fire({
      title: `Consulta de ${agendamento.paciente}`,
      html: `
        <div style="text-align:left; line-height:1.8;">
          <p><strong>Paciente:</strong> ${agendamento.paciente}</p>
          <p><strong>Médico:</strong> ${agendamento.medico}</p>
          <p><strong>Especialidade:</strong> ${agendamento.especialidade}</p>
          <p><strong>Data:</strong> ${agendamento.data}</p>
          <p><strong>Horário:</strong> ${agendamento.horario}</p>
          <p><strong>Status:</strong> ${agendamento.status}</p>
          <p><strong>Observações:</strong> ${agendamento.observacoes || "Nenhuma"}</p>
          <p><strong>Arquivado:</strong> ${agendamento.arquivado ? "Sim" : "Não"}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
    });
  };

  const handleRelatorio = async () => {
    if (filteredData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Nenhum dado",
        text: "Não há agendamentos para gerar relatório.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      const jspdfModule = await import("jspdf");
      await import("jspdf-autotable");
      const jsPDF = jspdfModule.default;

      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(20);
      doc.setTextColor("#1e293b");
      doc.text("Relatório de Agendamentos", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor("#64748b");
      const dataStr = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(`Gerado em: ${dataStr}`, pageWidth - 20, 28, { align: "right" });
      doc.text(`Total de consultas: ${filteredData.length}`, 20, 28);

      doc.setDrawColor("#cbd5e1");
      doc.line(20, 32, pageWidth - 20, 32);

      const headers = ["Paciente", "Médico", "Especialidade", "Data", "Horário", "Status", "Arquivado"];
      const rows = filteredData.map((a) => [
        a.paciente,
        a.medico,
        a.especialidade,
        a.data,
        a.horario,
        a.status,
        a.arquivado ? "Sim" : "Não",
      ]);

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 38,
        theme: "striped",
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: "#e2e8f0", lineWidth: 0.1 },
        headStyles: { fillColor: "#2563eb", textColor: "#fff", fontStyle: "bold", halign: "center" },
        alternateRowStyles: { fillColor: "#f1f5f9" },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 30 },
          2: { cellWidth: 22 },
          3: { cellWidth: 18 },
          4: { cellWidth: 18 },
          5: { cellWidth: 20 },
          6: { cellWidth: 18 },
        },
        margin: { left: 20, right: 20 },
        didDrawPage: function (data) {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(8);
          doc.setTextColor("#94a3b8");
          doc.text(
            `Página ${currentPage} de ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
          doc.text(
            "Minha UBS - Sistema de Gestão",
            pageWidth - 20,
            doc.internal.pageSize.getHeight() - 10,
            { align: "right" }
          );
        },
      });

      doc.save(`relatorio_agendamentos_${new Date().toISOString().slice(0, 10)}.pdf`);

      Swal.fire({
        icon: "success",
        title: "PDF gerado!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao gerar PDF",
        text: "Verifique se as bibliotecas jspdf e jspdf-autotable estão instaladas.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <HiSortAscending className="inline ml-1 text-gray-300" />;
    return sortConfig.direction === "asc" ? (
      <HiSortAscending className="inline ml-1 text-blue-600" />
    ) : (
      <HiSortDescending className="inline ml-1 text-blue-600" />
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HiCalendar className="text-blue-600" /> Gerenciamento de Agendamentos
            </h1>
            <p className="text-gray-500">Controle total sobre consultas e horários.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNovoAgendamento}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <HiPlus /> Novo Agendamento
            </button>
            <button
              onClick={handleRelatorio}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <HiPrinter /> Relatório
            </button>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
          <MetricCard title="Total" value={metrics.total} icon={HiCalendar} color="blue" />
          <MetricCard title="Confirmados" value={metrics.confirmados} icon={HiCheckCircle} color="green" />
          <MetricCard title="Pendentes" value={metrics.pendentes} icon={HiClock} color="amber" />
          <MetricCard title="Cancelados" value={metrics.cancelados} icon={HiXCircle} color="red" />
          <MetricCard title="Concluídos" value={metrics.concluidos} icon={HiUsers} color="purple" />
          <MetricCard title="Ocupação" value={`${metrics.ocupacao}%`} icon={HiChartBar} color="indigo" />
          <MetricCard title="Arquivados" value={metrics.arquivados} icon={HiArchive} color="gray" />
        </div>

        {/* Barra de filtros */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <HiSearch className="text-gray-400 ml-1" />
              <input
                type="text"
                placeholder="Buscar por paciente, médico ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 bg-transparent border-none focus:ring-0 outline-none text-gray-700"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <HiFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Status: Todos</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={filterMedico}
                onChange={(e) => { setFilterMedico(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Médico: Todos</option>
                {medicosMock.map((m) => (
                  <option key={m.id} value={m.nome}>{m.nome}</option>
                ))}
              </select>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Data"
              />
              {filterDate && (
                <button
                  onClick={() => { setFilterDate(""); setCurrentPage(1); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}

              <select
                value={filterArchive}
                onChange={(e) => { setFilterArchive(e.target.value); setCurrentPage(1); }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="todos">Todos</option>
                <option value="arquivados">Arquivados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("paciente")}>
                    Paciente {renderSortIcon("paciente")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("medico")}>
                    Médico {renderSortIcon("medico")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("especialidade")}>
                    Especialidade {renderSortIcon("especialidade")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("data")}>
                    Data {renderSortIcon("data")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("horario")}>
                    Horário {renderSortIcon("horario")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Nenhum agendamento encontrado.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((agendamento, idx) => {
                    const isArquivado = agendamento.arquivado;
                    return (
                      <tr
                        key={agendamento.id}
                        className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} ${isArquivado ? "opacity-60" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{agendamento.paciente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{agendamento.medico}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{agendamento.especialidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{agendamento.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{agendamento.horario}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={agendamento.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleVisualizar(agendamento)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                              title="Visualizar"
                            >
                              <HiEye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditar(agendamento)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                              title="Editar"
                            >
                              <HiPencil size={16} />
                            </button>
                            {!isArquivado ? (
                              <button
                                onClick={() => handleArquivar(agendamento)}
                                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                title="Arquivar"
                              >
                                <HiArchive size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDesarquivar(agendamento)}
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                                title="Desarquivar"
                              >
                                <HiArrowNarrowLeft size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleExcluir(agendamento)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                              title="Excluir"
                            >
                              <HiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
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
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Clique em qualquer linha para ver detalhes. Use as ações para editar, arquivar, desarquivar ou excluir (exclusão requer senha).
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================
const MetricCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <div className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <Icon size={20} className="opacity-70" />
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    Confirmado: { bg: "bg-green-100", text: "text-green-700" },
    Pendente: { bg: "bg-amber-100", text: "text-amber-700" },
    Cancelado: { bg: "bg-red-100", text: "text-red-700" },
    Concluído: { bg: "bg-blue-100", text: "text-blue-700" },
  };
  const { bg, text } = config[status] || config.Pendente;
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {status}
    </span>
  );
};

export default AgendamentoAdmin;