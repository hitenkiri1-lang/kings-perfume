import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0.1 to 0.5
  as?: React.ElementType;
  onClick?: () => void;
  [key: string]: any;
}

/**
 * Magnetic (Skiper UI & Vengeance UI Magnetic Physics Wrapper)
 * Attracts elements towards the mouse cursor smoothly with spring physics.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.25,
  as: Component = "div",
  onClick,
  ...props
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
