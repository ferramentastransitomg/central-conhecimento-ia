import type { ItemStatus, ReviewStatus } from '@/lib/database.types'

const statusConfig: Record<string, { label: string; className: string }> = {
  published: { label: 'Publicado', className: 'badge-published' },
  draft: { label: 'Rascunho', className: 'badge-draft' },
  pending_review: { label: 'Pendente', className: 'badge-pending' },
  archived: { label: 'Arquivado', className: 'badge-archived' },
  not_reviewed: { label: 'Não revisado', className: 'badge-draft' },
  reviewed: { label: 'Revisado', className: 'badge-published' },
  update_available: { label: 'Atualização disponível', className: 'badge-warning' },
  extraction_failed: { label: 'Falha na extração', className: 'badge-error' },
  ocr_required: { label: 'OCR necessário', className: 'badge-warning' },
}

const sourceTypeLabels: Record<string, string> = {
  url: '🌐 URL',
  pdf: '📄 PDF',
  docx: '📝 DOCX',
  txt: '📃 TXT',
  markdown: '📑 Markdown',
  html: '🌐 HTML',
  manual: '✍️ Manual',
}

export function StatusBadge({ status }: { status: ItemStatus | ReviewStatus | string }) {
  const config = statusConfig[status] || { label: status, className: 'badge-draft' }
  return <span className={config.className}>{config.label}</span>
}

export function SourceTypeBadge({ type }: { type: string }) {
  const label = sourceTypeLabels[type] || type
  return (
    <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400">
      {label}
    </span>
  )
}
