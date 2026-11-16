import { Link, NavLink, Outlet } from 'react-router-dom'
import { Leaf, Plus } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { BRAND } from '../../lib/constants'

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth()
  const nav = 'rounded-lg px-2 py-2 text-sm font-semibold hover:bg-white/10 aria-[current=page]:underline'
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-forest px-3 text-paper">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg" title={BRAND.tagline}>
          <Leaf aria-hidden className="h-5 w-5 text-sage" />{BRAND.name}
        </Link>
        <nav aria-label="Principal" className="ml-auto flex items-center gap-1">
          {user && <NavLink to="/minhas-contribuicoes" className={nav}>Minhas contribuições</NavLink>}
          {isAdmin && <NavLink to="/admin" className={nav}>Admin</NavLink>}
          {user
            ? <button type="button" onClick={() => void signOut()} className={nav}>Sair</button>
            : <NavLink to="/entrar" className={nav}>Entrar</NavLink>}
          <Link to="/contribuir" className="btn !min-h-10 hidden bg-sun text-ink hover:brightness-95 lg:inline-flex"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="px-4 py-6 text-center text-xs text-muted">
        <Link to="/privacidade" className="underline">Privacidade</Link> · {BRAND.tagline}
      </footer>
    </div>
  )
}
