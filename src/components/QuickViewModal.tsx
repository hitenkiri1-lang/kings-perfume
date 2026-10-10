import { useState, useMemo } from "react";
import { useStore, formatPrice } from "@/store/StoreContext";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuxuryBagIcon, 
  FlaconIcon, 
  OlfactoryDropIcon,
  FiligreeHeartIcon
} from "@/components/icons/LuxuryIcons";
import { PerfumeEditorialDescription } from "@/components/PerfumeEditorialDescription";

export function QuickViewModal() {
  const { quickViewId, setQuickViewId, products, addToCart, setCartOpen, wishlist, toggleWishlist } = useStore();
  const product = products.find((p) => p.id === quickViewId);
  const wished = product ? wishlist.map(String).includes(String(product.id)) : false;
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const sizes = useMemo(() => {
    if (!product) return [{ size: "50ml", price: 0 }];
    const raw = product.sizes || ["50ml"];
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
      return raw as { size: string; price: number }[];
    }
    return (raw as string[]).map((s: string) => ({ size: s, price: product.price }));
  }, [product?.sizes, product?.price]);

  if (!product) return null;

  const currentSize = size ?? sizes[0].size;
  const currentSizeData = sizes.find((s) => s.size === currentSize) || sizes[0];
  const currentPrice = currentSizeData.price;
  const images = product.images || [];

  return (
    <AnimatePresence>
      {quickViewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#181512]/45 backdrop-blur-sm" 
            onClick={() => { setQuickViewId(null); setActiveImg(0); }} 
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#FAF8F5] shadow-2xl border border-[#EAE3D6] flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={() => { setQuickViewId(null); setActiveImg(0); }} 
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/80 backdrop-blur-md text-[#181512] hover:bg-gold hover:text-white transition-all shadow-sm"
              aria-label="Close Preview"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Gallery Section */}
            <div className="md:w-1/2 relative bg-white border-r border-[#EAE3D6] flex flex-col p-4">
              <div className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF7F0]">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={images[activeImg] || "/images/product-default.jpg"} 
                    alt={product.name} 
                    className="h-full w-full object-cover" 
                  />
                </AnimatePresence>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 pt-3">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImg === idx ? 'border-gold shadow-sm' : 'border-[#EAE3D6] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 flex flex-col p-8 md:p-10 overflow-y-auto justify-between bg-[#FAF8F5]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-mono font-semibold block mb-1">
                  {product.category || "Extrait de Parfum"}
                </span>
                <h2 className="font-serif text-3xl text-[#181512] font-normal leading-snug">
                  {product.name}
                </h2>
                
                <div className="mt-3 flex items-baseline gap-3 border-b border-[#EAE3D6] pb-4">
                  <span className="font-serif text-2xl text-[#181512] font-medium">{formatPrice(currentPrice)}</span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <span className="text-xs text-muted-foreground line-through font-light">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <PerfumeEditorialDescription description={product.description} variant="compact" />
                </div>

                {sizes.length > 1 && (
                  <div className="mt-6">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono font-semibold block mb-2">
                      Flacon Measure
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s.size}
                          onClick={() => setSize(s.size)}
                          className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all ${
                            currentSize === s.size 
                              ? "bg-[#181512] text-white shadow-sm font-semibold" 
                              : "bg-white border border-[#EAE3D6] text-[#5C554B] hover:border-gold"
                          }`}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-[#EAE3D6]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-[#EAE3D6] bg-white px-2 py-1 shadow-sm">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))} 
                      className="p-1.5 text-xs text-muted-foreground hover:text-gold"
                    >
                      –
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-semibold text-[#181512]">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)} 
                      className="p-1.5 text-xs text-muted-foreground hover:text-gold"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => { addToCart(product.id, currentSize, qty); setQuickViewId(null); setCartOpen(true); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#181512] py-3.5 px-6 text-xs uppercase tracking-widest font-semibold text-white shadow-lg hover:bg-gold transition-all"
                  >
                    <LuxuryBagIcon size={15} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-full border border-[#EAE3D6] transition-colors shadow-sm flex items-center justify-center ${
                      wished ? "bg-gold text-white border-gold shadow-gold/20" : "bg-white text-[#181512] hover:border-gold hover:text-gold"
                    }`}
                    title={wished ? "Remove from Wishlist" : "Save to Wishlist"}
                    aria-label={wished ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <FiligreeHeartIcon size={16} filled={wished} />
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <Link 
                    to={`/product/${product.id}`} 
                    onClick={() => { setQuickViewId(null); setActiveImg(0); }} 
                    className="text-xs text-gold uppercase tracking-wider font-semibold hover:underline"
                  >
                    Explore Complete Composition & Notes →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}