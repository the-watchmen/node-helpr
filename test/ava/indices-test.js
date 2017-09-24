import test from 'ava'
import {findDeepIndices} from '../../src'

const deepArray = [
  {
    one: [
      {
        two: [{_id: 1}, {_id: 2}]
      },
      {
        two: [{_id: 3}, {_id: 4}]
      }
    ]
  },
  {
    one: [
      {
        two: [{_id: 5}, {_id: 6}]
      },
      {
        two: [{_id: 7}, {_id: 8}]
      }
    ]
  }
]

test('indices: none', t => {
  t.deepEqual(
    findDeepIndices({
      array: [{_id: 1}, {_id: 2}, {_id: 3}, {_id: 4}],
      path: [],
      predicate: elt => elt._id === 3
    }),
    [2]
  )
})

test('indices: one', t => {
  t.deepEqual(
    findDeepIndices({
      array: [
        {
          one: [{_id: 1}, {_id: 2}]
        },
        {
          one: [{_id: 3}, {_id: 4}]
        }
      ],
      path: ['one'],
      predicate: elt => elt._id === 3
    }),
    [1, 0]
  )
})

test('indices: deep first', t => {
  t.deepEqual(
    findDeepIndices({
      array: deepArray,
      path: ['one', 'two'],
      predicate: elt => elt._id === 1
    }),
    [0, 0, 0]
  )
})

test('indices: deep middle', t => {
  t.deepEqual(
    findDeepIndices({
      array: deepArray,
      path: ['one', 'two'],
      predicate: elt => elt._id === 6
    }),
    [1, 0, 1]
  )
})

test('indices: deep end', t => {
  t.deepEqual(
    findDeepIndices({
      array: deepArray,
      path: ['one', 'two'],
      predicate: elt => elt._id === 8
    }),
    [1, 1, 1]
  )
})

test('indices: deep none', t => {
  t.is(
    findDeepIndices({
      array: deepArray,
      path: ['one', 'two'],
      predicate: elt => elt._id === 'nope'
    }),
    null
  )
})

test('indices: deeper', t => {
  t.deepEqual(
    findDeepIndices({
      array: [{one: [{two: [{three: [{four: [{five: [{_id: 1}]}]}]}]}]}],
      path: ['one', 'two', 'three', 'four', 'five'],
      predicate: elt => elt._id === 1
    }),
    [0, 0, 0, 0, 0, 0]
  )
})

test('indices: array in object', t => {
  const array = [
    {
      one: {
        two: [
          {
            _id: 1
          },
          {
            _id: 2
          }
        ]
      }
    },
    {
      one: {
        two: [
          {
            _id: 3
          },
          {
            _id: 4
          }
        ]
      }
    }
  ]

  t.deepEqual(
    findDeepIndices({
      array,
      path: ['one.two'],
      predicate: elt => elt._id === 3
    }),
    [1, 0]
  )
})

test('indices: object in array', t => {
  const array = [
    {
      one: [{two: {_id: 1}}]
    },
    {
      one: [{two: {_id: 2}}]
    },
    {
      one: [{two: {_id: 3}}]
    },
    {
      one: [{two: {_id: 4}}]
    }
  ]

  t.deepEqual(
    findDeepIndices({
      array,
      path: ['one'],
      predicate: elt => elt.two._id === 3
    }),
    [2, 0]
  )
})
