import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/store/StoreContext";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { settings, refreshSettings, updateSettings } = useStore();
  const [codPercentage, setCodPercentage] = useState("0");
  const [saving, setSaving] = useState(false);

  useEffect(() => { refreshSettings(); }, []);

  useEffect(() => {
    if (settings.cod_percentage !== undefined) {
      setCodPercentage(settings.cod_percentage);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ cod_percentage: codPercentage });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Configure store settings.</p>

      <div className="mt-8 max-w-lg">
        <form onSubmit={handleSave} className="rounded-2xl bg-card border border-border/40 p-6 space-y-6">
          <div>
            <h3 className="font-serif text-xl text-primary">Payment Settings</h3>
            <p className="mt-1 text-xs text-muted-foreground">Configure payment-related settings for the store.</p>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Cash on Delivery - Online Payment Percentage (%)</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={codPercentage}
                onChange={(e) => setCodPercentage(e.target.value)}
                className="w-24 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Example: If set to 3%, for a ₹3000 order, ₹90 will be paid online via Razorpay and ₹2910 will be collected as Cash on Delivery.
            </p>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-gold-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}