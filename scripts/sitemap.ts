import fs from "fs";
import path from "path";
import routes from "../app/routes";
import 'dotenv/config';

const BASE_URL = process.env.VITE_CC_SITE_URL;
const API_BASE = "https://api.carboncopy.news";

// ----------------
// Step 1: Extract static routes
// ----------------
function extractPaths(routeConfig: any[], parent = ""): string[] {
  const urls: string[] = [];

  for (const route of routeConfig) {
    let fullPath = parent;

    if (route.path) {
      fullPath = path.posix.join(parent, route.path);
    }

    // Always normalize with a leading slash
    if (!fullPath.startsWith("/")) {
      fullPath = "/" + fullPath;
    }

    if (route.index) {
      urls.push(parent || "/");
    } else {
      if (fullPath && !fullPath.includes(":")) {
        urls.push(fullPath);
      }
    }

    if (route.children) {
      urls.push(...extractPaths(route.children, fullPath));
    }
  }

  return urls;
}

// ----------------
// Step 2: Fetch dynamic slugs
// ----------------
async function fetchDynamicUrls(): Promise<string[]> {
  const urls: string[] = [];

  try {
    // Landscape → contains categories and projects
    const landscapeRes = await fetch(`${API_BASE}/landscape`);
    const landscape: { category: string; projects: { slug: string }[] }[] = await landscapeRes.json();

    for (const cat of landscape) {
      // add category
      if (cat.category) {
        const catSlug = cat.category.toLowerCase().replace(/\s+/g, "-");
        urls.push(`/refi/categories/${catSlug}`);
      }

      // add projects within category
      if (cat.projects) {
        for (const proj of cat.projects) {
          if (proj.slug) urls.push(`/refi/projects/${proj.slug}`);
        }
      }
    }

    // Content: features + learn + authors
    const featuresDir = path.resolve("app", "content", "features");
    const featureSlugs = fs
      .readdirSync(featuresDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    for (const slug of featureSlugs) {
      urls.push(`/content/features/${slug}`);
    }


    const learnDir = path.resolve("app", "content", "learn");
    const learnSlugs = fs
      .readdirSync(learnDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    for (const slug of learnSlugs) {
      const split_slug = slug
            .split("/")
            .pop()
            ?.replace(/^\d+\./, "") // remove leading "1.", "23.", etc.
            .replace(".md", "") || "";

      urls.push(`/content/learn/${split_slug}`);
    }

    const authorDir = path.resolve("app", "content", "authors");
    const authorSlugs = fs
      .readdirSync(authorDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    for (const slug of authorSlugs) {
      urls.push(`/content/authors/${slug}`);
    }

    const reportDir = path.resolve("app", "content", "authors");
    const reportSlugs = fs
      .readdirSync(reportDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
    for (const slug of reportSlugs) {
      urls.push(`/content/reports/${slug}`);
    }

  } catch (err) {
    console.error("⚠️ Failed to fetch dynamic URLs:", err);
  }

  return urls;
}

// ----------------
// Step 3: Generate sitemap XML
// ----------------
function generateSitemap(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

// ----------------
// Step 4: Run script
// ----------------
async function main() {
  const staticUrls = extractPaths(routes);
  const dynamicUrls = await fetchDynamicUrls();

  const allUrls = Array.from(new Set([...staticUrls, ...dynamicUrls]));

  const xml = generateSitemap(allUrls);

  const outPath = path.resolve("public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`✅ sitemap.xml generated with ${allUrls.length} URLs at ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
