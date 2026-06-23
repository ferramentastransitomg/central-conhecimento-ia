/**
 * REGRA CRÍTICA DE ARQUITETURA DE URL
 *
 * Esta é a única função autorizada a gerar URLs públicas de conhecimento.
 * Sempre retorna /{slug} — nunca rotas aninhadas.
 *
 * USO OBRIGATÓRIO: Todo componente que precise exibir a URL pública de um
 * documento DEVE usar esta função. Nunca concatene slugs manualmente.
 */
export function getPublicKnowledgeUrl(slug: string): string {
  // Garantia: nunca retorna rota aninhada
  const cleanSlug = slug.replace(/^\/+/, '').replace(/\/+$/, '')
  return `/${cleanSlug}`
}

/**
 * Valida se uma URL pública de conhecimento está no formato correto.
 * Formato esperado: /[a-z0-9]+(?:-[a-z0-9]+)*
 */
export function isValidPublicKnowledgeUrl(url: string): boolean {
  return /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url)
}

/**
 * Retorna a URL canônica absoluta para um documento.
 */
export function getCanonicalUrl(slug: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${appUrl}${getPublicKnowledgeUrl(slug)}`
}
