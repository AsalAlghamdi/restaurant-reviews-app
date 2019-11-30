const cacheName = 'v2';
const cacheUrl = [
    './index.html', './restaurant.html', './js/ServiceWorker.js', './js/restaurant_info.js', './js/main.js', './js/dbhelper.js', './css/style.css', './data/restaurants.json',
    './img/1.jpg', './img/2.jpg', './img/3.jpg', './img/4.jpg', './img/5.jpg', './img/6.jpg', './img/7.jpg', './img/8.jpg', './img/9.jpg', './img/10.jpg',
]
// install
self.addEventListener('install', e => {
    console.log('Install');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                cache.addAll(cacheUrl)
            })
            .then(self.skipWaiting())
    );
});

// activate
self.addEventListener('activate', function (e) {

    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// fetch
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                let responseClone = response.clone();

                caches.open(cacheName).then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function (err) {
                console.log('ServiceWorker Error Fetching & Caching Data', err);
            });
        }
    }));
});
