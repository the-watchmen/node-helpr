import test from 'ava'
import {
  setArgDefault,
  getArg,
  clearArgDefault,
  clearArgDefaults,
  getJsonArg,
  getRequiredArg
} from '../../src'

test('setArgDefault', t => {
  const key = 'foo'
  let foo = getArg(key)
  t.falsy(foo)
  setArgDefault({key, value: 'bar'})
  foo = getArg(key)
  t.is(foo, 'bar')
  clearArgDefault(key)
  foo = getArg(key)
  t.falsy(foo)
})

test('clearArgDefaults', t => {
  const key = 'foo'
  let foo = getArg(key)
  t.falsy(foo)
  setArgDefault({key, value: 'bar'})
  foo = getArg(key)
  t.is(foo, 'bar')
  clearArgDefaults()
  foo = getArg(key)
  t.falsy(foo)
})

test('getJsonArg', t => {
  const key = 'foo'
  let foo = getJsonArg(key)
  t.deepEqual(foo, {})
  setArgDefault({key, value: '{"foo": "bar"}'})
  foo = getJsonArg(key)
  t.deepEqual(foo, {foo: 'bar'})
})

test('getRequiredArg', t => {
  clearArgDefaults()
  const error = t.throws(() => getRequiredArg('nope'))
  t.is(error.message, '[nope] argument required')
})

test('getArg: config', t => {
  t.is(getArg('a.b.c'), 123)
})
