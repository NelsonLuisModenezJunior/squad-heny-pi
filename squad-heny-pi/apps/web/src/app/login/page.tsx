"use client";
import { useState } from "react";
import api from "@/lib/api"; // seu axios configurado
import {
  FaGoogle,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaLock,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";

// Tipos para a resposta da API do Laravel
interface AuthResponse {
  status: string;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  authorization?: {
    token: string;
    type: string;
  };
}

export default function Login() {
  // Estados de login
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Estados de registro
  const [registerName, setRegisterName] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Controle do painel (login/registro)
  const [isActive, setIsActive] = useState<boolean>(false);

  // --- LOGIN ---
  const handleLogin = async (): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>("/login", {
        email: username,
        password: password,
      });

      const token = response.data.authorization?.token;
      if (token) {
        localStorage.setItem("token", token);
        alert("Login realizado com sucesso!");
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data || error.message);
      alert("Credenciais inválidas!");
    }
  };

  // --- REGISTER ---
  const handleRegister = async (): Promise<void> => {
    if (registerPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await api.post<AuthResponse>("/register", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      const token = response.data.authorization?.token;
      if (token) {
        localStorage.setItem("token", token);
        alert("Conta criada com sucesso!");
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Erro no registro:", error.response?.data || error.message);
      alert("Erro ao registrar!");
    }
  };

  // --- SOCIAL ICONS ---
  const SocialIcons = () => (
    <div className="flex gap-3 my-4">
      <a
        href="#"
        className="w-10 h-10 backdrop-blur-md bg-white/20 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all shadow-lg"
      >
        <FaGoogle className="w-5 h-5 text-gray-600" />
      </a>
      <a
        href="#"
        className="w-10 h-10 backdrop-blur-md bg-white/20 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all shadow-lg"
      >
        <FaInstagram className="w-5 h-5 text-gray-600" />
      </a>
      <a
        href="#"
        className="w-10 h-10 backdrop-blur-md bg-white/20 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all shadow-lg"
      >
        <FaGithub className="w-5 h-5 text-gray-600" />
      </a>
      <a
        href="#"
        className="w-10 h-10 backdrop-blur-md bg-white/20 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all shadow-lg"
      >
        <FaLinkedin className="w-5 h-5 text-gray-600" />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">H[ENY]</h1>
      </div>

      {/* Container Principal */}
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-[760px] min-h-[480px]">
        {/* Form Login */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-600 ease-in-out z-20 ${
            isActive ? "translate-x-full" : ""
          }`}
        >
          <div className="bg-gray-100 h-full flex flex-col items-center justify-center px-10">
            <h1 className="text-2xl font-bold mb-4">Entrar</h1>
            <SocialIcons />
            <span className="text-xs text-gray-600 mb-4">
              Use seu Email e senha
            </span>

            <div className="w-full mb-3 relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-secondary-foreground"
                required
              />
            </div>

            <div className="w-full mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-secondary-foreground"
                required
              />
            </div>

            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-secondary-foreground to-foreground text-white text-xs font-semibold py-3 px-12 rounded-md uppercase tracking-wider hover:scale-105 transition-all"
            >
              Entrar
            </button>
          </div>
        </div>

        {/* Form Registro */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-600 ease-in-out ${
            isActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"
          }`}
        >
          <div className="bg-gray-100 h-full flex flex-col items-center justify-center px-10">
            <h2 className="text-2xl font-bold mb-4">Criar Conta</h2>
            <SocialIcons />
            <span className="text-xs text-gray-600 mb-4">
              Use seu email para registrar-se
            </span>

            <div className="w-full mb-3 relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nome completo"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-secondary-foreground"
                required
              />
            </div>

            <div className="w-full mb-3 relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-secondary-foreground"
                required
              />
            </div>

            <div className="w-full mb-3 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Senha"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-secondary-foreground"
                required
              />
            </div>

            <div className="w-full mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-secondary-foreground"
                required
              />
            </div>

            <button
              onClick={handleRegister}
              className="bg-gradient-to-r from-secondary-foreground to-foreground text-white text-xs font-semibold py-3 px-12 rounded-md uppercase tracking-wider hover:scale-105 transition-all"
            >
              Registrar
            </button>
          </div>
        </div>

        {/* Painel de alternância */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-800 ease-in-out ${
            isActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`relative h-full w-[200%] -left-full bg-gradient-to-br from-foreground to-background transition-transform duration-600 ease-in-out ${
              isActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Painel esquerdo */}
            <div className="absolute w-1/2 h-full flex flex-col items-center justify-center text-center px-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Bem vindo de volta!</h1>
              <p className="text-sm mb-6">
                Para continuar conectado, faça login com suas informações
                pessoais
              </p>
              <button
                onClick={() => setIsActive(false)}
                className="bg-white/20 border border-white/50 text-white px-12 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-white/30 transition-all"
              >
                Entrar
              </button>
            </div>

            {/* Painel direito */}
            <div className="absolute right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-8 text-white">
              <h1 className="text-3xl font-bold mb-4">Olá, usuário!</h1>
              <p className="text-sm mb-6">
                Cadastre-se e comece sua jornada com o HENY
              </p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-white/20 border border-white/50 text-white px-12 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-white/30 transition-all"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
