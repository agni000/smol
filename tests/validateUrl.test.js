import { describe, test, expect, vi, beforeEach } from 'vitest'
import dns from 'dns/promises'
import { isSafeUrl } from '../src/utils/validateUrl.js'

vi.mock('dns/promises', () => ({
  default: {
    lookup: vi.fn()
  }
}))

describe('isSafeUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns error for missing URL', async () => {
    const result = await isSafeUrl()

    expect(result).toEqual({
      valid: false,
      error: 'Missing URL'
    })
  })

  test('returns error for non-string URL', async () => {
    const result = await isSafeUrl(123)

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Missing URL')
  })

  test('returns error for invalid URL format', async () => {
    const result = await isSafeUrl('not-a-url')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Invalid URL format')
  })

  test('rejects non-http protocols', async () => {
    const result = await isSafeUrl('ftp://example.com')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Only HTTP/HTTPS allowed')
  })

  test('rejects localhost', async () => {
    const result = await isSafeUrl('http://localhost')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Localhost not allowed')
  })

  test('rejects private IPv4 address', async () => {
    dns.lookup.mockResolvedValue([
      { address: '192.168.0.1' }
    ])

    const result = await isSafeUrl('http://example.com')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Private IP not allowed')
  })

  test('rejects private IPv6 address', async () => {
    dns.lookup.mockResolvedValue([
      { address: '::1' }
    ])

    const result = await isSafeUrl('http://example.com')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Private IP not allowed')
  })

  test('returns error if DNS fails', async () => {
    dns.lookup.mockRejectedValue(new Error('fail'))

    const result = await isSafeUrl('http://example.com')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('DNS resolution failed')
  })

  test('accepts valid public URL', async () => {
    dns.lookup.mockResolvedValue([
      { address: '8.8.8.8' }
    ])

    const result = await isSafeUrl('https://example.com')

    expect(result.valid).toBe(true)
    expect(result.parsed).toBeInstanceOf(URL)
  })
})
