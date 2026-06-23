-- ============================================================
-- Central de Conhecimento para IA
-- Migration 001: Criação das tabelas principais
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca full-text

-- ============================================================
-- 1. Configurações do Sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_name TEXT NOT NULL DEFAULT 'Central de Conhecimento para IA',
    description TEXT DEFAULT 'Conteúdos confiáveis, organizados e acessíveis para pessoas e agentes de inteligência artificial.',
    logo_url TEXT,
    organization TEXT NOT NULL DEFAULT 'Organização',
    official_domain TEXT NOT NULL DEFAULT 'http://localhost:3000',
    legal_disclaimer TEXT DEFAULT 'Este conteúdo é uma reprodução organizada para consulta. Em caso de divergência, prevalece a publicação disponibilizada pela fonte oficial.',
    max_file_size_bytes BIGINT NOT NULL DEFAULT 10485760,
    allowed_extensions TEXT[] NOT NULL DEFAULT ARRAY['pdf', 'docx', 'txt', 'md', 'html'],
    reserved_slugs TEXT[] NOT NULL DEFAULT ARRAY[
        'admin', 'login', 'api', 'sitemap.xml', 'robots.txt', 'llms.txt',
        'manifest.webmanifest', 'favicon.ico', 'opengraph-image', 'icon',
        'entrar', 'sair', '404', '500', '_next', '_vercel'
    ],
    indexing_settings JSONB DEFAULT '{"index_globally": true, "allow_robots": true}'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. Categorias
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT DEFAULT '📄',
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. Itens de Conhecimento
-- ============================================================
CREATE TABLE IF NOT EXISTS public.knowledge_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    summary TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('url', 'pdf', 'docx', 'txt', 'markdown', 'html', 'manual')),
    source_url TEXT,
    source_domain TEXT,
    original_filename TEXT,
    storage_path TEXT,
    mime_type TEXT,
    raw_text TEXT NOT NULL DEFAULT '',
    content_html TEXT NOT NULL DEFAULT '',
    content_markdown TEXT,
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    organization TEXT,
    document_number TEXT,
    document_date DATE,
    official_publication_date DATE,
    source_updated_at TIMESTAMPTZ,
    last_checked_at TIMESTAMPTZ,
    content_hash TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    review_status TEXT NOT NULL DEFAULT 'not_reviewed' CHECK (
        review_status IN ('not_reviewed', 'reviewed', 'update_available', 'extraction_failed', 'ocr_required')
    ),
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    -- Constraint: slug deve seguir formato válido
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_knowledge_items_slug ON public.knowledge_items(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_status ON public.knowledge_items(status, visibility);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_category ON public.knowledge_items(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_created_at ON public.knowledge_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_published_at ON public.knowledge_items(published_at DESC);

-- Índice de busca full-text
CREATE INDEX IF NOT EXISTS idx_knowledge_items_fts ON public.knowledge_items
    USING GIN(to_tsvector('portuguese', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(raw_text, '')));

-- ============================================================
-- 4. Versões de Conteúdo
-- ============================================================
CREATE TABLE IF NOT EXISTS public.knowledge_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.knowledge_items(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    raw_text TEXT NOT NULL,
    content_html TEXT NOT NULL,
    content_markdown TEXT,
    summary TEXT,
    content_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    change_reason TEXT,
    update_source TEXT NOT NULL DEFAULT 'manual' CHECK (
        update_source IN ('manual', 'url_auto_check', 'file_reupload')
    ),
    UNIQUE(item_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_knowledge_versions_item ON public.knowledge_versions(item_id, version_number DESC);

-- ============================================================
-- 5. Verificações de Fonte
-- ============================================================
CREATE TABLE IF NOT EXISTS public.source_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.knowledge_items(id) ON DELETE CASCADE,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    http_status INTEGER,
    content_hash TEXT,
    has_changed BOOLEAN NOT NULL DEFAULT FALSE,
    error_message TEXT,
    duration_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_source_checks_item ON public.source_checks(item_id, checked_at DESC);

-- ============================================================
-- 6. Perfis de Usuário
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin', 'visitor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. Triggers para updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_knowledge_items_updated_at
    BEFORE UPDATE ON public.knowledge_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'visitor'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. Row Level Security (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper: verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── Settings ──────────────────────────────────────────────────
CREATE POLICY "settings_public_read" ON public.settings
    FOR SELECT USING (TRUE);

CREATE POLICY "settings_admin_write" ON public.settings
    FOR ALL USING (public.is_admin());

-- ── Categories ────────────────────────────────────────────────
CREATE POLICY "categories_public_read" ON public.categories
    FOR SELECT USING (status = 'active');

CREATE POLICY "categories_admin_all" ON public.categories
    FOR ALL USING (public.is_admin());

-- ── Knowledge Items ───────────────────────────────────────────
-- Visitantes: apenas itens publicados e públicos
CREATE POLICY "knowledge_items_public_read" ON public.knowledge_items
    FOR SELECT USING (status = 'published' AND visibility = 'public');

-- Administradores: acesso irrestrito
CREATE POLICY "knowledge_items_admin_all" ON public.knowledge_items
    FOR ALL USING (public.is_admin());

-- ── Knowledge Versions ────────────────────────────────────────
CREATE POLICY "knowledge_versions_admin_all" ON public.knowledge_versions
    FOR ALL USING (public.is_admin());

-- Leitura pública limitada de versões (somente de itens públicos)
CREATE POLICY "knowledge_versions_public_read" ON public.knowledge_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.knowledge_items ki
            WHERE ki.id = item_id
              AND ki.status = 'published'
              AND ki.visibility = 'public'
        )
    );

-- ── Source Checks ─────────────────────────────────────────────
CREATE POLICY "source_checks_admin_all" ON public.source_checks
    FOR ALL USING (public.is_admin());

-- ── Profiles ──────────────────────────────────────────────────
-- Usuário pode ver/editar seu próprio perfil
CREATE POLICY "profiles_own_read" ON public.profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_own_update" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

-- Admins podem ver todos os perfis
CREATE POLICY "profiles_admin_all" ON public.profiles
    FOR ALL USING (public.is_admin());
