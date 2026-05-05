import { useState, useEffect, useMemo } from 'react'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { coordinadorAPI } from '../../coordinador/services/coordinadorAPI'

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const TIPO_CONFIG = {
  critical: { bg: '#FDECEA', border: '#f5c6c6', iconBg: '#C0392B', label: 'Crítica',      textColor: '#C0392B' },
  warning:  { bg: '#FFF8E5', border: '#F5E0B0', iconBg: '#C7770D', label: 'Advertencia',  textColor: '#B87E15' },
  info:     { bg: '#EEF1FA', border: '#c5cfed', iconBg: '#24388C', label: 'Información',  textColor: '#24388C' },
  success:  { bg: '#E8F5EE', border: '#b7e0c4', iconBg: '#1A8754', label: 'Resuelta',     textColor: '#1A8754' },
}



function AlertaIcon({ tipo }) {
  const paths = {
    critical: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    warning:  'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    info:     'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
    success:  'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[tipo] ?? paths.info} />
    </svg>
  )
}

function EstadoBadge({ estado }) {
  const colors = {
    PROSPECTO:   { bg: '#EEF1FA', color: '#24388C' },
    CALIFICADO:  { bg: '#FFF4E0', color: '#F39610' },
    PROPUESTA:   { bg: '#F0EEF9', color: '#6366F1' },
    NEGOCIACION: { bg: '#F0EEF9', color: '#6366F1' },
    GANADA:      { bg: '#E8F5EE', color: '#1A8754' },
    PERDIDA:     { bg: '#FDECEA', color: '#C0392B' },
  }
  const s = colors[estado] ?? { bg: '#F0F0F0', color: '#4A4A4A' }
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}>
      {estado}
    </span>
  )
}

function AlertaCard({ alerta }) {
  const cfg = TIPO_CONFIG[alerta.tipo] ?? TIPO_CONFIG.info
  return (
    <div className="flex items-start gap-3.5 p-4 rounded-xl border mb-2.5 hover:shadow-sm transition"
      style={{ background: cfg.bg, borderColor: cfg.border }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
        style={{ background: cfg.iconBg }}>
        <AlertaIcon tipo={alerta.tipo} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className="text-[14px] font-bold text-[#1A1A1A]">{alerta.titulo}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-white"
            style={{ background: cfg.iconBg }}>
            {cfg.label}
          </span>
        </div>
        <div className="text-[12.5px] text-[#4A4A4A] mb-2">{alerta.descripcion}</div>
        <div className="flex items-center flex-wrap gap-2">
          {alerta.registro && (
            <span className="text-[10.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
              style={{ background: alerta.registro.startsWith('OPP') ? '#FFF4E0' : '#EEF1FA',
                       color: alerta.registro.startsWith('OPP') ? '#C7770D' : '#24388C' }}>
              {alerta.registro}
            </span>
          )}
          {alerta.badgeEstado && <EstadoBadge estado={alerta.badgeEstado} />}
          {alerta.valor && (
            <span className="text-[12px] font-bold" style={{ color: '#F39610' }}>{alerta.valor}</span>
          )}
          {alerta.ejec && (
            <span className="flex items-center gap-1.5 text-[12px] text-[#4A4A4A]">
              <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: AVATAR_COLORS[(alerta.ejecIdx ?? 0) % 6] }}>
                {alerta.ejec.slice(0, 1)}
              </span>
              {alerta.ejec}
            </span>
          )}
          {alerta.dias != null && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded"
              style={{ background: alerta.tipo === 'critical' ? 'rgba(192,57,43,0.15)' : 'rgba(199,119,13,0.15)',
                       color: alerta.tipo === 'critical' ? '#C0392B' : '#C7770D' }}>
              {alerta.dias}d
            </span>
          )}
          <span className="text-[11px] text-[#ABABAB]">{alerta.tiempo}</span>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { key: 'todas',    label: 'Todas' },
  { key: 'critical', label: 'Críticas' },
  { key: 'warning',  label: 'Advertencias' },
  { key: 'info',     label: 'Información' },
]

export default function AlertasCenterPage() {
  const [alertas,  setAlertas]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tabActiva, setTab]     = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    coordinadorAPI.alertas()
      .then(a => setAlertas(a ?? []))
      .catch(() => setAlertas([]))
      .finally(() => setLoading(false))
  }, [])

  const filtradas = useMemo(() => {
    let lista = alertas
    if (tabActiva !== 'todas') lista = lista.filter(a => a.tipo === tabActiva)
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(a =>
        a.titulo?.toLowerCase().includes(q) ||
        a.empresa?.toLowerCase().includes(q) ||
        a.ejec?.toLowerCase().includes(q)
      )
    }
    return lista
  }, [alertas, tabActiva, busqueda])

  const criticas    = alertas.filter(a => a.tipo === 'critical').length
  const advertencias = alertas.filter(a => a.tipo === 'warning').length
  const info        = alertas.filter(a => a.tipo === 'info').length
  const resueltas   = alertas.filter(a => a.tipo === 'success').length

  const countFor = (key) => key === 'todas' ? alertas.length : alertas.filter(a => a.tipo === key).length

  return (
    <AppLayout>
      <Topbar title="Alertas activas" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando alertas..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Críticas',      value: criticas,    sub: 'Acción inmediata', color: '#C0392B' },
                { label: 'Advertencias',  value: advertencias, sub: 'Cerca del umbral', color: '#F39610' },
                { label: 'Información',   value: info,         sub: 'Recordatorios',   color: '#24388C' },
                { label: 'Resueltas',     value: resueltas,    sub: 'Últimas 24h',     color: '#1A8754' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
                  <div className="text-[26px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b border-[#F0F0F0]">
              {TABS.map(t => (
                <button key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all -mb-px ${
                    tabActiva === t.key
                      ? 'border-[#24388C] text-[#24388C]'
                      : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
                  }`}>
                  {t.label}
                  <span className="ml-1.5 text-[11px] bg-[#F0F0F0] text-[#4A4A4A] px-1.5 py-0.5 rounded-full">
                    {countFor(t.key)}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-sm">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por título, empresa, ejecutivo..."
                className="pl-9 pr-4 py-2 w-full border border-[#E5E5E5] rounded-lg text-[12.5px] bg-white focus:outline-none focus:border-[#24388C] transition"
              />
            </div>

            {/* List */}
            {filtradas.length === 0 ? (
              <div className="text-center py-16 text-[13px] text-[#ABABAB]">
                No hay alertas en esta categoría
              </div>
            ) : (
              <div>
                {filtradas.map((a, i) => <AlertaCard key={a.id ?? i} alerta={a} />)}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
