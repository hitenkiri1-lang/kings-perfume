import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, type ContactMessage } from "@/store/StoreContext";
import { Mail, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

function AdminMessages() {
  const { contactMessages, refreshContactMessages, markMessageRead, deleteMessage } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { refreshContactMessages(); }, []);

  const handleDelete = async (msg: ContactMessage) => {
    if (confirm(`Delete message from "${msg.name}"?`)) {
      await deleteMessage(msg.id);
      toast.success("Message deleted");
    }
  };

  const handleRead = async (msg: ContactMessage) => {
    if (!msg.is_read) {
      await markMessageRead(msg.id);
    }
    setExpanded(expanded === msg.id ? null : msg.id);
  };

  const unread = contactMessages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-primary">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {contactMessages.length} total{unread > 0 ? ` · ${unread} unread` : ""}
          </p>
        </div>
        <button onClick={refreshContactMessages} className="rounded-full bg-gold/10 px-4 py-2 text-xs text-gold hover:bg-gold hover:text-gold-foreground transition-all">
          Refresh
        </button>
      </div>

      {contactMessages.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-card border border-border/40 p-12 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {contactMessages.map((msg) => (
            <div key={msg.id} className={`rounded-2xl border ${msg.is_read ? "border-border/40 bg-card" : "border-gold/30 bg-gold/5"} overflow-hidden`}>
              <button
                onClick={() => handleRead(msg)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${msg.is_read ? "bg-transparent" : "bg-gold"}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">{msg.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{'<'}{msg.email}{'>'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {msg.subject || "No subject"} · {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg); }}
                    className="p-2 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expanded === msg.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expanded === msg.id && (
                <div className="border-t border-border/60 px-4 py-4">
                  <div className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    From: {msg.name} ({msg.email})<br />
                    Subject: {msg.subject || "N/A"}<br />
                    Date: {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}