// Book Log service worker: offline app shell, cached covers, network-first catalog data.
const VERSION = 'booklog-v3';
const SHELL = [
  './', './index.html', './manifest.json',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-64.png'
];
const COVERS = 'booklog-covers';
const DATA = 'booklog-data';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => ![VERSION, COVERS, DATA].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const c = await caches.open(cacheName);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Book covers: cache-first (they never change)
  if (url.hostname === 'covers.openlibrary.org' || url.hostname.endsWith('archive.org')) {
    e.respondWith(caches.open(COVERS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') { c.put(req, res.clone()); trim(COVERS, 400); }
      return res;
    }));
    return;
  }

  // Catalog data: network-first, fall back to last copy when offline
  if (url.hostname === 'openlibrary.org') {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(DATA).then(c => { c.put(req, copy); trim(DATA, 150); }); }
      return res;
    }).catch(() => caches.match(req).then(r => r || Promise.reject(new Error('offline')))));
    return;
  }

  // App shell: stale-while-revalidate
  if (url.origin === location.origin) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req, { ignoreSearch: req.mode === 'navigate' }) ||
                  (req.mode === 'navigate' ? await c.match('./index.html') : null);
      const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
