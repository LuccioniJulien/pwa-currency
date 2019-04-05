const CACHE_NAME = "Currency-cache-v1";
const URLS_TO_CACHE = ["/main.js", "/index.html"];

this.addEventListener("install", async () => {
  const cache = await caches.open(CACHE_NAME);
  cache.addAll(URLS_TO_CACHE);
});

self.addEventListener("fetch", async event => {
  console.log("event.request");
  console.log(event.request);
  if (event.request.method != "GET") {
    return new Promise((resolve, reject) => {
      resolve("ok");
    });
  }
  const getCachedResponse = async () => {
    try {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  event.respondWith(getCachedResponse());
});
