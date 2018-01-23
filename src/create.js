import uuid from 'uuid/v4'
import bodyParser from 'koa-bodyparser-node6'

import Validator from './validator'

const addRoute = ({
  db,
  name,
  router,
  tableName = process.env[`${name.toUpperCase()}_TABLE`],
  uri = `/${name.toLowerCase()}`
}) => {
  const lower = name.toLowerCase()

  router.post(
    `create${name}`,
    uri,
    bodyParser(),
    async ctx => {
      const validate = Validator()
      const { noValidate, ...body } = ctx.request.body
      const params = {
        TableName: tableName,
        Item: {
          id: uuid(),
          ...body
        }
      }

      try {
        const valid = noValidate
          ? true
          : await validate(name, params.Item)

        if (!valid) {
          // TODO - better error messages
          // TODO - forward validation errors to response...
          throw new TypeError(`Proposed ${lower} did not pass validation: ${params.Item}`)
        }

        await db.put(params)
        ctx.body = params.Item
      } catch (err) {
        console.error(err)
        ctx.status = 400
        ctx.body = { error: `Could not create ${lower}` }
      }
    }
  )
}

module.exports = addRoute
