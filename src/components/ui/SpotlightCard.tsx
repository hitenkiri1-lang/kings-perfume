import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
}

/**
 * SpotlightCard (Vengeance UI & AnimMaster Lib Pattern)
 * Features dynamic cursor-following spotlight glow, radial border highlight,
 * and optional smooth 3D tilt perspective physics.
 */
export function SpotlightCard({
  children,
  className = "",
  innerClassName = "",
  spotlightColor = "rgba(197, 160, 89, 0.16)",
  enableTilt = true,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse relative coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Tilt spring physics
  const springConfig = { stiffness: 260, damping: 22, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], enableTilt ? [6, -6] : [0, 0]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], enableTilt ? [-6, 6] : [0, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Normalized from -0.5 to 0.5 for tilt
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        enableTilt
          ? {
              perspective: 1000,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      className={`relative overflow-hidden rounded-2xl border border-[#EAE3D6] bg-white transition-shadow duration-500 ${className} ${
        isHovered ? "shadow-2xl shadow-gold/15" : "shadow-sm"
      }`}
      {...(props as any)}
    >
      {/* Vengeance UI Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />

      {/* Specular Edge Highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl border transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.7 : 0,
          borderColor: "rgba(197, 160, 89, 0.4)",
          background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.4), transparent 60%)`,
        }}
      />

      <div className={`relative z-10 w-full h-full ${innerClassName}`}>{children}</div>
    </motion.div>
  );
}
