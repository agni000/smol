import 'dotenv/config'

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const OFFSET = (() => {
  const value = Number(process.env.OFFSET)

  if (Number.isNaN(value)) {
    throw new Error('OFFSET must be a valid number')
  }

  return value
})()

export const base62Encode = (num) => {
  let newNum = num + OFFSET
  let result = ''

  while (newNum > 0) {
    result = BASE62[newNum % 62] + result
    newNum = Math.floor(newNum / 62)
  }

  return result
}
