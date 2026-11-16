const env = import.meta.env

const num = (v: unknown, fallback: number) => {
  const n = Number(v)
  return v !== undefined && v !== '' && Number.isFinite(n) ? n : fallback
}

const rawUrl = (env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? ''
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')

export const config = {
  supabaseUrl: cleanUrl,
  supabaseKey: (env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ?? '',
  mapStyleUrl: (env.VITE_MAP_STYLE_URL as string | undefined)?.trim() || 'https://tiles.openfreemap.org/styles/liberty',
  center: { lat: num(env.VITE_DEFAULT_MAP_LAT, -16.7280556), lng: num(env.VITE_DEFAULT_MAP_LNG, -43.865) },
  zoom: num(env.VITE_DEFAULT_MAP_ZOOM, 12),
  contactEmail: (env.VITE_CONTACT_EMAIL as string | undefined)?.trim() ?? '',
}

export const isConfigured = Boolean(config.supabaseUrl && config.supabaseKey)
