const Koa = require('koa')
const Router = require('koa-router')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser-node6')
const serverless = require('serverless-http')
const AWS = require('aws-sdk')

const app = new Koa()
const router = new Router()
const {
  USERS_TABLE,
  IS_OFFLINE
} = process.env

let dynamoDb
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb)
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient()
}

app.use(bodyParser())
app.use(json())

// implement routes
router.get('home', '/', ctx => {
  ctx.body = 'Hello world'
})

// required since dynamoDb doesn't implement Promises :'(
const createResolver = dynamoDb => (action, params) => new Promise((resolve, reject) => {
  const handler = (err, result) => err
    ? reject(err)
    : resolve(result)

  dynamoDb[action](params, handler)
})
const db = createResolver(dynamoDb)

router.get('getUser', '/users/:userId', async ctx => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: ctx.params.userId
    }
  }

  await db('get', params)
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

router.post('createUser', '/users', async ctx => {
  const { userId, name } = ctx.request.body
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      name
    }
  }

  await db('put', params)
    .then(result => {
      ctx.body = params.Item
    })
    .catch(err => {
      console.error(err)
      ctx.status = 400
      ctx.body = { error: 'Could not create user' }
    })
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports.handler = serverless(app)
