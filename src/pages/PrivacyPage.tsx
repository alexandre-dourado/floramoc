import { config } from '../lib/config'

export default function PrivacyPage() {
  return (
    <main className="prose-sm mx-auto max-w-2xl space-y-3 p-5">
      <h1 className="font-serif text-3xl">Privacidade</h1>
      <p>O Flora MOC é um catálogo colaborativo de observações de plantas em Montes Claros/MG. Este é um aviso inicial, em linguagem simples, e deve ser revisado pelo responsável pelo projeto antes do lançamento público.</p>
      <h2 className="font-serif text-xl">O que guardamos</h2>
      <ul className="list-disc pl-6">
        <li>Seu e-mail, usado apenas para autenticação e mensagens transacionais de conta.</li>
        <li>Coordenadas, identificação, observação e foto de cada registro, para formar o mapa colaborativo.</li>
        <li>Denúncias e sugestões de correção, visíveis somente à moderação.</li>
      </ul>
      <h2 className="font-serif text-xl">O que aparece publicamente</h2>
      <p>Registros só se tornam públicos depois de aprovados. Seu e-mail, identificador e dados de autenticação nunca são exibidos. Evite fotos que mostrem pessoas, placas de veículos ou fachadas; a foto é reprocessada no seu navegador para remover metadados (como GPS) antes do envio, quando possível.</p>
      <h2 className="font-serif text-xl">Localização do dispositivo</h2>
      <p>Só é solicitada quando você toca em “Usar minha localização”. Não registramos deslocamentos nem usamos rastreadores de publicidade.</p>
      <h2 className="font-serif text-xl">Serviços de infraestrutura</h2>
      <p>Os dados são processados por Supabase (banco, autenticação e arquivos), Vercel (hospedagem) e OpenFreeMap/OpenStreetMap (mapa base).</p>
      <h2 className="font-serif text-xl">Cautelas</h2>
      <p>A identificação é comunitária e pode estar incorreta. O mapa não orienta coleta, poda, consumo ou uso medicinal. Não registre endereços residenciais, quintais privados ou áreas restritas.</p>
      <h2 className="font-serif text-xl">Exclusão e contato</h2>
      <p>Você pode pedir a exclusão da conta ou de contribuições, respeitadas obrigações legítimas de segurança e moderação.</p>
      {config.contactEmail ? (
        <p>Contato do responsável: <a className="font-semibold underline" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></p>
      ) : import.meta.env.DEV ? (
        <p role="note" className="rounded-lg border border-sun p-2">[Somente desenvolvimento] Defina VITE_CONTACT_EMAIL antes de publicar.</p>
      ) : null}
    </main>
  )
}
