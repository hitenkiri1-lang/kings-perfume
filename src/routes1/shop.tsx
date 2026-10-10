import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X, Crown } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — King Perfumes Luxury Fragrances" },
      { name: "description", content: "Browse King Perfumes' collection of luxury perfumes, attars, and colognes." },
    ],
  }),
  component: Shop,
});

const genders = ["All", "Men", "Women", "Unisex"];
const sortOptions = [
  { v: "popular", label: "Popularity" },
  { v: "newest", label: "Newest" },
  { v: "price-asc", label: "Price: Low to High" },
  { v: "price-desc", label: "Price: High to Low" },
];

function Shop() {
  const { products } = useStore();
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const [category, setCategory] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(5000);
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

  const filtersUI = (
    <div className="space-y-6">
      <FilterGroup title="Category">
        <button onClick={() => setCategory(null)} className={`block text-sm ${!category ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}>All</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`block text-sm ${category === c ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
        ))}
      </FilterGroup>

      <FilterGroup title="Gender">
        {genders.map((s) => (
          <button key={s} onClick={() => setGender(s)} className={`block text-sm ${gender === s ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}>{s}</button>
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <input type="range" min={500} max={5000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-gold" />
        <div className="text-sm text-muted-foreground">Up to ₹{maxPrice}</div>
      </FilterGroup>

      <FilterGroup title="Rating">
        {[0, 3, 4, 4.5].map((r) => (
          <button key={r} onClick={() => setMinRating(r)} className={`block text-sm ${minRating === r ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}>
            {r === 0 ? "Any" : `${r}★ & up`}
          </button>
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <header className="mb-10 text-center">
        <Crown className="mx-auto h-6 w-6 text-gold/50" />
        <span className="mt-2 block text-xs uppercase tracking-[0.3em] text-gold/70">Shop</span>
        <h1 className="mt-3 font-serif text-5xl text-primary">Royal Collection</h1>
        <p className="mt-3 text-muted-foreground">Discover your signature scent from our curated collection.</p>
      </header>

      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">{filtersUI}</aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm md:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <div className="text-sm text-muted-foreground">{filtered.length} fragrances</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground">
              {sortOptions.map((o) => <option key={o.v} value={o.v}>Sort: {o.label}</option>)}
            </select>
          </div>

          {paged.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No fragrances match your filters.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-full text-sm ${page === i + 1 ? "bg-gold text-gold-foreground" : "border border-border text-foreground"}`}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-xl text-primary">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
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
      <div className="mb-3 text-xs uppercase tracking-wider text-gold/70">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}