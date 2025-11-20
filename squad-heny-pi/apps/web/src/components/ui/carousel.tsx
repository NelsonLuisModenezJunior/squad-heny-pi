"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  content?: React.ReactNode;
  image?: string;
  gradient?: string;
}

interface CarouselProps {
  slides?: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Gestão Inteligente de Energia",
    description:
      "Monitore e otimize o consumo energético dos seus eletrodomésticos com relatórios detalhados e insights em tempo real.",
    // vivid solid radial green background (center expanded for softer edge)
    gradient:
      "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
    image: undefined,
  },
  {
    id: 2,
    title: "Economia Sustentável",
    description:
      "Reduza suas contas de energia e minimize seu impacto ambiental com nossas ferramentas de análise e comparação.",
    gradient:
      "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
    image: undefined,
  },
  {
    id: 3,
    title: "Relatórios Personalizados",
    description:
      "Acesse relatórios detalhados sobre consumo, custos e impactos ambientais, tudo em uma interface intuitiva.",
    gradient:
      "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
    image: undefined,
  },
  {
    id: 4,
    title: "Conscientização Ambiental",
    description:
      "Entenda o impacto real do seu consumo energético e tome decisões mais conscientes para um futuro sustentável.",
    gradient:
      "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
    image: undefined,
  },
];

export function LiquidGlassCarousel({
  slides = defaultSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(nextSlide, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, isPaused, autoPlayInterval, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div
        className="relative w-full px-0 py-16 md:py-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Container */}
        <div className="relative w-full h-[400px] md:h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out",
                index === currentSlide
                  ? "translate-x-0 opacity-100"
                  : index < currentSlide
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              )}
            >
              {/* Slide com imagem de fundo, sem borda */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Imagem de fundo */}
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}

                {/* Gradient overlay (slide.gradient can be a full bg class, e.g. radial) */}
                <div
                  className={cn(
                    "absolute inset-0 z-10",
                    slide.gradient ||
                      "bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                  )}
                />

                {/* Shimmer effect */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_2s_ease-in-out] z-20" />

                {/* Conteúdo */}
                <div className="relative z-30 text-center w-full max-w-3xl mx-auto bg-black/20 backdrop-blur-sm p-6 rounded-2xl">
                  <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-xl text-primary drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                    {slide.description}
                  </p>

                  {slide.content && (
                    <div className="mt-8 text-white">{slide.content}</div>
                  )}
                  {!slide.content && (
                    <div className="mx-auto mt-8 flex justify-center gap-4">
                      <div className="h-20 w-20 animate-pulse rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600" />
                      <div className="h-20 w-20 animate-pulse rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 animation-delay-200" />
                      <div className="h-20 w-20 animate-pulse rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 animation-delay-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 md:left-8"
          aria-label="Previous slide"
        >
          <div className="group relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white/20 active:scale-95 md:h-16 md:w-16">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1s_ease-in-out]" />
            <ChevronLeft className="absolute inset-0 m-auto h-6 w-6 text-white transition-transform group-hover:scale-110 md:h-8 md:w-8" />
          </div>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 md:right-8"
          aria-label="Next slide"
        >
          <div className="group relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white/20 active:scale-95 md:h-16 md:w-16">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1s_ease-in-out]" />
            <ChevronRight className="absolute inset-0 m-auto h-6 w-6 text-white transition-transform group-hover:scale-110 md:h-8 md:w-8" />
          </div>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full bg-white/30 transition-all duration-300 hover:bg-white/50",
                index === currentSlide ? "w-8 bg-white/60" : "w-2"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Exemplo de uso do componente com slides customizados
export function CarouselExample() {
  const customSlides: CarouselSlide[] = [
    {
      id: 1,
      title: "Economia de Energia",
      description:
        "Reduza até 30% nas suas contas de luz com nossas análises inteligentes",
      content: (
        <div className="flex justify-center gap-4">
          <div className="rounded-xl bg-green-500/20 p-4">
            <span className="text-2xl font-bold text-green-400">-30%</span>
            <p className="text-sm text-muted-foreground">Redução média</p>
          </div>
          <div className="rounded-xl bg-blue-500/20 p-4">
            <span className="text-2xl font-bold text-blue-400">24/7</span>
            <p className="text-sm text-muted-foreground">Monitoramento</p>
          </div>
        </div>
      ),
      gradient: "from-green-600/20 to-emerald-600/20",
      image: undefined,
    },
    // Adicione mais slides customizados aqui
  ];

  return (
    <LiquidGlassCarousel
      slides={customSlides}
      autoPlay={true}
      autoPlayInterval={5000}
      className="my-8"
    />
  );
}
