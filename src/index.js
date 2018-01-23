import Koa from 'koa'
import Router from 'koa-router'
import json from 'koa-json'
import serverless from 'serverless-http'

import db from './db'
import create from './create'
import get from './get'
import home from './home'

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
home({ router })
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
