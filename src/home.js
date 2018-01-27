import AWS from 'aws-sdk'

const addRoute = ({ router }) => {
  router.get('home', '/', async ctx => {
    const db = new AWS.DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })

    try {
      ctx.body = await new Promise((resolve, reject) => {
        db.listTables({}, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
    } catch (err) {
      console.error(err)
      ctx.status = 500
    }
  })
}

module.exports = addRoute
