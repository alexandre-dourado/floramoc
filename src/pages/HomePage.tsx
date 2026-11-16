import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import PlantsMap from '../components/map/PlantsMap'
import PlantList from '../components/plants/PlantList'
import PlantDetail from '../components/plants/PlantDetail'
import { CategoryIcon } from '../components/plants/bits'
import { PUBLIC_LIMIT, fetchPublicPlants } from '../features/plants/api'
import { useDebounced } from '../hooks/useDebounced'
import { CATEGORIES, type Category } from '../lib/constants'
import { friendlyError } from '../lib/supabase'
import type { Bounds, PublicPlant } from '../types'

const countLabel = (n: number) => `${n} ${n === 1 ? 'planta' : 'plantas'} nesta área`

function CountBadge({ loading, count, className = '' }: { loading: boolean; count: number; className?: string }) {
  return (
    <span aria-live="polite" className={`inline-flex items-center gap-2 rounded-full bg-forest py-1 pl-1 pr-3 text-sm font-semibold text-paper ${className}`}>
      <span aria-hidden className="grid h-6 min-w-6 place-items-center rounded-full bg-sun px-1.5 text-xs font-bold text-ink tabular-nums">{loading ? '…' : count}</span>
      {loading ? 'Carregando…' : countLabel(count).replace(/^\d+ /, '')}
    </span>
  )
}

interface FiltersProps { q: string; setQ: (v: string) => void; cat: Category | ''; setCat: (c: Category | '') => void }
function Filters({ q, setQ, cat, setCat }: FiltersProps) {
  return (
    <div className="space-y-2">
      <div className="glass relative rounded-2xl">
        <label htmlFor="plant-search" className="sr-only">Buscar por nome popular ou científico</label>
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-3 h-5 w-5 text-forest/70" />
        <input id="plant-search" type="search" className="h-12 w-full rounded-2xl border-0 bg-transparent pl-11 pr-10 text-base placeholder:text-muted/80 focus-visible:outline-3 focus-visible:outline-sun" placeholder="Buscar planta ou nome científico" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && <button type="button" aria-label="Limpar busca" onClick={() => setQ('')} className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-sage"><X aria-hidden className="h-4 w-4" /></button>}
      </div>
      <div role="group" aria-label="Filtrar por categoria" className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => (
          <button key={c.value} type="button" className="chip shadow-sm" aria-pressed={cat === c.value} onClick={() => setCat(cat === c.value ? '' : c.value)}>
            <span aria-hidden className="chip-icon"><CategoryIcon category={c.value} className="h-6 w-6" /></span>{c.label.split(' / ')[0]}
          </button>
        ))}
        {cat && <button type="button" className="chip shadow-sm !pl-3" onClick={() => setCat('')}><X aria-hidden className="h-3.5 w-3.5" />Limpar filtro</button>}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [q, setQ] = useState('')
  const dq = useDebounced(q)
  const [cat, setCat] = useState<Category | ''>('')
  const [plants, setPlants] = useState<PublicPlant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sheet, setSheet] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!bounds) return
    let off = false
    setLoading(true); setError(null)
    fetchPublicPlants({ bounds, query: dq, category: cat })
      .then((r) => { if (!off) setPlants(r) })
      .catch((e) => { if (!off) setError(friendlyError(e)) })
      .finally(() => { if (!off) setLoading(false) })
    return () => { off = true }
  }, [bounds, dq, cat, tick])

  const onSelect = useCallback((id: string) => { setSelectedId(id); setSheet(true) }, [])
  const selected = plants.find((p) => p.id === selectedId) ?? null
  const open = sheet || Boolean(selected)

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem)] flex-col lg:flex-row">
      <div className="atlas-map relative min-h-0 flex-1">
        <PlantsMap plants={plants} selectedId={selectedId} onSelect={onSelect} onBounds={setBounds} />
        <div className="absolute inset-x-3 top-3 z-10 lg:right-auto lg:w-[26rem]">
          <Filters q={q} setQ={setQ} cat={cat} setCat={setCat} />
          <div className="mt-2 hidden items-center gap-2 lg:flex">
            <CountBadge loading={loading} count={plants.length} className="shadow-md" />
            {plants.length >= PUBLIC_LIMIT && <span className="glass rounded-full px-3 py-1 text-xs text-muted">Limite de 1.000 atingido; aproxime o mapa</span>}
          </div>
        </div>
      </div>
      <aside aria-label="Resultados" className="absolute inset-x-0 bottom-0 z-20 flex max-h-[62dvh] flex-col rounded-t-3xl border-t border-line bg-paper shadow-[0_-10px_30px_-8px_rgba(24,59,50,.25)] lg:static lg:max-h-none lg:w-[400px] lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none">
        <Link to="/contribuir" className="btn btn-primary absolute -top-16 right-3 shadow-lg lg:hidden"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
        <button type="button" onClick={() => setSheet((s) => !s)} aria-expanded={open} aria-label={open ? 'Recolher lista de plantas' : 'Expandir lista de plantas'} className="flex min-h-14 flex-col items-center justify-center gap-1.5 px-4 pb-1 pt-2 lg:hidden">
          <span aria-hidden className="h-1.5 w-11 rounded-full bg-forest/25" />
          <CountBadge loading={loading} count={plants.length} />
        </button>
        <div className="hidden border-b border-line bg-cream px-4 py-3 lg:block">
          <p className="eyebrow">Atlas botânico</p>
          <h2 className="font-serif text-[1.65rem] font-bold leading-tight text-forest">Plantas em Montes Claros</h2>
          <p className="mt-0.5 text-xs text-muted">{loading ? 'Carregando…' : countLabel(plants.length)}{plants.length >= PUBLIC_LIMIT ? ' (limite de 1.000 atingido; aproxime o mapa)' : ''}</p>
        </div>
        <div className={`${open ? 'block' : 'hidden'} min-h-0 flex-1 overflow-y-auto overscroll-contain lg:block`}>
          {selected
            ? <PlantDetail plant={selected} onClose={() => setSelectedId(null)} />
            : <PlantList plants={plants} loading={loading} error={error} selectedId={selectedId} onSelect={onSelect} onRetry={() => setTick((t) => t + 1)} />}
        </div>
        <Link to="/contribuir" className="btn btn-primary m-3 hidden lg:inline-flex"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
      </aside>
    </div>
  )
}
