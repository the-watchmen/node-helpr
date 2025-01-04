import test from 'ava'
import _ from 'lodash'
import {LRUCache} from 'lru-cache'

test('lru-cache', (t) => {
  const cache = new LRUCache({max: 1})
  cache.set('foo', 'bar')
  t.is(cache.size, 1)
  t.is(cache.get('foo'), 'bar')
})
