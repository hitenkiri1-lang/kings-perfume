import { Link } from "@tanstack/react-router";
import { useStore, formatPrice } from "@/store/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  LuxuryBagIcon, 
  RoyalCrownIcon, 
  FlaconIcon, 
  VelvetCourierIcon 
} from "@/components/icons/LuxuryIcons";

export function CartDrawer() {
  const { cart, products, cartOpen, setCartOpen, updateCart, removeFromCart } = useStore();
  const listRef = useRef<HTMLUListElement>(null);

  const items = cart.map((c) => {
    const p = products.find((x) => x.id === c.productId);
    if (!p) return null;
    const sizes = p.sizes || [];
    let price = p.price;
    if (Array.isArray(sizes) && sizes.length > 0 && typeof sizes[0] === "object") {
      const matched = (sizes as { size: string; price: number }[]).find((s) => s.size === c.size);
      if (matched) price = matched.price;
    }
    return { ...c, product: p, price };
  }).filter(Boolean) as any[];

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const freeShippingThreshold = 999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  useEffect(() => {
    if (cartOpen && listRef.current) {
      const ctx = gsap.context(() => {
        gsap.from("li", {
          x: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15
        });
      }, listRef);
      return () => ctx.revert();
    }
  }, [cartOpen, items.length]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-[#181512]/45 backdrop-blur-sm" 
            onClick={() => setCartOpen(false)} 
          />
          
          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#FAF8F5] shadow-2xl border-l border-[#EAE3D6] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAE3D6] px-6 py-5 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FAF7F0] border border-gold/30 rounded-full text-gold">
                  <LuxuryBagIcon size={18} />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#181512] font-medium leading-none">Your Selection</h2>
                  <span className="text-[10px] uppercase tracking-widest text-gold font-mono mt-1 block">
                    {items.length} {items.length === 1 ? "Flacon" : "Flacons"}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setCartOpen(false)} 
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close Shopping Bag"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="bg-[#FAF7F0] border-b border-[#EAE3D6] px-6 py-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#5C554B] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <VelvetCourierIcon size={14} className="text-gold" />
                  {freeShippingRemaining > 0 
                    ? `Add ₹${freeShippingRemaining} for complimentary delivery` 
                    : "✦ Unlocked: Complimentary White-Glove Delivery"}
                </span>
                <span className="font-semibold text-gold">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#EAE3D6] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gold rounded-full"
                />
              </div>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <FlaconIcon size={48} className="text-gold/30 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-[#181512] font-medium mb-1">Your bag is awaiting inspiration</h3>
                  <p className="text-xs text-muted-foreground font-light max-w-xs mb-8">
                    Discover our rare fragrant extraits and master distillations.
                  </p>
                  <Link 
                    to="/shop" 
                    onClick={() => setCartOpen(false)} 
                    className="inline-flex items-center justify-center rounded-full bg-[#181512] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white hover:bg-gold transition-all shadow-md"
                  >
                    Explore The Collection
                  </Link>
                </motion.div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6" id="cart-scroll-area">
                  <ul ref={listRef} className="space-y-4">
                    <AnimatePresence>
                      {items.map((i: any) => (
                        <motion.li
                          key={i.productId + i.size}
                          layout
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          className="group flex gap-4 rounded-2xl bg-white border border-[#EAE3D6] p-3.5 transition-all hover:border-gold/40 hover:shadow-md"
                        >
                          <div className="overflow-hidden rounded-xl bg-[#FAF7F0] h-24 w-20 shrink-0 border border-[#EAE3D6]">
                            <img src={i.product.images[0]} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <Link 
                                  to={`/product/${i.productId}`} 
                                  onClick={() => setCartOpen(false)} 
                                  className="font-serif text-base text-[#181512] hover:text-gold line-clamp-1 transition-colors font-medium"
                                >
                                  {i.product.name}
                                </Link>
                                <button 
                                  onClick={() => removeFromCart(i.productId, i.size)} 
                                  className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-full"
                                  title="Remove item"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </button>
                              </div>
                              <span className="text-[10px] uppercase tracking-wider text-gold font-mono font-semibold block mt-0.5">
                                {i.size} Measure
                              </span>
                            </div>
                            
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-[#EAE3D6] bg-[#FAF7F0] px-1 py-0.5 shadow-sm">
                                <button 
                                  onClick={() => updateCart(i.productId, i.size, i.quantity - 1)} 
                                  className="p-1.5 text-xs text-muted-foreground hover:text-gold transition-colors"
                                >
                                  –
                                </button>
                                <span className="w-6 text-center text-xs font-mono font-semibold">{i.quantity}</span>
                                <button 
                                  onClick={() => updateCart(i.productId, i.size, i.quantity + 1)} 
                                  className="p-1.5 text-xs text-muted-foreground hover:text-gold transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-serif text-base text-[#181512] font-medium">
                                {formatPrice(i.price * i.quantity)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* Footer Subtotal & Checkout */}
                <div className="border-t border-[#EAE3D6] bg-white px-6 py-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase tracking-widest text-[11px] font-mono font-semibold">Subtotal</span>
                    <motion.span 
                      key={subtotal} 
                      className="font-serif text-2xl text-[#181512] font-medium"
                    >
                      {formatPrice(subtotal)}
                    </motion.span>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center font-light">
                    Taxes, complimentary samples & shipping calculated at checkout
                  </p>
                  
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#181512] py-4 text-xs uppercase tracking-widest font-semibold text-white shadow-xl hover:bg-gold transition-all"
                  >
                    <span>Proceed to Royal Checkout</span>
                    <span>→</span>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}