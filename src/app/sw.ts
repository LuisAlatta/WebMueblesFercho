import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, ExpirationPlugin, StaleWhileRevalidate, CacheableResponsePlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Cache product images from Supabase for 30 days
    {
      matcher: /^https:\/\/bruxqwwypotsdghsxowo\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
      handler: new CacheFirst({
        cacheName: "product-images",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }),
        ],
      }),
    },
    // Cache Next.js optimized images
    {
      matcher: /^\/_next\/image\?.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: "next-images",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 150, maxAgeSeconds: 7 * 24 * 60 * 60 }),
        ],
      }),
    },
    // Cache search API responses briefly
    {
      matcher: /^\/api\/productos\?.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: "api-search",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
