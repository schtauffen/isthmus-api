const sa = require('superagent')

const post = url => data => sa.post(url)
  .send(data)
  .then(response => console.log(response.body))
  .catch(err => console.error(err
    ? err.response && err.response.body || err
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
/*
// how should types and validation be handled?
  {
    name: 'Field',
    target: 'schema',
    protected: true,
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true
      },
      {
        name: 'type',
        type: ['string', 'array', 'schema'],
        required: true
      },
      {
        name: 'list',
        type: 'boolean'
      },
      {
        name: 'protected',
        type: 'boolean'
      }
    ]
  },
 */
  {
    name: 'Root',
    target: 'schema',
    protected: true,
    fields: [
      {
        name: 'creationTimestamp',
        displayName: {
          en_US: 'Creation Time'
        },
        description: {
          en_US: 'Timestamp of creation time in epoch.'
        }
      }
    ]
  },
  {
    name: 'Schema',
    target: 'schema',
    // all but Root inherit from root
    // parent: 'Root', // will be uuid and not "name"
    protected: true, // don't allow editing in UI (don't validate schema?)
    inheritable: true, // allow creation from this schema
    fields: [
      {
        name: 'name',
        displayName: { // i18n field
          en_US: 'Name'
        },
        description: {
          en_US: 'A readable identifier for the schema.'
        },
        type: 'string',
        required: true
      },
      {
        name: 'Target',
        description: 'Which type of item is being defined.',
        type: 'string',
        required: true
      },
      {
        name: 'Parent',
        description: {},
        type: 'string'
      },
      {
        name: 'Protected',
        description: 'Is this editable through the admin UI?',
        type: 'boolean'
      },
      {
        name: 'Fields',
        description: 'The available data fields of the item.',
        type: 'Field',
        list: true,
        required: true
      }
    ]
  }
]
const createSchemas = () => Promise.all(
  schemas.map(post('http://localhost:3000/schemas'))
)

Promise.resolve(true)
  .then(createUsers)
  .then(createSchemas)
