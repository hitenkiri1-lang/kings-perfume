import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Verdea" },
      { name: "description", content: "Botanical rituals, skincare stories, and ingredient guides from Verdea." },
    ],
  }),
  component: Blog,
});

const IMG = (s: string) => `https://picsum.photos/seed/${s}/800/600`;

const posts = [
  { title: "The quiet ritual of a botanical morning", excerpt: "How five minutes with the right ingredients can change your entire day.", tag: "Rituals", img: IMG("blog-1") },
  { title: "Why green tea belongs in your serum", excerpt: "The science behind our most-loved antioxidant, explained.", tag: "Ingredients", img: IMG("blog-2") },
  { title: "Meet the farm behind our rosehip oil", excerpt: "A visit to the Himalayan foothills where our rosehip is harvested.", tag: "Sourcing", img: IMG("blog-3") },
  { title: "Sensitive skin: gentle by design", excerpt: "Building a routine for reactive, easily irritated skin.", tag: "Guides", img: IMG("blog-4") },
  { title: "The truth about clean beauty", excerpt: "What 'clean' actually means — and doesn't.", tag: "Essays", img: IMG("blog-5") },
  { title: "Refillable, always: our packaging journey", excerpt: "The three-year process behind our new refill program.", tag: "Sustainability", img: IMG("blog-6") },
];

function Blog() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <header className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-sage">Journal</span>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Stories from the garden</h1>
      </header>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="group cursor-pointer">
            <div className="overflow-hidden rounded-2xl">
              <img src={p.img} alt={p.title} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-5">
              <span className="text-xs uppercase tracking-wider text-sage">{p.tag}</span>
              <h3 className="mt-2 font-serif text-2xl leading-tight group-hover:text-terracotta">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
