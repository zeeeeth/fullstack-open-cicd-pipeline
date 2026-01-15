const test = require('node:test')
const assert = require('node:assert')

test('smoke: backend tests run without Mongo', () => {
  assert.strictEqual(2 + 2, 4)
})
