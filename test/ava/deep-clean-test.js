import test from 'ava'
import {deepClean} from '../../src'

test('deepClean: primitive', t => {
  t.deepEqual(deepClean(1), 1)
})

test('deepClean: null', t => {
  t.deepEqual(deepClean(null), null)
})

test('deepClean: empty array', t => {
  t.deepEqual(deepClean([]), null)
})

test('deepClean: null array', t => {
  t.deepEqual(deepClean([null]), null)
})

test('deepClean: empty object', t => {
  t.deepEqual(deepClean({}), null)
})

test('deepClean: null object', t => {
  t.deepEqual(deepClean({a: null}), null)
})

test('deepClean: basic', t => {
  t.deepEqual(deepClean({a: 1, b: null}), {a: 1})
})

test('deepClean: array fields', t => {
  t.deepEqual(deepClean({a: [1, null, 2], b: [], c: [null, null, {}, []]}), {a: [1, 2]})
})

test('deepClean: array', t => {
  t.deepEqual(deepClean([{a: [1, null, 2]}, {b: []}, {c: [null, null, {}, []]}, null, 0, false]), [
    {a: [1, 2]}
  ])
})

test('deepClean: nested', t => {
  t.deepEqual(
    deepClean({
      a: {
        b: {
          c: null
        }
      },
      d: {
        e: [null, null, null]
      },
      foo: 'bar'
    }),
    {foo: 'bar'}
  )
})
