import { useState, useEffect } from 'react'
import styles from './FormularioProducto.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function FormularioProducto({ rubros, onGuardar, productoEditar, onCancelarEdicion, inModal = false }) {
  const esEdicion = !!productoEditar

  const empty = { titulo: '', descripcion: '', precio: '', rubro_id: '', subrubro_id: '', imagen: null }
  const [form, setForm] = useState(empty)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (productoEditar) {
      setForm({
        titulo: productoEditar.titulo || productoEditar.nombre || '',
        descripcion: productoEditar.descripcion || '',
        precio: productoEditar.precio || '',
        rubro_id: productoEditar.rubro_id || '',
        subrubro_id: productoEditar.subrubro_id || '',
        imagen: null,
      })
    } else {
      setForm(empty)
    }
  }, [productoEditar])

  const rubroActivo = rubros.find(r => r.id === Number(form.rubro_id))
  const subrubros = rubroActivo?.subrubros || []

  function handleChange(e) {
    const { name, value, files } = e.target
    if (name === 'imagen') {
      setForm(f => ({ ...f, imagen: files[0] }))
      setFileName(files[0]?.name || '')
    } else if (name === 'rubro_id') {
      setForm(f => ({ ...f, rubro_id: value, subrubro_id: '' }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('titulo', form.titulo)
    fd.append('descripcion', form.descripcion)
    if (form.precio !== '' && form.precio !== null) fd.append('precio', form.precio)
    fd.append('rubro_id', form.rubro_id)
    if (form.subrubro_id) fd.append('subrubro_id', form.subrubro_id)
    if (form.imagen) fd.append('imagen', form.imagen)
    onGuardar(fd, esEdicion ? productoEditar.id : undefined)
    if (!esEdicion) { setForm(empty); setFileName('') }
  }

  return (
    <div className={inModal ? '' : styles.panel}>
      {/* Header — solo cuando NO está en modal (el modal tiene su propio header) */}
      {!inModal && (
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid var(--border)',
        background: esEdicion ? 'var(--accent-light)' : 'var(--bg-white)',
      }}>
        <p className={styles.eyebrow} style={{ marginBottom: '0.25rem' }}>
          {esEdicion ? 'Editando' : 'Nuevo producto'}
        </p>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>
          {esEdicion
            ? (productoEditar.titulo || productoEditar.nombre || 'Producto')
            : 'Agregar al catálogo'}
        </h2>
      </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div>
          <label className={styles.label}>
            Imagen{!esEdicion && <span style={{ color: '#DC2626' }}> *</span>}
          </label>
          <label className={`${styles.uploadZone} ${fileName ? styles.uploadSelected : ''}`}>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              required={!esEdicion}
              style={{ display: 'none' }}
            />
            {fileName ? (
              <>
                {/* Check icon */}
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 12.5l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={styles.uploadFilename}>{fileName}</span>
                <span className={styles.uploadHint}>Hacé click para cambiar</span>
              </>
            ) : (
              <>
                {/* Image / mountain icon */}
                <svg className={styles.uploadIcon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="15" cy="19" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M4 34l10-10 7 7 6-6 11 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={styles.uploadLabel}>Arrastrá o hacé click para subir</span>
                <span className={styles.uploadHint}>PNG, JPG, WEBP — máx. 5 MB</span>
              </>
            )}
          </label>
        </div>

        <div>
          <label className={styles.label}>Título <span style={{ color: '#DC2626' }}>*</span></label>
          <input
            className={styles.input}
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div>
          <label className={styles.label}>Rubro <span style={{ color: '#DC2626' }}>*</span></label>
          <select className={styles.input} name="rubro_id" value={form.rubro_id} onChange={handleChange} required>
            <option value="">Seleccionar rubro</option>
            {rubros.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        </div>

        {subrubros.length > 0 && (
          <div>
            <label className={styles.label}>Subrubro</label>
            <select className={styles.input} name="subrubro_id" value={form.subrubro_id} onChange={handleChange}>
              <option value="">Seleccionar subrubro</option>
              {subrubros.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className={styles.label}>Descripción</label>
          <textarea
            className={styles.input}
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div>
          <label className={styles.label}>Precio (ARS)</label>
          <input
            className={styles.input}
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
          <button type="submit" className={btnStyles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>
            {esEdicion ? 'Guardar cambios' : 'Agregar producto'}
          </button>
          {esEdicion && (
            <button type="button" className={btnStyles.btnOutline} onClick={onCancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
