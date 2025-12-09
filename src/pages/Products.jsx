import { useState } from 'react'
import AddProduct from '../components/AddProduct'
import EditProduct from '../components/EditProduct'
import ListProducts from '../components/ListProducts'
import BulkUpload from '../components/BulkUpload'
import { hasRole } from '../utils/auth'
import './Products.css'

function Products() {
  const [activeTab, setActiveTab] = useState('list')
  const [editingProductId, setEditingProductId] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEditProduct = (productId) => {
    setEditingProductId(productId)
    setActiveTab('edit')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab !== 'edit') {
      setEditingProductId(null)
    }
  }

  const handleBulkUploadSuccess = () => {
    // Forzar recarga de la lista de productos
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('list')
  }

  const isAdmin = hasRole('ADMIN')

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Productos</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => handleTabChange('add')}
          >
            Agregar Producto
          </button>
          <button
            className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => handleTabChange('edit')}
            disabled={!editingProductId && activeTab !== 'edit'}
          >
            Modificar Producto
          </button>
          <button
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => handleTabChange('list')}
          >
            Listar Productos
          </button>
          {isAdmin && (
            <button
              className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => handleTabChange('upload')}
            >
              Carga Masiva
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'add' && <AddProduct onSuccess={() => setActiveTab('list')} />}
          {activeTab === 'edit' && (
            <EditProduct 
              productId={editingProductId} 
              onSuccess={() => {
                setActiveTab('list')
                setEditingProductId(null)
              }}
              onCancel={() => {
                setActiveTab('list')
                setEditingProductId(null)
              }}
            />
          )}
          {activeTab === 'list' && (
            <ListProducts 
              onEdit={handleEditProduct} 
              refreshTrigger={refreshTrigger}
            />
          )}
          {activeTab === 'upload' && isAdmin && (
            <BulkUpload onSuccess={handleBulkUploadSuccess} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
