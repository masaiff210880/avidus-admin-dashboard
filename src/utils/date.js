const DATE_TIME_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}

const DATE_ONLY_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

function toValidDate(value) {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value, fallback = '—') {
  const date = toValidDate(value)
  if (!date) return fallback

  return date.toLocaleString('en-US', DATE_TIME_OPTIONS)
}

export function formatDate(value, fallback = '—') {
  const date = toValidDate(value)
  if (!date) return fallback

  return date.toLocaleDateString('en-US', DATE_ONLY_OPTIONS)
}
