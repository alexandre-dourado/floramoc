import { useState } from 'react'
import { BadgeCheck, CircleDashed, Leaf, Wheat } from 'lucide-react'
import { CERTAINTY_SHORT, STATUS_LABELS, categoryMeta, type IdentificationLevel, type PlantStatus } from '../../lib/constants'
import { photoUrl } from '../../lib/supabase'

export const BRANDING = '/assets/branding'

/** Ícone botânico da categoria. Categorias sem arte fatiada usam um ícone vetorial de reserva. */
export function CategoryIcon({ category, className = 'h-full w-full' }: { category: string; className?: string }) {
  const c = categoryMeta(category)
  if (c.asset) return <img src={`${BRANDING}/${c.asset}.webp`} alt="" aria-hidden draggable={false} className={`${className} object-contain`} />
  const Fallback = c.value === 'grass' ? Wheat : Leaf
  return <Fallback aria-hidden className={`${className} p-1`} style={{ color: c.color }} />
}

export function CategoryBadge({ category }: { category: string }) {
  const c = categoryMeta(category)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream py-0.5 pl-0.5 pr-2.5 text-xs font-semibold text-forest">
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-white"><CategoryIcon category={category} className="h-4 w-4" /></span>
      {c.label}
    </span>
  )
}

/** Grau de certeza da identificação: Identificada > Provável > Desconhecida (sólido → suave → tracejado). */
export function CertaintyBadge({ level }: { level: IdentificationLevel }) {
  return (
    <span className={`badge badge-${level}`} title={level === 'identified' ? 'Identificada pelo colaborador (sem validação científica)' : undefined}>
      {level === 'identified' && <span aria-hidden className="grid h-4 w-4 place-items-center overflow-hidden rounded-full"><img src={`${BRANDING}/badge-verified.webp`} alt="" className="h-full w-full scale-[1.08] object-cover" /></span>}
      {level === 'probable' && <BadgeCheck aria-hidden className="h-3.5 w-3.5" />}
      {level === 'unknown' && <CircleDashed aria-hidden className="h-3.5 w-3.5" />}
      {CERTAINTY_SHORT[level]}
    </span>
  )
}

const statusStyle: Record<PlantStatus, string> = {
  pending: 'bg-sun-soft text-sun-ink', approved: 'bg-sage text-forest', rejected: 'bg-danger/15 text-danger', archived: 'bg-stone text-muted',
}
export function StatusBadge({ status }: { status: PlantStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}>{STATUS_LABELS[status]}</span>
}

/** Foto com zoom sutil no hover; sem foto, mostra a ilustração da marca. */
export function PlantPhoto({ path, alt, className = '' }: { path: string | null; alt: string; className?: string }) {
  const [bad, setBad] = useState(false)
  const url = photoUrl(path)
  if (!url || bad) {
    return (
      <div className={`relative grid place-items-center overflow-hidden bg-gradient-to-br from-sage/80 to-cream text-forest ${className}`} role="img" aria-label={path ? 'Foto indisponível' : 'Sem foto'}>
        <img src={`${BRANDING}/logo-icon.webp`} alt="" aria-hidden draggable={false} className="h-3/5 max-h-28 w-auto max-w-[70%] object-contain opacity-60 saturate-75" />
      </div>
    )
  }
  return (
    <div className={`group overflow-hidden bg-sage ${className}`}>
      <img src={url} alt={alt} loading="lazy" onError={() => setBad(true)} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
    </div>
  )
}
