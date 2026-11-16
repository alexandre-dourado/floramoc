import { describe, expect, it } from 'vitest'
import { isValidLatitude, isValidLongitude, parseCoordinate, plantFormSchema, sanitizeSearch, toPlantPayload } from './validation'
import { UNIDENTIFIED_NAME, isPubliclyVisible } from './constants'

const base = {
  unknown: false, common_name: 'Ipê-amarelo', scientific_name: 'Handroanthus albus', category: 'tree', identification_level: 'probable',
  occurrence_type: 'individual', quantity_estimate: 'one', location_precision: 'exact', description: '', latitude: -16.72, longitude: -43.86, acknowledged: true,
}

describe('plantFormSchema', () => {
  it('aceita um registro válido', () => expect(plantFormSchema.safeParse(base).success).toBe(true))
  it('exige nome popular quando identificada', () => expect(plantFormSchema.safeParse({ ...base, common_name: '' }).success).toBe(false))
  it('exige a declaração de responsabilidade', () => expect(plantFormSchema.safeParse({ ...base, acknowledged: false }).success).toBe(false))
  it('limita a observação a 500 caracteres', () => expect(plantFormSchema.safeParse({ ...base, description: 'x'.repeat(501) }).success).toBe(false))
  it('rejeita coordenadas fora do intervalo', () => {
    expect(plantFormSchema.safeParse({ ...base, latitude: 91 }).success).toBe(false)
    expect(plantFormSchema.safeParse({ ...base, longitude: -181 }).success).toBe(false)
  })
})

describe('planta não identificada', () => {
  it('usa nome padrão, nível unknown e ignora nome científico', () => {
    const parsed = plantFormSchema.parse({ ...base, unknown: true, common_name: '', scientific_name: 'Inventada sp.' })
    const p = toPlantPayload(parsed)
    expect(p.common_name).toBe(UNIDENTIFIED_NAME)
    expect(p.identification_level).toBe('unknown')
    expect(p.scientific_name).toBeNull()
  })
})

describe('coordenadas e busca', () => {
  it('converte e valida', () => {
    expect(parseCoordinate('-16,7280556')).toBeCloseTo(-16.7280556)
    expect(parseCoordinate('')).toBeNull()
    expect(parseCoordinate('abc')).toBeNull()
    expect(isValidLatitude(-90)).toBe(true)
    expect(isValidLatitude(90.1)).toBe(false)
    expect(isValidLongitude(180)).toBe(true)
    expect(isValidLongitude(NaN)).toBe(false)
  })
  it('remove caracteres que quebrariam o filtro da API', () => expect(sanitizeSearch('ipê,(amarelo)%')).toBe('ipê amarelo'))
})

describe('visibilidade por status', () => {
  it('só aprovados são públicos', () => {
    expect(isPubliclyVisible('approved')).toBe(true)
    for (const s of ['pending', 'rejected', 'archived']) expect(isPubliclyVisible(s)).toBe(false)
  })
})
