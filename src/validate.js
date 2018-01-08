const R = require('ramda')

// const db = require('./db')
const mockShapes = {
  D: { d: 'boolean' }
}
const db = {
  async get ({ Key }) {
    if (mockShapes[Key]) return { Item: mockShapes[Key] }
    throw new Error(`Unable to retrieve ${Key}`)
  }
}

const isNothing = x => x != null

/**
 *  {
 *    a: 'string',
 *    b: 'number',
 *    c: shape({ d: 'boolean' }),
 *    d: ['string', 'boolean'] // string || boolean
 *    e: 'string[]'
 *  }
 */
// these are helpers for our shape logic
const isRequired = str => /^!/.test(str)
const isArray = str => /\[]$/.test(str)

// TODO - async-optimized all and any methods
const isShape = shape => validate => async maybe =>
  primitives.object(shape) && primitives.object(maybe)
    ? R.all(R.identity, await Promise.all(Object.keys(shape).map(async fieldName => {
      let type = shape[fieldName]
      const value = maybe[fieldName]

      const required = isRequired(type)
      if (required) {
        type = type.slice(1)
      } else {
        if (isNothing(value)) return true
      }

      // must do array check first?

      const types = type.split('|')
      if (types.length > 1) {
        return R.any(R.identity, await Promise.all(types.map(t =>
          validate(required ? `!${t}` : t, value)
        )))
      }

      // TODO - [type] (array)
      // can get complicated, especially when mixed with |:
      // ie: [[a]|[b]|[c]] vs [a]|[b]|[c] vs [a|b|c]
      return validate(type, value)
    })))
    : false // throw error?

const primitives = {
  any: R.always(true),
  array: R.is(Array),
  boolean: R.is(Boolean),
  number: R.is(Number),
  object: val => val != null && typeof val === 'object' && Array.isArray(val) === false,
  string: R.is(String)
}

const fetchValidator = async (fetching, type) => {
  if (fetching[type]) return fetching[type]

  const params = {
    TableName: process.env.SCHEMA_TABLE,
    Key: type
  }

  const result = await (fetching[type] = db.get(params))
  // TODO - throw if no result.Item ?
  return isShape(result.Item)
}

const Validator = cache => {
  const fetching = {}
  const validators = Object.assign(Object.create(primitives), cache)

  const validate = async (type, val) => await (type in validators)
    ? validators[type](val)
    : (validators[type] = (await fetchValidator(fetching, type))(validate))(val)

  return validate
}

const validate = Validator()
mockShapes.A = { a: 'boolean' }
mockShapes.AB = { a: 'B' }
mockShapes.B = { b: 'number' }
mockShapes.Aor = { a: 'boolean|number' }
const test = async () => {
  console.log('boolean; E = true, R =', await validate('boolean', true))
  console.log('boolean; E = false, R =', await validate('boolean', 123))
  console.log('number; E = true, R =', await validate('number', 123))
  console.log('A; E = true, R =', await validate('A', { a: true }))
  console.log('A; E = false, R =', await validate('A', { a: 'abc' }))
  console.log('AB; E = true, R =', await validate('AB', { a: { b: 123 } }))
  console.log('AB; E = false, R =', await validate('AB', { a: { b: 'abc' } }))
  console.log('Aor; E = true, R =', await validate('Aor', { a: true }))
  console.log('Aor; E = true, R =', await validate('Aor', { a: 123 }))
  console.log('Aor; E = false, R =', await validate('Aor', { a: 'abc' }))
}
test()

module.exports = Validator
