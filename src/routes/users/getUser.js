const addRoute = ({ router, db }) => {
  router.get('getUser', '/users/:id', async ctx => {
    const params = {
      TableName: process.env.USERS_TABLE,
      Key: {
        id: ctx.params.id
      }
    }

    try {
      const result = await db.get(params)
      if (result.Item) {
        ctx.body = result.Item
      } else {
        ctx.status = 400
        ctx.body = { error: `User not found: ${ctx.params.id}` }
      }
    } catch (err) {
      console.error(err)
      ctx.status = 400
      ctx.body = { error: 'Could not get user' }
    }
  })
}

module.exports = addRoute
