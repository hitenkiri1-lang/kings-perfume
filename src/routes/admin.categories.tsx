import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import { useStore, type Category, API_BASE_URL } from "@/store/StoreContext";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, refreshCategories } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { refreshCategories(); }, []);

  // Placeholder images for categories that don't have custom images
  const categoryPlaceholders: Record<string, { img: string; desc: string }> = {
    "Eau de Parfum": { img: "/images/cat-edp.jpg", desc: "Intense, long-lasting luxury" },
    "Eau de Toilette": { img: "/images/cat-edt.jpg", desc: "Fresh, everyday elegance" },
    "Attars & Oils": { img: "/images/cat-attar.jpg", desc: "Pure, concentrated tradition" },
    "Eau de Cologne": { img: "/images/cat-cologne.jpg", desc: "Light, refreshing classics" },
    "Attar": { img: "/images/cat-attar.jpg", desc: "Explore our Attar Collection" },
  };

  const handleDelete = async (c: Category) => {
    if (c.id.startsWith("prod-")) {
      toast.error("This is an existing product category. Remove it from the 'categories' table first, or change it on individual products.");
      return;
    }
    if (confirm(`Delete category "${c.name}"?`)) {
      await deleteCategory(c.id);
      toast.success("Category deleted");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-primary">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card border border-border/40 overflow-hidden group">
          {c.image ? (
              <div className="aspect-video overflow-hidden">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            ) : categoryPlaceholders[c.name] ? (
              <div className="aspect-video overflow-hidden relative">
                <img src={categoryPlaceholders[c.name].img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-gold bg-background/60 px-2 py-1 rounded-full">Default image</span>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-secondary/60 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-serif text-lg text-primary">{c.name}</h3>
              {c.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>}
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(c)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:text-gold">
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => handleDelete(c)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:text-destructive">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full rounded-2xl bg-card border border-border/40 p-12 text-center text-muted-foreground">
            No categories yet. Create your first category.
          </div>
        )}
      </div>

      {(creating || editing) && (
        <CategoryForm
          initial={editing ?? { id: "", name: "", slug: "", image: "", description: "" }}
          isVirtual={editing?.id.startsWith("prod-") ?? false}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSubmit={async (data) => {
            if (editing) {
              if (editing.id.startsWith("prod-")) {
                // For virtual categories, create a real entry in the DB
                await addCategory(data);
                toast.success("Category created in database");
              } else {
                await updateCategory(editing.id, data);
                toast.success("Category updated");
              }
            } else {
              await addCategory(data);
              toast.success("Category created");
            }
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function CategoryForm({ initial, isVirtual, onClose, onSubmit }: { initial: Category; isVirtual: boolean; onClose: () => void; onSubmit: (d: { name: string; image?: string; description?: string }) => void }) {
  const [name, setName] = useState(initial.name);
  const [image, setImage] = useState(initial.image || "");
  const [description, setDescription] = useState(initial.description || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImage(data.url);
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-background p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-primary">{initial.id ? "Edit Category" : "New Category"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, image, description }); }} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Name *</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Description</span>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold" />
          </label>

          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Image</span>
            <div className="mt-2 flex items-center gap-3">
              {image && (
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-border/40">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImage("")} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5">
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="h-20 w-20 rounded-lg border-2 border-dashed border-border/60 flex items-center justify-center hover:border-gold/50">
                {uploading ? <span className="text-xs">Uploading...</span> : <Upload className="h-5 w-5 text-muted-foreground" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Or enter image URL</span>
            <input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold" />
          </label>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm text-foreground">Cancel</button>
            <button className="flex-1 rounded-full bg-gold py-3 text-sm font-medium text-gold-foreground hover:opacity-90">
              {initial.id ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}