import { Link } from 'react-router-dom'
import { MapPinned, Plus } from 'lucide-react'
import { CategoryBadge, PlantPhoto } from './bits'
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
      <ul aria-busy="true" aria-label="Carregando resultados" className="space-y-2 p-3">
        {[0, 1, 2].map((i) => <li key={i} className="h-16 animate-pulse rounded-xl bg-sage/70" />)}
      </ul>
    )
  }
  if (plants.length === 0) {
    return (
      <div className="m-3 rounded-2xl border border-dashed border-leaf p-5 text-center">
        <MapPinned aria-hidden className="mx-auto h-8 w-8 text-leaf" />
        <p className="mt-2 font-serif text-lg">Nenhuma planta registrada nesta área</p>
        <p className="mt-1 text-sm text-muted">Mova o mapa, ajuste os filtros ou seja a primeira pessoa a registrar uma planta aqui.</p>
        <Link to="/contribuir" className="btn btn-primary mt-3"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
      </div>
    )
  }
  return (
    <ul className="space-y-2 p-3">
      {plants.map((p) => (
        <li key={p.id}>
          <button type="button" onClick={() => onSelect(p.id)} aria-current={p.id === selectedId}
            className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left ${p.id === selectedId ? 'border-forest bg-sage' : 'border-[#dfe3d8] bg-white hover:bg-sage/50'}`}>
            <PlantPhoto path={p.photo_path} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
            <span className="min-w-0">
              <span className="block truncate font-semibold">{p.common_name}</span>
              {p.scientific_name && <span className="block truncate text-sm italic text-muted">{p.scientific_name}</span>}
              <CategoryBadge category={p.category} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
