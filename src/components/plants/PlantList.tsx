import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { CategoryIcon, CertaintyBadge, PlantPhoto } from './bits'
import { categoryMeta } from '../../lib/constants'
import type { PublicPlant } from '../../types'

interface Props {
  plants: PublicPlant[]
  loading: boolean
  error: string | null
  selectedId: string | null
  onSelect: (id: string) => void
  onRetry: () => void
}

export default function PlantList({ plants, loading, error, selectedId, onSelect, onRetry }: Props) {
  if (error) {
    return (
      <div role="alert" className="card m-3 text-sm">
        <p className="err">{error}</p>
        <button type="button" className="btn btn-ghost mt-2" onClick={onRetry}>Tentar novamente</button>
      </div>
    )
  }
  if (loading && plants.length === 0) {
    return (
      <ul aria-busy="true" aria-label="Carregando resultados" className="space-y-2.5 p-3">
        {[0, 1, 2].map((i) => <li key={i} className="h-[4.75rem] animate-pulse rounded-2xl bg-sage/60" />)}
      </ul>
    )
  }
  if (plants.length === 0) {
    return (
      <div className="pop m-3 rounded-2xl border border-dashed border-leaf bg-cream p-6 text-center">
        <img src="/assets/branding/logo-icon.webp" alt="" aria-hidden width={104} height={72} className="mx-auto h-20 w-auto opacity-80" />
        <p className="mt-2 font-serif text-2xl font-semibold leading-tight text-forest">Nenhuma planta registrada nesta área</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted">Mova o mapa, ajuste os filtros ou seja a primeira pessoa a registrar uma planta aqui.</p>
        <Link to="/contribuir" className="btn btn-primary mt-4"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
      </div>
    )
  }
  return (
    <ul className="space-y-2.5 p-3">
      {plants.map((p, i) => {
        const selected = p.id === selectedId
        return (
          <li key={p.id} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
            <button type="button" onClick={() => onSelect(p.id)} aria-current={selected}
              className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition-all duration-200 hover:-translate-y-px hover:shadow-md ${selected ? 'border-forest bg-sage shadow-md' : 'border-line bg-white hover:border-leaf'}`}>
              <PlantPhoto path={p.photo_path} alt="" className="h-16 w-16 shrink-0 rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-xl font-bold leading-tight text-ink">{p.common_name}</span>
                <span className={`block truncate font-serif text-[.95rem] italic leading-snug ${p.scientific_name ? 'text-muted' : 'text-muted/60'}`}>{p.scientific_name ?? 'nome científico não informado'}</span>
                <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="eyebrow inline-flex items-center gap-1 !text-[.62rem]"><span aria-hidden className="h-4 w-4"><CategoryIcon category={p.category} /></span>{categoryMeta(p.category).label.split(' / ')[0]}</span>
                  <CertaintyBadge level={p.identification_level} />
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
