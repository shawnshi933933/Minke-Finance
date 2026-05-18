import { useState, useEffect } from "react";
import { useListDocPages, useGetDocContent } from "@workspace/api-client-react";
import { Link } from "wouter";
import { BookOpen, Save, LogOut, Check, AlertCircle, Eye, EyeOff, ChevronRight } from "lucide-react";
import { groupBySection } from "@/lib/nav";
import DocContent from "@/components/DocContent";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

function LoginGate({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`/api/docs/auth`, {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setError("Incorrect password.");
        return;
      }
      onLogin(password);
    } catch {
      setError("Could not reach the server. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground">Minke Docs Admin</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-foreground mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Enter the admin password to edit documentation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!password}
              className="w-full h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link href="/introduction/what-is-minke" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to docs
          </Link>
        </div>
      </div>
    </div>
  );
}

interface EditorProps {
  password: string;
  onLogout: () => void;
}

function Editor({ password, onLogout }: EditorProps) {
  const { data: pages } = useListDocPages();
  const [selectedSlug, setSelectedSlug] = useState("introduction/what-is-minke");
  const { data: pageData, refetch } = useGetDocContent(selectedSlug);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (pageData?.content) {
      setEditContent(pageData.content);
      setSaved(false);
    }
  }, [pageData?.content, selectedSlug]);

  const sections = groupBySection(pages ?? []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      const res = await fetch(`/api/docs/content/${selectedSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setSaveError(data.error ?? "Save failed");
        return;
      }
      setSaved(true);
      void refetch();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              Minke Docs
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Admin Editor</span>
          </div>

          <div className="flex-1" />

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            {previewMode ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? "Preview" : "Preview"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save"}
              </>
            )}
          </button>

          <button
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Page list sidebar */}
        <aside className="w-56 shrink-0 border-r border-border overflow-y-auto bg-sidebar">
          <nav className="p-3 space-y-5">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <button
                        onClick={() => setSelectedSlug(item.slug)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                          selectedSlug === item.slug
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Editor / Preview */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border-b border-destructive/20 px-4 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {saveError}
            </div>
          )}

          {pageData?.comingSoon && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700">
              This page is marked as Coming Soon.
            </div>
          )}

          {previewMode ? (
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-3xl mx-auto">
                <DocContent content={editContent} />
              </div>
            </div>
          ) : (
            <textarea
              className="flex-1 resize-none font-mono text-sm bg-background text-foreground p-6 focus:outline-none leading-6"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              spellCheck={false}
              placeholder="Markdown content…"
            />
          )}

          <div className="border-t border-border px-4 py-2 flex items-center gap-3 text-xs text-muted-foreground bg-sidebar">
            <span>Editing: <strong className="text-foreground">{selectedSlug}</strong></span>
            <span className="ml-auto">{editContent.length} characters</span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);

  if (!password) {
    return <LoginGate onLogin={setPassword} />;
  }

  return <Editor password={password} onLogout={() => setPassword(null)} />;
}
