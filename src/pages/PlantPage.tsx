import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PlantDetail from '../components/plants/PlantDetail'
import { fetchPublicPlant } from '../features/plants/api'
import { friendlyError } from '../lib/supabase'
import NotFoundPage from './NotFoundPage'
import type { PublicPlant } from '../types'

export default function PlantPage() {
  const { id = '' } = useParams()
  const [state, setState] = useState<{ plant: PublicPlant | null; error: string | null; loading: boolean }>({ plant: null, error: null, loading: true })
  useEffect(() => {
    let off = false
    fetchPublicPlant(id)
      .then((plant) => !off && setState({ plant, error: null, loading: false }))
      .catch((e) => !off && setState({ plant: null, error: friendlyError(e), loading: false }))
    return () => { off = true }
  }, [id])

  if (state.loading) return <p role="status" className="p-8 text-center text-muted">Carregando…</p>
  if (state.error) return <p role="alert" className="err p-8 text-center">{state.error}</p>
  if (!state.plant) return <NotFoundPage />
  return (
    <main className="mx-auto max-w-xl">
      <p className="p-3 text-sm"><Link to="/" className="underline">← Voltar ao mapa</Link></p>
      <PlantDetail plant={state.plant} />
    </main>
  )
}
