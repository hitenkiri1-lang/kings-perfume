import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  RoyalCrownIcon, 
  FlaconIcon, 
  OlfactoryDropIcon, 
  BotanicalSprigIcon,
  ShieldHeritageIcon,
  VelvetCourierIcon 
} from "@/components/icons/LuxuryIcons";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#F6F3EC] text-[#181512] pt-24 pb-12 overflow-hidden border-t border-[#E8E1D4]">
      {/* Background decorative subtle crest */}
      <div className="absolute top-12 right-12 opacity-[0.03] pointer-events-none">
        <RoyalCrownIcon size={400} />
      </div>

      <div className="mx-auto max-w-[1320px] px-6 relative z-10">
        
        {/* Newsletter / Royal Calling Card */}
        <div className="bg-[#FFFFFF] border border-[#E8E1D4] rounded-3xl p-8 sm:p-14 mb-20 shadow-xl shadow-gold/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <RoyalCrownIcon size={16} className="text-gold" />
                <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gold font-mono">
                  The Royal Society
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#181512] font-medium tracking-tight">
                Private Invocations & Rare Reserves
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                Receive private invitations to limited attar distillations, seasonal extraits, and masterclasses from our resident noses.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
              {subscribed ? (
                <div className="bg-[#FAF7F0] border border-gold/40 px-6 py-4 rounded-full text-center">
                  <span className="text-sm font-medium text-gold flex items-center justify-center gap-2">
                    ✦ Welcome to the Royal Circle. An introductory dispatch awaits your inbox.
                  </span>
                </div>
              ) : (
                <div className="relative flex items-center w-full lg:w-[420px]">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your personal email" 
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-full py-4 pl-6 pr-36 text-sm text-[#181512] placeholder:text-muted-foreground/60 outline-none focus:border-gold transition-colors font-light shadow-inner"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-1.5 px-6 py-2.5 rounded-full bg-[#181512] text-white hover:bg-gold transition-all text-xs uppercase tracking-widest font-semibold"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 4 Column Directory */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pb-16 border-b border-[#E8E1D4]">
          
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="King Perfumes" className="h-12 w-auto object-contain" />
              <div>
                <span className="font-serif text-2xl text-[#181512] font-medium block leading-none">King Perfumes</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-semibold mt-1 block">Maison de Parfum</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-light mb-8">
              India's premier maison for luxury perfumes, rare attars, and artisanal fragrant extraits. Curated with devotion for the discerning collector.
            </p>
            <div className="flex gap-3">
              {[
                { name: "Instagram", url: "https://www.instagram.com/king.perfumes_rajkot/?hl=en" },
                { name: "Facebook", url: "https://www.facebook.com/p/King-Perfumes-61571565824143/" }
              ].map((s) => (
                <a 
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full border border-[#DFD8CC] bg-white text-xs font-medium text-[#4A453F] hover:border-gold hover:text-gold transition-colors shadow-sm"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-serif text-lg text-[#181512] mb-6 tracking-wide font-medium">Collections</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground font-light">
              {[
                { to: "/shop", label: "All Royal Fragrances" },
                { to: "/shop?category=Eau+de+Parfum", label: "Eau de Parfum (Extrait)" },
                { to: "/shop?category=Eau+de+Toilette", label: "Eau de Toilette (Cologne)" },
                { to: "/shop?category=Attar", label: "Pure Concentrated Attars" },
                { to: "/shop?badge=New", label: "Seasonal New Releases" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge & Client Care */}
          <div>
            <h3 className="font-serif text-lg text-[#181512] mb-6 tracking-wide font-medium">Client Care</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground font-light">
              {[
                { label: "White-Glove Shipping", to: "/shipping" },
                { label: "Returns & Exchanges", to: "/returns" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Fragrance Consultation", to: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutiques */}
          <div>
            <h3 className="font-serif text-lg text-[#181512] mb-6 tracking-wide font-medium">Boutique & Atelier</h3>
            <ul className="space-y-4 text-sm text-muted-foreground font-light">
              <li className="leading-relaxed">
                <span className="font-medium text-[#181512] block">Flagship Salon</span>
                1st Floor, Nakshatra 10, Nakshatra -110,<br/>
                Opp. Hotel Silver Palace,<br/>
                Rajkot, Gujarat 360002
              </li>
              <li>
                <span className="font-medium text-[#181512] block">Private Concierge</span>
                <span className="hover:text-gold cursor-pointer transition-colors">+91 9558688562</span>
              </li>
              <li>
                <span className="font-medium text-[#181512] block">Inquiries & Private Appointments</span>
                <span className="hover:text-gold cursor-pointer transition-colors">kingperfumes11@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-light">
          <p>© {new Date().getFullYear()} King Perfumes Haute Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldHeritageIcon size={14} className="text-gold" /> 100% Certified Authentic
            </span>
            <span className="flex items-center gap-1.5">
              <VelvetCourierIcon size={14} className="text-gold" /> Tamper-Proof Luxury Seal
            </span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-gold transition-colors"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}