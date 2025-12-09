import { useState, useEffect } from 'react'
import { apiGet, apiPut } from '../utils/api'
import ProductForm from './ProductForm'
import './EditProduct.css'

function EditProduct({ productId, onSuccess, onCancel }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiGet(`/api/products/${productId}`)
      setProduct(response.product)
    } catch (err) {
      setError(err.message || 'Error al cargar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (productData) => {
    try {
      await apiPut(`/api/products/${productId}`, productData)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar producto')
      throw err
    }
  }

  if (loading) {
    return (
      <div className="edit-product-loading">
        <p>Cargando información del producto...</p>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="edit-product-error">
        <div className="error-message">{error}</div>
        <button onClick={onCancel} className="btn btn-secondary">
          Volver
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="edit-product-empty">
        <p>No se ha seleccionado un producto para editar</p>
        <p className="hint">Selecciona un producto de la lista y haz clic en el botón de editar (✏️)</p>
        <button onClick={onCancel} className="btn btn-secondary">
          Volver a la lista
        </button>
      </div>
    )
  }

  return (
    <div className="edit-product">
      {error && <div className="error-message">{error}</div>}
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onClose={onCancel}
        mode="edit"
      />
    </div>
  )
}

export default EditProduct

