import test from 'ava'
import {deepReplace} from '../../src/index.js'

test('basic', (t) => {
  t.deepEqual(deepReplace({target: {a: '{{one}}'}, replaceMap: {one: 'one'}}), {a: 'one'})
})

test('nested', (t) => {
  t.deepEqual(
    deepReplace({target: {a: '{{one.two.three}}'}, replaceMap: {one: {two: {three: 'three'}}}}),
    {
      a: 'three',
    },
  )
})

test('nested-obj', (t) => {
  t.deepEqual(
    deepReplace({target: {a: '{{one.two}}'}, replaceMap: {one: {two: {three: 'three'}}}}),
    {
      a: {three: 'three'},
    },
  )
})
