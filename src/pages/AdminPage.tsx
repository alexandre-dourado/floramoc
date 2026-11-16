import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, CalendarDays, Check, ChevronDown, Flag, Hourglass, LoaderCircle, Save, Users, X } from 'lucide-react'
import LocationPicker, { type Point } from '../components/map/LocationPicker'
import { CategoryBadge, CategoryIcon, CertaintyBadge, PlantPhoto } from '../components/plants/bits'
import { CATEGORIES, IDENT_LEVELS, REPORT_REASONS, categoryMeta, labelOf, type Category, type IdentificationLevel, type PlantStatus } from '../lib/constants'
import { PHOTO_BUCKET, friendlyError, supabase } from '../lib/supabase'
import type { AdminStats, Plant, PlantReport } from '../types'

type Tab = 'pending' | 'approved' | 'reports'
type Flash = { tone: 'ok' | 'warn'; text: string }

function Spin() { return <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> }

function ReviewCard({ plant, onDone }: { plant: Plant; onDone: (msg: Flash) => void }) {
  const [f, setF] = useState({ common_name: plant.common_name, scientific_name: plant.scientific_name ?? '', category: plant.category as Category, identification_level: plant.identification_level as IdentificationLevel, description: plant.description ?? '' })
  const [point, setPoint] = useState<Point>({ lat: plant.latitude, lng: plant.longitude })
  const [note, setNote] = useState(plant.moderation_note ?? '')
  const [busy, setBusy] = useState<PlantStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [noteInvalid, setNoteInvalid] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  async function act(status: PlantStatus) {
    setError(null); setNoteInvalid(false)
    if (status === 'rejected' && !note.trim()) {
      setNoteInvalid(true); noteRef.current?.focus()
      return setError('Informe o motivo interno da rejeição.')
    }
    if (f.common_name.trim().length < 1) return setError('O nome popular não pode ficar vazio.')
    setBusy(status)
    const { error: e } = await supabase.from('plants').update({
      common_name: f.common_name.trim(), scientific_name: f.scientific_name.trim() || null, category: f.category,
      identification_level: f.identification_level, description: f.description.trim() || null,
      latitude: point.lat, longitude: point.lng, status, moderation_note: note.trim() || null,
    }).eq('id', plant.id)
    setBusy(null)
    if (e) return setError(friendlyError(e))
    if (status === 'rejected' && plant.photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([plant.photo_path])
    const name = f.common_name.trim()
    onDone(status === 'approved' ? { tone: 'ok', text: plant.status === 'approved' ? `Edição de “${name}” salva.` : `“${name}” aprovada e publicada no mapa.` }
      : status === 'rejected' ? { tone: 'warn', text: `“${name}” rejeitada.` }
      : { tone: 'warn', text: `“${name}” arquivada.` })
  }

  const working = busy !== null
  return (
    <div className="mt-3 space-y-3 border-t border-dashed border-line pt-3">
      <PlantPhoto path={plant.photo_path} alt={`Foto de ${plant.common_name}`} className="aspect-[16/9] w-full rounded-xl ring-1 ring-line sm:aspect-[21/9]" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor={`cn-${plant.id}`}>Nome popular</label><input id={`cn-${plant.id}`} className="field font-serif !text-lg font-semibold" value={f.common_name} maxLength={100} onChange={(e) => setF({ ...f, common_name: e.target.value })} /></div>
        <div><label className="label" htmlFor={`sn-${plant.id}`}>Nome científico</label><input id={`sn-${plant.id}`} className="field font-serif !text-lg italic" value={f.scientific_name} maxLength={150} onChange={(e) => setF({ ...f, scientific_name: e.target.value })} /></div>
        <div><label className="label" htmlFor={`ct-${plant.id}`}>Categoria</label><select id={`ct-${plant.id}`} className="field" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
        <div><label className="label" htmlFor={`il-${plant.id}`}>Identificação</label><select id={`il-${plant.id}`} className="field" value={f.identification_level} onChange={(e) => setF({ ...f, identification_level: e.target.value as IdentificationLevel })}>{IDENT_LEVELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
      </div>
      <div><label className="label" htmlFor={`ds-${plant.id}`}>Observação</label><textarea id={`ds-${plant.id}`} className="field" rows={2} maxLength={500} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      <p className="text-xs text-muted">Posição ({point.lat.toFixed(5)}, {point.lng.toFixed(5)}). Arraste o marcador para aproximar ou corrigir; para espécies sensíveis, generalize o ponto.</p>
      <LocationPicker value={point} onChange={setPoint} height="220px" />
      <div>
        <label className="label" htmlFor={`nt-${plant.id}`}>Nota interna (obrigatória para rejeitar)</label>
        <textarea ref={noteRef} id={`nt-${plant.id}`} className={`field ${noteInvalid ? '!border-danger !shadow-[0_0_0_3px_rgb(180_77_67/.25)]' : ''}`} aria-invalid={noteInvalid || undefined} rows={2} maxLength={1000} value={note} onChange={(e) => { setNote(e.target.value); if (noteInvalid) setNoteInvalid(false) }} />
      </div>
      {error && <p role="alert" className="err rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {plant.status === 'pending' && <>
          <button className="btn btn-approve" disabled={working} onClick={() => void act('approved')}>{busy === 'approved' ? <Spin /> : <Check aria-hidden className="h-4 w-4" />}{busy === 'approved' ? 'Aprovando…' : 'Aprovar'}</button>
          <button className="btn btn-reject" disabled={working} onClick={() => void act('rejected')}>{busy === 'rejected' ? <Spin /> : <X aria-hidden className="h-4 w-4" />}{busy === 'rejected' ? 'Rejeitando…' : 'Rejeitar'}</button>
        </>}
        {plant.status === 'approved' && <>
          <button className="btn btn-primary" disabled={working} onClick={() => void act('approved')}>{busy === 'approved' ? <Spin /> : <Save aria-hidden className="h-4 w-4" />}{busy === 'approved' ? 'Salvando…' : 'Salvar edição'}</button>
          <button className="btn btn-ghost" disabled={working} onClick={() => void act('archived')}>{busy === 'archived' ? <Spin /> : <Archive aria-hidden className="h-4 w-4" />}{busy === 'archived' ? 'Arquivando…' : 'Arquivar'}</button>
        </>}
      </div>
    </div>
  )
}

function BentoStat({ label, value, icon: Icon, tone = 'plain', className = '' }: { label: string; value: number | string; icon: typeof Check; tone?: 'plain' | 'alert' | 'ok'; className?: string }) {
  const toneCls = tone === 'alert' ? 'border-danger/40 bg-danger/5' : tone === 'ok' ? 'border-leaf/50 bg-sage/60' : 'border-line bg-white'
  return (
    <div className={`rise flex min-h-[6.5rem] flex-col justify-between rounded-2xl border p-4 shadow-[var(--shadow-card)] ${toneCls} ${className}`}>
      <Icon aria-hidden className={`h-5 w-5 ${tone === 'alert' ? 'text-danger' : 'text-moss'}`} />
      <div><p className="font-serif text-4xl font-bold leading-none text-forest tabular-nums">{value}</p><p className="mt-1 text-xs font-medium text-muted">{label}</p></div>
    </div>
  )
}

function Bento({ stats }: { stats: AdminStats }) {
  const cats = Object.entries(stats.by_category).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...cats.map(([, n]) => n))
  return (
    <section aria-label="Métricas" className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rise relative col-span-2 flex min-h-[13.5rem] lg:row-span-2 flex-col justify-between overflow-hidden rounded-3xl bg-forest p-5 text-paper shadow-[var(--shadow-float)]">
        <img src="/assets/branding/logo-icon.webp" alt="" aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 h-40 w-auto opacity-15 brightness-200 grayscale" />
        <span className="eyebrow inline-flex items-center gap-1.5 !text-sun"><Hourglass aria-hidden className="h-3.5 w-3.5" />Fila de moderação</span>
        <div>
          <p aria-label={`${stats.pending} pendentes`} className="font-serif text-8xl font-bold leading-none tabular-nums">{stats.pending}</p>
          <p className="mt-1 text-sm text-paper/80">Pendentes{stats.pending > 0 ? ' — aguardando sua revisão' : ' — fila em dia'}</p>
        </div>
      </div>
      <BentoStat label="Aprovadas" value={stats.approved} icon={Check} tone="ok" />
      <BentoStat label="Denúncias abertas" value={stats.open_reports} icon={Flag} tone={stats.open_reports > 0 ? 'alert' : 'plain'} />
      <BentoStat label="Colaboradores" value={stats.contributors} icon={Users} />
      <BentoStat label="Registros em 30 dias" value={stats.last_30_days} icon={CalendarDays} />
      <BentoStat label="Rejeitadas/arquivadas" value={stats.rejected_archived} icon={Archive} />
      {cats.length > 0 && (
        <div className="rise col-span-2 rounded-2xl border border-line bg-white p-4 shadow-[var(--shadow-card)] lg:col-span-3">
          <p className="eyebrow mb-2">Aprovadas por categoria</p>
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {cats.map(([k, n]) => (
              <li key={k} className="flex items-center gap-2 text-sm">
                <span aria-hidden className="h-6 w-6 shrink-0"><CategoryIcon category={k} /></span>
                <span className="w-24 shrink-0 truncate">{categoryMeta(k).label.split(' / ')[0]}</span>
                <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-stone"><span className="block h-full rounded-full" style={{ width: `${(n / max) * 100}%`, background: categoryMeta(k).color }} /></span>
                <span className="w-7 text-right font-semibold tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
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
  const [flash, setFlash] = useState<Flash | null>(null)

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
  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 5000)
    return () => clearTimeout(t)
  }, [flash])

  async function resolve(r: PlantReport, status: 'resolved' | 'dismissed') {
    const { error: e } = await supabase.from('plant_reports').update({ status, admin_note: notes[r.id]?.trim() || null }).eq('id', r.id)
    if (e) { setError(friendlyError(e)); return }
    setFlash(status === 'resolved' ? { tone: 'ok', text: 'Denúncia resolvida.' } : { tone: 'warn', text: 'Denúncia descartada.' })
    void load()
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'pending', label: 'Pendentes', count: stats?.pending },
    { id: 'approved', label: 'Aprovadas' },
    { id: 'reports', label: 'Denúncias', count: stats?.open_reports },
  ]

  return (
    <main className="mx-auto max-w-5xl p-4">
      <p className="eyebrow">Painel do curador</p>
      <h1 className="text-4xl font-bold text-forest">Moderação</h1>
      {stats && <Bento stats={stats} />}
      {flash && (
        <p role="status" className={`pop mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${flash.tone === 'ok' ? 'border-leaf bg-sage text-forest' : 'border-sun bg-sun-soft text-sun-ink'}`}>
          {flash.tone === 'ok' ? <Check aria-hidden className="h-4 w-4" /> : <Archive aria-hidden className="h-4 w-4" />}{flash.text}
        </p>
      )}
      <div role="tablist" aria-label="Filas de moderação" className="mt-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-stone p-1">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className="tab" onClick={() => { setTab(t.id); setOpenId(null) }}>
            {t.label}
            {t.count !== undefined && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[.7rem] font-bold tabular-nums ${t.count > 0 ? (t.id === 'reports' ? 'bg-danger text-white' : 'bg-sun text-ink') : 'bg-white text-muted'}`}>{t.count}</span>}
          </button>
        ))}
      </div>
      {tab !== 'reports' && (
        <div className="mt-3 flex flex-wrap gap-3">
          <div><label className="label" htmlFor="fc">Categoria</label><select id="fc" className="field" value={cat} onChange={(e) => setCat(e.target.value as Category | '')}><option value="">Todas</option>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div><label className="label" htmlFor="fs">Enviadas desde</label><input id="fs" type="date" className="field" value={since} onChange={(e) => setSince(e.target.value)} /></div>
        </div>
      )}
      {error && <p role="alert" className="err mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">{error}</p>}
      {loading ? <p role="status" className="mt-6 text-muted">Carregando…</p> : tab === 'reports' ? (
        reports.length === 0 ? <p className="mt-6 rounded-2xl border border-dashed border-leaf bg-cream p-6 text-center text-muted">Nenhuma denúncia aberta.</p> : (
          <ul className="mt-4 space-y-3">{reports.map((r) => (
            <li key={r.id} className="card space-y-2 border-l-4 !border-l-danger">
              <p className="font-serif text-xl font-bold leading-tight">{r.plants?.common_name ?? 'Registro'}</p>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-bold text-danger"><Flag aria-hidden className="h-3 w-3" />{labelOf(REPORT_REASONS, r.reason)}</p>
              {r.details && <p className="whitespace-pre-wrap text-sm">{r.details}</p>}
              <p className="text-xs text-muted">{new Date(r.created_at).toLocaleString('pt-BR')} · <Link className="underline" to={`/plantas/${r.plant_id}`}>abrir registro</Link></p>
              <label className="label" htmlFor={`rn-${r.id}`}>Nota interna</label>
              <textarea id={`rn-${r.id}`} className="field" rows={2} maxLength={1000} value={notes[r.id] ?? ''} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} />
              <div className="flex gap-2">
                <button className="btn btn-approve" onClick={() => void resolve(r, 'resolved')}><Check aria-hidden className="h-4 w-4" />Resolver</button>
                <button className="btn btn-ghost" onClick={() => void resolve(r, 'dismissed')}><X aria-hidden className="h-4 w-4" />Descartar</button>
              </div>
            </li>))}</ul>)
      ) : plants.length === 0 ? <p className="mt-6 rounded-2xl border border-dashed border-leaf bg-cream p-6 text-center text-muted">Nada nesta fila.</p> : (
        <ul className="mt-4 space-y-3">{plants.map((p) => (
          <li key={p.id} className={`card transition-shadow ${openId === p.id ? 'ring-2 ring-forest/30' : ''}`}>
            <button type="button" className="flex w-full items-center gap-3 text-left" aria-expanded={openId === p.id} onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              <PlantPhoto path={p.photo_path} alt="" className="h-16 w-16 shrink-0 rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-xl font-bold leading-tight">{p.common_name}</span>
                {p.scientific_name && <span className="block truncate font-serif italic text-muted">{p.scientific_name}</span>}
                <span className="mt-1 flex flex-wrap items-center gap-2"><CertaintyBadge level={p.identification_level} /><span className="text-xs text-muted">{new Date(p.created_at).toLocaleDateString('pt-BR')}</span></span>
              </span>
              <span className="hidden sm:block"><CategoryBadge category={p.category} /></span>
              <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-muted transition-transform ${openId === p.id ? 'rotate-180' : ''}`} />
            </button>
            {openId === p.id && <ReviewCard plant={p} onDone={(m) => { setFlash(m); setOpenId(null); void load() }} />}
          </li>))}</ul>
      )}
    </main>
  )
}
