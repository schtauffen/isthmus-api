const uuid = require('uuid/v4')
const bodyParser = require('koa-bodyparser-node6')

const addRoute = ({ router, db }) => {
  router.post('createUser', '/users', bodyParser(), async ctx => {
    const params = {
      TableName: process.env.USERS_TABLE,
      Item: {
        userId: uuid(),
        ...ctx.request.body
      }
    }

    try {
      await db.put(params)
      ctx.body = params.Item
    } catch (err) {
      console.error(err)
      ctx.status = 400
      ctx.body = { error: 'Could not create user' }
    }
  })
}

module.exports = addRoute
