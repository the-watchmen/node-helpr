import test from 'ava'
import {debug} from '../../src/debug'

test('debug', t => {
  let dbg = debug(__filename)
  t.is(dbg.namespace, 'dbg:@watchmen:helpr:test:ava:debug-test')
})
