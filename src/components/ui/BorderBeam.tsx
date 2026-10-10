import React from "react";
import { motion } from "framer-motion";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

/**
 * BorderBeam (Vengeance UI & Skiper UI Signature Component)
 * Creates a glowing, continuous liquid beam of light that orbits the border
 * of luxury cards, flacon frames, and featured containers.
 */
export function BorderBeam({
  className = "",
  size = 200,
  duration = 12,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = "#DFBE7B",
  colorTo = "#9B7836",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--anchor": `${anchor}%`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width))_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size))] after:animate-[border-beam_calc(var(--duration))_infinite_linear] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor))_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)))] ${className}`}
    />
  );
}
