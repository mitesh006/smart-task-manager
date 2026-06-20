import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const colors = {
  success: {
    bg: 'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.2)',
    icon: 'var(--color-emerald)',
    text: 'var(--color-emerald)',
  },
  error: {
    bg: 'rgba(244, 63, 94, 0.08)',
    border: 'rgba(244, 63, 94, 0.2)',
    icon: 'var(--color-rose)',
    text: 'var(--color-rose)',
  },
  info: {
    bg: 'rgba(201, 165, 92, 0.08)',
    border: 'rgba(201, 165, 92, 0.15)',
    icon: 'var(--color-gold)',
    text: 'var(--color-gold)',
  },
}

function Toast({ toast, onDismiss }) {
  const config = colors[toast.type] || colors.info
  const Icon = icons[toast.type] || Info

  return (
    <div
      className="toast-item"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <Icon size={16} style={{ color: config.icon, flexShrink: 0 }} />
      <p style={{ color: config.text }} className="text-sm font-light flex-1">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-mist-600 hover:text-mist-300 transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    // Start exit animation
    const el = document.querySelector(`[data-toast-id="${id}"]`)
    if (el) {
      el.classList.add('toast-exit')
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    } else {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = ++toastId
      setToasts((prev) => [...prev, { id, message, type }])
      timers.current[id] = setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  const toast = useMemo(
    () => ({
      success: (msg, dur) => addToast(msg, 'success', dur),
      error: (msg, dur) => addToast(msg, 'error', dur),
      info: (msg, dur) => addToast(msg, 'info', dur),
    }),
    [addToast]
  )

  // Wrap toast methods in a stable ref-like pattern
  const toastRef = useRef(toast)
  toastRef.current = toast

  return (
    <ToastContext.Provider value={toastRef.current}>
      {children}
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} data-toast-id={t.id} className="toast-enter">
            <Toast toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
