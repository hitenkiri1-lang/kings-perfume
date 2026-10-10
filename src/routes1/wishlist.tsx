import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Verdea" }] }),
  component: Wishlist,
});

function Wishlist() {
  const { products, wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <header className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-sage">Saved for later</span>
        <h1 className="mt-3 font-serif text-5xl">Your Wishlist</h1>
      </header>

      {items.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          <p>You haven't saved anything yet.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 text-sm text-terracotta-foreground">Explore products</Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
