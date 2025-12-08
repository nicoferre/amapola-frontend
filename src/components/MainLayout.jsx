import { useState } from 'react'
import Sidebar from './Sidebar'
import './MainLayout.css'

function MainLayout({ user, onLogout, children }) {
  const [currentPath, setCurrentPath] = useState('/dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleNavigate = (path) => {
    setCurrentPath(path)
    // Aquí puedes implementar navegación con react-router si lo deseas
    console.log('Navegando a:', path)
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="main-layout">
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="main-header">
          <div className="header-left">
            <h2 className="page-title">Bienvenido, {user?.surname} {user?.lastname}</h2>
            <span className="user-role">{user?.role}</span>
          </div>
          <div className="header-right">
            <button onClick={onLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </header>
        <div className="content-area">
          {children || (
            <div className="welcome-message">
              <h1>Bienvenido a Amapola</h1>
              <p>Selecciona una opción del menú para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainLayout

