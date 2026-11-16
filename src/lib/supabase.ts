import { createClient } from '@supabase/supabase-js'
import { config } from './config'

// Sem variáveis, o App mostra uma tela de configuração (ver ConfigMissing) e o cliente nunca é usado.
export const supabase = createClient(
  config.supabaseUrl || 'https://not-configured.invalid',
  config.supabaseKey || 'not-configured',
)

export const PHOTO_BUCKET = 'plant-photos'

export function photoUrl(path: string | null | undefined): string | null {
  if (!path) return null
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

export function friendlyError(e: unknown): string {
  const err = e as { code?: string; message?: string } | null
  if (!err) return 'Algo deu errado. Tente novamente.'
  if (err.code === 'P0001' && err.message) return err.message
  if (err.code === '42501') return 'Você não tem permissão para esta ação.'
  if (err.code === '23505') return 'Já existe uma denúncia aberta sua para este registro.'
  if (err.code === '23514') return 'Algum campo está fora dos limites permitidos.'
  if (/fetch|network/i.test(err.message ?? '')) return 'Erro de conexão. Verifique sua internet e tente de novo.'
  return 'Não foi possível concluir a operação. Tente novamente.'
}
