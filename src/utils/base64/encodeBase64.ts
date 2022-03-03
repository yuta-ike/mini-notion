import { fromByteArray, toByteArray } from "base64-js"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export const encodeBase64 = (source: string) => {
  return fromByteArray(textEncoder.encode(encodeURIComponent(source)))
}

export const decodeBase64 = (hash: string) => {
  return decodeURIComponent(textDecoder.decode(toByteArray(hash)))
}
