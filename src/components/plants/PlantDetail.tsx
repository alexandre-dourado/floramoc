import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Link2, X } from 'lucide-react'
import { CategoryBadge, PlantPhoto } from './bits'
import ReportForm from './ReportForm'
import { IDENT_LEVELS, OCCURRENCE_TYPES, PRECISIONS, QUANTITIES, labelOf } from '../../lib/constants'
import type { PublicPlant } from '../../types'

export default function PlantDetail({ plant, onClose }: { plant: PublicPlant; onClose?: () => void }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/plantas/${plant.id}`)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { window.prompt('Copie o link:', `${window.location.origin}/plantas/${plant.id}`) }
  }
  return (
    <article className="space-y-3 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl leading-tight">{plant.common_name}</h2>
          {plant.scientific_name && <p className="italic text-muted">{plant.scientific_name}</p>}
        </div>
        {onClose && <button type="button" className="btn btn-ghost !min-h-11 !px-3" onClick={onClose} aria-label="Fechar detalhes"><X aria-hidden className="h-4 w-4" /></button>}
      </div>
      <PlantPhoto path={plant.photo_path} alt={`Foto de ${plant.common_name}`} className="h-48 w-full rounded-xl" />
      <div className="flex flex-wrap gap-2"><CategoryBadge category={plant.category} /></div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div><dt className="text-muted">Identificação</dt><dd className="font-semibold">{labelOf(IDENT_LEVELS, plant.identification_level)}</dd></div>
        <div><dt className="text-muted">Tipo</dt><dd className="font-semibold">{labelOf(OCCURRENCE_TYPES, plant.occurrence_type)}</dd></div>
        <div><dt className="text-muted">Quantidade</dt><dd className="font-semibold">{labelOf(QUANTITIES, plant.quantity_estimate)}</dd></div>
        <div><dt className="text-muted">Localização</dt><dd className="font-semibold">{labelOf(PRECISIONS, plant.location_precision)}</dd></div>
      </dl>
      {plant.description && <p className="whitespace-pre-wrap text-sm">{plant.description}</p>}
      <p className="rounded-lg bg-sage/60 p-2 text-xs text-muted">
        Identificação informada pela comunidade, sem validação científica. Este mapa não orienta coleta, poda, consumo nem uso medicinal.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" onClick={copy}>
          {copied ? <Check aria-hidden className="h-4 w-4" /> : <Link2 aria-hidden className="h-4 w-4" />}{copied ? 'Link copiado' : 'Copiar link'}
        </button>
        <Link to={`/plantas/${plant.id}`} className="btn btn-ghost">Abrir página</Link>
      </div>
      <ReportForm plantId={plant.id} />
    </article>
  )
}
