/**
 * Slugs reservados que nunca podem ser usados como slug de documento público.
 * Estes são protegidos para evitar conflito com rotas do sistema.
 */
export const RESERVED_SLUGS = [
  'admin',
  'login',
  'api',
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
  'manifest.webmanifest',
  'favicon.ico',
  'opengraph-image',
  'icon',
  'entrar',
  'sair',
  '404',
  '500',
  '_next',
  '_vercel',
] as const

/**
 * Regex obrigatória para validação de slugs públicos.
 * Somente letras minúsculas, números e hífens. Sem underscores ou pontos.
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Sanitiza e normaliza um texto qualquer para produzir um slug válido.
 *
 * Etapas:
 * 1. Remove acentos (NFD normalization)
 * 2. Remove caracteres não-ASCII
 * 3. Converte para minúsculas
 * 4. Substitui espaços e caracteres especiais por hífens
 * 5. Remove hífens repetidos
 * 6. Remove hífens no início e fim
 */
export function generateSlug(text: string): string {
  return text
    .normalize('NFD')                          // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')           // Remove diacríticos
    .toLowerCase()                             // Minúsculas
    .replace(/[^a-z0-9\s-]/g, '')             // Remove caracteres inválidos
    .trim()
    .replace(/[\s_]+/g, '-')                   // Espaços e underscores → hífens
    .replace(/-+/g, '-')                       // Remove hífens repetidos
    .replace(/^-+|-+$/g, '')                   // Remove hífens no início/fim
}

/**
 * Gera um slug a partir de uma URL externa profunda.
 * Extrai o último segmento significativo e sanitiza.
 *
 * Exemplo:
 *   https://site.gov.br/legislacao/texto/lei/123/?versao=consolidada
 *   → "123" → "123" (pode ser insuficiente, é apenas sugestão inicial)
 */
export function generateSlugFromUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // Remove query string e fragmento, pega o pathname
    const pathParts = parsed.pathname
      .replace(/\/$/, '')         // Remove trailing slash
      .split('/')
      .filter(Boolean)            // Remove segmentos vazios

    // Tenta pegar o último segmento significativo
    const lastSegment = pathParts[pathParts.length - 1] || 'documento'
    return generateSlug(lastSegment)
  } catch {
    return generateSlug(url)
  }
}

/**
 * Gera um slug a partir do título de um documento.
 */
export function generateSlugFromTitle(title: string): string {
  return generateSlug(title)
}

/**
 * Resultado de validação de slug.
 */
export interface SlugValidationResult {
  valid: boolean
  error?: string
}

/**
 * Valida um slug candidato contra todas as regras obrigatórias.
 *
 * Regras verificadas:
 * - Não pode ser vazio
 * - Deve conter somente letras minúsculas, números e hífens
 * - Não pode começar ou terminar com hífen
 * - Não pode ter hífens repetidos
 * - Não pode ser um slug reservado
 * - Não pode conter barras /
 * - Não pode conter ?, #, &, =, espaços
 */
export function validateSlug(
  slug: string,
  additionalReserved: string[] = []
): SlugValidationResult {
  if (!slug || slug.trim() === '') {
    return { valid: false, error: 'O slug não pode ser vazio.' }
  }

  if (slug.includes('/')) {
    return { valid: false, error: 'O slug não pode conter barras (/).' }
  }

  if (/[?#&=\s]/.test(slug)) {
    return {
      valid: false,
      error: 'O slug não pode conter ?, #, &, = ou espaços.',
    }
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      valid: false,
      error:
        'O slug deve conter apenas letras minúsculas (a-z), números (0-9) e hífens (-). Não pode começar ou terminar com hífen.',
    }
  }

  const allReserved = [...RESERVED_SLUGS, ...additionalReserved]
  if (allReserved.includes(slug.toLowerCase())) {
    return {
      valid: false,
      error: `"${slug}" é um slug reservado e não pode ser usado para documentos públicos.`,
    }
  }

  return { valid: true }
}

/**
 * Verifica se uma URL pública gerada é compatível com fontes de IA.
 * A URL deve ter exatamente um segmento, sem query strings, sem fragmentos.
 */
export function isAICompatibleUrl(url: string): boolean {
  try {
    const parsed = new URL(url, 'http://localhost')
    // Sem query strings
    if (parsed.search) return false
    // Sem fragmentos
    if (parsed.hash) return false
    // Pathname deve ter exatamente um segmento: /slug
    const segments = parsed.pathname.split('/').filter(Boolean)
    if (segments.length !== 1) return false
    // O único segmento deve ser um slug válido
    return SLUG_REGEX.test(segments[0])
  } catch {
    return false
  }
}
