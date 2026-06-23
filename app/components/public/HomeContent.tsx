'use client'

import { useState, useMemo } from 'react'
import { DocumentCard } from './DocumentCard'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { Search, BookOpen, Filter, X, Database, RefreshCcw } from 'lucide-react'
import type { KnowledgeItem, Category } from '@/lib/database.types'
import type { Settings } from '@/lib/database.types'

interface HomeContentProps {
  items: (KnowledgeItem & { categories?: Category | null })[]
  categories: Category[]
  settings: Settings | null
}

export function HomeContent({ items, categories, settings }: HomeContentProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const platformName = settings?.platform_name || 'Central de Conhecimento para IA'
  const description = settings?.description || 'Conteúdos confiáveis, organizados e acessíveis para pessoas e agentes de inteligência artificial.'

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.keywords || []).some((k) => k.toLowerCase().includes(search.toLowerCase()))
      const matchCategory =
        !selectedCategory || item.category_id === selectedCategory
      return matchSearch && matchCategory
    })
  }, [items, search, selectedCategory])

  const featured = items.slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-surface-900 text-white py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 75%, #818cf8 0%, transparent 50%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-800/60 border border-brand-600/40 text-brand-300 text-xs font-medium mb-6">
            <Database className="w-3 h-3" />
            {items.length} documentos disponíveis
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {platformName}
          </h1>
          <p className="text-lg text-brand-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Search — sem alterar URL */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar documentos, regulamentos, manuais..."
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-400 text-base"
              aria-label="Pesquisar conhecimentos"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label="Limpar pesquisa"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6 text-sm text-surface-500 overflow-x-auto">
          <span className="flex items-center gap-1.5 flex-shrink-0">
            <BookOpen className="w-4 h-4 text-brand-500" />
            <strong className="text-surface-700 dark:text-surface-200">{items.length}</strong> documentos publicados
          </span>
          <span className="flex items-center gap-1.5 flex-shrink-0">
            <Filter className="w-4 h-4 text-brand-500" />
            <strong className="text-surface-700 dark:text-surface-200">{categories.length}</strong> categorias
          </span>
          <span className="flex items-center gap-1.5 flex-shrink-0">
            <RefreshCcw className="w-4 h-4 text-emerald-500" />
            Atualizado regularmente
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Categories filter — sem criar URLs */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
              Filtrar por categoria
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {search || selectedCategory ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {filtered.length === 0
                  ? 'Nenhum resultado'
                  : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
              </h2>
              <button
                onClick={() => { setSearch(''); setSelectedCategory(null) }}
                className="btn-ghost text-sm"
              >
                <X className="w-4 h-4" /> Limpar filtros
              </button>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Nenhum resultado encontrado"
                description="Tente outros termos ou remova os filtros aplicados."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <DocumentCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-500 rounded-full inline-block" />
                  Documentos em destaque
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featured.map((item) => (
                    <DocumentCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* All documents */}
            {items.length > 4 && (
              <section>
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 bg-surface-300 dark:bg-surface-600 rounded-full inline-block" />
                  Todos os documentos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.slice(4).map((item) => (
                    <DocumentCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {items.length === 0 && (
              <EmptyState
                icon={BookOpen}
                title="Nenhum documento publicado"
                description="O administrador ainda não publicou nenhum conteúdo. Volte em breve."
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
