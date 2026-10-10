import { Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { useStore, formatPrice } from "@/store/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { 
  LuxurySearchIcon, 
  FlaconIcon, 
  OlfactoryDropIcon 
} from "@/components/icons/LuxuryIcons";

const popularAccords = ["Oud", "Damask Rose", "Mysore Sandalwood", "Bergamot", "Attar", "Ambergris"];

export function SearchModal() {
  const { searchOpen, setSearchOpen, products } = useStore();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) => p.status === "active" && (
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term) ||
      (p.notes && p.notes.toLowerCase().includes(term))
    )).slice(0, 6);
  }, [q, products]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQ("");
    }
  }, [searchOpen]);

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      const ctx = gsap.context(() => {
        gsap.from("li", {
          y: 15,
          opacity: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.out"
        });
      }, resultsRef);
      return () => ctx.revert();
    }
  }, [results]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#181512]/45 backdrop-blur-md" 
            onClick={() => setSearchOpen(false)} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#FAF8F5] shadow-2xl border border-[#EAE3D6]"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center border-b border-[#EAE3D6] p-3 bg-white">
              <div className="pl-4 pr-3 text-gold">
                <LuxurySearchIcon size={22} />
              </div>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by fragrance title, olfactory notes, or family..."
                className="flex-1 bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground/60 font-serif text-[#181512]"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="mr-2 p-2 rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
                aria-label="Close Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="p-7">
              {!q && (
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold font-mono font-semibold mb-4">
                    <OlfactoryDropIcon size={14} /> Curated Accords & Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularAccords.map((t) => (
                      <button 
                        key={t}
                        onClick={() => setQ(t)} 
                        className="rounded-full bg-white border border-[#EAE3D6] px-4 py-2 text-xs text-[#5C554B] hover:border-gold hover:text-gold transition-all shadow-sm font-medium"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q && results.length === 0 && (
                <div className="py-14 text-center flex flex-col items-center gap-3">
                  <FlaconIcon size={36} className="text-gold/30" />
                  <p className="text-muted-foreground text-sm font-light">No fragrances match "<span className="text-[#181512] font-medium">{q}</span>"</p>
                  <button onClick={() => setQ("")} className="text-gold text-xs uppercase tracking-wider font-semibold hover:underline">
                    Clear Query
                  </button>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono flex justify-between">
                    <span>Royal Flacons</span>
                    <span>{results.length} found</span>
                  </div>
                  <ul ref={resultsRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link 
                          to={`/product/${p.id}`} 
                          onClick={() => setSearchOpen(false)}
                          className="group block rounded-2xl bg-white border border-[#EAE3D6] p-3 transition-all hover:border-gold hover:shadow-lg"
                        >
                          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF7F0] mb-2.5">
                            <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <span className="text-[9px] uppercase tracking-wider text-gold font-mono block">
                            {p.category}
                          </span>
                          <h4 className="font-serif text-base text-[#181512] group-hover:text-gold transition-colors line-clamp-1">
                            {p.name}
                          </h4>
                          <span className="font-serif text-sm text-[#181512] font-medium mt-1 block">
                            {formatPrice(p.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
