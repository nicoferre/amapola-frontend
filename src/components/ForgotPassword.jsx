import { useState, useRef, useEffect } from 'react'
import { forgotPassword, resetPassword } from '../utils/api'
import './Login.css'

function ForgotPassword({ onBack, onSuccess }) {
  const [step, setStep] = useState('request') // 'request' o 'reset'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  
  // Refs para los inputs del OTP
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Por favor ingresa tu email')
      return
    }

    setLoading(true)

    try {
      const response = await forgotPassword(email)
      
      // En desarrollo, el backend devuelve el OTP
      // En producción, esto no estaría disponible
      if (response.otp) {
        setGeneratedOtp(response.otp)
        setSuccess(`Código OTP generado: ${response.otp}`)
      } else {
        setSuccess('Si el email existe, se ha enviado un código OTP para restablecer tu contraseña')
      }
      
      // Siempre cambiar a la pantalla de reset para ingresar el OTP
      setStep('reset')
      // Auto-focus en el primer input del OTP
      setTimeout(() => {
        otpInputRefs[0].current?.focus()
      }, 100)
    } catch (err) {
      setError(err.message || 'Error al solicitar restablecimiento de contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Mover al siguiente input si se ingresó un dígito
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    // Si se presiona Backspace y el input está vacío, ir al anterior
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
    
    // Si se presiona Delete, limpiar el input actual
    if (e.key === 'Delete') {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Validar que sea un número de 4 dígitos
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      // Mover foco al último input
      otpInputRefs[3].current?.focus()
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const otpString = otp.join('')
    
    if (otpString.length !== 4) {
      setError('Por favor ingresa el código OTP completo de 4 dígitos')
      return
    }

    if (!newPassword.trim()) {
      setError('Por favor ingresa tu nueva contraseña')
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      await resetPassword(otpString, newPassword)
      setSuccess('Contraseña restablecida exitosamente. Puedes iniciar sesión ahora.')
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else if (onBack) {
          onBack()
        }
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'reset') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Restablecer Contraseña</h2>
          </div>

          <form onSubmit={handleResetPassword} className="login-form">
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" role="alert">
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="otp">Ingresa el Código OTP</label>
              <p style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: '0.9rem', 
                marginBottom: '1rem',
                fontWeight: '500'
              }}>
                Ingresa el código de 4 dígitos que recibiste
              </p>
              <div className="otp-inputs-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    disabled={loading}
                    className={`otp-input ${error && otp.join('').length !== 4 ? 'input-error' : ''}`}
                    autoComplete="off"
                  />
                ))}
              </div>
              {generatedOtp && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <small style={{ color: '#2e7d32', fontSize: '0.9em', display: 'block', marginBottom: '0.25rem' }}>
                    <strong>Modo Desarrollo:</strong> Código OTP generado
                  </small>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#008b8b',
                    letterSpacing: '0.5rem',
                    fontFamily: 'monospace'
                  }}>
                    {generatedOtp}
                  </div>
                  <small style={{ color: '#666', fontSize: '0.75em', display: 'block', marginTop: '0.25rem' }}>
                    En producción, este código se enviaría por email
                  </small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={loading}
                className={error && !newPassword ? 'input-error' : ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                disabled={loading}
                className={error && newPassword !== confirmPassword ? 'input-error' : ''}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('request')
                  setOtp(['', '', '', ''])
                  setNewPassword('')
                  setConfirmPassword('')
                  setError('')
                  setGeneratedOtp('')
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Recuperar Contraseña</h2>
        </div>

        <form onSubmit={handleRequestReset} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" role="alert">
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              autoComplete="email"
              disabled={loading}
              className={error && !email ? 'input-error' : ''}
            />
            <small style={{ color: '#666', fontSize: '0.85em', marginTop: '5px', display: 'block' }}>
              Te enviaremos un código OTP de 4 dígitos para restablecer tu contraseña
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Código OTP'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary"
              disabled={loading}
            >
              Volver al Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
