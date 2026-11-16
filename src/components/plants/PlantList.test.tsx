import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import PlantList from './PlantList'
import type { PublicPlant } from '../../types'

const plant: PublicPlant = { id: 'a', common_name: 'Ipê-amarelo', scientific_name: null, category: 'tree', identification_level: 'probable', occurrence_type: 'individual', quantity_estimate: 'one', latitude: -16.7, longitude: -43.8, location_precision: 'exact', photo_path: null, description: null, created_at: '', updated_at: '' }
const wrap = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)
const noop = () => {}

describe('PlantList', () => {
  it('mostra estado vazio com chamada para contribuir', () => {
    wrap(<PlantList plants={[]} loading={false} error={null} selectedId={null} onSelect={noop} onRetry={noop} />)
    expect(screen.getByText('Nenhuma planta registrada nesta área')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Adicionar planta/ })).toHaveAttribute('href', '/contribuir')
  })
  it('mostra erro com nova tentativa', async () => {
    const retry = vi.fn()
    wrap(<PlantList plants={[]} loading={false} error="Erro de conexão." selectedId={null} onSelect={noop} onRetry={retry} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(retry).toHaveBeenCalled()
  })
  it('lista e seleciona plantas', async () => {
    const sel = vi.fn()
    wrap(<PlantList plants={[plant]} loading={false} error={null} selectedId={null} onSelect={sel} onRetry={noop} />)
    await userEvent.click(screen.getByRole('button', { name: /Ipê-amarelo/ }))
    expect(sel).toHaveBeenCalledWith('a')
  })
})
