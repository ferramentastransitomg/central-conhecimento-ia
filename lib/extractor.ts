/**
 * Extração de conteúdo HTML de URLs externas.
 *
 * Responsabilidades:
 * - Fetch seguro com timeout e limite de tamanho
 * - Extração do conteúdo principal
 * - Remoção de ruído (menus, scripts, ads, rodapés)
 * - Sanitização anti-XSS
 * - Preservação de estrutura semântica
 */

import { validateUrlForImport } from './ssrf-guard'

const MAX_RESPONSE_SIZE = parseInt(process.env.MAX_URL_RESPONSE_SIZE_BYTES || '5242880') // 5MB
const IMPORT_TIMEOUT_MS = parseInt(process.env.IMPORT_TIMEOUT_MS || '8000')

export interface ExtractedContent {
  title: string
  description: string
  contentHtml: string
  rawText: string
  domain: string
  finalUrl: string
  statusCode: number
}

/**
 * Sanitiza HTML removendo tags e atributos perigosos.
 * Versão server-side sem dependência de DOM.
 */
function sanitizeHtml(html: string): string {
  // Remove scripts
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Remove estilos inline e folhas de estilo
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  // Remove comentários HTML
  clean = clean.replace(/<!--[\s\S]*?-->/g, '')
  // Remove atributos de evento (onclick, onload, etc.)
  clean = clean.replace(/\s*on\w+="[^"]*"/gi, '')
  clean = clean.replace(/\s*on\w+='[^']*'/gi, '')
  clean = clean.replace(/\s*on\w+=\w+/gi, '')
  // Remove javascript: em href e src
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, 'href="#"')
  clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, '')
  // Remove data: URIs suspeitas
  clean = clean.replace(/src\s*=\s*["']?\s*data:[^"'\s>]*/gi, '')
  return clean
}

/**
 * Extrai texto plano de HTML, preservando estrutura básica.
 */
function extractTextFromHtml(html: string): string {
  // Remove todas as tags HTML, preserva espaços de quebra de linha
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' | ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Remove elementos de ruído do HTML: navegação, cabeçalho, rodapé, anúncios.
 * Estratégia baseada em seletores e heurísticas.
 */
function removeNoiseElements(html: string): string {
  // Remove tags de navegação e estrutura
  const tagsToRemove = [
    'nav', 'header', 'footer', 'aside',
    'script', 'style', 'noscript',
    'iframe', 'embed', 'object',
    'form', 'input', 'button', 'select', 'textarea',
    'svg', 'canvas'
  ]

  let clean = html
  for (const tag of tagsToRemove) {
    const regex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi')
    clean = clean.replace(regex, '')
  }

  // Remove elementos com classes/IDs típicos de ruído
  const noisePatterns = [
    // Menus e navegação
    /class="[^"]*\b(nav|menu|navbar|navigation|sidebar|breadcrumb|header|footer|ad|ads|advertisement|cookie|popup|modal|overlay)[^"]*"/gi,
    /id="[^"]*\b(nav|menu|navbar|navigation|sidebar|breadcrumb|header|footer|ad|advertisement|cookie|popup)[^"]*"/gi,
  ]

  // Para cada padrão de ruído, remove o elemento completo (simplificado)
  for (const pattern of noisePatterns) {
    clean = clean.replace(pattern, 'data-noise="true"')
  }

  return clean
}

/**
 * Extrai o conteúdo principal de um HTML completo.
 * Prioriza: <main>, <article>, [role="main"], #content, .content
 * Fallback: <body>
 */
function extractMainContent(html: string): string {
  // Busca por tags main e article
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (mainMatch) return removeNoiseElements(mainMatch[1])

  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (articleMatch) return removeNoiseElements(articleMatch[1])

  // Busca por role="main"
  const roleMainMatch = html.match(/<[^>]+role=["']main["'][^>]*>([\s\S]*?)<\/[^>]+>/i)
  if (roleMainMatch) return removeNoiseElements(roleMainMatch[1])

  // Busca por IDs e classes comuns de conteúdo principal
  const contentPatterns = [
    /<div[^>]+id=["'](?:content|main-content|article-content|page-content|post-content|entry-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]+class=["'][^"']*(?:content|article|post|entry|text)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ]

  for (const pattern of contentPatterns) {
    const match = html.match(pattern)
    if (match && match[1].length > 200) {
      return removeNoiseElements(match[1])
    }
  }

  // Fallback: extrai o body completo e remove ruído
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (bodyMatch) return removeNoiseElements(bodyMatch[1])

  return removeNoiseElements(html)
}

/**
 * Extrai o título de um HTML.
 */
function extractTitle(html: string, url: string): string {
  // Tenta <h1> primeiro
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    const h1Text = extractTextFromHtml(h1Match[1]).trim()
    if (h1Text.length > 3) return h1Text
  }

  // Tenta <title>
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) {
    const titleText = extractTextFromHtml(titleMatch[1]).trim()
    if (titleText.length > 3) return titleText
  }

  // Fallback: usa o hostname da URL
  try {
    return new URL(url).hostname
  } catch {
    return 'Documento sem título'
  }
}

/**
 * Extrai a meta description de um HTML.
 */
function extractDescription(html: string): string {
  const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  if (metaMatch) return metaMatch[1].trim()

  const ogMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
  if (ogMatch) return ogMatch[1].trim()

  return ''
}

/**
 * Converte o HTML extraído para um HTML limpo e estruturado.
 * Preserva apenas tags semânticas relevantes.
 */
function cleanupHtml(html: string): string {
  // Mantém apenas tags relevantes
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'blockquote', 'pre', 'code',
    'a', 'span', 'div', 'section', 'article',
    'dl', 'dt', 'dd',
    'hr', 'mark', 'sub', 'sup',
  ]

  // Remove tags não permitidas mas mantém o conteúdo
  let clean = html
  const allTagsRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g
  clean = clean.replace(allTagsRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Para links, apenas mantém href seguro
      if (tagName.toLowerCase() === 'a') {
        const hrefMatch = match.match(/href=["']([^"']+)["']/)
        if (hrefMatch && !hrefMatch[1].startsWith('javascript:')) {
          return `<a href="${hrefMatch[1]}" target="_blank" rel="noopener noreferrer">`
        }
        return '<a>'
      }
      // Para outras tags permitidas, remove atributos perigosos
      return match
        .replace(/\s*on\w+="[^"]*"/gi, '')
        .replace(/\s*on\w+='[^']*'/gi, '')
    }
    // Tag não permitida: remove a tag mas mantém o conteúdo
    return ' '
  })

  // Limpa espaços excessivos e linhas vazias
  clean = clean
    .replace(/\s+/g, ' ')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/<div>\s*<\/div>/gi, '')
    .trim()

  return clean
}

/**
 * Importa e extrai conteúdo de uma URL externa.
 * Inclui proteção SSRF, timeout, limite de tamanho e sanitização.
 */
export async function importFromUrl(urlString: string): Promise<ExtractedContent> {
  // Validação SSRF
  const ssrfCheck = validateUrlForImport(urlString)
  if (!ssrfCheck.safe) {
    throw new Error(`URL bloqueada por segurança: ${ssrfCheck.error}`)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), IMPORT_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(urlString, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CentralConhecimentoIA/1.0 (+https://github.com/central-conhecimento-ia)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    })
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Timeout ao acessar a URL (limite: ${IMPORT_TIMEOUT_MS}ms)`)
    }
    throw new Error(`Erro ao acessar URL: ${err instanceof Error ? err.message : String(err)}`)
  } finally {
    clearTimeout(timeoutId)
  }

  // Validação do status HTTP
  if (!response.ok) {
    throw new Error(`A URL retornou HTTP ${response.status}: ${response.statusText}`)
  }

  // Validação do tipo de conteúdo
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    throw new Error(
      `Tipo de conteúdo "${contentType}" não suportado. Apenas HTML é aceito para importação direta.`
    )
  }

  // Leitura com limite de tamanho
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Não foi possível ler o corpo da resposta.')
  }

  let totalBytes = 0
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    totalBytes += value.byteLength
    if (totalBytes > MAX_RESPONSE_SIZE) {
      reader.cancel()
      throw new Error(
        `A resposta excedeu o limite de ${Math.round(MAX_RESPONSE_SIZE / 1024 / 1024)}MB`
      )
    }
    chunks.push(value)
  }

  const htmlBuffer = Buffer.concat(chunks)
  const html = htmlBuffer.toString('utf-8')

  // Extração do conteúdo
  const title = extractTitle(html, response.url)
  const description = extractDescription(html)
  const mainContent = extractMainContent(html)
  const sanitizedContent = sanitizeHtml(mainContent)
  const cleanedHtml = cleanupHtml(sanitizedContent)
  const rawText = extractTextFromHtml(cleanedHtml)

  let domain = ''
  try {
    domain = new URL(response.url).hostname
  } catch {}

  return {
    title,
    description,
    contentHtml: cleanedHtml,
    rawText,
    domain,
    finalUrl: response.url,
    statusCode: response.status,
  }
}
