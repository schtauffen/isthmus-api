import Koa from 'koa'
import Router from 'koa-router'
import json from 'koa-json'
import serverless from 'serverless-http'

import db from './db'
import create from './create'
import get from './get'
import home from './home'

import { TABLES } from './constants'

const router = new Router()
home({ router })
Object.keys(TABLES).forEach(KEY => {
  const schemaId = TABLES[KEY].SCHEMA_ID
  const name = TABLES[KEY].NAME
  create({ router, db, name, schemaId })
  get({ router, db, name })
})

const app = new Koa()
app.use(json())
app.use(router.routes())
app.use(router.allowedMethods())

module.exports.handler = serverless(app)
