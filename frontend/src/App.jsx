import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProjectBoard from './pages/ProjectBoard'
import Landing from './pages/Landing'
import Team from './pages/Team'
import ProtectedRoute from './components/ProtectedRoute'

import LoadingScreen from './components/LoadingScreen'
import AppLayout from './components/AppLayout'
import { ToastProvider } from './components/Toast'
import { useAuth } from './context/AuthContext'

function RootRedirect() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <Landing />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectBoard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectID"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectBoard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Team />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <div className="p-10 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h2 className="text-2xl font-heading font-bold text-mist-100 mb-2">Settings</h2>
                  <p className="text-mist-500 text-sm">Coming Soon</p>
                  <div className="mt-4 h-[1px] w-16 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
              </div>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  const [showLoading, setShowLoading] = useState(true)

  return (
    <BrowserRouter>
      <ToastProvider>
        {showLoading && (
          <LoadingScreen onComplete={() => setShowLoading(false)} />
        )}
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
