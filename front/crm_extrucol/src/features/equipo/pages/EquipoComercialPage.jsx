import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { equipoAPI } from '../services/equipoAPI'

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const formatCOP = (n) => {
  if (!n && n !== 0) return '—'
  return `$ ${(n / 1_000_000).toFixed(0)} M`
}

const EJECUTIVOS_DEFAULT = [
  { id: 1, nombre: 'Diana',   departamento: 'Medellín',             ventas: 698_000_000, meta: 600_000_000, meta_pct: 116, oportunidades: 6, leads: 3, actividades: 18, cumplimiento: 95, tendencia_pct: 20  },
  { id: 2, nombre: 'Paola',   departamento: 'Cartagena',            ventas: 419_000_000, meta: 400_000_000, meta_pct: 105, oportunidades: 7, leads: 4, actividades: 15, cumplimiento: 88, tendencia_pct: 12  },
  { id: 3, nombre: 'Alvaro',  departamento: 'Tocancipa',            ventas: 187_000_000, meta: 200_000_000, meta_pct: 94,  oportunidades: 1, leads: 1, actividades: 8,  cumplimiento: 82, tendencia_pct: 5   },
  { id: 4, nombre: 'Gonzalo', departamento: 'Bucaramanga',          ventas: 44_000_000,  meta: 80_000_000,  meta_pct: 55,  oportunidades: 1, leads: 2, actividades: 6,  cumplimiento: 60, tendencia_pct: -8  },
  { id: 5, nombre: 'Alexis',  departamento: 'Santa Rosa de Cabal',  ventas: 28_000_000,  meta: 60_000_000,  meta_pct: 47,  oportunidades: 1, leads: 1, actividades: 4,  cumplimiento: 52, tendencia_pct: -15 },
]

function EjecutivoCard({ ej, idx, onVerPerfil }) {
  const metaColor = ej.meta_pct >= 100 ? '#1A8754' : ej.meta_pct >= 80 ? '#F39610' : '#C0392B'
  const compColor = (ej.cumplimiento ?? 0) >= 80 ? '#1A8754' : (ej.cumplimiento ?? 0) >= 60 ? '#F39610' : '#C0392B'
  const nombre  = ej.nombre ?? '?'
  const positivo = (ej.tendencia_pct ?? 0) >= 0

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden cursor-pointer hover:border-[#24388C] hover:shadow-md transition"
      onClick={() => onVerPerfil(ej.id)}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
            style={{ background: AVATAR_COLORS[idx % 6] }}>
            {nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-[#1A1A1A]">{nombre}</div>
            <div className="text-[12px] text-[#6B6B6B]">{ej.departamento ?? '—'}</div>
            <div className="text-[12px] font-semibold mt-0.5" style={{ color: positivo ? '#1A8754' : '#C0392B' }}>
              {positivo ? '▲' : '▼'} {Math.abs(ej.tendencia_pct ?? 0)}% vs mes anterior
            </div>
          </div>
          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
            style={{ background: metaColor }}>
            {ej.meta_pct >= 100 ? '✓ Superó meta' : `${ej.meta_pct}% meta`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-[#F7F7F7] rounded-lg p-3 mb-3">
          <div className="flex justify-between text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wide mb-1.5">
            <span>Meta del mes</span>
            <span className="text-[#1A1A1A] normal-case font-bold">
              {formatCOP(ej.ventas)} / {formatCOP(ej.meta)}
            </span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#F0F0F0]">
            <div className="h-full rounded-full" style={{ width: `${Math.min(ej.meta_pct ?? 0, 100)}%`, background: metaColor }} />
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#F0F0F0]">
          {[
            ['Opp.', ej.oportunidades],
            ['Leads', ej.leads],
            ['Act.', ej.actividades],
            ['Cumpl.', `${ej.cumplimiento ?? 0}%`],
          ].map(([lbl, val], i) => (
            <div key={lbl} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-[#ABABAB] uppercase tracking-wide">{lbl}</span>
              <span className="text-[15px] font-bold" style={{ color: i === 3 ? compColor : '#1A1A1A' }}>
                {val ?? '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function EquipoComercialPage() {
  const navigate  = useNavigate()
  const [equipo,  setEquipo]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    equipoAPI.listar()
      .then(list => setEquipo(list.length ? list : EJECUTIVOS_DEFAULT))
      .catch(() => setEquipo(EJECUTIVOS_DEFAULT))
      .finally(() => setLoading(false))
  }, [])

  const ventasTotal = equipo.reduce((s, e) => s + (e.ventas ?? 0), 0)
  const metaTotal   = equipo.reduce((s, e) => s + (e.meta ?? 0), 0)
  const sobreMeta   = equipo.filter(e => (e.meta_pct ?? 0) >= 100).length
  const bajoMeta    = equipo.filter(e => (e.meta_pct ?? 0) < 80).length

  const rolActual = (() => {
    try { return localStorage.getItem('rol') ?? 'DIRECTOR' } catch { return 'DIRECTOR' }
  })()
  const perfilBase = rolActual === 'COORDINADOR' ? '/coordinador/equipo' : '/director/equipo'

  return (
    <AppLayout>
      <Topbar title="Equipo comercial" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando equipo..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Ventas del equipo</div>
                <div className="text-[22px] font-extrabold tracking-tight" style={{ color: '#F39610' }}>{formatCOP(ventasTotal)}</div>
                <div className="text-[12px] text-[#6B6B6B] mt-0.5">Mes actual</div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Meta del equipo</div>
                <div className="text-[22px] font-extrabold tracking-tight text-[#1A1A1A]">{formatCOP(metaTotal)}</div>
                <div className="text-[12px] text-[#6B6B6B] mt-0.5">
                  {metaTotal ? `${Math.round((ventasTotal / metaTotal) * 100)}% alcanzado` : '—'}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Sobre meta</div>
                <div className="text-[26px] font-extrabold tracking-tight" style={{ color: '#1A8754' }}>{sobreMeta}</div>
                <div className="text-[12px] text-[#6B6B6B] mt-0.5">De {equipo.length} ejecutivos</div>
              </div>
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">Bajo meta</div>
                <div className="text-[26px] font-extrabold tracking-tight" style={{ color: '#C0392B' }}>{bajoMeta}</div>
                <div className="text-[12px] text-[#6B6B6B] mt-0.5">Requieren atención</div>
              </div>
            </div>

            {/* Grid */}
            {equipo.length === 0 ? (
              <div className="text-center py-16 text-[13px] text-[#ABABAB]">Sin datos del equipo</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {equipo.map((e, i) => (
                  <EjecutivoCard
                    key={e.id ?? i}
                    ej={e}
                    idx={i}
                    onVerPerfil={(id) => navigate(`${perfilBase}/${id}`)}
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
