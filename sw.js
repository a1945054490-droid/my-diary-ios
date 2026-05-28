var CACHE_NAME = 'diary-v2';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './icon.png'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function(response) {
            // 网络成功，更新缓存
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, clone);
            });
            return response;
        }).catch(function() {
            // 网络失败（离线），用缓存
            return caches.match(event.request);
        })
    );
});
