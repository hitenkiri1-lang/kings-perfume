import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Home, Crown, Tags, MessageSquare, Settings } from "lucide-react";

const ADMIN_PASSWORD = "king2026";
const AUTH_KEY = "kp:admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — King Perfumes" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const logout = () => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    navigate({ to: "/admin" });
  };

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-card border border-border/40 p-8 shadow-lg">
          <div className="text-center">
            <Crown className="mx-auto h-8 w-8 text-gold" />
            <div className="mt-2 font-serif text-2xl text-primary">King Perfumes</div>
            <p className="mt-2 text-sm text-muted-foreground">Admin access</p>
          </div>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-6 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
          />
          {error && <p className="mt-2 text-sm text-destructive">Incorrect password.</p>}
          <button className="mt-4 w-full rounded-full bg-gold py-3 text-sm font-medium text-gold-foreground hover:opacity-90">Sign In</button>
          <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground">← Back to store</Link>
        </form>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package, exact: false },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
    { to: "/admin/categories", label: "Categories", icon: Tags, exact: false },
    { to: "/admin/messages", label: "Messages", icon: MessageSquare, exact: false },
    { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-64 flex-col bg-card border-r border-border/40 md:flex">
        <div className="flex items-center gap-2 p-6 font-serif text-xl text-gold">
          <Crown className="h-5 w-5" /> King Perfumes
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-border/60 p-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" /> View Store
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4 md:hidden">
          <div className="flex items-center gap-2 font-serif text-lg text-gold">
            <Crown className="h-4 w-4" /> Admin
          </div>
          <button onClick={logout} className="text-sm text-muted-foreground">Logout</button>
        </div>
        <div className="flex gap-4 overflow-x-auto border-b border-border bg-background px-4 py-2 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground hover:text-gold">{n.label}</Link>
          ))}
        </div>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}