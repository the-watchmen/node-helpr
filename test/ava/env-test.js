import test from 'ava'
import {getEnvOrObjValue} from '../../src/index.js'

test('env', (t) => {
  const val = 'yep'
  process.env.FOO_BAR = val
  const _val = getEnvOrObjValue({path: 'foo.bar'})
  t.is(_val, val)
  delete process.env.FOO_BAR
})

test('obj', (t) => {
  const val = 'yep'
  const obj = {foo: {bar: 'yep'}}
  const _val = getEnvOrObjValue({path: 'foo.bar', obj})
  t.is(_val, val)
})

test('dflt', (t) => {
  const dflt = 'yep'
  const _val = getEnvOrObjValue({path: 'foo.bar', obj: null, dflt})
  t.is(_val, dflt)
})
