import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { 
  RoyalCrownIcon, 
  FlaconIcon, 
  BotanicalSprigIcon, 
  ShieldHeritageIcon, 
  CompassRoseIcon, 
  StarFacetIcon 
} from "@/components/icons/LuxuryIcons";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Atelier & Heritage — King Perfumes Haute Parfumerie" },
      { name: "description", content: "Discover the story, philosophy, and artisanal distillation behind King Perfumes." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="text-foreground selection:bg-gold selection:text-white pb-24 bg-[#FCFBF7]">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] w-full flex items-center justify-center overflow-hidden pt-36 pb-20 border-b border-[#ECE6DB]">
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1600" 
            alt="Perfume Distillation Flacons" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF7] via-transparent to-[#FCFBF7]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <Reveal variant="fadeUp">
            <div className="inline-flex items-center gap-2 mb-4">
              <RoyalCrownIcon size={18} className="text-gold" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold font-mono">
                The Maison's Chronicle
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-[#181512] font-normal tracking-tight">
              The Architecture of Majesty
            </h1>
            <p className="mt-6 text-base md:text-lg text-[#5C554B] font-light leading-relaxed">
              Founded on the belief that a royal scent is an invisible crown—an indelible personal aura that lingers in the memories of those who cross your path.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Reveal variant="fadeUp">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold font-mono block mb-3">
            Our Guiding Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#181512] mb-8 font-normal">
            Bridging Ancient Oriental Distillations with Occidental Elegance
          </h2>
          <p className="text-[#5C554B] text-base sm:text-lg leading-relaxed font-light">
            King Perfumes was born from an unwavering obsession: to restore absolute uncompromising luxury to personal fragrance. We eschew modern synthetic shortcuts in favor of long-macerated botanicals, wild-harvested Cambodian agarwood, and the dawn-picked roses of Taif. Collaborating with artisanal noses across Grasse, France and traditional attar masters in Kannauj and Dubai, we craft olfactory heirlooms designed to last lifetimes.
          </p>
        </Reveal>
      </section>

      {/* Pillar Grid */}
      <section className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              icon: BotanicalSprigIcon, 
              title: "Rare Botanicals", 
              text: "Hand-picked petals, aged sandalwood resins, and organic cold-pressed citrus essences sourced directly from certified orchards." 
            },
            { 
              icon: ShieldHeritageIcon, 
              title: "100% Extrait & Purity", 
              text: "Concentrations up to 35% extrait de parfum and pure alcohol-free attars that deliver unprecedented sillage." 
            },
            { 
              icon: CompassRoseIcon, 
              title: "Intercontinental Heritage", 
              text: "The smoky balsamic mysticism of the Arabian Peninsula harmonized with the delicate, sparkling structure of French perfumery." 
            },
            { 
              icon: FlaconIcon, 
              title: "Artisanal Decanting", 
              text: "Each flacon is hand-inspected, serialized, and encased in custom velvet presentation boxes with wax-sealed certificates." 
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} variant="fadeUp">
              <div className="group h-full p-8 rounded-2xl bg-white border border-[#EAE3D6] transition-all duration-300 hover:border-gold hover:shadow-xl hover:shadow-gold/10">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F0] border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-white transition-colors shadow-sm">
                  <item.icon size={22} />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#181512] mb-3">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder Atelier Section */}
      <section className="max-w-[1320px] mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 bg-white rounded-3xl p-8 sm:p-14 border border-[#EAE3D6] shadow-sm">
          <Reveal variant="fadeRight" className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-[#EAE3D6] shadow-md group">
              <img 
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=900" 
                alt="King Perfumes Master Nose" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </Reveal>
          <Reveal variant="fadeLeft" className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 mb-3">
              <StarFacetIcon size={16} filled className="text-gold" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono font-semibold">The Founder's Epilogue</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#181512] font-normal mb-6">
              "We Do Not Create Scents; We Preserve Memories."
            </h2>
            <blockquote className="text-base text-[#5C554B] leading-relaxed italic border-l-2 border-gold pl-6 mb-8 font-serif text-xl">
              "Every drop in our collection began as an emotional search. How does one bottle the sensation of midnight rain over Kashmiri saffron? How does one capture the solemn dignity of wild agarwood aging quietly in Cambodian temple groves? That is our daily quest."
            </blockquote>
            <div>
              <p className="text-sm uppercase tracking-widest font-semibold text-[#181512] font-mono">The Master Perfumer</p>
              <p className="text-xs text-gold uppercase tracking-wider font-mono mt-0.5">King Perfumes Atelier</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}