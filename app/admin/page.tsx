import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import {
  BookOpen, FileText, Clock, AlertCircle,
  CheckCircle, XCircle, Eye, Plus, BarChart3,
  RefreshCcw, FileSearch, Scan
} from 'lucide-react'

export default async function AdminDashboard() {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  const supabase = createServerSupabaseClient()

  const { data: stats } = await supabase
    .from('knowledge_items')
    .select('status, review_status')

  const items = (stats as any) || []
  const total = items.length
  const published = items.filter((i: any) => i.status === 'published').length
  const drafts = items.filter((i: any) => i.status === 'draft').length
  const pending = items.filter((i: any) => i.status === 'pending_review').length
  const updateAvailable = items.filter((i: any) => i.review_status === 'update_available').length
  const extractionFailed = items.filter((i: any) => i.review_status === 'extraction_failed').length
  const ocrRequired = items.filter((i: any) => i.review_status === 'ocr_required').length
  const archived = items.filter((i: any) => i.status === 'archived').length

  const statCards = [
    { label: 'Total de documentos', value: total, icon: BookOpen, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-950/30' },
    { label: 'Publicados', value: published, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Rascunhos', value: drafts, icon: FileText, color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-800' },
    { label: 'Pendentes de revisão', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Atualizações disponíveis', value: updateAvailable, icon: RefreshCcw, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Falhas de importação', value: extractionFailed, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
    { label: 'PDFs (OCR necessário)', value: ocrRequired, icon: Scan, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { label: 'Arquivados', value: archived, icon: FileSearch, color: 'text-surface-400', bg: 'bg-surface-100 dark:bg-surface-800' },
  ]

  // Últimos documentos
  const { data } = await supabase
    .from('knowledge_items')
    .select('id, title, slug, status, review_status, created_at, source_type')
    .order('created_at', { ascending: false })
    .limit(5)

  const recentItems = (data as any) || []

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Painel de Controle
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Visão geral da base de conhecimento
          </p>
        </div>
        <Link href="/admin/novo" className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo documento
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-0.5">
              {card.value}
            </div>
            <div className="text-sm text-surface-500 dark:text-surface-400">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/novo"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950/40 flex items-center justify-center group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
            <Plus className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="font-semibold text-surface-800 dark:text-surface-200">Adicionar documento</div>
            <div className="text-xs text-surface-500">URL, PDF, arquivo ou manual</div>
          </div>
        </Link>

        <Link
          href="/admin/documentos"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-surface-800 dark:text-surface-200">Gerenciar documentos</div>
            <div className="text-xs text-surface-500">Lista completa com ações</div>
          </div>
        </Link>

        <Link
          href="/admin/diagnostico"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-surface-800 dark:text-surface-200">Diagnóstico para IA</div>
            <div className="text-xs text-surface-500">Verificar URLs e compatibilidade</div>
          </div>
        </Link>
      </div>

      {/* Recent documents */}
      {recentItems && recentItems.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h2 className="font-bold text-surface-900 dark:text-surface-100">Documentos recentes</h2>
            <Link href="/admin/documentos" className="text-sm text-brand-600 hover:text-brand-700">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {recentItems.map((item: any) => (
              <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-800 dark:text-surface-200 truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-brand-500 font-mono">/{item.slug}</code>
                    <span className="text-xs text-surface-400">•</span>
                    <span className={`text-xs font-medium ${
                      item.status === 'published' ? 'text-emerald-600' :
                      item.status === 'draft' ? 'text-surface-500' :
                      'text-amber-600'
                    }`}>
                      {item.status === 'published' ? 'Publicado' :
                       item.status === 'draft' ? 'Rascunho' :
                       item.status === 'pending_review' ? 'Pendente' : 'Arquivado'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/editar/${item.id}`}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
