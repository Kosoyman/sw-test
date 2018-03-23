// console.log(navigator.serviceWorker.getRegistration())
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        'index.html',
        'style.css',
        'app.js',
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
    console.log(response)
    return response || fetch(event.request)
  }).catch(function (error) {
    console.log(error)
  })
  )
})

const applicationServerPublicKey = 'BKuzy_SL2P2ugC4uGvBuo_F-NZKTLk-C3rQfkuZW6pjcsaSTJqY9G8yLPWZgcPDVLO8FJGkJXnonpqAlLVU8k9A'

/* eslint-enable max-len */

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)
  let text = `${event.data.text()}`
  console.log(text)
  const title = 'Push Codelab'
  const options = {
    body: text,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.')
  event.notification.close()
  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  )
})

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.')
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function (newSubscription) {
      // TODO: Send to application server
      console.log('[Service Worker] New subscription: ', newSubscription)
    })
  )
})
