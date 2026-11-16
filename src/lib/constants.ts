export const BRAND = {
  name: 'Flora MOC',
  tagline: 'Um mapa vivo das plantas de Montes Claros',
}

/** `asset`: ícone fatiado em /assets/branding (grass e other ainda não têm arte; usam ícone de fallback). */
export const CATEGORIES = [
  { value: 'tree', label: 'Árvore', glyph: 'Á', color: '#183B32', asset: 'cat-tree' },
  { value: 'shrub', label: 'Arbusto', glyph: 'A', color: '#4F7A4A', asset: 'cat-shrub' },
  { value: 'flower', label: 'Flor / planta com flor', glyph: 'F', color: '#B4568A', asset: 'cat-flower' },
  { value: 'palm', label: 'Palmeira', glyph: 'P', color: '#2F7F86', asset: 'cat-palm' },
  { value: 'grass', label: 'Capim / gramínea', glyph: 'C', color: '#8A8F2E', asset: null },
  { value: 'succulent', label: 'Suculenta / cacto', glyph: 'S', color: '#B8742F', asset: 'cat-succulent' },
  { value: 'herb', label: 'Erva / herbácea', glyph: 'E', color: '#5E6FA8', asset: 'cat-herb' },
  { value: 'other', label: 'Outra planta', glyph: 'O', color: '#6B6F6B', asset: null },
] as const

export type Category = (typeof CATEGORIES)[number]['value']
export type IdentificationLevel = 'identified' | 'probable' | 'unknown'
export type OccurrenceType = 'individual' | 'group'
export type QuantityEstimate = 'one' | 'few' | 'many' | 'unknown'
export type LocationPrecision = 'exact' | 'approximate'
export type PlantStatus = 'pending' | 'approved' | 'rejected' | 'archived'
export type ReportReason = 'wrong_id' | 'wrong_location' | 'inappropriate' | 'private_location' | 'other'

export const IDENT_LEVELS: { value: IdentificationLevel; label: string }[] = [
  { value: 'identified', label: 'Identificada pelo colaborador' },
  { value: 'probable', label: 'Identificação provável' },
  { value: 'unknown', label: 'Ainda não identificada' },
]
/** Rótulos curtos para selos de grau de certeza. */
export const CERTAINTY_SHORT: Record<IdentificationLevel, string> = {
  identified: 'Identificada',
  probable: 'Provável',
  unknown: 'Desconhecida',
}
export const OCCURRENCE_TYPES: { value: OccurrenceType; label: string }[] = [
  { value: 'individual', label: 'Indivíduo' },
  { value: 'group', label: 'Grupo' },
]
export const QUANTITIES: { value: QuantityEstimate; label: string }[] = [
  { value: 'unknown', label: 'Não informada' },
  { value: 'one', label: 'Uma' },
  { value: 'few', label: 'Poucas' },
  { value: 'many', label: 'Muitas' },
]
export const PRECISIONS: { value: LocationPrecision; label: string }[] = [
  { value: 'exact', label: 'Ponto exato' },
  { value: 'approximate', label: 'Ponto aproximado' },
]
export const STATUS_LABELS: Record<PlantStatus, string> = {
  pending: 'Em análise',
  approved: 'Aprovada',
  rejected: 'Não aprovada',
  archived: 'Arquivada',
}
export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'wrong_id', label: 'Identificação possivelmente incorreta' },
  { value: 'wrong_location', label: 'Ponto em local errado' },
  { value: 'inappropriate', label: 'Foto ou descrição inadequada' },
  { value: 'private_location', label: 'Localização privada ou restrita' },
  { value: 'other', label: 'Outro' },
]

export const UNIDENTIFIED_NAME = 'Planta não identificada'

export function labelOf<T extends { value: string; label: string }>(list: readonly T[], value: string): string {
  return list.find((i) => i.value === value)?.label ?? value
}
export function categoryMeta(value: string) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1]
}
/** Somente registros aprovados podem ser exibidos publicamente. */
export function isPubliclyVisible(status: string): boolean {
  return status === 'approved'
}
