import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { monitoreoAPI } from '../services/monitoreoAPI'

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const ESTADO_CFG = {
  green:  { label: 'Al día',    bg: '#E8F5EE', color: '#1A8754', dot: '#1A8754' },
  yellow: { label: 'Atención',  bg: '#FFF8E5', color: '#B87E15', dot: '#F39610' },
  red:    { label: 'Crítico',   bg: '#FDECEA', color: '#C0392B', dot: '#C0392B' },
}

const formatCOP = (n) => {
  if (!n && n !== 0) return '—'
  return `$ ${(n / 1_000_000).toFixed(0)} M`
}

function ComplianceMini({ value, estado }) {
  const color = ESTADO_CFG[estado]?.color ?? '#6B6B6B'
  return (
    <div className="relative w-9 h-9 rounded-full flex items-center justify-center mx-auto"
      style={{ background: `conic-gradient(${color} ${value}%, #F0F0F0 ${value}%)` }}>
      <div className="absolute inset-[3px] bg-white rounded-full" />
      <span className="relative z-10 text-[10.5px] font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

export default function MonitoreoPage() {
  const navigate = useNavigate()
  const [ejecutivos, setEjecutivos] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('todos')

  useEffect(() => {
    monitoreoAPI.ejecutivos()
      .then(d => setEjecutivos(d ?? []))
      .catch(() => setEjecutivos([]))
      .finally(() => setLoading(false))
  }, [])

  const alDia     = ejecutivos.filter(e => e.estado === 'green').length
  const atencion  = ejecutivos.filter(e => e.estado === 'yellow').length
  const critico   = ejecutivos.filter(e => e.estado === 'red').length
  const totalAlertas = ejecutivos.reduce((s, e) => s + (e.estancados ?? 0) + (e.sin_actividad ?? 0), 0)

  const filtrados = useMemo(() => {
    if (filtroEstado === 'todos') return ejecutivos
    return ejecutivos.filter(e => e.estado === filtroEstado)
  }, [ejecutivos, filtroEstado])

  return (
    <AppLayout>
      <Topbar title="Monitoreo de ejecutivos" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando monitoreo..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Al día',             value: alDia,       color: '#1A8754', sub: `De ${ejecutivos.length} ejecutivos` },
                { label: 'Requieren atención', value: atencion,    color: '#F39610', sub: 'Seguimiento necesario' },
                { label: 'Estado crítico',     value: critico,     color: '#C0392B', sub: 'Acción inmediata' },
                { label: 'Total alertas',      value: totalAlertas, color: '#24388C', sub: 'Leads + opps estancados' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
                  <div className="text-[26px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 mb-4">
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition">
                <option value="todos">Todos</option>
                <option value="green">Al día</option>
                <option value="yellow">Atención</option>
                <option value="red">Crítico</option>
              </select>
              <button onClick={() => navigate('/coordinador/mapa-actividades')}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold border border-[#E5E5E5] text-[#24388C] hover:bg-[#EEF1FA] transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0z" />
                </svg>
                Mapa de actividades
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="hidden lg:grid px-5 py-3 bg-[#F7F7F7] border-b border-[#F0F0F0] text-[10.5px] font-semibold text-[#ABABAB] uppercase tracking-wider"
                style={{ gridTemplateColumns: '2fr 1.2fr 80px 100px 60px 60px 80px 80px 80px 100px 60px' }}>
                <span>Ejecutivo</span>
                <span>Territorio</span>
                <span className="text-center">Cumpl.</span>
                <span className="text-right">Ventas mes</span>
                <span className="text-center">Opp</span>
                <span className="text-center">Leads</span>
                <span className="text-center">Activ.</span>
                <span className="text-center">Estancados</span>
                <span className="text-center">Sin activ.</span>
                <span>Estado</span>
                <span></span>
              </div>

              {filtrados.length === 0 ? (
                <div className="text-center py-12 text-[13px] text-[#ABABAB]">No hay ejecutivos con este estado</div>
              ) : (
                filtrados.map((ej, i) => {
                  const cfg = ESTADO_CFG[ej.estado] ?? ESTADO_CFG.green
                  const avatarColor = AVATAR_COLORS[(ej.color ?? i) % 6]
                  return (
                    <div key={ej.id ?? i}
                      className="hidden lg:grid items-center gap-3 px-5 py-3.5 border-t border-[#F0F0F0] hover:bg-[#FAFAFA] transition"
                      style={{ gridTemplateColumns: '2fr 1.2fr 80px 100px 60px 60px 80px 80px 80px 100px 60px' }}>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                          style={{ background: avatarColor }}>
                          {ej.iniciales ?? (ej.nombre ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-semibold text-[#1A1A1A]">{ej.nombre}</span>
                      </div>

                      <span className="text-[12.5px] text-[#6B6B6B]">{ej.depto ?? '—'}</span>

                      <div className="flex justify-center">
                        <ComplianceMini value={ej.comp ?? 0} estado={ej.estado} />
                      </div>

                      <div className="text-right font-bold text-[#F39610]">{formatCOP(ej.ventas)}</div>

                      <div className="text-center font-semibold text-[#1A1A1A]">{ej.opp ?? '—'}</div>
                      <div className="text-center font-semibold text-[#1A1A1A]">{ej.leads ?? '—'}</div>
                      <div className="text-center font-semibold text-[#1A1A1A]">{ej.act ?? '—'}</div>

                      <div className="text-center font-bold" style={{
                        color: (ej.estancados ?? 0) > 2 ? '#C0392B' : (ej.estancados ?? 0) > 0 ? '#F39610' : '#ABABAB'
                      }}>{ej.estancados ?? 0}</div>

                      <div className="text-center font-bold" style={{
                        color: (ej.sin_actividad ?? 0) > 2 ? '#C0392B' : (ej.sin_actividad ?? 0) > 0 ? '#F39610' : '#ABABAB'
                      }}>{ej.sin_actividad ?? 0}</div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                          {cfg.label}
                        </span>
                      </div>

                      <div>
                        <button onClick={() => navigate(`/coordinador/equipo/${ej.id}`)}
                          className="p-1.5 rounded hover:bg-[#EEF1FA] transition text-[#6B6B6B] hover:text-[#24388C]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}

              {/* Mobile cards */}
              {filtrados.map((ej, i) => {
                const cfg = ESTADO_CFG[ej.estado] ?? ESTADO_CFG.green
                const avatarColor = AVATAR_COLORS[(ej.color ?? i) % 6]
                return (
                  <div key={`m-${ej.id ?? i}`}
                    className="lg:hidden flex items-center gap-3 px-4 py-3.5 border-t border-[#F0F0F0]"
                    onClick={() => navigate(`/coordinador/equipo/${ej.id}`)}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor }}>
                      {ej.iniciales ?? (ej.nombre ?? '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{ej.nombre}</div>
                      <div className="text-[11.5px] text-[#6B6B6B]">{ej.depto} · {formatCOP(ej.ventas)}</div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
