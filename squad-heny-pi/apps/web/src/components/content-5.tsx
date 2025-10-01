import { Sparkles, Zap, Leaf, ClipboardMinus } from "lucide-react";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-4xl">
            O H[ENY] facilita a sua gestão energética por meio de comparações!
          </h2>
          <p>
            O Heny é uma plataforma web de administração da energia elétrica dos
            eletrodomésticos do usuário com ênfase na aplicabilidade e
            usabilidade do usuário que se beneficia de relatórios com
            informações úteis para um controle de seu gasto energético e
            manutenção de seus conjuntos de eletrodomésticos do local escolhido
            com fins sustentáveis, a plataforma também dá a seu usuário a
            realidade de seus impactos ambientais e faz o usuário passar por um
            processo de conscientização sobre seus eletrodomésticos e seus usos
            enquanto utiliza o relatório.
          </p>
        </div>
        <img
          className="rounded-(--radius)"
          src="/Comparacoes.gif"
          alt="team image"
          height=""
          width=""
          loading="lazy"
        />

        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <h3 className="text-sm font-medium">Economia</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Ajuda na economia de suas contas de luz.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClipboardMinus className="size-4" />
              <h3 className="text-sm font-medium">Gestão</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Gere varios relatórios e comparações, em diferentes datas.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className="size-4" />
              <h3 className="text-sm font-medium">Meio ambiente</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Apontamos os impactos ambientas e conscientizamos o uso dos seus
              eletrodomésticos.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />

              <h3 className="text-sm font-medium">Relatórios inovadores</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Sempre com um relatório para você.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
