import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, ShoppingBag, Crown } from "lucide-react";
import { useStore, formatPrice } from "@/store/StoreContext";

export function CartDrawer() {
  const { cart, products, cartOpen, setCartOpen, updateCart, removeFromCart } = useStore();

  const items = cart.map((c) => {
    const p = products.find((x) => x.id === c.productId);
    if (!p) return null;
    // Get price based on size
    const sizes = p.sizes || [];
    let price = p.price;
    if (Array.isArray(sizes) && sizes.length > 0 && typeof sizes[0] === "object") {
      const matched = (sizes as { size: string; price: number }[]).find((s) => s.size === c.size);
      if (matched) price = matched.price;
    }
    return { ...c, product: p, price };
  }).filter(Boolean) as any[];

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <>
      {cartOpen && <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setCartOpen(false)} />}
      <div className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-xl text-primary">Your Cart</h2>
            </div>
            <button onClick={() => setCartOpen(false)} className="p-1 hover:text-gold">
              <X className="h-5 w-5" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <Crown className="h-12 w-12 text-gold/30" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <button onClick={() => setCartOpen(false)} className="rounded-full bg-gold px-6 py-2.5 text-sm text-gold-foreground">
                <Link to="/shop">Shop Fragrances</Link>
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-4">
                  {items.map((i: any) => (
                    <li key={i.productId + i.size} className="flex gap-4 rounded-xl bg-card border border-border/40 p-3">
                      <img src={i.product.images[0]} alt="" className="h-20 w-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <a href={`/product/${i.productId}`} onClick={() => setCartOpen(false)} className="font-serif text-base text-primary hover:text-gold line-clamp-1">
                          {i.product.name}
                        </a>
                        <div className="mt-1 text-xs text-muted-foreground">{i.size}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-lg border border-border">
                            <button onClick={() => updateCart(i.productId, i.size, i.quantity - 1)} className="p-1.5 hover:text-gold"><Minus className="h-3 w-3" /></button>
                            <span className="w-6 text-center text-xs">{i.quantity}</span>
                            <button onClick={() => updateCart(i.productId, i.size, i.quantity + 1)} className="p-1.5 hover:text-gold"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="font-serif text-sm text-gold">{formatPrice(i.price * i.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(i.productId, i.size)} className="self-start p-1 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border/60 px-6 py-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg text-gold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-medium text-gold-foreground hover:opacity-90 transition-all"
                >
                  Checkout · {formatPrice(subtotal)}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}