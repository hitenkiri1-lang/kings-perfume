import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, Heart, GitCompare, X, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/store/StoreContext";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { QuickViewModal } from "@/components/QuickViewModal";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, wishlist, compare, setCartOpen, setSearchOpen } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = cart.reduce((n, c) => n + c.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <div className="sticky top-0 z-40">
        {/* Announcement bar */}
        <div className="bg-primary text-primary-foreground text-xs">
          <div className="mx-auto max-w-7xl overflow-hidden px-4 py-2 text-center">
            <span className="inline-block animate-fade-in-up tracking-wide">
              🚚 Free shipping on orders over ₹999 | Shop luxury fragrances
            </span>
          </div>
        </div>

        {/* Main nav */}
        <header className={`border-b border-border/60 transition-all ${scrolled ? "bg-background/95 backdrop-blur" : "bg-background"}`}>
          <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 md:px-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileOpen(true)} className="md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/" className="flex items-center gap-2 font-serif text-2xl tracking-tight text-primary">
                <Crown className="h-6 w-6" />
                <span>King Perfumes</span>
              </Link>
            </div>

            <nav className="hidden justify-center gap-8 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="text-sm text-foreground/80 transition-colors hover:text-gold"
                  activeProps={{ className: "text-gold font-medium" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 justify-self-end">
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-1.5 hover:text-gold">
                <Search className="h-5 w-5" />
              </button>
              <Link to="/compare" aria-label="Compare" className="relative hidden p-1.5 hover:text-gold sm:inline-flex">
                <GitCompare className="h-5 w-5" />
                {compare.length > 0 && <Badge n={compare.length} />}
              </Link>
              <Link to="/wishlist" aria-label="Wishlist" className="relative p-1.5 hover:text-gold">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && <Badge n={wishlist.length} />}
              </Link>
              <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative p-1.5 hover:text-gold">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && <Badge n={cartCount} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-background p-6 shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-serif text-xl text-primary">
                <Crown className="h-5 w-5" /> King Perfumes
              </span>
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="mt-8 flex flex-col gap-4">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="text-lg text-foreground/90">
                  {n.label}
                </Link>
              ))}
              <Link to="/wishlist" className="text-lg text-foreground/90">Wishlist</Link>
              <Link to="/compare" className="text-lg text-foreground/90">Compare</Link>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
    </>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-gold-foreground">
      {n > 99 ? "99+" : n}
    </span>
  );
}