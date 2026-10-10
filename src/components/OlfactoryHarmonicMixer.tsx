import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  OlfactoryDropIcon, 
  FlaconIcon, 
  RoyalCrownIcon, 
  BotanicalSprigIcon 
} from "@/components/icons/LuxuryIcons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Magnetic } from "@/components/ui/Magnetic";
import { ShimmerBadge } from "@/components/ui/ShimmerBadge";

interface ChordSlider {
  id: string;
  name: string;
  family: string;
  note: string;
  value: number;
  color: string;
}

export function OlfactoryHarmonicMixer() {
  const [citrus, setCitrus] = useState(25);
  const [floral, setFloral] = useState(35);
  const [oud, setOud] = useState(40);

  // Compute dynamic liquid color and harmony title
  const dominantChord = 
    oud >= 45 ? "Deep Agarwood Majesty" :
    floral >= 40 ? "Romantic Damask Bloom" :
    citrus >= 40 ? "Solar Imperial Radiance" :
    "Harmonic Royal Blend";

  // Interpolated liquid color based on accord weights
  const liquidHue = 
    oud >= 40 ? "#C58F48" :
    floral >= 35 ? "#D48B97" :
    "#E2C878";

  return (
    <section className="py-28 bg-[#FAF8F5] border-y border-[#ECE5D8] relative overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ShimmerBadge variant="gold" icon={<OlfactoryDropIcon size={14} className="text-gold" />}>
            The Alchemist's Atelier
          </ShimmerBadge>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#181512] font-normal tracking-tight mt-3">
            Bespoke Accord Synthesizer
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Tune the olfactory proportions of your signature scent. Watch the extraction hue and sillage intensity dynamically harmonize before your eyes.
          </p>
        </div>

        {/* Interactive Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Dynamic Liquid Flacon Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <SpotlightCard
              spotlightColor="rgba(197, 160, 89, 0.16)"
              enableTilt={true}
              className="w-full max-w-[380px] p-6 rounded-3xl bg-white border border-[#E8E2D6] shadow-xl text-center relative overflow-hidden"
            >
              <BorderBeam size={220} duration={10} colorFrom={liquidHue} colorTo="#C5A059" />

              <span className="text-[10px] uppercase tracking-widest font-mono text-gold font-semibold block mb-2">
                Live Distillation Vessel
              </span>
              <h3 className="font-serif text-2xl text-[#181512] font-medium mb-6">
                {dominantChord}
              </h3>

              {/* Bespoke Interactive Glass Flacon Container with Dynamic Liquid Meniscus */}
              <div className="relative mx-auto w-40 h-64 border-2 border-[#181512]/30 rounded-t-xl rounded-b-3xl overflow-hidden bg-gradient-to-b from-white/80 to-[#FAF8F5] p-2 shadow-inner">
                {/* Crystal Stopper */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 border-b border-[#181512]/30 bg-white" />
                
                {/* Meniscus Liquid Layer with dynamic height & color */}
                <motion.div
                  animate={{
                    backgroundColor: liquidHue,
                    height: `${Math.min(88, 30 + (citrus + floral + oud) / 3)}%`,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-0 inset-x-0 rounded-b-2xl opacity-80"
                  style={{
                    boxShadow: `0 -6px 16px ${liquidHue}44 inset`,
                  }}
                >
                  {/* Subtle fluid shimmer line */}
                  <div className="w-full h-1 bg-white/40 blur-[1px]" />
                </motion.div>

                {/* Glass Facet Highlights */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-black/5 pointer-events-none" />
                <div className="absolute top-1/4 left-3 w-1 h-32 bg-white/60 rounded-full blur-[0.5px] pointer-events-none" />
              </div>

              {/* Live Formula Specs */}
              <div className="mt-6 pt-4 border-t border-[#F0EBE2] flex justify-between text-xs font-mono text-[#5C554B]">
                <span>Concentration: 32% Extrait</span>
                <span className="text-gold font-semibold">Grade A Reserve</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Right: Accord Sliders */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E2D6] shadow-md space-y-8">
              
              {/* Accord 1: Citrus & Pink Pepper */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E2C878]" />
                    <span className="text-sm font-serif font-medium text-[#181512]">Solar Citrus & Saffron (Top Chord)</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-gold">{citrus}% Intensity</span>
                </div>
                <input 
                  type="range" 
                  min={10} 
                  max={60} 
                  value={citrus} 
                  onChange={(e) => setCitrus(+e.target.value)}
                  className="w-full accent-gold cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground font-light block mt-1">
                  Sparkling Calabrian bergamot that provides instant royal radiance and projection.
                </span>
              </div>

              {/* Accord 2: Damask Rose & Orris */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D48B97]" />
                    <span className="text-sm font-serif font-medium text-[#181512]">Taif Damask Rose & Florentine Orris (Heart Chord)</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-gold">{floral}% Intensity</span>
                </div>
                <input 
                  type="range" 
                  min={10} 
                  max={60} 
                  value={floral} 
                  onChange={(e) => setFloral(+e.target.value)}
                  className="w-full accent-gold cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground font-light block mt-1">
                  Velvety floral heart delivering seductive French romanticism and emotional depth.
                </span>
              </div>

              {/* Accord 3: Cambodian Oud & Sandalwood */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C58F48]" />
                    <span className="text-sm font-serif font-medium text-[#181512]">Wild Agarwood & Mysore Sandalwood (Base Chord)</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-gold">{oud}% Intensity</span>
                </div>
                <input 
                  type="range" 
                  min={15} 
                  max={70} 
                  value={oud} 
                  onChange={(e) => setOud(+e.target.value)}
                  className="w-full accent-gold cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground font-light block mt-1">
                  Smoked balsamic woods anchoring the fragrance with 24-hour enduring sovereignty.
                </span>
              </div>

              {/* Formula Recommendation Result */}
              <div className="pt-6 border-t border-[#F0EBE2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground block">
                    Curated Recommendation:
                  </span>
                  <span className="font-serif text-lg text-[#181512] font-medium">
                    {oud >= 45 ? "Imperial Oud Extrait de Parfum" : floral >= 40 ? "Taif Rose Sublime" : "Royal Bergamot Imperial"}
                  </span>
                </div>

                <Magnetic strength={0.25}>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-[#181512] text-white px-7 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-all shadow-md"
                  >
                    <FlaconIcon size={14} />
                    Explore Matching Flacon
                  </Link>
                </Magnetic>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
