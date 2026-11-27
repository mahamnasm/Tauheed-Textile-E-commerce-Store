import { revalidatePath } from "next/cache";

/**
 * Automatically refreshes Next.js ISR/sitemap caches and notifies search engines
 * whenever products, categories, or collections are created or updated.
 */
export async function triggerAutoSeoAndIndexing(options?: {
  paths?: string[];
  sitemapPing?: boolean;
}) {
  try {
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/sitemap.xml");

    if (options?.paths) {
      for (const p of options.paths) {
        if (p) revalidatePath(p);
      }
    }
  } catch (err) {
    console.warn("Auto revalidate warning:", err);
  }

  // Non-blocking IndexNow ping when configured
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tauheedtextile.pk").replace(/\/+$/, "");
  const indexNowKey = process.env.INDEXNOW_KEY;

  if (indexNowKey && options?.paths && options.paths.length > 0) {
    const urlList = options.paths.map((p) => `${siteUrl}${p.startsWith("/") ? p : `/${p}`}`);
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key: indexNowKey,
        urlList,
      }),
    }).catch(() => {});
  }
}
