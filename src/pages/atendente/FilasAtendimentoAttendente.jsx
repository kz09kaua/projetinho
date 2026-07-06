<<<<<<< HEAD
// src/pages/atendente/FilasAtendimentoAttendente.jsx
import { useState, useEffect, useCallback } from "react";
import { HiUserGroup, HiClock, HiUsers, HiExclamation, HiSearch, HiX, HiCheck, HiBan, HiRefresh } from "react-icons/hi";
=======
// src/pages/atendente/FilasAtendimentoAtendente.jsx
import { useState, useEffect } from "react";
import { HiUserGroup, HiClock, HiUsers, HiExclamation, HiSearch, HiX, HiCheck, HiBan } from "react-icons/hi";
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571
import { useAuth } from "../../contexts/AuthContext";
import { filasService } from "../../services/filasService";
import ChatAtendimento from "../../components/ChatAtendimento";
import Swal from "sweetalert2";

const MetricCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorMap = { blue: "from-blue-500 to-blue-600", green: "from-green-500 to-green-600", yellow: "from-yellow-500 to-yellow-600", red: "from-red-500 to-red-600" };
  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white`}><Icon size={20} /></div>
      </div>
      <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
    </div>
  );
};

const FilasAtendimentoAttendente = () => {
  const { user, ubsSelecionada } = useAuth();

  if (user?.role !== "atendente") {
    return <div className="flex items-center justify-center h-64"><p className="text-xl text-red-500">Acesso restrito a atendentes.</p></div>;
  }

  const [fila, setFila] = useState([]);
  const [emAtendimento, setEmAtendimento] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);

<<<<<<< HEAD
  const carregarFila = useCallback(async () => {
    if (!ubsSelecionada) {
      setFila([]);
      setCarregando(false);
      return;
    }
    try {
      const todas = await filasService.listar();
      // Garante que cada item tenha o campo 'paciente' (fallback)
      const daUbs = todas
        .filter(f => f.ubs === ubsSelecionada)
        .map(f => ({ ...f, paciente: f.paciente || "Sem nome" }));
      setFila(daUbs);
    } catch (error) {
      console.error("Erro ao carregar fila:", error);
      setFila([]);
    } finally {
      setCarregando(false);
=======
  const carregarFila = async () => {
    if (!ubsSelecionada) {
      setFila([]);
      return;
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571
    }
    try {
      const data = await filasService.listar();
      const filaFiltrada = data.filter(f => f.ubs === ubsSelecionada);
      filaFiltrada.sort((a, b) => (a.posicao || 0) - (b.posicao || 0));
      setFila(filaFiltrada);
    } catch (error) {
      console.error("Erro ao carregar fila:", error);
    }
  };

  useEffect(() => {
    carregarFila();
  }, [ubsSelecionada]);

<<<<<<< HEAD
  useEffect(() => {
    carregarFila();
    const interval = setInterval(carregarFila, 5000);
    return () => clearInterval(interval);
  }, [carregarFila]);
=======
  // Escuta o evento de atualização da fila com dependência em ubsSelecionada
  useEffect(() => {
    const handleFilaAtualizada = () => {
      carregarFila();
    };
    window.addEventListener('filaAtualizada', handleFilaAtualizada);
    return () => {
      window.removeEventListener('filaAtualizada', handleFilaAtualizada);
    };
  }, [ubsSelecionada]); // <- dependência adicionada
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571

  const totalPacientes = fila.length + (emAtendimento ? 1 : 0);
  const emAtendimentoCount = emAtendimento ? 1 : 0;
  const prioridades = fila.filter(p => p.prioridade === "Alta").length;
  const tempoMedio = fila.length > 0 ? "12 min" : "0 min";

  const especialidadesUnicas = [...new Set(fila.map(f => f.especialidade).filter(Boolean))];

  const chamarProximo = async () => {
    if (emAtendimento) { Swal.fire("Já há um paciente em atendimento."); return; }
    if (fila.length === 0) { Swal.fire("Fila vazia."); return; }
    const proximo = fila[0];
    setEmAtendimento(proximo);
    await filasService.atualizarStatus(proximo.id, "Em Atendimento");
    Swal.fire({ icon: "success", title: `Chamando ${proximo.paciente}`, text: `Senha: ${proximo.senha}`, timer: 2000, showConfirmButton: false });
    carregarFila();
  };

  const finalizarAtendimento = async () => {
    if (!emAtendimento) return;
    await filasService.remover(emAtendimento.id);
    setEmAtendimento(null);
    Swal.fire({ icon: "success", title: "Atendimento finalizado", timer: 1500, showConfirmButton: false });
    carregarFila();
  };

  const cancelarPaciente = async (id, nome) => {
    const result = await Swal.fire({ title: `Cancelar ${nome}?`, icon: "warning", showCancelButton: true, confirmButtonText: "Sim, cancelar" });
    if (result.isConfirmed) {
      await filasService.remover(id);
      Swal.fire({ icon: "success", title: "Paciente removido", timer: 1500, showConfirmButton: false });
      carregarFila();
    }
  };

  const chamarPacienteEspecifico = async (paciente) => {
    if (emAtendimento) { Swal.fire("Já há um paciente em atendimento."); return; }
    const result = await Swal.fire({ title: `Chamar ${paciente.paciente}?`, text: `Senha: ${paciente.senha}`, icon: "question", showCancelButton: true, confirmButtonText: "Sim, chamar" });
    if (result.isConfirmed) {
      setEmAtendimento(paciente);
<<<<<<< HEAD
      await filasService.atualizarStatus(paciente.id, "Em Atendimento");
      Swal.fire({ icon: "success", title: "Chamado!", timer: 1500, showConfirmButton: false });
      carregarFila();
=======
      await filasService.remover(paciente.id);
      setFila(prev => prev.filter(p => p.id !== paciente.id));
      Swal.fire({
        icon: "success",
        title: "Chamado!",
        text: `${paciente.paciente} foi chamado.`,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // ===== FUNÇÃO NOVA FILA DESATIVADA PARA EVITAR SOBRESCRITA =====
  // Mantida apenas para não quebrar referências, mas com aviso e sem ação.
  const novaFila = async () => {
    Swal.fire({
      icon: "info",
      title: "Função desativada",
      text: "Esta ação não está disponível no momento para evitar perda de dados.",
      timer: 3000,
      showConfirmButton: true,
    });
    // Comente ou remova o código abaixo se desejar que não faça nada.
    /*
    try {
      const filasAtuais = await filasService.listar();
      const filasDaUbs = filasAtuais.filter(f => f.ubs === ubsSelecionada);
      for (const f of filasDaUbs) {
        await filasService.remover(f.id);
      }
      const novas = [
        { paciente: "José Souza", prioridade: "Normal", tempo: "10 min", senha: "G-108", status: "Aguardando", especialidade: "Clínica Geral", ubs: ubsSelecionada },
        { paciente: "Maria Lima", prioridade: "Alta", tempo: "5 min", senha: "P-042", status: "Aguardando", especialidade: "Cardiologia", ubs: ubsSelecionada },
        { paciente: "Pedro Santos", prioridade: "Normal", tempo: "15 min", senha: "G-110", status: "Aguardando", especialidade: "Clínica Geral", ubs: ubsSelecionada },
      ];
      for (const item of novas) {
        await filasService.adicionar(item);
      }
      await carregarFila();
      setEmAtendimento(null);
      Swal.fire({
        icon: "success",
        title: "Nova fila criada",
        text: `${novas.length} pacientes na fila.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao criar nova fila:", error);
      Swal.fire("Erro", "Não foi possível criar nova fila.", "error");
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571
    }
    */
  };

  const filaFiltrada = fila.filter(p => {
    const nomePaciente = p.paciente || "";
    const matchNome = nomePaciente.toLowerCase().includes((filtro || "").toLowerCase());
    const matchPrioridade = filtroPrioridade === "todas" || p.prioridade === filtroPrioridade;
    const matchEspecialidade = especialidadeFiltro === "todas" || p.especialidade === especialidadeFiltro;
    return matchNome && matchPrioridade && matchEspecialidade;
  });

  if (carregando) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando filas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2"><HiUserGroup className="text-blue-600" /> Painel de Filas</h1>
            <p className="text-gray-500">Gerencie as filas e atendimentos da unidade {ubsSelecionada}.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={chamarProximo} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2"><HiUserGroup size={18} /> Chamar Próximo</button>
            <button onClick={finalizarAtendimento} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2"><HiCheck size={18} /> Finalizar Atendimento</button>
            <button onClick={carregarFila} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition"><HiRefresh /></button>
          </div>
        </div>

<<<<<<< HEAD
=======
        {/* Cards */}
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Pacientes" value={totalPacientes} icon={HiUsers} color="blue" />
          <MetricCard title="Em Atendimento" value={emAtendimentoCount} icon={HiUserGroup} color="green" />
          <MetricCard title="Tempo Médio" value={tempoMedio} icon={HiClock} color="yellow" />
          <MetricCard title="Prioridades" value={prioridades} icon={HiExclamation} color="red" />
        </div>

        {emAtendimento && (
          <div className="bg-white rounded-2xl border-2 border-green-500 p-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100"><HiUserGroup className="text-green-600" size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500">Em Atendimento</p>
                  <p className="font-bold text-lg text-gray-800">{emAtendimento.paciente}</p>
                  <p className="text-sm text-gray-500">Senha: {emAtendimento.senha} | {emAtendimento.especialidade}</p>
                </div>
              </div>
              <button onClick={finalizarAtendimento} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition">Finalizar Atendimento</button>
            </div>
          </div>
        )}

<<<<<<< HEAD
=======
        {/* Filtros */}
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571
        <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar paciente..." value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <select value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="todas">Todas prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Normal">Normal</option>
          </select>
          <select value={especialidadeFiltro} onChange={(e) => setEspecialidadeFiltro(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="todas">Todas especialidades</option>
            {especialidadesUnicas.map(esp => <option key={esp} value={esp}>{esp}</option>)}
          </select>
          <button onClick={() => { setFiltro(""); setFiltroPrioridade("todas"); setEspecialidadeFiltro("todas"); }} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><HiX className="text-gray-500" /> Limpar</button>
        </div>

<<<<<<< HEAD
=======
        {/* Lista */}
>>>>>>> a9da0a4f84efcdc7f0a82c3b7ef5ae932a2d2571
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pacientes na Fila ({filaFiltrada.length})</h3>
          {filaFiltrada.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border">Fila vazia.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filaFiltrada.map((item) => (
                <div key={item.id} className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition ${item.prioridade === "Alta" ? "border-l-4 border-l-red-500" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white"><HiUserGroup size={22} /></div>
                    <div className="flex gap-1">
                      {item.prioridade === "Alta" && <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">Prioridade</span>}
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">{item.status}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800">{item.paciente}</h4>
                  <p className="text-sm text-gray-500 mb-3">{item.especialidade}</p>
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div><p className="text-xs text-gray-400">Senha</p><p className="text-xl font-bold text-gray-800">{item.senha}</p></div>
                    <div><p className="text-xs text-gray-400">Posição</p><p className="text-xl font-bold text-gray-800">{item.posicao}º</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => chamarPacienteEspecifico(item)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">Chamar</button>
                    <button onClick={() => cancelarPaciente(item.id, item.paciente)} className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition">Cancelar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ChatAtendimento />
      </div>
    </div>
  );
};

export default FilasAtendimentoAttendente;