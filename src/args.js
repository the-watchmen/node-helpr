import assert from 'assert'
import config from 'config'
import debug from 'debug'
import _ from 'lodash'
import minimist from 'minimist'

const dbg = debug('app:helpr:args')
const defaultPrefix = '__default__'
const argv = minimist(process.argv.slice(2))

export function clearArgDefaults() {
	dbg('clear-arg-defaults')
	_.each(process.env, (val, key) => {
		if (key.startsWith(defaultPrefix)) {
			delete process.env[key]
		}
	})
}

export function getArgDefaults() {
	return _.filter(process.env, (val, key) => key.startsWith(defaultPrefix))
}

export function clearArgDefault(key) {
	dbg('clear-arg-default: key=%o', key)
	delete process.env[defaultKey(key)]
}

export function setArgDefault({key, value}) {
	assert(key, 'key required')
	dbg('set-arg-default: key=%o, value=%o', key, value)
	process.env[defaultKey(key)] = value
}

function defaultKey(key) {
	return `${defaultPrefix}${key}`
}

export function getArg(key, {dflt} = {}) {
	assert(key, 'key required')
	const arg = argv[key]
	const env = process.env[defaultKey(key)]
	const configured = _.get(config, key)
	dbg('get-arg: key=%o, arg=%o, env=%o, configured=%o, dflt=%o', key, arg, env, configured, dflt)
	return arg || env || configured || dflt
}

export function getRequiredArg(key) {
	const val = getArg(key)
	if (!val) {
		throw new Error(`[${key}] argument required`)
	}

	return val
}

export function getJsonArg(key, {dflt = {}} = {}) {
	const arg = getArg(key)
	return arg ? JSON.parse(arg) : dflt
}
