import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase-server'
import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ui/ThemeToggle'
import { ToastContainer } from '@/app/components/ui/Toast'
import { AdminSidebar } from '@/app/components/admin/AdminSidebar'
import { BookOpen } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Sidebar */}
      <AdminSidebar userEmail={session.user.email || ''} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-6">
          <div className="text-sm text-surface-500 dark:text-surface-400">
            Painel de Administração
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/" className="btn-ghost text-sm" target="_blank">
              Ver site público
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
