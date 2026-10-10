import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { OlfactoryPyramid } from "@/components/OlfactoryPyramid";
import { ScentMoodFinder } from "@/components/ScentMoodFinder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OlfactoryHarmonicMixer } from "@/components/OlfactoryHarmonicMixer";
import { AmbientAromaCanvas } from "@/components/AmbientAromaCanvas";
import { 
  RoyalCrownIcon, 
  FlaconIcon, 
  BotanicalSprigIcon,
  ShieldHeritageIcon,
  CompassRoseIcon,
  VelvetCourierIcon,
  StarFacetIcon 
} from "@/components/icons/LuxuryIcons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { KineticText } from "@/components/ui/KineticText";
import { Magnetic } from "@/components/ui/Magnetic";
import { ShimmerBadge } from "@/components/ui/ShimmerBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "King Perfumes — Haute Parfumerie & Luxury Attars" },
      { name: "description", content: "Discover India's premier collection of royal perfumes, rare attars, and pure fragrant extraits." },
    ],
  }),
  component: Home,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

function Home() {
  const { products, categories, refreshCategories } = useStore();
  const { scrollY } = useScroll();

  useEffect(() => { refreshCategories(); }, []);

  const active = products.filter((p) => p.status === "active");
  const [tab, setTab] = useState<"Best Seller" | "New" | "Featured">("Best Seller");
  const filtered = useMemo(() => active.filter((p) => p.badge === tab).slice(0, 8), [active, tab]);

  const displayCategories = useMemo(() => {
    if (categories.length === 0) {
      return [
        { name: "Eau de Parfum", text: "Rich 30% extrait concentration for all-day royal presence", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800", count: "12+" },
        { name: "Royal Attars & Oils", text: "100% pure alcohol-free concentrated oil essences", img: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&q=80&w=800", count: "8+" },
        { name: "Eau de Toilette", text: "Luminous, refreshing daytime accords for understated elegance", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800", count: "6+" },
        { name: "Private Reserve", text: "Aged agarwood, deer musk accords & rare limited editions", img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=800", count: "4+" },
      ];
    }
    return categories.map((c) => {
      const count = products.filter((p) => p.category === c.name).length;
      return {
        name: c.name,
        text: c.description || `Explore our ${c.name} collection`,
        img: c.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
        count: `${count}+`,
      };
    });
  }, [categories, products]);

  return (
    <div className="text-foreground selection:bg-gold selection:text-white relative bg-[#FCFBF7]">
      
      {/* 1. HAUTE PARFUMERIE HERO SECTION (Full Slider) */}
      <section className="relative h-[85vh] lg:h-[88vh] w-full flex items-center overflow-hidden border-b border-[#ECE5D8]">
        
        {/* Ambient Effects Over the Slider */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <AmbientAromaCanvas className="opacity-70" />
        </div>

        <Carousel className="w-full h-full absolute inset-0" opts={{ loop: true }}>
          <CarouselContent className="h-full ml-0">
            {[
              "/hero-perfume-1.jpg",
              "/hero-perfume-2.jpg",
              "/hero-perfume-3.jpg"
            ].map((imgSrc, idx) => (
              <CarouselItem key={idx} className="relative w-full h-full pl-0 basis-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img src={imgSrc} alt="Hero Background" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#181512]/90 via-[#181512]/50 to-transparent" />
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center max-w-[1320px] mx-auto px-6 md:px-12 pt-20 sm:pt-24">
                  <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer}
                    className="max-w-2xl"
                  >
                    <motion.div variants={fadeUp} className="mb-4 sm:mb-5 flex flex-wrap items-center gap-3">
                      <ShimmerBadge variant="gold" icon={<RoyalCrownIcon size={14} className="text-gold" />}>
                        Maison King Perfumes — Royal Reserves
                      </ShimmerBadge>
                    </motion.div>

                    <motion.h1 
                      variants={fadeUp}
                      className="text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.05] font-serif font-normal tracking-tight text-white mb-5"
                    >
                      <KineticText delay={0.1} stagger={0.06}>The Architecture</KineticText> <br />
                      <span className="italic font-normal text-gold">
                        <KineticText delay={0.3} stagger={0.06}>of Rare Scent.</KineticText>
                      </span>
                    </motion.h1>

                    <motion.p 
                      variants={fadeUp} 
                      className="text-sm sm:text-base font-light text-white/80 mb-7 max-w-xl leading-relaxed"
                    >
                      Distilled with ancient reverence from the rose fields of Taif, the sacred sandalwood groves of Mysore, and Cambodian wild agarwood. Bespoke perfumes and attars created for the discerning.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                      <Magnetic strength={0.25}>
                        <Link 
                          to="/shop" 
                          className="group relative inline-flex items-center gap-2.5 bg-gold text-[#181512] px-7 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all hover:bg-white shadow-xl"
                        >
                          <FlaconIcon size={16} />
                          <span>Explore Crown Jewels</span>
                        </Link>
                      </Magnetic>

                      <Magnetic strength={0.25}>
                        <Link 
                          to="/about" 
                          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-white hover:border-gold hover:bg-white/10 transition-all shadow-sm"
                        >
                          <span>Our Heritage</span>
                        </Link>
                      </Magnetic>
                    </motion.div>

                    {/* Interactive Scent Chord Badges */}
                    <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
                      {[
                        { name: "Taif Damask Rose", note: "Floral" },
                        { name: "Cambodian Oud", note: "Woody" },
                        { name: "Mysore Sandalwood", note: "Creamy" },
                        { name: "Kashmiri Saffron", note: "Spicy" },
                      ].map((c) => (
                        <span key={c.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/20 text-[11px] font-mono text-white/90 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                          {c.name}
                        </span>
                      ))}
                    </motion.div>

                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute z-30 bottom-12 right-6 sm:right-12 flex items-center gap-4">
            <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0 h-12 w-12 bg-black/30 border border-white/20 text-white hover:bg-gold hover:border-gold hover:text-[#181512] backdrop-blur-sm transition-all" />
            <CarouselNext className="relative right-0 top-0 translate-x-0 translate-y-0 h-12 w-12 bg-black/30 border border-white/20 text-white hover:bg-gold hover:border-gold hover:text-[#181512] backdrop-blur-sm transition-all" />
          </div>
        </Carousel>
      </section>


      {/* 3. SCENT PERSONA CONSULTATION WITH SILLAGE CHAMBER (Fixed & Synchronized) */}
      <ScentMoodFinder />

      {/* 4. BESPOKE OLFACTORY ACCORD HARMONIC SYNTHESIZER (Unprecedented Scent Chemistry Lab) */}
      <OlfactoryHarmonicMixer />

      {/* 5. CURATED COLLECTIONS MARQUEE */}
      <section className="py-28 bg-[#FAF8F5] border-y border-[#ECE5D8] overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold font-mono block mb-2">
              Olfactory Universes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
              Curated Fragrance Houses
            </h2>
          </div>
          <Magnetic strength={0.2}>
            <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold text-gold hover:text-foreground transition-colors">
              Explore All Collections →
            </Link>
          </Magnetic>
        </div>

        <div className="w-full relative flex marquee-viewport">
          <div className="marquee-track flex gap-6 pr-6 hover:[animation-play-state:paused]">
            {displayCategories.concat(displayCategories).map((c, i) => (
              <Link 
                to="/shop" 
                key={`${c.name}-${i}`}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#E8E2D6] cursor-pointer shrink-0 w-[290px] h-[390px] sm:w-[350px] sm:h-[470px] shadow-md transition-all hover:border-gold hover:shadow-2xl"
              >
                <img 
                  src={c.img} 
                  alt={c.name} 
                  className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-108" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <span className="text-[10px] uppercase tracking-widest text-gold/90 font-mono font-semibold">
                    {c.count} Fragrances
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl mb-1 mt-0.5">{c.name}</h3>
                  <p className="text-xs text-white/80 font-light line-clamp-2 mb-3">{c.text}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gold font-medium uppercase tracking-wider">
                    View House <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CROWN JEWELS (BESTSELLERS, NEW, FEATURED) */}
      <section className="py-28 bg-[#FFFFFF]">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold font-mono block mb-2">
              ✦ Signature Flacons
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground font-normal tracking-tight">
              Crown Jewels
            </h2>
            <p className="mt-3 text-sm text-muted-foreground font-light">
              Our most celebrated fragrant distillations, revered across royal courts and connoisseur collections.
            </p>
          </div>

          {/* Filter Pills with Magnetic Hover */}
          <div className="flex justify-center gap-3 mb-14">
            {(["Best Seller", "New", "Featured"] as const).map((t) => (
              <Magnetic key={t} strength={0.2}>
                <button 
                  onClick={() => setTab(t)}
                  className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                    tab === t 
                      ? "bg-[#181512] text-white shadow-lg shadow-black/10 scale-102" 
                      : "bg-[#FAF7F0] border border-[#EAE3D6] text-muted-foreground hover:border-gold hover:text-foreground"
                  }`}
                >
                  {t === "New" ? "New Arrivals" : t === "Best Seller" ? "Best Sellers" : "Featured Reserves"}
                </button>
              </Magnetic>
            ))}
          </div>

          {/* Products Grid with 3D Tilt SpotlightCards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Magnetic strength={0.25}>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 rounded-full border border-[#D5CDC0] bg-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-foreground hover:bg-[#181512] hover:text-white hover:border-[#181512] transition-all shadow-sm"
              >
                Browse Complete Vault <span>→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* 7. OLFACTORY PYRAMID & NOTES ACCORD EXPLORER */}
      <OlfactoryPyramid />

      {/* 8. FOUNDER & ATELIER HERITAGE SECTION */}
      <section className="py-28 max-w-[1320px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden aspect-[4/5] relative border border-[#E8E1D4] shadow-xl group">
            <BorderBeam size={240} duration={14} colorFrom="#C5A059" colorTo="#EFE9DE" />
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=900" 
              alt="Maison King Perfumes Atelier" 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Floating Atelier Hallmark */}
          <SpotlightCard 
            spotlightColor="rgba(197, 160, 89, 0.2)"
            enableTilt={false}
            className="absolute -bottom-6 -right-6 bg-white border border-[#E8E1D4] p-5 rounded-2xl shadow-xl hidden sm:block max-w-[200px]"
          >
            <RoyalCrownIcon size={24} className="text-gold mb-2" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground block">Atelier Heritage</span>
            <span className="font-serif text-sm text-[#181512] font-medium block mt-0.5">Rajkot Flagship & Grasse Distillers</span>
          </SpotlightCard>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <RoyalCrownIcon size={16} className="text-gold" />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gold font-mono">
              The Maison's Creed
            </span>
          </div>

          <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#181512] font-normal mb-8">
            "A royal fragrance is invisible jewellery. It crowns your spirit, commanding honor before a single word is spoken."
          </blockquote>

          <p className="text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
            King Perfumes was established with a singular devotion: to resurrect the unhurried splendour of royal perfumery. We eschew modern shortcuts, preserving the ancient maceration times, the hand-pressing of flower petals, and the pure aging of Cambodian agarwood.
          </p>

          <div className="flex items-center gap-6">
            <div>
              <span className="font-serif text-xl text-[#181512] font-medium block">The King Perfumes Atelier</span>
              <span className="text-xs text-gold uppercase tracking-widest font-mono font-medium">Bespoke Royal Perfumers</span>
            </div>
            <div className="h-8 w-px bg-[#E8E1D4]" />
            <Magnetic strength={0.2}>
              <Link 
                to="/about" 
                className="text-xs uppercase tracking-widest font-semibold text-foreground hover:text-gold transition-colors inline-block"
              >
                Read Atelier Story →
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* 9. ROYAL SEAL & AUTHENTICITY BANNER */}
      <section className="relative py-20 bg-[#FAF7F0] border-t border-[#ECE5D8]">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <Magnetic strength={0.3}>
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white border border-gold/30 text-gold mb-6 shadow-sm">
              <RoyalCrownIcon size={24} />
            </div>
          </Magnetic>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#181512] font-normal mb-4">
            The Seal of Certified Authenticity
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-xl mx-auto mb-8">
            Every flacon is sealed with a holographic security crest and arrives with three complimentary discovery samples to explore prior to opening your master bottle.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-widest text-[#6B6154] font-medium font-mono">
            <span className="flex items-center gap-2">✦ 100% Guaranteed Original</span>
            <span className="flex items-center gap-2">✦ Artisanal Hydro-Distilled</span>
            <span className="flex items-center gap-2">✦ Direct Flagship Dispatch</span>
          </div>
        </div>
      </section>

    </div>
  );
}