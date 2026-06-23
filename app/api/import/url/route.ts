import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { importFromUrl } from '@/lib/extractor'
import { generateSlugFromUrl, generateSlugFromTitle } from '@/lib/slug'
import { requireAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const maxDuration = 30

const ImportSchema = z.object({
  url: z.string().url('URL inválida'),
})

export async function POST(request: NextRequest) {
  // Verificar autenticação admin
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido no corpo da requisição' }, { status: 400 })
  }

  const parsed = ImportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Dados inválidos' },
      { status: 400 }
    )
  }

  try {
    const extracted = await importFromUrl(parsed.data.url)
    const suggestedSlugFromUrl = generateSlugFromUrl(parsed.data.url)
    const suggestedSlugFromTitle = generateSlugFromTitle(extracted.title)

    // Preferir slug do título se tiver mais de 3 caracteres
    const suggestedSlug =
      suggestedSlugFromTitle.length > 3
        ? suggestedSlugFromTitle
        : suggestedSlugFromUrl

    return NextResponse.json({
      success: true,
      data: {
        title: extracted.title,
        description: extracted.description,
        contentHtml: extracted.contentHtml,
        rawText: extracted.rawText,
        sourceUrl: parsed.data.url,
        finalUrl: extracted.finalUrl,
        domain: extracted.domain,
        statusCode: extracted.statusCode,
        suggestedSlug,
        suggestedSlugFromTitle,
        suggestedSlugFromUrl,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
