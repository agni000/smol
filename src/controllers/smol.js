import path from "path"
import { fileURLToPath } from "url"
import { createUrl, readUrl } from "../lib/db.js"
import { isSafeUrl } from "../utils/validateUrl.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const helloSmol = (request, response) => {
  console.log(`Request method: ${request.method}`)
  return response.status(200).sendFile(path.join(__dirname, "../public/index.html"))
}

export const postUrlHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)
  console.log(`Body: ${request.body.original}`)

  const url = request.body.original?.trim()

  if (!url) {
    return response.status(400).send({ error: 'Invalid URL' })
  }

  const isSafe = await isSafeUrl(url)

  if (!isSafe.valid) {
    return response.status(400).send({ error: isSafe.error })
  }

  const newUrl = await createUrl(url)
  console.log(`new url object: ${JSON.stringify(newUrl)}`)
  return response.status(200).json({ smolUrl: `http://localhost:6969/${newUrl.smol}`, smol: `${newUrl.smol}` })
}

export const readUrlHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)

  const smolUrl = request.params?.smol?.trim()

  if (!smolUrl) {
    return response.status(400).send({ error: 'Invalid ID' })
  }

  const url = await readUrl(smolUrl)

  if (!url) {
    console.log(`original Url: ${url.originalUrl}`)
    return response.status(404).send({ error: 'URL not found' })
  }

  response.redirect(url.originalUrl)
}
