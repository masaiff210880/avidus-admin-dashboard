import { createContext, useCallback, useContext, useState } from 'react'
import ToastContainer from '../components/common/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(({ type = 'success', message, duration = 4000 }) => {
    const id = crypto.randomUUID()

    setToasts((prev) => [...prev, { id, type, message }])

    setTimeout(() => dismissToast(id), duration)
  }, [dismissToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
