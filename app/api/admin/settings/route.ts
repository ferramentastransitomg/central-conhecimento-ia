import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createServerSupabaseClient()

  // Check if settings exist
  const { data } = await supabase.from('settings').select('id').limit(1).single()
  const existing = data as any

  let result
  if (existing) {
    result = await (supabase as any).from('settings').update(body).eq('id', existing.id).select().single()
  } else {
    result = await (supabase as any).from('settings').insert(body).select().single()
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ data: result.data })
}
