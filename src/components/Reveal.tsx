import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant = 
  | "fadeUp" 
  | "fadeLeft" 
  | "fadeRight" 
  | "scale" 
  | "zoom" 
  | "rotate" 
  | "stagger";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  triggerOnce?: boolean;
}

export function Reveal({ 
  children, 
  className, 
  variant = "fadeUp", 
  delay = 0, 
  duration = 0.8,
  staggerChildren = 0.1,
  triggerOnce = true
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      let fromVars: gsap.TweenVars = { opacity: 0 };
      let toVars: gsap.TweenVars = { 
        opacity: 1, 
        duration, 
        delay, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: triggerOnce,
        }
      };

      switch (variant) {
        case "fadeUp":
          fromVars.y = 50;
          toVars.y = 0;
          break;
        case "fadeLeft":
          fromVars.x = -50;
          toVars.x = 0;
          break;
        case "fadeRight":
          fromVars.x = 50;
          toVars.x = 0;
          break;
        case "scale":
          fromVars.scale = 0.8;
          toVars.scale = 1;
          break;
        case "zoom":
          fromVars.scale = 1.2;
          toVars.scale = 1;
          break;
        case "rotate":
          fromVars.rotation = 10;
          fromVars.y = 30;
          toVars.rotation = 0;
          toVars.y = 0;
          break;
        case "stagger":
          fromVars.y = 30;
          toVars.y = 0;
          // Note: for stagger, the children need to be targeted.
          // We assume the children elements are the direct descendants
          gsap.fromTo(el.children, fromVars, { ...toVars, stagger: staggerChildren });
          return;
      }

      gsap.fromTo(el, fromVars, toVars);
    }, containerRef);

    return () => ctx.revert();
  }, [variant, delay, duration, staggerChildren, triggerOnce]);

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
