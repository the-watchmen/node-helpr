import test from 'ava'
import {isLike, isLikeHooks} from '../../src'

test('isLike: identical objects', t => {
  const expected = {a: 1}
  const actual = expected
  t.true(isLike({expected, actual}))
})

test('isLike: actual object has extra keys', t => {
  const expected = {a: 1}
  const actual = Object.assign({}, expected, {b: 2})
  t.true(isLike({expected, actual}))
})

test('isLike: actual object is missing key', t => {
  const expected = {a: 1}
  const actual = {b: 1}
  t.false(isLike({expected, actual}))
})

test('isLike: actual object value is not identical', t => {
  const expected = {a: 1}
  const actual = {a: '1'}
  t.false(isLike({expected, actual}))
})

test('isLike: identical nested objects', t => {
  const expected = {a: {b: 1}}
  const actual = expected
  t.true(isLike({expected, actual}))
})

test('isLike: identical arrays', t => {
  const expected = [{a: 1}]
  const actual = expected
  t.true(isLike({expected, actual}))
})

test('isLike: actual array has more values', t => {
  const expected = [{a: 1}]
  const actual = [...expected, {b: 2}]
  t.false(isLike({expected, actual}))
})

test('isLike: actual is not an array', t => {
  const expected = [{a: 1}]
  const actual = {b: 2}
  t.false(isLike({expected, actual}))
})

test('isLike: expected array has more values', t => {
  const actual = [{a: 1}]
  const expected = [{b: 2}]
  t.false(isLike({expected, actual}))
})

test('isLike: expected assert basic', t => {
  // console.log('hooks=%o', hooks)
  const actual = [{a: 1}]
  const expected = [{a: 'assert(actual == 1)'}]
  t.true(isLike({expected, actual, hooks: [isLikeHooks.assert]}))
})

test('isLike: expected assert type', t => {
  const actual = [{a: new Date()}]
  const expected = [{a: 'assert(actual.constructor.name == "Date")'}]
  t.true(isLike({expected, actual, hooks: [isLikeHooks.assert]}))
})

test('isLike: complex', t => {
  const actual = {
    _id: 'e:pac:3375456619:4860 Y ST:SCARAMENTO:CA:958171532',
    address: {
      line2: null,
      line1: '4860 Y ST',
      city: 'SCARAMENTO',
      state: 'CA',
      zip: '958171532'
    },
    phone: '9167342700',
    organization: {
      _id: 'e:pac:3375456619',
      id: {
        authority: 'pac',
        oid: 'pac',
        extension: '3375456619'
      },
      name: 'REGENTS OF THE UNIV OF CA',
      identifiers: [
        {
          authority: 'pac',
          oid: 'pac',
          extension: '3375456619'
        }
      ]
    },
    specialties: [
      {
        _id: '58f0eb1cd55e34a3cf221fae',
        code: '1223X0400X',
        grouping: 'DENTAL PROVIDERS',
        classification: 'DENTIST',
        specialization: 'ORTHODONTICS AND DENTOFACIAL ORTHOPEDICS',
        system: '2.16.840.1.113883.6.101',
        isPrimary: true
      }
    ],
    isPrivate: null,
    geoPoint: {
      type: 'Point',
      coordinates: [-121.448555, 38.552877]
    },
    created: {
      date: '2017-04-18T14:44:24.984Z',
      source: {
        _id: '-1',
        name: 'cms'
      }
    },
    updated: {
      date: '2017-04-18T15:18:41.229Z',
      source: {
        _id: '-1',
        name: 'cms'
      }
    },
    foobar: null
  }
  const expected = {
    address: {
      line1: '4860 Y ST',
      city: 'SCARAMENTO',
      state: 'CA',
      zip: '958171532'
    },
    phone: '9167342700',
    organization: {
      _id: 'e:pac:3375456619',
      id: {
        authority: 'pac',
        oid: 'pac',
        extension: '3375456619'
      },
      name: 'REGENTS OF THE UNIV OF CA',
      identifiers: [
        {
          authority: 'pac',
          oid: 'pac',
          extension: '3375456619'
        }
      ]
    },
    specialties: [
      {
        _id: '58f0eb1cd55e34a3cf221fae',
        code: '1223X0400X',
        grouping: 'DENTAL PROVIDERS',
        classification: 'DENTIST',
        specialization: 'ORTHODONTICS AND DENTOFACIAL ORTHOPEDICS',
        system: '2.16.840.1.113883.6.101',
        isPrimary: true
      }
    ],
    geoPoint: {
      type: 'Point',
      coordinates: [-121.448555, 38.552877]
    },
    foobar: undefined
  }

  const result = isLike({expected, actual})
  t.false(result)
})
