import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";
import { useStore, formatPrice } from "@/store/StoreContext";
import { Link } from "@tanstack/react-router";

export function QuickViewModal() {
  const { quickViewId, setQuickViewId, products, addToCart, setCartOpen } = useStore();
  const product = products.find((p) => p.id === quickViewId);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  // Parse sizes - MUST be called before any early return to maintain hook order
  const sizes = useMemo(() => {
    if (!product) return [{ size: "50ml", price: 0 }];
    const raw = product.sizes || ["50ml"];
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
      return raw as { size: string; price: number }[];
    }
    return (raw as string[]).map((s: string) => ({ size: s, price: product.price }));
  }, [product?.sizes, product?.price]);

  if (!product) return null;

  const currentSize = size ?? sizes[0].size;
  const currentSizeData = sizes.find((s) => s.size === currentSize) || sizes[0];
  const currentPrice = currentSizeData.price;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => setQuickViewId(null)} />
      <div className="absolute left-1/2 top-1/2 w-[94%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-background shadow-2xl">
        <button onClick={() => setQuickViewId(null)} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/80">
          <X className="h-4 w-4" />
        </button>
        <div className="grid md:grid-cols-2">
          <img src={product.images?.[0] || ""} alt={product.name} className="h-full max-h-[70vh] w-full object-cover" />
          <div className="flex flex-col gap-4 p-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-gold/70">{product.category}</div>
              <h2 className="mt-1 font-serif text-2xl text-primary">{product.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-medium text-gold">{formatPrice(currentPrice)}</span>
              {product.originalPrice && product.originalPrice > currentPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>

            {sizes.length > 1 && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Size</div>
                <div className="mt-2 flex gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSize(s.size)}
                      className={`rounded-full border px-3 py-1.5 text-sm ${currentSize === s.size ? "border-gold bg-gold text-gold-foreground" : "border-border text-foreground"}`}
                    >
                      {s.size} — {formatPrice(s.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus className="h-3 w-3" /></button>
                <span className="w-6 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
              </div>
              <button
                onClick={() => { addToCart(product.id, currentSize, qty); setQuickViewId(null); setCartOpen(true); }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
            </div>
            <Link to="/product/$id" params={{ id: product.id }} onClick={() => setQuickViewId(null)} className="text-center text-sm text-gold underline underline-offset-4">
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}