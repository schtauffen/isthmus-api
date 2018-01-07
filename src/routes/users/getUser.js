const { USERS_TABLE } = process.env

const addRoute = ({ router, db }) => {
  router.get('getUser', '/users/:userId', async ctx => {
    const params = {
      TableName: USERS_TABLE,
      Key: {
        userId: ctx.params.userId
      }
    }

    await db.get(params)
      .then(result => {
        if (result.Item) {
          const { userId, name } = result.Item
          ctx.body = { userId, name }
        } else {
          ctx.status = 400
          ctx.body = { error: `User not found: ${ctx.params.userId}` }
        }
      })
      .catch(err => {
        console.error(err)
        ctx.status = 400
        ctx.body = { error: 'Could not get user' }
      })
  })
}

module.exports = addRoute
