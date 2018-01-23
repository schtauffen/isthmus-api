import AWS from 'aws-sdk'

const addRoute = ({ router }) => {
  router.get('home', '/', async ctx => {
    const db = new AWS.DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })

    await new Promise((resolve, reject) => {
      db.listTables({}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
      .then(data => {
        ctx.body = data.TableNames
      })
      .catch(err => console.error(err))
  })
}

module.exports = addRoute
