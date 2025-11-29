'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { Clock, CreditCard, Truck, Globe, Package, MessageCircle } from 'lucide-react';
import Link from 'next/link';

type FAQItem = {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
};

export default function FAQsPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'item-1',
      icon: <Clock className="w-5 h-5" />,
      question: 'Por que o projeto se chama Heny?',
      answer: 'Heny é um acrônimo que representa nossa missão: integrar **H**abits, **E**nergy, aNd **Y**our choices. O nome reflete nosso compromisso em conectar os hábitos diários das pessoas com o consumo de energia e as escolhas conscientes que impactam o meio ambiente.',
    },
    {
      id: 'item-2',
      icon: <CreditCard className="w-5 h-5" />,
      question: 'Posso salvar ou exportar minhas comparações?',
      answer: 'Sim! Na versão completa do Heny, você poderá salvar suas comparações favoritas em sua conta pessoal, organizá-las em pastas temáticas e exportar relatórios detalhados em formato PDF. Esses recursos estão planejados para a próxima fase do projeto.',
    },
    {
      id: 'item-3',
      icon: <Truck className="w-5 h-5" />,
      question: 'O Heny considera o impacto do uso diário?',
      answer: 'Absolutamente! O Heny analisa não apenas o consumo teórico dos aparelhos, mas também considera padrões de uso realistas. Você pode informar quantas horas por dia utiliza cada eletrodoméstico, e nosso sistema recalcula automaticamente o impacto ambiental e os custos associados.',
    },
    {
      id: 'item-4',
      icon: <Globe className="w-5 h-5" />,
      question: 'O Heny mostra qual produto é mais sustentável?',
      answer: 'Sim! Comparamos não apenas consumo de energia, mas também durabilidade, eficiência, e impacto ambiental total. Nossa ferramenta fornece uma pontuação de sustentabilidade que considera múltiplos fatores, ajudando você a escolher a opção mais verde.',
    },
    {
      id: 'item-5',
      icon: <Package className="w-5 h-5" />,
      question: 'Como funcionam os relatórios do Heny?',
      answer: 'Os relatórios do Heny consolidam suas comparações e análises em um documento visual e detalhado. Eles mostram gráficos de consumo, estimativas de impacto ambiental, economia potencial e recomendações personalizadas para otimizar seu consumo energético de forma sustentável.',
    },
    {
      id: 'item-6',
      icon: <MessageCircle className="w-5 h-5" />,
      question: 'Ainda tenho dúvidas, como entro em contato?',
      answer: 'Você pode entrar em contato conosco através do formulário de suporte em nosso site, enviar um email para nossa equipe de suporte ou conectar-se conosco nas redes sociais. Estamos sempre disponíveis para esclarecer dúvidas e ouvir sugestões!',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-gray-900">
      {/* FUNDO COM DEGRADÊ LARANJA/AMARELO + FORMAS GEOMÉTRICAS */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F3A302] via-[#F3A302]/70 to-[#EBEBEB] -z-10" />

      {/* Formas geométricas */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-extrabold drop-shadow-md text-white">
            Perguntas <span className="text-[#51A471]">Frequentes</span>
          </h1>
          <p className="mt-4 text-xl text-white/90">
            Aqui você encontra as respostas para suas principais dúvidas sobre o Heny.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* SIDEBAR ESQUERDO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 sticky top-32 h-fit"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quer conhecer mais sobre o projeto?
              </h2>
              <p className="text-gray-800 mb-6 leading-relaxed">
                Visite nossa página “Sobre nós” e descubra a trajetória que nos trouxe até o{' '}
                <Link
                  href="#"
                  className="text-[#51A471] font-semibold hover:text-[#F3A302] transition-colors"
                >
                  HENY
                </Link>
                .
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-3"
              >
                <button className="w-full bg-gradient-to-r from-[#F3A302] to-[#79BA92] text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Visitar Sobre Nós
                </button>
                <button className="w-full bg-white/40 border border-[#51A471]/50 text-[#51A471] font-bold py-3 px-4 rounded-xl hover:bg-white/50 transition-all duration-300">
                  Voltar
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* ACCORDIONS DIREITA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    value={openItem === item.id ? item.id : ''}
                    onValueChange={(val) => setOpenItem(val || null)}
                  >
                    <AccordionItem
                      value={item.id}
                      className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-6 overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300"
                    >
                      <AccordionTrigger className="cursor-pointer py-5 hover:no-underline group">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#F3A302] to-[#79BA92] text-white group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <span className="text-lg font-semibold text-gray-900 group-hover:text-[#51A471] transition-colors duration-300">
                            {item.question}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pb-5 pt-2">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-14 py-4 bg-white/40 rounded-xl"
                        >
                          <p className="text-gray-800 leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="group relative mt-32"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F3A302] via-[#79BA92] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-12 text-center transform group-hover:scale-105 transition-transform duration-300 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Que tal dar o próximo passo?
            </h2>
            <p className="text-gray-800 text-lg mb-8">
                Crie seu primeiro relatório e veja o sistema em ação !</p>
            <button className="group/btn relative px-8 py-3 rounded-lg font-bold overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F3A302] to-[#51A471] group-hover/btn:scale-110 transition-transform duration-300"></div>
              <span className="relative text-white">Começar agora</span>
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}