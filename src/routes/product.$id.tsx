import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, formatPrice } from "@/store/StoreContext";
import { ProductCard } from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RoyalCrownIcon, 
  FlaconIcon, 
  OlfactoryDropIcon, 
  BotanicalSprigIcon,
  ShieldHeritageIcon,
  VelvetCourierIcon,
  StarFacetIcon,
  LuxuryBagIcon,
  FiligreeHeartIcon 
} from "@/components/icons/LuxuryIcons";
import { PerfumeEditorialDescription } from "@/components/PerfumeEditorialDescription";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  loader: async ({ params }) => {
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
  
  const product = loaderData?.product || products.find((p) => p.id === id || p.slug === id);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [mainIdx, setMainIdx] = useState(0);

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-40 text-center bg-[#FCFBF7]">
        <FlaconIcon size={48} className="mx-auto text-gold/40 mb-4" />
        <h1 className="font-serif text-4xl text-[#181512]">Fragrance Not Found</h1>
        <p className="mt-3 text-muted-foreground font-light">The fragrance you are seeking may have been retired to our private archives.</p>
        <Link to="/shop" className="mt-8 inline-block rounded-full bg-[#181512] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white hover:bg-gold transition-colors">
          Return to The Vault
        </Link>
      </div>
    );
  }

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
  const wished = wishlist.map(String).includes(String(product.id));
  const related = products.filter((p) => p.status === "active" && (p.category === product.category || p.gender === product.gender) && p.id !== product.id).slice(0, 4);

  const handleAdd = () => { addToCart(product.id, currentSize, qty); setCartOpen(true); };
  const handleBuy = () => { addToCart(product.id, currentSize, qty); navigate({ to: "/checkout" }); };

  return (
    <div className="mx-auto max-w-[1320px] px-6 pt-36 pb-24 bg-[#FCFBF7]">
      
      {/* Breadcrumb Navigation */}
      <nav className="mb-10 text-xs font-mono tracking-wider text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-gold transition-colors">Maison</Link> 
        <span>/</span>
        <Link to="/shop" className="hover:text-gold transition-colors">The Vault</Link> 
        <span>/</span>
        <span className="text-[#181512] font-semibold">{product.name}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid gap-12 lg:grid-cols-12 items-start">
        
        {/* Left: Flacon Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="overflow-hidden rounded-3xl bg-white border border-[#EAE3D6] shadow-xl p-3 relative group">
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#FAF7F0] relative">
              <img 
                src={(product.images?.[mainIdx] ?? product.images?.[0]) || ""} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {product.badge && (
                <span className="absolute top-4 left-4 rounded-full bg-[#181512] text-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setMainIdx(i)} 
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    mainIdx === i ? "border-gold shadow-md" : "border-[#EAE3D6] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Olfactory Details & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-semibold font-mono">
                {product.category || "Haute Parfumerie"}
              </span>
              
              {/* Star rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarFacetIcon 
                      key={i} 
                      size={13} 
                      filled={i < Math.round(Number(product.rating) || 5)} 
                      className={i < Math.round(Number(product.rating) || 5) ? "text-gold" : "text-border"} 
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {Number(product.rating || 5).toFixed(1)} ({product.reviewCount || 16} Reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl text-[#181512] font-normal tracking-tight">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl text-[#181512] font-medium">
                {formatPrice(currentPrice)}
              </span>
              {originalPrice && originalPrice > currentPrice && (
                <>
                  <span className="text-sm text-muted-foreground line-through font-light">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="rounded-full bg-[#FAF7F0] border border-gold/40 px-2.5 py-0.5 text-xs text-gold font-semibold font-mono">
                    Reserve Privilege -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-6">
              <PerfumeEditorialDescription description={product.description} variant="hero" />
            </div>

            {/* Scent Accord Notes Pyramid preview */}
            {product.topNotes && (
              <div className="mt-8 p-5 rounded-2xl bg-white border border-[#EAE3D6] shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <OlfactoryDropIcon size={16} className="text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold font-mono">
                    Olfactory Chord Harmony
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground font-semibold w-24 shrink-0 font-mono text-[10px] uppercase">Top Chord:</span>
                    <span className="text-[#181512] font-medium">{product.topNotes}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground font-semibold w-24 shrink-0 font-mono text-[10px] uppercase">Heart Chord:</span>
                    <span className="text-[#181512] font-medium">{product.middleNotes || "Royal Damask Rose & Orris"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground font-semibold w-24 shrink-0 font-mono text-[10px] uppercase">Base Chord:</span>
                    <span className="text-[#181512] font-medium">{product.baseNotes || "Aged Cambodian Agarwood & Mysore Sandalwood"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 1 && (
              <div className="mt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-muted-foreground font-mono block mb-2">
                  Select Flacon Measure
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSize(s.size)}
                      className={`rounded-full px-5 py-2 text-xs font-mono font-medium transition-all ${
                        currentSize === s.size 
                          ? "bg-[#181512] text-white shadow-md shadow-black/10 scale-102" 
                          : "bg-white border border-[#EAE3D6] text-[#5C554B] hover:border-gold"
                      }`}
                    >
                      {s.size} — {formatPrice(s.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart Controls */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center rounded-full border border-[#EAE3D6] bg-white px-2 py-1 shadow-sm">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))} 
                  className="p-2.5 text-muted-foreground hover:text-gold transition-colors"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span className="w-8 text-center text-sm font-mono font-semibold text-[#181512]">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)} 
                  className="p-2.5 text-muted-foreground hover:text-gold transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAdd} 
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#181512] text-white py-4 px-6 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-all shadow-lg shadow-black/10"
              >
                <LuxuryBagIcon size={16} /> Add Flacon to Cart
              </button>

              <button 
                onClick={() => toggleWishlist(product.id)} 
                className={`p-3.5 rounded-full border border-[#EAE3D6] transition-colors shadow-sm ${
                  wished ? "bg-gold text-white border-gold" : "bg-white text-[#181512] hover:border-gold hover:text-gold"
                }`}
                title={wished ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <FiligreeHeartIcon size={18} filled={wished} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button 
              onClick={handleBuy} 
              className="mt-3 w-full rounded-full border border-gold bg-[#FAF7F0] py-3.5 text-xs uppercase tracking-widest font-semibold text-[#181512] hover:bg-gold hover:text-white transition-all shadow-sm"
            >
              Express Royal Checkout — {formatPrice(currentPrice * qty)}
            </button>

            {/* Stock Scarcity Notice */}
            {product.stock < 10 && (
              <div className="mt-4 rounded-xl bg-[#FAF7F0] border border-gold/30 p-3 text-xs text-gold flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                Cellar Reserve Alert: Only {product.stock} bottles remaining from this harvest.
              </div>
            )}

            {/* Delivery & Purity Badges */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[#EAE3D6] pt-6 text-xs text-muted-foreground font-light">
              <div className="flex items-center gap-3">
                <VelvetCourierIcon size={20} className="text-gold shrink-0" />
                <span>Complimentary white-glove delivery above ₹999</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldHeritageIcon size={20} className="text-gold shrink-0" />
                <span>100% Certified authentic & tamper-sealed</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Editorial Tabs (Description, Notes Composition, Ritual, Reviews) */}
      <div className="mt-24 bg-white rounded-3xl border border-[#EAE3D6] p-8 sm:p-12 shadow-sm">
        <Tabs defaultValue="description">
          <TabsList className="bg-[#FAF7F0] border border-[#EAE3D6] p-1 rounded-full mb-8">
            <TabsTrigger value="description" className="rounded-full data-[state=active]:bg-[#181512] data-[state=active]:text-white text-xs uppercase tracking-wider font-semibold">
              The Story
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-full data-[state=active]:bg-[#181512] data-[state=active]:text-white text-xs uppercase tracking-wider font-semibold">
              Notes Composition
            </TabsTrigger>
            <TabsTrigger value="use" className="rounded-full data-[state=active]:bg-[#181512] data-[state=active]:text-white text-xs uppercase tracking-wider font-semibold">
              The Ritual
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-full data-[state=active]:bg-[#181512] data-[state=active]:text-white text-xs uppercase tracking-wider font-semibold">
              Connoisseur Reviews ({product.reviewCount || 16})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="max-w-3xl">
            <PerfumeEditorialDescription description={product.description} variant="tab" />
          </TabsContent>

          <TabsContent value="notes" className="max-w-3xl">
            <div className="space-y-6">
              <div className="border-b border-[#F0EBE2] pb-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-gold font-mono mb-1">Top Notes (Opening Sillage)</h4>
                <p className="text-base text-[#181512]">{product.topNotes || "Calabrian Bergamot, Kashmiri Saffron, Pink Peppercorn"}</p>
              </div>
              <div className="border-b border-[#F0EBE2] pb-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-gold font-mono mb-1">Heart Notes (Core Character)</h4>
                <p className="text-base text-[#181512]">{product.middleNotes || "Taif Damask Rose, Florentine Orris, Smoked Frankincense"}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-gold font-mono mb-1">Base Notes (Eternal Drydown)</h4>
                <p className="text-base text-[#181512]">{product.baseNotes || "Royal Cambodian Agarwood, Mysore Sandalwood, Bourbon Amber"}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="use" className="max-w-3xl text-base text-[#5C554B] font-light leading-relaxed">
            {product.howToUse || "Spray lightly on pulse points — the hollow of the neck, inner wrists, and behind the ears. For concentrated attars, apply a glass dip-stick drop to the base of the throat without rubbing."}
          </TabsContent>

          <TabsContent value="reviews" className="max-w-3xl">
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((r: any, i: number) => (
                  <div key={i} className="border-b border-[#F0EBE2] pb-6">
                    <div className="flex gap-1 text-gold mb-2">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <StarFacetIcon key={k} size={14} filled={k < Number(r.rating)} className="text-gold" />
                      ))}
                    </div>
                    <blockquote className="font-serif text-xl text-[#181512]">"{r.text}"</blockquote>
                    <span className="text-xs text-muted-foreground font-mono mt-2 block">— {r.author}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic font-light">Be the first to review this royal fragrance.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Fragrances */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold font-mono block mb-2">
              Harmonious Compositions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#181512]">
              You May Also Covet
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

    </div>
  );
}