import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 md:px-6">
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-8">Returns & Exchanges</h1>
      <div className="prose prose-sm md:prose-base prose-neutral text-muted-foreground leading-relaxed space-y-6">
        <p>Effective Date: {new Date().getFullYear()}</p>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">1. Return Policy</h2>
          <p>We accept returns up to 30 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">2. Conditions for Returns</h2>
          <p>Due to the nature of our products, fragrances must be returned unopened, in their original cellophane wrapping and packaging. We cannot accept returns of products that have been unsealed or used, for hygiene reasons.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">3. Damaged or Defective Items</h2>
          <p>In the event that your order arrives damaged in any way, please email us as soon as possible at support@kingperfumes.com with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">4. Exchanges</h2>
          <p>If you wish to exchange an unopened fragrance for a different scent, please initiate a return for the original item and place a new order for the desired fragrance on our website.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">5. Process a Return</h2>
          <p>To initiate a return, please contact our customer support team at support@kingperfumes.com with your order details. We will provide you with instructions on where to send your package.</p>
        </div>
      </div>
    </div>
  );
}
