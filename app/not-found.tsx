import Link from 'next/link'
import { PublicHeader } from '@/app/components/public/PublicHeader'
import { PublicFooter } from '@/app/components/public/PublicFooter'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-12 h-12 text-surface-400" />
          </div>
          <h1 className="text-6xl font-black text-surface-200 dark:text-surface-700 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-200 mb-3">
            Página não encontrada
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            O documento que você procura não existe, foi movido ou ainda não foi publicado.
          </p>
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Voltar à página inicial
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
