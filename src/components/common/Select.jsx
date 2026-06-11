import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const TRIGGER_STYLES = {
  dark: 'border-white/10 bg-white/5 text-white',
  light: 'border-slate-200 bg-white text-slate-900',
}

const PLACEHOLDER_STYLES = {
  dark: 'text-slate-500',
  light: 'text-slate-400',
}

const SELECTED_TEXT_STYLES = {
  dark: 'text-white',
  light: 'text-slate-900',
}

const DROPDOWN_STYLES = {
  dark: 'border-white/10 bg-slate-900/95 shadow-black/40',
  light: 'border-slate-200 bg-white shadow-slate-200/80',
}

const OPTION_STYLES = {
  dark: {
    selected: 'bg-indigo-500/20 text-indigo-200',
    default: 'text-slate-300 hover:bg-white/5 hover:text-white',
  },
  light: {
    selected: 'bg-indigo-50 text-indigo-700',
    default: 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
  },
}

const DROPDOWN_ITEM_HEIGHT = 44
const DROPDOWN_PADDING = 8
const DROPDOWN_GAP = 6

export default function Select({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  hasError = false,
  variant = 'dark',
}) {
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState(null)
  const [openUpward, setOpenUpward] = useState(false)
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((option) => option.value === value)

  const updateDropdownPosition = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const dropdownHeight = options.length * DROPDOWN_ITEM_HEIGHT + DROPDOWN_PADDING
    const spaceBelow = window.innerHeight - rect.bottom
    const shouldOpenUpward = spaceBelow < dropdownHeight + DROPDOWN_GAP && rect.top > dropdownHeight

    setOpenUpward(shouldOpenUpward)
    setDropdownStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      top: shouldOpenUpward ? rect.top - dropdownHeight - DROPDOWN_GAP : rect.bottom + DROPDOWN_GAP,
      zIndex: 9999,
    })
  }

  useEffect(() => {
    if (!open) return

    updateDropdownPosition()

    window.addEventListener('resize', updateDropdownPosition)
    window.addEventListener('scroll', updateDropdownPosition, true)

    return () => {
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  }, [open, options.length])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) {
        return
      }

      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } })
    setOpen(false)
  }

  const dropdown = open && dropdownStyle && (
    <ul
      ref={dropdownRef}
      role="listbox"
      style={dropdownStyle}
      className={`overflow-hidden rounded-xl border p-1 shadow-2xl backdrop-blur-xl ${DROPDOWN_STYLES[variant] || DROPDOWN_STYLES.dark}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value

        return (
          <li key={option.value} role="option" aria-selected={isSelected}>
            <button
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                isSelected ? OPTION_STYLES[variant]?.selected : OPTION_STYLES[variant]?.default
              }`}
            >
              <span>{option.label}</span>
              {isSelected && (
                <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 pr-3 text-left text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 ${TRIGGER_STYLES[variant] || TRIGGER_STYLES.dark} ${
          hasError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''
        } ${open ? 'border-indigo-500 ring-2 ring-indigo-500/30' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedOption ? SELECTED_TEXT_STYLES[variant] : PLACEHOLDER_STYLES[variant]}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? (openUpward ? '' : 'rotate-180') : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdown && createPortal(dropdown, document.body)}
    </div>
  )
}
