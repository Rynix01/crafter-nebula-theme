const CACHE_NAME = 'crafter-nebula-v1';
const urlsToCache = [
  '/',
  '/home',
  '/manifest.json',
  '/crafter.png',
  '/crafter-light.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - cache static assets, skip API and Next.js routes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Navigation istekleri için özel handling
  if (event.request.mode === 'navigate') {
    // Navigation isteklerini direkt network'ten çek, cache'leme
    event.respondWith(
      fetch(event.request).catch(() => {
        // Network hatası durumunda fallback sayfa göster
        return caches.match('/');
      })
    );
    return;
  }
  
  // API istekleri ve Next.js route'ları cache'leme
  if (url.hostname === 'api.crafter.net.tr' || 
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/api/')) {
    // Bu istekleri direkt network'ten çek, cache'leme
    event.respondWith(
      fetch(event.request)
    );
    return;
  }
  
  // Statik dosyalar için cache kullan
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
