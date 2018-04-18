Push.config({
  serviceWorker: 'sw.js', // Sets a custom service worker script
  fallback: function (payload) {
      // Code that executes on browsers with no notification support
      // "payload" is an object containing the
      // title, body, tag, and icon of the notification
  }
})
Push.create('Hello world!', {
  body: "How's it hangin'?",
  icon: 'star-wars-logo.jpg',
  timeout: 4000,
  onClick: function () {
    window.focus()
    this.close()
  }
})
