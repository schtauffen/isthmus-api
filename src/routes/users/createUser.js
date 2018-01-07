const bodyParser = require('koa-bodyparser-node6')

const { USERS_TABLE } = process.env

const addRoute = ({ router, db }) => {
  router.post('createUser', '/users', bodyParser(), async ctx => {
    const { userId, name } = ctx.request.body
    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId,
        name
      }
    }

    await db.put(params)
      .then(result => {
        ctx.body = params.Item
      })
      .catch(err => {
        console.error(err)
        ctx.status = 400
        ctx.body = { error: 'Could not create user' }
      })
  })
}

module.exports = addRoute
