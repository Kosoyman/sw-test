Push.create('Hello world!', {
  body: "How's it hangin'?",
  icon: 'star-wars-logo.jpg',
  timeout: 4000,
  onClick: function () {
    window.focus()
    this.close()
  }
})
