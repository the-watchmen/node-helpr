import assert from 'node:assert'
import config from 'config'
import debug from '@watchmen/debug'
import _ from 'lodash'
import minimist from 'minimist'

const dbg = debug(import.meta.url)
const defaultPrefix = '__default__'
const argv = minimist(process.argv.slice(2))

export function clearArgDefaults() {
  dbg('clear-arg-defaults')
  _.each(process.env, (value, key) => {
    if (key.startsWith(defaultPrefix)) {
      delete process.env[key]
    }
  })
}

export function getArgDefaults() {
  return _.filter(process.env, (value, key) => key.startsWith(defaultPrefix))
}

export function clearArgDefault(key) {
  dbg('clear-arg-default: key=%o', key)
  delete process.env[defaultKey(key)]
}

export function setArgDefault({key, value}) {
  assert.ok(key, 'key required')
  dbg('set-arg-default: key=%o, value=%o', key, value)
  process.env[defaultKey(key)] = value
}

function defaultKey(key) {
  return `${defaultPrefix}${key}`
}

export function getArg(key, {dflt} = {}) {
  assert.ok(key, 'key required')
  const argument = argv[key]
  const env = process.env[defaultKey(key)]
  const configured = _.get(config, key)
  dbg(
    'get-arg: key=%o, arg=%o, env=%o, configured=%o, dflt=%o',
    key,
    argument,
    env,
    configured,
    dflt,
  )
  return argument || env || configured || dflt
}

export function getRequiredArg(key) {
  const value = getArg(key)
  if (!value) {
    throw new Error(`[${key}] argument required`)
  }

  return value
}

export function getJsonArg(key, {dflt = {}} = {}) {
  const argument = getArg(key)
  return argument ? JSON.parse(argument) : dflt
}
