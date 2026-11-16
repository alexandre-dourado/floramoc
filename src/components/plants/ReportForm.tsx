import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { REPORT_REASONS, type ReportReason } from '../../lib/constants'
import { friendlyError, supabase } from '../../lib/supabase'

export default function ReportForm({ plantId }: { plantId: string }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>('wrong_id')
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (!open) return <button type="button" className="btn btn-ghost" onClick={() => setOpen(true)}>Sugerir correção</button>
  if (!user) {
    return <p className="text-sm">Para sugerir uma correção, <Link className="font-semibold underline" to="/entrar" state={{ from: `/plantas/${plantId}` }}>entre ou crie uma conta</Link>.</p>
  }
  if (msg?.ok) return <p role="status" className="text-sm font-semibold text-forest">{msg.text}</p>

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const { error } = await supabase.from('plant_reports').insert({ plant_id: plantId, reported_by: user!.id, reason, details: details.trim() || null, status: 'open' })
    setBusy(false)
    setMsg(error ? { ok: false, text: friendlyError(error) } : { ok: true, text: 'Obrigado! Sua sugestão foi enviada à moderação.' })
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <div>
        <label className="label" htmlFor="report-reason">Motivo</label>
        <select id="report-reason" className="field" value={reason} onChange={(e) => setReason(e.target.value as ReportReason)}>
          {REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="report-details">Detalhes (opcional)</label>
        <textarea id="report-details" className="field" rows={3} maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)} />
      </div>
      {msg && !msg.ok && <p role="alert" className="err">{msg.text}</p>}
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Enviando…' : 'Enviar'}</button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </form>
  )
}
