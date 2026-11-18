import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle, ChevronDown, Leaf } from 'lucide-react'
import { PLANT_SUGGESTIONS, type PlantSuggestion } from '../../lib/plant-suggestions'
import type { Category } from '../../lib/constants'

/** Filtra sugestões por substring normalizada em common_name, other_common_names e scientific_name. */
function search(q: string): PlantSuggestion[] {
  if (q.trim().length < 1) return []
  const norm = q.trim().toLowerCase()
  const starts: PlantSuggestion[] = []
  const contains: PlantSuggestion[] = []
  for (const s of PLANT_SUGGESTIONS) {
    const cn = s.common_name.toLowerCase()
    const sci = s.scientific_name.toLowerCase()
    const others = s.other_common_names.map((n) => n.toLowerCase())
    const matchStart = cn.startsWith(norm) || others.some((o) => o.startsWith(norm))
    const matchContains =
      cn.includes(norm) || sci.includes(norm) || others.some((o) => o.includes(norm))
    if (matchStart) starts.push(s)
    else if (matchContains) contains.push(s)
  }
  return [...starts, ...contains].slice(0, 8)
}

interface PlantComboBoxProps {
  id: string
  value: string
  label: string
  italic?: boolean
  placeholder?: string
  maxLength?: number
  /** Chamado com (common_name, scientific_name?, category?) ao selecionar uma sugestão ou somente (value) ao digitar. */
  onChange: (value: string, scientific_name?: string, category?: Category) => void
}

export default function PlantComboBox({
  id,
  value,
  label,
  italic = false,
  placeholder,
  maxLength = 100,
  onChange,
}: PlantComboBoxProps) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = search(value)

  useEffect(() => {
    if (!open) setActiveIdx(-1)
  }, [open])

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.closest('[data-combobox]')?.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const select = useCallback(
    (s: PlantSuggestion) => {
      onChange(s.common_name, s.scientific_name, s.category)
      setOpen(false)
      inputRef.current?.focus()
    },
    [onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || results.length === 0) {
        if (e.key === 'ArrowDown' && results.length > 0) {
          setOpen(true)
          setActiveIdx(0)
          e.preventDefault()
        }
        return
      }
      if (e.key === 'ArrowDown') {
        setActiveIdx((i) => Math.min(i + 1, results.length - 1))
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        setActiveIdx((i) => Math.max(i - 1, 0))
        e.preventDefault()
      } else if (e.key === 'Enter' && activeIdx >= 0) {
        select(results[activeIdx])
        e.preventDefault()
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    [open, results, activeIdx, select],
  )

  const activeId = activeIdx >= 0 ? `${listId}-${activeIdx}` : undefined

  return (
    <div data-combobox className="relative">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        type="text"
        autoComplete="off"
        className={`field font-serif !text-xl font-semibold pr-9 ${italic ? 'italic' : ''}`}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActiveIdx(-1)
        }}
        onFocus={() => { if (results.length > 0) setOpen(true) }}
        onKeyDown={handleKeyDown}
      />
      {/* Chevron decorativo */}
      {results.length > 0 && value.length > 0 && (
        <ChevronDown
          aria-hidden
          className={`pointer-events-none absolute right-2.5 top-[2.6rem] h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label={`Sugestões para ${label}`}
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-line bg-white shadow-[0_8px_28px_-8px_rgba(24,59,50,.22)] overscroll-contain"
        >
          {results.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); select(s) }}
              className={`flex cursor-pointer items-start gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                i === activeIdx ? 'bg-sage text-forest' : 'hover:bg-cream'
              } ${i > 0 ? 'border-t border-line/60' : ''}`}
            >
              {/* Ícone de planta compacto */}
              <Leaf
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-leaf"
              />
              <div className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-ink">
                  {s.common_name}
                </span>
                <span className="block truncate font-serif text-xs italic text-muted">
                  {s.scientific_name}
                </span>
                {s.other_common_names.length > 0 && (
                  <span className="block text-xs text-muted/70">
                    {s.other_common_names.join(', ')}
                  </span>
                )}
              </div>
              {/* Badges de alerta */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                {s.invasive_alert && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-sun-soft px-1.5 py-0.5 text-[.6rem] font-bold leading-none text-sun-ink">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    Invasora
                  </span>
                )}
                {s.toxic_caution && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-danger/15 px-1.5 py-0.5 text-[.6rem] font-bold leading-none text-danger">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    Tóxica
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
