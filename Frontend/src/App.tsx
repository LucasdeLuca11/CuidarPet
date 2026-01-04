/**
 * Componente Principal da Aplicação
 * 
 * Responsável por:
 * - Configurar rotas
 * - Prover contexto de autenticação
 * - Gerenciar layout
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@contexts/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'
import Layout from '@components/Layout'
import { LoginPage } from '@pages/LoginPage'
import { RegisterPage } from '@pages/RegisterPage'
import { DashboardPage } from '@pages/DashboardPage'
import { ForbiddenPage } from '@pages/ForbiddenPage'
import { UserRole } from '@/types'
import { GoogleCallbackPage } from '@pages/GoogleCallbackPage'
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage'
import { HelpPage } from '@pages/HelpPage'
import { NotFoundPage } from '@pages/NotFoundPage'
import { TermsPage } from '@pages/TermsPage'
import { PrivacyPage } from '@pages/PrivacyPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/auth/callback" element={<GoogleCallbackPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Rotas Protegidas */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Rotas do Tutor */}
            <Route
              path="/pets"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Meus Pets</h1>
                    <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
                  </div>
                </PrivateRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Meus Agendamentos</h1>
                    <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
                  </div>
                </PrivateRoute>
              }
            />

            <Route
              path="/clinics"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Clínicas</h1>
                    <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
                  </div>
                </PrivateRoute>
              }
            />

            {/* Rotas do Veterinário */}
            <Route
              path="/clinic"
              element={
                <PrivateRoute allowedRoles={[UserRole.Veterinarian, UserRole.Admin]}>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Minha Clínica</h1>
                    <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
                  </div>
                </PrivateRoute>
              }
            />

            <Route
              path="/services"
              element={
                <PrivateRoute allowedRoles={[UserRole.Veterinarian, UserRole.Admin]}>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Serviços</h1>
                    <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
                  </div>
                </PrivateRoute>
              }
            />

            <Route
              path="/clinic-appointments"
              element={
                <PrivateRoute allowedRoles={[UserRole.Veterinarian, UserRole.Admin]}>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Agendamentos da Clínica</h1>
                    <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
                  </div>
                </PrivateRoute>
              }
            />
          </Route>

          {/* Rota Padrão */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />  {/* alterar */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App