import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { metasAPI } from '../services/metasAPI'

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const EJECUTIVOS_DEFAULT = [
  {
    id: 1, nombre: 'María García', departamento: 'Antioquia', cumplimiento: 92,
    metas: [
      { label: 'Actividades / semana', actual: 22, meta: 20, pct: 110, color: '#1A8754' },
      { label: 'Oportunidades activas', actual: 9,  meta: 10, pct: 90,  color: '#F39610' },
      { label: 'Clientes nuevos',       actual: 7,  meta: 5,  pct: 140, color: '#1A8754' },
      { label: 'Tasa conversión (%)',   actual: 22, meta: 15, pct: 147, color: '#1A8754' },
      { label: 'Valor cerrado (M)',     actual: 680,meta: 500,pct: 136, color: '#1A8754' },
    ],
  },
  {
    id: 2, nombre: 'Juan Pérez', departamento: 'Santander', cumplimiento: 85,
    metas: [
      { label: 'Actividades / semana', actual: 18, meta: 20, pct: 90,  color: '#F39610' },
      { label: 'Oportunidades activas', actual: 12, meta: 10, pct: 120, color: '#1A8754' },
      { label: 'Clientes nuevos',       actual: 4,  meta: 5,  pct: 80,  color: '#F39610' },
      { label: 'Tasa conversión (%)',   actual: 15, meta: 15, pct: 100, color: '#1A8754' },
      { label: 'Valor cerrado (M)',     actual: 425,meta: 500,pct: 85,  color: '#F39610' },
    ],
  },
  {
    id: 3, nombre: 'Pedro Salazar', departamento: 'Atlántico', cumplimiento: 48,
    metas: [
      { label: 'Actividades / semana', actual: 8,  meta: 20, pct: 40, color: '#C0392B' },
      { label: 'Oportunidades activas', actual: 5,  meta: 10, pct: 50, color: '#C0392B' },
      { label: 'Clientes nuevos',       actual: 1,  meta: 5,  pct: 20, color: '#C0392B' },
      { label: 'Tasa conversión (%)',   actual: 8,  meta: 15, pct: 53, color: '#C0392B' },
      { label: 'Valor cerrado (M)',     actual: 85, meta: 500,pct: 17, color: '#C0392B' },
    ],
  },
]

function StatCard({ label, value, sub, color = '#24388C' }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[26px] font-extrabold tracking-tight" style={{ color }}>{value}</div>
      {sub && <div className="text-[12px] text-[#6B6B6B] mt-0.5">{sub}</div>}
    </div>
  )
}

function MetaBar({ m }) {
  const capPct = Math.min(100, (m.pct / Math.max(100, m.pct)) * 100)
  const metaMark = Math.min(100, (m.meta / Math.max(m.meta, m.actual)) * 100)
  return (
    <div className="grid gap-3.5 items-center py-2.5 border-b border-[#F0F0F0] last:border-0"
      style={{ gridTemplateColumns: '160px 1fr 110px' }}>
      <span className="text-[12.5px] text-[#4A4A4A]">{m.label}</span>
      <div className="relative h-6 bg-[#F0F0F0] rounded-md overflow-hidden">
        <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{ left: `${metaMark}%`, background: '#1A1A1A' }}>
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#1A1A1A] bg-white px-0.5 rounded">
            META
          </span>
        </div>
        <div className="h-full rounded-md flex items-center pl-2.5" style={{ width: `${capPct}%`, background: m.color }}>
          <span className="text-[11px] font-bold text-white">{m.actual >= m.meta ? '✓' : ''} {m.actual}</span>
        </div>
      </div>
      <div className="text-[13px] font-bold text-[#1A1A1A] text-right">
        {m.pct}% · <span className="text-[11px] text-[#6B6B6B]">meta {m.meta}</span>
      </div>
    </div>
  )
}

function EjecutivoCard({ ej, idx, onVerPerfil }) {
  const cum = ej.cumplimiento ?? 0
  const color = cum >= 80 ? '#1A8754' : cum >= 65 ? '#F39610' : '#C0392B'
  const nombre = ej.nombre ?? '?'
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
      onClick={() => onVerPerfil(ej.id)}>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
            style={{ background: AVATAR_COLORS[idx % 6] }}>
            {nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-[#1A1A1A]">{nombre}</div>
            <div className="text-[12px] text-[#6B6B6B]">{ej.departamento ?? ej.depto ?? '—'}</div>
          </div>
          <div className="text-right">
            <div className="text-[28px] font-extrabold leading-none" style={{ color }}>{cum}%</div>
            <div className="text-[10.5px] text-[#ABABAB] uppercase tracking-wide font-semibold mt-0.5">Cumplimiento</div>
          </div>
        </div>

        <div className="border-t border-[#F0F0F0] pt-3">
          {(ej.metas ?? []).map((m, i) => <MetaBar key={i} m={m} />)}
        </div>

        {cum < 65 && (
          <div className="mt-3 px-3 py-2.5 rounded-lg text-[12px]" style={{ background: '#FDECEA', color: '#C0392B' }}>
            <strong>Requiere acompañamiento.</strong> Cumplimiento bajo el umbral crítico (65%)
          </div>
        )}
      </div>
    </div>
  )
}

export default function CumplimientoPage() {
  const navigate  = useNavigate()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    metasAPI.cumplimiento()
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const stats     = data?.stats ?? {}
  const ejecutivos = data?.ejecutivos ?? EJECUTIVOS_DEFAULT

  const alto  = stats.alto  ?? ejecutivos.filter(e => (e.cumplimiento ?? 0) >= 80).length
  const medio = stats.medio ?? ejecutivos.filter(e => { const c = e.cumplimiento ?? 0; return c >= 65 && c < 80 }).length
  const bajo  = stats.bajo  ?? ejecutivos.filter(e => (e.cumplimiento ?? 0) < 65).length
  const promedio = stats.promedio ?? (ejecutivos.length
    ? Math.round(ejecutivos.reduce((s, e) => s + (e.cumplimiento ?? 0), 0) / ejecutivos.length)
    : 0)

  return (
    <AppLayout>
      <Topbar title="Reporte de cumplimiento" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando cumplimiento..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard label="Alto cumplimiento" value={alto} sub="≥ 80%" color="#1A8754" />
              <StatCard label="Cumplimiento medio" value={medio} sub="65% – 79%" color="#F39610" />
              <StatCard label="Bajo cumplimiento" value={bajo} sub="< 65% (crítico)" color="#C0392B" />
              <StatCard label="Promedio equipo" value={`${promedio}%`} sub="+4pp vs mes anterior" />
            </div>

            {/* Ejecutivos */}
            {ejecutivos.length === 0 ? (
              <div className="text-center py-16 text-[13px] text-[#ABABAB]">
                Sin datos de cumplimiento
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ejecutivos.map((ej, i) => (
                  <EjecutivoCard
                    key={ej.id ?? i}
                    ej={ej}
                    idx={i}
                    onVerPerfil={(id) => navigate(`/coordinador/equipo/${id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
