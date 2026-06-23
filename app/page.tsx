import { Suspense } from 'react'
import { createSSRServerClient } from '@/lib/supabase-server'
import { PublicHeader } from '@/app/components/public/PublicHeader'
import { PublicFooter } from '@/app/components/public/PublicFooter'
import { HomeContent } from '@/app/components/public/HomeContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Central de Conhecimento para IA — Conteúdos confiáveis para agentes de IA',
  description:
    'Base de conhecimento pública com conteúdos organizados e acessíveis para agentes de inteligência artificial, mecanismos de busca e usuários.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

export default async function HomePage() {
  const supabase = createSSRServerClient()

  const [itemsRes, categoriesRes, settingsRes] = await Promise.all([
    supabase
      .from('knowledge_items')
      .select('*, categories(*)')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false })
      .limit(50),
    supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('display_order'),
    supabase.from('settings').select('*').limit(1).single(),
  ])

  const items = itemsRes.data || []
  const categories = categoriesRes.data || []
  const settings = settingsRes.data

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main id="main-content" className="flex-1">
        <HomeContent
          items={items}
          categories={categories}
          settings={settings}
        />
      </main>
      <PublicFooter />
    </div>
  )
}
