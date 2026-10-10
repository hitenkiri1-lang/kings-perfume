import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, formatPrice } from "@/store/StoreContext";
import { X, Check } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare — King Perfumes" }] }),
  component: Compare,
});

function Compare() {
  const { products, compare, toggleCompare, addToCart, setCartOpen } = useStore();
  const items = products.filter((p) => compare.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <header className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold/70">Side by side</span>
        <h1 className="mt-3 font-serif text-5xl text-primary">Compare Products</h1>
      </header>

      {items.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          <p>Add products to compare from the shop.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm text-gold-foreground">Browse shop</Link>
        </div>
      ) : (
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="w-40 text-left text-xs uppercase tracking-wider text-muted-foreground"></th>
                {items.map((p) => (
                  <th key={p.id} className="p-4 align-top">
                    <div className="relative">
                      <button onClick={() => toggleCompare(p.id)} className="absolute right-0 top-0"><X className="h-4 w-4" /></button>
                      <img src={p.images?.[0] || ""} alt={p.name} className="mx-auto aspect-[4/5] w-32 rounded-xl object-cover" />
                      <div className="mt-3 font-serif text-lg text-primary">{p.name}</div>
                      <div className="text-sm text-gold">{formatPrice(p.price)}</div>
                      <button onClick={() => { addToCart(p.id); setCartOpen(true); }} className="mt-3 rounded-full bg-gold px-4 py-2 text-xs text-gold-foreground">Add to Cart</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <Row label="Category" items={items.map((p) => p.category)} />
              <Row label="Gender" items={items.map((p) => p.gender || "Unisex")} />
              <Row label="Rating" items={items.map((p) => `${Number(p.rating || 0).toFixed(1)} ★`)} />
              <Row label="Sizes" items={items.map((p) => {
                const sizes = p.sizes || [];
                if (Array.isArray(sizes) && sizes.length > 0 && typeof sizes[0] === "object") {
                  return (sizes as { size: string; price: number }[]).map((s) => s.size).join(" / ");
                }
                return (sizes as string[]).join(" / ");
              })} />
              <Row label="Stock" items={items.map((p) => (p.stock > 0 ? <Check className="mx-auto h-4 w-4 text-green-500" /> : "Out of Stock"))} />
              <Row label="Description" items={items.map((p) => <span className="text-xs line-clamp-3">{p.description}</span>)} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, items }: { label: string; items: React.ReactNode[] }) {
  return (
    <tr className="border-t border-border/60">
      <td className="py-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</td>
      {items.map((v, i) => <td key={i} className="p-4 text-center">{v}</td>)}
    </tr>
  );
}