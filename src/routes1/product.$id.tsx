import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Star, Heart, Minus, Plus, ShoppingBag, Crown, Truck, ShieldCheck } from "lucide-react";
import { useStore, formatPrice } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  loader: async ({ params, context }) => {
    // Fetch product data
    try {
      const res = await fetch(`https://king-backend-nu.vercel.app/api/products/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        return { product: data };
      }
    } catch (e) {
      console.error("Failed to fetch product:", e);
    }
    return { product: null };
  },
});

function ProductDetail() {
  const { id } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { products, addToCart, setCartOpen, toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  
  // Try loader data first, then fallback to store
  const product = loaderData?.product || products.find((p) => p.id === id || p.slug === id);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <Crown className="mx-auto h-12 w-12 text-gold/30" />
        <h1 className="mt-4 font-serif text-4xl text-primary">Fragrance not found</h1>
        <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist or may have been removed.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm text-gold-foreground">Back to shop</Link>
      </div>
    );
  }

  // Parse sizes - support both old string array and new object array format
  const sizes = useMemo(() => {
    const raw = product.sizes || ["50ml"];
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
      return raw as { size: string; price: number }[];
    }
    return (raw as string[]).map((s: string) => ({ size: s, price: product.price }));
  }, [product.sizes, product.price]);

  const currentSize = size ?? sizes[0].size;
  const currentSizeData = sizes.find((s) => s.size === currentSize) || sizes[0];
  const currentPrice = currentSizeData.price;
  const originalPrice = product.originalPrice;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const wished = wishlist.includes(product.id);
  const related = products.filter((p) => p.status === "active" && (p.category === product.category || p.gender === product.gender) && p.id !== product.id).slice(0, 4);

  const handleAdd = () => { addToCart(product.id, currentSize, qty); setCartOpen(true); };
  const handleBuy = () => { addToCart(product.id, currentSize, qty); navigate({ to: "/checkout" }); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <nav className="mb-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-gold">Home</Link> <span className="mx-1">/</span>
        <Link to="/shop" className="hover:text-gold">Shop</Link> <span className="mx-1">/</span>
        <span className="text-gold">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Images */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-card border border-border/40">
            <img src={(product.images?.[mainIdx] ?? product.images?.[0]) || ""} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setMainIdx(i)} className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${mainIdx === i ? "border-gold" : "border-border"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold/70">{product.category}</div>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl text-primary">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(product.rating) || 0) ? "fill-current" : ""}`} />
              ))}
            </div>
            <span className="text-muted-foreground">{Number(product.rating || 0).toFixed(1)} · {product.reviewCount || 0} reviews</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-gold">{formatPrice(currentPrice)}</span>
            {originalPrice && originalPrice > currentPrice && (
              <>
                <span className="text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Fragrance Notes Pyramid */}
          {product.topNotes && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-wider text-gold/70">Fragrance Notes</h3>
              <div className="mt-3 flex flex-col gap-2">
                <NoteBar label="Top Notes" notes={product.topNotes} color="bg-gold/80" />
                <NoteBar label="Heart Notes" notes={product.middleNotes} color="bg-gold/60" />
                <NoteBar label="Base Notes" notes={product.baseNotes} color="bg-gold/40" />
              </div>
            </div>
          )}

          {/* Size selector with prices */}
          {sizes.length > 1 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-gold/70">Size</div>
              <div className="mt-2 flex gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSize(s.size)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${currentSize === s.size ? "border-gold bg-gold text-gold-foreground" : "border-border text-foreground hover:border-gold/50"}`}
                  >
                    {s.size} — {formatPrice(s.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-gold"><Minus className="h-3 w-3" /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-gold"><Plus className="h-3 w-3" /></button>
            </div>
            <button onClick={handleAdd} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gold/30 py-3 text-sm text-gold hover:bg-gold hover:text-gold-foreground transition-all">
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
          </div>
          <button onClick={handleBuy} className="mt-3 w-full rounded-full bg-gold py-4 text-sm font-medium text-gold-foreground hover:opacity-90 transition-all">
            Buy It Now — {formatPrice(currentPrice * qty)}
          </button>

          <button onClick={() => toggleWishlist(product.id)} className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
            <Heart className={`h-4 w-4 ${wished ? "fill-gold text-gold" : ""}`} />
            {wished ? "In your wishlist" : "Add to Wishlist"}
          </button>

          {product.stock < 10 && (
            <div className="mt-4 rounded-lg bg-gold/10 px-4 py-3 text-sm text-gold">
              Only {product.stock} left in stock — order soon.
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1"><Truck className="h-5 w-5 text-gold" />Free shipping over ₹999</div>
            <div className="flex flex-col items-center gap-1"><ShieldCheck className="h-5 w-5 text-gold" />30-day returns</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20">
        <Tabs defaultValue="description">
          <TabsList className="bg-transparent border-b border-border/60">
            <TabsTrigger value="description" className="data-[state=active]:text-gold data-[state=active]:border-gold">Description</TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:text-gold data-[state=active]:border-gold">Fragrance Notes</TabsTrigger>
            <TabsTrigger value="use" className="data-[state=active]:text-gold data-[state=active]:border-gold">How to Use</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:text-gold data-[state=active]:border-gold">Reviews ({product.reviewCount || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">
            {product.description}
          </TabsContent>
          <TabsContent value="notes" className="mt-6 max-w-3xl">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gold">Top Notes</h4>
                <p className="text-muted-foreground">{product.topNotes}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gold">Heart Notes</h4>
                <p className="text-muted-foreground">{product.middleNotes}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gold">Base Notes</h4>
                <p className="text-muted-foreground">{product.baseNotes}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="use" className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">
            {product.howToUse}
          </TabsContent>
          <TabsContent value="reviews" className="mt-6 max-w-3xl">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-border/60 pb-6">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-2 font-serif text-lg text-foreground">"A magnificent fragrance that turns heads wherever I go."</p>
                  <div className="mt-2 text-sm text-muted-foreground">— Verified buyer</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-3xl text-primary">You May Also Like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function NoteBar({ label, notes, color }: { label: string; notes: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-muted-foreground shrink-0">{label}</span>
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(100, notes.length * 8)}%` }} />
      <span className="text-xs text-foreground/80">{notes}</span>
    </div>
  );
}