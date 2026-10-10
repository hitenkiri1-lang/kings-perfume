import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Crown, ShieldCheck, Truck, Sparkles, Star, Play, Instagram, ChevronRight, ChevronLeft, Gem, Award, Clock } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "King Perfumes — Luxury Fragrances for the Discerning" },
      { name: "description", content: "Discover India's finest collection of luxury perfumes, attars, and fragrances. Royal Oud, Velvet Rose, Amber & Sandalwood — crafted for royalty." },
    ],
  }),
  component: Home,
});

const IMG = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const testimonials = [
  { name: "Arjun M.", location: "Mumbai", rating: 5, product: "Royal Oud Elite", quote: "The most magnificent fragrance I've ever worn. Compliments everywhere I go." },
  { name: "Sanya K.", location: "Delhi", rating: 5, product: "Velvet Rose Noir", quote: "This scent is pure poetry. It lingers beautifully and feels incredibly luxurious." },
  { name: "Vikram S.", location: "Bengaluru", rating: 5, product: "Midnight Oud", quote: "A single drop lasts all day. This is what true luxury smells like." },
];

function Home() {
  const { products, categories, refreshCategories } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { refreshCategories(); }, []);

  const active = products.filter((p) => p.status === "active");
  const [tab, setTab] = useState<"Best Seller" | "New" | "Featured">("Best Seller");
  const filtered = useMemo(() => active.filter((p) => p.badge === tab).slice(0, 8), [active, tab]);

  // Use categories from backend, with fallback images for those without
  const displayCategories = useMemo(() => {
    if (categories.length === 0) {
      // Fallback hardcoded categories if nothing from backend
      return [
        { name: "Eau de Parfum", text: "Intense, long-lasting luxury", img: IMG("cat-edp"), count: "12+" },
        { name: "Eau de Toilette", text: "Fresh, everyday elegance", img: IMG("cat-edt"), count: "8+" },
        { name: "Attars & Oils", text: "Pure, concentrated tradition", img: IMG("cat-attar"), count: "6+" },
        { name: "Eau de Cologne", text: "Light, refreshing classics", img: IMG("cat-cologne"), count: "4+" },
      ];
    }
    return categories.map((c) => {
      // Count products in this category
      const count = products.filter((p) => p.category === c.name).length;
      return {
        name: c.name,
        text: c.description || `Explore our ${c.name} collection`,
        img: c.image || IMG(`cat-${c.slug}`, 800, 1000),
        count: `${count}+`,
      };
    });
  }, [categories, products]);

  const scrollCategories = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <img src={IMG("perfume-hero-luxury", 1920, 1200)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gold/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-burgundy/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-2 text-gold text-sm tracking-[0.3em] uppercase">
              <Crown className="h-4 w-4" />
              <span>Est. 2024 · Luxury Fragrances</span>
            </div>
            <h1 className="mt-6 font-serif text-6xl leading-[1.05] text-primary md:text-8xl">
              Wear Your<br />
              <span className="text-gold">Royalty</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-foreground/70 leading-relaxed">
              Discover India's most exquisite collection of luxury perfumes and attars. 
              Each fragrance is a masterpiece, crafted for those who appreciate the finer things in life.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-gold-foreground shadow-lg shadow-gold/20 transition-all hover:shadow-gold/40 hover:scale-105">
                Explore Collection <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-8 py-4 text-sm text-foreground hover:bg-gold/10 transition-all">
                <Play className="h-4 w-4" /> Our Story
              </Link>
            </div>
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap gap-8 text-sm">
              {[
                { icon: Award, text: "100% Authentic" },
                { icon: Truck, text: "Free Shipping ₹999+" },
                { icon: Clock, text: "Same Day Dispatch" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-foreground/60">
                  <item.icon className="h-4 w-4 text-gold" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-gold/10 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {["Premium Ingredients", "Handcrafted in India", "Cruelty-Free", "Luxury Packaging", "100% Satisfaction"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <Gem className="h-3 w-3 text-gold" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES with horizontal slider */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold/70">Collections</span>
          <h2 className="mt-3 font-serif text-5xl md:text-6xl text-primary">Find Your Signature</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">From bold and intense to light and fresh — discover the perfect fragrance for every mood and moment.</p>
        </Reveal>
        
        {/* Horizontal scroll with buttons */}
        <div className="relative mt-14">
          <button
            onClick={() => scrollCategories("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:grid h-10 w-10 place-items-center rounded-full bg-background/80 border border-border shadow-lg hover:bg-gold hover:text-gold-foreground transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollCategories("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:grid h-10 w-10 place-items-center rounded-full bg-background/80 border border-border shadow-lg hover:bg-gold hover:text-gold-foreground transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCategories.map((c, i) => (
              <Reveal key={c.name} delay={i * 80} className="snap-start shrink-0 w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] max-w-[280px]">
                <Link to="/shop" className="group relative block overflow-hidden rounded-2xl bg-card border border-border/40 aspect-[3/4]">
                  <img src={c.img} alt={c.name} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-gold/70">{c.count} fragrances</span>
                        <h3 className="mt-1 font-serif text-2xl text-primary">{c.name}</h3>
                        <p className="mt-1 text-sm text-foreground/60">{c.text}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gold opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 shrink-0" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/70">Shop</span>
            <h2 className="mt-3 font-serif text-5xl md:text-6xl text-primary">Crown Jewels</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Our most beloved fragrances, chosen by royalty like you.</p>
          </Reveal>
          <div className="mt-10 flex justify-center gap-8 text-sm">
            {(["Best Seller", "New", "Featured"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`border-b-2 pb-1.5 transition-all ${tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {t === "New" ? "New Arrivals" : t === "Best Seller" ? "Best Sellers" : "Featured"}
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-12 text-center">
            <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full border border-gold/30 px-8 py-3.5 text-sm text-foreground hover:bg-gold hover:text-gold-foreground transition-all">
              View All Fragrances <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="relative overflow-hidden">
        <img src={IMG("perfume-story", 1920, 900)} alt="" className="h-[70vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-2xl text-center">
            <Crown className="mx-auto h-8 w-8 text-gold" />
            <span className="mt-4 block text-xs uppercase tracking-[0.3em] text-gold/70">Our Legacy</span>
            <p className="mt-6 font-serif text-3xl leading-relaxed text-primary md:text-4xl">
              "Every bottle tells a story of craftsmanship, passion, and the pursuit of perfection. 
              We source the finest ingredients from around the world to create fragrances worthy of royalty."
            </p>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/30 px-6 py-3 text-sm text-foreground hover:bg-gold hover:text-gold-foreground transition-all">
              <Play className="h-4 w-4" /> Watch Our Story
            </button>
          </div>
        </div>
      </section>

      {/* WHY KING PERFUMES */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold/70">Why Choose Us</span>
          <h2 className="mt-3 font-serif text-5xl md:text-6xl text-primary">The Royal Treatment</h2>
        </Reveal>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Crown, title: "Premium Quality", text: "Only the finest ingredients, sourced globally and crafted to perfection." },
            { icon: ShieldCheck, title: "100% Authentic", text: "Every fragrance is guaranteed authentic with direct brand partnerships." },
            { icon: Sparkles, title: "Expert Curation", text: "Each scent is handpicked by our team of fragrance experts." },
            { icon: Truck, title: "Luxury Delivery", text: "Elegant packaging with free shipping on orders over ₹999." },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 80} className="text-center group">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold/10 text-gold transition-all group-hover:bg-gold group-hover:text-gold-foreground">
                <b.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-serif text-xl text-primary">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/70">Testimonials</span>
            <h2 className="mt-3 font-serif text-5xl md:text-6xl text-primary">What Our Royalty Says</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80} className="rounded-2xl bg-card border border-border/40 p-8 hover:border-gold/20 transition-all">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 font-serif text-lg leading-relaxed text-foreground">"{t.quote}"</p>
                <div className="mt-6 text-sm">
                  <div className="font-medium text-primary">{t.name}</div>
                  <div className="text-muted-foreground">{t.location} · {t.product}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <Reveal className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold/70">@kingperfumes</span>
          <h2 className="mt-3 font-serif text-5xl text-primary">Join the Royal Court</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={IMG(`perfume-insta-${i}`, 500, 500)} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-background/0 transition group-hover:bg-background/60">
                <Instagram className="h-6 w-6 text-gold opacity-0 transition group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#" className="text-sm text-gold underline underline-offset-4 hover:text-primary transition-colors">Follow us on Instagram →</a>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-gradient-to-b from-background to-card/50 border-t border-gold/10">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-6">
          <Crown className="mx-auto h-8 w-8 text-gold" />
          <span className="mt-4 block text-xs uppercase tracking-[0.3em] text-gold/70">Newsletter</span>
          <h2 className="mt-3 font-serif text-5xl md:text-6xl text-primary">Join the Inner Circle</h2>
          <p className="mt-4 text-muted-foreground">Get 10% off your first order and early access to new fragrance launches.</p>
          <form className="mx-auto mt-10 flex max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 rounded-full border border-gold/20 bg-background px-6 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold" />
            <button className="rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-gold-foreground hover:opacity-90 transition-all">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}