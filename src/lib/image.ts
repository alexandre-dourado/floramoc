export const MAX_PHOTO_BYTES = 5 * 1024 * 1024
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validatePhoto(file: File): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return 'Formato não aceito. Use JPEG, PNG ou WebP.'
  if (file.size > MAX_PHOTO_BYTES) return 'A foto excede 5 MB. Escolha uma imagem menor.'
  return null
}

/** Redesenha a imagem em canvas (remove EXIF/GPS) e reduz o lado maior para 1600 px. */
export async function reprocessPhoto(file: File, maxSide = 1600): Promise<{ blob: Blob; ext: string }> {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.85))
  if (!blob || !ACCEPTED_PHOTO_TYPES.includes(blob.type)) throw new Error('encode')
  if (blob.size > MAX_PHOTO_BYTES) throw new Error('size')
  return { blob, ext: blob.type === 'image/png' ? 'png' : blob.type === 'image/jpeg' ? 'jpg' : 'webp' }
}
