import { useMemo, useRef, useEffect } from "react";
import gsap from "gsap";

export function HeroVideoBackground({
  videoSrc,
  posterSrc,
  parallax = 0,
}: {
  videoSrc?: string;
  posterSrc?: string;
  parallax?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sparkles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        top: Math.round(Math.random() * 100),
        left: Math.round(Math.random() * 100),
        size: 1 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
        gold: i % 3 !== 0,
      })),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mouse Parallax effect
      const moveHandler = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to(".parallax-layer-1", {
          x: x * -1,
          y: y * -1,
          ease: "power2.out",
          duration: 1
        });
        
        gsap.to(".parallax-layer-2", {
          x: x * 1.5,
          y: y * 1.5,
          ease: "power2.out",
          duration: 1.5
        });
      };
      
      window.addEventListener("mousemove", moveHandler);
      
      // Floating blobs animation
      gsap.to(".aurora-blob", {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        scale: "random(0.9, 1.1)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 1,
          from: "random"
        }
      });
      
      // Image reveal
      gsap.from(".hero-media", {
        scale: 1.1,
        opacity: 0,
        duration: 2,
        ease: "power3.out"
      });

      return () => {
        window.removeEventListener("mousemove", moveHandler);
      };
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {/* Optional video layer — supply your own file via videoSrc */}
      {videoSrc && (
        <video
          className="hero-media parallax-layer-1 h-full w-full object-cover opacity-70"
          style={{ transform: `translateY(${parallax}px) scale(1.05)` }}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      {!videoSrc && posterSrc && (
        <img
          src={posterSrc}
          alt=""
          className="hero-media parallax-layer-1 h-full w-full object-cover opacity-60"
          style={{ transform: `translateY(${parallax}px) scale(1.05)` }}
        />
      )}

      {/* Aurora glow blobs — gold + emerald, drifting slowly */}
      <div className="parallax-layer-2 absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
        <div className="aurora-blob absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gold/20 blur-[80px]" />
        <div className="aurora-blob absolute top-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-burgundy/25 blur-[100px]" />
        <div className="aurora-blob absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-gold/15 blur-[90px]" />
      </div>

      {/* Twinkling gold/emerald particles */}
      <div className="parallax-layer-1 absolute inset-0 pointer-events-none z-10">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] ${s.gold ? "bg-gold/80" : "bg-white/60"}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.duration}s ease-in-out infinite alternate ${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* CSS for twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Vignette + base tint so foreground text stays legible */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/80" />
    </div>
  );
}
