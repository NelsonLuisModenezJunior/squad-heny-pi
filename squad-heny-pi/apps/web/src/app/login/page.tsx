"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  FaGoogle,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaLock,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post<AuthResponse>("/login", {
        email: username,
        password,
      });
      const token = response.data.authorization?.token;
      const user = response.data.user;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Login realizado com sucesso!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch {
      alert("Credenciais inválidas!");
    }
  };

  const handleRegister = async () => {
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
    } catch {
      alert("Erro ao registrar!");
    }
  };

  const SocialIcons = () => (
    <div className="flex gap-3 my-4">
      {[FaGoogle, FaInstagram, FaGithub, FaLinkedin].map((Icon, i) => (
        <a
          key={i}
          href="#"
          className="w-10 h-10 backdrop-blur-md bg-[#51A471]/20 border border-[#51A471]/40 rounded-full flex items-center justify-center hover:bg-[#F3A302]/40 hover:border-[#F3A302]/70 hover:scale-110 transition-all shadow-lg group"
        >
          <Icon className="w-5 h-5 text-[#51A471] group-hover:text-[#E5A342] transition-colors" />
        </a>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      <style>{`
        @keyframes wave-float-1 { 0%,100%{transform:translate(0,0)rotate(-20deg)} 50%{transform:translate(-1%,3%)rotate(-20deg)} }
        @keyframes wave-float-2 { 0%,100%{transform:translate(0,0)rotate(-20deg)} 50%{transform:translate(3%,-1%)rotate(-20deg)} }
        @keyframes wave-float-3 { 0%,100%{transform:translate(0,0)rotate(-20deg)} 50%{transform:translate(-1%,-3%)rotate(-20deg)} }
        @keyframes wave-float-4 { 0%,100%{transform:translate(0,0)rotate(-20deg)} 50%{transform:translate(1%,3%)rotate(-20deg)} }
        @keyframes wave-float-5 { 0%,100%{transform:translate(0,0)rotate(-20deg)} 50%{transform:translate(-3%,1%)rotate(-20deg)} }
        .wave-1{animation:wave-float-1 15s ease-in-out infinite}
        .wave-2{animation:wave-float-2 12s ease-in-out infinite}
        .wave-3{animation:wave-float-3 10s ease-in-out infinite}
        .wave-4{animation:wave-float-4 18s ease-in-out infinite}
        .wave-5{animation:wave-float-5 9s ease-in-out infinite}
        @keyframes pulse-zoom{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .logo-pulse{animation:pulse-zoom 6s cubic-bezier(0.4,0,0.2,1) infinite}
      `}</style>

      <div className="absolute inset-0 -z-10 bg-[#4A9A6F]" />

      <div className="absolute inset-0 -z-10 w-[150%] h-[150%] -left-[25%] -top-[25%]">
        <div
          className="wave-1 absolute w-full h-[32%] top-[10%]"
          style={{
            background: "#3D7A5C",
            clipPath: "ellipse(120% 120% at 30% 100%)",
            filter: "brightness(0.9) drop-shadow(0 15px 60px rgba(0, 0, 0, 1))",
          }}
        />
        <div
          className="wave-2 absolute w-full h-[35%] top-[20%]"
          style={{
            background: "#4A8B6A",
            clipPath: "ellipse(150% 90% at 48% 90%)",
            filter: "drop-shadow(0 12px 30px rgba(0, 0, 0, 0.62))",
          }}
        />
        <div
          className="wave-3 absolute w-full h-[38%] top-[33%]"
          style={{
            background: "#51A471",
            clipPath: "ellipse(115% 125% at 52% 100%)",
            filter: "drop-shadow(0 18px 50px rgba(0, 0, 0, 0.67))",
          }}
        />
        <div
          className="wave-4 absolute w-full h-[40%] top-[46%]"
          style={{
            background: "#6AB88A",
            clipPath: "ellipse(110% 115% at 50% 100%)",
            filter: "drop-shadow(0 20px 50px rgba(0, 0, 0, 0.65))",
          }}
        />
        <div
          className="wave-5 absolute w-full h-[42%] top-[58%]"
          style={{
            background: "#79BA92",
            clipPath: "ellipse(120% 120% at 48% 100%)",
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.62))",
          }}
        />
        <div
          className="wave-1 absolute w-full h-[30%] top-[68%]"
          style={{
            background:
              "linear-gradient(135deg,#79BA92 0%,#A8B67E 50%,#D4A956 100%)",
            clipPath: "ellipse(100% 120% at 50% 100%)",
            filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7))",
          }}
        />
        <div
          className="wave-2 absolute w-full h-[40%] top-[78%]"
          style={{
            background: "#E5A342",
            clipPath: "ellipse(115% 115% at 49% 100%)",
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.73))",
          }}
        />
        <div
          className="wave-3 absolute w-full h-[38%] top-[88%]"
          style={{
            background: "#F3A302",
            clipPath: "ellipse(100% 120% at 50% 80%)",
            filter: "drop-shadow(10 30px 50px rgba(0, 0, 0, 1))",
          }}
        />
        <div
          className="wave-4 absolute w-full h-[35%] top-[98%]"
          style={{
            background: "#F7B734",
            clipPath: "ellipse(110% 125% at 52% 100%)",
            filter: "drop-shadow( 35px 55px rgba(0, 0, 0, 0.43))",
          }}
        />
      </div>

      <div className="absolute inset-0 -z-10 backdrop-blur-[3px]" />

      <div className="mb-8 z-10 logo-pulse">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">H[ENY]</h1>
      </div>

      <div
        className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden w-full max-w-[760px] min-h-[480px] z-10"
        style={{
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.4), inset 0 0 25px rgba(255,255,255,0.05)",
        }}
      >
        {/* Login */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-600 ease-in-out z-20 ${
            isActive ? "translate-x-full" : ""
          }`}
        >
          <div className="bg-gray-100/95 h-full flex flex-col items-center justify-center px-10">
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
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#79BA92]"
              />
            </div>
            <div className="w-full mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#79BA92]"
              />
            </div>
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-[#79BA92] to-[#51A471] text-white text-xs font-semibold py-3 px-12 rounded-md uppercase tracking-wider hover:scale-110 active:scale-95 transition-all shadow-lg"
            >
              Entrar
            </button>
          </div>
        </div>

        {/* Registro */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-600 ease-in-out ${
            isActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"
          }`}
        >
          <div className="bg-gray-100/95 h-full flex flex-col items-center justify-center px-10">
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
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#79BA92]"
              />
            </div>
            <div className="w-full mb-3 relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#79BA92]"
              />
            </div>
            <div className="w-full mb-3 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Senha"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#79BA92]"
              />
            </div>
            <div className="w-full mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-200 py-3 pl-10 pr-4 text-sm rounded-md outline-none focus:ring-2 focus:ring-[#79BA92]"
              />
            </div>
            <button
              onClick={handleRegister}
              className="bg-gradient-to-r from-[#79BA92] to-[#51A471] text-white text-xs font-semibold py-3 px-12 rounded-md uppercase tracking-wider hover:scale-110 active:scale-95 transition-all shadow-lg"
            >
              Registrar
            </button>
          </div>
        </div>

        {/* Painel alternância */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-800 ease-in-out ${
            isActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`relative h-full w-[200%] -left-full bg-gradient-to-br from-[#51A471] via-[#79BA92] to-[#F3A302] transition-transform duration-600 ease-in-out ${
              isActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            <div className="absolute w-1/2 h-full flex flex-col items-center justify-center text-center px-8 text-white">
              <h1 className="text-3xl font-bold mb-4 drop-shadow-2xl">
                Bem vindo de volta!
              </h1>
              <p className="text-sm mb-6 drop-shadow-lg">
                Para continuar conectado, faça login com suas informações
                pessoais
              </p>
              <button
                onClick={() => setIsActive(false)}
                className="bg-white/20 border-2 border-white/50 text-white px-12 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-white/30 hover:scale-110 active:scale-95 transition-all shadow-lg"
              >
                Entrar
              </button>
            </div>

            <div className="absolute right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-8 text-white">
              <h1 className="text-3xl font-bold mb-4 drop-shadow-2xl">
                Olá, usuário!
              </h1>
              <p className="text-sm mb-6 drop-shadow-lg">
                Cadastre-se e comece sua jornada com o HENY
              </p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-white/20 border-2 border-white/50 text-white px-12 py-2 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-white/30 hover:scale-110 active:scale-95 transition-all shadow-lg"
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
