import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import EmployeeDashboard from './components/EmployeeDashboard'
import AdminDashboard from './components/AdminDashboard'
import axios from 'axios'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await axios.get('/api/check-session')
      if (response.data.logged_in) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (user.user_type === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  return <EmployeeDashboard user={user} onLogout={handleLogout} />
}

export default App
