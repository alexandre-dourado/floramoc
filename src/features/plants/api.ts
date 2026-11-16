import { supabase } from '../../lib/supabase'
import { sanitizeSearch } from '../../lib/validation'
import type { Category } from '../../lib/constants'
import type { Bounds, PublicPlant } from '../../types'

export const PUBLIC_LIMIT = 1000
const COLS =
  'id,common_name,scientific_name,category,identification_level,occurrence_type,quantity_estimate,latitude,longitude,location_precision,photo_path,description,created_at,updated_at'

export async function fetchPublicPlants(opts: { bounds: Bounds; query: string; category: Category | '' }) {
  const { bounds: b, query, category } = opts
  let q = supabase
    .from('plants_public')
    .select(COLS)
    .gte('latitude', b.south).lte('latitude', b.north)
    .gte('longitude', b.west).lte('longitude', b.east)
    .order('created_at', { ascending: false })
    .limit(PUBLIC_LIMIT)
  if (category) q = q.eq('category', category)
  const term = sanitizeSearch(query)
  if (term) q = q.or(`common_name.ilike.%${term}%,scientific_name.ilike.%${term}%`)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as PublicPlant[]
}

export async function fetchPublicPlant(id: string) {
  const { data, error } = await supabase.from('plants_public').select(COLS).eq('id', id).maybeSingle()
  if (error) throw error
  return data as PublicPlant | null
}
