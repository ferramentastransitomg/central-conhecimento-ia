'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/app/components/ui/Toast'
import { ConfirmModal } from '@/app/components/ui/ConfirmModal'
import type { Category } from '@/lib/database.types'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { generateSlug } from '@/lib/slug'

interface CategoriesManagerProps {
  initialCategories: Category[]
}

const ICON_OPTIONS = ['📄', '⚖️', '🔒', '📋', '⚙️', '💻', '🏥', '📚', '🤝', '🏛️', '📊', '🔬']

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', icon: '📄', display_order: 0 })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const slug = generateSlug(form.name)
      const body = { ...form, slug }

      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast('success', editingId ? 'Categoria atualizada' : 'Categoria criada')
        setForm({ name: '', description: '', icon: '📄', display_order: 0 })
        setEditingId(null)
        setShowForm(false)
        router.refresh()
      } else {
        const data = await res.json()
        toast('error', data.error || 'Erro ao salvar categoria')
      }
    } catch {
      toast('error', 'Erro ao salvar categoria')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast('success', 'Categoria excluída')
        router.refresh()
      } else {
        toast('error', 'Erro ao excluir')
      }
    } catch {
      toast('error', 'Erro ao excluir')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Nova categoria
        </button>
      </div>

      {showForm && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold">{editingId ? 'Editar' : 'Nova'} categoria</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Nome *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Nome da categoria"
              />
            </div>
            <div>
              <label className="input-label">Ordem</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="input-label">Descrição</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field"
              placeholder="Descrição opcional"
            />
          </div>
          <div>
            <label className="input-label">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all ${
                    form.icon === icon
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Check className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-secondary">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th className="text-left p-4 font-semibold">Categoria</th>
              <th className="text-left p-4 font-semibold hidden md:table-cell">Slug</th>
              <th className="text-left p-4 font-semibold hidden md:table-cell">Status</th>
              <th className="text-right p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      {cat.description && <p className="text-xs text-surface-500">{cat.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <code className="text-xs text-brand-500">{cat.slug}</code>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`badge ${
                    cat.status === 'active' ? 'badge-published' : 'badge-archived'
                  }`}>
                    {cat.status === 'active' ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '📄', display_order: cat.display_order })
                        setEditingId(cat.id)
                        setShowForm(true)
                      }}
                      className="btn-ghost p-1.5"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="btn-ghost p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir categoria"
        message="Os documentos associados perderão a categoria. Deseja continuar?"
        confirmLabel="Excluir"
        loading={deleting}
      />
    </div>
  )
}
