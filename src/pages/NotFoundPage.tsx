import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md p-10 text-center">
      <img src="/assets/branding/logo-icon.webp" alt="" aria-hidden className="mx-auto mb-3 h-24 w-auto opacity-80" />
      <h1 className="text-4xl font-bold text-forest">Página não encontrada</h1>
      <p className="mt-2 text-muted">O endereço não existe ou o registro não está público.</p>
      <Link to="/" className="btn btn-primary mt-4">Voltar ao mapa</Link>
    </main>
  )
}
