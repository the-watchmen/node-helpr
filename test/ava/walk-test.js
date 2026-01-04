import test from 'ava'
import debug from '@watchmen/debug'
import _ from 'lodash'
import {walk} from '../../src/index.js'

const dbg = debug(import.meta.url)

test('basic', async (t) => {
  const visitors = await walk({
    dir: './test',
    onEntry({name}) {
      dbg('name=%s', name)
    },
  })
  t.truthy(visitors)
})

test('dirent', async (t) => {
  const visitors = await walk({
    dir: './test',
    onEntry({dirent}) {
      dbg('name=%s %s', dirent.name, dirent.isDirectory() ? ' (directory)' : '')
    },
    includeDirs: true,
  })
  t.truthy(visitors)
})
