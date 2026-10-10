import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 md:px-6">
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-8">Terms of Service</h1>
      <div className="prose prose-sm md:prose-base prose-neutral text-muted-foreground leading-relaxed space-y-6">
        <p>Effective Date: {new Date().getFullYear()}</p>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using the King Perfumes website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">2. Products and Pricing</h2>
          <p>All products are subject to availability. We reserve the right to modify prices or discontinue any product at any time without notice. We have made every effort to display as accurately as possible the colors and images of our products.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">3. User Accounts</h2>
          <p>If you create an account, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">4. Intellectual Property</h2>
          <p>All content on this site, including text, graphics, logos, and images, is the property of King Perfumes and protected by international copyright laws.</p>
        </div>
        
        <div>
          <h2 className="text-primary font-bold text-xl mb-2">5. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website.</p>
        </div>
      </div>
    </div>
  );
}
