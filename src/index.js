const Koa = require('koa')
const Router = require('koa-router')
const json = require('koa-json')
const serverless = require('serverless-http')

const db = require('./db')

// add routes
const router = new Router()
require('./routes/home')({ router })
require('./routes/users/createUser')({ router, db })
require('./routes/users/getUser')({ router, db })
require('./routes/schema/createSchema')({ router, db })
require('./routes/schema/getSchema')({ router, db })

const app = new Koa()
app.use(json())
app.use(router.routes())
app.use(router.allowedMethods())

module.exports.handler = serverless(app)
