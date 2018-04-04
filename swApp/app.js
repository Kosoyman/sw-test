// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function (reg) {
    if (reg.installing) {
      console.log('Service worker installing')
    } else if (reg.waiting) {
      console.log('Service worker installed')
    } else if (reg.active) {
      console.log('Service worker active')
    }

    swRegistration = reg
    initializeUI()
  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error)
  })
}

// function for loading each image via fetch

function imgLoad (imgJSON) {
  // return a promise for an image loading
  return fetch(imgJSON.url)
  .then((response) => response.blob())
  .then(function (response) {
    let arrayResponse = []
    arrayResponse[0] = response
    arrayResponse[1] = imgJSON
    return arrayResponse
  }).catch(function (Error) {
    console.log(Error)
  })
}

var imgSection = document.querySelector('section')

window.onload = function () {
  // load each set of image, alt text, name and caption
  for (var i = 0; i <= Gallery.images.length - 1; i++) {
    imgLoad(Gallery.images[i]).then(function (arrayResponse) {
      var myImage = document.createElement('img')
      var myFigure = document.createElement('figure')
      var myCaption = document.createElement('caption')
      var imageURL = window.URL.createObjectURL(arrayResponse[0])

      myImage.src = imageURL
      myImage.setAttribute('alt', arrayResponse[1].alt)
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit

      imgSection.appendChild(myFigure)
      myFigure.appendChild(myImage)
      myFigure.appendChild(myCaption)
    }, function (Error) {
      console.log(Error)
    })
  }
}

const applicationServerPublicKey = 'BKuzy_SL2P2ugC4uGvBuo_F-NZKTLk-C3rQfkuZW6pjcsaSTJqY9G8yLPWZgcPDVLO8FJGkJXnonpqAlLVU8k9A'

const pushButton = document.querySelector('#subscription')

let isSubscribed = false
let swRegistration = null
let endpoint

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

function updateBtn () {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.'
    pushButton.disabled = true
    updateSubscriptionOnServer(null)
    return
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging'
  } else {
    pushButton.textContent = 'Enable Push Messaging'
  }

  pushButton.disabled = false
}

function updateSubscriptionOnServer (subscription) {
  // TODO: Send subscription to application server
  if (subscription) {
    console.log(JSON.stringify(subscription))
    // endpoint = subscription.endpoint
    // fetch('./register', {
    //   method: 'post',
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     endpoint: subscription.endpoint
    //   })
    // })
  }
}

function subscribeUser () {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function (subscription) {
    console.log('User is subscribed.')

    updateSubscriptionOnServer(subscription)

    isSubscribed = true

    updateBtn()
  })
  .catch(function (err) {
    console.log('Failed to subscribe the user: ', err)
    updateBtn()
  })
}

function unsubscribeUser () {
  swRegistration.pushManager.getSubscription()
  .then(function (subscription) {
    if (subscription) {
      return subscription.unsubscribe()
    }
  })
  .catch(function (error) {
    console.log('Error unsubscribing', error)
  })
  .then(function () {
    updateSubscriptionOnServer(null)

    console.log('User is unsubscribed.')
    isSubscribed = false

    updateBtn()
  })
}

function initializeUI () {
  pushButton.addEventListener('click', function () {
    pushButton.disabled = true
    if (isSubscribed) {
      unsubscribeUser()
    } else {
      subscribeUser()
    }
  })

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function (subscription) {
    isSubscribed = !(subscription === null)

    updateSubscriptionOnServer(subscription)

    if (isSubscribed) {
      console.log('User IS subscribed.')
    } else {
      console.log('User is NOT subscribed.')
    }

    updateBtn()
  })
}

// navigator.serviceWorker.register('service-worker.js')
// .then(function (registration) {
//   return registration.pushManager.getSubscription()
//   .then(function (subscription) {
//     if (subscription) {
//       return subscription
//     }

//     return registration.pushManager.subscribe({ userVisibleOnly: true })
//   })
// }).then(function (subscription) {
//   endpoint = subscription.endpoint
//   fetch('./register', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({
//       endpoint: subscription.endpoint
//     })
//   })
// })

// document.getElementById('doIt').onclick = function () {
//   fetch('./sendNotification?endpoint=' + endpoint,
//     {
//       method: 'post'
//     }
//   )
// }
