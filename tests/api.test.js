import { describe, test, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'
import * as db from '../src/lib/db.js'
import * as validateUrl from '../src/utils/validateUrl.js'

/* db and url validator mock */
vi.mock('../src/lib/db.js')
vi.mock('../src/utils/validateUrl.js')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /', () => {
  test('returns 201 for valid URL', async () => {
    validateUrl.isSafeUrl.mockResolvedValue({ valid: true })
    db.createUrl.mockResolvedValue({ smol: '138y', originalUrl: 'https://example.com/' })

    const response = await request(app)
      .post('/')
      .send({ original: 'https://example.com/' })
      .expect(201)

    expect(response.body.smol).toBeDefined()
    expect(response.body.smol).toBe('138y')
    expect(db.createUrl).toHaveBeenCalledWith('https://example.com/')
  })

  test('returns 400 for empty URL', async () => {
    const response = await request(app)
      .post('/')
      .send({ original: '' })
      .expect(400)

    expect(response.body.error).toBe('Invalid URL')
  })

  test('returns 400 for invalid type', async () => {
    const response = await request(app)
      .post('/')
      .send({ original: 123 })
      .expect(400)

    expect(response.body.error).toBe('Invalid URL')
  })

  test('returns 400 for unsafe / undefined DNS URL', async () => {
    validateUrl.isSafeUrl.mockResolvedValue({ valid: false, error: 'DNS not found' })

    const response = await request(app)
      .post('/')
      .send({ original: 'https://undefineddns.com/' })
      .expect(400)

    expect(response.body.error).toBe('DNS not found')
  })
})

describe('GET /:smol', () => {
  test('redirects (302) for existing smol', async () => {
    db.readUrl.mockResolvedValue({ smol: '138y', originalUrl: 'https://example.com/' })

    const response = await request(app).get('/138y').expect(302)
    expect(response.headers.location).toBe('https://example.com/')
    expect(db.readUrl).toHaveBeenCalledWith('138y')
  })

  test('returns 404 for non-existing smol', async () => {
    db.readUrl.mockResolvedValue(null)

    const response = await request(app).get('/doesnotexist').expect(404)
    expect(response.body.error).toBe('URL not found')
  })
})
