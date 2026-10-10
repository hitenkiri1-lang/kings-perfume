import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Package, ShoppingCart, TrendingUp, Crown } from "lucide-react";
import { useStore, formatPrice } from "@/store/StoreContext";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, orders, refreshOrders } = useStore();
  const activeProducts = products.filter(p => p.status === "active");
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0);

  useEffect(() => { refreshOrders(); }, []);

  const stats = [
    { icon: Package, label: "Total Products", value: products.length },
    { icon: Crown, label: "Active", value: activeProducts.length },
    { icon: ShoppingCart, label: "Orders", value: orders.length },
    { icon: TrendingUp, label: "Revenue", value: orders.length > 0 ? formatPrice(totalRevenue) : "—" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of King Perfumes store.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border/40 p-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-serif text-3xl text-primary">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card border border-border/40 p-6">
          <h3 className="font-serif text-xl text-primary">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              {orders.slice(0, 5).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <div className="font-medium text-foreground">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.id} · {new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold">{formatPrice(o.total)}</div>
                    <div className={`text-xs ${o.order_status === "Delivered" ? "text-green-500" : "text-gold"}`}>{o.order_status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-card border border-border/40 p-6">
          <h3 className="font-serif text-xl text-primary">Low Stock Alert</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {products.filter((p) => p.stock < 20).slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0] || ""} alt="" className="h-10 w-10 rounded object-cover" />
                  <div className="text-foreground">{p.name}</div>
                </div>
                <div className="text-destructive">{p.stock} left</div>
              </li>
            ))}
            {products.filter((p) => p.stock < 20).length === 0 && (
              <p className="text-muted-foreground text-sm">All products are well-stocked.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}