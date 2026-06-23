import Link from 'next/link'
import { createSSRServerClient } from '@/lib/supabase-server'
import { ThemeToggle } from '@/app/components/ui/ThemeToggle'
import { BookOpen, LogIn } from 'lucide-react'

export async function PublicHeader() {
  let platformName = 'Central de Conhecimento para IA'

  try {
    const supabase = createSSRServerClient()
    const { data } = (await supabase.from('settings').select('platform_name').limit(1).single()) as any
    if (data?.platform_name) platformName = data.platform_name
  } catch {}

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-surface-900 dark:text-surface-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block text-sm font-semibold leading-tight max-w-[200px]">
            {platformName}
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 border border-surface-200 dark:border-surface-800 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all"
            title="Painel de Controle"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Painel</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

