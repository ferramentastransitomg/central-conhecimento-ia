import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'
import { validateSlug } from '@/lib/slug'
import { hashContent } from '@/lib/hash'

export const runtime = 'nodejs'

const UpdateDocumentSchema = z.object({
  title: z.string().min(3).max(500).optional(),
  subtitle: z.string().max(500).optional().nullable(),
  slug: z.string().min(1).optional(),
  description: z.string().max(1000).optional().nullable(),
  summary: z.string().max(5000).optional().nullable(),
  rawText: z.string().optional(),
  contentHtml: z.string().optional(),
  contentMarkdown: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  organization: z.string().max(500).optional().nullable(),
  documentNumber: z.string().max(200).optional().nullable(),
  documentDate: z.string().optional().nullable(),
  status: z.enum(['draft', 'pending_review', 'published', 'archived']).optional(),
  visibility: z.enum(['public', 'private']).optional(),
  reviewStatus: z.enum(['not_reviewed', 'reviewed', 'update_available', 'extraction_failed', 'ocr_required']).optional(),
  changeReason: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = (await supabase
    .from('knowledge_items')
    .select('*, categories(*)')
    .eq('id', params.id)
    .single()) as any

  if (error || !data) {
    return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = UpdateDocumentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const data = parsed.data
  const supabase = createServerSupabaseClient()

  // Buscar documento atual
  const { data: currentData, error: fetchError } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('id', params.id)
    .single()
  const current = currentData as any

  if (fetchError || !current) {
    return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
  }

  // Validar slug se mudou
  if (data.slug && data.slug !== current.slug) {
    const { data: settingsData } = (await supabase
      .from('settings')
      .select('reserved_slugs')
      .limit(1)
      .single()) as any
    const settings = settingsData as any

    const slugValidation = validateSlug(data.slug, settings?.reserved_slugs || [])
    if (!slugValidation.valid) {
      return NextResponse.json({ error: slugValidation.error }, { status: 400 })
    }

    const { data: existingData } = (await supabase
      .from('knowledge_items')
      .select('id')
      .eq('slug', data.slug)
      .neq('id', params.id)
      .limit(1)
      .single()) as any
    const existing = existingData as any

    if (existing) {
      return NextResponse.json({ error: 'Este slug já está em uso' }, { status: 409 })
    }
  }

  // Calcular hash se conteúdo mudou
  const newRawText = data.rawText || current.raw_text
  const contentChanged = data.rawText && data.rawText !== current.raw_text
  const newHash = contentChanged ? hashContent(newRawText) : current.content_hash

  // Criar nova versão se conteúdo mudou
  if (contentChanged) {
    const { data: latestVersionData } = (await supabase
      .from('knowledge_versions')
      .select('version_number')
      .eq('item_id', params.id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()) as any
    const latestVersion = latestVersionData as any

    const nextVersion = (latestVersion?.version_number || 0) + 1

    await (supabase as any).from('knowledge_versions').insert({
      item_id: params.id,
      version_number: nextVersion,
      raw_text: newRawText,
      content_html: data.contentHtml || current.content_html,
      content_markdown: data.contentMarkdown || current.content_markdown,
      content_hash: newHash,
      created_by: session.user.id,
      change_reason: data.changeReason || null,
      update_source: 'manual',
    })
  }

  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle
  if (data.slug !== undefined) updateData.slug = data.slug
  if (data.description !== undefined) updateData.description = data.description
  if (data.summary !== undefined) updateData.summary = data.summary
  if (data.rawText !== undefined) updateData.raw_text = data.rawText
  if (data.contentHtml !== undefined) updateData.content_html = data.contentHtml
  if (data.contentMarkdown !== undefined) updateData.content_markdown = data.contentMarkdown
  if (data.keywords !== undefined) updateData.keywords = data.keywords
  if (data.categoryId !== undefined) updateData.category_id = data.categoryId
  if (data.organization !== undefined) updateData.organization = data.organization
  if (data.documentNumber !== undefined) updateData.document_number = data.documentNumber
  if (data.documentDate !== undefined) updateData.document_date = data.documentDate
  if (data.visibility !== undefined) updateData.visibility = data.visibility
  if (data.reviewStatus !== undefined) updateData.review_status = data.reviewStatus
  if (contentChanged) updateData.content_hash = newHash

  if (data.status !== undefined) {
    updateData.status = data.status
    if (data.status === 'published' && current.status !== 'published') {
      updateData.published_at = new Date().toISOString()
    }
    if (data.status === 'archived') {
      updateData.archived_at = new Date().toISOString()
    }
  }

  const { data: updated, error: updateError } = await (supabase as any)
    .from('knowledge_items')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('knowledge_items')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
