const sa = require('superagent')
const { ROOT, TABLES } = require('./lib/constants')

const postAll = type => {
  const _post = post(type)
  return dataList => Promise.all(dataList.map(_post))
}

// TODO - move url to environment properties file
const post = type => data => sa.post(`http://localhost:3000/${type}`)
  .send(data)
  .then(response => response.body)
  .then(console.log.bind(console))
  .catch(err => console.error(err
    ? (err.response && err.response.body) || err
    : 'Unspecified error'))

// TODO - does serverless support "ondynamodbcreate" hook for a population script?
const noValidate = true
const inheritable = true
postAll('schema')([
  {
    noValidate,
    id: ROOT.SCHEMA_ID,
    name: ROOT.NAME,
    target: TABLES.SCHEMA.NAME.toLowerCase(),
    protected: true,
    shape: {
      id: '!string',
      name: '!string',
      creationTimestamp: '!number',
      modifiedTimestamp: '!number'
    }
  },
  {
    noValidate,
    id: TABLES.SCHEMA.SCHEMA_ID,
    name: TABLES.SCHEMA.NAME,
    target: TABLES.SCHEMA.NAME.toLowerCase(),
    protected: true, // don't allow editing in UI (don't validate schema?)
    inheritable, // allow creation from this schema
    shape: {
      target: '!string',
      extends: 'string', // uuid or Name?
      protected: true: 'boolean',
      inheritable: 'boolean',
      shape: '!object'
    }
  }
])
  .then(postAll('schema')([
    {
      id: TABLES.USER.SCHEMA_ID,
      name: TABLES.USER.NAME,
      target: TABLES.USER.NAME.toLowerCase(),
      protected: true,
      inheritable,
      shape: {
        firstName: 'string',
        lastName: 'string',
        emailAddress: '!string' // TODO - primitive "schemas" (regex, range, etc)
      }
    },
    {
      id: TABLES.SITE.SCHEMA_ID,
      name: TABLES.SITE.NAME,
      target: TABLES.SITE.NAME.toLowerCase(),
      protected: true,
      inheritable,
      shape: {
        description: 'string'
      }
    },
    {
      id: TABLES.PAGE.SCHEMA_ID,
      name: TABLES.PAGE.NAME,
      target: TABLES.PAGE.NAME.toLowerCase(),
      protected: true,
      inheritable,
      shape: {
        widgets: 'string[]' // TODO - empty array of widgets? ! or not to !; force as guid?
      }
    },
    {
      id: TABLES.CONTENT.SCHEMA_ID,
      name: TABLES.CONTENT.NAME,
      target: TABLES.CONTENT.NAME.toLowerCase(),
      protected: true,
      inheritable,
      shape: {
        body: '!string'
      }
    },
    {
      id: TABLES.RESOURCE.SCHEMA_ID,
      name: TABLES.RESOURCE.NAME,
      target: TABLES.RESOURCE.NAME.toLowerCase(),
      protected: true,
      inheritable,
      shape: {
        location: '!string' // TODO - url / local path?
      }
    },
    {
      id: TABLES.WIDGET.SCHEMA_ID,
      name: TABLES.WIDGET.NAME,
      target: TABLES.WIDGET.NAME.toLowerCase(),
      protected: true,
      inheritable,
      shape: {
        // TODO
      }
    }
  ]))
