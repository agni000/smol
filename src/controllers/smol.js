import path from "path"
import { fileURLToPath } from "url"
import { createUrl } from "../lib/db.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const helloSmol = (request, response) => {
  console.log(`Request method: ${request.method}`)
  return response.sendFile(path.join(__dirname, "../public/index.html"))
}

export const postHandler = async (request, response) => {
  console.log(`Request method: ${request.method}`)
  console.log(`Body: ${request.body.original}`)

  const url = request.body.original?.trim()

  if (!url) {
    throw new Error("Invalid URL")
  }

  const newUrl = await createUrl(url)

  console.log(`new url object: ${JSON.stringify(newUrl)}`)
}
