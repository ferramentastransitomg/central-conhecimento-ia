import { createHash } from 'crypto'

/**
 * Calcula o hash SHA-256 de um texto.
 * Usado para detectar alterações no conteúdo de fontes externas.
 */
export function hashContent(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

/**
 * Verifica se um conteúdo mudou comparando hashes.
 */
export function hasContentChanged(
  newContent: string,
  savedHash: string
): boolean {
  return hashContent(newContent) !== savedHash
}
