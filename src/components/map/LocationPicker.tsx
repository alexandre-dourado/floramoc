import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import type { Map as MLMap, Marker } from 'maplibre-gl'
import { config } from '../../lib/config'

export interface Point { lat: number; lng: number }
interface Props { value: Point | null; onChange: (p: Point) => void; height?: string }

export default function LocationPicker({ value, onChange, height = '320px' }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const onChangeRef = useRef(onChange)
  const first = useRef(value)
  useEffect(() => { onChangeRef.current = onChange })

  useEffect(() => {
    if (!el.current) return
    const start = first.current ?? config.center
    const map = new maplibregl.Map({ container: el.current, style: config.mapStyleUrl, center: [start.lng, start.lat], zoom: first.current ? 17 : config.zoom })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    const place = (p: Point) => {
      if (!markerRef.current) {
        const m = new maplibregl.Marker({ draggable: true, color: '#183B32' }).setLngLat([p.lng, p.lat]).addTo(map)
        m.on('dragend', () => { const ll = m.getLngLat(); onChangeRef.current({ lat: ll.lat, lng: ll.lng }) })
        markerRef.current = m
      } else markerRef.current.setLngLat([p.lng, p.lat])
    }
    if (first.current) place(first.current)
    map.on('click', (e) => { place({ lat: e.lngLat.lat, lng: e.lngLat.lng }); onChangeRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng }) })
    return () => { map.remove(); mapRef.current = null; markerRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !value) return
    if (!markerRef.current) {
      const m = new maplibregl.Marker({ draggable: true, color: '#183B32' }).setLngLat([value.lng, value.lat]).addTo(map)
      m.on('dragend', () => { const ll = m.getLngLat(); onChangeRef.current({ lat: ll.lat, lng: ll.lng }) })
      markerRef.current = m
    } else {
      const cur = markerRef.current.getLngLat()
      if (cur.lat !== value.lat || cur.lng !== value.lng) markerRef.current.setLngLat([value.lng, value.lat])
    }
    const c = map.getCenter()
    if (Math.abs(c.lat - value.lat) > 0.0005 || Math.abs(c.lng - value.lng) > 0.0005) map.easeTo({ center: [value.lng, value.lat], zoom: Math.max(map.getZoom(), 17) })
  }, [value])

  return <div ref={el} style={{ height }} className="w-full overflow-hidden rounded-2xl border border-[#c9cfc3]" aria-label="Mapa para marcar a localização da planta" />
}
