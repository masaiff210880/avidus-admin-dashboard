import { useEffect, useState } from 'react'

function ToastItem({ id, type, message, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const enterTimer = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(enterTimer)
  }, [])

  const handleDismiss = () => {
    setLeaving(true)
    setTimeout(() => onDismiss(id), 300)
  }

  const isSuccess = type === 'success'

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out ${
        visible && !leaving
          ? 'translate-y-0 opacity-100'
          : '-translate-y-3 opacity-0'
      } ${
        isSuccess
          ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-50'
          : 'border-red-500/30 bg-red-950/90 text-red-50'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isSuccess ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
        }`}
        aria-hidden="true"
      >
        {isSuccess ? '✓' : '!'}
      </span>

      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>

      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-0.5 text-white/60 transition hover:bg-white/10 hover:text-white"
        aria-label="Dismiss notification"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
