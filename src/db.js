import AWS from 'aws-sdk'

let dynamoDb
if (process.env.IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb)
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient()
}

const promisifyAction = (action, params) => new Promise((resolve, reject) => {
  const handler = (err, result) => err
    ? reject(err)
    : resolve(result)

  dynamoDb[action](params, handler)
})

const actions = [
  'batchGet',
  'batchWrite',
  'delete',
  'get',
  'put',
  'query',
  'scan',
  'update'
]
const db = {}
actions.forEach(action => {
  db[action] = promisifyAction.bind(null, action)
})
db.createSet = (...args) => dynamoDb.createSet(...args)

module.exports = db
