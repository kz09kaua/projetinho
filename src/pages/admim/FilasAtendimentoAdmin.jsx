// FilasAtendimentoAdmin.jsx
import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiUsers,
  HiClock,
  HiTrendingUp,
  HiPrinter,
  HiSearch,
  HiUserGroup,
  HiOfficeBuilding,
  HiAcademicCap,
  HiX,
  HiEye,
  HiRefresh,
  HiDownload,
  HiDocumentReport,
  HiChartPie,
  HiArrowUp,
  HiArrowDown,
  HiStar,
  HiCheck,
  HiCheckCircle,
  HiExclamationCircle,
  HiMinusCircle,
  HiXCircle,
} from "react-icons/hi";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ============================================================
// DADOS MOCKADOS REALISTAS
// ============================================================
const ubsListMock = [
  "UBS Central",
  "UBS Norte",
  "UBS Sul",
  "UBS Leste",
  "UBS Oeste",
  "UBS Industrial",
  "UBS Vila Nova",
  "UBS Santa Rita",
  "UBS São José",
  "UBS Jardim América",
  "UBS Planalto",
  "UBS Bela Vista",
];

const especialidadesMock = [
  "Clínica Geral",
  "Pediatria",
  "Ginecologia",
  "Cardiologia",
  "Vacinação",
];

const nomesPacientes = [
  "Ana Silva", "Carlos Santos", "Mariana Oliveira", "Pedro Costa",
  "Fernanda Lima", "Rafael Alves", "Juliana Pereira", "Lucas Rodrigues",
  "Carla Souza", "Bruno Nunes", "Patrícia Gomes", "Thiago Martins",
  "Amanda Rocha", "Felipe Mendes", "Larissa Ferreira", "Gustavo Barbosa",
  "Isabela Castro", "Diego Cardoso", "Camila Duarte", "André Freitas",
  "Renata Lima", "Eduardo Silva", "Tatiane Oliveira", "Marcelo Santos",
  "Vanessa Costa", "Gabriel Nunes", "Bianca Rocha", "Rodrigo Alves",
  "Priscila Mendes", "Alexandre Barbosa",
];

// Gerador de pacientes
const gerarPacientes = (quantidade) => {
  const pacientes = [];
  const shuffled = [...nomesPacientes].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, quantidade);
  for (let i = 0; i < quantidade; i++) {
    const horario = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;
    const prioridade = Math.random() > 0.7 ? "Alta" : Math.random() > 0.4 ? "Média" : "Baixa";
    const tempoEspera = Math.floor(Math.random() * 30) + 5;
    pacientes.push({
      id: i + 1,
      nome: selected[i] || `Paciente ${i + 1}`,
      horario,
      prioridade,
      tempoEspera,
    });
  }
  return pacientes;
};

// Gerar filas para todas as UBS e especialidades
const filasMock = [];
ubsListMock.forEach((ubs, ubsIndex) => {
  const numEspecialidades = Math.floor(Math.random() * 3) + 2; // 2 a 4 especialidades por UBS
  const shuffledEsps = [...especialidadesMock].sort(() => Math.random() - 0.5);
  const selectedEsps = shuffledEsps.slice(0, numEspecialidades);
  selectedEsps.forEach((especialidade) => {
    const numPacientes = Math.floor(Math.random() * 16) + 5; // 5 a 20 pacientes
    const pacientes = gerarPacientes(numPacientes);
    const tempoMedio = Math.round(pacientes.reduce((acc, p) => acc + p.tempoEspera, 0) / pacientes.length);
    const prioridades = pacientes.filter((p) => p.prioridade === "Alta").length;
    filasMock.push({
      id: `${ubsIndex}-${especialidade}`,
      ubs,
      especialidade,
      pacientes,
      tempoMedio,
      prioridades,
    });
  });
});

// ============================================================
// FUNÇÃO DE STATUS MELHORADA (4 NÍVEIS)
// ============================================================
const getStatusDetalhado = (pacientes) => {
  const qtd = pacientes.length;
  if (qtd > 15) return { label: "Crítico", color: "red", icon: HiXCircle };
  if (qtd >= 11) return { label: "Atenção", color: "yellow", icon: HiExclamationCircle };
  if (qtd >= 6) return { label: "Moderado", color: "blue", icon: HiMinusCircle };
  return { label: "Normal", color: "green", icon: HiCheckCircle };
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const FilasAtendimentoAdmin = () => {
  const { user } = useAuth();
  if (user?.role !== "admin") {
    return (
      <div className="text-center text-red-500 mt-20">Acesso restrito.</div>
    );
  }

  // Estado
  const [filas, setFilas] = useState(filasMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroUBS, setFiltroUBS] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroTempo, setFiltroTempo] = useState("");
  const [filtroPacientes, setFiltroPacientes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "pacientes", direction: "desc" });
  const itemsPerPage = 5;

  // ===== Dados derivados =====
  const ubsList = useMemo(() => [...new Set(filas.map((f) => f.ubs))], [filas]);
  const especialidadeList = useMemo(
    () => [...new Set(filas.map((f) => f.especialidade))],
    [filas]
  );

  // Filtragem
  const filteredData = useMemo(() => {
    let result = filas.filter((f) => {
      const matchSearch =
        f.ubs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUBS = !filtroUBS || f.ubs === filtroUBS;
      const matchEspecialidade = !filtroEspecialidade || f.especialidade === filtroEspecialidade;
      const matchPrioridade =
        !filtroPrioridade ||
        (filtroPrioridade === "0" && f.prioridades === 0) ||
        (filtroPrioridade === "1-2" && f.prioridades >= 1 && f.prioridades <= 2) ||
        (filtroPrioridade === "3+" && f.prioridades >= 3);
      const matchTempo =
        !filtroTempo ||
        (filtroTempo === "0-10" && f.tempoMedio <= 10) ||
        (filtroTempo === "11-20" && f.tempoMedio > 10 && f.tempoMedio <= 20) ||
        (filtroTempo === "21+" && f.tempoMedio > 20);
      const matchPacientes =
        !filtroPacientes ||
        (filtroPacientes === "0-5" && f.pacientes.length <= 5) ||
        (filtroPacientes === "6-10" && f.pacientes.length > 5 && f.pacientes.length <= 10) ||
        (filtroPacientes === "11+" && f.pacientes.length > 10);
      return matchSearch && matchUBS && matchEspecialidade && matchPrioridade && matchTempo && matchPacientes;
    });
    // Ordenação
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "pacientes") {
          aVal = a.pacientes.length;
          bVal = b.pacientes.length;
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [filas, searchTerm, filtroUBS, filtroEspecialidade, filtroPrioridade, filtroTempo, filtroPacientes, sortConfig]);

  // Métricas
  const metrics = useMemo(() => {
    const totalPacientes = filteredData.reduce((acc, f) => acc + f.pacientes.length, 0);
    const tempoMedioGeral = filteredData.length
      ? Math.round(filteredData.reduce((acc, f) => acc + f.tempoMedio, 0) / filteredData.length)
      : 0;
    const totalPrioridades = filteredData.reduce((acc, f) => acc + f.prioridades, 0);
    const ubsMaiorFila = filteredData.length
      ? filteredData.reduce((a, b) => (a.pacientes.length > b.pacientes.length ? a : b)).ubs
      : "N/A";
    const especialidadeMaisDemandada = filteredData.length
      ? filteredData.reduce((a, b) => (a.pacientes.length > b.pacientes.length ? a : b)).especialidade
      : "N/A";
    const ocupacao = totalPacientes > 0
      ? Math.round((filteredData.reduce((acc, f) => acc + f.pacientes.length, 0) / (filteredData.length * 10)) * 100)
      : 0;
    return { totalPacientes, tempoMedioGeral, totalPrioridades, ubsMaiorFila, especialidadeMaisDemandada, ocupacao };
  }, [filteredData]);

  // Dados para gráficos
  const dataUBS = useMemo(() => {
    const map = {};
    filteredData.forEach((f) => {
      if (!map[f.ubs]) map[f.ubs] = 0;
      map[f.ubs] += f.pacientes.length;
    });
    return Object.keys(map).map((key) => ({ ubs: key, pacientes: map[key] }));
  }, [filteredData]);

  const dataEspecialidade = useMemo(() => {
    const map = {};
    filteredData.forEach((f) => {
      if (!map[f.especialidade]) map[f.especialidade] = 0;
      map[f.especialidade] += f.tempoMedio;
    });
    return Object.keys(map).map((key) => ({ especialidade: key, tempoMedio: map[key] }));
  }, [filteredData]);

  const dataPrioridades = useMemo(() => {
    const map = {};
    filteredData.forEach((f) => {
      if (!map[f.ubs]) map[f.ubs] = 0;
      map[f.ubs] += f.prioridades;
    });
    return Object.keys(map).map((key) => ({ ubs: key, prioridades: map[key] }));
  }, [filteredData]);

  // ===== Dados para gráfico de Status =====
  const dataStatus = useMemo(() => {
    const statusCount = {
      Normal: 0,
      Moderado: 0,
      Atenção: 0,
      Crítico: 0,
    };
    filteredData.forEach((f) => {
      const status = getStatusDetalhado(f.pacientes);
      if (status.label === "Normal") statusCount.Normal++;
      else if (status.label === "Moderado") statusCount.Moderado++;
      else if (status.label === "Atenção") statusCount.Atenção++;
      else if (status.label === "Crítico") statusCount.Crítico++;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // ===== Cores para gráfico de status =====
  const statusColors = {
    Normal: "#10b981",
    Moderado: "#3b82f6",
    Atenção: "#f59e0b",
    Crítico: "#ef4444",
  };

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ===== Handlers =====
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleLimparFiltros = useCallback(() => {
    setSearchTerm("");
    setFiltroUBS("");
    setFiltroEspecialidade("");
    setFiltroPrioridade("");
    setFiltroTempo("");
    setFiltroPacientes("");
    setCurrentPage(1);
  }, []);

  // ===== Exportação APENAS CSV =====
  const exportarCSV = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire("Aviso", "Não há dados para exportar.", "warning");
      return;
    }
    const headers = ["UBS", "Especialidade", "Pacientes", "Tempo Médio", "Prioridades"];
    const rows = filteredData.map((f) => [
      f.ubs,
      f.especialidade,
      f.pacientes.length,
      f.tempoMedio,
      f.prioridades,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_filas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire("Sucesso", "Arquivo CSV exportado.", "success");
  }, [filteredData]);

  // ===== Modais =====
  const handleAbrirFila = useCallback((fila) => {
    const pacientesHtml = fila.pacientes
      .map(
        (p) => `
          <tr>
            <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.nome}</td>
            <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.horario}</td>
            <td style="padding:8px; border-bottom:1px solid #e5e7eb;">
              <span style="color:${p.prioridade === 'Alta' ? '#ef4444' : p.prioridade === 'Média' ? '#f59e0b' : '#10b981'}; font-weight:600;">
                ${p.prioridade}
              </span>
            </td>
            <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.tempoEspera} min</td>
          </tr>
        `
      )
      .join("");
    Swal.fire({
      title: `<h2 style="font-size:1.5rem; font-weight:700;">${fila.ubs} - ${fila.especialidade}</h2>`,
      html: `
        <div style="text-align:left; max-height:400px; overflow-y:auto; margin-top:10px;">
          <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:8px; text-align:left; font-weight:600;">Paciente</th>
                <th style="padding:8px; text-align:left; font-weight:600;">Chegada</th>
                <th style="padding:8px; text-align:left; font-weight:600;">Prioridade</th>
                <th style="padding:8px; text-align:left; font-weight:600;">Espera</th>
              </tr>
            </thead>
            <tbody>${pacientesHtml}</tbody>
          </table>
        </div>
      `,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Fechar",
      width: 700,
    });
  }, []);

  const handleReordenar = useCallback((fila) => {
    let pacientes = fila.pacientes.map(p => ({ ...p }));

    const renderPacientes = () => {
      return pacientes
        .map(
          (p, idx) => `
            <div 
              class="paciente-item" 
              data-idx="${idx}" 
              style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 10px 12px; 
                border-bottom: 1px solid #f1f5f9;
                transition: background 0.2s;
                ${p.prioridade === 'Muito Alta' ? 'background: #fef3c7; border-left: 4px solid #f59e0b;' : ''}
              "
              onmouseover="this.style.background='${p.prioridade === 'Muito Alta' ? '#fde68a' : '#f8fafc'}'"
              onmouseout="this.style.background='${p.prioridade === 'Muito Alta' ? '#fef3c7' : 'transparent'}'"
            >
              <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <span style="font-weight:500;">${p.nome}</span>
                <span style="
                  font-size:0.7rem; 
                  padding:2px 8px; 
                  border-radius:20px; 
                  background: ${p.prioridade === 'Alta' ? '#fecaca' : p.prioridade === 'Média' ? '#fde68a' : p.prioridade === 'Muito Alta' ? '#f59e0b' : '#d1fae5'};
                  color: ${p.prioridade === 'Alta' ? '#991b1b' : p.prioridade === 'Média' ? '#92400e' : p.prioridade === 'Muito Alta' ? '#78350f' : '#065f46'};
                  font-weight:600;
                ">
                  ${p.prioridade}
                </span>
                <span style="font-size:0.8rem; color:#6b7280;">${p.horario}</span>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-up" data-idx="${idx}" style="padding:4px 8px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer; font-size:0.9rem; transition:background 0.2s;" onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">
                  ↑
                </button>
                <button class="btn-down" data-idx="${idx}" style="padding:4px 8px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer; font-size:0.9rem; transition:background 0.2s;" onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">
                  ↓
                </button>
                <button class="btn-priorizar" data-idx="${idx}" style="padding:4px 8px; background:#2563eb; color:white; border:none; border-radius:6px; cursor:pointer; font-size:0.9rem; transition:background 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                  ⭐
                </button>
              </div>
            </div>
          `
        )
        .join("");
    };

    const atualizarLista = () => {
      const container = document.getElementById("swal-pacientes-list");
      if (container) {
        container.innerHTML = renderPacientes();
        atribuirEventos();
      }
    };

    const atribuirEventos = () => {
      document.querySelectorAll(".btn-up").forEach((btn) => {
        btn.addEventListener("click", function () {
          const idx = parseInt(this.dataset.idx);
          if (idx > 0) {
            [pacientes[idx], pacientes[idx - 1]] = [pacientes[idx - 1], pacientes[idx]];
            atualizarLista();
          }
        });
      });

      document.querySelectorAll(".btn-down").forEach((btn) => {
        btn.addEventListener("click", function () {
          const idx = parseInt(this.dataset.idx);
          if (idx < pacientes.length - 1) {
            [pacientes[idx], pacientes[idx + 1]] = [pacientes[idx + 1], pacientes[idx]];
            atualizarLista();
          }
        });
      });

      document.querySelectorAll(".btn-priorizar").forEach((btn) => {
        btn.addEventListener("click", function () {
          const idx = parseInt(this.dataset.idx);
          const paciente = pacientes.splice(idx, 1)[0];
          paciente.prioridade = "Muito Alta";
          pacientes.unshift(paciente);
          atualizarLista();
        });
      });
    };

    Swal.fire({
      title: `<h2 style="font-size:1.5rem; font-weight:700;">Reordenar Fila - ${fila.ubs}</h2>`,
      html: `
        <div style="text-align:left; max-height:400px; overflow-y:auto; margin-top:10px;" id="swal-pacientes-list">
          ${renderPacientes()}
        </div>
        <div style="margin-top:12px; font-size:0.8rem; color:#6b7280; text-align:center;">
          Use ↑ ↓ para mover, ⭐ para priorizar (vai para o topo)
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      width: 700,
      didOpen: () => {
        atribuirEventos();
      },
      preConfirm: () => {
        setFilas((prev) =>
          prev.map((f) =>
            f.id === fila.id ? { ...f, pacientes: pacientes } : f
          )
        );
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Fila atualizada com sucesso!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }, []);

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
              <HiUserGroup className="text-blue-600" /> Monitoramento de Filas
            </h1>
            <p className="text-gray-500">Visão gerencial de todas as unidades de saúde</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportarCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <HiDocumentReport /> Relatório
            </button>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <MetricCard
            title="Total de pacientes"
            value={metrics.totalPacientes}
            icon={HiUsers}
            color="blue"
          />
          <MetricCard
            title="Tempo médio"
            value={`${metrics.tempoMedioGeral} min`}
            icon={HiClock}
            color="amber"
          />
          <MetricCard
            title="Prioridades ativas"
            value={metrics.totalPrioridades}
            icon={HiTrendingUp}
            color="red"
          />
          <MetricCard
            title="UBS + fila"
            value={metrics.ubsMaiorFila}
            icon={HiOfficeBuilding}
            color="indigo"
          />
          <MetricCard
            title="Especialidade + demandada"
            value={metrics.especialidadeMaisDemandada}
            icon={HiAcademicCap}
            color="purple"
          />
          <MetricCard
            title="Ocupação"
            value={`${metrics.ocupacao}%`}
            icon={HiChartPie}
            color="teal"
          />
        </div>

        {/* ===== GRÁFICOS (3 colunas) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico 1: Pacientes por UBS */}
          <div className="bg-white rounded-2xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Pacientes por UBS</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataUBS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ubs" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pacientes" fill="#3b82f6" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2: Tempo Médio por Especialidade */}
          <div className="bg-white rounded-2xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
              Tempo Médio de Espera por Especialidade
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataEspecialidade} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="especialidade" 
                  tick={{ fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={50}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `${value} min`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="tempoMedio" fill="#f59e0b" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 3: Prioridades por unidade */}
          <div className="bg-white rounded-2xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Prioridades por unidade</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dataPrioridades}
                  dataKey="prioridades"
                  nameKey="ubs"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  label
                  animationDuration={800}
                >
                  {dataPrioridades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-2xl border shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <HiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por UBS ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 bg-transparent border-none focus:ring-0 outline-none text-gray-700"
              />
            </div>
            <select
              value={filtroUBS}
              onChange={(e) => setFiltroUBS(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas UBS</option>
              {ubsList.map((ubs) => (
                <option key={ubs} value={ubs}>
                  {ubs}
                </option>
              ))}
            </select>
            <select
              value={filtroEspecialidade}
              onChange={(e) => setFiltroEspecialidade(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Especialidade</option>
              {especialidadeList.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
            <select
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Prioridade</option>
              <option value="0">Nenhuma</option>
              <option value="1-2">1-2</option>
              <option value="3+">3 ou mais</option>
            </select>
            <select
              value={filtroTempo}
              onChange={(e) => setFiltroTempo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tempo médio</option>
              <option value="0-10">Até 10 min</option>
              <option value="11-20">11-20 min</option>
              <option value="21+">Acima de 20 min</option>
            </select>
            <select
              value={filtroPacientes}
              onChange={(e) => setFiltroPacientes(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nº pacientes</option>
              <option value="0-5">Até 5</option>
              <option value="6-10">6-10</option>
              <option value="11+">11 ou mais</option>
            </select>
            <button
              onClick={handleLimparFiltros}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition"
            >
              <HiX size={16} /> Limpar
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ubs", "especialidade", "pacientes", "tempoMedio", "prioridades", "status", "acoes"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => col !== "status" && col !== "acoes" && handleSort(col)}
                    >
                      {col === "ubs" && "UBS"}
                      {col === "especialidade" && "Especialidade"}
                      {col === "pacientes" && "Pacientes"}
                      {col === "tempoMedio" && "Tempo Médio"}
                      {col === "prioridades" && "Prioridades"}
                      {col === "status" && "Status"}
                      {col === "acoes" && "Ações"}
                      {sortConfig.key === col && col !== "status" && col !== "acoes" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Nenhuma fila encontrada.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((fila, idx) => {
                    const status = getStatusDetalhado(fila.pacientes);
                    const StatusIcon = status.icon;
                    return (
                      <tr
                        key={fila.id}
                        className={`hover:bg-blue-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                          {fila.ubs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{fila.especialidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{fila.pacientes.length}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{fila.tempoMedio} min</td>
                        <td className="px-6 py-4 whitespace-nowrap">{fila.prioridades}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                              status.color === "green"
                                ? "bg-green-100 text-green-700"
                                : status.color === "blue"
                                ? "bg-blue-100 text-blue-700"
                                : status.color === "yellow"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <StatusIcon size={14} className="inline" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAbrirFila(fila)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                              title="Abrir fila"
                            >
                              <HiEye size={18} />
                            </button>
                            <button
                              onClick={() => handleReordenar(fila)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                              title="Reordenar"
                            >
                              <HiRefresh size={18} />
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
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
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
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE AUXILIAR: Métricas Card
// ============================================================
const MetricCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    teal: "bg-teal-50 text-teal-600 border-teal-200",
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

export default FilasAtendimentoAdmin;