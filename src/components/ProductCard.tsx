import { Link } from "@tanstack/react-router";
import { useStore, formatPrice, type Product } from "@/store/StoreContext";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiligreeHeartIcon, 
  OlfactoryCompareIcon, 
  FlaconIcon, 
  StarFacetIcon,
  LuxuryBagIcon 
} from "@/components/icons/LuxuryIcons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShimmerBadge } from "@/components/ui/ShimmerBadge";
import { Magnetic } from "@/components/ui/Magnetic";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist, setQuickViewId, compare, toggleCompare } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get lowest price from sizes
  const lowestPrice = useMemo(() => {
    const raw = product.sizes || [];
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
      const prices = (raw as { size: string; price: number }[]).map((s) => Number(s.price)).filter((p) => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return Number(product.price) || 0;
  }, [product.sizes, product.price]);
  
  const inWishlist = wishlist.some((x) => String(x) === String(product.id));
  const inCompare = compare.some((x) => String(x) === String(product.id));

  return (
    <SpotlightCard 
      spotlightColor="rgba(197, 160, 89, 0.14)"
      enableTilt={true}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#EAE3D6] transition-all duration-500 hover:border-gold/60"
    >
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex flex-col justify-between h-full"
      >
        {/* Top Badges & Status using ShimmerBadge (Skiper UI / AnimMaster) */}
        <div className="absolute left-3.5 top-3.5 z-20 flex flex-col gap-1.5">
          {product.badge && (
            <ShimmerBadge 
              variant={
                product.badge === "Best Seller" ? "gold" : 
                product.badge === "New" ? "ruby" : "noir"
              }
            >
              {product.badge}
            </ShimmerBadge>
          )}
        </div>

        {/* Floating Action Talismans with Magnetic Physics (Skiper UI / Vengeance UI) */}
        <div className="absolute right-3.5 top-3.5 z-20 flex flex-col gap-2">
          <Magnetic strength={0.3}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
                inWishlist 
                  ? "bg-[#C5A059] text-white scale-105" 
                  : "bg-white/85 text-[#181512] hover:bg-[#C5A059] hover:text-white"
              }`}
            >
              <FiligreeHeartIcon size={16} filled={inWishlist} />
            </button>
          </Magnetic>

          <Magnetic strength={0.3}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product.id);
              }}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
                inCompare 
                  ? "bg-[#C5A059] text-white scale-105" 
                  : "bg-white/85 text-[#181512] hover:bg-[#C5A059] hover:text-white opacity-0 group-hover:opacity-100"
              }`}
              title={inCompare ? "Remove from Compare" : "Compare Fragrances"}
            >
              <OlfactoryCompareIcon size={16} />
            </button>
          </Magnetic>
        </div>

        {/* Flacon Imagery Container */}
        <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#FBF9F5] cursor-pointer">
          <motion.img
            animate={{ scale: isHovered ? 1.07 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={product.images?.[0] || "/images/product-default.jpg"}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Secondary flacon shot on hover */}
          {product.images?.[1] && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Quick view button pill */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-0 bottom-4 flex justify-center z-20"
              >
                <Magnetic strength={0.2}>
                  <button
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation();
                      setQuickViewId(product.id); 
                    }}
                    className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#181512] shadow-lg hover:bg-[#C5A059] hover:text-white transition-all duration-300"
                  >
                    <FlaconIcon size={14} /> Quick View
                  </button>
                </Magnetic>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Flacon Information Card Body */}
        <div className="p-5 flex flex-col justify-between flex-1 gap-2.5 bg-white">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold font-mono">
                {product.category || "Extrait de Parfum"}
              </span>
              
              {/* Celestial Star Rating */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarFacetIcon 
                      key={i} 
                      size={11} 
                      filled={i < Math.round(Number(product.rating) || 5)} 
                      className={i < Math.round(Number(product.rating) || 5) ? "text-gold" : "text-border"} 
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({product.reviewCount || 12})
                </span>
              </div>
            </div>
            
            <Link to={`/product/${product.id}`} className="block group/link">
              <h3 className="font-serif text-xl font-normal leading-snug text-foreground transition-colors group-hover/link:text-gold line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Scent notes pill tags */}
            {product.notes && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.notes.split(",").slice(0, 3).map((note) => (
                  <span 
                    key={note.trim()} 
                    className="rounded-full bg-[#F6F3EC] px-2.5 py-0.5 text-[10px] text-muted-foreground tracking-wide font-light"
                  >
                    {note.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Add to Cart action with Magnetic Physics */}
          <div className="mt-3 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-medium text-foreground">
                {formatPrice(lowestPrice)}
              </span>
              {product.originalPrice && Number(product.originalPrice) > lowestPrice && (
                <span className="text-xs text-muted-foreground line-through font-light">
                  {formatPrice(Number(product.originalPrice))}
                </span>
              )}
            </div>

            <Magnetic strength={0.25}>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product.id);
                }}
                className="group/btn relative inline-flex items-center gap-1.5 rounded-full bg-[#181512] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-all hover:bg-gold hover:shadow-md hover:shadow-gold/20"
              >
                <LuxuryBagIcon size={14} />
                <span className="text-[11px] tracking-widest font-semibold">Add</span>
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}