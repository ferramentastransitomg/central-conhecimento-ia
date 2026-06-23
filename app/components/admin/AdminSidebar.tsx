'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, Plus, FolderOpen,
  Settings, BarChart3, LogOut, BookOpen, Tag, Users
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/documentos', label: 'Documentos', icon: FileText },
  { href: '/admin/novo', label: 'Novo documento', icon: Plus },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/diagnostico', label: 'Diagnóstico IA', icon: BarChart3 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href) && href !== '/admin'
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col z-40">
      {/* Logo */}
      <Link
        href="/admin"
        className="h-16 flex items-center gap-3 px-5 border-b border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 text-left">
          <p className="font-bold text-sm text-surface-900 dark:text-surface-100 leading-tight truncate">
            Central de Conhecimento
          </p>
          <p className="text-xs text-surface-400">Administração</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${
              isActive(item.href, item.exact) ? 'active' : ''
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-surface-200 dark:border-surface-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-surface-500">Conectado como</p>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-200 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
