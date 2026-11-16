import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronUp, Plus, Search, X } from 'lucide-react'
import PlantsMap from '../components/map/PlantsMap'
import PlantList from '../components/plants/PlantList'
import PlantDetail from '../components/plants/PlantDetail'
import { PUBLIC_LIMIT, fetchPublicPlants } from '../features/plants/api'
import { useDebounced } from '../hooks/useDebounced'
import { CATEGORIES, type Category } from '../lib/constants'
import { friendlyError } from '../lib/supabase'
import type { Bounds, PublicPlant } from '../types'

interface FiltersProps { idp: string; q: string; setQ: (v: string) => void; cat: Category | ''; setCat: (c: Category | '') => void }
function Filters({ idp, q, setQ, cat, setCat }: FiltersProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <label htmlFor={`${idp}-q`} className="sr-only">Buscar por nome popular ou científico</label>
        <Search aria-hidden className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted" />
        <input id={`${idp}-q`} type="search" className="field !pl-10 shadow-sm" placeholder="Buscar planta ou nome científico" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div role="group" aria-label="Filtrar por categoria" className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button key={c.value} type="button" className="chip" aria-pressed={cat === c.value} onClick={() => setCat(cat === c.value ? '' : c.value)}>
            <span aria-hidden>{c.glyph}</span>{c.label.split(' / ')[0]}
          </button>
        ))}
        {(cat || q) && <button type="button" className="chip" onClick={() => { setCat(''); setQ('') }}><X aria-hidden className="h-3 w-3" />Limpar</button>}
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
      <div className="relative min-h-0 flex-1">
        <PlantsMap plants={plants} selectedId={selectedId} onSelect={onSelect} onBounds={setBounds} />
        <div className="absolute inset-x-3 top-3 z-10 lg:hidden">
          <Filters idp="m" q={q} setQ={setQ} cat={cat} setCat={setCat} />
        </div>
      </div>
      <aside aria-label="Resultados" className="absolute inset-x-0 bottom-0 z-20 flex max-h-[62dvh] flex-col rounded-t-2xl border-t border-[#dfe3d8] bg-paper shadow-[0_-4px_16px_rgba(0,0,0,.12)] lg:static lg:max-h-none lg:w-[380px] lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none">
        <Link to="/contribuir" className="btn btn-primary absolute -top-16 right-3 shadow-lg lg:hidden"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
        <button type="button" onClick={() => setSheet((s) => !s)} aria-expanded={open} className="flex min-h-12 items-center justify-between px-4 text-sm font-semibold lg:hidden">
          <span>{loading ? 'Carregando…' : `${plants.length} ${plants.length === 1 ? 'planta' : 'plantas'} nesta área`}</span>
          <ChevronUp aria-hidden className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <div className="hidden border-b border-[#dfe3d8] p-3 lg:block">
          <p className="mb-2 font-serif text-lg">Plantas em Montes Claros</p>
          <Filters idp="d" q={q} setQ={setQ} cat={cat} setCat={setCat} />
          <p aria-live="polite" className="mt-2 text-xs text-muted">{loading ? 'Carregando…' : `${plants.length} ${plants.length === 1 ? 'planta' : 'plantas'} nesta área`}{plants.length >= PUBLIC_LIMIT ? ' (limite de 1.000 atingido; aproxime o mapa)' : ''}</p>
        </div>
        <div className={`${open ? 'block' : 'hidden'} min-h-0 flex-1 overflow-y-auto lg:block`}>
          {selected
            ? <PlantDetail plant={selected} onClose={() => setSelectedId(null)} />
            : <PlantList plants={plants} loading={loading} error={error} selectedId={selectedId} onSelect={onSelect} onRetry={() => setTick((t) => t + 1)} />}
        </div>
        <Link to="/contribuir" className="btn btn-primary m-3 hidden lg:inline-flex"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
      </aside>
    </div>
  )
}
