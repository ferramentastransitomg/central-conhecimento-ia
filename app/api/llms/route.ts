import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getPublicKnowledgeUrl } from '@/lib/urls'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const supabase = createServerSupabaseClient()

  const [itemsRes, settingsRes] = await Promise.all([
    supabase
      .from('knowledge_items')
      .select('title, slug, description, summary, updated_at')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false }),
    supabase.from('settings').select('platform_name, description').limit(1).single(),
  ])

  const items = (itemsRes.data || []) as any[]
  const settings = settingsRes.data as any

  const lines = [
    `# ${settings?.platform_name || 'Central de Conhecimento para IA'}`,
    '',
    settings?.description || 'Base de conhecimento pública para agentes de IA.',
    '',
    `> Página inicial: ${appUrl}`,
    '',
    '---',
    '',
    '## Conteúdos disponíveis',
    '',
    ...items.map((item) => {
      const url = `${appUrl}${getPublicKnowledgeUrl(item.slug)}`
      const summary = item.description || item.summary || ''
      const date = new Date(item.updated_at).toISOString().split('T')[0]
      return `- [${item.title}](${url})${summary ? `: ${summary.slice(0, 200)}` : ''} — Atualizado em: ${date}`
    }),
    '',
    '---',
    `Gerado em: ${new Date().toISOString()}`,
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
