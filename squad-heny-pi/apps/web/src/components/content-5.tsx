'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, TrendingUp, Target, Zap, Leaf, AlertCircle, BarChart3, LineChart } from 'lucide-react';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden text-gray-900 bg-gradient-to-br from-white via-white to-gray-50">
      
      {/* Background com efeito sutil */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3A302]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#51A471]/5 rounded-full blur-3xl" />
      </div>

      {/* ========== DIVISOR SUPERIOR ========== */}
      <div className="relative z-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#F3A302]/40 to-transparent" />
        <div className="h-12 bg-gradient-to-b from-[#F3A302]/10 via-[#F3A302]/5 to-transparent" />
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
              <div className="inline-block bg-white/60 backdrop-blur-xl border border-white/80 rounded-full px-4 py-2 mb-6 shadow-lg">
                <span className="text-sm font-semibold text-[#51A471]">O Desafio</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 drop-shadow-sm leading-tight mb-6">
                Você Sabe Quanto Realmente Gasta com Energia?
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
                'Contas de energia chegam cada vez mais altas',
                'Dificuldade em identificar quais aparelhos consomem mais',
                'Falta de visibilidade sobre o impacto ambiental',
                'Sem ferramentas para comparar alternativas sustentáveis'
              ].map((problem, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <AlertCircle className="w-5 h-5 text-[#F3A302] flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{problem}</p>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-xl text-gray-700 italic border-l-4 border-[#F3A302] pl-6 bg-white/40 backdrop-blur-sm p-4 rounded-lg"
            >
              A maioria dos brasileiros gasta 30% a mais com energia do que o necessário, sem nem perceber.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group"
          >
            <div className="w-full h-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">
                <img
                  src="/Comparacoes.gif"
                  alt="Visualização de consumo energético"
                  className="w-600 h-600 object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="absolute -inset-1 bg-gradient-to-r from-[#51A471] to-[#F3A302] rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
          </motion.div>

        </div>
      </section>

      {/* ========== DIVISOR CENTRAL 1 ========== */}
      <div className="relative z-10 my-12">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#51A471]/40 to-transparent" />
        <div className="h-16 bg-gradient-to-b from-[#51A471]/10 via-transparent to-[#F3A302]/10" />
      </div>

      {/* SEÇÃO 2: COMO FUNCIONA */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 drop-shadow-sm mb-4">
            Como o <span className="text-[#51A471]">Heny</span> Funciona
          </h2>
          <p className="text-xl text-gray-700">Três passos simples para revolucionar sua gestão energética</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Cadastre Seus Aparelhos',
              description: 'Adicione todos os eletrodomésticos da sua casa. Nossa base de dados contém centenas de modelos com dados reais de consumo.',
              icon: <Zap className="w-8 h-8" />
            },
            {
              step: '02',
              title: 'Configure Sua Localização e Tarifa',
              description: 'Informe seu estado, cidade e a tarifa de energia da sua região. O Heny calcula automaticamente seus gastos em tempo real.',
              icon: <Target className="w-8 h-8" />
            },
            {
              step: '03',
              title: 'Filtros inteligentes',
              description: 'Obtenha relatórios inteligentes com filtros avançados que facilitam a visualização do consumo, permitindo comparar aparelhos e identificar padrões para otimizar sua economia de energia.',
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
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-8 h-full hover:bg-white/70 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#F3A302] to-[#79BA92] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
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

      {/* ========== DIVISOR CENTRAL 2 ========== */}
      <div className="relative z-10 my-12">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#F3A302]/40 to-transparent" />
        <div className="h-16 bg-gradient-to-b from-[#F3A302]/10 via-transparent to-[#51A471]/10" />
      </div>

      {/* SEÇÃO 3: RECURSOS COMPARATIVOS */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 drop-shadow-sm mb-4">
            Por Que Escolher o <span className="text-[#51A471]">Heny</span>
          </h2>
          <p className="text-xl text-gray-700">Recursos desenvolvidos para maximizar sua economia e sustentabilidade</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Economia', 'Praticidade'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-xl ${
                activeTab === idx
                  ? 'bg-gradient-to-r from-[#F3A302] to-[#79BA92] text-white shadow-lg border border-white/40'
                  : 'bg-white/40 border border-white/60 text-gray-800 hover:bg-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

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
                  { title: 'Redução de Até 30%', desc: 'Economize significativamente nas suas contas de energia' },
                  { title: 'Análises Comparativas', desc: 'Compare o consumo real e custo de cada aparelho' },
                  { title: 'Simulador Inteligente', desc: 'Projete economia ao trocar por equipamentos mais eficientes' },
                  { title: 'Relatórios Mensais', desc: 'Acompanhe seu progresso e histórico de economia' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl hover:bg-white/50 transition-all duration-300">
                    <Check className="w-6 h-6 text-[#F3A302] flex-shrink-0 mt-1" />
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
                  { title: 'Interface Intuitiva', desc: 'Sistema fácil de usar, sem necessidade de conhecimento técnico' },
                  { title: 'Sincronização Automática', desc: 'Seus dados sempre atualizados em tempo real' },
                  { title: 'Acesso Multiplataforma', desc: 'Use no computador, tablet ou smartphone quando quiser' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl hover:bg-white/50 transition-all duration-300">
                    <Check className="w-6 h-6 text-[#79BA92] flex-shrink-0 mt-1" />
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
            <div className="w-full h-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all">
              <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">

                {activeTab === 0 && (
                  <img
                    src="/analise.png"
                    alt="Análise de consumo"
                    className="w-90 h-90 object-contain"
                  />
                )}

                {activeTab === 1 && (
                  <img
                    src="/sustentavel.png"
                    alt="Sustentabilidade"
                    className="w-90 h-90 object-contain"
                  />
                )}

              </div>
            </div>

            <div className="absolute -inset-1 bg-gradient-to-r from-[#F3A302] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== DIVISOR CENTRAL 4 ========== */}
      <div className="relative z-10 my-12">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#F3A302]/40 to-transparent" />
        <div className="h-16 bg-gradient-to-b from-[#F3A302]/10 via-transparent to-[#51A471]/10" />
      </div>

      {/* CTA FINAL */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F3A302] via-[#79BA92] to-[#51A471] rounded-3xl blur opacity-0 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-16 text-center shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comece Sua Jornada Rumo à Energia Eficiente
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Produzir mais com menos. Economize pela ecologia. Descubra quanto você pode economizar hoje mesmo.
            </p>
            <button className="group/btn relative px-10 py-4 rounded-xl font-bold overflow-hidden text-lg inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F3A302] to-[#51A471] group-hover/btn:scale-110 transition-transform duration-300"></div>
              <span className="relative text-white flex items-center gap-2">
                Comece Sua Análise
                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ========== DIVISOR INFERIOR ========== */}
      <div className="relative z-10 mt-24">
        <div className="h-16 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
        <div className="h-1 bg-gradient-to-r from-transparent via-[#51A471]/40 to-transparent" />
      </div>
    </div>
  );
}