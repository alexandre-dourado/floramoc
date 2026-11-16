import { Link, NavLink, Outlet } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { BRAND } from '../../lib/constants'

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth()
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b border-line bg-cream/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-cream/85 sm:px-5">
        <Link to="/" className="group flex items-center gap-2.5 rounded-lg py-1 pr-2 focus-visible:outline-3 focus-visible:outline-sun" title={BRAND.tagline} aria-label={`${BRAND.name} — página inicial`}>
          <img src="/assets/branding/logo-icon.webp" alt="" width={52} height={36} className="h-9 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3" />
          <span className="leading-none">
            <span className="block whitespace-nowrap font-serif text-[1.35rem] font-bold tracking-tight text-forest sm:text-[1.45rem]">{BRAND.name}</span>
            <span className="eyebrow mt-0.5 hidden !text-[.58rem] sm:block">Atlas botânico urbano</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="ml-auto flex items-center">
          <NavLink to="/" end className="nav-link max-sm:hidden">Mapa</NavLink>
          {user && (
            <NavLink to="/minhas-contribuicoes" className="nav-link">
              <span className="max-sm:hidden">Minhas contribuições</span><span aria-hidden className="sm:hidden">Minhas</span><span className="sr-only sm:hidden">Minhas contribuições</span>
            </NavLink>
          )}
          {isAdmin && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
          {user
            ? <button type="button" onClick={() => void signOut()} className="nav-link">Sair</button>
            : <NavLink to="/entrar" className="nav-link">Entrar</NavLink>}
          <Link to="/contribuir" className="btn btn-primary ml-2 !min-h-10 hidden lg:inline-flex"><Plus aria-hidden className="h-4 w-4" />Adicionar planta</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="mt-4 flex flex-col items-center gap-2 border-t border-line px-4 py-6 text-center text-xs text-muted">
        <img src="/assets/branding/logo.webp" alt={BRAND.name} width={64} height={61} loading="lazy" className="h-16 w-auto opacity-90" />
        <p>{BRAND.tagline}</p>
        <Link to="/privacidade" className="underline underline-offset-2 hover:text-forest">Privacidade</Link>
      </footer>
    </div>
  )
}
