const sa = require('superagent')

const post = url => data => sa.post(url)
  .send(data)
  .then(response => console.log(response.body))
  .catch(err => console.error(err
    ? (err.response && err.response.body) || err
    : 'Unspecified error'))

const users = [
  { name: 'Zach Dahl' },
  { name: 'Andrea Hunt' },
  { name: 'Test McTesterson' },
  { name: 'Bob' }
]
const createUsers = () => Promise.all(
  users.map(post('http://localhost:3000/users'))
)

const schemas = [
  {
    noValidate: true,
    name: 'Root',
    target: 'schema',
    protected: true,
    shape: {
      id: '!string',
      creationTimestamp: '!number',
      modifiedTimestamp: '!number'
    }
  },
  {
    noValidate: true,
    name: 'Schema',
    target: 'schema',
    protected: true, // don't allow editing in UI (don't validate schema?)
    inheritable: true, // allow creation from this schema
    shape: {
      name: '!string',
      target: '!string',
      extends: 'string', // uuid or Name?
      protected: 'boolean',
      inheritable: 'boolean',
      shape: '!object'
    }
  },
  {
    name: 'Test-pass',
    target: 'content',
    inheritable: true,
    shape: {
      test: '!string'
    }
  },
  {
    name: 'Test-fail',
//    target: 'content', // target is required
    inheritable: true,
    shape: {
      test: '!string'
    }
  }
]
const createSchemas = () => Promise.all(
  schemas.map(post('http://localhost:3000/schemas'))
)

Promise.resolve(true)
  .then(createUsers)
  .then(createSchemas)
