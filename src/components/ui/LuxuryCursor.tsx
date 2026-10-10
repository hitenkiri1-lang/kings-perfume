import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * LuxuryCursor (Skiper UI & Vengeance UI Bespoke Component)
 * Creates a fluid, golden scent droplet and trailing champagne aura ring
 * that magnetically expands when hovering over interactive elements.
 * 
 * Performance Architecture:
 * - 0% Layout Reflows: Uses GPU compositor transforms (scale & translate3d) instead of width/height animations.
 * - Instant Pointer Tracking: Direct MotionValue updates on mousemove without RAF latency.
 * - Smooth Inertia Spring: Dedicated physics spring for trailing champagne halo.
 * - Event Delegation: Single mouseover listener for interactive elements.
 */
export function LuxuryCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Exact mouse coordinates (Updated directly for instant zero-lag tracking)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lagging spring physics for trailing champagne halo ring
  const springConfig = { damping: 28, stiffness: 380, mass: 0.25 };
  const haloX = useSpring(mouseX, springConfig);
  const haloY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch-only devices to avoid blocking mobile gestures
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Optimized: only check interactive target on mouseover/mouseout (NOT on every mousemove pixel)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer");
      if (interactive) setIsHovered(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer");
      if (interactive) setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Trailing Champagne Halo Ring (Physics Spring Follower, Pure Transform GPU Scale) */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.3 : isClicked ? 0.72 : 1,
          borderColor: isHovered ? "rgba(197, 160, 89, 0.8)" : "rgba(197, 160, 89, 0.4)",
          backgroundColor: isHovered ? "rgba(197, 160, 89, 0.04)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 480, damping: 28 }}
        className="fixed w-9 h-9 rounded-full border shadow-xs will-change-transform flex items-center justify-center pointer-events-none"
      />

      {/* 2. Precision Golden Scent Droplet (Exact Pointer, Instant Zero-Lag) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.7 : isHovered ? 1.1 : 1,
          backgroundColor: isHovered ? "#B8860B" : "#C5A059",
        }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className="fixed w-2 h-2 rounded-full shadow-[0_0_6px_rgba(197,160,89,0.6)] will-change-transform pointer-events-none"
      />
    </div>
  );
}
