import { useState } from 'react'
import loginImage from '../assets/login_amapola.jpg'
import './Login.css'
import { login } from '../utils/api'
import { setToken } from '../utils/auth'
import ForgotPassword from './ForgotPassword'

function Login({ onLogin, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validación básica
    if (!formData.email.trim()) {
      setError('Por favor ingresa tu email')
      return
    }

    if (!formData.password.trim()) {
      setError('Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)

    try {
      const response = await login(formData.email, formData.password)
      
      // Guardar token
      setToken(response.token)
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Llamar callback de login exitoso
      if (onLogin) {
        onLogin(response.user, response.token)
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ email: '', password: '' })
    setError('')
    if (onCancel) {
      onCancel()
    }
  }

  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleRecoverPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false)
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onBack={handleBackFromForgotPassword}
        onSuccess={handleBackFromForgotPassword}
      />
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo/Imagen */}
        <div className="login-header">
          <img 
            src={loginImage} 
            alt="Amapola Almacén Natural" 
            className="login-image"
            onLoad={() => console.log('Imagen cargada correctamente')}
            onError={(e) => console.error('Error cargando imagen:', e)}
          />
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu email"
              autoComplete="email"
              disabled={loading}
              className={error && !formData.email ? 'input-error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              disabled={loading}
              className={error && !formData.password ? 'input-error' : ''}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>

          <div className="form-footer">
            <button
              type="button"
              onClick={handleRecoverPassword}
              className="btn-link"
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

