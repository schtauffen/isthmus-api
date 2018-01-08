const uuid = require('uuid/v4')
const bodyParser = require('koa-bodyparser-node6')

const Validator = require('../../validate')
const validate = Validator({
//  Schema: {
//    name: 'Schema',
//    target: 'schema',
//    protected: true, // don't allow editing in UI (don't validate schema?)
//    inheritable: true, // allow creation from this schema
//    shape: {
//      name: '!string',
//      target: '!string',
//      extends: 'string', // uuid or Name?
//      protected: 'boolean',
//      inheritable: 'boolean',
//      shape: '!object'
//    }
//  }
})

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
 *  ->Widgets
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
    const { noValidate, ...body } = ctx.request.body
    const params = {
      TableName: process.env.SCHEMA_TABLE,
      Item: {
        id: uuid(),
        ...body
      }
    }

    try {
      const valid = noValidate
        ? true
        : await validate('Schema', params.Item)

      if (!valid) {
        // TODO - better error messages
        // TODO - forward validation errors to response...
        throw new TypeError(`Proposed schema did not pass validation: ${params.Item}`)
      }

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
