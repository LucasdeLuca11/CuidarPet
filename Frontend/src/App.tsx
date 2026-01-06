/**
 * Componente Principal da Aplicação
 * 
 * Responsável por:
 * - Configurar rotas
 * - Prover contexto de autenticação
 * - Gerenciar layout
 * - Integrar Navbar
 * - Rotas de Pets
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@contexts/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'
import { Navbar } from '@components/Navbar'
import Layout from '@components/Layout'

// Páginas Públicas
import { LoginPage } from '@pages/LoginPage'
import { RegisterPage } from '@pages/RegisterPage'
import { ForbiddenPage } from '@pages/ForbiddenPage'
import { GoogleCallbackPage } from '@pages/GoogleCallbackPage'
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage'
import { HelpPage } from '@pages/HelpPage'
import { NotFoundPage } from '@pages/NotFoundPage'
import { TermsPage } from '@pages/TermsPage'
import { PrivacyPage } from '@pages/PrivacyPage'

// Páginas Protegidas
import { DashboardPage } from '@pages/DashboardPage'
import { ProfilePage } from '@pages/ProfilePage'
import { MyPetsPage } from '@pages/MyPetsPage'
import { PetDetailsPage } from '@pages/PetDetailsPage'
import { CreateEditPetPage } from '@pages/CreateEditPetPage'

import { UserRole } from '@/types'

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
                <>
                  <Navbar />
                  <Layout />
                </>
              </PrivateRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Rotas do Tutor */}
            {/* Pets */}
            <Route
              path="/pets"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <MyPetsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/pets/create"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <CreateEditPetPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/pets/:petId"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <PetDetailsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/pets/:petId/edit"
              element={
                <PrivateRoute allowedRoles={[UserRole.Tutor, UserRole.Admin]}>
                  <CreateEditPetPage />
                </PrivateRoute>
              }
            />

            {/* Clínicas */}
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

            {/* Agendamentos */}
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

            {/* ===== ROTAS DO VETERINÁRIO ===== */}
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

            {/* ===== PÁGINAS COMPARTILHADAS ===== */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App