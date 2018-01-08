const R = require('ramda')

const db = require('./db')

// helpers
const isNothing = x => x == null
const isRequired = str => /^!/.test(str)
const isArray = str => /\[]$/.test(str)
const isList = str => /^\(\)$/.test(str)

/**
 *  !?type1(|type2|...|typeN)?([])?
 *  ^- required
 *    ^- type (1 is required)
 *          ^- optional "or" types
 *                              ^- is this a list?
 */
// TODO - async-optimized all and any methods
const isShape = shape => validate => async maybe =>
  primitives.object(shape) && primitives.object(maybe) // TODO - required behavior with schemas?
    ? R.all(R.identity, await Promise.all(Object.keys(shape).map(async fieldName => {
      let type = shape[fieldName]
      const value = maybe[fieldName]

      const required = isRequired(type)
      if (required) {
        type = type.slice(1)
      } else if (isNothing(value)) {
        return true
      }

      if (isArray(type)) {
        type = type.slice(0, type.length - 2)
        return primitives.array(value) &&
          R.all(R.identity, await Promise.all(value.map(async v =>
            validate(required ? `!${type}` : type, v)
          )))
      }

      if (isList(type)) {
        const types = type.slice(1, type.length - 1).split('|')
        return R.any(R.identity, await Promise.all(types.map(t =>
          validate(required ? `!${t}` : t, value)
        )))
      }

      return validate(type, value)
    })))
    : false

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
  // TODO - always include Root ?
  // TODO - handle "extends"
  return isShape(result.Item.shape)
}

const Validator = cache => {
  const fetching = {}
  const validators = Object.assign(Object.create(primitives), cache)

  const validate = async (type, val) => (type in validators)
    ? validators[type](val)
    : (validators[type] = (await fetchValidator(fetching, type))(validate))(val)

  return validate
}

module.exports = Validator
