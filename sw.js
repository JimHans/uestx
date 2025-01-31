const CACHE_NAME = 'uestx_cache';
 
const URLS = [                // Add URL you want to cache in this list.
  // '/',                     // If you have separate JS/CSS files, add path to those files here
  './index.htm',
  './UESTX_files/animate.css',
  './UESTX_files/jquery.js',
  './UESTX_files/pic/campus.jpg',
  './UESTX_files/pic/grade.jpg',
  './UESTX_files/pic/dachuang.jpg',
  './UESTX_files/pic/courses.jpg',
  './UESTX_files/pic/mail.jpg',
  './UESTX_files/pic/uestc.png',
  './UESTX_files/pic/jzsz.jpg',
  './UESTX_files/pic/jwc.jpg',
  './UESTX_files/pic/login.jpg',
  './UESTX_files/pic/bg-main.png',
];
 
// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS);
    }).then(_ => {
      return self.skipWaiting();
    }
  ))
});

self.addEventListener("fetch", async event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open("topics-dynamic");
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}
