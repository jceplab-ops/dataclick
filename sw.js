// Behavior Recorder - offline cache
// Copyright (C) 2026 David Widman and Juniata College
// Licensed under the GNU General Public License, version 3 or later.
// See the LICENSE file or <https://www.gnu.org/licenses/>. No warranty.
//
// How it behaves: when the phone is online it always loads the newest files from the
// server (so updates reach students right away); when offline, or when the network is
// slower than 5 seconds, it falls back to the copy saved on the phone.
//
// To force every phone to refresh its saved copy after an update, change the version
// number below (v4 to v5, and so on) and re-upload this file.
const CACHE = 'behavior-recorder-v4';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const NETWORK_TIMEOUT_MS = 5000;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(SHELL.map((u) =>
        fetch(u, { cache: 'reload' })
          .then((r) => (r && r.ok ? c.put(u, r) : null))
          .catch(() => null)
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const net = fetch(req, { cache: 'no-cache' });
  const timeout = new Promise((resolve) => setTimeout(() => resolve(undefined), NETWORK_TIMEOUT_MS));
  const res = await Promise.race([net.catch(() => undefined), timeout]);

  if (res && res.ok) {
    cache.put(req, res.clone()).catch(() => {});
    return res;
  }

  let hit = await cache.match(req, { ignoreSearch: true });
  if (!hit && req.mode === 'navigate') {
    hit = (await cache.match('index.html')) || (await cache.match('./'));
  }
  if (hit) return hit;

  // Nothing saved yet: wait for the network after all.
  const late = await net.catch(() => undefined);
  return late || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(networkFirst(req));
});
