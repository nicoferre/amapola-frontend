import { useState, useEffect } from 'react'
import { apiGet, apiDelete } from '../utils/api'
import { hasPermission } from '../utils/auth'
import './ListProducts.css'

function ListProducts({ onEdit, refreshTrigger }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    lowStock: false,
    showInactive: false
  })
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const canUpdate = hasPermission('update_products')
  const canDelete = hasPermission('delete_products')

  useEffect(() => {
    loadProducts()
  }, [searchTerm, filters, refreshTrigger, pageSize, currentPage])

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.category) params.append('category', filters.category)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.lowStock) params.append('low_stock', 'true')
      if (filters.showInactive) params.append('is_active', 'false')
      
      // Agregar parámetros de paginación
      params.append('limit', pageSize.toString())
      params.append('offset', ((currentPage - 1) * pageSize).toString())
      
      const response = await apiGet(`/api/products?${params.toString()}`)
      setProducts(response.products || [])
      setTotal(response.total || 0)
    } catch (err) {
      setError(err.message || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value))
    setCurrentPage(1) // Resetear a la primera página
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const totalPages = Math.ceil(total / pageSize)
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas desactivar el producto "${name}"?`)) {
      return
    }

    try {
      await apiDelete(`/api/products/${id}`)
      loadProducts()
    } catch (err) {
      alert(err.message || 'Error al desactivar producto')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const getStockStatus = (stock, minStock) => {
    if (stock <= 0) return { class: 'stock-out', text: 'Sin stock' }
    if (stock <= minStock) return { class: 'stock-low', text: 'Stock bajo' }
    return { class: 'stock-ok', text: 'En stock' }
  }

  return (
    <div className="list-products">
      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="products-filters">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // Resetear a la primera página al buscar
          }}
          className="search-input"
        />
        <select
          value={filters.category}
          onChange={(e) => {
            setFilters({ ...filters, category: e.target.value })
            setCurrentPage(1) // Resetear a la primera página al filtrar
          }}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.lowStock}
            onChange={(e) => {
              setFilters({ ...filters, lowStock: e.target.checked })
              setCurrentPage(1)
            }}
          />
          Solo stock bajo
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.showInactive}
            onChange={(e) => {
              setFilters({ ...filters, showInactive: e.target.checked })
              setCurrentPage(1)
            }}
          />
          Mostrar inactivos
        </label>
        <div className="pagination-controls-top">
          <label className="page-size-label">
            Filas por página:
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="page-size-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Tamaño</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    No hay productos disponibles
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.min_stock)
                  return (
                    <tr key={product.id} className={!product.is_active ? 'inactive-row' : ''}>
                      <td className="id-cell">{product.id.substring(0, 8)}...</td>
                      <td>{product.name}</td>
                      <td>{product.category || '-'}</td>
                      <td>{product.brand || '-'}</td>
                      <td>{product.size || '-'}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <span className={`stock-badge ${stockStatus.class}`}>
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="actions">
                        {canUpdate && (
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => onEdit(product.id)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Desactivar"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {startItem} - {endItem} de {total} productos
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              ««
            </button>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListProducts

