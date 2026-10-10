import { Link } from "@tanstack/react-router";
import { Crown, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-serif text-2xl text-primary">
              <Crown className="h-6 w-6" />
              <span>King Perfumes</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              India's premier destination for luxury fragrances. Curated collections of the finest perfumes from around the world.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-gold hover:text-gold transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-lg text-primary">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                { to: "/shop", label: "Shop All Fragrances" },
                { to: "/shop?category=Eau+de+Parfum", label: "Eau de Parfum" },
                { to: "/shop?category=Eau+de+Toilette", label: "Eau de Toilette" },
                { to: "/shop?category=Attar", label: "Attars & Oils" },
                { to: "/about", label: "Our Story" },
                { to: "/blog", label: "Fragrance Journal" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-lg text-primary">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {["Shipping & Delivery", "Returns & Exchanges", "FAQ", "Track Order", "Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}><a href="#" className="hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg text-primary">Get in Touch</h3>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span>hello@kingperfumes.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} King Perfumes. All rights reserved. Crafted with passion for fragrance.</p>
        </div>
      </div>
    </footer>
  );
}