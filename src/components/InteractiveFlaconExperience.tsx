import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { OlfactoryDropIcon, FlaconIcon, RoyalCrownIcon, StarFacetIcon } from "@/components/icons/LuxuryIcons";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Magnetic } from "@/components/ui/Magnetic";
import { ShimmerBadge } from "@/components/ui/ShimmerBadge";

interface MasterpieceFlacon {
  id: string;
  name: string;
  tagline: string;
  concentration: string;
  sillageRadius: string;
  longevity: string;
  image: string;
  glowColor: string;
  notes: { name: string; tier: string }[];
}

const masterFlacons: MasterpieceFlacon[] = [
  {
    id: "oud",
    name: "Imperial Oud Sovereign",
    tagline: "Wild Agarwood & Taif Damask Rose",
    concentration: "Extrait 35%",
    sillageRadius: "3.5m Room-Filling Aura",
    longevity: "24h+ On Skin",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=900",
    glowColor: "#C5A059",
    notes: [
      { name: "Wild Agarwood", tier: "Base" },
      { name: "Taif Damask Rose", tier: "Heart" },
      { name: "Smoked Amber", tier: "Drydown" },
    ],
  },
  {
    id: "saffron",
    name: "Royal Saffron Attar",
    tagline: "Kashmiri Red Gold & Mysore Sandalwood",
    concentration: "Pure 100% Oil",
    sillageRadius: "3.0m Intimate Royalty",
    longevity: "36h+ Eternal Tenacity",
    image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&q=80&w=900",
    glowColor: "#D47C38",
    notes: [
      { name: "Kashmiri Saffron", tier: "Top" },
      { name: "Mysore Sandalwood", tier: "Heart" },
      { name: "Rare Deer Musk Accord", tier: "Base" },
    ],
  },
  {
    id: "soleil",
    name: "Soleil de Versailles",
    tagline: "Calabrian Bergamot & White Solar Amber",
    concentration: "Extrait 30%",
    sillageRadius: "2.8m Radiant Sillage",
    longevity: "16h+ Luminous Scent",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=900",
    glowColor: "#E2C878",
    notes: [
      { name: "Calabrian Bergamot", tier: "Top" },
      { name: "Bitter Orange Blossom", tier: "Heart" },
      { name: "Solar Ambergris", tier: "Base" },
    ],
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  duration: number;
}

export function InteractiveFlaconExperience() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);
  const [sprayCount, setSprayCount] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [illuminatedNote, setIlluminatedNote] = useState<number | null>(null);
  
  const currentFlacon = masterFlacons[selectedIdx];
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-advance flacon showcase every 5 seconds (pauses on user hover)
  useEffect(() => {
    if (isPaused || isSpraying) return;

    const timer = setInterval(() => {
      setDirection(1);
      setSelectedIdx((prev) => (prev + 1) % masterFlacons.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isSpraying, selectedIdx]);

  const selectFlacon = (idx: number) => {
    if (idx === selectedIdx) return;
    setDirection(idx > selectedIdx ? 1 : -1);
    setSelectedIdx(idx);
  };

  const nextFlacon = () => {
    setDirection(1);
    setSelectedIdx((prev) => (prev + 1) % masterFlacons.length);
  };

  const prevFlacon = () => {
    setDirection(-1);
    setSelectedIdx((prev) => (prev - 1 + masterFlacons.length) % masterFlacons.length);
  };

  // 3D Gyro Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 20, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-7, 7]);
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
  };

  // Trigger high-velocity golden mist atomizer
  const triggerAtomizer = () => {
    if (isSpraying) return;
    setIsSpraying(true);
    setSprayCount((c) => c + 1);

    // 38 golden vapor particles with randomized velocity & drag
    const newParticles: Particle[] = Array.from({ length: 38 }).map((_, i) => {
      const angle = (Math.PI / 180) * (270 + (Math.random() - 0.5) * 60); // upward fan angle
      const speed = Math.random() * 120 + 80;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        vx: (Math.random() - 0.5) * 50,
        vy: -Math.random() * 80 - 40,
        size: Math.random() * 3.5 + 1.5,
        alpha: Math.random() * 0.8 + 0.3,
        duration: Math.random() * 0.9 + 0.7,
      };
    });

    setParticles(newParticles);

    // Sequential olfactory note bloom illumination
    setTimeout(() => setIlluminatedNote(0), 150);
    setTimeout(() => setIlluminatedNote(1), 400);
    setTimeout(() => setIlluminatedNote(2), 700);

    setTimeout(() => {
      setIsSpraying(false);
      setTimeout(() => setIlluminatedNote(null), 1200);
    }, 900);
  };

  return (
    <div 
      className="relative w-full max-w-[460px] flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Flacon Selection Selector Pills with Live Progress Bar & Auto-Sync */}
      <div className="flex items-center justify-between w-full mb-3 px-1 mt-1">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/95 border border-[#EAE3D6] shadow-sm backdrop-blur-md">
          {masterFlacons.map((f, i) => {
            const isActive = selectedIdx === i;
            return (
              <button
                key={f.id}
                onClick={() => selectFlacon(i)}
                className={`relative px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "bg-[#181512] text-white shadow-sm font-semibold"
                    : "text-[#6E6659] hover:text-[#181512] hover:bg-black/5"
                }`}
              >
                {/* Active countdown progress bar */}
                {isActive && (
                  <motion.div
                    key={`progress-${selectedIdx}-${isPaused}`}
                    initial={{ width: "0%" }}
                    animate={{ width: isPaused ? undefined : "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-[2px] bg-gold pointer-events-none"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className={isActive ? "text-gold" : "opacity-60"}>0{i + 1}</span>
                  <span>{f.name.split(" ")[0]}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle Auto-Sillage / Pause Status Indicator */}
        <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#7E756B] bg-[#FAF7F0] border border-[#ECE5D8] px-2.5 py-1 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-gold ${!isPaused ? "animate-ping opacity-75" : "opacity-0"}`} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
          </span>
          <span className="uppercase">{isPaused ? "Paused" : "Auto"}</span>
        </div>
      </div>

      {/* Atmospheric Sillage Shockwaves (Radiates upon sampling or flacon change) */}
      <AnimatePresence>
        {isSpraying && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute -inset-10 rounded-full border border-gold/50 pointer-events-none z-0"
              style={{ borderColor: currentFlacon.glowColor }}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: 0.15, ease: "easeOut" }}
              className="absolute -inset-16 rounded-full border border-gold/30 pointer-events-none z-0"
              style={{ borderColor: currentFlacon.glowColor }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Perfume Flacon Assembly (Authentic Emerald-Cut Haute Parfumerie Silhouette) */}
      <div className="relative w-full max-w-[375px] sm:max-w-[390px] flex flex-col items-center select-none pt-2">
        
        {/* Ambient Volumetric Light Effect directly in the back of the perfume structure */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          {/* 1. Primary Core Ambient Halo (Dynamic Hue of Active Flacon) */}
          <motion.div
            key={`ambient-core-${currentFlacon.id}`}
            animate={{
              scale: isSpraying ? [1.05, 1.3, 1.15] : [1, 1.15, 1],
              opacity: isSpraying ? [0.85, 1, 0.9] : [0.65, 0.85, 0.65],
            }}
            transition={{
              duration: isSpraying ? 0.8 : 4.5,
              repeat: isSpraying ? 0 : Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-[440px] h-[520px] rounded-full blur-[75px]"
            style={{ backgroundColor: currentFlacon.glowColor }}
          />

          {/* 2. Soft Outer Ambient Dispersion Glow */}
          <motion.div
            key={`ambient-outer-${currentFlacon.id}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.65, 0.4],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-[560px] h-[640px] rounded-full blur-[110px]"
            style={{ backgroundColor: currentFlacon.glowColor }}
          />

          {/* 3. Golden Caustic Rim Light Ring behind bottle shoulders */}
          <div 
            className="absolute w-[360px] h-[460px] rounded-[50px] border border-gold/40 opacity-50 blur-[2px] animate-pulse"
            style={{ borderColor: currentFlacon.glowColor }}
          />
        </div>

        {/* Volumetric Atomizer Plume Emitter (Shoots straight from the elongated nozzle) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-50">
          <AnimatePresence>
            {isSpraying && (
              <div className="relative">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 0.95, scale: 0.6 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      opacity: 0,
                      scale: 2.6,
                    }}
                    transition={{ duration: p.duration, ease: "easeOut" }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: currentFlacon.glowColor,
                      boxShadow: `0 0 12px ${currentFlacon.glowColor}`,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 1. Flacon Stopper Cap & Elongated Atomizer Neck (Bouchon & Col Élancé with Matching White Border) */}
        <div className="relative z-40 flex flex-col items-center">
          {/* Faceted Emerald-Cut Obsidian Stopper Cap with Matching White Border */}
          <Magnetic strength={0.25}>
            <motion.button
              whileTap={{ y: 5, scale: 0.97 }}
              animate={{ y: isSpraying ? 5 : 0 }}
              onClick={triggerAtomizer}
              aria-label="Press cap to sample perfume mist"
              className="group relative cursor-pointer outline-none focus:outline-none"
            >
              {/* Outer White Border for Stopper Cap */}
              <div
                className="p-1 sm:p-1.5 bg-white border border-[#E8E1D4] shadow-md transition-all duration-300 group-hover:border-gold"
                style={{
                  clipPath: "polygon(10% 0%, 90% 0%, 100% 30%, 100% 70%, 90% 100%, 10% 100%, 0% 70%, 0% 30%)",
                }}
              >
                {/* Inner Octagonal Obsidian Block */}
                <div 
                  className="w-32 sm:w-36 h-9 sm:h-10 bg-gradient-to-b from-[#2E2721] via-[#1A1613] to-[#0A0807] border border-[#C5A059]/80 shadow-inner flex items-center justify-between px-3 relative overflow-hidden"
                  style={{
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 30%, 100% 70%, 90% 100%, 10% 100%, 0% 70%, 0% 30%)",
                  }}
                >
                  {/* Horizontal Specular Reflection Sheen */}
                  <div className="absolute top-0.5 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-[#FFF1C5] to-transparent opacity-85" />
                  
                  <div className="flex items-center gap-1.5 z-10">
                    <RoyalCrownIcon size={12} className="text-gold shrink-0 drop-shadow-sm" />
                    <span className="text-[9px] font-serif uppercase tracking-[0.26em] text-[#F3E7D0] font-medium">
                      Maison King
                    </span>
                  </div>

                  <OlfactoryDropIcon 
                    size={12} 
                    className={`text-gold/90 transition-transform duration-300 ${isSpraying ? "animate-spin" : "group-hover:scale-110"}`} 
                  />
                </div>
              </div>
            </motion.button>
          </Magnetic>

          {/* Elongated Slender Atomizer Gold Neck with Matching White Border */}
          <div className="px-1 sm:px-1.5 bg-white border-x border-[#E8E1D4] -mt-[1px] shadow-sm flex items-center justify-center">
            <div className="w-12 sm:w-14 h-7 sm:h-8 bg-gradient-to-r from-[#8C6826] via-[#FFF0C2] via-[#C5A059] to-[#8C6826] border-x border-[#6B4F1B] shadow-inner relative flex items-center justify-center">
              {/* Top knurled bevel ring */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-[#6B4F1B]/40" />
              
              {/* Vertical fluting ridges along the elongated neck stem */}
              <div className="absolute inset-y-1 left-2 w-[1px] bg-[#FFEBB8]/50" />
              <div className="absolute inset-y-1 right-2 w-[1px] bg-[#6B4F1B]/50" />

              {/* Prominent Golden Atomizer Spray Nozzle */}
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-[#2B231B] to-[#120F0D] border border-[#FFE29A] shadow-inner flex items-center justify-center">
                {/* Orifice aperture */}
                <div className={`w-1.5 h-1.5 rounded-full ${isSpraying ? "bg-white animate-ping" : "bg-[#C5A059]"}`} />
              </div>

              {/* Bottom neck transition ring */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#6B4F1B]/50" />
            </div>
          </div>
        </div>

        {/* 2. Main Perfume Bottle Body (Matching White Border Framing) */}
        <div 
          className="relative w-full -mt-[1px]"
          style={{
            filter: `drop-shadow(0 25px 45px rgba(24,21,18,0.18)) drop-shadow(0 0 32px ${currentFlacon.glowColor}99) drop-shadow(0 0 65px ${currentFlacon.glowColor}50)`,
          }}
        >
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            style={{
              perspective: 1100,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              clipPath: "polygon(34% 0%, 66% 0%, 83% 6%, 96% 15%, 99% 22%, 99% 92%, 93% 99.5%, 7% 99.5%, 1% 92%, 1% 22%, 4% 15%, 17% 6%)",
            }}
            className="relative w-full aspect-[4/5.2] bg-white p-1.5 sm:p-2 border border-[#E8E1D4] group z-10 transition-shadow duration-500 overflow-hidden"
          >
            {/* Continuous Liquid Gold Border Beam orbiting the bottle */}
            <BorderBeam size={280} duration={10} colorFrom={currentFlacon.glowColor} colorTo="#EAE3D6" />

            {/* Inner Crystal Chamber (Flush fit with sleek white border) */}
            <div 
              className="w-full h-full relative overflow-hidden bg-[#FAF7F0] flex flex-col justify-between"
              style={{
                clipPath: "polygon(34% 0%, 66% 0%, 83% 6%, 96% 15%, 99% 22%, 99% 92%, 93% 99.5%, 7% 99.5%, 1% 92%, 1% 22%, 4% 15%, 17% 6%)",
              }}
            >
              
              {/* Master Flacon Image with Cinematic Blur-to-Focus Depth Crossfade */}
              <div className="absolute inset-0 overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentFlacon.id}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        opacity: 0,
                        scale: 1.14,
                        filter: "blur(14px) brightness(1.15)",
                        x: dir > 0 ? 35 : -35,
                      }),
                      center: {
                        zIndex: 1,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px) brightness(1)",
                        x: 0,
                        transition: {
                          opacity: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                          scale: { duration: 1.25, ease: [0.16, 1, 0.3, 1] },
                          filter: { duration: 0.85, ease: "easeOut" },
                          x: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                        },
                      },
                      exit: (dir: number) => ({
                        zIndex: 0,
                        opacity: 0,
                        scale: 0.94,
                        filter: "blur(10px) brightness(0.9)",
                        x: dir > 0 ? -35 : 35,
                        transition: {
                          opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                          scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                          filter: { duration: 0.6, ease: "easeIn" },
                        },
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={currentFlacon.image}
                      alt={currentFlacon.name}
                      className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Glowing Perfume Extrait Liquid Meniscus Overlay */}
              <motion.div 
                key={`liquid-${currentFlacon.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 1 }}
                className="absolute inset-x-0 bottom-0 h-[75%] pointer-events-none z-10"
                style={{
                  background: `linear-gradient(to top, ${currentFlacon.glowColor}99 0%, ${currentFlacon.glowColor}40 60%, transparent 100%)`,
                }}
              />

              {/* Cut-Crystal Vertical Glass Reflection Walls (15mm Heavy Glass Simulation) */}
              <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white/80 via-white/40 to-transparent pointer-events-none z-20" />
              <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-white/70 to-transparent pointer-events-none z-20" />

              {/* Dynamic Specular Sunlight Glare across cut crystal glass */}
              <motion.div
                style={{
                  background: `radial-gradient(350px circle at ${glareX} ${glareY}, rgba(255,255,255,0.45), transparent 70%)`,
                }}
                className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Internal Radiance emanating through the perfume flacon crystal glass */}
              <motion.div 
                key={`internal-glow-${currentFlacon.id}`}
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 50% 55%, ${currentFlacon.glowColor}95 0%, ${currentFlacon.glowColor}30 55%, transparent 80%)`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

            

              {/* Perfume Bottle Front Plaque Label (Translucent Frosted Crystal Glass) */}
              <div className="absolute bottom-9 left-4 right-4 sm:bottom-10 sm:left-5 sm:right-5 bg-white/30 hover:bg-white/40 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.15)] z-20 transition-all duration-300">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFlacon.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-widest font-semibold font-mono" style={{ color: currentFlacon.glowColor }}>
                        Haute Parfumerie Masterpiece
                      </span>
                      <span className="text-[10px] font-mono bg-white/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/60 text-[#181512] font-medium shadow-xs">
                        {currentFlacon.concentration}
                      </span>
                    </div>
                    
                    <div className="font-serif text-xl font-medium text-[#181512] leading-tight mb-0.5 drop-shadow-xs">
                      {currentFlacon.name}
                    </div>
                    <p className="text-[11px] text-[#3D352B] font-normal mb-2 leading-relaxed">
                      {currentFlacon.tagline}
                    </p>

                    {/* Note Accords with Sequential Glow upon Spray */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/40">
                      {currentFlacon.notes.map((n, i) => (
                        <span
                          key={n.name}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5 transition-all duration-500 ${
                            illuminatedNote === i
                              ? "bg-gold text-white scale-105 shadow-md shadow-gold/40 border border-gold"
                              : "bg-white/60 backdrop-blur-md border border-white/60 text-[#241F18] shadow-xs"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${illuminatedNote === i ? "bg-white animate-ping" : "bg-gold"}`} />
                          <span className="font-medium">{n.name}</span>
                          <span className="text-[9px] opacity-70">({n.tier})</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Heavy Crystal Glass Pedestal Base (Culot de Flacon en Verre Épais Translucide) */}
              <div className="absolute bottom-0 inset-x-0 h-7 bg-white/45 backdrop-blur-md border-t border-white/50 flex items-center justify-between px-5 text-[8px] font-mono text-[#3D352B] tracking-[0.2em] uppercase z-20">
                <span className="flex items-center gap-1 font-semibold text-[#181512]">
                  <RoyalCrownIcon size={10} className="text-gold" />
                  <span>FLACON N°0{selectedIdx + 1}</span>
                </span>
                <span>100 ML • 3.4 FL. OZ.</span>
              </div>

            </div>
          </motion.div>
        </div>

      </div>

      {/* Live Sillage & Longevity Pulse Indicator */}
      <div className="mt-3.5 flex items-center justify-between w-full px-2 text-xs font-mono text-[#5C554B]">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
          </span>
          <span className="font-medium text-foreground text-[11px]">{currentFlacon.sillageRadius}</span>
        </span>
        <span className="text-gold font-semibold text-[11px]">{currentFlacon.longevity}</span>
      </div>

    </div>
  );
}
