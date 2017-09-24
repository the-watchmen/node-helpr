import test from 'ava'
import debug from 'debug'
import {chill} from 'test-helpr'
import {
  isZip5,
  isZip,
  isNumber,
  isFloat,
  containsChar,
  isEmpty,
  isBoolean,
  parseBoolean,
  getKey,
  getKeyArray,
  compress,
  decompress,
  COMPRESSION,
  SEPARATOR,
  join,
  debugElements,
  resolveValues,
  isListed,
  parseValue,
  isIsoDate,
  splitAndTrim
} from '../../src'

const dbg = debug('test:helpr')

test('isZip5', t => {
  t.true(isZip5('12345'))
  t.false(isZip5('123456'))
  t.false(isZip('foo'))
})

test('isZip', t => {
  t.true(isZip('12345'))
  t.true(isZip('123451234'))
  t.false(isZip('foo'))
})

test('isNumber', t => {
  t.true(isNumber('1'))
  t.true(isNumber('1.1'))
  t.true(isNumber('0'))
  t.true(isNumber(0))
  t.false(isNumber(''))
  t.false(isNumber(' '))
  t.false(isNumber('foo'))
  t.false(isNumber(null))
  t.false(isNumber(undefined))
})

test('isFloat', t => {
  t.true(isFloat('1.1'))
  t.false(isFloat('1'))
  t.false(isFloat('0'))
  t.false(isFloat(0))
  t.false(isFloat(''))
  t.false(isFloat(' '))
  t.false(isFloat('foo'))
  t.false(isFloat(null))
  t.false(isFloat(undefined))
})

test('containsChar', t => {
  t.true(containsChar('a.b', '.'))
  t.true(containsChar('.', '.'))
  t.false(containsChar('foo', '.'))
  t.false(containsChar(0, '.'))
})

test('isEmpty', t => {
  t.true(isEmpty(''))
  t.true(isEmpty(' '))
  t.true(isEmpty(null))
  t.true(isEmpty(undefined))
  t.false(isEmpty(0))
  t.false(isEmpty('foo'))
})

test('isBoolean', t => {
  t.true(isBoolean('true'))
  t.true(isBoolean('false'))
  t.true(isBoolean(true))
  t.true(isBoolean(false))
  t.false(isBoolean('0'))
  t.false(isBoolean(0))
  t.false(isBoolean(''))
  t.false(isBoolean(' '))
  t.false(isBoolean('foo'))
  t.false(isBoolean(null))
  t.false(isBoolean(undefined))
})

test('parseBoolean', t => {
  t.true(parseBoolean('true'))
  t.true(parseBoolean(true))
  t.false(parseBoolean('false'))
  t.false(parseBoolean(false))
  t.false(parseBoolean('0'))
  t.false(parseBoolean(0))
  t.false(parseBoolean(1))
  t.false(parseBoolean(''))
  t.false(parseBoolean(' '))
  t.false(parseBoolean('foo'))
  t.false(parseBoolean(null))
  t.false(parseBoolean(undefined))
})

test('getKey', t => {
  t.truthy(getKey('foo', 'bar'), 'foo:bar')
})

test('getKeyArray', t => {
  t.deepEqual(getKeyArray('foo'), ['foo'])
  t.deepEqual(getKeyArray('foo', 'bar'), ['foo', SEPARATOR, 'bar'])
  t.deepEqual(getKeyArray('foo', ['bar']), ['foo', SEPARATOR, 'bar'])
  t.deepEqual(getKeyArray(['foo'], 'bar'), ['foo', SEPARATOR, 'bar'])
  t.deepEqual(getKeyArray(['foo', 'bar']), ['foo', SEPARATOR, 'bar'])
  t.deepEqual(getKeyArray(['foo', ['bar', SEPARATOR, 'baz']]), [
    'foo',
    SEPARATOR,
    'bar',
    SEPARATOR,
    'baz'
  ])
  t.deepEqual(getKeyArray([['foo', SEPARATOR, 'bar'], 'baz']), [
    'foo',
    SEPARATOR,
    'bar',
    SEPARATOR,
    'baz'
  ])
})

test('compress', t => {
  const s = '1:1245208719:2668376872:87 MURRAY GUARD DR:JACKSON:TN:383053775'
  const _s = compress(s)
  dbg('compress: uncompressed=[%s]', s)
  dbg('compress: encoding=%s', COMPRESSION)
  dbg('compress: compressed=[%s]', _s)
  dbg(
    'compress: uncompressed-length=%o, compressed-length=%o, ratio=%o',
    s.length,
    _s.length,
    _s.length / s.length
  )
  t.is(s, decompress(_s))
})

test('join', t => {
  t.is(join([null, 'foo']), 'foo')
  t.is(join(['foo', null]), 'foo')
  t.is(join(['foo', 'bar']), 'foo.bar')
  t.is(join([]), '')
  t.is(join([null]), '')
  t.is(join([null, null]), '')
  t.is(join([undefined]), '')
  t.is(join(null), null)
})

test('debugElements: object', t => {
  debugElements({dbg, msg: 'anObject', o: {foo: 'foo', bar: 'bar', baz: {bip: 'bip'}}})
  t.pass()
})

test('debugElements: array', t => {
  debugElements({dbg, msg: 'anArray', o: [{foo: 'foo'}, {bar: 'bar'}, {baz: {bip: 'bip'}}]})
  t.pass()
})

test('resolveValues', async t => {
  const foo = 'foo'
  const bar = 'bar'
  const baz = 'baz'

  t.deepEqual(
    await resolveValues({
      [foo]: chill({millis: 5, resolution: foo}),
      [bar]: chill({millis: 10, resolution: bar}),
      [baz]: chill({millis: 15, resolution: baz})
    }),
    {foo, bar, baz}
  )
})

test('isListed: basic', t => {
  t.true(isListed({list: ['foo'], key: 'foo'}))
  t.false(isListed({list: ['foo'], key: 'bar'}))
})

test('isListed: function', t => {
  t.true(
    isListed({list: [({key, value}) => key === 'foo' && value === 'bar'], key: 'foo', value: 'bar'})
  )
  t.false(
    isListed({list: [({key, value}) => key === 'foo' && value === 'bar'], key: 'foo', value: 'baz'})
  )
})

test('parseValue', t => {
  t.is(parseValue('foo'), 'foo')
  t.is(parseValue('1'), 1)
  t.is(parseValue('1.1'), 1.1)
  t.is(parseValue('true'), true)
  t.is(parseValue('false'), false)
  t.is(parseValue('1928-04-26T06:48:47.504Z'), Date.parse('1928-04-26T06:48:47.504Z'))
  t.deepEqual(parseValue(['1', '2']), [1, 2])
  t.is(parseValue('null'), null)
})

test('isIsoDate: good', t => {
  t.true(isIsoDate('2011-10-05T14:48:00.000Z'))
})

test('isIsoDate: bad', t => {
  t.false(isIsoDate('2011-10-05T14:48:00.0000Z'))
  t.false(isIsoDate('2011-10-05T14:48:000Z'))
  t.false(isIsoDate('2011-10-05T14:488Z'))
  t.false(isIsoDate('2011-10-055'))
})

test('splitAndTrim', t => {
  t.deepEqual(splitAndTrim('a , b ,   c'), ['a', 'b', 'c'])
  t.deepEqual(splitAndTrim('a, b ,,,,c'), ['a', 'b', 'c'])
  t.deepEqual(splitAndTrim('a b c', {delimiter: ' '}), ['a', 'b', 'c'])
  t.deepEqual(splitAndTrim('a|b|c', {delimiter: '|'}), ['a', 'b', 'c'])
  t.falsy(splitAndTrim(' '))
  t.falsy(splitAndTrim(' , , '))
  t.falsy(splitAndTrim(',,,,'))
  t.falsy(splitAndTrim(3))
  t.falsy(splitAndTrim(null))
  t.falsy(splitAndTrim())
  t.falsy(splitAndTrim([]))
})
