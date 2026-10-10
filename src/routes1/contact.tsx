import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/store/StoreContext";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — King Perfumes" },
      { name: "description", content: "Get in touch with King Perfumes. We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject") || "",
          message: formData.get("message"),
        }),
      });
      
      if (res.ok) {
        toast.success("Message sent! We'll be in touch.");
        form.reset();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to send message");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setSending(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <header className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold/70">Say hello</span>
        <h1 className="mt-3 font-serif text-5xl text-primary">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">We reply to every message within 24 hours.</p>
      </header>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "hello@kingperfumes.com" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Studio", value: "12 Perfume Lane, Mumbai 400001" },
          ].map((c) => (
            <div key={c.label} className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="mt-1 text-primary">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-secondary/40 p-8"
        >
          <div className="space-y-4">
            <input required name="name" placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
            <input required type="email" name="email" placeholder="Email address" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
            <input name="subject" placeholder="Subject" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
            <textarea required name="message" rows={5} placeholder="Your message" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-medium text-gold-foreground hover:opacity-90 disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}