import { useState } from 'react'
import { Leaf } from 'lucide-react'
import { STATUS_LABELS, categoryMeta, type PlantStatus } from '../../lib/constants'
import { photoUrl } from '../../lib/supabase'

export function CategoryBadge({ category }: { category: string }) {
  const c = categoryMeta(category)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-forest">
      <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full text-[10px] text-white" style={{ background: c.color }}>{c.glyph}</span>
      {c.label}
    </span>
  )
}

const statusStyle: Record<PlantStatus, string> = {
  pending: 'bg-sun/30 text-ink', approved: 'bg-sage text-forest', rejected: 'bg-danger/15 text-danger', archived: 'bg-gray-200 text-ink',
}
export function StatusBadge({ status }: { status: PlantStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}>{STATUS_LABELS[status]}</span>
}

export function PlantPhoto({ path, alt, className = '' }: { path: string | null; alt: string; className?: string }) {
  const [bad, setBad] = useState(false)
  const url = photoUrl(path)
  if (!url || bad) {
    return (
      <div className={`grid place-items-center bg-sage text-forest ${className}`} role="img" aria-label={path ? 'Foto indisponível' : 'Sem foto'}>
        <Leaf aria-hidden className="h-6 w-6 opacity-60" />
      </div>
    )
  }
  return <img src={url} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />
}
