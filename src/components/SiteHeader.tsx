import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@/store/StoreContext";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { QuickViewModal } from "@/components/QuickViewModal";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  RoyalCrownIcon,
  LuxurySearchIcon,
  LuxuryBagIcon,
  FiligreeHeartIcon,
  OlfactoryCompareIcon,
} from "@/components/icons/LuxuryIcons";
import { Magnetic } from "@/components/ui/Magnetic";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop Fragrances" },
  { to: "/about", label: "Our Atelier" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Boutiques" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, wishlist, compare, setCartOpen, setSearchOpen } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = cart.reduce((n, c) => n + c.quantity, 0);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const headerPadding = useTransform(scrollY, [0, 100], ["0.35rem", "0.18rem"]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Initial reveal animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-link", {
        y: -12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
        delay: 0.12
      });
      gsap.from(".logo-reveal", {
        scale: 0.88,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
      });
      gsap.from(".icon-reveal", {
        y: -12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.2
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-40 transition-all duration-500">
        {/* Scroll Progress Bar in Antique Gold */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] origin-left z-50 shadow-sm" style={{ scaleX }} />

        {/* Announcement Ticker in Light Luxury Alabaster (Ultra-Compact) */}
        <div className="bg-[#FAF7F0] border-b border-[#ECE5D8] text-[#5C5449] text-[9px] font-medium uppercase tracking-[0.2em] overflow-hidden relative">
          <div className="marquee-viewport py-0.5">
            <div className="marquee-track gap-12 pr-12 flex">
              {Array.from({ length: 2 }).map((_, row) => (
                <div key={row} className="flex shrink-0 items-center gap-10 pl-10" aria-hidden={row === 1}>
                  {[
                    "✦ Complimentary White-Glove Shipping On Orders Over ₹999",
                    "✦ Discover The Private Royal Oud Reserve",
                    "✦ 3 Complimentary Olfactory Samples With Every Flacon",
                    "✦ Hand-Crafted In Small French & Oriental Batches",
                  ].map((msg) => (
                    <span key={msg} className="tracking-[0.2em] whitespace-nowrap text-[#6B6154] font-medium">
                      {msg}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation Bar (Sleek, Decreased Width & Height) */}
        <motion.header 
          style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
          className={`transition-all duration-500 ${
            scrolled 
              ? "bg-[#FCFBF7]/95 backdrop-blur-xl border-b border-[#EAE3D6] shadow-[0_4px_20px_-10px_rgba(24,21,18,0.06)]" 
              : "bg-[#FCFBF7]/85 backdrop-blur-md border-b border-transparent"
          }`}
        >
          <div className="mx-auto grid max-w-[1140px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:px-8">
            
            {/* Mobile Menu & Logo */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setMobileOpen(true)} 
                className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-black/5 transition-colors" 
                aria-label="Toggle Navigation Menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="16" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              </button>
              
              <motion.div style={{ scale: logoScale }} className="logo-reveal origin-left">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="relative">
                    <img 
                      src="/logo.png" 
                      alt="King Perfumes" 
                      className="h-7 md:h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg md:text-[1.2rem] tracking-tight text-[#181512] font-medium leading-none">
                      King Perfumes
                    </span>
                    <span className="text-[7.5px] tracking-[0.3em] uppercase text-gold font-semibold mt-0.5">
                      Haute Parfumerie
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden justify-center gap-5 lg:gap-7 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="nav-link group relative text-[10px] uppercase tracking-[0.18em] font-medium text-[#4A453F] hover:text-[#181512] transition-colors py-0.5"
                  activeProps={{ className: "!text-gold font-semibold" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Action Talismans */}
            <div className="flex items-center gap-1 sm:gap-2 justify-self-end">
              <Magnetic strength={0.2}>
                <button 
                  onClick={() => setSearchOpen(true)} 
                  aria-label="Search Fragrances" 
                  className="icon-reveal relative flex items-center justify-center w-9 h-9 rounded-full text-[#181512] hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  <LuxurySearchIcon size={18} />
                </button>
              </Magnetic>
              
              <Magnetic strength={0.2}>
                <Link 
                  to="/compare" 
                  aria-label="Compare Fragrances" 
                  className="icon-reveal relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-[#181512] hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  <OlfactoryCompareIcon size={18} />
                  <AnimatePresence>
                    {compare.length > 0 && <Badge key="compare" n={compare.length} />}
                  </AnimatePresence>
                </Link>
              </Magnetic>
              
              <Magnetic strength={0.2}>
                <Link 
                  to="/wishlist" 
                  aria-label="View Wishlist" 
                  className="icon-reveal relative flex items-center justify-center w-9 h-9 rounded-full text-[#181512] hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  <FiligreeHeartIcon size={18} filled={wishlist.length > 0} className={wishlist.length > 0 ? "text-gold" : ""} />
                  <AnimatePresence>
                    {wishlist.length > 0 && <Badge key="wishlist" n={wishlist.length} />}
                  </AnimatePresence>
                </Link>
              </Magnetic>
              
              <Magnetic strength={0.2}>
                <button 
                  onClick={() => setCartOpen(true)} 
                  aria-label="View Shopping Bag" 
                  className="icon-reveal relative flex items-center justify-center w-9 h-9 rounded-full text-[#181512] hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  <LuxuryBagIcon size={18} />
                  <AnimatePresence>
                    {cartCount > 0 && <Badge key="cart" n={cartCount} />}
                  </AnimatePresence>
                </button>
              </Magnetic>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#181512]/40 backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.35 } }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#FAF8F5] border-r border-[#EAE3D6] p-7 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="King Perfumes" className="h-10 auto object-contain" />
                    <div>
                      <span className="font-serif text-xl tracking-tight text-[#181512] block">King Perfumes</span>
                      <span className="text-[9px] uppercase tracking-widest text-gold block">Royal Fragrances</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileOpen(false)} 
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <nav className="mt-8 flex flex-col gap-6">
                  {nav.map((n, i) => (
                    <motion.div 
                      key={n.to}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link 
                        to={n.to} 
                        onClick={() => setMobileOpen(false)} 
                        className="text-2xl font-serif text-[#181512] hover:text-gold transition-colors block"
                      >
                        {n.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-[#EAE3D6] flex flex-col gap-4">
                <Link 
                  to="/wishlist" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 text-sm text-[#5C5449] hover:text-gold transition-colors"
                >
                  <FiligreeHeartIcon size={18} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                </Link>
                <Link 
                  to="/compare" 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-3 text-sm text-[#5C5449] hover:text-gold transition-colors"
                >
                  <OlfactoryCompareIcon size={18} /> Compare Fragrances {compare.length > 0 && `(${compare.length})`}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
    </>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <motion.span 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C5A059] px-1 text-[8.5px] font-bold text-white shadow-sm ring-2 ring-[#FCFBF7] pointer-events-none z-20"
    >
      {n > 99 ? "99+" : n}
    </motion.span>
  );
}