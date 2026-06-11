const ROLE_STYLES = {
  admin: 'bg-violet-100 text-violet-700',
  user: 'bg-slate-100 text-slate-700',
}

const STATUS_STYLES = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-red-100 text-red-700',
}

const DEFAULT_STYLE = 'bg-slate-100 text-slate-600'

function getBadgeStyle(type, value) {
  const normalizedValue = value?.toLowerCase()

  if (type === 'role') {
    return ROLE_STYLES[normalizedValue] || DEFAULT_STYLE
  }

  if (type === 'status') {
    return STATUS_STYLES[normalizedValue] || DEFAULT_STYLE
  }

  return DEFAULT_STYLE
}

export default function Badge({ type, value, className = '' }) {
  if (!value) return null

  const style = getBadgeStyle(type, value)

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style} ${className}`}
    >
      {value}
    </span>
  )
}
