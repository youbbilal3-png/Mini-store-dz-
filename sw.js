const CACHE_NAME = "mini-store-dz-static-v5";
const STATIC_FILE = /\.(?:css|js|svg|webmanifest)(?:\?.*)?$/i;

self.addEventListener("install", event => {
  // Activate the repaired worker without waiting for old tabs to close.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("mini-store-dz-static-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  if (!STATIC_FILE.test(url.pathname + url.search)) return;

  event.respondWith((async () => {
    // Never make page rendering wait for CacheStorage. Network response is
    // returned immediately; caching happens in the background.
    try {
      const response = await fetch(request, { cache: "no-store" });
      if (response && response.ok && response.type === "basic") {
        const copy = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copy))
            .catch(error => console.warn("Static cache write skipped:", error))
        );
      }
      return response;
    } catch (error) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
      } catch (cacheError) {
        console.warn("Static cache fallback unavailable:", cacheError);
      }
      return new Response("Mini Store DZ resource unavailable. Please reconnect and reload.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
