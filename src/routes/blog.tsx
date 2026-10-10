import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — King Perfumes" },
      { name: "description", content: "Fragrance rituals, ingredient stories, and style guides from King Perfumes." },
    ],
  }),
  component: Blog,
});

const IMG = (s: string) => `/images/${s.replace('perfume-', '')}.jpg`;

const posts = [
  { 
    title: "The Quiet Ritual of Applying Perfume", 
    excerpt: "How five minutes with the right fragrance can set your intentions and change your entire day.", 
    tag: "Rituals", 
    date: "Oct 12, 2026",
    img: IMG("perfume-blog-1") 
  },
  { 
    title: "Why Oud belongs in your winter collection", 
    excerpt: "The science and history behind perfumery's most expensive and loved woody note, explained.", 
    tag: "Ingredients", 
    date: "Oct 05, 2026",
    img: IMG("perfume-blog-2") 
  },
  { 
    title: "Meet the artisans behind our Damask Rose", 
    excerpt: "A visual journey to the blooming valleys where our signature rose absolute is harvested at dawn.", 
    tag: "Sourcing", 
    date: "Sep 28, 2026",
    img: IMG("perfume-blog-3") 
  },
  { 
    title: "Layering Scents: The Ultimate Guide", 
    excerpt: "Learn how to masterfully combine different perfumes to create a bespoke scent uniquely yours.", 
    tag: "Guides", 
    date: "Sep 15, 2026",
    img: IMG("perfume-blog-4") 
  },
  { 
    title: "The Truth About Niche Perfumery", 
    excerpt: "What separates designer fragrances from niche houses, and why the distinction matters.", 
    tag: "Essays", 
    date: "Sep 02, 2026",
    img: IMG("perfume-blog-5") 
  },
  { 
    title: "Sustainable Luxury: Our Glass Initiative", 
    excerpt: "The multi-year design process behind our new heavy-weight, completely recyclable glass bottles.", 
    tag: "Sustainability", 
    date: "Aug 20, 2026",
    img: IMG("perfume-blog-6") 
  },
];

function Blog() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="pt-32 pb-16 bg-card border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal variant="fadeUp">
            <BookOpen className="w-8 h-8 text-gold mx-auto mb-6" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">The Journal</span>
            <h1 className="mt-4 font-serif text-5xl md:text-7xl text-primary">Scent Stories</h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto font-light">
              Dive into the world of luxury perfumery. Read about our ingredient sourcing, styling guides, and the art of fragrance layering.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <div className="mx-auto max-w-[1320px] px-6 mt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} variant="fadeUp">
              <motion.article 
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
              >
                <div className="overflow-hidden aspect-[4/3] relative">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                    {p.tag}
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="text-xs text-muted-foreground mb-3">{p.date}</div>
                  <h3 className="font-serif text-2xl leading-tight text-primary group-hover:text-gold transition-colors line-clamp-2 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed flex-1 line-clamp-3">
                    {p.excerpt}
                  </p>
                  <div className="mt-6 pt-6 border-t border-border/50 flex items-center text-sm font-medium text-primary group-hover:text-gold transition-colors">
                    Read Story <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
        
        <Reveal variant="fadeUp" delay={0.4} className="mt-20 text-center">
          <button className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-transparent px-8 py-3.5 text-sm font-medium text-primary transition-all hover:bg-gold hover:text-white hover:border-gold shadow-sm">
            Load More Stories
          </button>
        </Reveal>
      </div>
    </div>
  );
}
