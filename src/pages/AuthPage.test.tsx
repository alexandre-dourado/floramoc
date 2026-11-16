import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AuthPage from './AuthPage'

vi.mock('../features/auth/AuthContext', () => ({ useAuth: () => ({ user: null, recovery: false, clearRecovery: () => {} }) }))
vi.mock('../lib/supabase', () => ({ supabase: { auth: {} } }))

describe('AuthPage', () => {
  it('valida e-mail e senha antes de enviar', async () => {
    render(<MemoryRouter><AuthPage /></MemoryRouter>)
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('e-mail válido')
    await userEvent.type(screen.getByLabelText('E-mail'), 'a@b.co')
    await userEvent.type(screen.getByLabelText('Senha'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('8 caracteres')
  })
  it('alterna para criar conta', async () => {
    render(<MemoryRouter><AuthPage /></MemoryRouter>)
    await userEvent.click(screen.getByRole('button', { name: 'Criar uma conta' }))
    expect(screen.getByRole('heading', { name: 'Criar conta' })).toBeInTheDocument()
  })
})
