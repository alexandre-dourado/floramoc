import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

const auth = vi.hoisted(() => ({ value: { user: null as unknown, loading: false, isAdmin: false } }))
vi.mock('./AuthContext', () => ({ useAuth: () => auth.value }))

function setup(admin = false) {
  render(
    <MemoryRouter initialEntries={['/x']}>
      <Routes>
        <Route path="/x" element={<ProtectedRoute admin={admin}><p>conteúdo</p></ProtectedRoute>} />
        <Route path="/entrar" element={<p>tela de login</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => { auth.value = { user: null, loading: false, isAdmin: false } })
  it('redireciona visitante para o login', () => { setup(); expect(screen.getByText('tela de login')).toBeInTheDocument() })
  it('mostra carregando enquanto resolve a sessão', () => { auth.value.loading = true; setup(); expect(screen.getByRole('status')).toBeInTheDocument() })
  it('libera usuário autenticado', () => { auth.value.user = { id: '1' }; setup(); expect(screen.getByText('conteúdo')).toBeInTheDocument() })
  it('nega /admin a usuário comum', () => { auth.value.user = { id: '1' }; setup(true); expect(screen.getByText('Acesso negado')).toBeInTheDocument() })
  it('libera /admin para administrador', () => { auth.value = { user: { id: '1' }, loading: false, isAdmin: true }; setup(true); expect(screen.getByText('conteúdo')).toBeInTheDocument() })
})
