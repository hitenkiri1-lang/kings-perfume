import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { 
  RoyalCrownIcon, 
  FlaconIcon, 
  StarFacetIcon 
} from "@/components/icons/LuxuryIcons";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "The Royal Vault — King Perfumes Luxury Collection" },
      { name: "description", content: "Explore King Perfumes' curated collection of pure extraits, royal attars, and luxury colognes." },
    ],
  }),
  component: Shop,
});

const genders = ["All", "Men", "Women", "Unisex"];
const sortOptions = [
  { v: "popular", label: "Curator's Popularity" },
  { v: "newest", label: "Latest Distillations" },
  { v: "price-asc", label: "Price: Low to High" },
  { v: "price-desc", label: "Price: High to Low" },
];

function Shop() {
  const { products } = useStore();
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const [category, setCategory] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    let arr = products.filter((p) => p.status === "active");
    if (category) arr = arr.filter((p) => p.category === category);
    if (gender !== "All") arr = arr.filter((p) => p.gender === gender || p.gender === "Unisex");
    arr = arr.filter((p) => p.price <= maxPrice && Number(p.rating || 0) >= minRating);
    switch (sort) {
      case "price-asc": arr = [...arr].sort((a, b) => a.price - b.price); break;
      case "price-desc": arr = [...arr].sort((a, b) => b.price - a.price); break;
      case "newest": arr = [...arr].reverse(); break;
      default: arr = [...arr].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return arr;
  }, [products, category, gender, maxPrice, minRating, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const resetFilters = () => {
    setCategory(null);
    setGender("All");
    setMaxPrice(30000);
    setMinRating(0);
  };

  const filtersUI = (
    <div className="space-y-8 bg-white p-6 rounded-2xl border border-[#EAE3D6] shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE2]">
        <span className="font-serif text-lg text-[#181512] font-medium">Refine Selection</span>
        {(category || gender !== "All" || maxPrice < 30000 || minRating > 0) && (
          <button 
            onClick={resetFilters}
            className="text-[11px] uppercase tracking-wider text-gold hover:underline font-semibold"
          >
            Reset All
          </button>
        )}
      </div>

      <FilterGroup title="Fragrance Family">
        <button 
          onClick={() => setCategory(null)} 
          className={`flex items-center justify-between w-full text-left text-xs py-1.5 transition-colors ${
            !category ? "text-gold font-semibold" : "text-[#5C554B] hover:text-[#181512]"
          }`}
        >
          <span>All Universes</span>
          {!category && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
        </button>
        {categories.map((c) => (
          <button 
            key={c} 
            onClick={() => setCategory(c)} 
            className={`flex items-center justify-between w-full text-left text-xs py-1.5 transition-colors ${
              category === c ? "text-gold font-semibold" : "text-[#5C554B] hover:text-[#181512]"
            }`}
          >
            <span>{c}</span>
            {category === c && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Gender Profile">
        <div className="flex flex-wrap gap-2">
          {genders.map((s) => (
            <button 
              key={s} 
              onClick={() => setGender(s)} 
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                gender === s 
                  ? "bg-[#181512] text-white font-medium shadow-sm" 
                  : "bg-[#FAF7F0] border border-[#EAE3D6] text-[#5C554B] hover:border-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Investment Range">
        <input 
          type="range" 
          min={500} 
          max={30000} 
          step={200} 
          value={maxPrice} 
          onChange={(e) => setMaxPrice(+e.target.value)} 
          className="w-full accent-[#C5A059] cursor-pointer" 
        />
        <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
          <span>₹500</span>
          <span className="text-[#181512] font-semibold">Up to ₹{maxPrice.toLocaleString()}</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Prestige Rating">
        <div className="space-y-1.5">
          {[0, 4.5, 4, 3].map((r) => (
            <button 
              key={r} 
              onClick={() => setMinRating(r)} 
              className={`flex items-center gap-2 w-full text-left text-xs py-1 transition-colors ${
                minRating === r ? "text-gold font-semibold" : "text-[#5C554B] hover:text-[#181512]"
              }`}
            >
              {r === 0 ? (
                <span>All Ratings</span>
              ) : (
                <span className="flex items-center gap-1">
                  <StarFacetIcon size={12} filled className="text-gold" />
                  {r} Stars & Above
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1320px] px-6 pt-36 pb-24 bg-[#FCFBF7]">
      
      {/* Header Banner */}
      <header className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-3">
          <RoyalCrownIcon size={18} className="text-gold" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold font-mono">
            Maison King Perfumes
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#181512] font-normal tracking-tight">
          The Royal Vault
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
          Discover your signature olfactory silhouette from our curated cellar of perfumes, single-origin attars, and bespoke extraits.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-[260px_1fr] relative">
        {/* Left Sticky Filter Aside */}
        <aside className="hidden md:block sticky top-32 self-start max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
          {filtersUI}
        </aside>

        {/* Right Main Grid */}
        <div>
          {/* Controls Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EAE3D6] shadow-sm">
            <button 
              onClick={() => setFiltersOpen(true)} 
              className="inline-flex items-center gap-2 rounded-full border border-[#DED6C7] bg-[#FAF7F0] px-4 py-2 text-xs uppercase tracking-wider font-semibold md:hidden"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Refine ({filtered.length})
            </button>

            <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Showing <span className="text-[#181512] font-semibold">{filtered.length}</span> Flacons
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">Order:</span>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)} 
                className="rounded-full border border-[#EAE3D6] bg-[#FAF7F0] px-4 py-2 text-xs text-[#181512] outline-none font-medium cursor-pointer focus:border-gold"
              >
                {sortOptions.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Empty State */}
          {paged.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-[#EAE3D6] p-8 shadow-sm">
              <FlaconIcon size={40} className="mx-auto text-gold/40 mb-4" />
              <h3 className="font-serif text-2xl text-[#181512] font-medium">No Fragrances Match These Notes</h3>
              <p className="mt-2 text-sm text-muted-foreground font-light max-w-sm mx-auto">
                Try widening your price range or exploring all fragrance universes.
              </p>
              <button 
                onClick={resetFilters} 
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#181512] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-14 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  className={`h-9 w-9 rounded-full text-xs font-mono transition-all ${
                    page === i + 1 
                      ? "bg-[#181512] text-white shadow-md shadow-black/10 scale-105" 
                      : "bg-white border border-[#EAE3D6] text-[#5C554B] hover:border-gold"
                  }`}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[#181512]/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs overflow-y-auto bg-[#FCFBF7] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
              <span className="font-serif text-xl text-[#181512] font-medium">Refine Selection</span>
              <button onClick={() => setFiltersOpen(false)} className="p-1 rounded-full hover:bg-black/5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {filtersUI}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-gold font-mono">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}