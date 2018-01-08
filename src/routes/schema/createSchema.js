const uuid = require('uuid/v4')
const bodyParser = require('koa-bodyparser-node6')

/**
 *  Root
 *  ->User
 *    + custom fields
 *  ->Site
 *    + custom fields
 *  ->Page
 *    + custom fields
 *  ->Schema
 *    + custom fields
 *  ->Resource
 *    + custom fields
 *    ->Image (and some other predefined)
 *  ->Content
 *    + custom fields
 *    ->Article (and some other predefined)
 *    ->User-created
 *
 *  The schemas "group" defines which table it belongs to
 *  Inheritance?
 */

const addRoute = ({ router, db }) => {
  router.post('createSchema', '/schemas', bodyParser(), async ctx => {
    const params = {
      TableName: process.env.SCHEMA_TABLE,
      Item: {
        id: uuid(),
        ...ctx.request.body
      }
    }

    try {
      await db.put(params)
      ctx.body = params.Item
    } catch (err) {
      console.error(err)
      ctx.status = 400
      ctx.body = { error: 'Could not create schema' }
    }
  })
}

module.exports = addRoute
