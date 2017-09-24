import assert from 'assert'
import _ from 'lodash'
// import debug from 'debug'
// import {stringify} from '.'

// const dbg = debug('app:helpr:indices')

// eslint-disable-next-line import/prefer-default-export
export function findDeepIndices({array, path, predicate}) {
  // dbg('array=%o, path=%o', stringify(array), path)
  assert(_.isArray(array), 'array required')
  assert(_.isArray(path), 'path array required')
  if (path.length > 0) {
    const result = _.transform(array, (result, val, index) => {
      // dbg('result=%o, val=%o, index=%o', result, stringify(val), index)
      const childArray = _.get(val, path[0])
      if (_.isArray(childArray)) {
        const childIndices = findDeepIndices({array: childArray, path: path.slice(1), predicate})
        if (childIndices) {
          result.push(index)
          result.push(...childIndices)
          return false
        }
      }
    })
    return _.isEmpty(result) ? null : result
  }
  const index = _.findIndex(array, predicate)
  return index < 0 ? null : [index]
}
