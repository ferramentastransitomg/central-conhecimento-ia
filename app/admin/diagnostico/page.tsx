import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getPublicKnowledgeUrl, getCanonicalUrl, isValidPublicKnowledgeUrl } from '@/lib/urls'
import { validateSlug, SLUG_REGEX } from '@/lib/slug'
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'

type DiagnosticStatus = 'approved' | 'warning' | 'failed'

interface DiagnosticResult {
  label: string
  status: DiagnosticStatus
  value: string
  detail?: string
}

function runDiagnostics(item: {
  slug: string
  status: string
  visibility: string
  title: string
  description: string | null
  content_html: string
}): DiagnosticResult[] {
  const url = getPublicKnowledgeUrl(item.slug)
  const canonicalUrl = getCanonicalUrl(item.slug)
  const segments = url.split('/').filter(Boolean)
  const hasQueryString = url.includes('?') || url.includes('&')
  const hasFragment = url.includes('#')
  const isValidSlug = SLUG_REGEX.test(item.slug)
  const isPublished = item.status === 'published'
  const isPublic = item.visibility === 'public'
  const hasTitle = !!item.title && item.title.length > 3
  const hasDescription = !!item.description && item.description.length > 10
  const hasContent = item.content_html && item.content_html.length > 50

  return [
    {
      label: 'Status de publicação',
      status: isPublished ? 'approved' : 'failed',
      value: isPublished ? 'Publicado' : item.status,
      detail: isPublished ? undefined : 'O documento precisa estar publicado para ser indexado',
    },
    {
      label: 'Visibilidade',
      status: isPublic ? 'approved' : 'warning',
      value: isPublic ? 'Público' : 'Privado',
      detail: isPublic ? undefined : 'Documentos privados não são acessíveis sem autenticação',
    },
    {
      label: 'Formato do slug',
      status: isValidSlug ? 'approved' : 'failed',
      value: item.slug,
      detail: isValidSlug ? undefined : 'O slug deve conter apenas letras minúsculas, números e hífens',
    },
    {
      label: 'Número de segmentos na URL',
      status: segments.length === 1 ? 'approved' : 'failed',
      value: `${segments.length} segmento${segments.length !== 1 ? 's' : ''}`,
      detail: segments.length === 1 ? undefined : 'A URL deve ter exatamente 1 segmento: /{slug}',
    },
    {
      label: 'Sem parâmetros de consulta',
      status: !hasQueryString ? 'approved' : 'failed',
      value: hasQueryString ? 'Possui query strings' : 'Nenhum parâmetro',
      detail: hasQueryString ? 'Query strings como ?id= ou ?versao= não são permitidas na URL pública' : undefined,
    },
    {
      label: 'Sem fragmentos na URL',
      status: !hasFragment ? 'approved' : 'failed',
      value: hasFragment ? 'Possui fragmento (#)' : 'Sem fragmentos',
    },
    {
      label: 'URL canonica',
      status: 'approved',
      value: canonicalUrl,
      detail: 'A URL canonica aponta corretamente para a URL plana',
    },
    {
      label: 'Título presente',
      status: hasTitle ? 'approved' : 'failed',
      value: hasTitle ? item.title.slice(0, 60) : 'Sem título',
    },
    {
      label: 'Descrição presente',
      status: hasDescription ? 'approved' : 'warning',
      value: hasDescription ? 'Sim' : 'Sem descrição',
      detail: hasDescription ? undefined : 'Adicionar uma descrição melhora a indexação',
    },
    {
      label: 'Conteúdo no HTML',
      status: hasContent ? 'approved' : 'failed',
      value: hasContent ? `${item.content_html.length} caracteres` : 'Conteúdo vazio',
    },
    {
      label: 'Compatibilidade com fontes de IA',
      status: (isPublished && isPublic && segments.length === 1 && !hasQueryString && !hasFragment && isValidSlug && hasTitle && hasContent) ? 'approved' : 'failed',
      value: (isPublished && isPublic && segments.length === 1 && !hasQueryString && isValidSlug) ? '✅ URL compatível' : '❌ URL não compatível',
      detail: 'Uma URL é compatível quando: publicada, pública, com 1 segmento, sem parâmetros e slug válido',
    },
  ]
}

export default async function DiagnosticoPage() {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('knowledge_items')
    .select('id, title, slug, status, visibility, description, content_html')
    .order('created_at', { ascending: false })
    .limit(50)
  const items = (data as any) || []

  const statusIcon = {
    approved: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
  }

  const statusClass = {
    approved: 'text-emerald-700 dark:text-emerald-400',
    warning: 'text-amber-700 dark:text-amber-400',
    failed: 'text-red-700 dark:text-red-400',
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Diagnóstico para IA</h1>
        <p className="text-surface-500 mt-1">
          Verifica se os documentos estão compatíveis para uso como fontes de agentes de IA.
        </p>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Regra de ouro:</strong> Uma URL é compatível com fontes de IA quando segue o padrão <code>https://dominio.com/{'{slug}'}</code> — exatamente 1 segmento, sem parâmetros, sem fragmentos, slug válido, publicado e público.
        </p>
      </div>

      <div className="space-y-4">
        {(items || []).map((item: any) => {
          const diagnostics = runDiagnostics(item)
          const allApproved = diagnostics.every((d) => d.status === 'approved')
          const hasFailed = diagnostics.some((d) => d.status === 'failed')
          const overallStatus: DiagnosticStatus = allApproved ? 'approved' : hasFailed ? 'failed' : 'warning'

          return (
            <details key={item.id} className="card overflow-hidden">
              <summary className="p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                {statusIcon[overallStatus]}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-800 dark:text-surface-200 truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-xs text-brand-500 font-mono">{getPublicKnowledgeUrl(item.slug)}</code>
                  </div>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${
                  overallStatus === 'approved' ? 'badge-approved' :
                  overallStatus === 'warning' ? 'badge-warning' : 'badge-error'
                }`}>
                  {overallStatus === 'approved' ? 'Aprovado' : overallStatus === 'warning' ? 'Atenção' : 'Reprovado'}
                </span>
                {item.status === 'published' && (
                  <a
                    href={getPublicKnowledgeUrl(item.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </summary>
              <div className="border-t border-surface-200 dark:border-surface-700">
                <table className="w-full text-sm">
                  <thead className="bg-surface-50 dark:bg-surface-800">
                    <tr>
                      <th className="text-left p-3 font-medium text-surface-500">Verificação</th>
                      <th className="text-left p-3 font-medium text-surface-500">Resultado</th>
                      <th className="text-left p-3 font-medium text-surface-500 hidden md:table-cell">Detalhe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                    {diagnostics.map((d) => (
                      <tr key={d.label} className="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {statusIcon[d.status]}
                            <span className="font-medium text-surface-700 dark:text-surface-200">{d.label}</span>
                          </div>
                        </td>
                        <td className={`p-3 font-mono text-xs ${statusClass[d.status]}`}>{d.value}</td>
                        <td className="p-3 text-surface-400 text-xs hidden md:table-cell">{d.detail || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )
        })}

        {(!items || items.length === 0) && (
          <div className="card p-12 text-center text-surface-400">
            <p>Nenhum documento encontrado para diagnóstico.</p>
          </div>
        )}
      </div>
    </div>
  )
}
