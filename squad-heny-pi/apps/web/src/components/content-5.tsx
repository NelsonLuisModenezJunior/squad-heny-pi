'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, TrendingUp, Target, Zap, Leaf, AlertCircle, BarChart3 } from 'lucide-react';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden text-gray-900">
      {/* FUNDO COM DEGRADÊ */}
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

      {/* SEÇÃO 1: PROBLEMA/OPORTUNIDADE */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block bg-white/60 backdrop-blur-xl border border-white/40 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-semibold text-[#51A471]">O Problema Real</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight mb-6">
                Você Realmente Sabe o Quanto Sua Energia Custa?
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                'Contas de luz chegam cada vez mais altas',
                'Não sabe quais aparelhos consomem mais energia',
                'Dificuldade em tomar decisões de compra conscientes',
                'Falta de visibilidade sobre seu impacto ambiental'
              ].map((problem, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <AlertCircle className="w-5 h-5 text-[#F3A302] flex-shrink-0 mt-1" />
                  <p className="text-lg text-white/90">{problem}</p>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-xl text-white/80 italic border-l-4 border-[#F3A302] pl-6"
            >
              A maioria das pessoas gasta em média 30% a mais de energia do que realmente precisava.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group"
          >
            <div className="w-full h-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 rounded-3xl flex items-center justify-center">
              <div className="text-center p-8">
                <BarChart3 className="w-24 h-24 text-[#51A471] mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 font-semibold">Espaço para sua imagem</p>
                <p className="text-gray-600 text-sm">Gráfico de economia</p>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F3A302] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 2: COMO FUNCIONA (STEPS) */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
            Como o <span className="text-[#51A471]">Heny</span> Funciona
          </h2>
          <p className="text-xl text-white/90">Três passos simples para revolucionar sua gestão energética</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Cadastre Seus Aparelhos',
              description: 'Adicione os eletrodomésticos que você usa. Nosso sistema tem um banco de dados com centenas de modelos.',
              icon: <Zap className="w-8 h-8" />
            },
            {
              step: '02',
              title: 'Configure Sua Tarifa Local',
              description: 'Informe a tarifa de energia da sua região. O Heny calcula automaticamente seus gastos em tempo real.',
              icon: <Target className="w-8 h-8" />
            },
            {
              step: '03',
              title: 'Receba Insights Personalizados',
              description: 'Acesse relatórios detalhados, comparações e recomendações para economizar e ajudar o planeta.',
              icon: <TrendingUp className="w-8 h-8" />
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 h-full hover:bg-white/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#F3A302] to-[#79BA92] flex items-center justify-center text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="text-[#51A471] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>

                {idx < 2 && (
                  <div className="absolute -right-4 top-1/2 w-8 h-1 bg-gradient-to-r from-[#F3A302] to-[#79BA92] hidden md:block" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 3: RECURSOS COMPARATIVOS (TABS) */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
            O Que Você Ganha com <span className="text-[#51A471]">Heny</span>
          </h2>
          <p className="text-xl text-white/90">Comparação de valores reais</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Economia', 'Sustentabilidade', 'Praticidade'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === idx
                  ? 'bg-gradient-to-r from-[#F3A302] to-[#79BA92] text-white shadow-lg'
                  : 'bg-white/40 backdrop-blur-xl border border-white/40 text-white hover:bg-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {[
                  { title: 'Redução de até 30%', desc: 'Nas suas contas de energia' },
                  { title: 'Comparações Precisas', desc: 'Saiba exatamente o que cada aparelho custa' },
                  { title: 'Projeções Futuras', desc: 'Planeje suas despesas com base em dados reais' },
                  { title: 'Alertas Inteligentes', desc: 'Notificações quando identificamos economia' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white/40 backdrop-blur-xl border border-white/30 rounded-xl hover:bg-white/50 transition-all duration-300">
                    <Check className="w-6 h-6 text-[#51A471] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-700 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {[
                  { title: 'Pegada de Carbono', desc: 'Acompanhe seu impacto ambiental em tempo real' },
                  { title: 'Escolhas Conscientes', desc: 'Tome decisões de compra mais responsáveis' },
                  { title: 'Relatórios de Impacto', desc: 'Veja quantas árvores você está ajudando a salvar' },
                  { title: 'Contribuição Global', desc: 'Participe de um movimento sustentável' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white/40 backdrop-blur-xl border border-white/30 rounded-xl hover:bg-white/50 transition-all duration-300">
                    <Leaf className="w-6 h-6 text-[#79BA92] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-700 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {[
                  { title: 'Interface Intuitiva', desc: 'Use o Heny sem complicações' },
                  { title: 'Sync Automático', desc: 'Seus dados sempre atualizados' },
                  { title: 'Acesso em Qualquer Lugar', desc: 'Web e mobile, quando você precisar' },
                  { title: 'Suporte 24/7', desc: 'Nossa equipe sempre disponível para ajudar' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white/40 backdrop-blur-xl border border-white/30 rounded-xl hover:bg-white/50 transition-all duration-300">
                    <Check className="w-6 h-6 text-[#F3A302] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-700 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group"
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 rounded-3xl flex items-center justify-center">
              <div className="text-center p-8">
                {activeTab === 0 && <TrendingUp className="w-24 h-24 text-[#F3A302] mx-auto opacity-50" />}
                {activeTab === 1 && <Leaf className="w-24 h-24 text-[#51A471] mx-auto opacity-50" />}
                {activeTab === 2 && <Zap className="w-24 h-24 text-[#79BA92] mx-auto opacity-50" />}
                <p className="text-gray-700 font-semibold mt-4">Espaço para sua imagem</p>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F3A302] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
          </motion.div>
        </motion.div>
      </section>

      {/* SEÇÃO 4: ACCORDION DE RECURSOS */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
            Recursos <span className="text-[#51A471]">Avançados</span>
          </h2>
          <p className="text-xl text-white/90">Explore tudo o que o Heny oferece</p>
        </motion.div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              title: 'Banco de Dados de 500+ Eletrodomésticos',
              desc: 'Encontre quase qualquer aparelho e compare seu consumo real com precisão.'
            },
            {
              title: 'Cálculo de Tarifa em Tempo Real',
              desc: 'O sistema se adapta às tarifas da sua região e oferece projeções precisas.'
            },
            {
              title: 'Relatórios Detalhados e Personalizáveis',
              desc: 'Gere relatórios por período, aparelho ou categoria com visualizações claras.'
            },
            {
              title: 'Histórico e Tendências',
              desc: 'Acompanhe sua evolução e veja como suas mudanças impactam ao longo do tempo.'
            },
            {
              title: 'Recomendações Inteligentes',
              desc: 'Receba sugestões baseadas em seus padrões de uso e objetivos de economia.'
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setExpandedFeature(expandedFeature === idx ? null : idx)}
                className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 text-left hover:bg-white/70 transition-all duration-300 flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#51A471] transition-colors">{feature.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: expandedFeature === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#51A471] flex-shrink-0"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </button>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: expandedFeature === idx ? 1 : 0,
                  height: expandedFeature === idx ? 'auto' : 0,
                  marginTop: expandedFeature === idx ? 12 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white/40 backdrop-blur-xl border border-white/30 border-t-0 rounded-b-2xl p-6">
                  <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 5: DEPOIMENTOS / SOCIAL PROOF */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
            Quem Já Está <span className="text-[#51A471]">Economizando</span>
          </h2>
          <p className="text-xl text-white/90">Veja os resultados reais de nossos usuários</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Maria Silva',
              role: 'Dona de Casa',
              result: '28% de redução',
              comment: 'Nunca soube que era possível economizar tanto. Agora acompanho tudo mês a mês!'
            },
            {
              name: 'Carlos Oliveira',
              role: 'Pequeno Empresário',
              result: '34% de redução',
              comment: 'Implementei as recomendações do Heny e meus custos caíram significativamente.'
            },
            {
              name: 'Ana Costa',
              role: 'Engenheira Ambiental',
              result: '31% redução + impacto verde',
              comment: 'Finalmente consigo conectar economia com sustentabilidade de forma tangível.'
            }
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 hover:bg-white/70 transition-all duration-300"
            >
              <div className="mb-6">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#F3A302] to-[#51A471] bg-clip-text text-transparent">
                  {testimonial.result}
                </p>
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
              <div className="pt-6 border-t border-white/20">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F3A302] via-[#79BA92] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comece Sua Jornada Rumo à Economia e Sustentabilidade
            </h2>
            <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              Não espere mais. Descubra quanto você pode economizar a partir de hoje.
            </p>
            <button className="group/btn relative px-10 py-4 rounded-xl font-bold overflow-hidden text-lg inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F3A302] to-[#51A471] group-hover/btn:scale-110 transition-transform duration-300"></div>
              <span className="relative text-white flex items-center gap-2">
                Comece Agora
                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
            <p className="text-gray-700 text-sm mt-6"></p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}