import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware do Next.js
 *
 * Responsabilidades:
 * 1. Gerenciar sessão de autenticação via Supabase SSR
 * 2. Proteger rotas /admin
 * 3. Redirecionar páginas públicas com query strings para URL canônica limpa
 * 4. Redirecionar rotas aninhadas inválidas para slug plano (se existir)
 */

// Slugs de rotas do sistema que nunca são páginas de conhecimento
const SYSTEM_ROUTES = [
  '/admin',
  '/login',
  '/api',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/manifest.webmanifest',
  '/favicon.ico',
  '_next',
  '/opengraph-image',
  '/icon',
]

function isSystemRoute(pathname: string): boolean {
  return SYSTEM_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl

  // ──────────────────────────────────────────────────────────────
  // 1. Gerenciamento de sessão Supabase
  // ──────────────────────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value }: any) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualiza sessão - não remover esta linha
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ──────────────────────────────────────────────────────────────
  // 2. Proteção de rotas administrativas
  // ──────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar se o usuário é admin
    const { data: profile } = (await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()) as any

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 3. Redirecionar login para admin se já autenticado
  // ──────────────────────────────────────────────────────────────
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // ──────────────────────────────────────────────────────────────
  // 4. Redirecionar URLs de conhecimento público com query strings
  //    para a URL canônica limpa (sem parâmetros)
  // ──────────────────────────────────────────────────────────────
  if (!isSystemRoute(pathname) && pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean)

    // Se tem exatamente 1 segmento e há query strings → redirecionar para URL limpa
    if (segments.length === 1 && search) {
      // Redirecionamento permanente (301) para URL sem query string
      const cleanUrl = new URL(pathname, request.url)
      return NextResponse.redirect(cleanUrl, { status: 301 })
    }

    // Se tem mais de 1 segmento, pode ser uma rota aninhada inválida
    // Não redirecionamos aqui pois precisaríamos de acesso ao BD
    // O [slug]/page.tsx lida com isso retornando 404
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - Arquivos estáticos (_next/static, _next/image, favicon.ico, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
