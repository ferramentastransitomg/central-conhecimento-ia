import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'
import { importFromUrl } from '@/lib/extractor'
import { hashContent, hasContentChanged } from '@/lib/hash'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()

  // Buscar item
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('id', params.id)
    .single()
  const item = data as any

  if (error || !item) {
    return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
  }

  if (item.source_type !== 'url' || !item.source_url) {
    return NextResponse.json(
      { error: 'Verificação de fonte disponível apenas para documentos importados de URL' },
      { status: 400 }
    )
  }

  const startTime = Date.now()
  let httpStatus: number | null = null
  let newHash: string | null = null
  let hasChanged = false
  let errorMessage: string | null = null
  let newContent: { contentHtml: string; rawText: string; title: string } | null = null

  try {
    const extracted = await importFromUrl(item.source_url)
    httpStatus = extracted.statusCode
    newHash = hashContent(extracted.rawText)
    hasChanged = hasContentChanged(extracted.rawText, item.content_hash)

    if (hasChanged) {
      newContent = {
        contentHtml: extracted.contentHtml,
        rawText: extracted.rawText,
        title: extracted.title,
      }
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
    httpStatus = errorMessage.includes('HTTP') ? parseInt(errorMessage.match(/HTTP (\d+)/)?.[1] || '0') : null
  }

  const duration = Date.now() - startTime

  // Registrar verificação
  await (supabase as any).from('source_checks').insert({
    item_id: params.id,
    http_status: httpStatus,
    content_hash: newHash,
    has_changed: hasChanged,
    error_message: errorMessage,
    duration_ms: duration,
  })

  // Atualizar last_checked_at e review_status se mudou
  if (!errorMessage) {
    await (supabase as any)
      .from('knowledge_items')
      .update({
        last_checked_at: new Date().toISOString(),
        review_status: hasChanged ? 'update_available' : item.review_status,
      })
      .eq('id', params.id)
  }

  return NextResponse.json({
    success: true,
    data: {
      hasChanged,
      httpStatus,
      errorMessage,
      durationMs: duration,
      newContent,
      savedHash: item.content_hash,
      newHash,
    },
  })
}
