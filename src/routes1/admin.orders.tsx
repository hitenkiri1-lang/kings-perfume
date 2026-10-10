import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatPrice } from "@/store/StoreContext";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

function AdminOrders() {
  const { orders, refreshOrders, updateOrderStatus } = useStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => { refreshOrders(); }, []);

  const handleStatusChange = async (orderId: string, order_status: string) => {
    await updateOrderStatus(orderId, order_status);
    toast.success(`Order ${orderId}: ${order_status}`);
  };

  const handlePaymentChange = async (orderId: string, payment_status: string) => {
    await updateOrderStatus(orderId, undefined as any, payment_status);
    toast.success(`Payment: ${payment_status}`);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <button onClick={refreshOrders} className="rounded-full bg-gold/10 px-4 py-2 text-xs text-gold hover:bg-gold hover:text-gold-foreground transition-all">
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-card border border-border/40 p-12 text-center">
          <p className="text-muted-foreground">No orders yet. Complete a purchase to see orders here.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="rounded-2xl bg-card border border-border/40 overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => toggleExpand(o.id)}
                className="flex w-full items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{o.id}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_name} · {new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gold">{formatPrice(o.total)}</div>
                    <div className={`text-xs ${o.order_status === "Delivered" ? "text-green-500" : o.order_status === "Cancelled" ? "text-destructive" : "text-gold"}`}>
                      {o.order_status}
                    </div>
                  </div>
                  {expandedOrder === o.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded Order Detail */}
              {expandedOrder === o.id && (
                <div className="border-t border-border/60">
                  {/* Customer Details */}
                  <div className="grid gap-4 p-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Customer Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {o.customer_name}</p>
                        <p><span className="text-muted-foreground">Email:</span> {o.customer_email}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {o.customer_phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Shipping Address</h4>
                      <div className="space-y-1 text-sm">
                        <p>{o.address}</p>
                        <p>{o.city}, {o.state} - {o.pincode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items / Bill */}
                  <div className="border-t border-border/60 px-4 py-4">
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Order Items</h4>
                    <table className="w-full text-sm">
                      <thead className="text-xs text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="pb-2 text-left">Product</th>
                          <th className="pb-2 text-left">Size</th>
                          <th className="pb-2 text-left">Qty</th>
                          <th className="pb-2 text-right">Price</th>
                          <th className="pb-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(o.items || []).map((item: any, i: number) => (
                          <tr key={i} className="border-b border-border/40">
                            <td className="py-2">{item.product_name}</td>
                            <td className="py-2">{item.size}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2 text-right">{formatPrice(item.price)}</td>
                            <td className="py-2 text-right">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Bill Summary */}
                    <div className="mt-4 space-y-1 text-sm border-t border-border/60 pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(o.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{o.shipping === 0 ? "Free" : formatPrice(o.shipping)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-base text-gold border-t border-border/60 pt-2 mt-2">
                        <span>Total</span>
                        <span>{formatPrice(o.total)}</span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Payment Method</h4>
                        <div className="text-sm">{o.payment_method === "razorpay" ? "Razorpay (Online)" : "Cash on Delivery"}</div>
                        {o.razorpay_payment_id && (
                          <div className="text-xs text-muted-foreground mt-1">Payment ID: {o.razorpay_payment_id}</div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Order Status</h4>
                        <div className="flex gap-2">
                          <select
                            value={o.order_status || "Processing"}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                              o.order_status === "Delivered" ? "border-green-500/30 text-green-500 bg-green-500/5" :
                              o.order_status === "Cancelled" ? "border-destructive/30 text-destructive bg-destructive/5" :
                              o.order_status === "Shipped" ? "border-gold/30 text-gold bg-gold/5" :
                              "border-border/60 text-foreground bg-background"
                            }`}
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <select
                            value={o.payment_status || "pending"}
                            onChange={(e) => handlePaymentChange(o.id, e.target.value)}
                            className="rounded border border-border/60 bg-background px-2 py-1 text-[10px] text-foreground"
                          >
                            {PAYMENT_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-1">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${
                            o.payment_status === "paid" ? "bg-green-500/15 text-green-500" :
                            o.payment_status === "failed" ? "bg-destructive/15 text-destructive" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {o.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}