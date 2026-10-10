import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RoyalCrownIcon, 
  FlaconIcon, 
  OlfactoryDropIcon, 
  BotanicalSprigIcon,
  StarFacetIcon 
} from "@/components/icons/LuxuryIcons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Magnetic } from "@/components/ui/Magnetic";
import { ShimmerBadge } from "@/components/ui/ShimmerBadge";

interface MoodProfile {
  id: string;
  title: string;
  tagline: string;
  accords: string[];
  intensity: number;
  sillage: string;
  sillageMeters: number; // Projection radius in meters
  longevityHours: string;
  bestFor: string;
  quote: string;
  filterParam: string;
  image: string;
  palette: {
    primary: string;
    glow: string;
    border: string;
  };
}

const moodProfiles: MoodProfile[] = [
  {
    id: "sovereign",
    title: "Imperial Sovereign",
    tagline: "Uncompromising Majesty & 15-Year Aged Oud",
    accords: ["Royal Cambodian Oud", "Smoked Amber", "Spiced Cardamom", "Russian Leather"],
    intensity: 5,
    sillage: "Monumental & Regal",
    sillageMeters: 3.5,
    longevityHours: "18 – 24+ Hours",
    bestFor: "Formal Galas, State Banquets & Decisive Gatherings",
    quote: "A commanding presence that crowns the room long before you arrive, and lingers long after you depart.",
    filterParam: "Eau de Parfum",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=900",
    palette: {
      primary: "#C5A059",
      glow: "rgba(197, 160, 89, 0.18)",
      border: "rgba(197, 160, 89, 0.4)",
    },
  },
  {
    id: "solar",
    title: "Solar Versailles",
    tagline: "Sunlit Neroli & Royal Calabrian Citrus",
    accords: ["Calabrian Bergamot", "Bitter Orange Blossom", "White Solar Amber", "Haitian Vetiver"],
    intensity: 3,
    sillage: "Radiant & Luminous",
    sillageMeters: 2.2,
    longevityHours: "10 – 14 Hours",
    bestFor: "Daylight Soirées, Mediterranean Escapes & Daily Distinction",
    quote: "Crisp as morning dew on royal gardens, radiant with golden optimism and effortless refinement.",
    filterParam: "Eau de Toilette",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=900",
    palette: {
      primary: "#D4AF37",
      glow: "rgba(212, 175, 55, 0.18)",
      border: "rgba(212, 175, 55, 0.4)",
    },
  },
  {
    id: "nocturne",
    title: "Velvet Nocturne",
    tagline: "Romantic Damask Rose & Sacred Frankincense",
    accords: ["Taif Damask Rose", "Florentine Orris", "Smoked Frankincense", "Bourbon Vanilla"],
    intensity: 4,
    sillage: "Hypnotic & Enveloping",
    sillageMeters: 2.8,
    longevityHours: "14 – 18 Hours",
    bestFor: "Intimate Dinners, Opera Nights & Velvet Soirées",
    quote: "Sensual, mysterious, and drenched in timeless Parisian romance. An invitation to whisper.",
    filterParam: "Eau de Parfum",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=900",
    palette: {
      primary: "#C4687A",
      glow: "rgba(196, 104, 122, 0.18)",
      border: "rgba(196, 104, 122, 0.4)",
    },
  },
  {
    id: "attar",
    title: "Pure Attar Heritage",
    tagline: "Ancient Hydro-Distillation & Mysore Sandalwood",
    accords: ["Mysore Sandalwood", "Kashmiri Saffron", "Deer Musk Accord", "Pure Dehn Al Oud"],
    intensity: 5,
    sillage: "Profound Skin-Resonance",
    sillageMeters: 3.0,
    longevityHours: "24 – 36+ Hours",
    bestFor: "Meditation, Connoisseur Gatherings & Heirloom Gifting",
    quote: "100% alcohol-free pure oil essence distilled drop by drop according to centuries of royal tradition.",
    filterParam: "Attar",
    image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&q=80&w=900",
    palette: {
      primary: "#C67C46",
      glow: "rgba(198, 124, 70, 0.18)",
      border: "rgba(198, 124, 70, 0.4)",
    },
  },
];

export function ScentMoodFinder() {
  const [activeMood, setActiveMood] = useState<MoodProfile>(moodProfiles[0]);

  return (
    <section className="py-28 bg-[#FFFFFF] relative overflow-hidden border-b border-[#ECE6DB]">
      
      {/* Dynamic Sillage Aura Glow synchronizing with perfume profile */}
      <motion.div 
        animate={{
          backgroundColor: activeMood.palette.glow,
        }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] blur-[150px] rounded-full pointer-events-none"
      />

      <div className="mx-auto max-w-[1320px] px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#ECE6DB] pb-8 gap-4">
          <div>
            <div className="mb-2">
              <ShimmerBadge variant="gold" icon={<RoyalCrownIcon size={14} className="text-gold" />}>
                The King's Consultation
              </ShimmerBadge>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground font-normal tracking-tight mt-2">
              Curate by Scent Persona
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-md">
            Discover the olfactory architecture that mirrors your character. Select a persona to explore its harmony.
          </p>
        </div>

        {/* Tab Buttons (Skiper UI Magnetic Physics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {moodProfiles.map((mood, idx) => {
            const isSelected = activeMood.id === mood.id;
            return (
              <Magnetic key={mood.id} strength={0.15}>
                <button
                  onClick={() => setActiveMood(mood)}
                  className={`w-full py-4 px-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between h-full ${
                    isSelected
                      ? "bg-[#FAF7F0] border-gold shadow-md shadow-gold/10 ring-1 ring-gold/40 scale-102"
                      : "bg-[#FCFBF8] border-[#EAE4D7] hover:border-gold/50 hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span className={`text-[10px] uppercase tracking-widest font-mono ${isSelected ? "text-gold font-bold" : "text-muted-foreground"}`}>
                    Profile 0{idx + 1}
                  </span>
                  <span className={`font-serif text-lg sm:text-xl mt-2 ${isSelected ? "text-foreground font-medium" : "text-foreground/80"}`}>
                    {mood.title}
                  </span>
                </button>
              </Magnetic>
            );
          })}
        </div>

        {/* Featured Persona Showcase (Fixed Robust Grid Layout & Synced Visuals) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMood.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <SpotlightCard 
              spotlightColor={activeMood.palette.glow}
              enableTilt={false}
              className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E8E2D6] relative overflow-hidden shadow-xl"
            >
              <BorderBeam size={340} duration={12} colorFrom={activeMood.palette.primary} colorTo="#FAF8F5" />

              {/* Direct Grid Container - Prevents Column Collapse */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
                
                {/* Left Column: Flacon Showcase Image (5 cols) */}
                <div className="lg:col-span-5 w-full">
                  <div className="relative w-full aspect-[4/5] sm:h-[480px] rounded-2xl overflow-hidden bg-white border border-[#EAE3D6] shadow-lg group">
                    <img
                      src={activeMood.image}
                      alt={activeMood.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Flacon Badges */}
                    <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-widest font-mono font-semibold" style={{ color: activeMood.palette.primary }}>
                          Master Composition
                        </span>
                        <span className="text-[10px] font-mono text-white/80 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {activeMood.longevityHours}
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl sm:text-3xl text-white font-medium">{activeMood.title}</h4>
                      <p className="text-xs text-white/80 font-light mt-1 italic">{activeMood.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Persona Specifications & Accords (7 cols) */}
                <div className="lg:col-span-7 w-full flex flex-col justify-between py-2">
                  <div>
                    {/* Editorial Quote */}
                    <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#181512] font-light leading-relaxed mb-6">
                      "{activeMood.quote}"
                    </blockquote>

                    {/* Accords Breakdown */}
                    <div className="mb-8">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold block mb-3 font-mono">
                        Signature Accords Harmony
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeMood.accords.map((accord, idx) => (
                          <Magnetic key={idx} strength={0.2}>
                            <span
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E5DFD4] text-xs font-medium text-foreground shadow-sm cursor-default hover:border-gold transition-colors"
                            >
                              <OlfactoryDropIcon size={13} className="text-gold" />
                              {accord}
                            </span>
                          </Magnetic>
                        ))}
                      </div>
                    </div>

                    {/* Sillage & Projection Chamber (Bespoke Olfactory Radar) */}
                    <div className="p-5 rounded-2xl bg-white border border-[#E8E2D6] mb-8 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeMood.palette.primary }} />
                          <span className="text-[11px] uppercase tracking-wider font-semibold font-mono text-foreground">
                            Sillage & Projection Chamber
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-gold">
                          Radius ~{activeMood.sillageMeters}m ({activeMood.sillage})
                        </span>
                      </div>

                      {/* Interactive Projection Aura Rings */}
                      <div className="h-2 w-full bg-[#FAF7F0] border border-[#EAE3D6] rounded-full overflow-hidden mb-3">
                        <motion.div 
                          key={activeMood.sillageMeters}
                          initial={{ width: 0 }}
                          animate={{ width: `${(activeMood.sillageMeters / 4) * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: activeMood.palette.primary }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-light text-muted-foreground pt-2 border-t border-[#F2ECE1]">
                        <div>
                          <span className="font-medium text-[#181512] font-mono text-[10px] uppercase block">Setting:</span>
                          <span>{activeMood.bestFor}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[#181512] font-mono text-[10px] uppercase block">Skin Tenacity:</span>
                          <span>{activeMood.longevityHours} on pulse points</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Magnetic strength={0.25}>
                      <Link
                        to="/shop"
                        search={{ category: activeMood.filterParam }}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#181512] text-white px-8 py-4 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-all shadow-lg shadow-black/10"
                      >
                        <FlaconIcon size={16} />
                        Explore {activeMood.title} Fragrances
                      </Link>
                    </Magnetic>

                    <span className="text-xs text-muted-foreground font-light">
                      ✦ Handcrafted small batch reserve
                    </span>
                  </div>
                </div>

              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
