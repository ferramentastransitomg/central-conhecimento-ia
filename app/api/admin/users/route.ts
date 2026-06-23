import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const supabase = createServerSupabaseClient() as any
    
    // Listar usuários do Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError || !authData) {
      console.error('Erro ao listar usuários Auth:', authError)
      return NextResponse.json({ error: 'Erro ao buscar usuários do Auth: ' + (authError?.message || 'Sem dados') }, { status: 500 })
    }

    // Listar perfis do banco
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('Erro ao listar perfis:', profilesError)
      return NextResponse.json({ error: 'Erro ao buscar perfis: ' + profilesError.message }, { status: 500 })
    }

    // Combinar informações
    const users = authData.users.map((user: any) => {
      const profile = profiles?.find((p: any) => p.id === user.id)
      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || '',
        role: profile?.role || 'visitor',
        created_at: user.created_at,
      }
    })

    return NextResponse.json({ data: users })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, password, full_name, role } = body

    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient() as any

    // Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData) {
      console.error('Erro ao criar usuário no Auth:', authError)
      return NextResponse.json({ error: authError?.message || 'Erro ao criar usuário' }, { status: 400 })
    }

    const newUser = authData.user

    // Upsert perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: newUser.id,
        full_name,
        role,
      })

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      // Excluir usuário do Auth para consistência
      await supabase.auth.admin.deleteUser(newUser.id)
      return NextResponse.json({ error: 'Erro ao criar perfil: ' + profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        full_name,
        role,
        created_at: newUser.created_at,
      },
    }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
