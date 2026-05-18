import { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Link } from "wouter";
import { sidebar, groupBySection } from "@/lib/sidebar";
import {
  BookOpen,
  Save,
  LogOut,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Eye as PreviewIcon,
} from "lucide-react";
import MDXWrapper from "@/components/MDXWrapper";

function LoginGate({ onLogin }: { onLogin: (pw: string) => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/docs/auth`, {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setError("Incorrect password.");
        return;
      }
      if (!res.ok) {
        setError("Server error. Try again.");
        return;
      }
      onLogin(password);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
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
                autoComplete="current-password"
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
              disabled={!password || loading}
              className="w-full h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/introduction/what-is-minke"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to docs
          </Link>
        </div>
      </div>
    </div>
  );
}

interface EditorPanelProps {
  password: string;
  onLogout: () => void;
}

function EditorPanel({ password, onLogout }: EditorPanelProps) {
  const [selectedSlug, setSelectedSlug] = useState("introduction/what-is-minke");
  const [remoteContent, setRemoteContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const isDirty = editContent !== remoteContent;

  const fetchContent = useCallback(
    async (slug: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/docs/content/${slug}`, {
          headers: { Authorization: `Bearer ${password}` },
        });
        if (res.ok) {
          const data = (await res.json()) as { content: string };
          setRemoteContent(data.content);
          setEditContent(data.content);
          setSaved(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [password]
  );

  useEffect(() => {
    void fetchContent(selectedSlug);
  }, [selectedSlug, fetchContent]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function handleSelectPage(newSlug: string) {
    if (isDirty) {
      const ok = window.confirm(
        "You have unsaved changes. Leave this page and discard them?"
      );
      if (!ok) return;
    }
    setSelectedSlug(newSlug);
    setPreviewMode(false);
    setSaveError("");
  }

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
      setRemoteContent(editContent);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const sections = groupBySection(sidebar);
  const currentPage = sidebar.find((p) => p.slug === selectedSlug);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center px-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">Minke Docs</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Admin Editor</span>
          </div>

          <div className="flex-1" />

          {isDirty && (
            <span className="hidden sm:inline text-xs text-amber-600 font-medium">
              Unsaved changes
            </span>
          )}

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
              previewMode
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <PreviewIcon className="w-4 h-4" />
            {previewMode ? "Editor" : "Preview"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            onClick={() => {
              if (isDirty && !window.confirm("You have unsaved changes. Sign out?")) return;
              onLogout();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 3.5rem)" }}>
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
                        onClick={() => handleSelectPage(item.slug)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                          selectedSlug === item.slug
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                        }`}
                      >
                        {item.title}
                        {item.comingSoon && (
                          <span className="ml-1.5 text-[0.65rem] text-muted-foreground">Soon</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border-b border-destructive/20 px-4 py-2 shrink-0">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {saveError}
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Loading…
            </div>
          ) : previewMode ? (
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-3xl mx-auto docs-prose">
                <div className="prose-preview" dangerouslySetInnerHTML={{ __html: "" }} />
                <p className="text-muted-foreground text-sm italic">
                  Live MDX preview is not available in the admin editor. Save to see changes rendered in the docs.
                </p>
                <pre className="mt-4 text-sm bg-muted rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words">
                  {editContent}
                </pre>
              </div>
            </div>
          ) : (
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={editContent}
              onChange={(value) => setEditContent(value ?? "")}
              theme="vs"
              options={{
                wordWrap: "on",
                minimap: { enabled: false },
                lineNumbers: "on",
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "none",
              }}
            />
          )}

          <div className="border-t border-border px-4 py-2 flex items-center gap-3 text-xs text-muted-foreground bg-sidebar shrink-0">
            <span>
              Editing:{" "}
              <strong className="text-foreground font-mono">
                {selectedSlug}.mdx
              </strong>
            </span>
            {currentPage?.comingSoon && (
              <span className="text-amber-600">Coming Soon</span>
            )}
            <span className="ml-auto">{editContent.length.toLocaleString()} chars</span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  if (!password) return <LoginGate onLogin={setPassword} />;
  return <EditorPanel password={password} onLogout={() => setPassword(null)} />;
}
