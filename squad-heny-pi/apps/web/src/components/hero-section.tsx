"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <main className="relative overflow-hidden min-h-[90vh] h-[90vh] flex flex-col justify-center">
        {/* Background com blur */}
        <div className="absolute inset-0 -z-20">
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#000000]" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Efeitos de iluminação animada - Cantos */}
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#F3A302]/20 via-[#F3A302]/5 to-transparent rounded-full blur-3xl animate-pulse -z-10" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#79BA92]/15 via-[#79BA92]/5 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000 -z-10" />

        {/* Animação de luz RGB */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#FF6B35] via-[#F3A302] to-[#FFD700] rounded-full blur-3xl opacity-0 animate-[pulse_4s_ease-in-out_infinite] -z-10" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-[#51A471] via-[#79BA92] to-[#A8D5BA] rounded-full blur-3xl opacity-0 animate-[pulse_4s_ease-in-out_infinite] -z-10" style={{ animationDelay: '1.3s' }} />

        {/* Divisor superior com glassmorfismo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F3A302]/40 to-transparent" />

        <section className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mx-auto max-w-7xl px-6 w-full">
            <div className="text-center">
              {/* Badge com glassmorfismo */}
              <div className="mx-auto mb-8 flex w-fit">
                <Link
                  href="#link"
                  className="group bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 hover:border-[#F3A302]/50 p-1 pl-4 pr-1 rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(243,163,2,0.3)] transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-white/90 text-sm font-medium">
                      Quer saber mais sobre o Heny?
                    </span>
                    <div className="bg-gradient-to-r from-[#F3A302] to-[#FFB84D] p-1.5 rounded-full group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </span>
                </Link>
              </div>

              {/* Título principal */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-2xl mb-6 bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                H[ENY]
              </h1>

              {/* Subtítulo */}
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/80 drop-shadow-lg mb-12 leading-relaxed">
                Gestão elétrica moderna, customizada e simplificada para sua vida
              </p>

              {/* Botões de ação */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12">
                <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-0.5 hover:border-[#F3A302]/50 transition-all hover:shadow-[0_0_20px_rgba(243,163,2,0.2)]">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#F3A302] to-[#FFB84D] text-black font-bold rounded-[10px] hover:shadow-lg hover:shadow-[#F3A302]/50 transition-all">
                    Ir para Relatórios
                  </button>
                </div>

                <button className="px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white font-bold rounded-xl hover:border-[#51A471]/50 hover:bg-white/15 transition-all duration-300">
                  Fazer uma comparação
                </button>
              </div>

              {/* Cards informativos com glassmorfismo */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                <div className="group bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[#F3A302]/50 transition-all hover:shadow-[0_0_20px_rgba(243,163,2,0.2)]">
                  <h3 className="text-xl font-bold text-[#F3A302] mb-2 group-hover:text-[#FFB84D] transition-colors">
                    Economia
                  </h3>
                  <p className="text-white/70 text-sm">
                    Reduza seus custos com energia através de análises inteligentes
                  </p>
                </div>

                <div className="group bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[#51A471]/50 transition-all hover:shadow-[0_0_20px_rgba(81,164,113,0.2)]">
                  <h3 className="text-xl font-bold text-[#51A471] mb-2 group-hover:text-[#79BA92] transition-colors">
                    Sustentabilidade
                  </h3>
                  <p className="text-white/70 text-sm">
                    Contribua para um futuro mais verde com gestão eficiente
                  </p>
                </div>

                <div className="group bg-white/10 dark:bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[#79BA92]/50 transition-all hover:shadow-[0_0_20px_rgba(121,186,146,0.2)]">
                  <h3 className="text-xl font-bold text-[#79BA92] mb-2 group-hover:text-[#A8D5BA] transition-colors">
                    Controle
                  </h3>
                  <p className="text-white/70 text-sm">
                    Monitore e gerencie seu consumo em tempo real
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divisor inferior com glassmorfismo */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#51A471]/40 to-transparent" />
        
        {/* Gradiente inferior suave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F3A302]/5 via-transparent to-transparent pointer-events-none" />
      </main>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}