/* Offline support for Earth and Oceans.
   Bump CACHE when you deploy a new version. */
const CACHE = "marine-v171";

/* Figures & data photos: cached on install so they also work offline before
   they have been seen once. Relative to this file, like the rest of the app. */
const FIG_IMAGES = [
  "./figdata-img/fd-bristle-worm.webp",
  "./figdata-img/fd-brittle-star.webp",
  "./figdata-img/fd-crab.webp",
  "./figdata-img/fd-jellyfish.webp",
  "./figdata-img/fd-limpet.webp",
  "./figdata-img/fd-lobster.webp",
  "./figdata-img/fd-mussel.webp",
  "./figdata-img/fd-ragworm.webp",
  "./figdata-img/fd-sea-anemone.webp",
  "./figdata-img/fd-sea-snail.webp",
  "./figdata-img/fd-sea-urchin.webp",
  "./figdata-img/fd-shrimp.webp",
  "./figdata-img/fd-starfish.webp",
  "./figdata-img/mg-copepod.webp",
  "./figdata-img/mg-isopod.webp",
  "./figdata-img/mg-lanternfish.webp",
  "./figdata-img/mg-limpet.webp",
  "./figdata-img/mg-seagrass.webp",
  "./figdata-img/qd-barnacle.webp",
  "./figdata-img/qd-limpet.webp",
  "./figdata-img/qd-periwinkle.webp",
  "./figdata-img/qd-seaweed.webp",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  // a missing image must never stop the new version installing
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FIG_IMAGES)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Network first, falling back to cache. Means a redeploy is picked up as soon
   as the phone is online, but the app still opens on a train with no signal. */
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || caches.match("./index.html"))
      )
  );
});
