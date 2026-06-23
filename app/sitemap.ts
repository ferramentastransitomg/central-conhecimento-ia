import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getCanonicalUrl } from '@/lib/urls'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const supabase = createServerSupabaseClient()

  const { data: items } = (await supabase
    .from('knowledge_items')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('published_at', { ascending: false })) as any

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = (items || []).map((item: any) => ({
    // REGRA CRÍTICA: Sempre usar /{slug} sem subrotas
    url: getCanonicalUrl(item.slug),
    lastModified: new Date(item.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
