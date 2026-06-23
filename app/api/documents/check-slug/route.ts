import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { validateSlug } from '@/lib/slug'
import { requireAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })
  }

  const excludeId = searchParams.get('excludeId')

  // Validar formato do slug
  const validation = validateSlug(slug)
  if (!validation.valid) {
    return NextResponse.json({ available: false, reason: validation.error })
  }

  const supabase = createServerSupabaseClient()

  // Verificar slugs reservados das configurações
  const { data: settingsData } = await supabase
    .from('settings')
    .select('reserved_slugs')
    .limit(1)
    .single()
  const settings = settingsData as any

  if (settings?.reserved_slugs?.includes(slug)) {
    return NextResponse.json({ available: false, reason: 'Slug reservado' })
  }

  let query = supabase.from('knowledge_items').select('id').eq('slug', slug)
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query.limit(1).single()
  const item = data as any

  return NextResponse.json({ available: !item })
}
