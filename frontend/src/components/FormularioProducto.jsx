import { useState, useEffect } from 'react'

export default function FormularioProducto({ rubros, onGuardar, productoEditar, onCancelarEdicion, inModal = false }) {
  const esEdicion = !!productoEditar

  const empty = { titulo: '', descripcion: '', precio: '', rubro_id: '', subrubro_id: '', imagen: null }
  const [form, setForm] = useState(empty)

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
    fd.append('precio', form.precio)
    fd.append('rubro_id', form.rubro_id)
    fd.append('subrubro_id', form.subrubro_id)
    if (form.imagen) fd.append('imagen', form.imagen)
    onGuardar(fd, esEdicion ? productoEditar.id : undefined)
    if (!esEdicion) setForm(empty)
  }

  return (
    <div className={inModal ? '' : 'v-panel'}>
      {/* Header — solo cuando NO está en modal (el modal tiene su propio header) */}
      {!inModal && (
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid var(--border)',
        background: esEdicion ? 'var(--emerald-light)' : 'var(--bg-white)',
      }}>
        <p className="v-eyebrow" style={{ marginBottom: '0.25rem' }}>
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
          <label className="v-label">Imagen{!esEdicion && <span style={{ color: '#DC2626' }}> *</span>}</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            required={!esEdicion}
            className="v-input"
            style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
          />
        </div>

        <div>
          <label className="v-label">Título <span style={{ color: '#DC2626' }}>*</span></label>
          <input
            className="v-input"
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div>
          <label className="v-label">Rubro <span style={{ color: '#DC2626' }}>*</span></label>
          <select className="v-input" name="rubro_id" value={form.rubro_id} onChange={handleChange} required>
            <option value="">Seleccionar rubro</option>
            {rubros.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        </div>

        {subrubros.length > 0 && (
          <div>
            <label className="v-label">Subrubro</label>
            <select className="v-input" name="subrubro_id" value={form.subrubro_id} onChange={handleChange}>
              <option value="">Seleccionar subrubro</option>
              {subrubros.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="v-label">Descripción</label>
          <textarea
            className="v-input"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div>
          <label className="v-label">Precio (ARS) <span style={{ color: '#DC2626' }}>*</span></label>
          <input
            className="v-input"
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {esEdicion ? 'Guardar cambios' : 'Agregar producto'}
          </button>
          {esEdicion && (
            <button type="button" className="btn-outline" onClick={onCancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
