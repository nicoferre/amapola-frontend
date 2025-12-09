import { useState, useEffect } from 'react'
import './ProductForm.css'

function ProductForm({ product, onClose, onSubmit, mode = 'create' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    sku: '',
    category: '',
    brand: '',
    size: '',
    unit: 'unidad',
    price: '',
    stock: '',
    min_stock: '',
    supplier_id: '',
    image_url: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        barcode: product.barcode || '',
        sku: product.sku || '',
        category: product.category || '',
        brand: product.brand || '',
        size: product.size || '',
        unit: product.unit || 'unidad',
        price: product.price || '',
        stock: product.stock || '',
        min_stock: product.min_stock || '',
        supplier_id: product.supplier_id || '',
        image_url: product.image_url || '',
        is_active: product.is_active !== undefined ? product.is_active : true
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseFloat(formData.stock) || 0,
        min_stock: parseFloat(formData.min_stock) || 0,
        supplier_id: formData.supplier_id || null
      }

      if (onSubmit) {
        await onSubmit(data)
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Error al guardar producto')
    } finally {
      setLoading(false)
    }
  }

  const units = ['unidad', 'kg', 'litro', 'gramo', 'ml']
  const categories = [
    'Aceites',
    'Harinas',
    'Semillas',
    'Frutos Secos',
    'Suplementos',
    'Tés e Infusiones',
    'Endulzantes',
    'Cereales',
    'Legumbres',
    'Otros'
  ]

  // Si no hay onClose, asumimos que está en modo tab (no modal)
  const isModal = !!onClose

  const formContent = (
    <>
      {isModal && (
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      )}

      {!isModal && (
        <div className="form-header">
          <h2>{mode === 'edit' ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        </div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Aceite de Oliva Extra Virgen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Seleccionar...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descripción del producto..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="barcode">Código de Barras</label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="1234567890123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU (Código Interno)</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="PROD-001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Marca</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ej: La Española"
              />
            </div>

            <div className="form-group">
              <label htmlFor="size">Tamaño</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Ej: 500ml, 1kg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unidad</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio de Venta *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock">Stock Actual *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="min_stock">Stock Mínimo</label>
              <input
                type="number"
                id="min_stock"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">URL de Imagen</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Producto activo
            </label>
          </div>

          <div className="form-actions">
            {onClose && (
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (mode === 'edit' ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
    </>
  )

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {formContent}
        </div>
      </div>
    )
  }

  return <div className="product-form-container">{formContent}</div>
}

export default ProductForm

