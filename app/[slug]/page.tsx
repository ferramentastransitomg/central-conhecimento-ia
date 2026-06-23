import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getPublicKnowledgeUrl, getCanonicalUrl } from '@/lib/urls'
import { PublicHeader } from '@/app/components/public/PublicHeader'
import { PublicFooter } from '@/app/components/public/PublicFooter'
import type { Metadata } from 'next'
import { Calendar, Building2, Tag, Link2, FileDown, History, AlertTriangle, Globe, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PageProps {
  params: { slug: string }
}

function safeFormatDate(dateStr: string | null | undefined, formatStr: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return format(d, formatStr, { locale: ptBR })
  } catch {
    return ''
  }
}

async function getItem(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .single()

  if (error || !data) return null
  return data as any
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getItem(params.slug)
  if (!item) return { title: 'Documento não encontrado' }

  const canonicalUrl = getCanonicalUrl(item.slug)

  return {
    title: item.title,
    description: item.description || item.summary || undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: item.title,
      description: item.description || item.summary || undefined,
      url: canonicalUrl,
      type: 'article',
      publishedTime: item.published_at || undefined,
      modifiedTime: item.updated_at,
    },
    robots: { index: true, follow: true },
  }
}

export async function generateStaticParams() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('knowledge_items')
    .select('slug')
    .eq('status', 'published')
    .eq('visibility', 'public')
  return (data as any || []).map((item: any) => ({ slug: item.slug }))
}

export default async function SlugPage({ params }: PageProps) {
  const item = await getItem(params.slug)

  if (!item) {
    notFound()
  }

  const canonicalUrl = getCanonicalUrl(item.slug)
  const publicUrl = getPublicKnowledgeUrl(item.slug)

  const sourceTypeLabels: Record<string, string> = {
    url: 'Importado de URL',
    pdf: 'Arquivo PDF',
    docx: 'Documento Word',
    txt: 'Arquivo de texto',
    markdown: 'Arquivo Markdown',
    html: 'Arquivo HTML',
    manual: 'Conteúdo manual',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.description || item.summary,
    url: canonicalUrl,
    datePublished: item.published_at,
    dateModified: item.updated_at,
    publisher: {
      '@type': 'Organization',
      name: item.organization || 'Central de Conhecimento para IA',
    },
    keywords: item.keywords?.join(', '),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = (item as any).categories

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <article>
          <header className="mb-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-surface-400">
                <li><a href="/" className="hover:text-brand-600">Início</a></li>
                <li>/</li>
                {category && <li><span className="text-surface-500">{category.name}</span></li>}
                {category && <li>/</li>}
                <li className="text-surface-600 dark:text-surface-300 truncate max-w-xs">{item.title}</li>
              </ol>
            </nav>

            {/* Category and source type badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400">
                  {category.icon} {category.name}
                </span>
              )}
              <span className="badge bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                {sourceTypeLabels[item.source_type] || item.source_type}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-3 leading-tight">
              {item.title}
            </h1>

            {item.subtitle && (
              <p className="text-xl text-surface-600 dark:text-surface-400 mb-4">{item.subtitle}</p>
            )}

            {item.description && (
              <p className="text-base text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                {item.description}
              </p>
            )}

            {/* Metadata grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
              {item.organization && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span className="text-surface-500">Órgão:</span>
                  <span className="text-surface-700 dark:text-surface-200 font-medium">{item.organization}</span>
                </div>
              )}
              {item.document_number && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span className="text-surface-500">Nº do documento:</span>
                  <span className="text-surface-700 dark:text-surface-200 font-medium">{item.document_number}</span>
                </div>
              )}
              {item.document_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span className="text-surface-500">Data do documento:</span>
                  <span className="text-surface-700 dark:text-surface-200">
                    {safeFormatDate(item.document_date, 'dd/MM/yyyy')}
                  </span>
                </div>
              )}
              {item.published_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-surface-400 flex-shrink-0" />
                  <span className="text-surface-500">Publicado em:</span>
                  <span className="text-surface-700 dark:text-surface-200">
                    {safeFormatDate(item.published_at, "dd 'de' MMMM 'de' yyyy")}
                  </span>
                </div>
              )}
              {item.last_checked_at && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-surface-500">Verificado em:</span>
                  <span className="text-surface-700 dark:text-surface-200">
                    {safeFormatDate(item.last_checked_at, "dd/MM/yyyy")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Link2 className="w-4 h-4 text-surface-400 flex-shrink-0" />
                <span className="text-surface-500">URL pública:</span>
                <code className="text-brand-600 dark:text-brand-400 font-mono text-xs">{publicUrl}</code>
              </div>
            </div>

            {/* Summary */}
            {item.summary && (
              <div className="mt-6 p-4 border-l-4 border-brand-400 bg-brand-50 dark:bg-brand-950/20 rounded-r-xl">
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-1">Resumo</p>
                <p className="text-surface-700 dark:text-surface-300 text-sm leading-relaxed">{item.summary}</p>
              </div>
            )}
          </header>

          {/* Main Content */}
          <section aria-label="Conteúdo do documento">
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: item.content_html }}
            />
          </section>

          {/* Keywords */}
          {item.keywords && item.keywords.length > 0 && (
            <section className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700" aria-label="Palavras-chave">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3">Palavras-chave</h2>
              <div className="flex flex-wrap gap-2">
                {((item.keywords || []) as string[]).map((kw, i) => (
                  <span key={i} className="badge bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                    {kw}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Source reference */}
          {item.source_url && (
            <section className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700" aria-label="Fonte original">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Fonte original
              </h2>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline text-sm break-all"
              >
                {item.source_url}
              </a>
            </section>
          )}

          {/* File download */}
          {item.storage_path && (
            <section className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700" aria-label="Arquivo original">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileDown className="w-4 h-4" /> Arquivo original
              </h2>
              <p className="text-sm text-surface-500">
                {item.original_filename}
              </p>
            </section>
          )}

          {/* Legal disclaimer */}
          <footer className="mt-10 pt-6 border-t border-surface-200 dark:border-surface-700">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Aviso Legal</p>
                  <p className="text-sm text-amber-700 dark:text-amber-500">
                    Este conteúdo é uma reprodução organizada para consulta. Em caso de divergência, prevalece a publicação disponibilizada pela fonte oficial.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-surface-400 mt-4 text-center">
              Última atualização: {safeFormatDate(item.updated_at, "dd/MM/yyyy 'às' HH:mm")}
            </p>
          </footer>
        </article>
      </main>

      <PublicFooter />
    </div>
  )
}
