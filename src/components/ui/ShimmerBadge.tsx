import React from "react";
import { motion } from "framer-motion";

interface ShimmerBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "gold" | "noir" | "ruby";
  icon?: React.ReactNode;
}

/**
 * ShimmerBadge (Skiper UI & AnimMaster Lib Signature Component)
 * Features a glowing animated light beam and subtle metallic border reflection.
 */
export function ShimmerBadge({
  children,
  className = "",
  variant = "gold",
  icon,
}: ShimmerBadgeProps) {
  const variantStyles = {
    gold: "border-gold/50 bg-[#FAF7F0] text-gold",
    noir: "border-[#181512]/30 bg-[#181512] text-white",
    ruby: "border-[#6E1B2B]/40 bg-[#6E1B2B] text-white",
  };

  return (
    <div
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md ${variantStyles[variant]} ${className}`}
    >
      {/* Animated Light Sweep Beam */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer-sweep_3s_infinite_ease-in-out] bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10 font-mono">{children}</span>
    </div>
  );
}
