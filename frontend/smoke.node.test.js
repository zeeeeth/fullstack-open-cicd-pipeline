import { test } from 'node:test'
import assert from 'node:assert'

test('frontend smoke: node --test runs', () => {
  assert.strictEqual(1 + 1, 2)
})
