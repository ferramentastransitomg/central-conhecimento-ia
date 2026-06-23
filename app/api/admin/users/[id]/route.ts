import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Não permitir que o usuário exclua a si mesmo
  if (session.user.id === params.id) {
    return NextResponse.json({ error: 'Você não pode excluir a sua própria conta' }, { status: 400 })
  }

  try {
    const supabase = createServerSupabaseClient()

    // Excluir usuário no Auth (o cascade no BD cuidará do perfil)
    const { error } = await supabase.auth.admin.deleteUser(params.id)

    if (error) {
      console.error('Erro ao excluir usuário:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
