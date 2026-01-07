import fs from 'fs-extra'
import test from 'ava'
import debug from '@watchmen/debug'
import _ from 'lodash'
import {walk} from '../../src/index.js'

const dbg = debug(import.meta.url)

test('basic', async (t) => {
  const visitors = await walk({
    dir: './test',
    onEntry(args) {
      dbg('args=%o', args)
    },
  })
  t.truthy(visitors)
})

test('dirent', async (t) => {
  const visitors = await walk({
    dir: './test/',
    onEntry({file, dirent}) {
      dbg('file=%s %s', file, dirent.isDirectory() ? ' (directory)' : '')
    },
    includeDirs: true,
  })
  t.truthy(visitors)
})

test('no-op', async (t) => {
  const results = await walk({
    dir: './test/',
    includeDirs: true,
  })
  dbg('results=%o', results)
  t.truthy(results)
  t.true(results[0] instanceof fs.Dirent)
})

test('parallel', async (t) => {
  const visitors = await walk({
    dir: './test/',
    onEntry({file, dirent}) {
      dbg('file=%s %s', file, dirent.isDirectory() ? ' (directory)' : '')
      return file
    },
    includeDirs: true,
    isParallel: true,
  })
  t.truthy(visitors)
  t.true(_.isString(visitors[0]))
})
