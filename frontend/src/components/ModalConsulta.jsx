import { useState } from 'react'
import { enviarConsulta } from '../api/index'

export default function ModalConsulta({ producto, onCerrar }) {
  const titulo = producto.titulo || producto.nombre || 'este producto'

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    mensaje: `Hola, me interesa obtener más información sobre "${titulo}".`,
  })
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await enviarConsulta({ ...form, producto_id: producto.id })
      setEnviado(true)
    } catch {
      setError('No se pudo enviar. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="v-overlay" onClick={e => e.target === e.currentTarget && onCerrar()}>
      <div className="v-modal">

        {/* Emerald top bar */}
        <div style={{ height: '4px', background: 'var(--emerald)' }} />

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <p className="v-eyebrow" style={{ marginBottom: '0.2rem' }}>Consultar producto</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
              {titulo}
            </h2>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              transition: 'all 0.15s',
              flexShrink: 0,
              marginLeft: '0.75rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {enviado ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '52px', height: '52px',
                background: 'var(--emerald-light)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 11l5 5L18 6"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>¡Consulta enviada!</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  Te contactaremos a la brevedad.
                </p>
              </div>
              <button className="btn-outline" onClick={onCerrar} style={{ marginTop: '0.5rem' }}>
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="v-label">Tu nombre</label>
                <input
                  className="v-input"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan García"
                  required
                />
              </div>
              <div>
                <label className="v-label">Email</label>
                <input
                  className="v-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="v-label">Mensaje</label>
                <textarea
                  className="v-input"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.825rem',
                  color: '#DC2626',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={enviando}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
              >
                {enviando ? 'Enviando...' : 'Enviar consulta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
