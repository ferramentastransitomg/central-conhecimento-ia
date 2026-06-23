'use client'

import { useState } from 'react'
import { toast } from '@/app/components/ui/Toast'
import type { Settings } from '@/lib/database.types'
import { Save } from 'lucide-react'

interface SettingsFormProps {
  initialSettings: Settings | null
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [form, setForm] = useState({
    platform_name: initialSettings?.platform_name || 'Central de Conhecimento para IA',
    description: initialSettings?.description || '',
    organization: initialSettings?.organization || '',
    official_domain: initialSettings?.official_domain || '',
    legal_disclaimer: initialSettings?.legal_disclaimer || '',
    reserved_slugs: (initialSettings?.reserved_slugs || []).join(', '),
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          reserved_slugs: form.reserved_slugs.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })
      if (res.ok) {
        toast('success', 'Configurações salvas com sucesso')
      } else {
        const data = await res.json()
        toast('error', data.error || 'Erro ao salvar')
      }
    } catch {
      toast('error', 'Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-6 space-y-5">
      <div>
        <label className="input-label">Nome da plataforma</label>
        <input type="text" value={form.platform_name} onChange={(e) => setForm({ ...form, platform_name: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="input-label">Descrição</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
      </div>
      <div>
        <label className="input-label">Organização responsável</label>
        <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="input-label">Domínio oficial</label>
        <input type="url" value={form.official_domain} onChange={(e) => setForm({ ...form, official_domain: e.target.value })} className="input-field" placeholder="https://meudominio.com" />
      </div>
      <div>
        <label className="input-label">Aviso legal</label>
        <textarea value={form.legal_disclaimer} onChange={(e) => setForm({ ...form, legal_disclaimer: e.target.value })} className="input-field" rows={3} />
      </div>
      <div>
        <label className="input-label">Slugs reservados adicionais (separados por vírgula)</label>
        <textarea value={form.reserved_slugs} onChange={(e) => setForm({ ...form, reserved_slugs: e.target.value })} className="input-field font-mono text-sm" rows={3} />
        <p className="text-xs text-surface-400 mt-1">Além dos reservados do sistema: admin, login, api, sitemap.xml, robots.txt, llms.txt</p>
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar configurações'}
      </button>
    </div>
  )
}
