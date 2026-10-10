import React, { useEffect, useRef } from "react";

/**
 * AmbientAromaCanvas (High Performance Edition)
 * Renders floating golden aroma motes, luminous scent orbs, and interconnected
 * fragrance filaments.
 * 
 * Performance Optimizations:
 * - IntersectionObserver: Automatically halts render loop when scrolled out of viewport (0% CPU/GPU overhead while browsing other sections).
 * - Cached BoundingRect: Eliminates layout reflows during mouse move.
 * - Squared distance computations: Bypasses expensive Math.sqrt for particle links.
 */
export function AmbientAromaCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isVisible = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let cachedRect = canvas.getBoundingClientRect();

    const updateDimensions = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      cachedRect = canvas.getBoundingClientRect();
    };

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    }, { passive: true });

    // Mouse coordinates with smooth lerping
    const mouse = { x: width / 2, y: height / 2, active: false, targetX: width / 2, targetY: height / 2 };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      mouse.targetX = e.clientX - cachedRect.left;
      mouse.targetY = e.clientY - cachedRect.top;
      mouse.active = true;
    };
    
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    // Optimized particle definition
    interface AromaParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      maxAlpha: number;
      pulseSpeed: number;
      sparklePhase: number;
      type: "spark" | "orb" | "stardust";
      hue: number;
    }

    const particleCount = 38; // Clean, high-framerate count
    const particles: AromaParticle[] = Array.from({ length: particleCount }).map((_, i) => {
      const isOrb = i % 4 === 0;
      const isSpark = i % 3 === 0;
      const baseRadius = isOrb
        ? Math.random() * 7 + 5 // 5 - 12px aroma orbs
        : isSpark
        ? Math.random() * 2.5 + 2 // 2 - 4.5px glowing gold sparks
        : Math.random() * 1.5 + 1; // 1 - 2.5px fine gold stardust

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.2, // Upward vapor draft
        radius: baseRadius,
        alpha: Math.random() * 0.35 + 0.3,
        maxAlpha: isSpark ? 0.85 : isOrb ? 0.4 : 0.6,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        sparklePhase: Math.random() * Math.PI * 2,
        type: isOrb ? "orb" : isSpark ? "spark" : "stardust",
        hue: Math.random() > 0.4 ? 43 : 38,
      };
    });

    let time = 0;

    const render = () => {
      if (!isVisible) return;
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // 1. Draw interconnected fragrance filament lines (Optimized with squared distance)
      const maxDistSq = 8100; // 90 * 90
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const ratio = 1 - distSq / maxDistSq;
            const lineAlpha = ratio * 0.2 * Math.min(pi.alpha, pj.alpha);
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(197, 160, 89, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 2. Render each aroma particle
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.sparklePhase) * 0.2;
        p.y += p.vy;

        p.sparklePhase += 0.03;
        const pulse = (Math.sin(p.sparklePhase) + 1) * 0.5;
        p.alpha = 0.25 + pulse * (p.maxAlpha - 0.25);

        // Mouse deflection
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400 && distSq > 0) { // 120 * 120
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 120) * 1.5;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        // Screen wrap
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        // Render particle graphic
        if (p.type === "orb") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
          grad.addColorStop(0, `hsla(${p.hue}, 60%, 75%, ${p.alpha * 0.55})`);
          grad.addColorStop(0.5, `hsla(${p.hue}, 70%, 55%, ${p.alpha * 0.2})`);
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "spark") {
          ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha + 0.3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.radius * 0.4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(197, 160, 89, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause loop entirely when not visible on screen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
