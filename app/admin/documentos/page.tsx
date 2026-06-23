import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { DocumentsTable } from '@/app/components/admin/DocumentsTable'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

export default async function DocumentosPage() {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  const supabase = createServerSupabaseClient()

  const [itemsRes, categoriesRes] = await Promise.all([
    supabase
      .from('knowledge_items')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('display_order'),
  ])

  const items = itemsRes.data || []
  const categories = categoriesRes.data || []

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Documentos</h1>
          <p className="text-surface-500 mt-1">{items.length} documentos no sistema</p>
        </div>
        <Link href="/admin/novo" className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo documento
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-surface-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Nenhum documento</h2>
          <p className="text-surface-500 mb-6">Adicione seu primeiro documento para começar.</p>
          <Link href="/admin/novo" className="btn-primary">
            <Plus className="w-4 h-4" /> Adicionar documento
          </Link>
        </div>
      ) : (
        <DocumentsTable items={items} categories={categories} />
      )}
    </div>
  )
}
