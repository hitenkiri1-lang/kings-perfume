import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 md:px-6">
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-8">Privacy Policy</h1>
      <div className="prose prose-sm md:prose-base prose-neutral text-muted-foreground leading-relaxed space-y-6">
        <p>Effective Date: {new Date().getFullYear()}</p>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">1. Information We Collect</h2>
          <p>At King Perfumes, we collect information you provide directly to us when you make a purchase, create an account, subscribe to our newsletter, or contact our customer support. This may include your name, email address, shipping address, and payment information.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect to process transactions, deliver your orders, communicate with you about products and promotions, and improve our services.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">3. Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">4. Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@kingperfumes.com.</p>
        </div>
      </div>
    </div>
  );
}
