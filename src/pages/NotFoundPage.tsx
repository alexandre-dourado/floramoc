import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-md p-10 text-center">
      <h1 className="font-serif text-3xl">Página não encontrada</h1>
      <p className="mt-2 text-muted">O endereço não existe ou o registro não está público.</p>
      <Link to="/" className="btn btn-primary mt-4">Voltar ao mapa</Link>
    </main>
  )
}
