import dns from 'dns/promises'
import net from 'net'

const ALLOWED_PROTOCOLS = ['http:', 'https:']

const isPrivateIP = (ip) => {
  if (net.isIPv4(ip)) {
    const [, second] = ip.split('.').map(Number)

    return (
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      ip.startsWith("127.") ||
      (ip.startsWith("172.") && second >= 16 && second <= 31)
    )
  }

  if (net.isIPv6(ip)) {
    return (
      ip === '::1' ||
      ip.startsWith('fe80') ||
      ip.startsWith('fc') ||
      ip.startsWith('fd')
    )
  }
  return false
}

export const isSafeUrl = async (rawUrl) => {
  /* check existence */
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Missing URL' }
  }

  let parsed

  /* parse */
  try {
    parsed = new URL(rawUrl)
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }

  /* check protocol */
  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    return { valid: false, error: 'Only HTTP/HTTPS allowed' }
  }

  /* check hostname */
  if (parsed.hostname === 'localhost') {
    return { valid: false, error: 'Localhost not allowed' }
  }

  /* check DNS + request forgery (SSRF) */
  try {
    const addresses = await dns.lookup(parsed.hostname, { all: true })

    for (const addr of addresses) {
      if (isPrivateIP(addr.address)) {
        return { valid: false, error: 'Private IP not allowed' }
      }
    }
  } catch {
    return { valid: false, error: 'DNS resolution failed' }
  }

  return { valid: true, parsed }
}
