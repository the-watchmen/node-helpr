/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
import {LRUCache} from 'lru-cache'
import debug from '@watchmen/debug'
import Timer from '@watchmen/tymer'

const dbg = debug(import.meta.url)

export async function getCacheManager(options) {
  const cacheManager = {}
  for (const key in options) {
    cacheManager[key] = await _createCache({key, opts: options[key]})
  }

  return {
    async createCache({key, opts}) {
      cacheManager[key] = await _createCache({key, opts})
    },
    get: (key) => cacheManager[key],
    async reset() {
      for (const key in cacheManager) {
        cacheManager[key] && (await cacheManager[key].reset())
      }
    },
    async cleanup() {
      for (const key in cacheManager) {
        cacheManager[key] && (await cacheManager[key].cleanup())
      }
    },
  }
}

async function _createCache({key, opts: options = {}}) {
  dbg('init: key=%o, opts=%j', key, options)
  let hits = 0
  let misses = 0
  let missing = 0
  const evictPromises = []
  const timer = new Timer(`${key}-get`)

  if (options.onEvict) {
    options.dispose = (value, key) => {
      dbg('dispose: key=%o, value=%o', key, value)
      evictPromises.push(options.onEvict({key, value}))
    }
  }

  const cache = options.max && new LRUCache(options)
  options.max && options.init && (await options.init(cache))

  async function insureEvictions() {
    evictPromises.length && (await Promise.all(evictPromises))
    evictPromises.length = 0
  }

  async function cleanup() {
    cache.clear()
    return insureEvictions()
  }

  return (
    cache && {
      name: () => key,
      stats() {
        return {key, hits, misses, missing, items: cache.size}
      },
      async get(key) {
        let value = cache.get(key)
        if (value) {
          hits++
        } else {
          misses++
          if (options.get) {
            timer.start()
            value = await options.get(key)
            timer.stop()
          }

          if (value) {
            cache.set(key, value)
          } else {
            missing++
          }
        }

        return value
      },
      async set({key, value}) {
        const result = cache.set(key, value)
        await insureEvictions()
        return result
      },
      has: (key) => cache.has(key),
      async del(key) {
        const result = cache.del(key)
        await insureEvictions()
        return result
      },
      async reset() {
        await cleanup()
        return options.init && options.init(cache)
      },
      timer: () => timer,
      isThresh: (thresh) => (hits + misses) % thresh === 0,
      cleanup,
      _cache: cache,
    }
  )
}
