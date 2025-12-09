import { useState } from 'react'
import { apiPost } from '../utils/api'
import ProductForm from './ProductForm'
import './AddProduct.css'

function AddProduct({ onSuccess }) {
  const [showForm, setShowForm] = useState(true)
  const [error, setError] = useState('')

  const handleFormClose = () => {
    setShowForm(false)
    if (onSuccess) {
      onSuccess()
    }
  }

  const handleSubmit = async (productData) => {
    try {
      await apiPost('/api/products', productData)
      handleFormClose()
    } catch (err) {
      setError(err.message || 'Error al crear producto')
      throw err
    }
  }

  if (!showForm) {
    return (
      <div className="add-product-success">
        <p>✅ Producto creado exitosamente</p>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Agregar otro producto
        </button>
      </div>
    )
  }

  return (
    <div className="add-product">
      {error && <div className="error-message">{error}</div>}
      <ProductForm
        product={null}
        onSubmit={handleSubmit}
        onClose={handleFormClose}
        mode="create"
      />
    </div>
  )
}

export default AddProduct

