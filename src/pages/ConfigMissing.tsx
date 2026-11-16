export default function ConfigMissing() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="font-serif text-3xl">Configuração pendente</h1>
      <p className="mt-3">O Flora MOC ainda não está conectado ao Supabase. Crie um arquivo <code>.env.local</code> a partir de <code>.env.example</code> e preencha:</p>
      <ul className="mt-3 list-disc pl-6 font-mono text-sm">
        <li>VITE_SUPABASE_URL</li>
        <li>VITE_SUPABASE_PUBLISHABLE_KEY</li>
      </ul>
      <p className="mt-3 text-sm text-muted">Depois reinicie o servidor (<code>npm run dev</code>). No Vercel, defina as mesmas variáveis e refaça o deploy. Detalhes no README.</p>
    </main>
  )
}
