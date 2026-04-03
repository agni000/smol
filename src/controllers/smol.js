import path from "path"
import { fileURLToPath } from "url"
import { createUrl, readUrl } from "../lib/db.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const helloSmol = (request, response) => {
  console.log(`Request method: ${request.method}`)
  return response.sendFile(path.join(__dirname, "../public/index.html"))
}

export const postUrlHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)
  console.log(`Body: ${request.body.original}`)

  const url = request.body.original?.trim()

  if (!url) {
    throw new Error("Invalid URL")
  }

  const newUrl = await createUrl(url)

  console.log(`new url object: ${JSON.stringify(newUrl)}`)
}

export const readUrlHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)

  const smolUrl = request.params.smol

  if (!smolUrl) {
    throw new Error("Invalid ID")
  }

  const url = await readUrl(smolUrl)

  console.log(`original Url: ${url.originalUrl}`)

  response.redirect(url.originalUrl)
}
