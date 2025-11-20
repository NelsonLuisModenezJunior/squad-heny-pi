import React from "react";
import { LiquidGlassCarousel } from "@/components/ui/carousel";

export const ContentCarousel = () => {
  const mySlides = [
    {
      id: 1,
      title: "Escolhas Inteligentes Começam Aqui!",
      description: "Compare. Economize. Cuide do planeta.",
      // vivid solid radial green: center uses var(--foreground) and edges a slightly darker tone,
      // center expanded to 70% for less contrast
      gradient:
        "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
      content: (
        <div>
          O Heny ajuda você a comparar eletrodomésticos considerando consumo de
          energia, emissão de carbono e tarifas da sua região. Mais do que
          economia — é consciência.
        </div>
      ),
      image: undefined,
    },
    {
      id: 2,
      title: "Sustentabilidade ao Alcance de um Clique",
      description: "Eficiência energética nunca foi tão fácil de entender.",
      gradient:
        "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
      content: (
        <div>
          Com o Heny, você não precisa mais adivinhar qual produto é mais
          econômico — o sistema faz isso por você. Nossa plataforma mostra, de
          forma clara e intuitiva, o consumo e o custo energético de cada
          aparelho, levando em conta as tarifas da sua região. É uma maneira
          prática de entender o impacto das suas escolhas e economizar enquanto
          ajuda o planeta.
        </div>
      ),
      image: undefined,
    },
    {
      id: 3,
      title: "Tecnologia que Transforma Consumo em Consciente.",
      description: "Escolher bem é o primeiro passo para um futuro melhor.",
      gradient:
        "bg-[radial-gradient(circle_at_center,_var(--foreground)_0%,_var(--foreground)_70%,_#2f6f4f_100%)]",
      content: (
        <div>
          O Heny une tecnologia e sustentabilidade para tornar cada compra uma
          decisão inteligente — para você e para o planeta.
        </div>
      ),
      image: undefined,
    },
  ];

  return (
    <LiquidGlassCarousel
      slides={mySlides}
      autoPlay={true}
      autoPlayInterval={5000}
      className="my-8"
    />
  );
};
