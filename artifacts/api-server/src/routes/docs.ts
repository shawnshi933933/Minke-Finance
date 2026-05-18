import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, "..", "..", "minke-docs", "src", "docs");
const SIDEBAR_PATH = path.join(DOCS_DIR, "sidebar.json");

interface SidebarEntry {
  slug: string;
  title: string;
  section: string;
  order: number;
  comingSoon?: boolean;
}

function loadSidebar(): SidebarEntry[] {
  try {
    return JSON.parse(readFileSync(SIDEBAR_PATH, "utf-8")) as SidebarEntry[];
  } catch {
    return [];
  }
}

function getAdminPassword(): string | null {
  return process.env["DOCS_ADMIN_PASSWORD"] ?? null;
}

function adminAuth(req: any, res: any): boolean {
  const pw = getAdminPassword();
  if (!pw) {
    res.status(503).json({ error: "Admin password not configured on server. Set the DOCS_ADMIN_PASSWORD environment variable." });
    return false;
  }
  const authHeader = (req.headers["authorization"] as string) ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== pw) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

function slugToFilePath(slug: string): string {
  const safe = slug.replace(/\.\./g, "").replace(/^\/+/, "");
  return path.join(DOCS_DIR, `${safe}.mdx`);
}

router.post("/docs/auth", (req, res) => {
  if (!adminAuth(req, res)) return;
  res.json({ ok: true });
});

router.get("/docs/pages", (_req, res) => {
  const sidebar = loadSidebar();
  res.json(
    sidebar.map((p) => ({
      slug: p.slug,
      title: p.title,
      section: p.section,
      order: p.order,
      comingSoon: p.comingSoon ?? false,
    }))
  );
});

router.get("/docs/content/:section/:page", async (req, res) => {
  const slug = `${req.params["section"]}/${req.params["page"]}`;
  await serveContent(slug, req, res);
});

router.get("/docs/content/:slug", async (req, res) => {
  await serveContent(req.params["slug"] as string, req, res);
});

async function serveContent(slug: string, req: any, res: any) {
  if (!adminAuth(req, res)) return;
  const sidebar = loadSidebar();
  const entry = sidebar.find((p) => p.slug === slug);
  const filePath = slugToFilePath(slug);

  if (!existsSync(filePath)) {
    res.status(404).json({ error: `Page not found: ${slug}` });
    return;
  }

  try {
    const content = await readFile(filePath, "utf-8");
    res.json({
      slug,
      title: entry?.title ?? slug,
      section: entry?.section ?? "",
      order: entry?.order ?? 0,
      content,
      comingSoon: entry?.comingSoon ?? false,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to read doc file");
    res.status(500).json({ error: "Internal server error" });
  }
}

router.put("/docs/content/:section/:page", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const slug = `${req.params["section"]}/${req.params["page"]}`;
  await saveContent(slug, req, res);
});

router.put("/docs/content/:slug", async (req, res) => {
  if (!adminAuth(req, res)) return;
  await saveContent(req.params["slug"] as string, req, res);
});

async function saveContent(slug: string, req: any, res: any) {
  const { content } = req.body as { content?: string };
  if (typeof content !== "string") {
    res.status(400).json({ error: "content is required and must be a string" });
    return;
  }

  const filePath = slugToFilePath(slug);
  if (!existsSync(filePath)) {
    res.status(404).json({ error: `Page not found: ${slug}` });
    return;
  }

  try {
    await writeFile(filePath, content, "utf-8");
    const sidebar = loadSidebar();
    const entry = sidebar.find((p) => p.slug === slug);
    res.json({
      slug,
      title: entry?.title ?? slug,
      section: entry?.section ?? "",
      order: entry?.order ?? 0,
      content,
      comingSoon: entry?.comingSoon ?? false,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to write doc file");
    res.status(500).json({ error: "Internal server error" });
  }
}

export default router;
