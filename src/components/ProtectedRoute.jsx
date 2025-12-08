import { isAuthenticated, hasPermission, hasAnyPermission, hasRole } from '../utils/auth'

/**
 * Componente para proteger rutas basado en autenticación
 * Nota: Si usas react-router-dom, puedes usar Navigate para redirigir
 */
export function ProtectedRoute({ children, fallback = null }) {
  if (!isAuthenticated()) {
    return fallback || <div>Por favor inicia sesión para acceder a esta página</div>
  }
  
  return children
}

/**
 * Componente para proteger rutas basado en permisos
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar
 * @param {string} props.permission - Permiso requerido
 * @param {string[]} props.anyPermission - Array de permisos (al menos uno requerido)
 * @param {string} props.role - Rol requerido
 * @param {React.ReactNode} props.fallback - Componente a mostrar si no tiene permisos
 */
export function PermissionRoute({ 
  children, 
  permission, 
  anyPermission, 
  role,
  fallback = <div>No tienes permisos para acceder a esta página</div>
}) {
  if (!isAuthenticated()) {
    return <div>Por favor inicia sesión para acceder a esta página</div>
  }
  
  // Verificar permiso específico
  if (permission && !hasPermission(permission)) {
    return fallback
  }
  
  // Verificar si tiene alguno de los permisos
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return fallback
  }
  
  // Verificar rol
  if (role && !hasRole(role)) {
    return fallback
  }
  
  return children
}

/**
 * Componente para mostrar contenido condicionalmente basado en permisos
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar
 * @param {string} props.permission - Permiso requerido
 * @param {string[]} props.anyPermission - Array de permisos (al menos uno requerido)
 * @param {string} props.role - Rol requerido
 * @param {React.ReactNode} props.fallback - Componente a mostrar si no tiene permisos (opcional)
 */
export function PermissionGuard({ 
  children, 
  permission, 
  anyPermission, 
  role,
  fallback = null
}) {
  if (!isAuthenticated()) {
    return fallback
  }
  
  // Verificar permiso específico
  if (permission && !hasPermission(permission)) {
    return fallback
  }
  
  // Verificar si tiene alguno de los permisos
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return fallback
  }
  
  // Verificar rol
  if (role && !hasRole(role)) {
    return fallback
  }
  
  return children
}

