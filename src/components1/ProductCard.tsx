import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye, Star, GitCompare } from "lucide-react";
import { useStore, formatPrice, type Product } from "@/store/StoreContext";
import { useMemo } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist, setQuickViewId, compare, toggleCompare } = useStore();
  
  // Get lowest price from sizes
  const lowestPrice = useMemo(() => {
    const raw = product.sizes || [];
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
      const prices = (raw as { size: string; price: number }[]).map((s) => Number(s.price)).filter((p) => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return Number(product.price) || 0;
  }, [product.sizes, product.price]);
  
  const inWishlist = wishlist.includes(product.id);
  const inCompare = compare.includes(product.id);

  return (
    <div className="group hover-lift relative overflow-hidden rounded-xl bg-card border border-border/40 transition-all duration-500 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-10">
          <span className={`text-pop-in inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
            product.badge === "Best Seller" ? "bg-gold text-gold-foreground" :
            product.badge === "New" ? "bg-burgundy text-burgundy-foreground" :
            "bg-primary/20 text-primary"
          }`}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          onClick={() => toggleWishlist(product.id)}
          className="grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur opacity-0 transition-all group-hover:opacity-100 hover:bg-gold hover:text-gold-foreground"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-gold text-gold" : ""}`} />
        </button>
        <button
          onClick={() => toggleCompare(product.id)}
          className="grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur opacity-0 transition-all group-hover:opacity-100 hover:bg-gold hover:text-gold-foreground"
          title={inCompare ? "Remove from Compare" : "Add to Compare"}
        >
          <GitCompare className={`h-4 w-4 ${inCompare ? "text-gold" : ""}`} />
        </button>
      </div>

      {/* Image */}
      <a href={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-secondary/60">
        <img
          src={product.images?.[0] || "https://picsum.photos/seed/perfume-default/800/1000"}
          alt={product.name}
          className="img-crossfade-base h-full w-full object-cover group-hover:scale-110"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            className="img-crossfade-top h-full w-full object-cover"
          />
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); setQuickViewId(product.id); }}
            className="flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-4 py-2 text-xs font-medium text-foreground shadow-lg hover:bg-gold hover:text-gold-foreground transition-all"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
        </div>
      </a>

      {/* Details */}
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-gold/70">{product.category}</div>
        <a href={`/product/${product.id}`}>
          <h3 className="mt-1 font-serif text-lg leading-tight text-foreground transition-colors hover:text-gold">{product.name}</h3>
        </a>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.round(Number(product.rating) || 0) ? "fill-gold text-gold" : "text-border"}`} />
                ))}
          </div>
          <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Fragrance notes */}
        {product.notes && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.notes.split(",").slice(0, 3).map((note) => (
              <span key={note.trim()} className="rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] text-muted-foreground">
                {note.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Price - show lowest from sizes */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-serif text-xl text-primary">{formatPrice(lowestPrice)}</span>
          {product.originalPrice && Number(product.originalPrice) > lowestPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(Number(product.originalPrice))}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product.id)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 py-2.5 text-sm font-medium text-gold transition-all hover:bg-gold hover:text-gold-foreground"
        >
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}