import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PromoVideoModal from './PromoVideoModal'

describe('PromoVideoModal', () => {
  it('não renderiza nada quando isOpen é falso', () => {
    const { container } = render(<PromoVideoModal isOpen={false} onClose={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza diálogo, vídeo e botão fechar quando aberto', () => {
    render(<PromoVideoModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Apresentação do Flora MOC' })).toBeInTheDocument()
    expect(screen.getByLabelText('Fechar vídeo promocional')).toBeInTheDocument()
    expect(screen.getByLabelText(/Ativar som da narração/i)).toBeInTheDocument()
  })

  it('chama onClose ao clicar no botão X', async () => {
    const onClose = vi.fn()
    render(<PromoVideoModal isOpen={true} onClose={onClose} />)
    await userEvent.click(screen.getByLabelText('Fechar vídeo promocional'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('chama onClose ao pressionar Escape', () => {
    const onClose = vi.fn()
    render(<PromoVideoModal isOpen={true} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('alterna o estado de mudo ao clicar no botão de áudio', async () => {
    render(<PromoVideoModal isOpen={true} onClose={vi.fn()} />)
    const audioBtn = screen.getByLabelText(/Ativar som/i)
    await userEvent.click(audioBtn)
    expect(screen.getByLabelText(/Desativar som/i)).toBeInTheDocument()
  })
})
