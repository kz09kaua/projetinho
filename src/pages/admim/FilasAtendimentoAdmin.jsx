// src/pages/admim/FilasAtendimentoAdmin.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  HiUsers, HiClock, HiTrendingUp, HiTrendingDown, HiSearch,
  HiUserGroup, HiOfficeBuilding, HiAcademicCap, HiX, HiEye,
  HiRefresh, HiDocumentReport, HiChartPie, HiStar, HiCheckCircle,
  HiExclamationCircle, HiMinusCircle, HiXCircle, HiHome,
  HiChevronDoubleLeft, HiChevronLeft, HiChevronRight,
  HiChevronDoubleRight, HiFilter, HiSortAscending, HiSortDescending,
} from "react-icons/hi";
import Swal from "sweetalert2";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { filasService } from "../../services/filasService";
import { ubsService } from "../../services/ubsService";

// ============================================================
// FUNÇÃO DE STATUS
// ============================================================
const getStatusDetalhado = (qtdPacientes) => {
  if (qtdPacientes > 15) return { label: "Crítico", color: "red", icon: HiXCircle };
  if (qtdPacientes >= 11) return { label: "Atenção", color: "yellow", icon: HiExclamationCircle };
  if (qtdPacientes >= 6) return { label: "Moderado", color: "blue", icon: HiMinusCircle };
  return { label: "Normal", color: "green", icon: HiCheckCircle };
};

// ============================================================
// COMPONENTES AUXILIARES (mantidos iguais)
// ============================================================
const FilaStatusBadge = ({ status }) => {
  const config = {
    Normal: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: HiCheckCircle },
    Moderado: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", icon: HiMinusCircle },
    Atenção: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", icon: HiExclamationCircle },
    Crítico: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500", icon: HiXCircle },
  };
  const { bg, text, border, dot, icon: Icon } = config[status] || config.Normal;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
      <Icon size={12} className="opacity-70" />
    </span>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => {
  const colorMap = {
    blue: "from-blue-600 to-blue-700", green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600", red: "from-rose-500 to-rose-600",
    teal: "from-teal-500 to-teal-600", indigo: "from-indigo-500 to-indigo-600",
    gray: "from-slate-500 to-slate-600", purple: "from-purple-500 to-purple-600",
  };
  const gradient = colorMap[color] || colorMap.blue;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 min-w-[140px] flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-[10px] text-gray-400 truncate">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg flex-shrink-0`}><Icon size={18} /></div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-[10px]">
          {trend === "up" ? <HiTrendingUp className="text-emerald-500" /> : <HiTrendingDown className="text-rose-500" />}
          <span className={trend === "up" ? "text-emerald-600" : "text-rose-600"}>{trendValue}</span>
          <span className="text-gray-400">vs. anterior</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const FilasAtendimentoAdmin = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.role !== "admin") return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
        <p className="text-gray-600 mt-2">Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  );

  // Estados
  const [filas, setFilas] = useState([]); // Array de objetos de fila reais
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroUBS, setFiltroUBS] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroTempo, setFiltroTempo] = useState("");
  const [filtroPacientes, setFiltroPacientes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "pacientes", direction: "desc" });
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 8;

  // Carrega filas reais
  const carregarFilas = useCallback(async () => {
    try {
      const todas = await filasService.listar();
      setFilas(todas);
    } catch (error) {
      console.error("Erro ao carregar filas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarFilas();
    const interval = setInterval(carregarFilas, 10000);
    return () => clearInterval(interval);
  }, [carregarFilas]);

  // Agrupa filas por UBS + especialidade para exibição na tabela e métricas
  const filasAgrupadas = useMemo(() => {
    const grouped = {};
    filas.forEach(f => {
      const key = `${f.ubs || "Sem UBS"}|||${f.especialidade || "Sem especialidade"}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          ubs: f.ubs || "Sem UBS",
          especialidade: f.especialidade || "Sem especialidade",
          pacientes: [],
          tempoMedio: 0,
          prioridades: 0,
        };
      }
      grouped[key].pacientes.push({
        id: f.id,
        nome: f.paciente || "Sem nome",
        senha: f.senha,
        prioridade: f.prioridade || "Normal",
        tempo: f.tempo || "—",
        posicao: f.posicao,
        status: f.status,
      });
      if (f.prioridade === "Alta") grouped[key].prioridades++;
    });

    // Calcula tempo médio
    Object.values(grouped).forEach(g => {
      const tempos = g.pacientes.map(p => parseInt(p.tempo) || 10);
      g.tempoMedio = tempos.length > 0 ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0;
    });

    return Object.values(grouped);
  }, [filas]);

  // Listas únicas para filtros
  const ubsList = useMemo(() => [...new Set(filas.map(f => f.ubs).filter(Boolean))], [filas]);
  const especialidadeList = useMemo(() => [...new Set(filas.map(f => f.especialidade).filter(Boolean))], [filas]);

  // Filtragem e ordenação
  const filteredData = useMemo(() => {
    let result = filasAgrupadas.filter(g => {
      const matchSearch = searchTerm === "" ||
        g.ubs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.especialidade.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUBS = !filtroUBS || g.ubs === filtroUBS;
      const matchEspecialidade = !filtroEspecialidade || g.especialidade === filtroEspecialidade;
      const matchPrioridade = !filtroPrioridade ||
        (filtroPrioridade === "0" && g.prioridades === 0) ||
        (filtroPrioridade === "1-2" && g.prioridades >= 1 && g.prioridades <= 2) ||
        (filtroPrioridade === "3+" && g.prioridades >= 3);
      const matchTempo = !filtroTempo ||
        (filtroTempo === "0-10" && g.tempoMedio <= 10) ||
        (filtroTempo === "11-20" && g.tempoMedio > 10 && g.tempoMedio <= 20) ||
        (filtroTempo === "21+" && g.tempoMedio > 20);
      const matchPacientes = !filtroPacientes ||
        (filtroPacientes === "0-5" && g.pacientes.length <= 5) ||
        (filtroPacientes === "6-10" && g.pacientes.length > 5 && g.pacientes.length <= 10) ||
        (filtroPacientes === "11+" && g.pacientes.length > 10);
      return matchSearch && matchUBS && matchEspecialidade && matchPrioridade && matchTempo && matchPacientes;
    });

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
  }, [filasAgrupadas, searchTerm, filtroUBS, filtroEspecialidade, filtroPrioridade, filtroTempo, filtroPacientes, sortConfig]);

  // Métricas
  const metrics = useMemo(() => {
    const totalPacientes = filteredData.reduce((acc, g) => acc + g.pacientes.length, 0);
    const tempoMedioGeral = filteredData.length
      ? Math.round(filteredData.reduce((acc, g) => acc + g.tempoMedio, 0) / filteredData.length)
      : 0;
    const totalPrioridades = filteredData.reduce((acc, g) => acc + g.prioridades, 0);
    const ubsMaiorFila = filteredData.length
      ? filteredData.reduce((a, b) => a.pacientes.length > b.pacientes.length ? a : b).ubs
      : "N/A";
    const especialidadeMaisDemandada = filteredData.length
      ? filteredData.reduce((a, b) => a.pacientes.length > b.pacientes.length ? a : b).especialidade
      : "N/A";
    const ocupacao = totalPacientes > 0
      ? Math.round((totalPacientes / (filteredData.length * 10 || 1)) * 100)
      : 0;

    return {
      totalPacientes,
      tempoMedioGeral,
      totalPrioridades,
      ubsMaiorFila,
      especialidadeMaisDemandada,
      ocupacao,
      trends: {
        totalPacientes: { value: "+5%", type: "up" },
        tempoMedioGeral: { value: "-2%", type: "down" },
        totalPrioridades: { value: "+8%", type: "up" },
        ocupacao: { value: "+3%", type: "up" },
      },
    };
  }, [filteredData]);

  // Dados para gráficos
  const dataUBS = useMemo(() => {
    const map = {};
    filteredData.forEach(g => {
      map[g.ubs] = (map[g.ubs] || 0) + g.pacientes.length;
    });
    return Object.keys(map).map(key => ({ ubs: key, pacientes: map[key] }));
  }, [filteredData]);

  const dataEspecialidade = useMemo(() => {
    const map = {};
    filteredData.forEach(g => {
      map[g.especialidade] = (map[g.especialidade] || 0) + g.tempoMedio;
    });
    return Object.keys(map).map(key => ({ especialidade: key, tempoMedio: map[key] }));
  }, [filteredData]);

  const dataPrioridades = useMemo(() => {
    const map = {};
    filteredData.forEach(g => {
      map[g.ubs] = (map[g.ubs] || 0) + g.prioridades;
    });
    return Object.keys(map).map(key => ({ ubs: key, prioridades: map[key] }));
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm(""); setFiltroUBS(""); setFiltroEspecialidade("");
    setFiltroPrioridade(""); setFiltroTempo(""); setFiltroPacientes("");
    setCurrentPage(1);
  }, []);

  // Abrir detalhes da fila (modal com lista de pacientes reais)
  const handleAbrirFila = useCallback((grupo) => {
    const pacientesHtml = grupo.pacientes.map(p => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.nome}</td>
        <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.senha}</td>
        <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.prioridade}</td>
        <td style="padding:8px; border-bottom:1px solid #e5e7eb;">${p.tempo}</td>
      </tr>
    `).join("");
    Swal.fire({
      title: `${grupo.ubs} - ${grupo.especialidade}`,
      html: `
        <div style="text-align:left; max-height:400px; overflow-y:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
            <thead><tr style="background:#f1f5f9;">
              <th style="padding:8px; text-align:left;">Paciente</th>
              <th style="padding:8px; text-align:left;">Senha</th>
              <th style="padding:8px; text-align:left;">Prioridade</th>
              <th style="padding:8px; text-align:left;">Tempo</th>
            </tr></thead>
            <tbody>${pacientesHtml}</tbody>
          </table>
        </div>`,
      confirmButtonColor: "#1e293b",
      confirmButtonText: "Fechar",
      width: 700,
    });
  }, []);

  const handleReordenar = useCallback((grupo) => {
    Swal.fire({ icon: "info", title: "Reordenação", text: "Funcionalidade de reordenação será implementada em breve.", confirmButtonColor: "#1e293b" });
  }, []);

  const exportarCSV = useCallback(() => {
    if (filteredData.length === 0) {
      Swal.fire({ icon: "warning", title: "Sem dados", text: "Não há dados para exportar.", confirmButtonColor: "#1e293b" });
      return;
    }
    const headers = ["UBS", "Especialidade", "Pacientes", "Tempo Médio (min)", "Prioridades"];
    const rows = filteredData.map(g => [g.ubs, g.especialidade, g.pacientes.length, g.tempoMedio, g.prioridades]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "relatorio_filas_admin.csv"; link.click();
    URL.revokeObjectURL(url);
    Swal.fire({ icon: "success", title: "Exportado!", toast: true, timer: 2000, showConfirmButton: false });
  }, [filteredData]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderSection user={user} title={t("filas.titulo")} subtitle={t("filas.subtitulo")} icon={HiUserGroup} />

        <div className="flex flex-wrap gap-4">
          <MetricCard title={t("filas.metricas.totalPacientes")} value={metrics.totalPacientes} icon={HiUsers} color="blue" trend={metrics.trends.totalPacientes.type} trendValue={metrics.trends.totalPacientes.value} />
          <MetricCard title={t("filas.metricas.tempoMedio")} value={`${metrics.tempoMedioGeral} min`} icon={HiClock} color="amber" trend={metrics.trends.tempoMedioGeral.type} trendValue={metrics.trends.tempoMedioGeral.value} />
          <MetricCard title={t("filas.metricas.prioridadesAtivas")} value={metrics.totalPrioridades} icon={HiStar} color="red" trend={metrics.trends.totalPrioridades.type} trendValue={metrics.trends.totalPrioridades.value} />
          <MetricCard title={t("filas.metricas.ubsMaiorFila")} value={metrics.ubsMaiorFila} icon={HiOfficeBuilding} color="indigo" />
          <MetricCard title={t("filas.metricas.especialidadeDemandada")} value={metrics.especialidadeMaisDemandada} icon={HiAcademicCap} color="purple" />
          <MetricCard title={t("filas.metricas.ocupacao")} value={`${metrics.ocupacao}%`} icon={HiChartPie} color="teal" trend={metrics.trends.ocupacao.type} trendValue={metrics.trends.ocupacao.value} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-lg p-4 hover:shadow-xl transition">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{t("filas.graficos.pacientesPorUBS")}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataUBS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="ubs" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.9)" }} />
                <Bar dataKey="pacientes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-lg p-4 hover:shadow-xl transition">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">{t("filas.graficos.tempoMedioPorEspecialidade")}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataEspecialidade} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="especialidade" tick={{ fontSize: 9, fill: "#64748b" }} angle={-30} textAnchor="end" interval={0} height={40} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip formatter={(v) => `${v} min`} contentStyle={{ borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.9)" }} />
                <Bar dataKey="tempoMedio" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100/80 shadow-lg p-4 hover:shadow-xl transition">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">{t("filas.graficos.prioridadesPorUnidade")}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dataPrioridades} dataKey="prioridades" nameKey="ubs" cx="50%" cy="50%" outerRadius={70} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}>
                  {dataPrioridades.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][index % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.9)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100/80 overflow-hidden backdrop-blur-sm">
          <FilterBar
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            filterUBS={filtroUBS} setFilterUBS={setFiltroUBS}
            filterEspecialidade={filtroEspecialidade} setFilterEspecialidade={setFiltroEspecialidade}
            filterPrioridade={filtroPrioridade} setFilterPrioridade={setFiltroPrioridade}
            filterTempo={filtroTempo} setFilterTempo={setFiltroTempo}
            filterPacientes={filtroPacientes} setFilterPacientes={setFiltroPacientes}
            resetFilters={resetFilters} setCurrentPage={setCurrentPage}
            totalResults={filteredData.length} ubsList={ubsList} especialidadeList={especialidadeList}
            t={t}
          />
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden backdrop-blur-sm">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : (
            <FilasTable
              data={paginatedData} sortConfig={sortConfig} handleSort={handleSort}
              handleAbrirFila={handleAbrirFila} handleReordenar={handleReordenar} t={t}
            />
          )}
          {totalPages > 1 && (
            <PaginationControls currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={filteredData.length} t={t} />
          )}
        </div>

        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <button onClick={exportarCSV} className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center" title={t("filas.modais.exportar")}>
            <HiDocumentReport size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUBCOMPONENTES (mantidos iguais, com pequenos ajustes)
// ============================================================
const HeaderSection = ({ user, title, subtitle, icon: Icon }) => {
  const { t } = useTranslation();
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <HiHome className="w-4 h-4" /><span>Dashboard</span><HiChevronDoubleLeft className="w-3 h-3 rotate-180" /><span className="text-white font-medium">{t("filas.abas.filas")}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 flex items-center gap-2"><Icon className="w-7 h-7" />{title}</h1>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-2"><span>{subtitle}</span><span className="w-1 h-1 rounded-full bg-white/30"></span><span>{dataFormatada}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">{user?.nome?.charAt(0) || "A"}</div>
          <div className="text-white text-sm"><p className="font-medium">{user?.nome || "Admin"}</p><p className="text-white/70 text-xs">Administrador</p></div>
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({ searchTerm, setSearchTerm, filterUBS, setFilterUBS, filterEspecialidade, setFilterEspecialidade, filterPrioridade, setFilterPrioridade, filterTempo, setFilterTempo, filterPacientes, setFilterPacientes, resetFilters, setCurrentPage, totalResults, ubsList, especialidadeList, t }) => {
  const handleFilterChange = (setter) => (e) => { setter(e.target.value); setCurrentPage(1); };
  const isFilterActive = searchTerm || filterUBS || filterEspecialidade || filterPrioridade || filterTempo || filterPacientes;
  return (
    <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder={t("filas.filtros.buscar")} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filterUBS} onChange={handleFilterChange(setFilterUBS)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none">
            <option value="">{t("filas.filtros.ubs")}</option>
            {ubsList.map(ubs => <option key={ubs} value={ubs}>{ubs}</option>)}
          </select>
          <select value={filterEspecialidade} onChange={handleFilterChange(setFilterEspecialidade)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none">
            <option value="">{t("filas.filtros.especialidade")}</option>
            {especialidadeList.map(esp => <option key={esp} value={esp}>{esp}</option>)}
          </select>
          <select value={filterPrioridade} onChange={handleFilterChange(setFilterPrioridade)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none">
            <option value="">{t("filas.filtros.prioridade")}</option>
            <option value="0">{t("filas.filtros.prioridade_nenhuma")}</option>
            <option value="1-2">1-2</option>
            <option value="3+">3+</option>
          </select>
          <select value={filterTempo} onChange={handleFilterChange(setFilterTempo)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none">
            <option value="">{t("filas.filtros.tempo")}</option>
            <option value="0-10">{t("filas.filtros.tempo_ate_10")}</option>
            <option value="11-20">{t("filas.filtros.tempo_11_20")}</option>
            <option value="21+">{t("filas.filtros.tempo_acima_20")}</option>
          </select>
          <select value={filterPacientes} onChange={handleFilterChange(setFilterPacientes)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none">
            <option value="">{t("filas.filtros.pacientes")}</option>
            <option value="0-5">{t("filas.filtros.pacientes_ate_5")}</option>
            <option value="6-10">{t("filas.filtros.pacientes_6_10")}</option>
            <option value="11+">{t("filas.filtros.pacientes_11_mais")}</option>
          </select>
          {isFilterActive && <button onClick={resetFilters} className="px-3 py-2 rounded-xl text-sm text-blue-600 hover:bg-blue-50 transition font-medium">{t("comum.limpar_filtros")}</button>}
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <HiFilter className="w-4 h-4" />
        <span><strong className="text-gray-700">{totalResults}</strong> {totalResults === 1 ? t("comum.resultado") : t("comum.resultados")} {totalResults === 1 ? t("comum.encontrado") : t("comum.encontrados")}</span>
        {isFilterActive && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{t("comum.filtros_ativos")}</span>}
      </div>
    </div>
  );
};

const FilasTable = ({ data, sortConfig, handleSort, handleAbrirFila, handleReordenar, t }) => {
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <HiSortAscending className="inline ml-1 text-gray-300" />;
    return sortConfig.direction === "asc" ? <HiSortAscending className="inline ml-1 text-blue-600" /> : <HiSortDescending className="inline ml-1 text-blue-600" />;
  };
  if (data.length === 0) return (
    <div className="p-12 text-center">
      <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4"><HiUserGroup className="w-12 h-12 text-gray-400" /></div>
      <h3 className="text-lg font-semibold text-gray-700">{t("comum.sem_dados")}</h3>
      <p className="text-gray-500 mt-1">{t("comum.tente_ajustar_filtros")}</p>
    </div>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition" onClick={() => handleSort("ubs")}>{t("filas.tabela.ubs")} {renderSortIcon("ubs")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition" onClick={() => handleSort("especialidade")}>{t("filas.tabela.especialidade")} {renderSortIcon("especialidade")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition" onClick={() => handleSort("pacientes")}>{t("filas.tabela.pacientes")} {renderSortIcon("pacientes")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition" onClick={() => handleSort("tempoMedio")}>{t("filas.tabela.tempoMedio")} {renderSortIcon("tempoMedio")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition" onClick={() => handleSort("prioridades")}>{t("filas.tabela.prioridades")} {renderSortIcon("prioridades")}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("comum.status")}</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("comum.acoes")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((grupo) => {
            const status = getStatusDetalhado(grupo.pacientes.length);
            return (
              <tr key={grupo.id} className="group hover:bg-blue-50/50 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{grupo.ubs}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{grupo.especialidade}</td>
                <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-800">{grupo.pacientes.length}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{grupo.tempoMedio} min</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{grupo.prioridades}</td>
                <td className="px-4 py-3 whitespace-nowrap"><FilaStatusBadge status={status.label} /></td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleAbrirFila(grupo)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition" title={t("filas.modais.abrirFila")}><HiEye size={16} /></button>
                    <button onClick={() => handleReordenar(grupo)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 transition" title={t("filas.modais.reordenar_titulo")}><HiRefresh size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PaginationControls = ({ currentPage, totalPages, setCurrentPage, itemsPerPage, totalItems, t }) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-gray-500">{t("comum.mostrando")} <strong className="text-gray-700">{start}</strong> {t("comum.a")} <strong className="text-gray-700">{end}</strong> {t("comum.de")} <strong className="text-gray-700">{totalItems}</strong> {t("comum.registros")}</div>
      <div className="flex items-center gap-1">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"><HiChevronDoubleLeft size={16} /></button>
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"><HiChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page;
          if (totalPages <= 5) page = i + 1;
          else if (currentPage <= 3) page = i + 1;
          else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
          else page = currentPage - 2 + i;
          return <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-lg text-sm transition ${page === currentPage ? "bg-slate-700 text-white shadow-md" : "bg-white border border-gray-200 hover:bg-gray-50"}`}>{page}</button>;
        })}
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"><HiChevronRight size={16} /></button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"><HiChevronDoubleRight size={16} /></button>
      </div>
    </div>
  );
};

export default FilasAtendimentoAdmin;