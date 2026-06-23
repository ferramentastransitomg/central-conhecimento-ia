import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import { UserManagement } from '@/app/components/admin/UserManagement'

export default async function UsuariosPage() {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Membros e Acessos</h1>
        <p className="text-surface-500 mt-1">
          Gerencie quem pode acessar o painel administrativo e incluir/editar conteúdos
        </p>
      </div>

      <UserManagement currentUserEmail={session?.user?.email || ''} />
    </div>
  )
}
