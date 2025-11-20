"use client";

import { useState } from "react";
import { Leaf, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";
import { HeroHeader } from "../../components/header";
import FooterSection from "../../components/footer";

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [expandedMember, setExpandedMember] = useState(null);

  const teamMembers = [
    {
      name: "Nelson Junior",
      role: "Líder geral - Agilista/ Desenvolvedor Full-Stack",
      image: "/team/nelson.jpg",
      desc: "Responsável pela estruturação, coordenação e acompanhamento das fases do projeto, garantindo a comunicação eficiente entre os membros e conduzindo o desenvolvimento Full-Stack com foco em qualidade e alinhamento das metas.",
    },
    {
      name: "Raoni",
      role: "Desenvolvedor Back-End",
      image: "/team/raoni.jfif",
      desc: "Desenvolvedor Back-End responsável pela estruturação de dados, serviços e processamento das informações do Heny. Atua no desenvolvimento de APIs e integração de dados das tarifas regionais.",
    },
    {
      name: "Adrian José",
      role: "Designer UX/UI - Desenvolvedor Front-End",
      image: "/team/adrian.jpeg",
      desc: "Responsável pelo design de interfaces e pela construção da experiência do usuário. Atua no desenvolvimento visual e nas decisões de acessibilidade e responsividade do projeto, além da implementação do Front-End.",
    },
    {
      name: "Lucas",
      role: "Desenvolvedor Full-Stack",
      image: "/team/lucas.jfif",
      desc: "Apoia equipes de Back-End e Front-End na construção das funcionalidades principais do sistema, contribuindo para garantir a integração entre as camadas e a consistência da plataforma.",
    },
    {
      name: "Nicolas",
      role: "Desenvolvedor Full-Stack",
      image: "/team/nicolas.jfif",
      desc: "Desenvolvedor Full-Stack responsável por funcionalidades essenciais do sistema, atuando com foco em desempenho, integração e boas práticas.",
    },
  ];

  const timeline = [
    {
      year: "2025 (Primeiro Semestre)",
      title: "Versão Inicial",
      desc: "Desenvolvimento do primeiro protótipo do Heny: um sistema básico de comparação de eletrodomésticos inseridos pelo próprio usuário, ainda sem interface visual interativa ou recursos avançados.",
    },
    {
      year: "2025 (Segundo Semestre)",
      title: "Evolução e Expansão",
      desc: "Redesenho completo da experiência do usuário, implementação da nova interface e desenvolvimento de funcionalidades avançadas, como relatórios personalizados e histórico detalhado para acompanhamento do consumo energético.",
    },
    {
      year: "2025 (Lançamento)",
      title: "Produto Final",
      desc: "Entrega da versão completa e pronta para uso do Heny, projetada para atender qualquer perfil de usuário com precisão, clareza e foco em sustentabilidade.",
    },
    {
      year: "Futuro",
      title: "Inteligência Ampliada",
      desc: "Planejamos integrar recursos de inteligência artificial para gerar relatórios ainda mais personalizados, automatizar o cadastro de dados e tornar o acompanhamento de consumo energético ainda mais intuitivo e eficiente.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-gray-900">
      <HeroHeader />

      {/* FUNDO COM DEGRADÊ LARANJA/AMARELO + FORMAS GEOMÉTRICAS */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F3A302] via-[#F3A302]/70 to-[#EBEBEB] -z-10" />

      {/* Formas geométricas */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 300 Q300 350 600 300 T1200 300"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="60"
            opacity="0.3"
          />
          <path
            d="M0 500 Q300 550 600 500 T1200 500"
            fill="none"
            stroke="#79BA92"
            strokeWidth="40"
            opacity="0.4"
          />
          <path
            d="M0 700 Q300 750 600 700 T1200 700"
            fill="none"
            stroke="#51A471"
            strokeWidth="30"
            opacity="0.4"
          />
        </svg>
      </div>

      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* TÍTULO ANIMADO */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-extrabold drop-shadow-md text-white">
            Sobre o <span className="text-[#51A471]">Projeto Heny</span>
          </h1>
          <p className="mt-4 text-xl text-white/90">
            Um novo jeito de compreender consumo, tarifas e impacto ambiental.
          </p>
        </motion.div>

        {/* SESSÃO DE TRÊS COLUNAS - ANIMADA */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Leaf,
              title: "Sustentável",
              text: "Comparação inteligente baseada em consumo e impacto.",
            },
            {
              icon: Zap,
              title: "Eficiente",
              text: "Análise das tarifas locais para economia real.",
            },
            {
              icon: Users,
              title: "Feito por Pessoas",
              text: "Um time dedicado a criar soluções de verdade.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/70 transition"
            >
              <item.icon className="w-10 h-10 text-[#51A471] mb-4" />
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-800">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* QUEM SOMOS - IMAGEM + TEXTO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 grid md:grid-cols-2 gap-10 items-center"
        >
          {/* TEXTO */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white drop-shadow-md">
              Quem Somos
            </h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 p-5 rounded-2xl text-gray-800 leading-relaxed"
            >
              Somos estudantes de Sistemas de Informação da FHO | UNIARARAS,
              atualmente no 4º semestre, desenvolvendo o Heny como parte do
              Projeto Interdisciplinar. Nosso objetivo é transformar
              conhecimento acadêmico em uma solução útil, moderna e alinhada às
              necessidades reais do consumidor.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 p-5 rounded-2xl text-gray-800 leading-relaxed"
            >
              O Heny nasceu da união entre curiosidade tecnológica e interesse
              genuíno por sustentabilidade. Como entusiastas de inovação e
              desenvolvimento web, encontramos no projeto uma oportunidade de
              aplicar conceitos avançados enquanto contribuímos para um futuro
              mais consciente.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 p-5 rounded-2xl text-gray-800 leading-relaxed"
            >
              Além de ser um trabalho acadêmico, o Heny representa nossa visão
              de como a tecnologia pode tornar escolhas sustentáveis mais
              acessíveis, intuitivas e impactantes. Para nós, este projeto é o
              início de uma jornada maior dentro da área de TI e da construção
              de soluções responsáveis.
            </motion.p>
          </div>

          {/* IMAGEM DO GRUPO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F3A302] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden p-1 transform group-hover:scale-105 transition-transform duration-300 shadow-2xl">
              <div className="w-full h-110 rounded-2xl overflow-hidden">
                <img
                  src="/heny_grupo.jpeg"
                  alt="Equipe Heny"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* LINHA DO TEMPO */}
        <h2 className="text-5xl font-bold mt-32 mb-12 text-center text-white drop-shadow-lg">
          Nossa Jornada
        </h2>

        <div className="relative mb-20">
          {/* Timeline line - visual */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#F3A302] via-[#79BA92] to-[#51A471] opacity-40"></div>

          <div className="space-y-12">
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } items-center gap-8`}
              >
                <div className="w-1/2">
                  <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/70 transition">
                    <h3 className="text-2xl font-bold text-[#51A471]">
                      {t.year}
                    </h3>
                    <p className="font-semibold text-xl mt-1 text-gray-900">
                      {t.title}
                    </p>
                    <p className="mt-2 text-gray-800">{t.desc}</p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="w-0 flex justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#F3A302] to-[#51A471] rounded-full border-4 border-[#EBEBEB] shadow-lg shadow-[#F3A302]/50 animate-pulse"></div>
                </div>

                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TIME DO PROJETO */}
        <h2 className="text-5xl font-bold mt-32 mb-12 text-center text-white drop-shadow-lg">
          Equipe Heny
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-full max-w-sm bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:bg-white/70 transition hover:scale-[1.03] cursor-pointer"
              onMouseEnter={() => setHoveredMember(idx)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() =>
                setExpandedMember(expandedMember === idx ? null : idx)
              }
            >
              <img
                src={member.image}
                alt={`Foto de ${member.name}`}
                className={`w-32 h-32 object-cover rounded-full mx-auto shadow-md border-4 border-[#79BA92] grayscale ${
                  hoveredMember === idx ? "grayscale-0" : ""
                } transition-all duration-500 hover:scale-110`}
              />

              <h3 className="text-2xl font-bold text-center mt-4 text-gray-900">
                {member.name}
              </h3>
              <p
                className={`text-center font-semibold transition-colors duration-300 ${
                  hoveredMember === idx ? "text-[#51A471]" : "text-[#F3A302]"
                }`}
              >
                {member.role}
              </p>

              <motion.div
                initial={false}
                animate={{ height: expandedMember === idx ? "auto" : 0 }}
                className="overflow-hidden mt-3 text-gray-800"
              >
                <p className="text-sm leading-relaxed">{member.desc}</p>
              </motion.div>

              <button
                className={`mt-4 w-full py-2 rounded-xl font-semibold transition-all duration-300 transform ${
                  expandedMember === idx
                    ? "bg-gradient-to-r from-[#F3A302] to-[#51A471] text-white scale-100"
                    : "bg-white/40 text-[#51A471] border border-[#51A471]/50 hover:bg-white/50 scale-95"
                }`}
              >
                {expandedMember === idx ? "- Menos" : "+ Mais"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* VALORES */}
        <h2 className="text-5xl font-bold mt-32 mb-12 text-center text-white drop-shadow-lg">
          Nossos Valores
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Leaf,
              title: "Sustentabilidade",
              text: "Colocamos o meio ambiente no centro de todas as nossas decisões.",
            },
            {
              icon: Zap,
              title: "Inovação",
              text: "Buscamos constantemente novas formas de resolver problemas ambientais.",
            },
            {
              icon: Users,
              title: "Colaboração",
              text: "Acreditamos que juntos conseguimos gerar um impacto muito maior.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
              className="group bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/70 transition hover:scale-105"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                <item.icon className="w-12 h-12 text-[#51A471]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-800">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="group relative mt-20"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F3A302] via-[#79BA92] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-12 text-center transform group-hover:scale-105 transition-transform duration-300 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Faça Parte da Missão
            </h2>
            <p className="text-gray-800 text-lg mb-8">
              Junte-se a nós na jornada rumo a um futuro mais sustentável
            </p>
            <button className="group/btn relative px-8 py-3 rounded-lg font-bold overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F3A302] to-[#51A471] group-hover/btn:scale-110 transition-transform duration-300"></div>
              <span className="relative text-white">Cadastre-se</span>
            </button>
          </div>
        </motion.div>
      </section>

      <FooterSection />
    </div>
  );
}
