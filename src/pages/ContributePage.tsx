import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LocateFixed, Send, Trash2 } from 'lucide-react'
import LocationPicker, { type Point } from '../components/map/LocationPicker'
import { CategoryIcon, PlantPhoto } from '../components/plants/bits'
import { useAuth } from '../features/auth/AuthContext'
import { CATEGORIES, IDENT_LEVELS, OCCURRENCE_TYPES, PRECISIONS, QUANTITIES, type Category, type IdentificationLevel, type LocationPrecision, type OccurrenceType, type QuantityEstimate } from '../lib/constants'
import { ACCEPTED_PHOTO_TYPES, reprocessPhoto, validatePhoto } from '../lib/image'
import { PHOTO_BUCKET, friendlyError, supabase } from '../lib/supabase'
import { plantFormSchema, toPlantPayload } from '../lib/validation'
import type { Plant } from '../types'

interface FormState {
  unknown: boolean; common_name: string; scientific_name: string; category: Category
  identification_level: IdentificationLevel; occurrence_type: OccurrenceType; quantity_estimate: QuantityEstimate
  location_precision: LocationPrecision; description: string; point: Point | null; acknowledged: boolean
}
const initial: FormState = {
  unknown: false, common_name: '', scientific_name: '', category: 'tree', identification_level: 'identified',
  occurrence_type: 'individual', quantity_estimate: 'unknown', location_precision: 'exact', description: '', point: null, acknowledged: false,
}
const STEPS = ['Localização', 'Identificação', 'Foto e envio']

export default function ContributePage() {
  const { user } = useAuth()
  const nav = useNavigate()
  const { id } = useParams()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initial)
  const [loaded, setLoaded] = useState(!id)
  const [wasApproved, setWasApproved] = useState(false)
  const [oldPhoto, setOldPhoto] = useState<string | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [removeOld, setRemoveOld] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [geoMsg, setGeoMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!id) return
    supabase.from('plants').select('*').eq('id', id).maybeSingle().then(({ data, error: e }) => {
      const p = data as Plant | null
      if (e || !p || (p.status !== 'pending' && p.status !== 'approved')) { setError('Este registro não pode ser editado.'); setLoaded(true); return }
      setWasApproved(p.status === 'approved'); setOldPhoto(p.photo_path)
      setForm({ unknown: p.identification_level === 'unknown', common_name: p.identification_level === 'unknown' ? '' : p.common_name, scientific_name: p.scientific_name ?? '', category: p.category,
        identification_level: p.identification_level === 'unknown' ? 'identified' : p.identification_level, occurrence_type: p.occurrence_type, quantity_estimate: p.quantity_estimate,
        location_precision: p.location_precision, description: p.description ?? '', point: { lat: p.latitude, lng: p.longitude }, acknowledged: false })
      setLoaded(true)
    })
  }, [id])

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  function locate() {
    setGeoMsg(null)
    if (!('geolocation' in navigator)) return setGeoMsg('Seu navegador não oferece geolocalização. Toque no mapa para marcar o ponto.')
    setGeoMsg('Buscando sua localização…')
    navigator.geolocation.getCurrentPosition(
      (pos) => { set('point', { lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoMsg('Localização definida. Arraste o marcador para ajustar.') },
      (err) => setGeoMsg(err.code === 1 ? 'Permissão negada. Toque no mapa para marcar o ponto manualmente.' : err.code === 3 ? 'Tempo esgotado. Tente de novo ou toque no mapa.' : 'Não foi possível obter a localização. Toque no mapa.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  function pickPhoto(file: File | undefined) {
    if (!file) return
    const msg = validatePhoto(file)
    if (msg) return setError(msg)
    setError(null); setPhoto(file); setPreview(URL.createObjectURL(file)); setRemoveOld(true)
  }

  function next() {
    setError(null)
    if (step === 0 && !form.point) return setError('Toque no mapa ou use sua localização para marcar o ponto.')
    if (step === 1) {
      if (!form.unknown && form.common_name.trim().length < 2) return setError('Informe o nome popular ou marque “Não sei identificar”.')
      if (form.description.length > 500) return setError('A observação pode ter até 500 caracteres.')
    }
    setStep((s) => s + 1)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)
    const parsed = plantFormSchema.safeParse({ ...form, latitude: form.point?.lat, longitude: form.point?.lng })
    if (!parsed.success) return setError(parsed.error.issues[0].message)
    setBusy(true)
    let uploaded: string | null = null
    try {
      if (photo) {
        let proc: { blob: Blob; ext: string }
        try { proc = await reprocessPhoto(photo) } catch {
          throw new Error('Não foi possível preparar a foto (remoção de metadados). Tente outra imagem ou remova a foto para enviar sem ela.')
        }
        const path = `${user.id}/${crypto.randomUUID()}.${proc.ext}`
        const up = await supabase.storage.from(PHOTO_BUCKET).upload(path, proc.blob, { contentType: proc.blob.type, upsert: false })
        if (up.error) throw new Error('Falha ao enviar a foto. Tente novamente ou remova a foto para enviar sem ela.')
        uploaded = path
      }
      const photo_path = uploaded ?? (removeOld ? null : oldPhoto)
      const payload = { ...toPlantPayload(parsed.data), photo_path }
      const res = id
        ? await supabase.from('plants').update(payload).eq('id', id)
        : await supabase.from('plants').insert({ ...payload, created_by: user.id, status: 'pending' })
      if (res.error) {
        if (uploaded) await supabase.storage.from(PHOTO_BUCKET).remove([uploaded])
        throw res.error
      }
      if (id && oldPhoto && oldPhoto !== photo_path) await supabase.storage.from(PHOTO_BUCKET).remove([oldPhoto])
      nav('/minhas-contribuicoes', { state: { sent: id ? 'edit' : 'new' } })
    } catch (err) {
      setError(err instanceof Error && !('code' in err) ? err.message : friendlyError(err))
    } finally { setBusy(false) }
  }

  if (!loaded) return <p role="status" className="p-8 text-center text-muted">Carregando…</p>

  return (
    <main className="mx-auto max-w-xl p-3 sm:p-4">
      <div className="fiche rise">
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Caderno de campo · Flora MOC</p>
            <h1 className="mt-1 text-[2.4rem] font-bold leading-none text-forest">{id ? 'Editar registro' : 'Adicionar planta'}</h1>
          </div>
          <span className="fiche-stamp mt-1 shrink-0"><img src="/assets/branding/logo-icon.webp" alt="" aria-hidden className="h-4 w-auto" />Ficha de campo</span>
        </div>
        <ol className="relative mt-5 grid grid-cols-3 gap-2" aria-label="Etapas">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined} className="space-y-1">
              <span className={`block h-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-forest' : 'bg-line'}`} />
              <span className={`eyebrow block ${i === step ? '!text-forest' : ''}`}>Etapa {i + 1}</span>
              <span className={`block font-serif text-lg font-semibold leading-tight ${i === step ? 'text-forest' : 'text-muted'}`}>{s}</span>
            </li>
          ))}
        </ol>
        {wasApproved && <p role="note" className="relative mt-4 rounded-lg border border-sun bg-sun-soft p-2.5 text-sm">Este registro está aprovado. Ao salvar, ele volta para análise e <b>sai temporariamente do mapa público</b> até nova revisão.</p>}
        <form onSubmit={submit} className="relative mt-5 space-y-4" noValidate>
          {step === 0 && (
            <section className="pop space-y-3" aria-label="Localização">
              <p className="text-sm">Toque no mapa para marcar a planta e arraste o marcador para ajustar.</p>
              <LocationPicker value={form.point} onChange={(p) => set('point', p)} />
              <button type="button" className="btn btn-ghost" onClick={locate}><LocateFixed aria-hidden className="h-4 w-4" />Usar minha localização</button>
              {geoMsg && <p role="status" className="text-sm">{geoMsg}</p>}
              <p className="rounded-lg border border-dashed border-leaf bg-white/70 px-3 py-2 font-mono text-xs" aria-live="polite">{form.point ? `Ponto marcado: ${form.point.lat.toFixed(5)}, ${form.point.lng.toFixed(5)}` : 'Nenhum ponto marcado ainda.'}</p>
              <fieldset><legend className="label">Precisão</legend>
                <div className="flex gap-4">{PRECISIONS.map((p) => <label key={p.value} className="flex min-h-11 items-center gap-2"><input type="radio" name="prec" className="accent-forest" checked={form.location_precision === p.value} onChange={() => set('location_precision', p.value)} />{p.label}</label>)}</div>
              </fieldset>
            </section>
          )}
          {step === 1 && (
            <section className="pop space-y-4" aria-label="Identificação">
              <label className="flex min-h-11 items-center gap-2 font-semibold"><input type="checkbox" className="h-5 w-5 accent-forest" checked={form.unknown} onChange={(e) => set('unknown', e.target.checked)} />Não sei identificar</label>
              {!form.unknown && (
                <>
                  <div><label className="label" htmlFor="cn">Nome popular *</label><input id="cn" className="field font-serif !text-xl font-semibold" maxLength={100} value={form.common_name} onChange={(e) => set('common_name', e.target.value)} /></div>
                  <div><label className="label" htmlFor="sn">Nome científico (opcional)</label><input id="sn" className="field font-serif !text-xl italic" maxLength={150} value={form.scientific_name} onChange={(e) => set('scientific_name', e.target.value)} /></div>
                  <div><label className="label" htmlFor="il">Grau de identificação</label>
                    <select id="il" className="field" value={form.identification_level} onChange={(e) => set('identification_level', e.target.value as IdentificationLevel)}>
                      {IDENT_LEVELS.filter((l) => l.value !== 'unknown').map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select></div>
                </>
              )}
              <fieldset><legend className="label">Categoria *</legend>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((c) => (
                    <label key={c.value} className="tile">
                      <input type="radio" name="category" value={c.value} className="sr-only" checked={form.category === c.value} onChange={() => set('category', c.value)} />
                      <span aria-hidden className="h-9 w-9"><CategoryIcon category={c.value} /></span>
                      {c.label.split(' / ')[0]}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label" htmlFor="ot">Tipo</label>
                  <select id="ot" className="field" value={form.occurrence_type} onChange={(e) => set('occurrence_type', e.target.value as OccurrenceType)}>{OCCURRENCE_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label className="label" htmlFor="qe">Quantidade</label>
                  <select id="qe" className="field" value={form.quantity_estimate} onChange={(e) => set('quantity_estimate', e.target.value as QuantityEstimate)}>{QUANTITIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div><label className="label" htmlFor="ds">Observação (opcional)</label><textarea id="ds" className="field" rows={3} maxLength={500} value={form.description} onChange={(e) => set('description', e.target.value)} /><p className="mt-0.5 text-right text-xs text-muted tabular-nums">{form.description.length}/500</p></div>
            </section>
          )}
          {step === 2 && (
            <section className="pop space-y-4" aria-label="Foto e envio">
              <div>
                <label className="label" htmlFor="ph">Foto (opcional, JPEG/PNG/WebP até 5 MB)</label>
                <input id="ph" type="file" accept={ACCEPTED_PHOTO_TYPES.join(',')} className="field file:mr-3 file:rounded-lg file:border-0 file:bg-sage file:px-3 file:py-1.5 file:font-semibold file:text-forest" onChange={(e) => pickPhoto(e.target.files?.[0])} />
                {preview ? <img src={preview} alt="Pré-visualização da foto escolhida" className="mt-2 aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-line" />
                  : oldPhoto && !removeOld ? <PlantPhoto path={oldPhoto} alt="Foto atual" className="mt-2 aspect-[4/3] w-full rounded-2xl ring-1 ring-line" /> : null}
                {(photo || (oldPhoto && !removeOld)) && <button type="button" className="btn btn-ghost mt-2" onClick={() => { setPhoto(null); setPreview(null); setRemoveOld(true) }}><Trash2 aria-hidden className="h-4 w-4" />Remover foto</button>}
                <p className="mt-1 text-xs text-muted">A foto é reprocessada no seu navegador para remover metadados (como GPS).</p>
              </div>
              <div className="rounded-xl border border-line bg-white/70 p-3">
                <p className="eyebrow mb-1.5">Boas práticas de campo</p>
                <ul className="list-disc space-y-1 pl-5 text-xs marker:text-leaf">
                  <li>Não entre em terreno privado para fotografar ou marcar uma planta.</li>
                  <li>Não retire folhas, flores, frutos, sementes ou mudas.</li>
                  <li>Não consuma nem use plantas como medicamento com base no mapa.</li>
                  <li>A identificação é comunitária e pode estar incorreta.</li>
                </ul>
              </div>
              <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 h-5 w-5 accent-forest" checked={form.acknowledged} onChange={(e) => set('acknowledged', e.target.checked)} />
                <span>Confirmo que o ponto está em espaço público ou que a planta pode ser observada de um local público. Não estou registrando endereço residencial, quintal privado, área restrita ou localização que exponha alguém a risco.</span></label>
            </section>
          )}
          {error && <p role="alert" className="err rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">{error}</p>}
          <div className="flex gap-2 border-t border-dashed border-forest/25 pt-4">
            {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => { setError(null); setStep(step - 1) }}><ArrowLeft aria-hidden className="h-4 w-4" />Voltar</button>}
            {step < 2 ? <button type="button" className="btn btn-primary ml-auto" onClick={next}>Continuar<ArrowRight aria-hidden className="h-4 w-4" /></button>
              : <button className="btn btn-primary ml-auto" disabled={busy || !form.acknowledged}><Send aria-hidden className="h-4 w-4" />{busy ? 'Enviando…' : id ? 'Salvar e enviar para análise' : 'Enviar para análise'}</button>}
          </div>
        </form>
      </div>
    </main>
  )
}
