import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  isAdmin: boolean
  recovery: boolean
  signOut: () => Promise<void>
  clearRecovery: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      if (!data.session) setLoading(false)
    }).catch(() => setLoading(false))
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      if (!session) { setIsAdmin(false); setLoading(false) }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const uid = user?.id
  useEffect(() => {
    if (!uid) return
    let cancelled = false
    supabase.rpc('is_admin').then(({ data }) => {
      if (cancelled) return
      setIsAdmin(data === true)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [uid])

  const value = useMemo<AuthState>(
    () => ({
      user, loading, isAdmin, recovery,
      signOut: async () => { await supabase.auth.signOut() },
      clearRecovery: () => setRecovery(false),
    }),
    [user, loading, isAdmin, recovery],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
