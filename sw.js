self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        'index.html',
        'style.css',
        'app.js',
        // 'sw.js',
        'image-list.js',
        'star-wars-logo.jpg',
        'gallery/bountyHunters.jpg',
        'gallery/myLittleVader.jpg',
        'gallery/snowTroopers.jpg'
      ])
    })
  )
})

self.addEventListener('fetch', function (event) {
  console.log(event.request.url)
  event.respondWith(
  caches.match(event.request).then(function (response) {
    return response || fetch(event.request)
  })
  )
})
