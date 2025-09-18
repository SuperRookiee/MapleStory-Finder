const CACHE_NAME = "maplestory-finder-v1";
const APP_SHELL = ["/", "/offline", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(APP_SHELL);
            await self.skipWaiting();
        })().catch((error) => {
            console.error("SW install failed:", error);
        }),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
            );
            await self.clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            try {
                const networkResponse = await fetch(event.request);

                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === "basic" &&
                    event.request.url.startsWith(self.location.origin)
                ) {
                    cache.put(event.request, networkResponse.clone()).catch(() => {});
                }

                return networkResponse;
            } catch (error) {
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                if (event.request.mode === "navigate") {
                    const offlineResponse = await cache.match("/offline");
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }

                throw error;
            }
        })(),
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
