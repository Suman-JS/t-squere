const CACHE_NAME = "tsquare-cache-v9";
const OFFLINE_URL = "/offline.html";
const CACHE_DURATION = 5 * 60 * 1000;

function isValidCache(cachedResponse) {
    if (!cachedResponse) return false;
    const fetchDate = cachedResponse.headers.get("sw-fetched-on");
    if (fetchDate) {
        const age = Date.now() - new Date(fetchDate).getTime();
        return age < CACHE_DURATION;
    }
    return false;
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.add(OFFLINE_URL);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (
        event.request.mode === "navigate" ||
        (event.request.method === "GET" &&
            event.request.headers.get("accept").includes("text/html"))
    ) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (!navigator.onLine) {
                    return caches.match(OFFLINE_URL);
                }

                console.log("Online, fetching from network");
                return fetch(event.request)
                    .then((response) => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            const headers = new Headers(responseClone.headers);
                            headers.append(
                                "sw-fetched-on",
                                new Date().toUTCString()
                            );
                            responseClone.blob().then((body) =>
                                cache.put(
                                    event.request,
                                    new Response(body, {
                                        status: responseClone.status,
                                        statusText: responseClone.statusText,
                                        headers: headers,
                                    })
                                )
                            );
                        });
                        return response;
                    })
                    .catch((error) => {
                        return caches.match(OFFLINE_URL);
                    });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
        );
    }
});

self.addEventListener("online", () => {
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "ONLINE" });
        });
    });
});

self.addEventListener("offline", () => {
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "OFFLINE" });
        });
    });
});
