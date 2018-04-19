var webPush = require('web-push')

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null)

module.exports = function (app, route) {
  app.post(route + 'register', function (req, res) {
    res.sendStatus(201)
  })
  self.addEventListener('post', function () {
    app.post(route + 'sendNotification', function (req, res) {
      setTimeout(function () {
        webPush.sendNotification({
          endpoint: req.query.endpoint,
          TTL: 0
        })
      .then(function () {
        res.sendStatus(201)
      })
      .catch(function (error) {
        res.sendStatus(500)
        console.log(error)
      })
      }, 1000)
    })
  }
)
}
