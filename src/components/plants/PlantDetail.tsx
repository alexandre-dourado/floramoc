import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ExternalLink, Link2, X } from 'lucide-react'
import { CategoryIcon, CertaintyBadge, PlantPhoto } from './bits'
import ReportForm from './ReportForm'
import { IDENT_LEVELS, OCCURRENCE_TYPES, PRECISIONS, QUANTITIES, categoryMeta, labelOf } from '../../lib/constants'
import type { PublicPlant } from '../../types'

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-2">
      <dt className="eyebrow">{term}</dt>
      <dd className="mt-0.5 text-sm font-semibold">{children}</dd>
    </div>
  )
}

export default function PlantDetail({ plant, onClose }: { plant: PublicPlant; onClose?: () => void }) {
  const [copied, setCopied] = useState(false)
  const cat = categoryMeta(plant.category)
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/plantas/${plant.id}`)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { window.prompt('Copie o link:', `${window.location.origin}/plantas/${plant.id}`) }
  }
  return (
    <article className="rise space-y-4 p-3 pb-5">
      <div className="relative">
        <PlantPhoto path={plant.photo_path} alt={`Foto de ${plant.common_name}`} className="aspect-[4/3] w-full rounded-2xl shadow-sm ring-1 ring-line" />
        {onClose && (
          <button type="button" className="glass absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-ink transition-transform hover:scale-105" onClick={onClose} aria-label="Fechar detalhes">
            <X aria-hidden className="h-4 w-4" />
          </button>
        )}
        <span className="glass absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-bold text-forest">
          <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-white"><CategoryIcon category={plant.category} className="h-5 w-5" /></span>
          {cat.label}
        </span>
      </div>

      <header className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2"><CertaintyBadge level={plant.identification_level} /><span className="eyebrow">{cat.label.split(' / ')[0]}</span></div>
        <h2 className="font-serif text-[2.1rem] font-bold leading-[1.05] text-forest">{plant.common_name}</h2>
        {plant.scientific_name
          ? <p className="font-serif text-xl italic leading-tight text-moss">{plant.scientific_name}</p>
          : <p className="font-serif text-lg italic leading-tight text-muted/70">nome científico não informado</p>}
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Fact term="Identificação">{labelOf(IDENT_LEVELS, plant.identification_level)}</Fact>
        <Fact term="Tipo">{labelOf(OCCURRENCE_TYPES, plant.occurrence_type)}</Fact>
        <Fact term="Quantidade">{labelOf(QUANTITIES, plant.quantity_estimate)}</Fact>
        <Fact term="Localização">{labelOf(PRECISIONS, plant.location_precision)}</Fact>
      </dl>

      {plant.description && (
        <blockquote className="border-l-2 border-sun pl-3 font-serif text-lg leading-snug text-ink/90"><p className="whitespace-pre-wrap">{plant.description}</p></blockquote>
      )}

      <p className="rounded-xl border border-line bg-cream p-3 text-xs leading-relaxed text-muted">
        Identificação informada pela comunidade, sem validação científica. Este mapa não orienta coleta, poda, consumo nem uso medicinal.
      </p>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" onClick={copy}>
          {copied ? <Check aria-hidden className="h-4 w-4 text-moss" /> : <Link2 aria-hidden className="h-4 w-4" />}{copied ? 'Link copiado' : 'Copiar link'}
        </button>
        <Link to={`/plantas/${plant.id}`} className="btn btn-ghost"><ExternalLink aria-hidden className="h-4 w-4" />Abrir página</Link>
      </div>
      <ReportForm plantId={plant.id} />
    </article>
  )
}
