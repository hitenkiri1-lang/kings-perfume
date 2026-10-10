import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

const API_BASE = "https://king-backend-nu.vercel.app/api";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  notes: string;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  howToUse: string;
  images: string[];
  sizes: string[] | { size: string; price: number }[];
  gender: string;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: "Best Seller" | "New" | "Featured";
  status: string;
  noteImages?: { name: string; url: string }[];
  reviews?: { id?: string; rating: number; text: string; author: string }[];
};

export type CartItem = { productId: string; size: string; quantity: number };

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
};

type StoreContextType = {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (productId: string, size?: string, quantity?: number) => void;
  updateCart: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickViewId: string | null;
  setQuickViewId: (id: string | null) => void;
  customerDetails: CustomerDetails;
  setCustomerDetails: (d: CustomerDetails) => void;
  lastOrder: any;
  setLastOrder: (o: any) => void;
  orders: any[];
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: string, paymentStatus?: string) => Promise<void>;
  // New: Categories
  categories: Category[];
  refreshCategories: () => Promise<void>;
  addCategory: (c: { name: string; image?: string; description?: string }) => Promise<void>;
  updateCategory: (id: string, c: { name?: string; image?: string; description?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // New: Contact Messages
  contactMessages: ContactMessage[];
  refreshContactMessages: () => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  // New: Settings
  settings: Record<string, string>;
  refreshSettings: () => Promise<void>;
  updateSettings: (s: Record<string, string>) => Promise<void>;
};

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const defaultCustomer: CustomerDetails = {
  name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
};

const StoreContext = createContext<StoreContextType | null>(null);

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setState(JSON.parse(stored));
    } catch {}
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [cart, setCart] = useLocalStorage<CartItem[]>("kp:cart", []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>("kp:wishlist", []);
  const [compare, setCompare] = useLocalStorage<string[]>("kp:compare", []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useLocalStorage<CustomerDetails>("kp:customer", defaultCustomer);
  const [lastOrder, setLastOrder] = useLocalStorage<any>("kp:lastOrder", null);

  const refreshProducts = async () => {
    try {
      const r = await fetch(`${API_BASE}/products?limit=100`);
      const data = await r.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.warn("Backend not available");
    }
  };

  const refreshOrders = async () => {
    try {
      const r = await fetch(`${API_BASE}/orders`);
      const data = await r.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {
      console.warn("Could not fetch orders");
    }
  };

  const refreshCategories = async () => {
    try {
      const r = await fetch(`${API_BASE}/categories`);
      const data = await r.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.warn("Could not fetch categories");
    }
  };

  const refreshContactMessages = async () => {
    try {
      const r = await fetch(`${API_BASE}/contact`);
      const data = await r.json();
      if (Array.isArray(data)) setContactMessages(data);
    } catch (e) {
      console.warn("Could not fetch contact messages");
    }
  };

  const refreshSettings = async () => {
    try {
      const r = await fetch(`${API_BASE}/settings`);
      const data = await r.json();
      if (data) setSettings(data);
    } catch (e) {
      console.warn("Could not fetch settings");
    }
  };

  useEffect(() => { refreshProducts(); }, []);
  useEffect(() => { refreshCategories(); }, []);

  const addProduct = async (p: Omit<Product, "id">) => {
    const r = await fetch(`${API_BASE}/products`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(p),
    });
    if (r.ok) await refreshProducts();
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    const r = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(p),
    });
    if (r.ok) await refreshProducts();
  };

  const deleteProduct = async (id: string) => {
    const r = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    if (r.ok) await refreshProducts();
  };

  const updateOrderStatus = async (id: string, order_status: string, payment_status?: string) => {
    const r = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify({ order_status, payment_status }),
    });
    if (r.ok) await refreshOrders();
  };

  const addCategory = async (c: { name: string; image?: string; description?: string }) => {
    const r = await fetch(`${API_BASE}/categories`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(c),
    });
    if (r.ok) await refreshCategories();
  };

  const updateCategory = async (id: string, c: { name?: string; image?: string; description?: string }) => {
    const r = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(c),
    });
    if (r.ok) await refreshCategories();
  };

  const deleteCategory = async (id: string) => {
    const r = await fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" });
    if (r.ok) await refreshCategories();
  };

  const markMessageRead = async (id: string) => {
    const r = await fetch(`${API_BASE}/contact/${id}/read`, { method: "PUT" });
    if (r.ok) await refreshContactMessages();
  };

  const deleteMessage = async (id: string) => {
    const r = await fetch(`${API_BASE}/contact/${id}`, { method: "DELETE" });
    if (r.ok) await refreshContactMessages();
  };

  const updateSettingsFn = async (s: Record<string, string>) => {
    const r = await fetch(`${API_BASE}/settings`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify(s),
    });
    if (r.ok) await refreshSettings();
  };

  const value = useMemo<StoreContextType>(() => ({
    products, orders, refreshProducts, refreshOrders, updateOrderStatus,
    addProduct, updateProduct, deleteProduct,
    categories, refreshCategories, addCategory, updateCategory, deleteCategory,
    contactMessages, refreshContactMessages, markMessageRead, deleteMessage,
    settings, refreshSettings, updateSettings: updateSettingsFn,
    cart,
    addToCart: (productId, size, quantity = 1) => {
      const prod = products.find((p) => p.id === productId);
      const sizes = prod?.sizes || [];
      let defaultSize = "50ml";
      if (Array.isArray(sizes) && sizes.length > 0) {
        defaultSize = typeof sizes[0] === "object" ? (sizes[0] as any).size || "50ml" : sizes[0];
      }
      const sz = size ?? defaultSize;
      const idx = cart.findIndex((c) => c.productId === productId && c.size === sz);
      if (idx >= 0) {
        toast.success(`Added ${quantity} more to cart`);
        setCart((prev) => {
          const newIdx = prev.findIndex((c) => c.productId === productId && c.size === sz);
          if (newIdx >= 0) {
            const copy = [...prev];
            copy[newIdx] = { ...copy[newIdx], quantity: copy[newIdx].quantity + quantity };
            return copy;
          }
          return prev;
        });
      } else {
        toast.success("Added to cart");
        setCart((prev) => [...prev, { productId, size: sz, quantity }]);
      }
    },
    updateCart: (productId, size, quantity) => setCart((prev) =>
      quantity <= 0
        ? prev.filter((c) => !(c.productId === productId && c.size === size))
        : prev.map((c) => (c.productId === productId && c.size === size ? { ...c, quantity } : c))
    ),
    removeFromCart: (productId, size) => {
      setCart((prev) => prev.filter((c) => !(c.productId === productId && c.size === size)));
      toast.info("Removed from cart");
    },
    clearCart: () => { setCart([]); refreshOrders(); toast.success("Cart cleared"); },
    wishlist,
    toggleWishlist: (id) => {
      const targetId = String(id);
      const isInWishlist = wishlist.some((x) => String(x) === targetId);
      if (isInWishlist) {
        toast.info("Removed from wishlist");
        setWishlist((prev) => prev.filter((x) => String(x) !== targetId));
      } else {
        toast.success("Added to wishlist");
        setWishlist((prev) => [...prev, targetId]);
      }
    },
    compare,
    toggleCompare: (id) => {
      const isInCompare = compare.includes(id);
      if (isInCompare) {
        toast.info("Removed from compare");
        setCompare((prev) => prev.filter((x) => x !== id));
      } else {
        if (compare.length >= 4) {
          toast.error("You can only compare up to 4 items");
          return;
        }
        toast.success("Added to compare");
        setCompare((prev) => [...prev, id]);
      }
    },
    cartOpen, setCartOpen, searchOpen, setSearchOpen, quickViewId, setQuickViewId,
    customerDetails, setCustomerDetails, lastOrder, setLastOrder,
  }), [products, orders, categories, contactMessages, settings, cart, wishlist, compare, cartOpen, searchOpen, quickViewId, customerDetails, lastOrder]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const API_BASE_URL = API_BASE;