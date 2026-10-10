import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OlfactoryDropIcon, BotanicalSprigIcon, FlaconIcon, StarFacetIcon } from "@/components/icons/LuxuryIcons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Magnetic } from "@/components/ui/Magnetic";
import { ShimmerBadge } from "@/components/ui/ShimmerBadge";

interface NoteItem {
  name: string;
  family: string;
  origin: string;
  evaporation: string;
  description: string;
  accent: string;
}

const pyramidData: {
  level: "top" | "heart" | "base";
  title: string;
  subtitle: string;
  duration: string;
  notes: NoteItem[];
}[] = [
  {
    level: "top",
    title: "Top Notes",
    subtitle: "The Opening Overture",
    duration: "15 – 30 Minutes",
    notes: [
      {
        name: "Calabrian Bergamot",
        family: "Solar Citrus",
        origin: "Calabria, Southern Italy",
        evaporation: "Flash evaporation",
        description: "Sparkling, sun-drenched zest that immediately awakens the senses with royal exuberance.",
        accent: "#E2C878",
      },
      {
        name: "Pink Pepper",
        family: "Spicy Aromatic",
        origin: "Réunion Island",
        evaporation: "Quick aromatic lift",
        description: "Rosy, tingling warmth that introduces refined vibrancy and intrigue.",
        accent: "#DF928A",
      },
      {
        name: "Saffron Filaments",
        family: "Exotic Spice",
        origin: "Kashmir Valley",
        evaporation: "Subtle top-to-heart bridge",
        description: "Known as Red Gold; imparts an intoxicating bittersweet regal leathery thread.",
        accent: "#C67C46",
      },
    ],
  },
  {
    level: "heart",
    title: "Heart Notes",
    subtitle: "The Olfactory Soul",
    duration: "2 – 5 Hours",
    notes: [
      {
        name: "Taif Damask Rose",
        family: "Imperial Floral",
        origin: "Taif Highlands, Arabia",
        evaporation: "Medium sustained release",
        description: "Hand-picked at dawn; 30,000 petals distilled into each precious millilitre of pure essence.",
        accent: "#D67A8C",
      },
      {
        name: "Florentine Orris Root",
        family: "Noble Powdery",
        origin: "Tuscany, Italy",
        evaporation: "Velvety core resonance",
        description: "Aged for five years in terracotta vaults to yield an exquisite buttery, aristocratic sillage.",
        accent: "#B8A2CD",
      },
      {
        name: "Smoked Frankincense",
        family: "Sacred Resin",
        origin: "Dhofar, Oman",
        evaporation: "Spiritual resinous bloom",
        description: "Silvery tears of ancient Boswellia trees that weave mystical, ceremonial depth.",
        accent: "#D3BE9C",
      },
    ],
  },
  {
    level: "base",
    title: "Base Notes",
    subtitle: "The Sovereign Legacy",
    duration: "8 – 24+ Hours",
    notes: [
      {
        name: "Royal Cambodian Oud",
        family: "Precious Woody",
        origin: "Koh Kong, Cambodia",
        evaporation: "Profound long-lasting tenacity",
        description: "Wild-harvested agarwood resin, aged 15 years for intoxicating balsamic and smoked wood majesty.",
        accent: "#8B5A3E",
      },
      {
        name: "Mysore Sandalwood",
        family: "Creamy Wood",
        origin: "Karnataka, India",
        evaporation: "Eternal skin-scent lingering",
        description: "The gold standard of perfumery; creamy, sacred, and deeply comforting sacred amber woods.",
        accent: "#C5A059",
      },
      {
        name: "Warm Ambergris & Bourbon Vanilla",
        family: "Solar Oriental",
        origin: "Madagascar & Atlantic Shore",
        evaporation: "Hypnotic magnetic drydown",
        description: "Sun-cured amber crystals married with smoky gourmet vanilla pods for unforgettable allure.",
        accent: "#B8833E",
      },
    ],
  },
];

export function OlfactoryPyramid() {
  const [activeTier, setActiveTier] = useState<"top" | "heart" | "base">("heart");
  const [selectedNote, setSelectedNote] = useState<NoteItem>(pyramidData[1].notes[0]);

  return (
    <section className="relative py-28 bg-[#FAF8F5] border-y border-[#EAE3D6] overflow-hidden">
      {/* Background delicate watermark pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#181512 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ShimmerBadge variant="gold" icon={<OlfactoryDropIcon size={14} className="text-gold" />}>
            The Science of Sillage
          </ShimmerBadge>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground font-normal tracking-tight mt-3">
            The Olfactory Architecture
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            A master fragrance unfolds like a classical symphony in three distinct movements. Explore each chord distilled by our master perfumers.
          </p>
        </div>

        {/* Pyramid Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: The Architectural Pyramid Tiers */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {pyramidData.map((tier) => {
              const isActive = activeTier === tier.level;
              return (
                <SpotlightCard
                  key={tier.level}
                  spotlightColor="rgba(197, 160, 89, 0.15)"
                  enableTilt={false}
                  onClick={() => {
                    setActiveTier(tier.level);
                    setSelectedNote(tier.notes[0]);
                  }}
                  className={`group relative p-6 rounded-2xl cursor-pointer border transition-all duration-500 ${
                    isActive
                      ? "bg-white border-gold shadow-xl shadow-gold/10 ring-1 ring-gold/30"
                      : "bg-white/70 border-border/70 hover:bg-white hover:border-gold/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase tracking-widest font-semibold font-mono ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                          {tier.subtitle}
                        </span>
                        <span className="text-border">•</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{tier.duration}</span>
                      </div>
                      <h3 className={`font-serif text-2xl transition-colors ${isActive ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-gold"}`}>
                        {tier.title}
                      </h3>
                    </div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? "bg-gold text-white shadow-md shadow-gold/30" : "bg-muted/60 text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold"
                    }`}>
                      {tier.level === "top" && <StarFacetIcon size={18} />}
                      {tier.level === "heart" && <BotanicalSprigIcon size={18} />}
                      {tier.level === "base" && <FlaconIcon size={18} />}
                    </div>
                  </div>

                  {/* Notes Pills preview inside card with Magnetic physics */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tier.notes.map((n) => (
                      <Magnetic key={n.name} strength={0.2}>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTier(tier.level);
                            setSelectedNote(n);
                          }}
                          className={`inline-block text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                            selectedNote.name === n.name && isActive
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-[#FAF7F0] text-foreground/80 border-border/60 hover:border-gold/60"
                          }`}
                        >
                          {n.name}
                        </span>
                      </Magnetic>
                    ))}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Right: The Sensory Note Laboratory Card with BorderBeam & Spotlight */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNote.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <SpotlightCard 
                  spotlightColor="rgba(197, 160, 89, 0.18)"
                  enableTilt={true}
                  className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D6] shadow-2xl relative overflow-hidden"
                >
                  <BorderBeam size={240} duration={12} colorFrom={selectedNote.accent} colorTo="#C5A059" />

                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-3.5 h-3.5 rounded-full ring-4 ring-gold/20"
                        style={{ backgroundColor: selectedNote.accent }}
                      />
                      <span className="text-xs uppercase tracking-widest text-gold font-semibold font-mono">
                        {selectedNote.family}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-muted-foreground bg-[#FAF7F0] border border-[#EAE3D6] px-3 py-1 rounded-full">
                      Provenance: {selectedNote.origin}
                    </span>
                  </div>

                  <div className="mt-8">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-1 font-mono">
                      Featured Master Accord
                    </span>
                    <h4 className="font-serif text-3xl sm:text-4xl text-foreground font-medium mb-4">
                      {selectedNote.name}
                    </h4>
                    <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
                      {selectedNote.description}
                    </p>
                  </div>

                  {/* Technical specs of the essence */}
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border/60 bg-[#FCFBF8] -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 rounded-b-3xl">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block font-mono">Evaporation Curve</span>
                      <span className="text-sm font-medium text-foreground mt-0.5 block">{selectedNote.evaporation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block font-mono">Extraction Method</span>
                      <span className="text-sm font-medium text-foreground mt-0.5 block">Hydro-Distillation & Enfleurage</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block font-mono">Perfumer's Balance</span>
                      <span className="text-sm font-medium text-gold font-serif mt-0.5 block">Grade A Royal Reserve</span>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
