"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
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
        duration: 0.5,
      },
    },
  },
};

interface HeroSectionProps {
  backgroundImage?: string;
}

export default function HeroSection({ backgroundImage }: HeroSectionProps) {
  return (
    <>
      <main className="relative overflow-hidden min-h-screen h-screen flex flex-col justify-center">
        {/* BACKGROUND */}
        <div
          className="absolute inset-0 -z-50 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home.jpg')" }}
        ></div>

        {/* OVERLAY — blur + escurecer */}
        <div className="absolute inset-0 -z-10 backdrop-blur-[2px] bg-black/55"></div>

        {/* Efeitos de iluminação animada - Cantos com glassmorfismo */}
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#F3A302]/15 via-[#F3A302]/5 to-transparent rounded-full blur-3xl animate-pulse -z-10" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#51A471]/10 via-[#51A471]/5 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000 -z-10" />

        {/* Animação de luz RGB */}
        <div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#F3A302] via-[#FFB84D] to-[#FFD700] rounded-full blur-3xl opacity-0 animate-[pulse_4s_ease-in-out_infinite] -z-10"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-[#51A471] via-[#79BA92] to-[#A8D5BA] rounded-full blur-3xl opacity-0 animate-[pulse_4s_ease-in-out_infinite] -z-10"
          style={{ animationDelay: "1.3s" }}
        />

        {/* Divisor superior com glassmorfismo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F3A302]/40 to-transparent" />

        <section className="relative z-10 flex-1 flex flex-col justify-center pt-12 md:pt-32">
          <div className="mx-auto max-w-7xl px-6 w-full">
            <div className="text-center">
              {/* Badge com glassmorfismo */}
              <AnimatedGroup variants={transitionVariants}>
                <Link
                  href="/sobre"
                  className="group bg-white/40 backdrop-blur-xl border border-white/60 hover:border-[#F3A302]/80 p-1 pl-4 pr-1 rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(243,163,2,0.3)] transition-all duration-300 mx-auto mb-8 flex w-fit"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-gray-800 text-sm font-medium">
                      Conheça nosso projeto sustentável
                    </span>
                    <div className="bg-gradient-to-r from-[#F3A302] to-[#FFB84D] p-1.5 rounded-full group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </span>
                </Link>
              </AnimatedGroup>

              {/* Título principal */}
              <TextEffect
                preset="fade-in-blur"
                speedReveal={0.8}
                as="h1"
                className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-lg mb-6"
              >
                H[ENY]
              </TextEffect>

              {/* Subtítulo */}
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.3}
                as="p"
                className="mx-auto max-w-2xl text-lg md:text-xl text-white drop-shadow-lg mb-12 leading-relaxed font-medium"
              >
                Gestão Inteligente de Energia para Economia e Sustentabilidade
              </TextEffect>

              {/* Botões de ação */}
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.6,
                      },
                    },
                  },
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
                        duration: 0.5,
                      },
                    },
                  },
                }}
                className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12"
              >
                <div>
                  <Link
                    href="/relatorio"
                    className="inline-block bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-0.5 hover:border-[#F3A302]/80 transition-all hover:shadow-[0_0_20px_rgba(243,163,2,0.2)]"
                  >
                    <span className="block px-8 py-3 bg-gradient-to-r from-[#F3A302] to-[#FFB84D] text-white font-bold rounded-[10px] hover:shadow-lg hover:shadow-[#F3A302]/50 transition-all">
                      Começar Análise
                    </span>
                  </Link>
                </div>

                <div>
                  <Link
                    href="/faq"
                    className="px-8 py-3 bg-white/40 backdrop-blur-xl border border-white/60 text-gray-800 font-bold rounded-xl hover:border-[#51A471]/80 hover:bg-white/50 transition-all duration-300 inline-block"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </AnimatedGroup>

              {/* Cards informativos com glassmorfismo */}
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 1.2,
                      },
                    },
                  },
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
                        duration: 0.5,
                      },
                    },
                  },
                }}
                className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16"
              >
                <div className="group bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 hover:border-[#F3A302]/80 transition-all hover:shadow-[0_0_20px_rgba(243,163,2,0.2)]">
                  <h3 className="text-xl font-bold text-[#F3A302] mb-2 group-hover:text-[#FFB84D] transition-colors">
                    Economia
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Reduza suas contas de energia até 30% através de análises
                    inteligentes e recomendações personalizadas
                  </p>
                </div>

                <div className="group bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 hover:border-[#51A471]/80 transition-all hover:shadow-[0_0_20px_rgba(81,164,113,0.2)]">
                  <h3 className="text-xl font-bold text-[#51A471] mb-2 group-hover:text-[#79BA92] transition-colors">
                    Sustentabilidade
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Contribua para um futuro mais verde monitorando seu impacto
                    ambiental em tempo real
                  </p>
                </div>

                <div className="group bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60 hover:border-[#79BA92]/80 transition-all hover:shadow-[0_0_20px_rgba(121,186,146,0.2)]">
                  <h3 className="text-xl font-bold text-[#79BA92] mb-2 group-hover:text-[#A8D5BA] transition-colors">
                    Controle
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Gerencie e monitore seu consumo de energia com relatórios
                    detalhados e comparativos
                  </p>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>

        {/* Divisor inferior com glassmorfismo */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#51A471]/40 to-transparent" />
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

// Uso com background:
// <HeroSection backgroundImage="/caminho/da/imagem.jpg" />
