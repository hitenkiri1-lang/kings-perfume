import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 md:px-6">
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-8">Shipping & Delivery</h1>
      <div className="prose prose-sm md:prose-base prose-neutral text-muted-foreground leading-relaxed space-y-6">
        <p>Effective Date: {new Date().getFullYear()}</p>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">1. Processing Time</h2>
          <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">2. Shipping Rates & Estimates</h2>
          <p>We offer free standard shipping on all orders over ₹999 within India. For orders under ₹999, a flat shipping rate of ₹99 will be applied at checkout. Delivery typically takes 3-5 business days depending on your location.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">3. Order Tracking</h2>
          <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">4. International Shipping</h2>
          <p>Currently, we only ship within India. We are working on expanding our delivery network to bring King Perfumes to international customers in the near future.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">5. Contact Us</h2>
          <p>If you have any further questions regarding your shipment, please don't hesitate to contact us at support@kingperfumes.com.</p>
        </div>
      </div>
    </div>
  );
}
