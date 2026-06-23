/**
 * Proteção contra SSRF (Server-Side Request Forgery).
 *
 * Valida URLs antes de fazer requisições do servidor para garantir
 * que não estamos acessando endereços internos ou privados.
 */

import { z } from 'zod'

// Faixas de IP privado (RFC 1918) e especiais
const PRIVATE_IP_RANGES = [
  // Loopback
  /^127\./,
  /^::1$/,
  /^0\.0\.0\.0$/,
  // RFC 1918 - Endereços Privados
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  // Link-local
  /^169\.254\./,
  /^fe80:/i,
  // Multicast
  /^224\./,
  /^ff[0-9a-f]{2}:/i,
  // IPv6 local
  /^fc00:/i,
  /^fd[0-9a-f]{2}:/i,
  // Metadata services (AWS, GCP, Azure)
  /^100\.64\./,
  /^100\.65\./,
  /^100\.66\./,
  /^100\.67\./,
  /^100\.68\./,
  /^100\.69\./,
  /^100\.70\./,
  /^100\.71\./,
  /^100\.72\./,
  /^100\.73\./,
  /^100\.74\./,
  /^100\.75\./,
  /^100\.76\./,
  /^100\.77\./,
  /^100\.78\./,
  /^100\.79\./,
  /^100\.80\./,
]

const BLOCKED_HOSTNAMES = [
  'localhost',
  'metadata.google.internal',
  '169.254.169.254', // AWS/GCP metadata
  '100.100.100.200', // Alibaba Cloud metadata
]

export interface SSRFCheckResult {
  safe: boolean
  error?: string
}

/**
 * Valida uma URL contra as regras de segurança SSRF.
 *
 * Verificações realizadas:
 * - Protocolo deve ser http ou https
 * - Sem credenciais na URL
 * - Hostname não pode ser localhost ou variantes
 * - Hostname não pode resolver para IP privado (verificação estática)
 */
export function validateUrlForImport(urlString: string): SSRFCheckResult {
  let parsed: URL

  try {
    parsed = new URL(urlString)
  } catch {
    return { safe: false, error: 'URL inválida ou malformada.' }
  }

  // Apenas protocolos HTTP e HTTPS
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return {
      safe: false,
      error: `Protocolo "${parsed.protocol}" não permitido. Use apenas http: ou https:.`,
    }
  }

  // Sem credenciais na URL
  if (parsed.username || parsed.password) {
    return {
      safe: false,
      error: 'URLs com credenciais incorporadas não são permitidas.',
    }
  }

  const hostname = parsed.hostname.toLowerCase()

  // Bloqueio de hostnames proibidos
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return {
      safe: false,
      error: `O hostname "${hostname}" não é permitido.`,
    }
  }

  // Bloqueio de variantes de localhost
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return { safe: false, error: 'Acesso a localhost não é permitido.' }
  }

  // Verificação estática de IPs privados (quando o hostname é um IP)
  const ipMatch = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipMatch) {
    for (const range of PRIVATE_IP_RANGES) {
      if (range.test(hostname)) {
        return {
          safe: false,
          error: `Acesso ao endereço IP "${hostname}" não é permitido (endereço privado ou reservado).`,
        }
      }
    }
  }

  // Verificação de IPv6 privado
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    const ipv6 = hostname.slice(1, -1)
    if (ipv6 === '::1' || ipv6.toLowerCase().startsWith('fe80:') || ipv6.toLowerCase().startsWith('fc00:') || ipv6.toLowerCase().startsWith('fd')) {
      return {
        safe: false,
        error: `Acesso ao endereço IPv6 "${ipv6}" não é permitido.`,
      }
    }
  }

  return { safe: true }
}

// Schema de validação Zod para URLs de importação
export const ImportUrlSchema = z.object({
  url: z
    .string()
    .min(1, 'URL é obrigatória')
    .url('URL inválida')
    .refine(
      (url) => validateUrlForImport(url).safe,
      (url) => ({ message: validateUrlForImport(url).error || 'URL não permitida' })
    ),
})

export type ImportUrlInput = z.infer<typeof ImportUrlSchema>
