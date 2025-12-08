import { useState, useEffect } from 'react'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import './App.css'
import { isAuthenticated, getUserFromToken, removeToken } from './utils/auth'

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)

  // Verificar si hay un token válido al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getUserFromToken()
        setUser(userData)
        setIsAuth(true)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = (userData, token) => {
    console.log('Login exitoso:', userData)
    setUser(userData)
    setIsAuth(true)
  }

  const handleCancel = () => {
    console.log('Login cancelado')
  }

  const handleLogout = () => {
    removeToken()
    setIsAuth(false)
    setUser(null)
  }

  if (!isAuth) {
    return <Login onLogin={handleLogin} onCancel={handleCancel} />
  }

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {/* Aquí irán las diferentes páginas según la ruta seleccionada */}
    </MainLayout>
  )
}

export default App

