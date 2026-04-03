import { prisma } from "./prisma.js"
import { base62Encode } from "../utils/base62.js"

export const createUrl = async (url) => {
  const newUrl = await prisma.url.create({
    data: {
      originalUrl: url
    }
  })

  const shortCode = base62Encode(newUrl.id)

  const updateUrl = await prisma.url.update({
    where: { id: newUrl.id },
    data: { smol: shortCode }
  })

  return updateUrl
}

export const readUrl = async (smolUrl) => {
  const url = await prisma.url.findUnique({
    where: { smol: smolUrl }
  })

  if (!url) {
    throw new Error("URL not found")
  }

  return url
}
