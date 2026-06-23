'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { validateSlug, SLUG_REGEX } from '@/lib/slug'

interface SlugInputProps {
  value: string
  onChange: (value: string) => void
  existingSlugs?: string[]
  currentId?: string
  appUrl?: string
}

export function SlugInput({ value, onChange, existingSlugs = [], appUrl = '' }: SlugInputProps) {
  const [checking, setChecking] = useState(false)
  const [uniqueOk, setUniqueOk] = useState<boolean | null>(null)

  const validation = validateSlug(value)
  const formatValid = validation.valid
  const isAiCompatible = formatValid && SLUG_REGEX.test(value)

  useEffect(() => {
    if (!formatValid || !value) {
      setUniqueOk(null)
      return
    }
    setChecking(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/documents/check-slug?slug=${encodeURIComponent(value)}`)
        const data = await res.json()
        setUniqueOk(data.available)
      } catch {
        setUniqueOk(null)
      } finally {
        setChecking(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [value, formatValid])

  const publicUrl = value ? `${appUrl}/${value}` : ''

  const getStatusIcon = () => {
    if (!value) return null
    if (!formatValid) return <XCircle className="w-4 h-4 text-red-500" />
    if (checking) return <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    if (uniqueOk === false) return <XCircle className="w-4 h-4 text-red-500" />
    if (uniqueOk === true) return <CheckCircle className="w-4 h-4 text-emerald-500" />
    return <AlertCircle className="w-4 h-4 text-amber-500" />
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id="slug-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-/, ''))}
          placeholder="meu-documento"
          className={`input-field pr-10 font-mono text-sm ${
            !formatValid && value ? 'border-red-400 focus:ring-red-400' : ''
          }`}
          aria-describedby="slug-status slug-hint"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>

      {publicUrl && (
        <div className="px-3 py-2 bg-surface-50 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700">
          <p className="text-xs text-surface-500 mb-0.5">URL pública que será gerada:</p>
          <code className="text-sm font-mono text-brand-600 dark:text-brand-400 break-all">{publicUrl}</code>
        </div>
      )}

      {!formatValid && value && (
        <p id="slug-status" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {validation.error}
        </p>
      )}

      {formatValid && uniqueOk === false && (
        <p id="slug-status" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Este slug já está em uso. Escolha outro.
        </p>
      )}

      {isAiCompatible && uniqueOk === true && (
        <p id="slug-status" className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> ✅ URL compatível com fontes que exigem URL curta e sem parâmetros
        </p>
      )}

      <div className="flex items-start gap-3">
        <div className={`flex items-center gap-1.5 text-xs ${ formatValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400' }`}>
          {formatValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          Formato válido
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${ isAiCompatible ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400' }`}>
          {isAiCompatible ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          1 segmento (/{'{slug}'})
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${ !value.includes('?') && !value.includes('#') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600' }`}>
          <CheckCircle className="w-3 h-3" />
          Sem parâmetros
        </div>
      </div>
    </div>
  )
}
