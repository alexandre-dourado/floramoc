import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LocationPicker, { type Point } from '../components/map/LocationPicker'
import { CategoryBadge, PlantPhoto } from '../components/plants/bits'
import { CATEGORIES, IDENT_LEVELS, REPORT_REASONS, categoryMeta, labelOf, type Category, type IdentificationLevel, type PlantStatus } from '../lib/constants'
import { PHOTO_BUCKET, friendlyError, supabase } from '../lib/supabase'
import type { AdminStats, Plant, PlantReport } from '../types'

type Tab = 'pending' | 'approved' | 'reports'

function ReviewCard({ plant, onDone }: { plant: Plant; onDone: () => void }) {
  const [f, setF] = useState({ common_name: plant.common_name, scientific_name: plant.scientific_name ?? '', category: plant.category as Category, identification_level: plant.identification_level as IdentificationLevel, description: plant.description ?? '' })
  const [point, setPoint] = useState<Point>({ lat: plant.latitude, lng: plant.longitude })
  const [note, setNote] = useState(plant.moderation_note ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function act(status: PlantStatus) {
    setError(null)
    if (status === 'rejected' && !note.trim()) return setError('Informe o motivo interno da rejeição.')
    if (f.common_name.trim().length < 1) return setError('O nome popular não pode ficar vazio.')
    setBusy(true)
    const { error: e } = await supabase.from('plants').update({
      common_name: f.common_name.trim(), scientific_name: f.scientific_name.trim() || null, category: f.category,
      identification_level: f.identification_level, description: f.description.trim() || null,
      latitude: point.lat, longitude: point.lng, status, moderation_note: note.trim() || null,
    }).eq('id', plant.id)
    setBusy(false)
    if (e) return setError(friendlyError(e))
    if (status === 'rejected' && plant.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([plant.photo_path])
    onDone()
  }

  return (
    <div className="space-y-3 border-t border-[#dfe3d8] pt-3">
      <PlantPhoto path={plant.photo_path} alt={`Foto de ${plant.common_name}`} className="h-40 w-full rounded-xl" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor={`cn-${plant.id}`}>Nome popular</label><input id={`cn-${plant.id}`} className="field" value={f.common_name} maxLength={100} onChange={(e) => setF({ ...f, common_name: e.target.value })} /></div>
        <div><label className="label" htmlFor={`sn-${plant.id}`}>Nome científico</label><input id={`sn-${plant.id}`} className="field" value={f.scientific_name} maxLength={150} onChange={(e) => setF({ ...f, scientific_name: e.target.value })} /></div>
        <div><label className="label" htmlFor={`ct-${plant.id}`}>Categoria</label><select id={`ct-${plant.id}`} className="field" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
        <div><label className="label" htmlFor={`il-${plant.id}`}>Identificação</label><select id={`il-${plant.id}`} className="field" value={f.identification_level} onChange={(e) => setF({ ...f, identification_level: e.target.value as IdentificationLevel })}>{IDENT_LEVELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
      </div>
      <div><label className="label" htmlFor={`ds-${plant.id}`}>Observação</label><textarea id={`ds-${plant.id}`} className="field" rows={2} maxLength={500} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      <p className="text-xs text-muted">Posição ({point.lat.toFixed(5)}, {point.lng.toFixed(5)}). Arraste o marcador para aproximar ou corrigir; para espécies sensíveis, generalize o ponto.</p>
      <LocationPicker value={point} onChange={setPoint} height="220px" />
      <div><label className="label" htmlFor={`nt-${plant.id}`}>Nota interna (obrigatória para rejeitar)</label><textarea id={`nt-${plant.id}`} className="field" rows={2} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
      {error && <p role="alert" className="err">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {plant.status === 'pending' && <>
          <button className="btn btn-primary" disabled={busy} onClick={() => void act('approved')}>Aprovar</button>
          <button className="btn btn-danger" disabled={busy} onClick={() => void act('rejected')}>Rejeitar</button>
        </>}
        {plant.status === 'approved' && <>
          <button className="btn btn-primary" disabled={busy} onClick={() => void act('approved')}>Salvar edição</button>
          <button className="btn btn-ghost" disabled={busy} onClick={() => void act('archived')}>Arquivar</button>
        </>}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('pending')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [plants, setPlants] = useState<Plant[]>([])
  const [reports, setReports] = useState<PlantReport[]>([])
  const [cat, setCat] = useState<Category | ''>('')
  const [since, setSince] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    const s = await supabase.rpc('admin_stats')
    if (s.error) { setError(friendlyError(s.error)); setLoading(false); return }
    setStats(s.data as AdminStats)
    if (tab === 'reports') {
      const r = await supabase.from('plant_reports').select('*, plants(common_name)').eq('status', 'open').order('created_at', { ascending: true }).limit(100)
      if (r.error) setError(friendlyError(r.error)); else setReports((r.data ?? []) as PlantReport[])
    } else {
      let q = supabase.from('plants').select('*').eq('status', tab).order('created_at', { ascending: tab === 'pending' }).limit(100)
      if (cat) q = q.eq('category', cat)
      if (since) q = q.gte('created_at', `${since}T00:00:00`)
      const r = await q
      if (r.error) setError(friendlyError(r.error)); else setPlants((r.data ?? []) as Plant[])
    }
    setLoading(false)
  }, [tab, cat, since])
  useEffect(() => { void load() }, [load])

  async function resolve(r: PlantReport, status: 'resolved' | 'dismissed') {
    const { error: e } = await supabase.from('plant_reports').update({ status, admin_note: notes[r.id]?.trim() || null }).eq('id', r.id)
    if (e) setError(friendlyError(e)); else void load()
  }

  const Stat = ({ label, value }: { label: string; value: number | string }) => <div className="card !p-3"><p className="text-2xl font-semibold">{value}</p><p className="text-xs text-muted">{label}</p></div>
  const tabs: { id: Tab; label: string }[] = [{ id: 'pending', label: `Pendentes${stats ? ` (${stats.pending})` : ''}` }, { id: 'approved', label: 'Aprovadas' }, { id: 'reports', label: `Denúncias${stats ? ` (${stats.open_reports})` : ''}` }]

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="font-serif text-3xl">Moderação</h1>
      {stats && (
        <section aria-label="Métricas" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Pendentes" value={stats.pending} /><Stat label="Aprovadas" value={stats.approved} /><Stat label="Rejeitadas/arquivadas" value={stats.rejected_archived} />
          <Stat label="Denúncias abertas" value={stats.open_reports} /><Stat label="Colaboradores" value={stats.contributors} /><Stat label="Registros em 30 dias" value={stats.last_30_days} />
        </section>
      )}
      {stats && Object.keys(stats.by_category).length > 0 && (
        <p className="mt-2 text-sm text-muted">Aprovadas por categoria: {Object.entries(stats.by_category).map(([k, n]) => `${categoryMeta(k).label.split(' / ')[0]} ${n}`).join(' · ')}</p>
      )}
      <div role="tablist" className="mt-4 flex gap-2">
        {tabs.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} className="chip" aria-pressed={tab === t.id} onClick={() => { setTab(t.id); setOpenId(null) }}>{t.label}</button>)}
      </div>
      {tab !== 'reports' && (
        <div className="mt-3 flex flex-wrap gap-3">
          <div><label className="label" htmlFor="fc">Categoria</label><select id="fc" className="field" value={cat} onChange={(e) => setCat(e.target.value as Category | '')}><option value="">Todas</option>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div><label className="label" htmlFor="fs">Enviadas desde</label><input id="fs" type="date" className="field" value={since} onChange={(e) => setSince(e.target.value)} /></div>
        </div>
      )}
      {error && <p role="alert" className="err mt-3">{error}</p>}
      {loading ? <p role="status" className="mt-6 text-muted">Carregando…</p> : tab === 'reports' ? (
        reports.length === 0 ? <p className="mt-6 text-muted">Nenhuma denúncia aberta.</p> : (
          <ul className="mt-4 space-y-3">{reports.map((r) => (
            <li key={r.id} className="card space-y-2">
              <p className="font-semibold">{r.plants?.common_name ?? 'Registro'} — {labelOf(REPORT_REASONS, r.reason)}</p>
              {r.details && <p className="whitespace-pre-wrap text-sm">{r.details}</p>}
              <p className="text-xs text-muted">{new Date(r.created_at).toLocaleString('pt-BR')} · <Link className="underline" to={`/plantas/${r.plant_id}`}>abrir registro</Link></p>
              <label className="label" htmlFor={`rn-${r.id}`}>Nota interna</label>
              <textarea id={`rn-${r.id}`} className="field" rows={2} maxLength={1000} value={notes[r.id] ?? ''} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} />
              <div className="flex gap-2"><button className="btn btn-primary" onClick={() => void resolve(r, 'resolved')}>Resolver</button><button className="btn btn-ghost" onClick={() => void resolve(r, 'dismissed')}>Descartar</button></div>
            </li>))}</ul>)
      ) : plants.length === 0 ? <p className="mt-6 text-muted">Nada nesta fila.</p> : (
        <ul className="mt-4 space-y-3">{plants.map((p) => (
          <li key={p.id} className="card">
            <button type="button" className="flex w-full items-center gap-3 text-left" aria-expanded={openId === p.id} onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              <PlantPhoto path={p.photo_path} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
              <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{p.common_name}</span><span className="text-xs text-muted">{new Date(p.created_at).toLocaleDateString('pt-BR')}</span></span>
              <CategoryBadge category={p.category} />
            </button>
            {openId === p.id && <ReviewCard plant={p} onDone={() => { setOpenId(null); void load() }} />}
          </li>))}</ul>
      )}
    </main>
  )
}
