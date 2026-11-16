import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { supabase } from '../lib/supabase'

type Mode = 'signin' | 'signup' | 'reset'

function authMessage(msg: string): string {
  if (/invalid login/i.test(msg)) return 'E-mail ou senha incorretos.'
  if (/not confirmed/i.test(msg)) return 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).'
  if (/already registered/i.test(msg)) return 'Este e-mail já tem cadastro. Tente entrar.'
  if (/password/i.test(msg)) return 'A senha precisa ter pelo menos 8 caracteres.'
  if (/rate|too many/i.test(msg)) return 'Muitas tentativas. Aguarde um pouco e tente de novo.'
  return 'Não foi possível concluir. Tente novamente.'
}

export default function AuthPage() {
  const { user, recovery, clearRecovery } = useAuth()
  const nav = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/contribuir'
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setInfo(null)
    if (!recovery && !/^\S+@\S+\.\S+$/.test(email)) return setError('Informe um e-mail válido.')
    if (mode !== 'reset' && password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.')
    setBusy(true)
    try {
      if (recovery) {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        clearRecovery(); nav('/', { replace: true })
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        nav(from, { replace: true })
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/entrar` } })
        if (error) throw error
        if (data.session) nav(from, { replace: true })
        else setInfo('Conta criada. Enviamos um e-mail de confirmação: abra o link e depois entre.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/entrar` })
        if (error) throw error
        setInfo('Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.')
      }
    } catch (err) {
      setError(authMessage((err as Error).message ?? ''))
    } finally { setBusy(false) }
  }

  if (user && !recovery) return <Navigate to={from} replace />

  const title = recovery ? 'Definir nova senha' : mode === 'signin' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Recuperar senha'
  return (
    <main className="mx-auto max-w-sm p-5">
      <h1 className="font-serif text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted">Consultar o mapa não exige conta. Para registrar plantas ou sugerir correções, entre.</p>
      <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
        {!recovery && (
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        {(mode !== 'reset' || recovery) && (
          <div>
            <label className="label" htmlFor="password">{recovery ? 'Nova senha' : 'Senha'}</label>
            <input id="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        {error && <p role="alert" className="err">{error}</p>}
        {info && <p role="status" className="text-sm font-semibold text-forest">{info}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Aguarde…' : title}</button>
      </form>
      {!recovery && (
        <div className="mt-4 flex flex-col gap-1 text-sm">
          {mode !== 'signin' && <button type="button" className="min-h-11 text-left underline" onClick={() => setMode('signin')}>Já tenho conta</button>}
          {mode !== 'signup' && <button type="button" className="min-h-11 text-left underline" onClick={() => setMode('signup')}>Criar uma conta</button>}
          {mode !== 'reset' && <button type="button" className="min-h-11 text-left underline" onClick={() => setMode('reset')}>Esqueci a senha</button>}
        </div>
      )}
    </main>
  )
}
