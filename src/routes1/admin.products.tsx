import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import { useStore, formatPrice, type Product, API_BASE_URL } from "@/store/StoreContext";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type SizeOption = { size: string; price: number };
type FormState = Omit<Product, "id" | "rating" | "reviewCount"> & { rating?: number; reviewCount?: number; sizes: SizeOption[] };

const empty: FormState = {
  name: "", slug: "", category: "", price: 0, originalPrice: undefined,
  description: "", notes: "", topNotes: "", middleNotes: "", baseNotes: "", howToUse: "",
  images: [""], sizes: [{ size: "50ml", price: 0 }], gender: "Unisex", stock: 0, badge: undefined, status: "active",
  rating: 4.5, reviewCount: 0,
};

function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, categories, refreshCategories } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { refreshCategories(); }, []);

  // Merge categories from categories table + existing product categories
  const allCategories = useMemo(() => {
    const catNames = new Set(categories.map((c) => c.name));
    // Add any categories from existing products that aren't in the categories table
    products.forEach((p) => {
      if (p.category && !catNames.has(p.category)) {
        catNames.add(p.category);
      }
    });
    return Array.from(catNames).sort();
  }, [categories, products]);

  const handleDelete = async (p: Product) => {
    if (confirm(`Delete "${p.name}"?`)) {
      await deleteProduct(p.id);
      toast.success("Deleted");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-primary">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} fragrances in catalog</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-card border border-border/40">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              // Calculate display price as lowest from sizes
              const displayPrice = getLowestPrice(p);
              return (
                <tr key={p.id} className="border-t border-border/60">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || ""} alt="" className="h-12 w-12 rounded object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.slug} · {p.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{p.category}</td>
                  <td className="p-4 text-gold">{formatPrice(displayPrice)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === "active" ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="p-2 hover:text-gold"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(p)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ProductForm
          initial={editing ? convertProductToForm(editing) : empty}
          categories={allCategories}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSubmit={async (data) => {
            // Auto-calculate price as the lowest size price
            const prices = data.sizes.map((s) => s.price).filter((p) => p > 0);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            
            const productData = {
              ...data,
              price: minPrice, // Set the product price to the lowest size price
              sizes: data.sizes,
              rating: data.rating ?? 4.5,
              reviewCount: data.reviewCount ?? 0,
            };
            if (editing) {
              await updateProduct(editing.id, productData as any);
              toast.success("Product updated");
            } else {
              await addProduct(productData as any);
              toast.success("Product added");
            }
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

// Helper to get the lowest price from a product's sizes
function getLowestPrice(p: Product): number {
  const raw = p.sizes || [];
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
    const prices = (raw as { size: string; price: number }[]).map((s) => Number(s.price)).filter((p) => p > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  return Number(p.price) || 0;
}

function convertProductToForm(p: Product): FormState {
  const sizes: SizeOption[] = [];
  const rawSizes = p.sizes || ["50ml"];
  if (Array.isArray(rawSizes) && rawSizes.length > 0) {
    if (typeof rawSizes[0] === "object") {
      return {
        ...p,
        sizes: rawSizes as SizeOption[],
        originalPrice: undefined, // Remove originalPrice
        rating: p.rating,
        reviewCount: p.reviewCount,
      };
    }
    // Old format - convert
    for (const s of rawSizes as string[]) {
      sizes.push({ size: s, price: s === "50ml" ? Number(p.price) : Math.round(Number(p.price) * 1.5) });
    }
  }
  return {
    ...p,
    sizes: sizes.length > 0 ? sizes : [{ size: "50ml", price: Number(p.price) || 0 }],
    originalPrice: undefined, // Remove originalPrice
    rating: p.rating,
    reviewCount: p.reviewCount,
  };
}

function ProductForm({ initial, categories, onClose, onSubmit }: { initial: FormState; categories: string[]; onClose: () => void; onSubmit: (d: FormState) => void }) {
  const [form, setForm] = useState<FormState>(initial);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls) {
        const currentImages = form.images.filter((img) => img !== "");
        update("images", [...currentImages, ...data.urls]);
        toast.success(`${data.urls.length} image(s) uploaded`);
      }
    } catch (err) {
      toast.error("Upload failed");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addSizeOption = () => {
    update("sizes", [...form.sizes, { size: "", price: 0 }]);
  };

  const updateSizeOption = (index: number, field: keyof SizeOption, value: string | number) => {
    const newSizes = [...form.sizes];
    (newSizes[index] as any)[field] = value;
    update("sizes", newSizes);
  };

  const removeSizeOption = (index: number) => {
    update("sizes", form.sizes.filter((_, i) => i !== index));
  };

  // Calculate lowest price from sizes for display
  const lowestPrice = useMemo(() => {
    const prices = form.sizes.map((s) => s.price).filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }, [form.sizes]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-background p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-primary">{initial.name ? "Edit fragrance" : "New fragrance"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="mt-8 space-y-4">
          <Field label="Name" value={form.name} onChange={(v) => { update("name", v); if (!initial.name) update("slug", v.toLowerCase().replace(/\s+/g, "-")); }} required />
          <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} required />
          
          {/* Category dropdown */}
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Category</span>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          {/* Removed: Original Price field */}
          
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock" type="number" value={String(form.stock)} onChange={(v) => update("stock", +v)} />
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Gender</span>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold">
                <option>Unisex</option>
                <option>Men</option>
                <option>Women</option>
              </select>
            </label>
          </div>

          {/* Customize Size with Prices */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Sizes & Prices</span>
              <button type="button" onClick={addSizeOption} className="text-xs text-gold hover:underline">+ Add Size</button>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground mb-2">
              {lowestPrice > 0 ? `Display price on cards: ${formatPrice(lowestPrice)} (lowest size)` : "Add at least one size with a price"}
            </p>
            <div className="mt-2 space-y-2">
              {form.sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. 50ml"
                    value={s.size}
                    onChange={(e) => updateSizeOption(i, "size", e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={s.price || ""}
                    onChange={(e) => updateSizeOption(i, "price", +e.target.value)}
                    className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
                  />
                  {form.sizes.length > 1 && (
                    <button type="button" onClick={() => removeSizeOption(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Define each size option with its own price. These will be shown on the product page.</p>
          </div>

          <TextArea label="Description" value={form.description} onChange={(v) => update("description", v)} />
          <Field label="Notes (comma separated)" value={form.notes} onChange={(v) => update("notes", v)} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Top Notes" value={form.topNotes} onChange={(v) => update("topNotes", v)} />
            <Field label="Heart Notes" value={form.middleNotes} onChange={(v) => update("middleNotes", v)} />
            <Field label="Base Notes" value={form.baseNotes} onChange={(v) => update("baseNotes", v)} />
          </div>
          <TextArea label="How to use" value={form.howToUse} onChange={(v) => update("howToUse", v)} />

          {/* Image Upload */}
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Images</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {form.images.filter((img) => img).map((img, i) => (
                <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-border/40">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => update("images", form.images.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="h-20 w-20 rounded-lg border-2 border-dashed border-border/60 flex items-center justify-center hover:border-gold/50 transition-all"
              >
                {uploading ? (
                  <span className="text-xs text-muted-foreground">Uploading...</span>
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Click the upload button to upload images from your computer</p>
          </div>

          {/* URL images */}
          <Field label="Or enter image URLs (comma separated)" value={form.images.join(", ")} onChange={(v) => update("images", v.split(",").map((s) => s.trim()).filter(Boolean))} />

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Badge</span>
              <select value={form.badge ?? ""} onChange={(e) => update("badge", (e.target.value || undefined) as FormState["badge"])} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground">
                <option value="">None</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New">New</option>
                <option value="Featured">Featured</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Status</span>
              <select value={form.status} onChange={(e) => update("status", e.target.value as "active" | "draft")} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm text-foreground">Cancel</button>
            <button className="flex-1 rounded-full bg-gold py-3 text-sm font-medium text-gold-foreground hover:opacity-90">
              {initial.name ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold" />
    </label>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold" />
    </label>
  );
}