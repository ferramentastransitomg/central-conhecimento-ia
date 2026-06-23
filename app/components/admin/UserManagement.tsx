'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/app/components/ui/Toast'
import { Users, UserPlus, Trash2, Key, Mail, User } from 'lucide-react'

interface UserItem {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'visitor'
  created_at: string
}

interface UserManagementProps {
  currentUserEmail: string
}

export function UserManagement({ currentUserEmail }: UserManagementProps) {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'admin' as 'admin' | 'visitor',
  })

  // Carregar lista de usuários
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const result = await res.json()
        setUsers(result.data || [])
      } else {
        toast('error', 'Erro ao carregar usuários')
      }
    } catch {
      toast('error', 'Erro na requisição dos usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Submeter formulário de criação de usuário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.full_name) {
      toast('error', 'Por favor, preencha todos os campos.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        toast('success', 'Usuário cadastrado com sucesso!')
        setForm({
          email: '',
          password: '',
          full_name: '',
          role: 'admin',
        })
        fetchUsers() // Recarregar a lista
      } else {
        toast('error', data.error || 'Erro ao cadastrar usuário.')
      }
    } catch {
      toast('error', 'Erro na conexão para cadastrar usuário.')
    } finally {
      setSaving(false)
    }
  }

  // Deletar usuário
  const handleDelete = async (id: string, email: string) => {
    if (email === currentUserEmail) {
      toast('error', 'Você não pode excluir sua própria conta.')
      return
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${email}?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast('success', 'Usuário excluído com sucesso.')
        fetchUsers()
      } else {
        const data = await res.json()
        toast('error', data.error || 'Erro ao excluir usuário.')
      }
    } catch {
      toast('error', 'Erro na conexão para excluir usuário.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulário de Criação (1 coluna) */}
      <div className="lg:col-span-1">
        <div className="card p-6 sticky top-24">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Adicionar Novo Membro
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Nome Completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="input-field pl-9"
                  placeholder="Nome do usuário"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              </div>
            </div>

            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-9"
                  placeholder="exemplo@email.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              </div>
            </div>

            <div>
              <label className="input-label">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-9"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              </div>
            </div>

            <div>
              <label className="input-label">Nível de Acesso</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'visitor' })}
                className="input-field"
              >
                <option value="admin">Administrador (Acesso completo e escrita)</option>
                <option value="visitor">Visitante (Apenas leitura/sem acesso ao painel)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full justify-center mt-6"
            >
              {saving ? 'Cadastrando...' : 'Cadastrar Membro'}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Usuários (2 colunas) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Membros da Equipe
          </h2>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-600 rounded-full animate-spin" />
              <p className="text-sm text-surface-500">Carregando usuários...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-surface-500">
              Nenhum usuário cadastrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800 text-sm font-semibold text-surface-500">
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">Acesso</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/10">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-surface-900 dark:text-surface-100">
                          {user.full_name || 'Sem nome'}
                        </div>
                        <div className="text-xs text-surface-400 flex items-center gap-1.5 mt-0.5">
                          {user.email}
                          {user.email === currentUserEmail && (
                            <span className="text-[10px] bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 px-1.5 py-0.5 rounded font-medium">Você</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Visitante'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {user.email !== currentUserEmail ? (
                          <button
                            onClick={() => handleDelete(user.id, user.email)}
                            className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-surface-400 italic">Ativo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
