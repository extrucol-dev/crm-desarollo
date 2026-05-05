import { useState, useMemo, useEffect } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { adminAPI } from '../services/adminAPI'

const TIPO_STYLE = {
  INSERT: { pill: 'bg-[#E8F5EE] text-[#1A8754]',  icon: 'bg-[#E8F5EE] text-[#1A8754]' },
  UPDATE: { pill: 'bg-[#FFF8E5] text-[#C7770D]',  icon: 'bg-[#FFF8E5] text-[#C7770D]' },
  DELETE: { pill: 'bg-[#FDECEA] text-[#C0392B]',  icon: 'bg-[#FDECEA] text-[#C0392B]' },
}

const initials = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const AVATAR_COLORS = ['#24388C','#1A8754','#F39610','#C0392B','#7C3AED','#0369A1']
const avatarColor = (nombre = '') => AVATAR_COLORS[nombre.charCodeAt(0) % AVATAR_COLORS.length]

function formatFecha(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso.replace('T', ' '))
    const ahora = new Date()
    const diff = Math.floor((ahora - d) / 60000)
    if (diff < 1)   return 'Ahora'
    if (diff < 60)  return `Hace ${diff} min`
    if (diff < 1440) return `Hace ${Math.floor(diff/60)}h`
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
  } catch { return iso }
}

export default function AdminAuditoriaPage() {
  const [eventos,     setEventos]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [busqueda,    setBusqueda]    = useState('')
  const [filtroTipo,  setFiltroTipo]  = useState('')
  const [filtroTabla, setFiltroTabla] = useState('')
  const [inicio,      setInicio]      = useState('')
  const [fin,         setFin]         = useState('')
  const [mostrarFechas, setMostrarFechas] = useState(false)

  useEffect(() => {
    setLoading(true)
    adminAPI.auditoriaList({
      inicio: inicio || undefined,
      fin:    fin    || undefined,
      tipo:   filtroTipo  || undefined,
      tabla:  filtroTabla || undefined,
    })
      .then(setEventos)
      .finally(() => setLoading(false))
  }, [inicio, fin, filtroTipo, filtroTabla])

  const tablas   = useMemo(() => [...new Set(eventos.map(e => e.tabla_nombre))].sort(),   [eventos])
  const usuarios = useMemo(() => [...new Set(eventos.map(e => e.usuario_nombre))].sort(), [eventos])

  const filtrados = useMemo(() =>
    eventos.filter(e => {
      if (busqueda && !e.descripcion?.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    })
  , [eventos, busqueda])

  const stats = useMemo(() => ({
    total:   filtrados.length,
    inserts: filtrados.filter(e => e.tipo_operacion === 'INSERT').length,
    updates: filtrados.filter(e => e.tipo_operacion === 'UPDATE').length,
    deletes: filtrados.filter(e => e.tipo_operacion === 'DELETE').length,
  }), [filtrados])

  return (
    <AppLayout>
      <Topbar title="Auditoría del sistema">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarFechas(v => !v)}
            className={`px-3 py-[7px] text-[13px] font-semibold border rounded-md transition-all flex items-center gap-1.5 ${
              mostrarFechas ? 'border-[#24388C] bg-[#EEF1FA] text-[#24388C]' : 'border-[#D5D5D5] bg-white text-[#4A4A4A] hover:bg-[#F7F7F7]'
            }`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Fechas
          </button>
          <button className="px-3 py-[7px] text-[13px] font-semibold border border-[#D5D5D5] rounded-md bg-white text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Exportar
          </button>
        </div>
      </Topbar>

      <div className="p-4 sm:p-6">

        {/* Filtro de fechas */}
        {mostrarFechas && (
          <div className="flex flex-wrap gap-3 mb-4 p-4 bg-white rounded-xl border border-[#F0F0F0] shadow-sm">
            <div>
              <label className="block text-[11.5px] font-semibold text-[#4A4A4A] mb-1">Desde</label>
              <input type="date" value={inicio} onChange={e => setInicio(e.target.value)}
                className="border border-[#D5D5D5] rounded-md px-3 py-[6px] text-[13px] outline-none focus:border-[#24388C] transition-all" />
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-[#4A4A4A] mb-1">Hasta</label>
              <input type="date" value={fin} onChange={e => setFin(e.target.value)}
                className="border border-[#D5D5D5] rounded-md px-3 py-[6px] text-[13px] outline-none focus:border-[#24388C] transition-all" />
            </div>
            {(inicio || fin) && (
              <div className="flex items-end">
                <button onClick={() => { setInicio(''); setFin('') }}
                  className="px-3 py-[6px] text-[12.5px] border border-[#D5D5D5] rounded-md text-[#4A4A4A] hover:bg-[#F7F7F7] transition-all">
                  Limpiar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Eventos',  value: stats.total,   color: 'text-[#1A1A1A]' },
            { label: 'Inserts',  value: stats.inserts, color: 'text-[#1A8754]' },
            { label: 'Updates',  value: stats.updates, color: 'text-[#F39610]' },
            { label: 'Deletes',  value: stats.deletes, color: 'text-[#C0392B]' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm px-4 py-3.5">
              <div className="text-[11.5px] text-[#ABABAB] font-semibold mb-1">{s.label}</div>
              <div className={`text-[26px] font-extrabold ${s.color}`}>
                {loading ? <span className="text-[16px] text-[#D5D5D5]">—</span> : s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white focus-within:border-[#24388C] focus-within:ring-2 focus-within:ring-[#24388C]/15 transition-all flex-1 min-w-[180px]">
            <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input className="outline-none text-[13.5px] bg-transparent w-full placeholder:text-[#ABABAB]"
              placeholder="Buscar en descripción..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
            className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] sm:w-40">
            <option value="">Todos los tipos</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select value={filtroTabla} onChange={e => setFiltroTabla(e.target.value)}
            className="text-[13px] px-3 py-[7px] border border-[#D5D5D5] rounded-md bg-white outline-none text-[#4A4A4A] focus:border-[#24388C] sm:w-52">
            <option value="">Todas las tablas</option>
            {tablas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Event list */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-[3px] border-[#24388C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-20 text-[#ABABAB] text-[14px]">
              Sin eventos con los filtros seleccionados
            </div>
          ) : filtrados.map((e, i) => {
            const tipo  = e.tipo_operacion ?? ''
            const style = TIPO_STYLE[tipo] ?? TIPO_STYLE.UPDATE
            const color = avatarColor(e.usuario_nombre)
            return (
              <div key={e.id ?? i}
                className={`flex items-center gap-3 px-5 py-4 ${i < filtrados.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}>

                {/* Type icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${style.icon}`}>
                  {tipo === 'INSERT' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                  {tipo === 'UPDATE' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  )}
                  {tipo === 'DELETE' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded ${style.pill}`}>
                      {tipo}
                    </span>
                    <span className="font-mono text-[10.5px] text-[#ABABAB] bg-[#F7F7F7] px-1.5 py-0.5 rounded">
                      {e.tabla_nombre}#{e.entidad_id}
                    </span>
                  </div>
                  <div className="text-[13px] font-medium text-[#1A1A1A] mb-1">{e.descripcion}</div>
                  <div className="flex items-center gap-1.5 text-[11.5px] text-[#ABABAB]">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                      style={{ background: color }}>
                      {initials(e.usuario_nombre)}
                    </div>
                    <span>{e.usuario_nombre}</span>
                    <span>·</span>
                    <span>{formatFecha(e.fecha_evento)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </AppLayout>
  )
}
