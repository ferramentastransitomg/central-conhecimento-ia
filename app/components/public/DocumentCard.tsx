import Link from 'next/link'
import { getPublicKnowledgeUrl } from '@/lib/urls'
import { StatusBadge, SourceTypeBadge } from '@/app/components/ui/StatusBadge'
import type { KnowledgeItem, Category } from '@/lib/database.types'
import { Calendar, Building2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DocumentCardProps {
  item: KnowledgeItem & { categories?: Category | null }
}

export function DocumentCard({ item }: DocumentCardProps) {
  const href = getPublicKnowledgeUrl(item.slug)
  const updatedAt = new Date(item.updated_at)

  return (
    <Link
      href={href}
      className="card block p-5 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <SourceTypeBadge type={item.source_type} />
          {item.categories && (
            <span className="badge bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300">
              {item.categories.name}
            </span>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors flex-shrink-0 mt-0.5" />
      </div>

      <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
        {item.title}
      </h3>

      {item.description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-3">
          {item.description}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-surface-400 flex-wrap">
        {item.organization && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {item.organization}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Atualizado {formatDistanceToNow(updatedAt, { locale: ptBR, addSuffix: true })}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-800">
        <code className="text-xs text-brand-500 dark:text-brand-400 font-mono">{href}</code>
      </div>
    </Link>
  )
}
