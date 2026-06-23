import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export function createSSRServerClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Em Server Components readonly, ignore
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = createSSRServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAdmin() {
  const supabase = createSSRServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: profile } = (await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()) as any

  if (profile?.role !== 'admin') {
    return null
  }

  return session
}
