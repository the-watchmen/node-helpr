import test from 'ava'
import {combine} from '../../src'

function plus(a, b) {
  return a + b
}
test('combine: basic', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({source: o, target: o, operator: plus}), {a: 2, b: 4, c: 6})
})

test('combine: more in target', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({source: {b: 2}, target: o, operator: plus}), {a: 1, b: 4, c: 3})
})

test('combine: more in source', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({source: o, target: {b: 2}, operator: plus}), {b: 4})
})

test('combine: more in target union', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({target: {b: 2}, source: o, operator: plus, union: true}), {a: 1, b: 4, c: 3})
})

test('combine: more in source union', t => {
  const o = {a: 1, b: 2, c: 3}
  t.deepEqual(combine({target: o, source: {b: 2}, operator: plus, union: true}), {a: 1, b: 4, c: 3})
})
