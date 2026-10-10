import { X, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore, formatPrice } from "@/store/StoreContext";

const popular = ["Serum", "Cleanser", "Rosehip", "Body Butter", "Vegan"];

export function SearchModal() {
  const { searchOpen, setSearchOpen, products } = useStore();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) => p.status === "active" && (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))).slice(0, 6);
  }, [q, products]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => setSearchOpen(false)} />
      <div className="absolute left-1/2 top-16 w-[92%] max-w-2xl -translate-x-1/2 rounded-2xl bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for serums, cleansers, ingredients…"
            className="flex-1 bg-transparent text-base outline-none"
          />
          <button onClick={() => setSearchOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5">
          {!q && (
            <>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Popular searches</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((t) => (
                  <button key={t} onClick={() => setQ(t)} className="rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-sand">{t}</button>
                ))}
              </div>
            </>
          )}

          {q && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No results found</div>
          )}

          {results.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((p) => (
                <li key={p.id}>
                  <Link to="/product/$id" params={{ id: p.id }} onClick={() => setSearchOpen(false)} className="block">
                    <img src={p.images[0]} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                    <div className="mt-2 line-clamp-1 text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
