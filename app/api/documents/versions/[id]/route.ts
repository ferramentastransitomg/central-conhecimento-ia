import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'
import { hashContent } from '@/lib/hash'

export const runtime = 'nodejs'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('knowledge_versions')
    .select('*')
    .eq('item_id', params.id)
    .order('version_number', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Restore a specific version
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { versionId, changeReason } = body

  const supabase = createServerSupabaseClient()

  // Get the version to restore
  const { data: version, error: vErr } = (await supabase
    .from('knowledge_versions')
    .select('*')
    .eq('id', versionId)
    .eq('item_id', params.id)
    .single()) as any

  if (vErr || !version) return NextResponse.json({ error: 'Versão não encontrada' }, { status: 404 })

  // Get current version number
  const { data: latest } = (await supabase
    .from('knowledge_versions')
    .select('version_number')
    .eq('item_id', params.id)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()) as any

  const nextVersion = (latest?.version_number || 0) + 1

  // Create new version entry for the restore
  await (supabase.from('knowledge_versions') as any).insert({
    item_id: params.id,
    version_number: nextVersion,
    raw_text: version.raw_text,
    content_html: version.content_html,
    content_markdown: version.content_markdown,
    content_hash: version.content_hash,
    created_by: session.user.id,
    change_reason: changeReason || `Restaurado para versão ${version.version_number}`,
    update_source: 'manual',
  })

  // Update the main item
  const { data: updated, error: upErr } = (await (supabase.from('knowledge_items') as any)
    .update({
      raw_text: version.raw_text,
      content_html: version.content_html,
      content_markdown: version.content_markdown,
      content_hash: version.content_hash,
      review_status: 'reviewed',
    })
    .eq('id', params.id)
    .select()
    .single()) as any

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
  return NextResponse.json({ success: true, data: updated })
}
