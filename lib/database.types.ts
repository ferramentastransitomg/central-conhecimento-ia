export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      settings: {
        Row: {
          id: string
          platform_name: string
          description: string | null
          logo_url: string | null
          organization: string
          official_domain: string
          legal_disclaimer: string | null
          max_file_size_bytes: number
          allowed_extensions: string[]
          reserved_slugs: string[]
          indexing_settings: Json
          updated_at: string
        }
        Insert: {
          id?: string
          platform_name?: string
          description?: string | null
          logo_url?: string | null
          organization?: string
          official_domain?: string
          legal_disclaimer?: string | null
          max_file_size_bytes?: number
          allowed_extensions?: string[]
          reserved_slugs?: string[]
          indexing_settings?: Json
          updated_at?: string
        }
        Update: {
          platform_name?: string
          description?: string | null
          logo_url?: string | null
          organization?: string
          official_domain?: string
          legal_disclaimer?: string | null
          max_file_size_bytes?: number
          allowed_extensions?: string[]
          reserved_slugs?: string[]
          indexing_settings?: Json
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          status?: 'active' | 'inactive'
        }
      }
      knowledge_items: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          slug: string
          description: string | null
          summary: string | null
          source_type: 'url' | 'pdf' | 'docx' | 'txt' | 'markdown' | 'html' | 'manual'
          source_url: string | null
          source_domain: string | null
          original_filename: string | null
          storage_path: string | null
          mime_type: string | null
          raw_text: string
          content_html: string
          content_markdown: string | null
          keywords: string[]
          category_id: string | null
          organization: string | null
          document_number: string | null
          document_date: string | null
          official_publication_date: string | null
          source_updated_at: string | null
          last_checked_at: string | null
          content_hash: string
          status: 'draft' | 'pending_review' | 'published' | 'archived'
          visibility: 'public' | 'private'
          review_status: 'not_reviewed' | 'reviewed' | 'update_available' | 'extraction_failed' | 'ocr_required'
          published_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          slug: string
          description?: string | null
          summary?: string | null
          source_type: 'url' | 'pdf' | 'docx' | 'txt' | 'markdown' | 'html' | 'manual'
          source_url?: string | null
          source_domain?: string | null
          original_filename?: string | null
          storage_path?: string | null
          mime_type?: string | null
          raw_text: string
          content_html: string
          content_markdown?: string | null
          keywords?: string[]
          category_id?: string | null
          organization?: string | null
          document_number?: string | null
          document_date?: string | null
          official_publication_date?: string | null
          source_updated_at?: string | null
          last_checked_at?: string | null
          content_hash: string
          status?: 'draft' | 'pending_review' | 'published' | 'archived'
          visibility?: 'public' | 'private'
          review_status?: 'not_reviewed' | 'reviewed' | 'update_available' | 'extraction_failed' | 'ocr_required'
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Update: {
          title?: string
          subtitle?: string | null
          slug?: string
          description?: string | null
          summary?: string | null
          source_type?: 'url' | 'pdf' | 'docx' | 'txt' | 'markdown' | 'html' | 'manual'
          source_url?: string | null
          source_domain?: string | null
          original_filename?: string | null
          storage_path?: string | null
          mime_type?: string | null
          raw_text?: string
          content_html?: string
          content_markdown?: string | null
          keywords?: string[]
          category_id?: string | null
          organization?: string | null
          document_number?: string | null
          document_date?: string | null
          official_publication_date?: string | null
          source_updated_at?: string | null
          last_checked_at?: string | null
          content_hash?: string
          status?: 'draft' | 'pending_review' | 'published' | 'archived'
          visibility?: 'public' | 'private'
          review_status?: 'not_reviewed' | 'reviewed' | 'update_available' | 'extraction_failed' | 'ocr_required'
          published_at?: string | null
          updated_at?: string
          archived_at?: string | null
        }
      }
      knowledge_versions: {
        Row: {
          id: string
          item_id: string
          version_number: number
          raw_text: string
          content_html: string
          content_markdown: string | null
          summary: string | null
          content_hash: string
          created_at: string
          created_by: string | null
          change_reason: string | null
          update_source: 'manual' | 'url_auto_check' | 'file_reupload'
        }
        Insert: {
          id?: string
          item_id: string
          version_number: number
          raw_text: string
          content_html: string
          content_markdown?: string | null
          summary?: string | null
          content_hash: string
          created_at?: string
          created_by?: string | null
          change_reason?: string | null
          update_source: 'manual' | 'url_auto_check' | 'file_reupload'
        }
        Update: {
          summary?: string | null
          change_reason?: string | null
        }
      }
      source_checks: {
        Row: {
          id: string
          item_id: string
          checked_at: string
          http_status: number | null
          content_hash: string | null
          has_changed: boolean
          error_message: string | null
          duration_ms: number | null
        }
        Insert: {
          id?: string
          item_id: string
          checked_at?: string
          http_status?: number | null
          content_hash?: string | null
          has_changed?: boolean
          error_message?: string | null
          duration_ms?: number | null
        }
        Update: {
          http_status?: number | null
          content_hash?: string | null
          has_changed?: boolean
          error_message?: string | null
          duration_ms?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'admin' | 'visitor'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'admin' | 'visitor'
          created_at?: string
        }
        Update: {
          full_name?: string | null
          role?: 'admin' | 'visitor'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos derivados convenientes
export type KnowledgeItem = Database['public']['Tables']['knowledge_items']['Row']
export type KnowledgeItemInsert = Database['public']['Tables']['knowledge_items']['Insert']
export type KnowledgeItemUpdate = Database['public']['Tables']['knowledge_items']['Update']
export type Category = Database['public']['Tables']['categories']['Row']
export type KnowledgeVersion = Database['public']['Tables']['knowledge_versions']['Row']
export type SourceCheck = Database['public']['Tables']['source_checks']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Settings = Database['public']['Tables']['settings']['Row']

export type SourceType = KnowledgeItem['source_type']
export type ItemStatus = KnowledgeItem['status']
export type Visibility = KnowledgeItem['visibility']
export type ReviewStatus = KnowledgeItem['review_status']
