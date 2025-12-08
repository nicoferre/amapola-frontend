/**
 * Utilidades para manejar autenticación y permisos en el frontend
 */

/**
 * Decodifica un JWT (sin verificar, solo para obtener datos)
 * Nota: En producción, el backend debe verificar el token
 */
export function decodeToken(token) {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}

/**
 * Obtiene el token del localStorage
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Guarda el token en localStorage
 */
export function setToken(token) {
  localStorage.setItem('token', token);
}

/**
 * Elimina el token del localStorage
 */
export function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Obtiene la información del usuario desde el token
 */
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    roleId: decoded.roleId,
    permissions: decoded.permissions || []
  };
}

/**
 * Verifica si el usuario tiene un permiso específico
 * @param {string} permission - Nombre del permiso (ej: 'view_dashboard')
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const user = getUserFromToken();
  if (!user || !user.permissions) return false;
  
  return user.permissions.includes(permission);
}

/**
 * Verifica si el usuario tiene al menos uno de los permisos especificados
 * @param {string[]} permissions - Array de permisos
 * @returns {boolean}
 */
export function hasAnyPermission(permissions) {
  const user = getUserFromToken();
  if (!user || !user.permissions) return false;
  
  return permissions.some(permission => user.permissions.includes(permission));
}

/**
 * Verifica si el usuario tiene todos los permisos especificados
 * @param {string[]} permissions - Array de permisos
 * @returns {boolean}
 */
export function hasAllPermissions(permissions) {
  const user = getUserFromToken();
  if (!user || !user.permissions) return false;
  
  return permissions.every(permission => user.permissions.includes(permission));
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} role - Nombre del rol (ej: 'ADMIN')
 * @returns {boolean}
 */
export function hasRole(role) {
  const user = getUserFromToken();
  if (!user) return false;
  
  return user.role === role;
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 * @param {string[]} roles - Array de roles
 * @returns {boolean}
 */
export function hasAnyRole(roles) {
  const user = getUserFromToken();
  if (!user) return false;
  
  return roles.includes(user.role);
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Verificar si el token no ha expirado (básico, el backend debe verificar también)
  const currentTime = Date.now() / 1000;
  if (decoded.exp && decoded.exp < currentTime) {
    removeToken();
    return false;
  }
  
  return true;
}

/**
 * Obtiene todos los permisos del usuario actual
 * @returns {string[]}
 */
export function getUserPermissions() {
  const user = getUserFromToken();
  return user?.permissions || [];
}

/**
 * Obtiene el rol del usuario actual
 * @returns {string|null}
 */
export function getUserRole() {
  const user = getUserFromToken();
  return user?.role || null;
}

