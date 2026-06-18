import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiUser,
  HiLockClosed,
  HiMail,
  HiPhone, // ← era "iPhone"
  HiIdentification,
} from "react-icons/hi";
import { Activity } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

// Funções de validação
const validarCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/[^\d]/g, "");
  if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  const digito1 = resto >= 10 ? 0 : resto;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  const digito2 = resto >= 10 ? 0 : resto;
  return (
    digito1 === parseInt(cpfLimpo.charAt(9)) &&
    digito2 === parseInt(cpfLimpo.charAt(10))
  );
};

const validarTelefone = (telefone) => {
  const telefoneLimpo = telefone.replace(/[^\d]/g, "");
  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
};

const validarSenhaForte = (senha) => {
  if (senha.length < 8) return false;
  const temLetra = /[a-zA-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  return temLetra && temNumero;
};

const formatarCPF = (cpf) => {
  const value = cpf.replace(/\D/g, "");
  return value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .slice(0, 14);
};

const formatarTelefone = (telefone) => {
  const value = telefone.replace(/\D/g, "");
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

const CadastroConta = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cpfValid, setCpfValid] = useState(true);
  const [telefoneValid, setTelefoneValid] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let isValid = true;

    if (name === "cpf") {
      formattedValue = formatarCPF(value);
      isValid = validarCPF(formattedValue);
      setCpfValid(isValid);
    } else if (name === "telefone") {
      const onlyNumbers = value.replace(/\D/g, "");
      if (onlyNumbers.length <= 11) {
        if (onlyNumbers.length <= 2) {
          formattedValue = onlyNumbers;
        } else if (onlyNumbers.length <= 7) {
          formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
        } else {
          if (onlyNumbers.length === 11) {
            formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7)}`;
          } else {
            formattedValue = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 6)}-${onlyNumbers.slice(6)}`;
          }
        }
        isValid = validarTelefone(formattedValue);
        setTelefoneValid(isValid);
      } else {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue || value }));
    if (
      errors[name] ||
      (name === "cpf" && !cpfValid) ||
      (name === "telefone" && !telefoneValid)
    ) {
      setErrors((curr) => ({ ...curr, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    else if (!validarCPF(formData.cpf)) newErrors.cpf = "CPF inválido";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "E-mail inválido";
    if (!formData.telefone.trim())
      newErrors.telefone = "Telefone é obrigatório";
    else if (!validarTelefone(formData.telefone))
      newErrors.telefone = "Telefone inválido";

    // Senha forte
    if (!formData.senha) newErrors.senha = "Senha é obrigatória";
    else if (!validarSenhaForte(formData.senha)) {
      newErrors.senha = "Mínimo 8 caracteres, incluindo letras e números";
    }
    if (formData.senha !== formData.confirmarSenha)
      newErrors.confirmarSenha = "As senhas não coincidem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/[^\d]/g, ""),
        email: formData.email,
        telefone: formData.telefone.replace(/[^\d]/g, ""),
        senha: formData.senha,
      };
      const success = await register(userData);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Conta criada!",
          text: "Seu cadastro foi realizado com sucesso. Faça login para continuar.",
          confirmButtonColor: "#0057B8",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível criar a conta. E-mail ou CPF já cadastrado.",
          confirmButtonColor: "#0057B8",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Ocorreu um erro. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-indigo-100/30 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-8"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Activity size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">
            Criar Conta
          </h2>
          <p className="text-slate-500 mt-2">
            Preencha os dados para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome Completo */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#0f172a] mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <HiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.nome ? "border-red-500" : "border-slate-200"}`}
                  placeholder="Digite seu nome completo"
                />
              </div>
              {errors.nome && (
                <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-1">
                CPF
              </label>
              <div className="relative">
                <HiIdentification
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${!cpfValid ? "border-red-500" : "border-slate-200"}`}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              {!cpfValid && (
                <p className="text-red-500 text-xs mt-1">CPF inválido</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-1">
                Telefone
              </label>
              <div className="relative">
                <iPhone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${!telefoneValid ? "border-red-500" : "border-slate-200"}`}
                  placeholder="(00) 00000-0000"
                  maxLength={16}
                />
              </div>
              {!telefoneValid && (
                <p className="text-red-500 text-xs mt-1">Telefone inválido</p>
              )}
            </div>

            {/* E-mail */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#0f172a] mb-1">
                E-mail
              </label>
              <div className="relative">
                <HiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-1">
                Senha
              </label>
              <div className="relative">
                <HiLockClosed
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Mínimo 8 caracteres, letras e números"
                />
              </div>
              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <HiLockClosed
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Repita a senha"
                />
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmarSenha}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Já possui conta?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Faça login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CadastroConta;
