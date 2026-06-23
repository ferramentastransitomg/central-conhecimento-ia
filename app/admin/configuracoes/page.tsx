import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { SettingsForm } from '@/app/components/admin/SettingsForm'

export default async function ConfiguracoesPage() {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  const supabase = createServerSupabaseClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-surface-500 mt-1">Configurações gerais da plataforma</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
