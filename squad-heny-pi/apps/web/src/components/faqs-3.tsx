"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQsThree() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "help-circle",
      question: "Por que o projeto se chama Heny?",
      answer:
        "Heny é um acrônimo que representa nossa missão: integrar **H**abits, **E**nergy, aNd **Y**our choices. O nome reflete nosso compromisso em conectar os hábitos diários das pessoas com o consumo de energia e as escolhas conscientes que impactam o meio ambiente.",
    },
    {
      id: "item-2",
      icon: "save",
      question: "Posso salvar ou exportar minhas comparações?",
      answer:
        "Sim! Na versão completa do Heny, você poderá salvar suas comparações favoritas em sua conta pessoal, organizá-las em pastas temáticas e exportar relatórios detalhados em formato PDF. Esses recursos estão planejados para a próxima fase do projeto.",
    },
    {
      id: "item-3",
      icon: "zap",
      question: "O Heny considera o impacto do uso diário?",
      answer:
        "Absolutamente! O Heny analisa não apenas o consumo teórico dos aparelhos, mas também considera padrões de uso realistas. Você pode informar quantas horas por dia utiliza cada eletrodoméstico, e nosso sistema recalcula automaticamente o impacto ambiental e os custos associados.",
    },
    {
      id: "item-4",
      icon: "leaf",
      question: "O Heny mostra qual produto é mais sustentável?",
      answer:
        "Sim! Comparamos não apenas consumo de energia, mas também durabilidade, eficiência, e impacto ambiental total. Nossa ferramenta fornece uma pontuação de sustentabilidade que considera múltiplos fatores, ajudando você a escolher a opção mais verde.",
    },
    {
      id: "item-5",
      icon: "bar-chart-2",
      question: "Como funcionam os relatórios do Heny?",
      answer:
        "Os relatórios do Heny consolidam suas comparações e análises em um documento visual e detalhado. Eles mostram gráficos de consumo, estimativas de impacto ambiental, economia potencial e recomendações personalizadas para otimizar seu consumo energético de forma sustentável.",
    },
    {
      id: "item-6",
      icon: "mail",
      question: "Ainda tenho dúvidas, como entro em contato?",
      answer:
        "Você pode entrar em contato conosco através do nosso email de suporte **suporteheny@gmail.com**, enviar um email para nossa equipe de suporte ou conectar-se conosco nas redes sociais. Estamos sempre disponíveis para esclarecer dúvidas e ouvir sugestões!",
    },
  ];

  return (
    <section className="bg-muted dark:bg-background py-50">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">Perguntas Frequêntes</h2>
              <p className="text-muted-foreground mt-4">
                Não encontrou o que procurava? Entre em contato conosco.{" "}
                <Link
                  href="#"
                  className="text-primary font-medium hover:underline"
                >
                  equipe de suporte ao cliente
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
