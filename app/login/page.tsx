import { Suspense } from 'react'
import { LoginForm } from '@/app/components/admin/LoginForm'
import { BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Central de Conhecimento para IA',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-surface-900 to-surface-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Central de Conhecimento</h1>
          <p className="text-brand-300 mt-1 text-sm">Acesso administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-8 border border-surface-200/20">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-6 text-center">
            Entrar no painel
          </h2>
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-surface-400">Carregando...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-surface-500 text-xs mt-6">
          Acesso restrito a administradores autorizados
        </p>
      </div>
    </div>
  )
}
