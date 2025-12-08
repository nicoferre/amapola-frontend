/**
 * Utilidades para hacer peticiones a la API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Realiza una petición a la API con autenticación automática
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Si la respuesta no es JSON, lanzar error
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta no es JSON');
    }
    
    const data = await response.json();
    
    // Si hay un error en la respuesta, lanzarlo
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la petición');
    }
    
    return data;
  } catch (error) {
    // Si es un error de red o de parseo
    if (error.message === 'Failed to fetch' || error.message === 'La respuesta no es JSON') {
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
}

/**
 * Realiza un GET request
 */
export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * Realiza un POST request
 */
export async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Realiza un PUT request
 */
export async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * Realiza un DELETE request
 */
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Login de usuario
 */
export async function login(email, password) {
  const response = await apiPost('/api/auth/login', { email, password });
  return response;
}

/**
 * Registro de usuario
 */
export async function register(userData) {
  const response = await apiPost('/api/auth/register', userData);
  return response;
}

/**
 * Obtiene la información del usuario actual
 */
export async function getCurrentUser() {
  const response = await apiGet('/api/auth/me');
  return response;
}

/**
 * Solicita restablecimiento de contraseña
 */
export async function forgotPassword(email) {
  const response = await apiPost('/api/auth/forgot-password', { email });
  return response;
}

/**
 * Restablece la contraseña con un OTP
 */
export async function resetPassword(otp, newPassword) {
  const response = await apiPost('/api/auth/reset-password', { 
    otp, 
    newPassword 
  });
  return response;
}

