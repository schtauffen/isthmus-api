const addRoute = ({ router }) => {
  router.get('home', '/', ctx => {
    ctx.body = 'Hello world'
  })
}

module.exports = addRoute
