const COOKIE_PREFIX = 'avidus_'

function buildCookieString(key, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const encoded =
    typeof value === 'string' ? encodeURIComponent(value) : encodeURIComponent(JSON.stringify(value))
  return `${COOKIE_PREFIX}${key}=${encoded}; expires=${expires}; path=/; SameSite=Lax`
}

export function setCookie(key, value, days = 7) {
  document.cookie = buildCookieString(key, value, days)
}

export function getCookie(key) {
  const name = `${COOKIE_PREFIX}${key}=`
  const cookies = document.cookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(name)) {
      const value = decodeURIComponent(cookie.slice(name.length))
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    }
  }

  return null
}

export function removeCookie(key) {
  document.cookie = `${COOKIE_PREFIX}${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
