import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource, Map as MLMap } from 'maplibre-gl'
import { config } from '../../lib/config'
import { CATEGORIES, categoryMeta } from '../../lib/constants'
import type { Bounds, PublicPlant } from '../../types'

interface Props {
  plants: PublicPlant[]
  selectedId: string | null
  onSelect: (id: string) => void
  onBounds: (b: Bounds) => void
}

const catColor = ['match', ['get', 'category'], ...CATEGORIES.flatMap((c) => [c.value, c.color]), '#6B6F6B'] as unknown as maplibregl.ExpressionSpecification

export default function PlantsMap({ plants, selectedId, onSelect, onBounds }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const cb = useRef({ onSelect, onBounds })
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => { cb.current = { onSelect, onBounds } })

  useEffect(() => {
    if (!el.current) return
    const map = new maplibregl.Map({
      container: el.current,
      style: config.mapStyleUrl,
      center: [config.center.lng, config.center.lat],
      zoom: config.zoom,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    let timer: ReturnType<typeof setTimeout>
    const emit = () => {
      const b = map.getBounds()
      cb.current.onBounds({ west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() })
    }
    map.on('load', () => {
      map.addSource('plants', { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, cluster: true, clusterRadius: 48, clusterMaxZoom: 16 })
      map.addLayer({ id: 'clusters', type: 'circle', source: 'plants', filter: ['has', 'point_count'],
        paint: { 'circle-color': '#183B32', 'circle-stroke-color': '#DCE6D5', 'circle-stroke-width': 3,
          'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26] } })
      map.addLayer({ id: 'cluster-count', type: 'symbol', source: 'plants', filter: ['has', 'point_count'],
        layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['Noto Sans Regular'], 'text-size': 13 },
        paint: { 'text-color': '#F6F5EF' } })
      map.addLayer({ id: 'point', type: 'circle', source: 'plants', filter: ['!', ['has', 'point_count']],
        paint: { 'circle-color': catColor, 'circle-radius': 11, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 } })
      map.addLayer({ id: 'point-glyph', type: 'symbol', source: 'plants', filter: ['!', ['has', 'point_count']],
        layout: { 'text-field': ['get', 'glyph'], 'text-font': ['Noto Sans Regular'], 'text-size': 12, 'text-allow-overlap': true },
        paint: { 'text-color': '#ffffff' } })
      map.on('click', 'clusters', async (e) => {
        const f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0]
        if (!f) return
        const zoom = await (map.getSource('plants') as GeoJSONSource).getClusterExpansionZoom(f.properties.cluster_id as number)
        map.easeTo({ center: (f.geometry as unknown as { coordinates: [number, number] }).coordinates, zoom })
      })
      map.on('click', 'point', (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined
        if (id) cb.current.onSelect(id)
      })
      for (const l of ['clusters', 'point']) {
        map.on('mouseenter', l, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', l, () => { map.getCanvas().style.cursor = '' })
      }
      setReady(true)
      emit()
    })
    map.on('moveend', () => { clearTimeout(timer); timer = setTimeout(emit, 300) })
    map.on('error', (e) => {
      const status = (e.error as { status?: number } | undefined)?.status
      if (!map.isStyleLoaded() && (status === undefined || status >= 400)) setFailed(true)
    })
    return () => { clearTimeout(timer); map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const src = mapRef.current?.getSource('plants') as GeoJSONSource | undefined
    if (!ready || !src) return
    src.setData({
      type: 'FeatureCollection',
      features: plants.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
        properties: { id: p.id, category: p.category, glyph: categoryMeta(p.category).glyph },
      })),
    })
  }, [plants, ready])

  useEffect(() => {
    const p = plants.find((x) => x.id === selectedId)
    const map = mapRef.current
    if (ready && map && p) map.easeTo({ center: [p.longitude, p.latitude], zoom: Math.max(map.getZoom(), 16) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, ready])

  return (
    <div className="relative h-full w-full">
      <div ref={el} className="h-full w-full" aria-label="Mapa de plantas de Montes Claros" />
      {failed && (
        <div role="alert" className="absolute inset-x-4 top-36 rounded-xl border border-danger bg-white p-3 text-sm shadow">
          O mapa base não pôde ser carregado agora. Use a lista de resultados ou tente novamente em instantes.
        </div>
      )}
    </div>
  )
}
