const addRoute = ({
  db,
  router,
  name,
  tableName = process.env[`${name.toUpperCase()}_TABLE`],
  uri = `/${name.toLowerCase()}/:id`
}) => {
  const lower = name.toLowerCase()

  router.get(
    `get${name}`,
    uri,
    async ctx => {
      const params = {
        TableName: tableName,
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
          ctx.body = { error: `${name} not found: ${ctx.params.id}` }
        }
      } catch (err) {
        console.error(err)
        ctx.status = 400
        ctx.body = { error: `Could not get ${lower}` }
      }
    }
  )
}

module.exports = addRoute
