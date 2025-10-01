import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";

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
      <HeroHeader />
      <main className="relative overflow-hidden min-h-screen">
        {/* Imagem de fundo cobrindo toda a tela */}
        <div className="absolute inset-0 -z-20 h-[120vh]">
          <Image
            src="/Floresta.jpg"
            alt="background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          {/* Overlay escuro para melhorar a legibilidade do texto */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
          {/* Efeito de névoa/gradiente na parte inferior - similar ao original */}
          <div className="mask-b-from-5 absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-[3.5%] bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        {/* Gradientes decorativos (opcional - pode remover se preferir) */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="relative z-10">
          <div className="relative pt-24 md:pt-36 pb-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="hover:bg-background/90 dark:hover:border-t-border bg-white/90 dark:bg-black/50 backdrop-blur-md group mx-auto flex w-fit items-center gap-4 rounded-full border border-white/20 p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-white/10 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground dark:text-white text-sm">
                      Quer saber mais sobre o projeto e nosso propósito
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-zinc-700 dark:bg-zinc-300"></span>

                    <div className="bg-background/90 group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem] text-white drop-shadow-2xl"
                >
                  H[ENY]
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-white/95 drop-shadow-lg"
                >
                  Gestão elétrica moderna, customizada e simplificada para sua
                  vida.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-white/10 backdrop-blur-sm rounded-[calc(var(--radius-xl)+0.125rem)] border border-white/20 p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base bg-white text-black hover:bg-white/90"
                    >
                      <Link href="#link">
                        <span className="text-nowrap">Ir para Relatórios</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Fazer uma comparação</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            {/* Seção adicional opcional - você pode remover se quiser apenas o hero com fundo */}
            <div className="mt-32 mx-auto max-w-7xl px-6">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 1.5,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="grid md:grid-cols-3 gap-6"
              >
                {/* Cards informativos opcionais com fundo translúcido */}
                <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Economia
                  </h3>
                  <p className="text-white/80">
                    Reduza seus custos com energia através de análises
                    inteligentes
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Sustentabilidade
                  </h3>
                  <p className="text-white/80">
                    Contribua para um futuro mais verde com gestão eficiente
                  </p>
                </div>
                <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Controle
                  </h3>
                  <p className="text-white/80">
                    Monitore e gerencie seu consumo em tempo real
                  </p>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
