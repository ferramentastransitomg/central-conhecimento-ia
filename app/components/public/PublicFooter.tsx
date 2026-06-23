import Link from 'next/link'
import { createSSRServerClient } from '@/lib/supabase-server'
import { BookOpen, ExternalLink } from 'lucide-react'

export async function PublicFooter() {
  let settings = {
    platform_name: 'Central de Conhecimento para IA',
    organization: 'Organização',
    legal_disclaimer: 'Este conteúdo é uma reprodução organizada para consulta.',
  }

  try {
    const supabase = createSSRServerClient()
    const { data } = (await supabase
      .from('settings')
      .select('platform_name, organization, legal_disclaimer')
      .limit(1)
      .single()) as any
    if (data) settings = { ...settings, ...data }
  } catch {}

  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface-100 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm text-surface-800 dark:text-surface-200">
                {settings.platform_name}
              </span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed max-w-md">
              {settings.legal_disclaimer}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-3">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 transition-colors">
                  Página inicial
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 transition-colors flex items-center gap-1">
                  Sitemap <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 transition-colors flex items-center gap-1">
                  llms.txt <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-surface-400">
            © {year} {settings.organization}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-surface-400">
            Conteúdo indexável por agentes de IA
          </p>
        </div>
      </div>
    </footer>
  )
}
