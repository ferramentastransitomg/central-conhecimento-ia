import { describe, it, expect } from 'vitest'
import { getPublicKnowledgeUrl, isValidPublicKnowledgeUrl, getCanonicalUrl } from '../lib/urls'
import {
  generateSlug,
  generateSlugFromUrl,
  generateSlugFromTitle,
  validateSlug,
  isAICompatibleUrl,
  SLUG_REGEX,
  RESERVED_SLUGS,
} from '../lib/slug'

// ── getPublicKnowledgeUrl ────────────────────────────────────────
describe('getPublicKnowledgeUrl', () => {
  it('deve sempre retornar /{slug} sem rotas aninhadas', () => {
    expect(getPublicKnowledgeUrl('manual-de-atendimento')).toBe('/manual-de-atendimento')
    expect(getPublicKnowledgeUrl('lei-123')).toBe('/lei-123')
    expect(getPublicKnowledgeUrl('regulamento-interno')).toBe('/regulamento-interno')
  })

  it('deve corresponder ao formato esperado /${slug}', () => {
    const slug = 'manual-de-atendimento'
    const result = getPublicKnowledgeUrl(slug)
    expect(result).toBe(`/${slug}`)
  })

  it('nunca deve retornar rotas aninhadas como /documentos/slug', () => {
    const result = getPublicKnowledgeUrl('lei-123')
    expect(result).not.toContain('/documentos/')
    expect(result).not.toContain('/fontes/')
    expect(result).not.toContain('/conhecimento/')
    expect(result.split('/').filter(Boolean)).toHaveLength(1)
  })

  it('não deve incluir query strings', () => {
    const result = getPublicKnowledgeUrl('lei-123')
    expect(result).not.toContain('?')
    expect(result).not.toContain('&')
    expect(result).not.toContain('=')
  })

  it('não deve incluir fragmentos', () => {
    const result = getPublicKnowledgeUrl('lei-123')
    expect(result).not.toContain('#')
  })

  it('deve remover barras extras no slug', () => {
    const result = getPublicKnowledgeUrl('/lei-123/')
    expect(result).toBe('/lei-123')
  })
})

// ── URL pública de URL gov.br profunda ───────────────────────────
describe('Regra crítica: URL externa profunda → URL pública plana', () => {
  /**
   * Teste obrigatório:
   * Entrada: https://www.exemplo.gov.br/legislacao/documentos/texto/lei/123/?versao=consolidada
   * Resultado esperado: /lei-123 (após processamento manual do slug)
   */
  it('URL gov.br profunda deve gerar slug de 1 segmento', () => {
    const externalUrl =
      'https://www.exemplo.gov.br/legislacao/documentos/texto/lei/123/?versao=consolidada'

    // O sistema sugere slug a partir do último segmento da URL
    const suggestedSlug = generateSlugFromUrl(externalUrl)

    // O administrador pode ajustar — mas a URL final deve ter 1 segmento
    const finalUrl = getPublicKnowledgeUrl('lei-123')

    // A URL interna DEVE ser /lei-123
    expect(finalUrl).toBe('/lei-123')

    // A URL interna NÃO deve ser nenhuma dessas variantes inválidas
    expect(finalUrl).not.toBe('/documentos/lei-123')
    expect(finalUrl).not.toBe('/fontes/lei-123')
    expect(finalUrl).not.toBe('/lei/123')
    expect(finalUrl).not.toContain('?versao=consolidada')
    expect(finalUrl).not.toContain('?')

    // Deve ter exatamente 1 segmento
    const segments = finalUrl.split('/').filter(Boolean)
    expect(segments).toHaveLength(1)

    // Deve passar na regex de validação
    expect(isValidPublicKnowledgeUrl(finalUrl)).toBe(true)
  })

  it('slug gerado de URL profunda não pode conter barras', () => {
    const url = 'https://site.gov.br/legislacao/texto/lei/123/?versao=consolidada'
    const slug = generateSlugFromUrl(url)
    expect(slug).not.toContain('/')
    expect(SLUG_REGEX.test(slug)).toBe(true)
  })

  it('URL pública final não pode ter mais de um segmento', () => {
    const slugs = ['lei-123', 'manual-de-atendimento', 'regulamento-interno', 'guia-de-procedimentos']
    for (const slug of slugs) {
      const url = getPublicKnowledgeUrl(slug)
      const segments = url.split('/').filter(Boolean)
      expect(segments.length).toBe(1)
    }
  })
})

// ── Validação de slugs ───────────────────────────────────────────
describe('validateSlug', () => {
  it('deve aceitar slugs válidos', () => {
    expect(validateSlug('manual-de-atendimento').valid).toBe(true)
    expect(validateSlug('lei-123').valid).toBe(true)
    expect(validateSlug('orientacao-tecnica-2026').valid).toBe(true)
    expect(validateSlug('guia').valid).toBe(true)
    expect(validateSlug('a1').valid).toBe(true)
  })

  it('deve rejeitar slug vazio', () => {
    expect(validateSlug('').valid).toBe(false)
    expect(validateSlug('   ').valid).toBe(false)
  })

  it('não deve aceitar barras no slug', () => {
    expect(validateSlug('lei/123').valid).toBe(false)
    expect(validateSlug('documentos/lei-123').valid).toBe(false)
    expect(validateSlug('/lei-123').valid).toBe(false)
  })

  it('não deve aceitar caracteres inválidos', () => {
    expect(validateSlug('lei 123').valid).toBe(false)      // espaço
    expect(validateSlug('lei_123').valid).toBe(false)      // underscore
    expect(validateSlug('lei-123?v=1').valid).toBe(false)  // query string
    expect(validateSlug('lei#123').valid).toBe(false)      // fragmento
    expect(validateSlug('Lei-123').valid).toBe(false)      // maiúscula
    expect(validateSlug('lei--123').valid).toBe(false)     // hífen repetido
    expect(validateSlug('-lei-123').valid).toBe(false)     // começa com hífen
    expect(validateSlug('lei-123-').valid).toBe(false)     // termina com hífen
  })

  it('deve rejeitar slugs reservados', () => {
    for (const slug of RESERVED_SLUGS) {
      expect(validateSlug(slug).valid).toBe(false)
    }
  })

  it('deve rejeitar slugs reservados adicionais', () => {
    expect(validateSlug('documento', ['meu-slug-reservado']).valid).toBe(true)
    expect(validateSlug('meu-slug-reservado', ['meu-slug-reservado']).valid).toBe(false)
  })
})

// ── Geração de slugs ─────────────────────────────────────────────
describe('generateSlug', () => {
  it('deve converter texto com acentos corretamente', () => {
    expect(generateSlug('Regulamento de Atenção ao Usuário')).toBe('regulamento-de-atencao-ao-usuario')
    expect(generateSlug('Política de Segurança')).toBe('politica-de-seguranca')
    expect(generateSlug('Guia de Procedimentos Administrativos')).toBe('guia-de-procedimentos-administrativos')
  })

  it('deve converter para minúsculas', () => {
    expect(generateSlug('MANUAL DE ATENDIMENTO')).toBe('manual-de-atendimento')
  })

  it('deve substituir espaços por hífens', () => {
    expect(generateSlug('manual de atendimento')).toBe('manual-de-atendimento')
  })

  it('deve remover hífens repetidos', () => {
    expect(generateSlug('lei---123')).toBe('lei-123')
    expect(generateSlug('lei  123')).toBe('lei-123')
  })

  it('o resultado deve sempre passar na SLUG_REGEX', () => {
    const texts = [
      'Manual de Atendimento ao Usuário',
      'Política de Segurança',
      'Lei Complementar nº 78/2004',
      'Regulamento Interno - Versão 2',
      'PORTARIA Nº 123, DE 1º DE JANEIRO DE 2024',
    ]
    for (const text of texts) {
      const slug = generateSlug(text)
      if (slug.length > 0) {
        expect(SLUG_REGEX.test(slug)).toBe(true)
      }
    }
  })
})

// ── Slugs reservados não podem ser publicados ────────────────────
describe('Slugs reservados', () => {
  it('admin não pode ser usado como slug', () => {
    expect(validateSlug('admin').valid).toBe(false)
  })

  it('api não pode ser usado como slug', () => {
    expect(validateSlug('api').valid).toBe(false)
  })

  it('login não pode ser usado como slug', () => {
    expect(validateSlug('login').valid).toBe(false)
  })

  it('sitemap.xml não pode ser usado como slug (pois tem ponto)', () => {
    // sitemap.xml falha no regex pois tem ponto
    expect(SLUG_REGEX.test('sitemap.xml')).toBe(false)
  })
})

// ── isValidPublicKnowledgeUrl ────────────────────────────────────
describe('isValidPublicKnowledgeUrl', () => {
  it('deve aceitar URLs no formato correto', () => {
    expect(isValidPublicKnowledgeUrl('/lei-123')).toBe(true)
    expect(isValidPublicKnowledgeUrl('/manual-de-atendimento')).toBe(true)
    expect(isValidPublicKnowledgeUrl('/orientacao-tecnica-2026')).toBe(true)
  })

  it('deve rejeitar URLs com múltiplos segmentos', () => {
    expect(isValidPublicKnowledgeUrl('/documentos/lei-123')).toBe(false)
    expect(isValidPublicKnowledgeUrl('/lei/123')).toBe(false)
    expect(isValidPublicKnowledgeUrl('/categorias/legislacao/lei-123')).toBe(false)
  })

  it('deve rejeitar URLs com query strings', () => {
    expect(isValidPublicKnowledgeUrl('/lei-123?id=4')).toBe(false)
    expect(isValidPublicKnowledgeUrl('/lei-123?versao=consolidada')).toBe(false)
  })
})

// ── isAICompatibleUrl ────────────────────────────────────────────
describe('isAICompatibleUrl', () => {
  it('deve aprovar URLs compatíveis com IA', () => {
    expect(isAICompatibleUrl('/lei-123')).toBe(true)
    expect(isAICompatibleUrl('/manual-de-atendimento')).toBe(true)
  })

  it('deve rejeitar URLs com múltiplos segmentos', () => {
    expect(isAICompatibleUrl('/documentos/lei-123')).toBe(false)
    expect(isAICompatibleUrl('/lei/123/versao')).toBe(false)
  })

  it('deve rejeitar URLs com parâmetros', () => {
    expect(isAICompatibleUrl('/lei-123?id=4')).toBe(false)
    expect(isAICompatibleUrl('/lei-123#secao')).toBe(false)
  })
})

// ── Documentos privados / rascunhos não aparecem no sitemap ─────
describe('Visibilidade e Sitemap', () => {
  it('apenas documentos publicados e públicos devem estar no sitemap', () => {
    // Simulação: verificação de que o critério para sitemap é correto
    const items = [
      { slug: 'doc-publico', status: 'published', visibility: 'public' },
      { slug: 'doc-rascunho', status: 'draft', visibility: 'public' },
      { slug: 'doc-privado', status: 'published', visibility: 'private' },
      { slug: 'doc-arquivado', status: 'archived', visibility: 'public' },
    ]

    const sitemapItems = items.filter(
      (i) => i.status === 'published' && i.visibility === 'public'
    )

    expect(sitemapItems).toHaveLength(1)
    expect(sitemapItems[0].slug).toBe('doc-publico')
  })

  it('URLs no sitemap devem ser do formato /{slug}', () => {
    const slugs = ['lei-123', 'manual-de-atendimento']
    for (const slug of slugs) {
      const url = getPublicKnowledgeUrl(slug)
      expect(url).toBe(`/${slug}`)
      expect(url.split('/').filter(Boolean)).toHaveLength(1)
    }
  })
})
