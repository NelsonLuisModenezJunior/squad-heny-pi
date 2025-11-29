'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface ContentCarouseProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: 1,
    title: 'Escolhas Inteligentes Começam Aqui!',
    subtitle: 'Compare. Economize. Cuide do planeta.',
    description: 'O Heny ajuda você a comparar eletrodomésticos considerando consumo de energia, emissão de carbono e tarifas da sua região. Mais do que economia – é consciência.',
    image: '/carousel/carousel-1.jpg',
  },
  {
    id: 2,
    title: 'Sustentabilidade ao Alcance de um Clique',
    subtitle: 'Eficiência energética nunca foi tão fácil de entender.',
    description: 'Com o Heny, você não precisa mais adivinhar qual produto é mais econômico. Nossa plataforma mostra, de forma clara e intuitiva, o consumo e o custo energético de cada aparelho.',
    image: '/carousel/carousel-2.png',
  },
  {
    id: 3,
    title: 'Tecnologia que Transforma Consumo em Consciente',
    subtitle: 'Escolher bem é o primeiro passo para um futuro melhor.',
    description: 'O Heny une tecnologia e sustentabilidade para tornar cada compra uma decisão inteligente – para você e para o planeta.',
    image: '/carousel/carousel-3.jpg',
  },
];

export const ContentCarousel = ({
  slides = defaultSlides,
  autoPlayInterval = 6000,
  className = '',
}: ContentCarouseProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className={`relative w-full h-full min-h-screen ${className}`}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {slides.map((slide, idx) => (
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: idx === currentSlide ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />

          <div className="absolute inset-0 flex items-center pl-6 lg:pl-20">
            <motion.div
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={idx === currentSlide ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
              className="max-w-2xl space-y-6 z-10"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={idx === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#F3A302] font-bold text-lg uppercase tracking-wider"
              >
                {slide.subtitle}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={idx === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white drop-shadow-2xl leading-tight"
              >
                {slide.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={idx === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg lg:text-xl text-white/90 max-w-xl leading-relaxed drop-shadow-lg"
              >
                {slide.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={idx === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <button className="group relative px-8 py-4 rounded-xl font-bold overflow-hidden inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F3A302] to-[#79BA92] group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="relative text-white flex items-center gap-2">
                    Explorar Agora
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F3A302]/0 via-[#F3A302]/10 to-transparent opacity-20" />
          </motion.div>
        </motion.div>
      ))}

      <div className="absolute bottom-8 left-6 right-6 z-20">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-8 bg-[#F3A302]'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2">
              <span className="text-white font-semibold text-sm">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group w-12 h-12 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#F3A302] transition-colors" />
              </motion.button>

              <motion.button
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group w-12 h-12 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-white group-hover:text-[#F3A302] transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {typeof window !== 'undefined' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onAnimationComplete={() => {
            const handleKeyDown = (e: KeyboardEvent) => {
              if (e.key === 'ArrowLeft') prevSlide();
              if (e.key === 'ArrowRight') nextSlide();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
          }}
        />
      )}
    </div>
  );
};
