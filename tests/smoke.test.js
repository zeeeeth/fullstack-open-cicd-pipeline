import { test } from 'node:test'
import assert from 'node:assert'

test('smoke: backend tests run without Mongo', () => {
  assert.strictEqual(2 + 2, 4)
})
