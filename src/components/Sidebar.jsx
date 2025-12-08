import { useState } from 'react'
import { hasPermission, hasAnyPermission, getUserRole } from '../utils/auth'
import logo from '../assets/favicon.svg'
import './Sidebar.css'

// Iconos SVG simples (puedes reemplazarlos con iconos de una librería como react-icons)
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const ProductsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const SalesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ClientsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const InventoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 17.364m12.728 0l-4.243-4.243m-4.242 0L5.636 6.636" />
  </svg>
)

function Sidebar({ currentPath, onNavigate, isCollapsed, onToggleCollapse }) {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Definición de menús con sus permisos requeridos
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: <HomeIcon />,
      path: '/dashboard',
      permission: 'view_dashboard',
      visible: true
    },
    {
      id: 'products',
      label: 'Productos',
      icon: <ProductsIcon />,
      path: '/productos',
      permission: 'view_products',
      visible: true
    },
    {
      id: 'sales',
      label: 'Ventas',
      icon: <SalesIcon />,
      path: '/ventas',
      permission: 'view_sales',
      visible: true
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: <ClientsIcon />,
      path: '/clientes',
      permission: 'view_clients', // Necesitarás agregar este permiso
      visible: true
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: <InventoryIcon />,
      path: '/inventario',
      permission: 'view_inventory', // Necesitarás agregar este permiso
      visible: true
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <ReportsIcon />,
      path: '/reportes',
      permission: 'view_reports', // Necesitarás agregar este permiso
      visible: true
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: <UsersIcon />,
      path: '/usuarios',
      permission: 'view_users',
      visible: true,
      adminOnly: true // Solo visible para ADMIN
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <SettingsIcon />,
      path: '/configuracion',
      permission: 'manage_roles', // Solo admin puede gestionar roles
      visible: true,
      adminOnly: true // Solo visible para ADMIN
    }
  ]

  // Filtrar menús según permisos y rol
  const visibleMenuItems = menuItems.filter(item => {
    // Si tiene adminOnly y no es admin, no mostrar
    if (item.adminOnly && getUserRole() !== 'ADMIN') {
      return false
    }
    
    // Verificar permiso
    if (item.permission) {
      return hasPermission(item.permission) || hasAnyPermission([item.permission])
    }
    
    return item.visible
  })

  const handleMenuClick = (path) => {
    if (onNavigate) {
      onNavigate(path)
    }
  }

  const CollapseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {isCollapsed ? (
        <polyline points="9 18 15 12 9 6" />
      ) : (
        <polyline points="15 18 9 12 15 6" />
      )}
    </svg>
  )

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <>
            <div className="sidebar-logo">
              <img src={logo} alt="Amapola" className="logo-image" />
            </div>
            <h1 className="sidebar-title">Amapola</h1>
          </>
        )}
        {isCollapsed && (
          <div className="sidebar-logo">
            <img src={logo} alt="Amapola" className="logo-image" />
          </div>
        )}
        <button 
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <CollapseIcon />
        </button>
      </div>

      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => {
          const isActive = currentPath === item.path
          
          return (
            <button
              key={item.id}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.path)}
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

