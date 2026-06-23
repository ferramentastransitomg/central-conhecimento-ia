'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
}

let toastListeners: ((toasts: ToastMessage[]) => void)[] = []
let toasts: ToastMessage[] = []

export function toast(type: ToastType, title: string, message?: string) {
  const id = Math.random().toString(36).slice(2)
  const newToast: ToastMessage = { id, type, title, message }
  toasts = [...toasts, newToast]
  toastListeners.forEach((l) => l([...toasts]))
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    toastListeners.forEach((l) => l([...toasts]))
  }, 5000)
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastMessage[]>([])

  useEffect(() => {
    toastListeners.push(setItems)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setItems)
    }
  }, [])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const colors = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    warning: 'border-l-amber-500',
    info: 'border-l-blue-500',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full" aria-live="polite">
      {items.map((item) => (
        <div
          key={item.id}
          className={`card border-l-4 ${colors[item.type]} p-4 animate-slide-up`}
        >
          <div className="flex items-start gap-3">
            {icons[item.type]}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-surface-900 dark:text-surface-100">
                {item.title}
              </p>
              {item.message && (
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">
                  {item.message}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                toasts = toasts.filter((t) => t.id !== item.id)
                toastListeners.forEach((l) => l([...toasts]))
              }}
              className="btn-ghost p-1 -mr-1 -mt-1"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
