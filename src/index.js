import zlib from 'node:zlib'
import _assert from 'node:assert'
import {Buffer} from 'node:buffer'
import fs from 'fs-extra'
import fastStringify from 'fast-safe-stringify'
import _ from 'lodash'
import debug from '@watchmen/debug'
import {diff} from 'jsondiffpatch'
// https://github.com/benjamine/jsondiffpatch/releases/tag/v0.6.0
import * as consoleFormatter from 'jsondiffpatch/formatters/console'

const dbg = debug(import.meta.url)

export * from './indices.js'
export * from './is-like.js'
export * from './constants.js'

const zip5Regex = /^\d{5}$/
const zipRegex = /^\d{5}(\d{4})?$/
const hexRegex = /^[\dA-Fa-f]+$/
const isoDateRegex = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/

export const SEPARATOR = ':'
export const COMPRESSION = 'base64'
export const VALIDATION_ERROR = 'ValidationError'
export const UNIQUENESS_ERROR = 'UniquenessError'

export function isHex(s) {
  return hexRegex.test(s)
}

export function isZip5(s) {
  return zip5Regex.test(s)
}

export function isZip(s) {
  return zipRegex.test(s)
}

export function isNumber(value) {
  return value === 0 || (!isEmpty(value) && !isNaN(value))
}

export function isFloat(value) {
  return isNumber(value) && containsChar(value, '.')
}

export function isIsoDate(value) {
  return isoDateRegex.test(value)
}

export function containsChar(value, char) {
  return isSpecified(value) && value.toString().includes(char)
}

export function isEmpty(value) {
  return !isSpecified(value) || value.toString().trim().length === 0
}

export function isBoolean(value) {
  return isSpecified(value) && ['true', 'false'].includes(value.toString())
}

export function parseBoolean(value) {
  return isSpecified(value) && ['true'].includes(value.toString())
}

export function isSpecified(value) {
  return ![null, undefined].includes(value)
}

export function pretty(value) {
  return JSON.stringify(value, null, 2)
}

export function diffConsole({actual, expected}) {
  const delta = diff(actual, expected)
  console.log('diff output:')
  consoleFormatter.log(delta)
}

export function stringify(s) {
  return fastStringify(s)
}

export function getKey(...fields) {
  return getKeyArray(...fields).join('')
}

export function getKeyArray(...fields) {
  return _.reduce(
    fields.flat(),
    (result, value) => {
      return result ? [...result, ...[SEPARATOR, value].flat()] : [value].flat()
    },
    null,
  )
}

export function sleep(s) {
  const e = Date.now() + s
  while (Date.now() <= e) {
    /* */
  }
}

export function getType(value) {
  return value && value.constructor.name
}

export function getWithTypes(o) {
  return _.transform(o, (result, value, key) => {
    result[key] = {
      value,
      type: getType(value),
    }
  })
}

// http://stackoverflow.com/a/4540443/2371903
export function xor(a, b) {
  // eslint-disable-next-line unicorn/no-negation-in-equality-check
  return !a !== !b
}

export function compress(s, {compression = COMPRESSION} = {}) {
  return zlib.deflateSync(s).toString(compression)
}

export function decompress(s, {compression = COMPRESSION} = {}) {
  return zlib.inflateSync(Buffer.from(s, compression)).toString()
}

export function join(arguments_, {separator = '.'} = {}) {
  return arguments_ ? _.pullAll(arguments_, [null, undefined, '']).join(separator) : arguments_
}

export function transformField({target, field, transformer}) {
  assert(transformer, 'transformer required')
  const value = transformer(_.get(target, field))
  return !value || _.isEmpty(value) ? _.omit(target, field) : _.set(target, field, value)
}

export function debugElements({dbg, msg, o}) {
  _.each(o, (value, key) => dbg(`${msg}[${key}]=${stringify(value)}`))
}

export async function resolveValues(o) {
  const map = new Map()
  _.each(o, (value, key) => {
    map.set(key, value)
  })
  const resolved = await Promise.all(map.values())
  return _.zipObject([...map.keys()], resolved)
}

export function isListed({list, key, value}) {
  return (
    list &&
    _.some(list, (elt, index, list) => {
      return (_.isString(elt) && elt === key) || (_.isFunction(elt) && elt({key, value, list}))
    })
  )
}

export function parseValue(value) {
  if (value === 'null') {
    return null
  }

  if (isBoolean(value)) {
    return parseBoolean(value)
  }

  if (isFloat(value)) {
    return Number.parseFloat(value)
  }

  if (isNumber(value)) {
    return Number.parseInt(value, 10)
  }

  if (isIsoDate(value)) {
    return Date.parse(value)
  }

  if (Array.isArray(value)) {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    return value.map(parseValue)
  }

  return value
}

export function combine({target = {}, source = {}, operator = _.identity, union}) {
  const result = _.transform(target, (result, value, key) => {
    result[key] = _.has(source, key) ? operator(value, source[key]) : value
  })
  if (union) {
    _.each(source, (value, key) => {
      if (!_.has(result, key)) {
        result[key] = value
      }
    })
  }

  return result
}

export function deepClean(object, predicate = _.identity) {
  // dbg('deep-clean: object=%o, type=%o', object, getType(object))
  let result
  if (Array.isArray(object)) {
    // dbg('deep-clean: array=%o', object)
    result = _.filter(_.map(object, (_value) => deepClean(_value, predicate)))
  } else if (_.isPlainObject(object)) {
    // dbg('deep-clean: object=%o', object)
    result = _.transform(object, (result, value, key) => {
      const _result = deepClean(value, predicate)
      if ((_.isArray(_result) || _.isPlainObject(_result)) && !_.isEmpty(_result)) {
        result[key] = _result
      } else if (_result) {
        result[key] = _result
      }
      // dbg('deep-clean: key=%o, val=%o, result=%o', key, value, result)
    })
  } else {
    // dbg('deep-clean: primitive=%o', object)
    return object
  }

  // dbg('result=%o', result)
  return _.isEmpty(result) ? null : result
}

export function splitAndTrim(s, {delimiter = ','} = {}) {
  if (_.isString(s)) {
    const result = _.transform(s.split(delimiter), (_result, value) => {
      const _value = value.trim()
      if (_value) {
        _result.push(_value)
      }
    })
    return !_.isEmpty(result) && result
  }
}

// [{a: 1, b: 2}, {b: 3, c: 4}] => {a: 1, b: 3, c: 4}
export function merge(a) {
  return _.transform(a, (result, elt) => Object.assign(result, elt), {})
}

// {a: {b: {c: 1}}} -> {'a.b.c': 1}
export function toDotNotation({target, path = [], result = {}}) {
  return _.reduce(
    target,
    (result, value, key) => {
      if (_.isPlainObject(value)) {
        return toDotNotation({target: value, path: [...path, key], result})
      }

      result[join([...path, key])] = value
      return result
    },
    result,
  )
}

export function assert(test, message) {
  _assert.ok(test, _.isFunction(message) ? message() : message)
}

export function getRequired({data, field}) {
  const value = _.get(data, field)
  assert(value, () => `unable to get field=${field} from data=${stringify(data)}`)
  return value
}

export async function getPackage() {
  const path = process.env.PACKAGE_PATH ?? '.'
  dbg('get-package: app-path=%s', path)
  return JSON.parse(await fs.readFile(`${path}/package.json`, 'utf8'))
}

export function getEnvOrObjValue({path, dflt, obj}) {
  const toks = path.split('.')
  const env = _.snakeCase(toks.join('_')).toUpperCase()
  let val
  val = process.env[env]
  if (val) {
    dbg('get-env-or-obj-value: obtained value=%s from env=%s (path=%s)', val, env, path)
    return val
  }

  val = _.get(obj, path)
  if (val) {
    dbg('get-env-or-obj-value: no value at env=%s, obtained value=%s from path=%s', env, val, path)
    return val
  }

  dbg('get-env-or-obj-value: no value at env=%s or path=%s, returning default=%s', env, path, dflt)
  return dflt
}

export function deepReplace({target, matchRe = '{{([^}]+)}}', replaceMap = {}, onMatch}) {
  const walk = (v) => {
    if (_.isString(v)) {
      const match = v.match(matchRe, 'g')
      if (match) {
        const isFullMatch = match[0] === match.input
        const replacement = _.get(replaceMap, _.trim(match[1]))
        const result = isFullMatch ? replacement : v.replace(match[0], replacement)
        dbg(
          'deep-replace: matched: regex=%s, replacement=%s, result=%s',
          match[0],
          replacement,
          result,
        )
        onMatch && onMatch({match: match[0], replacement, result})
        return result
      }
    }

    if (_.isArray(v)) return v.map((element) => walk(element))
    if (_.isPlainObject(v)) return _.mapValues(v, walk)
    return v
  }

  return walk(structuredClone(target))
}

export function replaceInData({data = '', replaceMap = {}, onMatch} = {}) {
  const out = data === null ? '' : String(data)

  return _.reduce(
    replaceMap,
    (result, replacement, regex) => {
      _assert.ok(
        regex && replacement,
        `regex and replacement required: regex=${regex}, replacement=${replacement}`,
      )
      const re = new RegExp(regex, 'g')
      const matches = result.match(re)

      if (matches) {
        const count = matches.length

        dbg('replace-in-data: regex=%s, replacement=%s, count=%d', regex, replacement, count)
        onMatch && onMatch({regex, replacement, count})
        return result.replace(re, String(replacement))
      }

      return result
    },
    out,
  )
}

export async function replaceInFile({file, replaceMap = {}, encoding = 'utf8', onMatch} = {}) {
  _assert.ok(file, 'file required')

  const data = await fs.readFile(file, encoding)
  const out = replaceInData({data, replaceMap, onMatch})
  await fs.writeFile(file, out, encoding)

  return out
}
