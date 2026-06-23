/**
 * Processadores de arquivos no servidor.
 *
 * Suporte a: PDF, DOCX, TXT, Markdown, HTML
 * Cada processador retorna o conteúdo extraído padronizado.
 */

export interface ProcessedFile {
  title: string
  contentHtml: string
  rawText: string
  pageCount?: number
  requiresOcr?: boolean
  originalMimeType: string
}

const MIN_TEXT_CHARS_FOR_PDF = 100

/**
 * Processa um arquivo PDF e extrai seu texto.
 */
export async function processPdf(
  buffer: Buffer,
  filename: string
): Promise<ProcessedFile> {
  // Dynamic import para evitar problemas com bundler
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse')

  let data: { text: string; numpages: number }
  try {
    data = await pdfParse(buffer)
  } catch (err) {
    throw new Error(
      `Falha ao processar PDF "${filename}": ${err instanceof Error ? err.message : String(err)}`
    )
  }

  const rawText = data.text?.trim() || ''
  const requiresOcr = rawText.length < MIN_TEXT_CHARS_FOR_PDF

  if (requiresOcr) {
    return {
      title: filename.replace(/\.pdf$/i, ''),
      contentHtml: '',
      rawText: '',
      pageCount: data.numpages,
      requiresOcr: true,
      originalMimeType: 'application/pdf',
    }
  }

  // Converte texto em HTML estruturado básico
  const contentHtml = textToHtml(rawText)
  const title = extractTitleFromText(rawText) || filename.replace(/\.pdf$/i, '')

  return {
    title,
    contentHtml,
    rawText,
    pageCount: data.numpages,
    requiresOcr: false,
    originalMimeType: 'application/pdf',
  }
}

/**
 * Processa um arquivo DOCX e extrai seu conteúdo como HTML.
 */
export async function processDocx(
  buffer: Buffer,
  filename: string
): Promise<ProcessedFile> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mammoth = require('mammoth')

  let result: { value: string; messages: unknown[] }
  try {
    result = await mammoth.convertToHtml({ buffer })
  } catch (err) {
    throw new Error(
      `Falha ao processar DOCX "${filename}": ${err instanceof Error ? err.message : String(err)}`
    )
  }

  const contentHtml = sanitizeExtractedHtml(result.value)
  const rawText = htmlToText(contentHtml)
  const title = extractTitleFromHtml(contentHtml) || filename.replace(/\.docx$/i, '')

  return {
    title,
    contentHtml,
    rawText,
    originalMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
}

/**
 * Processa um arquivo de texto (TXT).
 */
export function processTxt(
  buffer: Buffer,
  filename: string
): ProcessedFile {
  const rawText = buffer.toString('utf-8').trim()
  const contentHtml = textToHtml(rawText)
  const title = extractTitleFromText(rawText) || filename.replace(/\.txt$/i, '')

  return {
    title,
    contentHtml,
    rawText,
    originalMimeType: 'text/plain',
  }
}

/**
 * Processa um arquivo Markdown.
 */
export async function processMarkdown(
  buffer: Buffer,
  filename: string
): Promise<ProcessedFile> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { marked } = require('marked')

  const markdown = buffer.toString('utf-8').trim()
  const contentHtml = sanitizeExtractedHtml(await marked(markdown))
  const rawText = htmlToText(contentHtml)
  const title = extractTitleFromText(markdown) || filename.replace(/\.(md|markdown)$/i, '')

  return {
    title,
    contentHtml,
    rawText,
    originalMimeType: 'text/markdown',
  }
}

/**
 * Processa um arquivo HTML.
 */
export function processHtml(
  buffer: Buffer,
  filename: string
): ProcessedFile {
  const html = buffer.toString('utf-8').trim()
  const contentHtml = sanitizeExtractedHtml(html)
  const rawText = htmlToText(contentHtml)
  const title =
    extractTitleFromHtml(html) ||
    filename.replace(/\.html?$/i, '')

  return {
    title,
    contentHtml,
    rawText,
    originalMimeType: 'text/html',
  }
}

// ──────────────────────────────────────────────────────────────
// Utilitários internos
// ──────────────────────────────────────────────────────────────

function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('\n')
}

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractTitleFromText(text: string): string | null {
  // Primeiro parágrafo não vazio como título candidate
  const firstLine = text.split('\n').find((l) => l.trim().length > 5)
  if (firstLine && firstLine.trim().length <= 200) {
    return firstLine.trim()
  }
  return null
}

function extractTitleFromHtml(html: string): string | null {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    const text = htmlToText(h1Match[1]).trim()
    if (text.length > 3 && text.length <= 200) return text
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) {
    const text = htmlToText(titleMatch[1]).trim()
    if (text.length > 3 && text.length <= 200) return text
  }

  return null
}

function sanitizeExtractedHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*on\w+="[^"]*"/gi, '')
    .replace(/\s*on\w+='[^']*'/gi, '')
    .replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'href="#"')
    .trim()
}
