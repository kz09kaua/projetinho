// src/pages/VacinacaoAdmin.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaSyringe,
  FaSearch,
  FaPlus,
  FaFileDownload,
  FaBuilding,
  FaEye,
  FaEdit,
  FaTimes,
  FaFilter,
  FaArchive,
  FaUndo,
} from "react-icons/fa";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";

const VacinacaoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin")
    return <div className="text-red-500">Acesso restrito.</div>;

  // 34 registros de vacinas com status variados
  const initialEstoque = [
    // Disponíveis (verde) - 10 itens
    {
      id: 1,
      vacina: "COVID-19 (Pfizer)",
      ubs: "UBS Central",
      quantidade: 45,
      lote: "AB123",
      validade: "2025-12-31",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 2,
      vacina: "Gripe (Influenza)",
      ubs: "UBS Norte",
      quantidade: 12,
      lote: "GR789",
      validade: "2024-10-15",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 5,
      vacina: "Hepatite B",
      ubs: "UBS Leste",
      quantidade: 30,
      lote: "HB234",
      validade: "2025-11-10",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 8,
      vacina: "Pneumocócica 10-valente",
      ubs: "UBS Norte",
      quantidade: 22,
      lote: "PN789",
      validade: "2025-08-15",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 10,
      vacina: "Meningocócica C",
      ubs: "UBS Leste",
      quantidade: 14,
      lote: "MC456",
      validade: "2025-04-20",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 14,
      vacina: "Difteria, Tétano, Pertussis (dTpa)",
      ubs: "UBS Sul",
      quantidade: 20,
      lote: "DT789",
      validade: "2025-10-10",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 19,
      vacina: "Poliomielite (VIP)",
      ubs: "UBS Sul",
      quantidade: 25,
      lote: "PO456",
      validade: "2025-07-30",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 29,
      vacina: "Difteria-Tétano (dT adulto)",
      ubs: "UBS Sul",
      quantidade: 13,
      lote: "DT123",
      validade: "2026-01-15",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 31,
      vacina: "Sarampo, Caxumba, Rubéola (SCR)",
      ubs: "UBS Oeste",
      quantidade: 18,
      lote: "SCR456",
      validade: "2025-09-30",
      status: "disponivel",
      arquivado: false,
    },
    {
      id: 32,
      vacina: "Hepatite A (pediátrica)",
      ubs: "UBS Norte",
      quantidade: 15,
      lote: "HAP789",
      validade: "2025-12-01",
      status: "disponivel",
      arquivado: false,
    },
    // Críticos (amarelo) - 10 itens
    {
      id: 3,
      vacina: "Febre Amarela",
      ubs: "UBS Central",
      quantidade: 5,
      lote: "FA456",
      validade: "2026-01-20",
      status: "critico",
      arquivado: false,
    },
    {
      id: 6,
      vacina: "Tríplice Viral",
      ubs: "UBS Oeste",
      quantidade: 18,
      lote: "TV567",
      validade: "2024-09-30",
      status: "critico",
      arquivado: false,
    },
    {
      id: 7,
      vacina: "DTP (Tríplice Bacteriana)",
      ubs: "UBS Central",
      quantidade: 8,
      lote: "DTP321",
      validade: "2025-02-28",
      status: "critico",
      arquivado: false,
    },
    {
      id: 11,
      vacina: "Hepatite A",
      ubs: "UBS Oeste",
      quantidade: 9,
      lote: "HA789",
      validade: "2025-06-30",
      status: "critico",
      arquivado: false,
    },
    {
      id: 12,
      vacina: "Varicela (Catapora)",
      ubs: "UBS Central",
      quantidade: 4,
      lote: "VC123",
      validade: "2024-11-15",
      status: "critico",
      arquivado: false,
    },
    {
      id: 15,
      vacina: "Febre Tifoide",
      ubs: "UBS Leste",
      quantidade: 7,
      lote: "FT123",
      validade: "2025-03-25",
      status: "critico",
      arquivado: false,
    },
    {
      id: 16,
      vacina: "Cólera",
      ubs: "UBS Oeste",
      quantidade: 11,
      lote: "CO456",
      validade: "2025-12-05",
      status: "critico",
      arquivado: false,
    },
    {
      id: 17,
      vacina: "Encefalite Japonesa",
      ubs: "UBS Central",
      quantidade: 3,
      lote: "EJ789",
      validade: "2024-08-20",
      status: "critico",
      arquivado: false,
    },
    {
      id: 20,
      vacina: "Pneumocócica 23-valente",
      ubs: "UBS Leste",
      quantidade: 6,
      lote: "PN789",
      validade: "2026-02-10",
      status: "critico",
      arquivado: false,
    },
    {
      id: 22,
      vacina: "Hepatite A (pediátrica)",
      ubs: "UBS Central",
      quantidade: 8,
      lote: "HA456",
      validade: "2026-03-01",
      status: "critico",
      arquivado: false,
    },
    // Esgotados (vermelho) - 10 itens
    {
      id: 4,
      vacina: "HPV (Quadrivalente)",
      ubs: "UBS Sul",
      quantidade: 0,
      lote: "HPV890",
      validade: "2025-07-01",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 9,
      vacina: "Rotavírus",
      ubs: "UBS Sul",
      quantidade: 0,
      lote: "RV123",
      validade: "2024-12-01",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 13,
      vacina: "HPV (Bivalente)",
      ubs: "UBS Norte",
      quantidade: 0,
      lote: "HPV456",
      validade: "2025-09-01",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 18,
      vacina: "Raiva",
      ubs: "UBS Norte",
      quantidade: 0,
      lote: "RA123",
      validade: "2025-05-15",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 21,
      vacina: "Tétano (dT)",
      ubs: "UBS Oeste",
      quantidade: 0,
      lote: "DT123",
      validade: "2025-11-20",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 23,
      vacina: "Meningocócica ACWY",
      ubs: "UBS Norte",
      quantidade: 0,
      lote: "MC789",
      validade: "2024-12-20",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 24,
      vacina: "Rotavírus (monovalente)",
      ubs: "UBS Sul",
      quantidade: 0,
      lote: "RV456",
      validade: "2025-04-05",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 27,
      vacina: "Caxumba (monovalente)",
      ubs: "UBS Central",
      quantidade: 0,
      lote: "CX456",
      validade: "2025-06-01",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 33,
      vacina: "BCG (tuberculose)",
      ubs: "UBS Leste",
      quantidade: 0,
      lote: "BCG123",
      validade: "2024-12-31",
      status: "esgotado",
      arquivado: false,
    },
    {
      id: 34,
      vacina: "HPV (9-valente)",
      ubs: "UBS Oeste",
      quantidade: 0,
      lote: "HPV999",
      validade: "2025-08-15",
      status: "esgotado",
      arquivado: false,
    },
  ];

  const [estoque, setEstoque] = useState(initialEstoque);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("todos");
  const itemsPerPage = 5;

  // Filtro
  const filtered = estoque
    .filter((e) => {
      if (filterType === "disponivel") return e.status === "disponivel" && !e.arquivado;
      if (filterType === "critico") return e.status === "critico" && !e.arquivado;
      if (filterType === "esgotado") return e.status === "esgotado" && !e.arquivado;
      return !e.arquivado;
    })
    .filter(
      (e) =>
        e.vacina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.ubs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.lote.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const limparBusca = () => setSearchTerm("");
  const goToPage = (page) => setCurrentPage(page);

  // ===================== MODAL DE VISUALIZAÇÃO =====================
  const visualizarRegistro = (registro) => {
    if (!registro) return;
    const statusMap = {
      disponivel: { label: "Disponível", color: "text-green-600", bg: "#dcfce7" },
      critico: { label: "Estoque Crítico", color: "text-amber-600", bg: "#fef3c7" },
      esgotado: { label: "Esgotado", color: "text-red-500", bg: "#fee2e2" },
    };
    const { label, color, bg } = statusMap[registro.status] || statusMap.esgotado;

    Swal.fire({
      title: `<span style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">Vacina: ${registro.vacina}</span>`,
      html: `
        <div style="text-align: left; font-family: 'Inter', sans-serif; max-width: 400px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1.5rem; background: #f8fafc; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e2e8f0;">
            <div><strong style="color: #475569;">Vacina</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.vacina}</span></div>
            <div><strong style="color: #475569;">UBS</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.ubs}</span></div>
            <div><strong style="color: #475569;">Quantidade</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.quantidade}</span></div>
            <div><strong style="color: #475569;">Lote</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.lote}</span></div>
            <div><strong style="color: #475569;">Validade</strong><br><span style="font-weight: 600; color: #0f172a;">${registro.validade}</span></div>
            <div><strong style="color: #475569;">Status</strong><br><span style="display: inline-block; background: ${bg}; padding: 0.2rem 0.8rem; border-radius: 9999px; color: ${color}; font-weight: 600;">${label}</span></div>
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

  // ===================== EXPORTAÇÃO PDF =====================
  const exportarRelatorio = () => {
    const dados = filtered;
    if (dados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Nenhum registro",
        text: "Não há dados para exportar no momento.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.setTextColor("#1e293b");
    doc.text("Relatório de Estoque - Vacinas", pageWidth / 2, 20, { align: "center" });

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
    doc.text(`Total de registros: ${dados.length}`, 20, 28);

    doc.setDrawColor("#cbd5e1");
    doc.line(20, 32, pageWidth - 20, 32);

    const tableHeaders = ["Vacina", "UBS", "Quantidade", "Lote", "Validade", "Status"];
    const tableBody = dados.map((e) => [
      e.vacina,
      e.ubs,
      e.quantidade.toString(),
      e.lote,
      e.validade,
      e.status === "disponivel" ? "Disponível" : e.status === "critico" ? "Crítico" : "Esgotado",
    ]);

    doc.autoTable({
      head: [tableHeaders],
      body: tableBody,
      startY: 38,
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: "#e2e8f0",
        lineWidth: 0.1,
        textColor: "#1e293b",
      },
      headStyles: {
        fillColor: "#2563eb",
        textColor: "#ffffff",
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      alternateRowStyles: { fillColor: "#f1f5f9" },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
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

    doc.save(`relatorio_vacinas_${new Date().toISOString().slice(0, 10)}.pdf`);

    Swal.fire({
      icon: "success",
      title: "PDF gerado!",
      text: "O arquivo foi baixado com sucesso.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  // ===================== NOVO LOTE =====================
  const novoLote = () => {
    Swal.fire({
      title: "Adicionar novo lote",
      html: `
        <input id="swal-vacina" class="swal2-input" placeholder="Nome da vacina" />
        <input id="swal-ubs" class="swal2-input" placeholder="UBS" />
        <input id="swal-quantidade" class="swal2-input" type="number" placeholder="Quantidade" />
        <input id="swal-lote" class="swal2-input" placeholder="Lote" />
        <input id="swal-validade" class="swal2-input" type="date" placeholder="Validade" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const vacina = document.getElementById("swal-vacina").value;
        const ubs = document.getElementById("swal-ubs").value;
        const quantidade = parseInt(document.getElementById("swal-quantidade").value) || 0;
        const lote = document.getElementById("swal-lote").value;
        const validade = document.getElementById("swal-validade").value;
        if (!vacina || !ubs || !lote || !validade) {
          Swal.showValidationMessage("Preencha todos os campos obrigatórios.");
          return;
        }
        return { vacina, ubs, quantidade, lote, validade };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { vacina, ubs, quantidade, lote, validade } = result.value;
        const novoId = estoque.length > 0 ? Math.max(...estoque.map((e) => e.id)) + 1 : 1;
        let status = "esgotado";
        if (quantidade > 10) status = "disponivel";
        else if (quantidade > 0) status = "critico";
        const novoRegistro = {
          id: novoId,
          vacina,
          ubs,
          quantidade,
          lote,
          validade,
          status,
          arquivado: false,
        };
        setEstoque((prev) => [...prev, novoRegistro]);
        Swal.fire({
          icon: "success",
          title: "Lote adicionado!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // ===================== EDIÇÃO =====================
  const editarRegistro = (registro) => {
    if (!registro) return;
    Swal.fire({
      title: "Editar lote",
      html: `
        <input id="swal-quantidade" class="swal2-input" type="number" placeholder="Quantidade" value="${registro.quantidade}" />
        <input id="swal-lote" class="swal2-input" placeholder="Lote" value="${registro.lote}" />
        <input id="swal-validade" class="swal2-input" type="date" value="${registro.validade}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const quantidade = parseInt(document.getElementById("swal-quantidade").value) || 0;
        const lote = document.getElementById("swal-lote").value;
        const validade = document.getElementById("swal-validade").value;
        if (!lote || !validade) {
          Swal.showValidationMessage("Preencha todos os campos obrigatórios.");
          return;
        }
        return { quantidade, lote, validade };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { quantidade, lote, validade } = result.value;
        let status = "esgotado";
        if (quantidade > 10) status = "disponivel";
        else if (quantidade > 0) status = "critico";
        setEstoque((prev) =>
          prev.map((e) =>
            e.id === registro.id
              ? { ...e, quantidade, lote, validade, status }
              : e
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

  // ===================== ARQUIVAR / DESARQUIVAR =====================
  const arquivarRegistro = (registro) => {
    if (!registro) return;
    Swal.fire({
      title: "Arquivar lote",
      text: `Deseja arquivar o lote ${registro.lote} da vacina ${registro.vacina}? Ele ficará oculto do estoque ativo.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, arquivar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setEstoque((prev) =>
          prev.map((e) =>
            e.id === registro.id ? { ...e, arquivado: true } : e
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
    if (!registro) return;
    setEstoque((prev) =>
      prev.map((e) =>
        e.id === registro.id ? { ...e, arquivado: false } : e
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

  // ===================== RENDER =====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaSyringe className="text-blue-600" /> Gestão de Vacinas
            </h1>
            <p className="text-gray-500">Controle de estoque em toda a rede.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              {filterType === "todos" ? "Todos" : filterType === "disponivel" ? "Disponíveis" : filterType === "critico" ? "Críticos" : "Esgotados"}: {totalItems}
            </span>
            <button
              onClick={novoLote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <FaPlus /> Novo lote
            </button>
            <button
              onClick={exportarRelatorio}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <FaFileDownload /> Relatório 
            </button>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <FaSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar por vacina, UBS ou lote..."
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
              <option value="todos">Todos</option>
              <option value="disponivel">Disponíveis</option>
              <option value="critico">Críticos</option>
              <option value="esgotado">Esgotados</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UBS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((registro, idx) => {
                    const statusMap = {
                      disponivel: { label: "Disponível", bg: "bg-green-100", text: "text-green-700" },
                      critico: { label: "Crítico", bg: "bg-amber-100", text: "text-amber-700" },
                      esgotado: { label: "Esgotado", bg: "bg-red-100", text: "text-red-700" },
                    };
                    const { label, bg, text } = statusMap[registro.status] || statusMap.esgotado;

                    return (
                      <tr
                        key={registro.id}
                        className={`hover:bg-blue-50 transition-colors cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        onClick={() => visualizarRegistro(registro)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <FaSyringe size={14} />
                            </div>
                            <span className="font-medium text-gray-800">{registro.vacina}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FaBuilding className="text-blue-400" size={12} />
                            {registro.ubs}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-semibold ${registro.quantidade === 0 ? "text-red-500" : "text-gray-800"}`}>
                            {registro.quantidade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm">{registro.lote}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{registro.validade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
                            {label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Visualizar */}
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                visualizarRegistro(registro);
                              }}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                              title="Visualizar"
                            >
                              <FaEye size={16} />
                            </button>
                            {/* Editar */}
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                editarRegistro(registro);
                              }}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                              title="Editar"
                            >
                              <FaEdit size={16} />
                            </button>
                            {/* Arquivar / Desarquivar */}
                            {!registro.arquivado ? (
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  arquivarRegistro(registro);
                                }}
                                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                title="Arquivar"
                              >
                                <FaArchive size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  desarquivarRegistro(registro);
                                }}
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                                title="Desarquivar"
                              >
                                <FaUndo size={16} />
                              </button>
                            )}
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
          Clique em qualquer linha para ver detalhes. Use as ações para editar ou arquivar.
        </div>
      </div>
    </div>
  );
};

export default VacinacaoAdmin;