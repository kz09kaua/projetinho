import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion';
import {
  Calendar, Activity, ShieldCheck, Clock, MapPin, Users, ArrowRight,
  Zap, Sparkles, Globe, Shield, Award, ThumbsUp, Star,
  Code, Database, Lock, CheckCircle, TrendingUp, HelpCircle, Phone, Mail
} from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

// --- Componente de animação de entrada
const AnimatedSection = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const variants = {
    up: { y: 60, opacity: 0, filter: 'blur(10px)' },
    down: { y: -60, opacity: 0, filter: 'blur(10px)' },
    left: { x: -60, opacity: 0, filter: 'blur(10px)' },
    right: { x: 60, opacity: 0, filter: 'blur(10px)' },
    scale: { scale: 0.8, opacity: 0, filter: 'blur(10px)' }
  };
  return (
    <motion.div
      ref={ref}
      initial={variants[direction]}
      animate={isInView ? { y: 0, x: 0, scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Card de recurso
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -12, scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
    className="relative group p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-2xl overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 opacity-0 group-hover:opacity-100 transition-all duration-700" />
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center mb-8 shadow-xl group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-blue-500/30">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-black text-[#0f172a] mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// --- Contador animado com duração personalizável
const CountUp = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);
  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scrollY = useScroll().scrollY;
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHeader = useTransform(scrollY, [0, 200], [1, 0.95]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const stats = [
    { icon: Users, value: 45000, suffix: '+', label: 'Cidadãos atendidos', desc: 'Já utilizam o sistema' },
    { icon: Award, value: 98, suffix: '%', label: 'Satisfação dos usuários', desc: 'Pesquisa 2025' },
    { icon: TrendingUp, value: 70, suffix: '%', label: 'Redução de espera', desc: 'Em relação ao modelo antigo' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-[#0f172a] selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Fundo com parallax */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0">
          <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-indigo-100/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        </motion.div>
      </div>

      {/* Barra de progresso */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 z-[100] origin-left shadow-[0_0_20px_rgba(37,99,235,0.6)]" style={{ scaleX }} />

      {/* Header flutuante */}
      <motion.nav style={{ opacity: opacityHeader }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-[95%] max-w-7xl">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-full px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:shadow-xl">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <motion.div whileHover={{ rotate: 12, scale: 1.05 }} className="p-2 bg-blue-600 rounded-xl transition-all">
              <Activity size={20} className="text-white" />
            </motion.div>
            <span className="text-xl font-black tracking-tighter uppercase">Minha<span className="text-blue-600">UBS</span></span>
          </Link>

          <div className="hidden lg:flex gap-10 text-sm font-black uppercase tracking-wider text-slate-400">
            <button onClick={() => scrollToSection('solucoes')} className="hover:text-blue-600 transition-all relative group">
              Soluções
              <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </button>
            <button onClick={() => scrollToSection('rede')} className="hover:text-blue-600 transition-all relative group">
              Rede
              <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </button>
            <button onClick={() => scrollToSection('seguranca')} className="hover:text-blue-600 transition-all relative group">
              Segurança
              <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </button>
            <button onClick={() => scrollToSection('ajuda')} className="hover:text-blue-600 transition-all relative group">
              Ajuda
              <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cadastro" className="px-8 py-3.5 bg-[#0f172a] text-white text-[11px] font-black tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
              CRIAR CONTA
            </Link>
            <Link to="/login" className="px-8 py-3.5 bg-white border-2 border-[#0f172a] text-[#0f172a] text-[11px] font-black tracking-[0.2em] rounded-full hover:bg-slate-50 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95">
              LOGIN
            </Link>
          </div>
        </div>
      </motion.nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <AnimatedSection direction="up" delay={0}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-8">
                    <Sparkles size={14} className="animate-pulse" />
                    Transformando a Saúde de Muriaé
                  </div>
                </AnimatedSection>
                <AnimatedSection direction="up" delay={0.1}>
                  <h1 className="text-7xl md:text-[8.5rem] font-black tracking-tighter leading-[0.85] mb-10">
                    O SUS <br/> <span className="text-blue-600 italic">evoluído.</span>
                  </h1>
                </AnimatedSection>
                <AnimatedSection direction="up" delay={0.2}>
                  <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl mb-12">
                    Diga adeus às filas de madrugada. Agende consultas e acompanhe sua saúde pelo celular com a maior plataforma digital de Muriaé.
                  </p>
                </AnimatedSection>
                <AnimatedSection direction="up" delay={0.3}>
                  <Link to="/login" className="group inline-flex px-12 py-7 bg-blue-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-blue-200 items-center justify-center gap-4 hover:bg-[#0f172a] transition-all active:scale-95">
                    Iniciar Agendamento
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </AnimatedSection>
              </div>
              <div className="relative hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10"
                >
                  <div className="bg-[#0f172a] rounded-[4rem] p-12 shadow-2xl border border-white/10 rotate-2 transition-all duration-500 hover:rotate-1 hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-16">
                      <motion.div whileHover={{ scale: 1.05 }} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Calendar /></motion.div>
                      <div className="text-right">
                        <div className="text-[10px] text-blue-400 font-black tracking-widest uppercase">Próxima Consulta</div>
                        <div className="text-white font-bold text-xl">Amanhã, 09:30</div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ delay: 0.8, duration: 2 }} className="h-full bg-gradient-to-r from-blue-400 to-blue-600" />
                      </div>
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="text-blue-300 text-xs font-black uppercase mb-2">Unidade: UBS Santa Terezinha</div>
                        <div className="text-white font-medium text-sm">Aguardando confirmação do médico responsável.</div>
                      </div>
                    </div>
                  </div>
                  <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-6 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="relative"><div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" /><div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" /></div>
                      <div className="font-black text-[#0f172a]">SISTEMA ONLINE</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Soluções */}
        <section id="solucoes" className="py-40 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection direction="up" className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Soluções <span className="text-blue-600 italic">inteligentes</span></h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto">Tecnologia para cada necessidade da sua saúde pública.</p>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard delay={0.1} icon={Code} title="Agendamento Web" desc="Plataforma completa para marcação de consultas, exames e procedimentos." />
              <FeatureCard delay={0.2} icon={Database} title="Prontuário Eletrônico" desc="Acesso histórico completo do paciente em qualquer UBS da rede." />
              <FeatureCard delay={0.3} icon={Activity} title="Telemedicina" desc="Consultas remotas com segurança e agilidade, integradas ao SUS." />
            </div>
          </div>
        </section>

        {/* Seção Rede (com contadores animados lentos) */}
        <section id="rede" className="py-40 px-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection direction="up" className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Rede <span className="text-blue-600 italic">integrada</span></h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto">Conectamos todas as unidades de saúde da região.</p>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-600 mt-1" size={28} />
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <CountUp end={12} duration={3} /> UBS conectadas
                    </h3>
                    <p className="text-slate-500">Todas as unidades básicas de Muriaé já utilizam a plataforma.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="text-blue-600 mt-1" size={28} />
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      +<CountUp end={200} duration={3} /> profissionais
                    </h3>
                    <p className="text-slate-500">Médicos, enfermeiros e técnicos capacitados.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl border text-center">
                <Globe size={48} className="text-blue-600 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">"A integração entre as UBS melhorou significativamente o fluxo de atendimento."</p>
                <p className="font-bold mt-4">– Secretaria Municipal de Saúde</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Segurança */}
        <section id="seguranca" className="py-40 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection direction="up" className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Segurança <span className="text-blue-600 italic">de ponta a ponta</span></h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto">Seus dados médicos protegidos com tecnologia de última geração.</p>
            </AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard delay={0.1} icon={Lock} title="Criptografia avançada" desc="Todos os dados trafegam com criptografia de nível bancário (AES-256)." />
              <FeatureCard delay={0.2} icon={Shield} title="Conformidade LGPD" desc="Sistema adequado às normas da Lei Geral de Proteção de Dados." />
              <FeatureCard delay={0.3} icon={CheckCircle} title="Auditoria contínua" desc="Registros de acesso e logs para total transparência." />
            </div>
          </div>
        </section>

        {/* Seção Ajuda (botão WhatsApp azul escuro) */}
        <section id="ajuda" className="py-40 px-6 bg-slate-50/50">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection direction="up" className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Central de <span className="text-blue-600 italic">Ajuda</span></h2>
              <p className="text-slate-500 text-xl">Dúvidas frequentes e suporte especializado.</p>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-black text-xl flex items-center gap-2"><HelpCircle size={24} className="text-blue-600" /> Como faço para me cadastrar?</h3>
                  <p className="text-slate-500 mt-2">Basta clicar em "Criar conta" no menu superior e preencher seus dados (CPF, nome, endereço).</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-black text-xl flex items-center gap-2"><HelpCircle size={24} className="text-blue-600" /> O sistema é gratuito?</h3>
                  <p className="text-slate-500 mt-2">Sim, totalmente gratuito para cidadãos e integrado ao SUS.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-black text-xl flex items-center gap-2"><HelpCircle size={24} className="text-blue-600" /> Tenho dificuldades técnicas, com quem falar?</h3>
                  <p className="text-slate-500 mt-2">Entre em contato pelo e-mail suporte@minhaubs.gov.br ou pelo telefone 0800 123 4567.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white text-center shadow-2xl">
                <Phone size={48} className="mx-auto mb-4" />
                <h3 className="text-2xl font-black">Suporte 24/7</h3>
                <p className="mt-2 opacity-90">Nossa equipe está disponível para atender você.</p>
                <p className="mt-6 font-bold text-xl">(32) 4002-8922</p>
                <p className="text-sm mt-2">suporte@minhaubs.gov.br</p>

                <div className="flex items-center justify-center gap-4 my-8">
                  <div className="h-px flex-1 bg-white/30"></div>
                  <span className="text-lg font-black uppercase tracking-wider text-white/80">ou</span>
                  <div className="h-px flex-1 bg-white/30"></div>
                </div>

                {/* Botão WhatsApp azul escuro */}
                <a
                  href="https://wa.me/5532984196290?text=Olá! Gostaria de auxílio para o uso do Minha UBS."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-800 hover:bg-blue-900 transition-all rounded-full text-white font-bold shadow-lg hover:scale-105 active:scale-95 duration-200"
                >
                  <FaWhatsapp size={24} />
                  Acesse nosso WhatsApp
                </a>
                <p className="text-xs text-white/70 mt-4"></p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Estatísticas */}
        <section className="py-40 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection direction="up" className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Números que <span className="text-blue-600 italic">inspiram confiança</span></h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto">Resultados reais alcançados em parceria com a Secretaria de Saúde de Muriaé.</p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((stat, idx) => (
                <AnimatedSection key={idx} direction={idx === 1 ? 'scale' : 'up'} delay={idx * 0.1}>
                  <div className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-2xl transition-all">
                    <div className="mb-6 flex justify-center"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition"><stat.icon size={40} /></div></div>
                    <div className="text-5xl font-black text-gray-800 mb-2"><CountUp end={stat.value} duration={2.5} suffix={stat.suffix} /></div>
                    <div className="text-slate-500 font-bold uppercase text-sm tracking-wider">{stat.label}</div>
                    <p className="text-slate-400 text-sm mt-3">{stat.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-32 pb-16 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-32">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#0f172a] rounded-xl text-white"><Activity size={24}/></div>
                <span className="text-2xl font-black uppercase">Minha<span className="text-blue-600">UBS</span></span>
              </div>
              <p className="text-slate-400 max-w-xs">O futuro do atendimento público em Muriaé agora é digital.</p>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-300 mb-8">Navegação</h4>
                <ul className="space-y-4 text-slate-600 text-sm font-bold">
                  <li><button onClick={() => scrollToSection('solucoes')} className="hover:text-blue-600">Soluções</button></li>
                  <li><button onClick={() => scrollToSection('rede')} className="hover:text-blue-600">Rede</button></li>
                  <li><button onClick={() => scrollToSection('seguranca')} className="hover:text-blue-600">Segurança</button></li>
                  <li><button onClick={() => scrollToSection('ajuda')} className="hover:text-blue-600">Ajuda</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-300 mb-8">Legal</h4>
                <ul className="space-y-4 text-slate-600 text-sm font-bold">
                  <li><a href="#">Termos de Uso</a></li>
                  <li><a href="#">Privacidade</a></li>
                  <li><a href="#">LGPD</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300">© 2026 Muriaé Digital - MG</span>
            <div className="flex gap-8 text-slate-300">
              <a href="#" className="hover:text-blue-600"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-blue-600"><FaFacebook size={24} /></a>
              <a href="#" className="hover:text-blue-600"><FaWhatsapp size={24} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;