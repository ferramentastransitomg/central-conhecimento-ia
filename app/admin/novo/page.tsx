'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateSlugFromTitle, generateSlugFromUrl, generateSlug } from '@/lib/slug'
import { getPublicKnowledgeUrl } from '@/lib/urls'
import { SlugInput } from '@/app/components/ui/SlugInput'
import { toast } from '@/app/components/ui/Toast'
import {
  Globe, FileText, Upload, PenLine,
  ArrowLeft, ArrowRight, Check, Eye,
  AlertCircle, Loader2
} from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7
type SourceType = 'url' | 'file' | 'manual'

interface ExtractedData {
  title: string
  description: string
  contentHtml: string
  rawText: string
  suggestedSlug: string
  sourceUrl?: string
  sourceDomain?: string
  originalFilename?: string
  storagePath?: string
  mimeType?: string
  documentSourceType: 'url' | 'pdf' | 'docx' | 'txt' | 'markdown' | 'html' | 'manual'
  pageCount?: number
  requiresOcr?: boolean
}

interface FormData {
  title: string
  subtitle: string
  slug: string
  description: string
  summary: string
  contentHtml: string
  rawText: string
  keywords: string
  categoryId: string
  organization: string
  documentNumber: string
  documentDate: string
  status: 'draft' | 'published'
  visibility: 'public' | 'private'
}

const STEP_LABELS = [
  'Origem',
  'Importação',
  'Conteúdo',
  'Metadados',
  'URL',
  'Pré-visualização',
  'Publicação',
]

export default function NovoDocumentoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [sourceType, setSourceType] = useState<SourceType>('manual')
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedData | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [fileInput, setFileInput] = useState<File | null>(null)

  const [form, setForm] = useState<FormData>({
    title: '',
    subtitle: '',
    slug: '',
    description: '',
    summary: '',
    contentHtml: '',
    rawText: '',
    keywords: '',
    categoryId: '',
    organization: '',
    documentNumber: '',
    documentDate: '',
    status: 'draft',
    visibility: 'public',
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  // Carregar categorias
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []))
      .catch(() => {})
  }, [])

  // Auto-gerar slug quando título muda
  useEffect(() => {
    if (form.title && !form.slug) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.title) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title])

  const updateForm = (updates: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  // Preencher form com dados extraídos
  const populateFromExtracted = (data: ExtractedData) => {
    setForm((prev) => ({
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      contentHtml: data.contentHtml,
      rawText: data.rawText,
      slug: data.suggestedSlug || generateSlug(data.title),
    }))
    setExtracted(data)
  }

  // ── STEP 2: Importar conteúdo ────────────────────────────────
  const handleImportUrl = async () => {
    if (!urlInput.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/import/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      populateFromExtracted({
        ...data.data,
        documentSourceType: 'url',
        sourceUrl: data.data.finalUrl || urlInput,
        sourceDomain: data.data.domain,
        suggestedSlug: data.data.suggestedSlug,
      })
      setStep(3)
    } catch (err) {
      toast('error', 'Erro ao importar URL', err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleImportFile = async () => {
    if (!fileInput) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', fileInput)
    try {
      const res = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (data.data.requiresOcr) {
        toast('warning', 'OCR necessário', 'Este PDF não possui texto extraível. Por favor, insira o conteúdo manualmente.')
      }

      populateFromExtracted({
        ...data.data,
        documentSourceType: data.data.sourceType,
        suggestedSlug: data.data.suggestedSlug,
      })
      setStep(3)
    } catch (err) {
      toast('error', 'Erro ao processar arquivo', err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 7: Publicar ─────────────────────────────────────────
  const handlePublish = async (status: 'draft' | 'published') => {
    setLoading(true)
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle || undefined,
          slug: form.slug,
          description: form.description || undefined,
          summary: form.summary || undefined,
          sourceType: extracted?.documentSourceType || 'manual',
          sourceUrl: extracted?.sourceUrl || undefined,
          sourceDomain: extracted?.sourceDomain || undefined,
          originalFilename: extracted?.originalFilename || undefined,
          storagePath: extracted?.storagePath || undefined,
          mimeType: extracted?.mimeType || undefined,
          rawText: form.rawText,
          contentHtml: form.contentHtml,
          keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()).filter(Boolean) : [],
          categoryId: form.categoryId || undefined,
          organization: form.organization || undefined,
          documentNumber: form.documentNumber || undefined,
          documentDate: form.documentDate || undefined,
          status,
          visibility: form.visibility,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast('success', status === 'published' ? 'Documento publicado!' : 'Rascunho salvo!')
      router.push('/admin/documentos')
    } catch (err) {
      toast('error', 'Erro ao salvar', err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const canAdvanceToStep3 = extracted !== null || sourceType === 'manual'
  const canAdvanceToStep4 = form.contentHtml.length > 20 || form.rawText.length > 20
  const canAdvanceToStep5 = form.title.length >= 3
  const canAdvanceToStep6 = form.slug.length > 0
  const canPublish = form.slug.length > 0 && form.title.length >= 3

  // ── Render Step Content ──────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Qual é a origem do conteúdo?</h2>
            <p className="text-surface-500">Escolha como você deseja adicionar o documento.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { type: 'url' as const, icon: Globe, title: 'Importar de URL', desc: 'Importar conteúdo de uma página da internet' },
                { type: 'file' as const, icon: Upload, title: 'Enviar arquivo', desc: 'PDF, DOCX, TXT, Markdown ou HTML' },
                { type: 'manual' as const, icon: PenLine, title: 'Escrever manualmente', desc: 'Criar conteúdo do zero no editor' },
              ].map(({ type, icon: Icon, title, desc }) => (
                <button
                  key={type}
                  onClick={() => { setSourceType(type); if (type === 'manual') setStep(3) }}
                  className={`card p-6 text-left hover:shadow-md transition-all group ${ sourceType === type && step > 1 ? 'ring-2 ring-brand-500' : '' }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950/40 flex items-center justify-center mb-4 group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
                    <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-surface-800 dark:text-surface-200 mb-1">{title}</h3>
                  <p className="text-sm text-surface-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">
              {sourceType === 'url' ? 'Importar de URL' : 'Enviar arquivo'}
            </h2>

            {sourceType === 'url' ? (
              <div className="space-y-4">
                <div>
                  <label className="input-label">URL do conteúdo original</label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="input-field"
                    placeholder="https://exemplo.gov.br/legislacao/documento/123/?versao=consolidada"
                  />
                  <p className="text-xs text-surface-500 mt-1.5">
                    A URL original pode ser longa ou com parâmetros. O sistema gerará uma URL curta /{'{slug}'} para uso como fonte de IA.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    ℹ️ O sistema acessará a URL no servidor, extrairá o conteúdo principal e armazenará uma cópia. A URL externa nunca será a URL pública do documento.
                  </p>
                </div>
                <button
                  onClick={handleImportUrl}
                  disabled={loading || !urlInput.trim()}
                  className="btn-primary"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
                  ) : (
                    <><Globe className="w-4 h-4" /> Importar conteúdo</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="input-label">Arquivo</label>
                  <div
                    className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const file = e.dataTransfer.files[0]
                      if (file) setFileInput(file)
                    }}
                  >
                    <Upload className="w-10 h-10 text-surface-400 mx-auto mb-3" />
                    {fileInput ? (
                      <p className="font-medium text-surface-700 dark:text-surface-200">{fileInput.name}</p>
                    ) : (
                      <p className="text-surface-500">Clique ou arraste o arquivo aqui</p>
                    )}
                    <p className="text-xs text-surface-400 mt-1">PDF, DOCX, TXT, Markdown ou HTML (máx. 10MB)</p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.md,.markdown,.html,.htm"
                      onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleImportFile}
                  disabled={loading || !fileInput}
                  className="btn-primary"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Processar arquivo</>
                  )}
                </button>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Revisar conteúdo</h2>
              {extracted?.requiresOcr && (
                <div className="badge badge-warning">
                  <AlertCircle className="w-3 h-3" /> OCR necessário
                </div>
              )}
            </div>

            {extracted?.requiresOcr ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                  ⚠️ Este PDF não possui texto extraível (pode ser digitalizado). Por favor, insira o conteúdo manualmente abaixo.
                </p>
              </div>
            ) : (
              extracted && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    ✅ Conteúdo extraído com sucesso. Revise e edite conforme necessário antes de continuar.
                  </p>
                </div>
              )
            )}

            <div className="space-y-4">
              <div>
                <label className="input-label">Título extraído</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="input-field"
                  placeholder="Título do documento"
                />
              </div>
              <div>
                <label className="input-label">Conteúdo (HTML)</label>
                <textarea
                  value={form.contentHtml}
                  onChange={(e) => updateForm({ contentHtml: e.target.value, rawText: e.target.value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() })}
                  className="input-field font-mono text-xs"
                  rows={15}
                  placeholder="Conteúdo HTML do documento..."
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Metadados do documento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => { updateForm({ title: e.target.value }); if (!form.slug) updateForm({ slug: generateSlug(e.target.value) }) }}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="input-label">Subtítulo</label>
                <input type="text" value={form.subtitle} onChange={(e) => updateForm({ subtitle: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Categoria</label>
                <select value={form.categoryId} onChange={(e) => updateForm({ categoryId: e.target.value })} className="input-field">
                  <option value="">Sem categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Órgão / Organização</label>
                <input type="text" value={form.organization} onChange={(e) => updateForm({ organization: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="input-label">Número do documento</label>
                <input type="text" value={form.documentNumber} onChange={(e) => updateForm({ documentNumber: e.target.value })} className="input-field" placeholder="Ex: Lei nº 123/2024" />
              </div>
              <div>
                <label className="input-label">Data do documento</label>
                <input type="date" value={form.documentDate} onChange={(e) => updateForm({ documentDate: e.target.value })} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Descrição</label>
                <textarea value={form.description} onChange={(e) => updateForm({ description: e.target.value })} className="input-field" rows={2} placeholder="Breve descrição para SEO e exibição" />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Resumo</label>
                <textarea value={form.summary} onChange={(e) => updateForm({ summary: e.target.value })} className="input-field" rows={3} placeholder="Resumo do conteúdo para exibição na página" />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Palavras-chave (separadas por vírgula)</label>
                <input type="text" value={form.keywords} onChange={(e) => updateForm({ keywords: e.target.value })} className="input-field" placeholder="legislação, regulamento, norma" />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Definir URL pública</h2>
            <p className="text-surface-500">
              A URL pública final será <code className="text-brand-600 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded text-sm">dominio.com/{'{slug}'}</code>. Esta URL deve ter apenas um segmento e será usada como fonte de IA.
            </p>
            <div>
              <label className="input-label">Slug da URL *</label>
              <SlugInput
                value={form.slug}
                onChange={(v) => updateForm({ slug: v })}
                appUrl={appUrl}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Visibilidade</label>
                <select value={form.visibility} onChange={(e) => updateForm({ visibility: e.target.value as 'public' | 'private' })} className="input-field">
                  <option value="public">Público</option>
                  <option value="private">Privado</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Pré-visualização</h2>
            <p className="text-surface-500">Esta é a aparência da página pública do documento.</p>
            <div className="card p-6 max-h-96 overflow-y-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge bg-brand-50 text-brand-700">
                  {categories.find((c) => c.id === form.categoryId)?.name || 'Sem categoria'}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{form.title || 'Título do documento'}</h1>
              {form.subtitle && <p className="text-lg text-surface-500 mb-3">{form.subtitle}</p>}
              {form.description && <p className="text-surface-600 mb-4">{form.description}</p>}
              {form.summary && (
                <div className="p-3 border-l-4 border-brand-400 bg-brand-50 dark:bg-brand-950/20 rounded-r mb-4">
                  <p className="text-sm">{form.summary}</p>
                </div>
              )}
              <div className="prose-content" dangerouslySetInnerHTML={{ __html: form.contentHtml || '<p>Conteúdo do documento aparecerá aqui.</p>' }} />
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 space-y-2">
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">Verificação de URL</p>
              {[
                { label: 'URL final', value: `${appUrl || 'https://dominio.com'}/${form.slug}`, ok: true },
                { label: 'Número de segmentos', value: '1 segmento', ok: true },
                { label: 'Sem parâmetros de consulta', value: 'Nenhum', ok: true },
                { label: 'Compatível com fontes de IA', value: form.slug ? '✅ Sim' : '❌ Slug inválido', ok: !!form.slug },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-surface-500">{label}</span>
                  <span className={ok ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-600'}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Publicar documento</h2>

            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">Pronto para publicar!</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Título:</strong> {form.title}</p>
                <p><strong>URL pública:</strong> <code className="text-brand-600 bg-surface-100 px-1.5 py-0.5 rounded">/{form.slug}</code></p>
                <p><strong>Segmentos na URL:</strong> 1 (✅ compatível com fontes de IA)</p>
                <p><strong>Parâmetros de consulta:</strong> Nenhum (✅)</p>
                <p><strong>Visibilidade:</strong> {form.visibility === 'public' ? 'Público' : 'Privado'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handlePublish('draft')}
                disabled={loading}
                className="btn-secondary w-full justify-center py-3"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Salvar como rascunho
              </button>
              <button
                onClick={() => handlePublish('published')}
                disabled={loading || !canPublish}
                className="btn-primary w-full justify-center py-3"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Publicar agora
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getNextEnabled = () => {
    switch (step) {
      case 1: return sourceType !== 'url' && sourceType !== 'file' // URL e file avançam por importação
      case 2: return false // Avança via botão de importação
      case 3: return canAdvanceToStep4
      case 4: return canAdvanceToStep5
      case 5: return canAdvanceToStep6
      case 6: return true
      default: return false
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Novo documento</h1>
        <p className="text-surface-500 mt-1">Cadastre um novo item na base de conhecimento</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STEP_LABELS.map((label, i) => {
            const stepNum = (i + 1) as Step
            const isActive = stepNum === step
            const isDone = stepNum < step
            return (
              <div key={label} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${ isActive ? 'bg-brand-600 text-white' : isDone ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-400' }`}>
                  {isDone && <Check className="w-3 h-3" />}
                  <span>{stepNum}. {label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-4 h-0.5 flex-shrink-0 ${ isDone ? 'bg-emerald-300' : 'bg-surface-200 dark:bg-surface-700' }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="card p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      {step !== 7 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
            disabled={step === 1}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>

          {step !== 2 && (
            <button
              onClick={() => setStep((prev) => Math.min(7, prev + 1) as Step)}
              disabled={!getNextEnabled()}
              className="btn-primary"
            >
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
