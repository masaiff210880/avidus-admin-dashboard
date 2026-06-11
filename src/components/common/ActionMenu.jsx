import { useEffect, useRef, useState } from 'react'

const VARIANT_STYLES = {
  default: 'text-slate-700 hover:bg-slate-50',
  success: 'text-emerald-700 hover:bg-emerald-50',
  danger: 'text-red-600 hover:bg-red-50',
}

function ThreeDotIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  )
}

export default function ActionMenu({ options = [], className = '', align = 'right' }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (option) => {
    option.onClick?.()
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="Actions"
        className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-transparent p-2 text-slate-400 transition-all duration-200 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 active:scale-95 ${
          open
            ? 'border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm'
            : ''
        }`}
        aria-label="Open actions menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <ThreeDotIcon />
      </button>

      {open && options.length > 0 && (
        <div
          role="menu"
          className={`absolute z-50 mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option, index) => (
            <button
              key={`${option.label}-${index}`}
              type="button"
              role="menuitem"
              onClick={() => handleOptionClick(option)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium capitalize transition ${
                VARIANT_STYLES[option.variant] || VARIANT_STYLES.default
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
