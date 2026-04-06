import { describe, test, expect, beforeEach, vi } from 'vitest'

describe('base62Encode', () => {
  const ORIGINAL_OFFSET = process.env.OFFSET

  beforeEach(() => {
    vi.resetModules()
    process.env.OFFSET = ORIGINAL_OFFSET
  })

  test('encodes basic values', async () => {
    process.env.OFFSET = '0'

    const { base62Encode } = await import('../src/utils/base62.js')

    expect(base62Encode(1)).toBe('1')
    expect(base62Encode(61)).toBe('Z')
  })

  test('encodes multi-digit values', async () => {
    process.env.OFFSET = '0'

    const { base62Encode } = await import('../src/utils/base62.js')

    expect(base62Encode(62)).toBe('10')
  })

  test('applies OFFSET', async () => {
    process.env.OFFSET = '10'

    const { base62Encode } = await import('../src/utils/base62.js')

    expect(base62Encode(0)).toBe('a')
  })

  test('throws if OFFSET is invalid', async () => {
    process.env.OFFSET = 'abc'

    await expect(import('../src/utils/base62.js'))
      .rejects
      .toThrow('OFFSET must be a valid number')
  })
})
