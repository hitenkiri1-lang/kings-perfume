import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useStore, formatPrice, API_BASE_URL } from "@/store/StoreContext";
import { CheckCircle2, Loader2, Crown, Info } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — King Perfumes" }] }),
  component: Checkout,
});

function Checkout() {
  const { cart, products, clearCart, customerDetails, setCustomerDetails, setLastOrder, settings, refreshSettings } = useStore();
  const [payment, setPayment] = useState<"razorpay" | "cod">("razorpay");
  const [state, setState] = useState<"form" | "processing" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => { refreshSettings(); }, []);

  const items = useMemo(() => cart.map((c) => {
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
  }).filter(Boolean) as any[], [cart, products]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  // COD percentage split
  const codPercentage = parseFloat(settings.cod_percentage || "0");
  const codOnlineAmount = payment === "cod" && codPercentage > 0 ? Math.round(total * (codPercentage / 100)) : 0;
  const codCashAmount = total - codOnlineAmount;

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve) => {
      if ((window as any).Razorpay) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("processing");
    setErrorMsg("");

    try {
      // For COD with percentage split, we need to process the online portion first
      if (payment === "cod" && codOnlineAmount > 0) {
        // Create a razorpay order for the online portion only
        const orderRes = await fetch(`${API_BASE_URL}/orders`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone,
            address: customerDetails.address,
            city: customerDetails.city,
            state: customerDetails.state,
            pincode: customerDetails.pincode,
            items: cart.map((c) => ({ productId: c.productId, size: c.size, quantity: c.quantity })),
            paymentMethod: "razorpay",
          }),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json();
          throw new Error(err.error || "Failed to create order");
        }

        const orderData = await orderRes.json();

        // Open Razorpay for the online portion
        await loadRazorpayScript();

        const options = {
          key: orderData.razorpayOrder.key_id,
          amount: Math.round(codOnlineAmount * 100),
          currency: "INR",
          name: "King Perfumes",
          description: `COD deposit for Order ${orderData.orderId}`,
          order_id: orderData.razorpayOrder.id,
          prefill: {
            name: customerDetails.name,
            email: customerDetails.email,
            contact: customerDetails.phone,
          },
          theme: { color: "#c8a45c" },
          handler: async (response: any) => {
            // Verify payment
            await fetch(`${API_BASE_URL}/orders/verify`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                orderId: orderData.orderId,
              }),
            });

            setLastOrder({ 
              orderId: orderData.orderId, 
              total, 
              paymentId: response.razorpay_payment_id,
              codOnlinePaid: codOnlineAmount,
              codCashDue: codCashAmount
            });
            setState("success");
            clearCart();
          },
          modal: {
            ondismiss: () => {
              setState("form");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      // Standard order creation (full razorpay or full COD)
      const orderRes = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          pincode: customerDetails.pincode,
          items: cart.map((c) => ({ productId: c.productId, size: c.size, quantity: c.quantity })),
          paymentMethod: payment,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Failed to create order");
      }

      const orderData = await orderRes.json();

      if (payment === "cod") {
        setLastOrder({ orderId: orderData.orderId, total: orderData.total });
        setState("success");
        clearCart();
        return;
      }

      // Razorpay payment
      await loadRazorpayScript();

      const options = {
        key: orderData.razorpayOrder.key_id,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "King Perfumes",
        description: `Order ${orderData.orderId}`,
        order_id: orderData.razorpayOrder.id,
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        theme: { color: "#c8a45c" },
        handler: async (response: any) => {
          await fetch(`${API_BASE_URL}/orders/verify`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              orderId: orderData.orderId,
            }),
          });

          setLastOrder({ orderId: orderData.orderId, total: orderData.total, paymentId: response.razorpay_payment_id });
          setState("success");
          clearCart();
        },
        modal: {
          ondismiss: () => {
            setState("form");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
      setState("error");
    }
  };

  if (state === "processing") {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
        <div>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold" />
          <p className="mt-4 font-serif text-2xl">Processing your order…</p>
          <p className="mt-2 text-sm text-muted-foreground">Please don't refresh this page.</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
        <div>
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/20 flex items-center justify-center">
            <span className="text-2xl text-destructive">!</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl">Order Failed</h1>
          <p className="mt-3 text-muted-foreground">{errorMsg}</p>
          <button onClick={() => setState("form")} className="mt-8 rounded-full bg-gold px-8 py-3 text-sm text-gold-foreground">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
        <div>
          <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
          <h1 className="mt-4 font-serif text-4xl">Order Placed! 👑</h1>
          <p className="mt-3 text-muted-foreground">Your royal fragrance order has been confirmed. A confirmation has been sent to your email.</p>
          <Link to="/shop" className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm text-gold-foreground">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Crown className="mx-auto h-12 w-12 text-gold/50" />
        <h1 className="mt-4 font-serif text-3xl">Your cart is empty</h1>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm text-gold-foreground">Shop Fragrances</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-serif text-4xl text-primary">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Guest checkout — your details are saved for next time.</p>

      <form onSubmit={placeOrder} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-primary">Contact & Shipping</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Full name" value={customerDetails.name} onChange={(v) => setCustomerDetails({ ...customerDetails, name: v })} required />
              <Field label="Email" type="email" value={customerDetails.email} onChange={(v) => setCustomerDetails({ ...customerDetails, email: v })} required />
              <Field label="Phone" type="tel" value={customerDetails.phone} onChange={(v) => setCustomerDetails({ ...customerDetails, phone: v })} required />
              <Field label="Pincode" value={customerDetails.pincode} onChange={(v) => setCustomerDetails({ ...customerDetails, pincode: v })} required />
              <Field label="Address" value={customerDetails.address} onChange={(v) => setCustomerDetails({ ...customerDetails, address: v })} required className="sm:col-span-2" />
              <Field label="City" value={customerDetails.city} onChange={(v) => setCustomerDetails({ ...customerDetails, city: v })} required />
              <Field label="State" value={customerDetails.state} onChange={(v) => setCustomerDetails({ ...customerDetails, state: v })} required />
              <Field label="Country" value="India" disabled />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-primary">Payment</h2>
            <div className="mt-4 space-y-3">
              <PaymentOption
                selected={payment === "razorpay"}
                onSelect={() => setPayment("razorpay")}
                title="Razorpay"
                desc="Cards · UPI · Net Banking · Wallets"
              />
              <PaymentOption
                selected={payment === "cod"}
                onSelect={() => setPayment("cod")}
                title="Cash on Delivery"
                desc={codPercentage > 0 ? `Pay ${codPercentage}% (${formatPrice(codOnlineAmount)}) online & ${formatPrice(codCashAmount)} on delivery` : "Pay when your order arrives"}
              />
            </div>
            {payment === "cod" && codPercentage > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-gold/5 border border-gold/20 p-3 text-xs text-muted-foreground">
                <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <p>
                  As per store policy, {codPercentage}% of the order amount ({formatPrice(codOnlineAmount)}) will be charged online via Razorpay. 
                  The remaining {formatPrice(codCashAmount)} will be collected at delivery.
                </p>
              </div>
            )}
          </section>

          <button type="submit" className="w-full rounded-full bg-gold py-4 font-medium text-gold-foreground hover:opacity-90 lg:hidden">
            Place Order · {formatPrice(total)}
          </button>
        </div>

        <aside className="h-fit rounded-2xl bg-card border border-border/40 p-6">
          <h3 className="font-serif text-xl text-primary">Order Summary</h3>
          <ul className="mt-4 space-y-3 border-b border-border/60 pb-4">
            {items.map((i: any) => (
              <li key={i.productId + i.size} className="flex gap-3">
                <img src={i.product.images?.[0] || ""} alt="" className="h-14 w-12 rounded object-cover" />
                <div className="flex-1 text-sm">
                  <div className="line-clamp-1">{i.product.name}</div>
                  <div className="text-xs text-muted-foreground">{i.size} × {i.quantity}</div>
                </div>
                <div className="text-sm">{formatPrice(i.price * i.quantity)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            {payment === "cod" && codPercentage > 0 && (
              <>
                <Row label={`Online (${codPercentage}%)`} value={formatPrice(codOnlineAmount)} />
                <Row label="Pay on Delivery" value={formatPrice(codCashAmount)} />
              </>
            )}
            <div className="mt-3 flex justify-between border-t border-border/60 pt-3 text-base">
              <span>Total</span>
              <span className="font-medium text-gold">{formatPrice(total)}</span>
            </div>
          </dl>
          <button type="submit" className="mt-6 hidden w-full rounded-full bg-gold py-3.5 text-sm font-medium text-gold-foreground hover:opacity-90 lg:block">
            Place Order · {formatPrice(total)}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, className = "", ...props }: { label: string; value?: string; onChange?: (v: string) => void; className?: string; [key: string]: any }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...props}
        value={value}
        onChange={(e: any) => onChange?.(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
      />
    </label>
  );
}

function PaymentOption({ selected, onSelect, title, desc }: { selected: boolean; onSelect: () => void; title: string; desc: string }) {
  return (
    <button type="button" onClick={onSelect} className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition ${selected ? "border-gold bg-gold/5" : "border-border"}`}>
      <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selected ? "border-gold" : "border-border"}`}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
      </span>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground">{value}</span></div>;
}