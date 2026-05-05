import { useState, useEffect, useMemo } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { coordinadorAPI } from '../../coordinador/services/coordinadorAPI'

const TIPO_ICON_CONFIG = {
  error:   { iconBg: '#FDECEA', iconColor: '#C0392B' },
  warning: { iconBg: '#FFF8E5', iconColor: '#B87E15' },
  info:    { iconBg: '#EEF1FA', iconColor: '#24388C' },
  success: { iconBg: '#E8F5EE', iconColor: '#1A8754' },
}

function NotifIcon({ tipo }) {
  const d = tipo === 'success'
    ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    : tipo === 'info'
    ? 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    : tipo === 'warning'
    ? 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
    : 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

export default function LogNotificacionesPage() {
  const [notifs,   setNotifs]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  useEffect(() => {
    coordinadorAPI.logNotificaciones()
      .then(n => setNotifs(n ?? []))
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false))
  }, [])

  const filtradas = useMemo(() => {
    let lista = notifs
    if (filtroTipo) lista = lista.filter(n => n.tipo === filtroTipo)
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(n =>
        n.titulo?.toLowerCase().includes(q) ||
        n.subtitulo?.toLowerCase().includes(q) ||
        n.para?.toLowerCase().includes(q)
      )
    }
    return lista
  }, [notifs, filtroTipo, busqueda])

  const criticas    = notifs.filter(n => n.tipo === 'error').length
  const advertencias = notifs.filter(n => n.tipo === 'warning').length
  const emailsEnviados = notifs.length

  return (
    <AppLayout>
      <Topbar title="Log de notificaciones" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando notificaciones..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Alertas críticas', value: criticas,    color: '#C0392B' },
                { label: 'Advertencias',      value: advertencias, color: '#F39610' },
                { label: 'Emails enviados',   value: emailsEnviados, sub: 'Esta semana', color: '#24388C' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
                  <div className="text-[26px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  {s.sub && <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar en notificaciones..."
                  className="pl-9 pr-4 py-2 w-full border border-[#E5E5E5] rounded-lg text-[12.5px] bg-white focus:outline-none focus:border-[#24388C] transition"
                />
              </div>
              <select
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition">
                <option value="">Todos los tipos</option>
                <option value="error">Alertas críticas</option>
                <option value="warning">Advertencias</option>
                <option value="info">Información</option>
                <option value="success">Resueltas</option>
              </select>
            </div>

            {/* List */}
            {filtradas.length === 0 ? (
              <div className="text-center py-16 text-[13px] text-[#ABABAB]">Sin notificaciones</div>
            ) : (
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                {filtradas.map((n, i) => {
                  const cfg = TIPO_ICON_CONFIG[n.tipo] ?? TIPO_ICON_CONFIG.info
                  return (
                    <div key={n.id ?? i}
                      className="grid items-center gap-3 px-4 py-3.5 border-b border-[#F0F0F0] last:border-0"
                      style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: cfg.iconBg, color: cfg.iconColor }}>
                        <NotifIcon tipo={n.tipo} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[13.5px] font-semibold text-[#1A1A1A]">{n.titulo}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: '#EEF1FA', color: '#24388C' }}>
                            {n.via}
                          </span>
                        </div>
                        <div className="text-[12.5px] text-[#6B6B6B] truncate">{n.subtitulo}</div>
                        <div className="text-[11.5px] text-[#ABABAB] mt-0.5">
                          Para: <strong className="text-[#4A4A4A]">{n.para}</strong> · {n.tiempo}
                        </div>
                      </div>
                      <button className="text-[12px] font-semibold text-[#24388C] hover:underline whitespace-nowrap flex-shrink-0">
                        Ver detalle
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
