import { createUrl, readUrl } from "../lib/db.js"
import { isSafeUrl } from "../utils/validateUrl.js"
import 'dotenv/config'

export const postUrlHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)
  console.log(`Body: ${request.body.original}`)

  let url = request.body.original

  if (!url || typeof url !== 'string') {
    return response.status(400).send({ error: 'Invalid URL' })
  }

  url = url.trim()

  const isSafe = await isSafeUrl(url)

  if (!isSafe.valid) {
    return response.status(400).send({ error: isSafe.error })
  }

  const newUrl = await createUrl(url)
  console.log(`new url object: ${JSON.stringify(newUrl)}`)
  return response.status(201).json({ smol: `${newUrl.smol}` })
}

export const readUrlHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)

  const smolUrl = request.params?.smol?.trim()

  if (!smolUrl) {
    return response.status(400).send({ error: 'Invalid ID' })
  }

  const url = await readUrl(smolUrl)

  if (!url) {
    return response.status(404).send({ error: 'URL not found' })
  }

  response.redirect(url.originalUrl)
}
