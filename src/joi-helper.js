import assert from 'node:assert'
import joi from 'joi'
import debug from 'debug'
import {MODES} from './constants.js'
import {stringify} from './index.js'

const {create, upsert} = MODES
const dbg = debug('lib:helpr')

export function joiAssert({data, schema}) {
  const result = joi.validate(data, schema)
  if (result.error) {
    throw result.error
  }

  return true
}

export function joiValidator({schema, createModifier} = {}) {
  return function ({mode, data}) {
    dbg('joi-validator: mode=%o, data=%o', mode, stringify(data))
    return [create, upsert].includes(mode)
      ? joiAssert({data, schema: createModifier ? createModifier(schema) : schema})
      : joiAssert({data, schema})
  }
}

//
// these exported schemas will have issues if resolved in diff instance of joi,
// (e.g. when using 'yarn link' and if a local instance of joi is installed don't currently work because of:
// https://github.com/hapijs/joi/issues/1261
// so currently need to clone out in consuming project
//
export const identified = joi.object({
  _id: joi.string().meta({isGenerated: true}).label('id'),
})

export function discriminated({name, value, label, altName} = {}) {
  assert(name && value && label, 'name, value and label required')
  return joi.object({
    [name]: joi
      .string()
      .valid(value)
      .label(label)
      .meta({isDiscriminator: true, label: altName || name}),
  })
}
