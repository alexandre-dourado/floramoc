import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PlantPhoto, StatusBadge, CategoryBadge } from '../components/plants/bits'
import { useAuth } from '../features/auth/AuthContext'
import { STATUS_LABELS, type PlantStatus } from '../lib/constants'
import { PHOTO_BUCKET, friendlyError, supabase } from '../lib/supabase'
import type { Plant } from '../types'

export default function MyContributionsPage() {
  const { user } = useAuth()
  const sent = (useLocation().state as { sent?: string } | null)?.sent
  const [items, setItems] = useState<Plant[]>([])
  const [filter, setFilter] = useState<PlantStatus | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true); setError(null)
    const { data, error: e } = await supabase.from('plants').select('*').eq('created_by', user.id).order('created_at', { ascending: false })
    if (e) setError(friendlyError(e)); else setItems((data ?? []) as Plant[])
    setLoading(false)
  }, [user])
  useEffect(() => { void load() }, [load])

  async function remove(p: Plant) {
    if (!window.confirm(`Excluir “${p.common_name}”? Esta ação não pode ser desfeita.`)) return
    const { error: e } = await supabase.from('plants').delete().eq('id', p.id)
    if (e) return setError(friendlyError(e))
    if (p.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([p.photo_path])
    void load()
  }

  const shown = items.filter((p) => !filter || p.status === filter)
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="font-serif text-3xl">Minhas contribuições</h1>
      {sent && <p role="status" className="mt-3 rounded-lg bg-sage p-3 text-sm font-semibold text-forest">{sent === 'edit' ? 'Alterações salvas. O registro voltou para análise.' : 'Planta enviada! Ela aparecerá no mapa depois da revisão.'}</p>}
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
        <button type="button" className="chip" aria-pressed={filter === ''} onClick={() => setFilter('')}>Todas</button>
        {(Object.keys(STATUS_LABELS) as PlantStatus[]).map((s) => <button key={s} type="button" className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>{STATUS_LABELS[s]}</button>)}
      </div>
      {error && <p role="alert" className="err mt-3">{error}</p>}
      {loading ? <p role="status" className="mt-6 text-muted">Carregando…</p>
        : shown.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-leaf p-6 text-center">
            <p className="font-serif text-lg">Nada por aqui ainda</p>
            <Link to="/contribuir" className="btn btn-primary mt-3">Adicionar planta</Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {shown.map((p) => (
              <li key={p.id} className="card flex gap-3">
                <PlantPhoto path={p.photo_path} alt={`Foto de ${p.common_name}`} className="h-20 w-20 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-semibold">{p.common_name}</p>
                  <div className="flex flex-wrap gap-1"><StatusBadge status={p.status} /><CategoryBadge category={p.category} /></div>
                  <p className="text-xs text-muted">Enviada em {new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                  {p.status === 'approved' && <Link to={`/plantas/${p.id}`} className="text-sm underline">Ver no mapa público</Link>}
                  <div className="flex gap-2 pt-1">
                    {(p.status === 'pending' || p.status === 'approved') && <Link to={`/contribuir/${p.id}`} className="btn btn-ghost !min-h-10">Editar</Link>}
                    {p.status === 'pending' && <button type="button" className="btn btn-ghost !min-h-10 text-danger" onClick={() => void remove(p)}>Excluir</button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
    </main>
  )
}
