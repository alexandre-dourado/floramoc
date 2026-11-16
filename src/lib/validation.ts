import { z } from 'zod'
import { UNIDENTIFIED_NAME } from './constants'

export function parseCoordinate(value: unknown): number | null {
  if (typeof value === 'string' && value.trim() === '') return null
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}
export const isValidLatitude = (n: unknown): n is number => typeof n === 'number' && n >= -90 && n <= 90
export const isValidLongitude = (n: unknown): n is number => typeof n === 'number' && n >= -180 && n <= 180

export const plantFormSchema = z
  .object({
    unknown: z.boolean(),
    common_name: z.string().trim().max(100, 'Use até 100 caracteres no nome popular.'),
    scientific_name: z.string().trim().max(150, 'Use até 150 caracteres no nome científico.'),
    category: z.enum(['tree', 'shrub', 'flower', 'palm', 'grass', 'succulent', 'herb', 'other'], 'Escolha uma categoria.'),
    identification_level: z.enum(['identified', 'probable', 'unknown']),
    occurrence_type: z.enum(['individual', 'group']),
    quantity_estimate: z.enum(['one', 'few', 'many', 'unknown']),
    location_precision: z.enum(['exact', 'approximate']),
    description: z.string().trim().max(500, 'A observação pode ter até 500 caracteres.'),
    latitude: z.number('Marque a localização no mapa.').min(-90, 'Latitude inválida.').max(90, 'Latitude inválida.'),
    longitude: z.number('Marque a localização no mapa.').min(-180, 'Longitude inválida.').max(180, 'Longitude inválida.'),
    acknowledged: z.boolean().refine((v) => v === true, 'Confirme a declaração de responsabilidade.'),
  })
  .superRefine((v, ctx) => {
    if (!v.unknown && v.common_name.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['common_name'], message: 'Informe o nome popular ou marque “Não sei identificar”.' })
    }
  })

export type PlantFormValues = z.infer<typeof plantFormSchema>

/** Normaliza o formulário para o formato do banco. Planta não identificada => nome padrão e nível `unknown`. */
export function toPlantPayload(v: PlantFormValues) {
  return {
    common_name: v.unknown ? UNIDENTIFIED_NAME : v.common_name,
    scientific_name: v.unknown ? null : v.scientific_name || null,
    category: v.category,
    identification_level: v.unknown ? ('unknown' as const) : v.identification_level,
    occurrence_type: v.occurrence_type,
    quantity_estimate: v.quantity_estimate,
    location_precision: v.location_precision,
    description: v.description || null,
    latitude: v.latitude,
    longitude: v.longitude,
  }
}

export function sanitizeSearch(q: string): string {
  return q.replace(/[,()%*\\"']/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60)
}
