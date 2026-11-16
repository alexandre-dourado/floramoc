import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) return <div role="status" className="p-8 text-center text-muted">Carregando…</div>
  if (!user) return <Navigate to="/entrar" replace state={{ from: location.pathname + location.search }} />
  if (admin && !isAdmin) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-serif text-2xl">Acesso negado</h1>
        <p className="mt-2 text-muted">Esta área é restrita à moderação do Flora MOC.</p>
        <Link to="/" className="btn btn-primary mt-4">Voltar ao mapa</Link>
      </div>
    )
  }
  return <>{children}</>
}
