import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import  {Layout} from './components/Layout/Layout.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Leaderboard } from './pages/Leaderboard.jsx'

import { useAuthStore } from './store/authStore.js'

import { useThemeStore } from './store/themeStore.js' 
import { useGetMe } from './hooks/useAuth.js'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore()
  const { isLoading } = useGetMe()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route - Redirect if authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function App() {
  const { isDark } = useThemeStore()
  const { token, setAuth } = useAuthStore()

  // Initialize auth from storage on mount
  useEffect(() => {
    if (token) {
      // Validate token by fetching user
      // This is handled by ProtectedRoute component
    }
  }, [token])

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="habits" element={<Dashboard />} /> {/* Reuse dashboard for habits view */}
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<div className="card">Profile Page (Coming Soon)</div>} />
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App