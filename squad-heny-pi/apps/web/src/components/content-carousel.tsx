import React from "react";
import { LiquidGlassCarousel } from "@/components/ui/carousel";

export const ContentCarousel = () => {
  const mySlides = [
    {
      id: 1,
      title: "Escolhas Inteligentes Começam Aqui!",
      description: "Compare. Economize. Cuide do planeta.",
      gradient: "from-blue-600/20 to-cyan-600/20",
      content: (
        <div>
          O Heny ajuda você a comparar eletrodomésticos considerando consumo de
          energia, emissão de carbono e tarifas da sua região. Mais do que
          economia — é consciência.
        </div>
      ),
      image: "/GeladeirasComparadas.jpg",
    },
    {
      id: 2,
      title: "Sustentabilidade ao Alcance de um Clique",
      description: "Eficiência energética nunca foi tão fácil de entender.",
      gradient: "from-blue-600/20 to-cyan-600/20",
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
      image: "/GreenPrint.png",
    },
    {
      id: 3,
      title: "Tecnologia que Transforma Consumo em Consciente.",
      description: "Escolher bem é o primeiro passo para um futuro melhor.",
      gradient: "from-blue-600/20 to-cyan-600/20",
      content: (
        <div>
          O Heny une tecnologia e sustentabilidade para tornar cada compra uma
          decisão inteligente — para você e para o planeta.
        </div>
      ),
      image: "/Floresta.jpg",
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
