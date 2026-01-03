import test from 'ava'
import fs from 'fs-extra'
import debug from '@watchmen/debug'
import {deepReplace, replaceInData, replaceInFile} from '../../src/index.js'

const dbg = debug(import.meta.url)

function onMatch(args) {
  dbg('args=%o', args)
}

test('basic', (t) => {
  t.deepEqual(deepReplace({target: {a: '{{one}}'}, replaceMap: {one: 'one'}, onMatch}), {a: 'one'})
})

test('nested', (t) => {
  t.deepEqual(
    deepReplace({
      target: {a: '{{one.two.three}}'},
      replaceMap: {one: {two: {three: 'three'}}},
      onMatch,
    }),
    {
      a: 'three',
    },
  )
})

test('array', (t) => {
  t.deepEqual(
    deepReplace({
      target: {a: ['one', '{{one.two}}', 'three']},
      replaceMap: {one: {two: 'two'}},
      onMatch,
    }),
    {
      a: ['one', 'two', 'three'],
    },
  )
})

test('nested-obj', (t) => {
  t.deepEqual(
    deepReplace({target: {a: '{{one.two}}'}, replaceMap: {one: {two: {three: 'three'}}}, onMatch}),
    {
      a: {three: 'three'},
    },
  )
})

test('rid-basic', (t) => {
  t.is(
    replaceInData({data: 'the quick brown fox', replaceMap: {brown: 'red'}, onMatch}),
    'the quick red fox',
  )
})

test('rid-multi', (t) => {
  t.is(
    replaceInData({data: 'the quick brown hen and hens', replaceMap: {hen: 'cow'}, onMatch}),
    'the quick brown cow and cows',
  )
})

test('rid-re', (t) => {
  t.is(
    replaceInData({
      data: "I'm sure he's Bill or Billy or Mac or Buddy",
      replaceMap: {'(Billy|Bill|Mac|Buddy)': 'William'},
      onMatch,
    }),
    "I'm sure he's William or William or William or William",
  )
})

test('rif-basic', async (t) => {
  const work = '/tmp/scratch'
  await fs.ensureDir(work)
  const file = `${work}/scratch.dat`
  let data = 'the quick brown fox'
  await fs.writeFile(file, data)
  await replaceInFile({
    file,
    replaceMap: {brown: 'grey', fox: 'cat'},
    onMatch(args) {
      dbg('file=%s, args=%o', file, args)
    },
  })
  data = await fs.readFile(file, 'utf8')
  t.is(data, 'the quick grey cat')
})
