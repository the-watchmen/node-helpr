import _ from 'lodash'
import debug from 'debug'

const dbg = debug('app:helpr:is-like')

const assertRe = /^assert\((.+)\)$/

/* eslint-disable no-unused-expressions */

export const isLikeHooks = {
  assert: {
    shouldTrigger: ({expected}) => assertRe.test(expected),
    // eslint-disable-next-line no-unused-vars
    isLike: ({expected, actual}) => {
      const match = assertRe.exec(expected)
      // eslint-disable-next-line no-eval
      return match[1] && eval(match[1])
    }
  }
}

export function isLike({expected, actual, hooks}) {
  if (_.isArray(expected)) {
    const result = isArrayLike({expected, actual, hooks})
    result || _dbg({expected, actual})
    return result
  }

  if (_.isObject(expected)) {
    const result = isObjectLike({expected, actual, hooks})
    result || _dbg({expected, actual})
    return result
  }

  if (hooks) {
    const hook = _.find(hooks, elt => elt.shouldTrigger({expected, actual}))
    if (hook) {
      const result = hook.isLike({expected, actual})
      result || _dbg({expected, actual})
      return result
    }
  }

  const result = expected === actual
  // result || _dbg({expected, actual})
  return result
}

function isArrayLike({expected, actual, hooks}) {
  return (
    _.isArray(actual) &&
    expected.length === actual.length &&
    _.every(expected, (elt, index) => {
      const result = isLike({expected: elt, actual: actual[index], hooks})
      result || dbg('!is-like: index=%o, expected=%j, actual=%j', index, elt, actual[index])
      return result
    })
  )
}

function isObjectLike({expected, actual, hooks}) {
  return (
    _.isObject(actual) &&
    _.every(expected, (elt, key) => {
      const result = isLike({expected: elt, actual: actual[key], hooks})
      result || dbg('!is-like: key=%o, expected=%j, actual=%j', key, elt, actual[key])
      return result
    })
  )
}

function _dbg({expected, actual}) {
  dbg('!is-like: expected=%j, actual=%j', expected, actual)
}
