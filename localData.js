const sa = require('superagent')

const postAll = type => {
  const _post = post(type)
  return dataList => Promise.all(dataList.map(_post))
}

const post = type => data => sa.post(`http://localhost:3000/${type}`)
  .send(data)
  .then(response => console.log(response.body))
  .catch(err => console.error(err
    ? (err.response && err.response.body) || err
    : 'Unspecified error'))

postAll('schema')([
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
  }
])
  .then(console.log.bind(console))

/*
  const users = [
    { name: 'Zach D' },
    { name: 'Andrea H' },
    { name: 'Test McTesterson' },
    { name: 'Bob' }
  ]

  const schemas = [
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
*/
