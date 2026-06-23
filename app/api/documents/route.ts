import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'
import { validateSlug } from '@/lib/slug'
import { hashContent } from '@/lib/hash'
import type { KnowledgeItemInsert } from '@/lib/database.types'

export const runtime = 'nodejs'

const CreateDocumentSchema = z.object({
  title: z.string().min(3, 'Título muito curto').max(500, 'Título muito longo'),
  subtitle: z.string().max(500).optional(),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().max(1000).optional(),
  summary: z.string().max(5000).optional(),
  sourceType: z.enum(['url', 'pdf', 'docx', 'txt', 'markdown', 'html', 'manual']),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  sourceDomain: z.string().optional(),
  originalFilename: z.string().optional(),
  storagePath: z.string().optional(),
  mimeType: z.string().optional(),
  rawText: z.string(),
  contentHtml: z.string(),
  contentMarkdown: z.string().optional(),
  keywords: z.array(z.string()).optional().default([]),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  organization: z.string().max(500).optional(),
  documentNumber: z.string().max(200).optional(),
  documentDate: z.string().optional(),
  officialPublicationDate: z.string().optional(),
  status: z.enum(['draft', 'pending_review', 'published', 'archived']).default('draft'),
  visibility: z.enum(['public', 'private']).default('public'),
})

export async function POST(request: NextRequest) {
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

  const parsed = CreateDocumentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Dados inválidos', details: parsed.error.errors },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Validar slug
  const supabase = createServerSupabaseClient()

  // Buscar slugs reservados das configurações
  const { data: settings } = (await supabase
    .from('settings')
    .select('reserved_slugs')
    .limit(1)
    .single()) as any

  const reservedSlugs = settings?.reserved_slugs || []
  const slugValidation = validateSlug(data.slug, reservedSlugs)
  if (!slugValidation.valid) {
    return NextResponse.json({ error: slugValidation.error }, { status: 400 })
  }

  // Verificar unicidade do slug
  const { data: existing } = (await supabase
    .from('knowledge_items')
    .select('id')
    .eq('slug', data.slug)
    .limit(1)
    .single()) as any

  if (existing) {
    return NextResponse.json({ error: 'Este slug já está em uso' }, { status: 409 })
  }

  const contentHash = hashContent(data.rawText)
  const now = new Date().toISOString()

  const insertData: KnowledgeItemInsert = {
    title: data.title,
    subtitle: data.subtitle || null,
    slug: data.slug,
    description: data.description || null,
    summary: data.summary || null,
    source_type: data.sourceType,
    source_url: data.sourceUrl || null,
    source_domain: data.sourceDomain || null,
    original_filename: data.originalFilename || null,
    storage_path: data.storagePath || null,
    mime_type: data.mimeType || null,
    raw_text: data.rawText,
    content_html: data.contentHtml,
    content_markdown: data.contentMarkdown || null,
    keywords: data.keywords,
    category_id: data.categoryId || null,
    organization: data.organization || null,
    document_number: data.documentNumber || null,
    document_date: data.documentDate || null,
    official_publication_date: data.officialPublicationDate || null,
    content_hash: contentHash,
    status: data.status,
    visibility: data.visibility,
    review_status: 'not_reviewed',
    published_at: data.status === 'published' ? now : null,
    created_by: session.user.id,
  }

  const { data: created, error } = (await (supabase.from('knowledge_items') as any)
    .insert(insertData)
    .select()
    .single()) as any

  if (error) {
    console.error('DB insert error:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar documento: ' + error.message },
      { status: 500 }
    )
  }

  // Criar versão inicial
  await (supabase.from('knowledge_versions') as any).insert({
    item_id: created.id,
    version_number: 1,
    raw_text: data.rawText,
    content_html: data.contentHtml,
    content_markdown: data.contentMarkdown || null,
    summary: 'Versão inicial',
    content_hash: contentHash,
    created_by: session.user.id,
    update_source: 'manual',
  })

  return NextResponse.json({ success: true, data: created }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const offset = (page - 1) * limit

  // Para listagem admin, verificar autenticação
  const session = await requireAdmin()

  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('knowledge_items')
    .select('*, categories(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!session) {
    // Visitantes públicos: apenas publicados e públicos
    query = query.eq('status', 'published').eq('visibility', 'public')
  } else if (status) {
    query = query.eq('status', status)
  }

  if (category) query = query.eq('category_id', category)

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,raw_text.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    },
  })
}
