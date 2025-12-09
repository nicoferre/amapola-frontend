import { useState } from 'react'
import { apiPost } from '../utils/api'
import { hasRole } from '../utils/auth'
import './BulkUpload.css'

function BulkUpload({ onSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  // Solo ADMIN puede ver este componente
  if (!hasRole('ADMIN')) {
    return null
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validar tipo de archivo
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ]
      
      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
        setError('Tipo de archivo no permitido. Solo se aceptan archivos Excel (.xlsx, .xls) o CSV')
        setFile(null)
        return
      }
      
      setFile(selectedFile)
      setError('')
      setResults(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Por favor selecciona un archivo')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiPost('/api/excel/products/upload', formData, {
        headers: {
          // No establecer Content-Type, el navegador lo hará automáticamente con FormData
        },
        isFormData: true
      })

      setResults(response)
      setFile(null)
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el archivo')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/excel/products/template`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Error al descargar el template')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = 'template_productos.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setError(error.message || 'Error al descargar el template')
    }
  }

  return (
    <div className="bulk-upload">
      <div className="bulk-upload-header">
        <h2>Carga Masiva de Productos</h2>
        <p className="subtitle">Sube un archivo Excel (.xlsx, .xls) o CSV con los productos a cargar</p>
      </div>

      <div className="bulk-upload-content">
        {error && (
          <div className="error-message">{error}</div>
        )}

        {results && (
          <div className={`results-message ${results.summary.errors > 0 ? 'has-errors' : 'success'}`}>
            <h3>Resultado de la carga masiva</h3>
            <div className="results-summary">
              <p><strong>Total procesados:</strong> {results.summary.total}</p>
              <p className="success-text"><strong>✅ Creados:</strong> {results.summary.created}</p>
              {results.summary.errors > 0 && (
                <p className="error-text"><strong>❌ Errores:</strong> {results.summary.errors}</p>
              )}
            </div>
            
            {results.errors.length > 0 && (
              <div className="errors-list">
                <h4>Errores:</h4>
                <ul>
                  {results.errors.map((err, index) => (
                    <li key={index}>
                      Fila {err.index}: {err.name} - {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="file">Seleccionar archivo</label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={loading}
            />
            {file && (
              <p className="file-info">
                Archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={downloadTemplate}
              className="btn btn-secondary"
              disabled={loading}
            >
              📥 Descargar Plantilla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !file}
            >
              {loading ? 'Cargando...' : 'Cargar Productos'}
            </button>
          </div>
        </form>

        <div className="upload-instructions">
          <h3>Instrucciones:</h3>
          <ul>
            <li>El archivo debe tener una primera fila con los encabezados</li>
            <li>Columnas requeridas: <strong>nombre</strong> (obligatorio), <strong>precio</strong> (obligatorio), <strong>stock</strong> (obligatorio)</li>
            <li>Columnas opcionales: descripcion, categoria, marca, tamaño, unidad, stock minimo, codigo de barras, sku, imagen</li>
            <li>La unidad por defecto es "unidad" si no se especifica</li>
            <li>Puedes descargar la plantilla de ejemplo para ver el formato correcto</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BulkUpload

