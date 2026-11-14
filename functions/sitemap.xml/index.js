const SITE_URL = "https://mini-store-dz.pages.dev";
const SUPABASE_URL = "https://dmnbplhwckccutwdizzn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_EuPlcSRzAWgd1_Rml1W7YQ_AbUy7za3";

function xmlEscape(value) {
  return String(value).replace(/[<>&"']/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
  })[char]);
}

function makeSitemap(stores) {
  const urls = new Map();
  urls.set(SITE_URL + "/", null);

  for (const store of stores) {
    if (!store || typeof store.slug !== "string" || !store.slug.trim()) continue;
    const url = new URL("/store.html", SITE_URL);
    url.searchParams.set("store", store.slug.trim());
    const lastmod = store.updated_at && !Number.isNaN(Date.parse(store.updated_at))
      ? new Date(store.updated_at).toISOString()
      : null;
    urls.set(url.toString(), lastmod);
  }

  const entries = Array.from(urls, ([loc, lastmod]) =>
    "  <url>\n    <loc>" + xmlEscape(loc) + "</loc>" +
    (lastmod ? "\n    <lastmod>" + xmlEscape(lastmod) + "</lastmod>" : "") +
    "\n  </url>"
  );

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join("\n") +
    "\n</urlset>\n";
}

export async function onRequest(context) {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  let stores = [];
  try {
    const endpoint = new URL("/rest/v1/stores", SUPABASE_URL);
    endpoint.searchParams.set("select", "slug,updated_at");
    endpoint.searchParams.set("is_published", "eq.true");
    endpoint.searchParams.set("order", "updated_at.desc");

    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: "Bearer " + SUPABASE_PUBLISHABLE_KEY,
        Accept: "application/json"
      }
    });

    if (!response.ok) throw new Error("Supabase sitemap query failed: " + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected sitemap response");
    stores = data;
  } catch (error) {
    console.error("Dynamic sitemap fallback:", error);
  }

  const body = makeSitemap(stores);
  return new Response(context.request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=300, s-maxage=900"
    }
  });
}
