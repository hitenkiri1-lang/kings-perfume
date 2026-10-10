import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface KineticTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

/**
 * KineticText (AnimMaster Lib & Skiper UI Signature Typography Effect)
 * Splits strings into individual words and glyphs, animating them with
 * perspective rotation, vertical translation, and blur clearing.
 */
export function KineticText({
  children,
  className = "",
  delay = 0,
  stagger = 0.04,
  as: Component = "span",
}: KineticTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const words = children.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      rotateX: -35,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Component className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="inline-flex flex-wrap gap-x-[0.28em] perspective-[1000px]"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block origin-bottom will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
