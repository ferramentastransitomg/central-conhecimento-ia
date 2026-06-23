import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { CategoriesManager } from '@/app/components/admin/CategoriesManager'

export default async function CategoriasPage() {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  const supabase = createServerSupabaseClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-surface-500 mt-1">
          Categorias são filtros e metadados. Não criam níveis adicionais na URL pública.
        </p>
      </div>
      <CategoriesManager initialCategories={categories || []} />
    </div>
  )
}
