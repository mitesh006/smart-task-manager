import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProjectBoard from './pages/ProjectBoard'
import Landing from './pages/Landing'
import Team from './pages/Team'
import Settings from './pages/Settings'
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
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme')
    }
  }, [])

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
