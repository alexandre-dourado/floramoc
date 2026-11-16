import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import AuthPage from '../pages/AuthPage'
import ConfigMissing from '../pages/ConfigMissing'
import ContributePage from '../pages/ContributePage'
import HomePage from '../pages/HomePage'
import MyContributionsPage from '../pages/MyContributionsPage'
import NotFoundPage from '../pages/NotFoundPage'
import PlantPage from '../pages/PlantPage'
import PrivacyPage from '../pages/PrivacyPage'
import { isConfigured } from '../lib/config'

const AdminPage = lazy(() => import('../pages/AdminPage'))

export default function App() {
  if (!isConfigured) return <ConfigMissing />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="plantas/:id" element={<PlantPage />} />
        <Route path="entrar" element={<AuthPage />} />
        <Route path="contribuir" element={<ProtectedRoute><ContributePage /></ProtectedRoute>} />
        <Route path="contribuir/:id" element={<ProtectedRoute><ContributePage /></ProtectedRoute>} />
        <Route path="minhas-contribuicoes" element={<ProtectedRoute><MyContributionsPage /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute admin><Suspense fallback={<p role="status" className="p-8 text-center">Carregando…</p>}><AdminPage /></Suspense></ProtectedRoute>} />
        <Route path="privacidade" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
