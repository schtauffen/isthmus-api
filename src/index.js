const Koa = require('koa')
const Router = require('koa-router')
const json = require('koa-json')
const serverless = require('serverless-http')

const db = require('./db')
const create = require('./create')
const get = require('./get')

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
const TYPES = {
  CONTENT: 'Content',
  PAGE: 'Page',
  RESOURCE: 'Resource',
  SCHEMA: 'Schema',
  SITE: 'Site',
  USER: 'User',
  WIDGET: 'Widget'
}

const router = new Router()
require('./home')({ router })
for (let key in TYPES) {
  const name = TYPES[key]
  create({ router, db, name })
  get({ router, db, name })
}

const app = new Koa()
app.use(json())
app.use(router.routes())
app.use(router.allowedMethods())

module.exports.handler = serverless(app)
