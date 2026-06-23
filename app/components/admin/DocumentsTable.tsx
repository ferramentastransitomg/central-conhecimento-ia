'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPublicKnowledgeUrl } from '@/lib/urls'
import { StatusBadge, SourceTypeBadge } from '@/app/components/ui/StatusBadge'
import { ConfirmModal } from '@/app/components/ui/ConfirmModal'
import { toast } from '@/app/components/ui/Toast'
import type { KnowledgeItem, Category } from '@/lib/database.types'
import {
  Eye, Edit, Trash2, RefreshCcw, Globe, ExternalLink,
  Archive, CheckCircle, XCircle, Search, Filter
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DocumentsTableProps {
  items: (KnowledgeItem & { categories?: Category | null })[]
  categories: Category[]
}

export function DocumentsTable({ items, categories }: DocumentsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = items.filter((item) => {
    const matchSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || item.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/documents/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast('success', 'Documento excluído com sucesso')
        router.refresh()
      } else {
        toast('error', 'Erro ao excluir documento')
      }
    } catch {
      toast('error', 'Erro ao excluir documento')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast('success', `Status alterado para: ${status}`)
        router.refresh()
      } else {
        toast('error', 'Erro ao alterar status')
      }
    } catch {
      toast('error', 'Erro ao alterar status')
    }
  }

  const handleCheck = async (id: string) => {
    toast('info', 'Verificando fonte...', 'Aguarde enquanto acessamos a URL original')
    try {
      const res = await fetch(`/api/check/${id}`, { method: 'POST' })
      const data = await res.json()
      if (data.data?.hasChanged) {
        toast('warning', 'Atualização encontrada!', 'A fonte foi alterada. Acesse o editor para revisar.')
      } else if (data.data?.errorMessage) {
        toast('error', 'Erro ao verificar', data.data.errorMessage)
      } else {
        toast('success', 'Sem alterações', 'O conteúdo está atualizado')
      }
      router.refresh()
    } catch {
      toast('error', 'Falha na verificação')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar documentos..."
            className="input-field pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="">Todos os status</option>
          <option value="published">Publicado</option>
          <option value="draft">Rascunho</option>
          <option value="pending_review">Pendente</option>
          <option value="archived">Arquivado</option>
        </select>
        <div className="text-sm text-surface-500 flex items-center gap-1 flex-shrink-0">
          <Filter className="w-4 h-4" />
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="text-left p-4 font-semibold text-surface-600 dark:text-surface-300">Documento</th>
                <th className="text-left p-4 font-semibold text-surface-600 dark:text-surface-300 hidden md:table-cell">Tipo</th>
                <th className="text-left p-4 font-semibold text-surface-600 dark:text-surface-300">Status</th>
                <th className="text-left p-4 font-semibold text-surface-600 dark:text-surface-300 hidden lg:table-cell">Atualização</th>
                <th className="text-right p-4 font-semibold text-surface-600 dark:text-surface-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-surface-800 dark:text-surface-200 truncate max-w-xs">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-xs text-brand-500 font-mono">{getPublicKnowledgeUrl(item.slug)}</code>
                        {item.status === 'published' && (
                          <a
                            href={getPublicKnowledgeUrl(item.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-surface-400 hover:text-brand-500"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <SourceTypeBadge type={item.source_type} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={item.status} />
                      {item.review_status !== 'not_reviewed' && (
                        <StatusBadge status={item.review_status} />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-surface-500 text-xs hidden lg:table-cell">
                    {formatDistanceToNow(new Date(item.updated_at), { locale: ptBR, addSuffix: true })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/editar/${item.id}`}
                        className="btn-ghost p-1.5"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      {item.status !== 'published' ? (
                        <button
                          onClick={() => handleStatusChange(item.id, 'published')}
                          className="btn-ghost p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          title="Publicar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(item.id, 'draft')}
                          className="btn-ghost p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          title="Despublicar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {item.source_type === 'url' && item.source_url && (
                        <button
                          onClick={() => handleCheck(item.id)}
                          className="btn-ghost p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          title="Verificar fonte"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="btn-ghost p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-surface-400">
              <p>Nenhum documento encontrado</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir documento"
        message="Tem certeza? Esta ação é permanente e não pode ser desfeita. O histórico de versões também será removido."
        confirmLabel="Sim, excluir"
        loading={deleting}
      />
    </div>
  )
}
