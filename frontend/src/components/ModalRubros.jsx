import { useState, useEffect } from 'react'
import {
  getRubros,
  createRubro,
  updateRubro,
  deleteRubro,
  createSubrubro,
  updateSubrubro,
  deleteSubrubro,
} from '../api/index'

export default function ModalRubros({ onCerrar, onRubrosChanged }) {
  const [rubros, setRubros] = useState([])
  const [cargando, setCargando] = useState(true)

  // Estado para nuevo rubro
  const [nuevoRubro, setNuevoRubro] = useState('')
  const [guardandoRubro, setGuardandoRubro] = useState(false)

  // Estado por rubro: editando nombre, agregando subrubro, editando subrubro
  const [editandoRubro, setEditandoRubro] = useState({}) // { [id]: nombre }
  const [agregandoSub, setAgregandoSub] = useState({})   // { [rubroId]: nombreSub }
  const [expandido, setExpandido] = useState({})          // { [id]: bool }
  const [editandoSub, setEditandoSub] = useState({})     // { [subId]: nombre }

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    setCargando(true)
    const { data } = await getRubros()
    setRubros(data)
    // Expandir todos por defecto
    const exp = {}
    data.forEach(r => { exp[r.id] = true })
    setExpandido(exp)
    setCargando(false)
  }

  async function handleCrearRubro(e) {
    e.preventDefault()
    if (!nuevoRubro.trim()) return
    setGuardandoRubro(true)
    await createRubro(nuevoRubro.trim())
    setNuevoRubro('')
    setGuardandoRubro(false)
    await cargar()
    onRubrosChanged?.()
  }

  async function handleGuardarNombreRubro(rubro) {
    const nombre = editandoRubro[rubro.id]?.trim()
    if (!nombre || nombre === rubro.nombre) { setEditandoRubro(e => { const n = {...e}; delete n[rubro.id]; return n }); return }
    await updateRubro(rubro.id, nombre)
    setEditandoRubro(e => { const n = {...e}; delete n[rubro.id]; return n })
    await cargar()
    onRubrosChanged?.()
  }

  async function handleEliminarRubro(rubro) {
    if (!window.confirm(`¿Eliminar el rubro "${rubro.nombre}"? También se eliminarán sus subrubros y productos asociados.`)) return
    await deleteRubro(rubro.id)
    await cargar()
    onRubrosChanged?.()
  }

  async function handleCrearSubrubro(rubroId) {
    const nombre = agregandoSub[rubroId]?.trim()
    if (!nombre) return
    await createSubrubro(rubroId, nombre)
    setAgregandoSub(s => { const n = {...s}; delete n[rubroId]; return n })
    await cargar()
    onRubrosChanged?.()
  }

  async function handleGuardarNombreSub(sub) {
    const nombre = editandoSub[sub.id]?.trim()
    if (!nombre || nombre === sub.nombre) { setEditandoSub(e => { const n = {...e}; delete n[sub.id]; return n }); return }
    await updateSubrubro(sub.id, nombre)
    setEditandoSub(e => { const n = {...e}; delete n[sub.id]; return n })
    await cargar()
    onRubrosChanged?.()
  }

  async function handleEliminarSub(sub) {
    if (!window.confirm(`¿Eliminar el subrubro "${sub.nombre}"?`)) return
    await deleteSubrubro(sub.id)
    await cargar()
    onRubrosChanged?.()
  }

  return (
    <div
      className="v-overlay"
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'v-modalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>

        {/* Top bar */}
        <div style={{ height: '4px', background: 'var(--emerald)', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div>
            <p className="v-eyebrow" style={{ marginBottom: '0.15rem' }}>Catálogo</p>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
              Gestionar rubros
            </h2>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.1rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem' }}>

          {cargando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <div key={i} className="v-skeleton" style={{ height: '56px', borderRadius: '10px' }} />)}
            </div>
          ) : rubros.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No hay rubros creados todavía.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rubros.map(rubro => (
                <div key={rubro.id} style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}>
                  {/* Rubro row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.7rem 0.9rem',
                    background: 'var(--bg)',
                  }}>
                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandido(e => ({ ...e, [rubro.id]: !e[rubro.id] }))}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '2px', flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: expandido[rubro.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 2l4 4-4 4"/>
                      </svg>
                    </button>

                    {/* Nombre editable */}
                    {editandoRubro[rubro.id] !== undefined ? (
                      <input
                        className="v-input"
                        style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.875rem', fontWeight: 500 }}
                        value={editandoRubro[rubro.id]}
                        autoFocus
                        onChange={e => setEditandoRubro(ev => ({ ...ev, [rubro.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleGuardarNombreRubro(rubro)
                          if (e.key === 'Escape') setEditandoRubro(ev => { const n = {...ev}; delete n[rubro.id]; return n })
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {rubro.nombre}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                          {rubro.subrubros.length} subrubro{rubro.subrubros.length !== 1 ? 's' : ''}
                        </span>
                      </span>
                    )}

                    {/* Acciones rubro */}
                    {editandoRubro[rubro.id] !== undefined ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-edit-soft" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => handleGuardarNombreRubro(rubro)}>
                          Guardar
                        </button>
                        <button className="btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => setEditandoRubro(e => { const n = {...e}; delete n[rubro.id]; return n })}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-edit-soft" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => setEditandoRubro(e => ({ ...e, [rubro.id]: rubro.nombre }))}>
                          Editar
                        </button>
                        <button className="btn-danger-soft" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => handleEliminarRubro(rubro)}>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subrubros expandidos */}
                  {expandido[rubro.id] && (
                    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-white)' }}>
                      {rubro.subrubros.map(sub => (
                        <div key={sub.id} style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.55rem 0.9rem 0.55rem 2.5rem',
                          borderBottom: '1px solid var(--border)',
                        }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald-mid)', flexShrink: 0 }} />

                          {editandoSub[sub.id] !== undefined ? (
                            <input
                              className="v-input"
                              style={{ flex: 1, padding: '0.3rem 0.55rem', fontSize: '0.825rem' }}
                              value={editandoSub[sub.id]}
                              autoFocus
                              onChange={e => setEditandoSub(ev => ({ ...ev, [sub.id]: e.target.value }))}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleGuardarNombreSub(sub)
                                if (e.key === 'Escape') setEditandoSub(ev => { const n = {...ev}; delete n[sub.id]; return n })
                              }}
                            />
                          ) : (
                            <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.nombre}</span>
                          )}

                          {editandoSub[sub.id] !== undefined ? (
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button className="btn-edit-soft" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                onClick={() => handleGuardarNombreSub(sub)}>
                                Guardar
                              </button>
                              <button className="btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                onClick={() => setEditandoSub(e => { const n = {...e}; delete n[sub.id]; return n })}>
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button className="btn-edit-soft" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                onClick={() => setEditandoSub(e => ({ ...e, [sub.id]: sub.nombre }))}>
                                Editar
                              </button>
                              <button className="btn-danger-soft" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                onClick={() => handleEliminarSub(sub)}>
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Agregar subrubro */}
                      <div style={{ padding: '0.6rem 0.9rem 0.6rem 2.5rem' }}>
                        {agregandoSub[rubro.id] !== undefined ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              className="v-input"
                              style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.825rem' }}
                              placeholder="Nombre del subrubro"
                              value={agregandoSub[rubro.id]}
                              autoFocus
                              onChange={e => setAgregandoSub(s => ({ ...s, [rubro.id]: e.target.value }))}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleCrearSubrubro(rubro.id)
                                if (e.key === 'Escape') setAgregandoSub(s => { const n = {...s}; delete n[rubro.id]; return n })
                              }}
                            />
                            <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                              onClick={() => handleCrearSubrubro(rubro.id)}>
                              Agregar
                            </button>
                            <button className="btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                              onClick={() => setAgregandoSub(s => { const n = {...s}; delete n[rubro.id]; return n })}>
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAgregandoSub(s => ({ ...s, [rubro.id]: '' }))}
                            style={{
                              background: 'none', border: '1.5px dashed var(--border-strong)',
                              borderRadius: '6px', padding: '0.3rem 0.75rem',
                              fontSize: '0.75rem', color: 'var(--text-muted)',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--emerald)'; e.currentTarget.style.color = 'var(--emerald)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M5.5 1v9M1 5.5h9"/>
                            </svg>
                            Agregar subrubro
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — Crear nuevo rubro */}
        <div style={{
          borderTop: '1.5px solid var(--border)',
          padding: '1rem 1.25rem',
          background: 'var(--bg)',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            Crear nuevo rubro
          </p>
          <form onSubmit={handleCrearRubro} style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              className="v-input"
              placeholder="Nombre del rubro"
              value={nuevoRubro}
              onChange={e => setNuevoRubro(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={guardandoRubro || !nuevoRubro.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {guardandoRubro ? 'Creando...' : '+ Crear rubro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
