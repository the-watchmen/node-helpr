import test from 'ava'
import {withEnv} from '../../src/index.js'

test('basic', async (t) => {
  const fooOld = 'old'
  const fooNew = 'new'
  process.env.FOO = fooOld
  await withEnv({
    env: {FOO: fooNew},
    async closure() {
      t.is(process.env.FOO, fooNew)
    },
  })
  t.is(process.env.FOO, fooOld)
  delete process.env.FOO
})
