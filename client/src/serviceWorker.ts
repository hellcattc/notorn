// eslint-disable-next-line no-var
declare var self: ServiceWorkerGlobalScope;
export {};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static-cache").then(async (cache) => {
      await cache.addAll([
        "./pages/ErrorPage.tsx",
        "./pages/SignUpPage.tsx",
        "./pages/Home.tsx",
        "./graphql/requests.ts",
        "./main.tsx",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
