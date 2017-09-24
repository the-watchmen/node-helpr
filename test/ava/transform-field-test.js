import test from 'ava'
import _ from 'lodash'
import {transformField} from '../../src'

test('transformField: empty array', t => {
  t.deepEqual(
    transformField({
      target: {
        aField: 'val-1',
        anObject: {
          anotherField: 'val-2',
          anArray: [1, 2, 3]
        }
      },
      field: 'anObject.anArray',
      transformer: field => _.filter(field, elt => elt > 5)
    }),
    {
      aField: 'val-1',
      anObject: {
        anotherField: 'val-2'
      }
    }
  )
})

test('transformField: non-empty array', t => {
  t.deepEqual(
    transformField({
      target: {
        aField: 'val-1',
        anObject: {
          anotherField: 'val-2',
          anArray: [null, 'foo', 'bar']
        }
      },
      field: 'anObject.anArray',
      transformer: field => _.filter(field, elt => elt && elt !== 'foo')
    }),
    {
      aField: 'val-1',
      anObject: {
        anotherField: 'val-2',
        anArray: ['bar']
      }
    }
  )
})

test('transformField: object', t => {
  t.deepEqual(
    transformField({
      target: {
        aField: 'val-1',
        anObject: {
          anotherField: 'val-2'
        }
      },
      field: 'anObject',
      transformer: field =>
        field.anotherField === 'val-2' ? _.set(field, 'anotherField', 'val-3') : field
    }),
    {
      aField: 'val-1',
      anObject: {
        anotherField: 'val-3'
      }
    }
  )
})

test('transformField: empty object', t => {
  t.deepEqual(
    transformField({
      target: {
        aField: 'val-1',
        anObject: {
          anotherField: 'val-2'
        }
      },
      field: 'anObject',
      transformer: field => (field.anotherField === 'val-2' ? _.omit(field, 'anotherField') : field)
    }),
    {
      aField: 'val-1'
    }
  )
})
