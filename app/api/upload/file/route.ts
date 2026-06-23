import { NextRequest, NextResponse } from 'next/server'
import { processPdf, processDocx, processTxt, processMarkdown, processHtml } from '@/lib/file-processors'
import { generateSlugFromTitle } from '@/lib/slug'
import { requireAdmin } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || '10485760')

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'text/markdown': 'markdown',
  'text/x-markdown': 'markdown',
  'text/html': 'html',
}

const ALLOWED_EXTENSIONS: Record<string, string> = {
  '.pdf': 'pdf',
  '.docx': 'docx',
  '.txt': 'txt',
  '.md': 'markdown',
  '.markdown': 'markdown',
  '.html': 'html',
  '.htm': 'html',
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Formulário inválido' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  }

  // Validar tamanho
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `Arquivo muito grande. Limite: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB` },
      { status: 413 }
    )
  }

  // Validar extensão
  const filename = file.name.toLowerCase()
  const ext = '.' + filename.split('.').pop()
  const typeFromExt = ALLOWED_EXTENSIONS[ext]
  const typeFromMime = ALLOWED_MIME_TYPES[file.type]
  const sourceType = typeFromExt || typeFromMime

  if (!sourceType) {
    return NextResponse.json(
      { error: `Tipo de arquivo não suportado. Use: PDF, DOCX, TXT, Markdown ou HTML.` },
      { status: 400 }
    )
  }

  // Sanitizar nome do arquivo
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    let processed

    switch (sourceType) {
      case 'pdf':
        processed = await processPdf(buffer, sanitizedFilename)
        break
      case 'docx':
        processed = await processDocx(buffer, sanitizedFilename)
        break
      case 'txt':
        processed = processTxt(buffer, sanitizedFilename)
        break
      case 'markdown':
        processed = await processMarkdown(buffer, sanitizedFilename)
        break
      case 'html':
        processed = processHtml(buffer, sanitizedFilename)
        break
      default:
        return NextResponse.json({ error: 'Tipo não suportado' }, { status: 400 })
    }

    // Upload para Supabase Storage
    const supabase = createServerSupabaseClient()
    const storagePath = `originals/${session.user.id}/${Date.now()}_${sanitizedFilename}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Continue mesmo se o upload falhar — os dados textuais foram extraídos
    }

    const suggestedSlug = generateSlugFromTitle(processed.title)

    return NextResponse.json({
      success: true,
      data: {
        title: processed.title,
        contentHtml: processed.contentHtml,
        rawText: processed.rawText,
        originalFilename: sanitizedFilename,
        storagePath: uploadError ? null : storagePath,
        mimeType: file.type,
        sourceType,
        pageCount: processed.pageCount,
        requiresOcr: processed.requiresOcr,
        suggestedSlug,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao processar arquivo'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
