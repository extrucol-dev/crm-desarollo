import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { coordinadorAPI } from '../../coordinador/services/coordinadorAPI'

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const FUNNEL_DEFAULT = [
  { label: 'Leads Nuevos',           count: 40, pct: 100, color: '#24388C' },
  { label: 'Contactados',            count: 28, pct: 70,  color: '#6366F1' },
  { label: 'Interesados',            count: 18, pct: 45,  color: '#F39610' },
  { label: 'Oportunidades activas',  count: 51, pct: 85,  color: '#1A8754' },
  { label: 'Ganadas mes',            count: 9,  pct: 15,  color: '#22C55E' },
]

const VARIABLES_DEFAULT = [
  { label: 'Monto mínimo cliente nuevo',         valor: '$ 50.000.000',  color: '#F39610' },
  { label: 'Días alerta lead sin contactar',      valor: '3 días',        color: null },
  { label: 'Días alerta oportunidad estancada',   valor: '7 días',        color: null },
  { label: 'Días crítico sin actividad',          valor: '14 días',       color: '#C0392B' },
  { label: 'Probabilidad mín. para forecast',     valor: '50%',           color: null },
  { label: 'Meta actividades/semana',             valor: '20',            color: null },
]

const ALERT_STYLES = {
  critica:     { bg: '#FDECEA', border: '#f5c6c6', titleColor: '#C0392B' },
  advertencia: { bg: '#FFF8E5', border: '#F5E0B0', titleColor: '#B87E15' },
  info:        { bg: '#EEF1FA', border: '#c5cfed', titleColor: '#24388C' },
}

function StatCard({ label, value, sub, color = '#24388C' }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{label}</div>
      <div className="text-[26px] font-extrabold tracking-tight" style={{ color }}>{value}</div>
      {sub && <div className="text-[12px] text-[#6B6B6B] mt-0.5">{sub}</div>}
    </div>
  )
}

function ComplianceBadge({ pct }) {
  const color = pct >= 80 ? '#1A8754' : pct >= 65 ? '#F39610' : '#C0392B'
  return (
    <div className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `conic-gradient(${color} ${pct}%, #F0F0F0 ${pct}%)` }}>
      <div className="absolute inset-1 bg-white rounded-full" />
      <span className="relative z-10 text-[12px] font-bold" style={{ color }}>{pct}</span>
    </div>
  )
}

function AlertIcon({ prioridad }) {
  const d = prioridad === 'info'
    ? 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    : 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

export default function DashboardCoordinadorPage() {
  const navigate  = useNavigate()
  const [equipo,  setEquipo]  = useState([])
  const [alertas, setAlertas] = useState([])
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      coordinadorAPI.stats(),
      coordinadorAPI.equipo(),
      coordinadorAPI.alertas(),
    ]).then(([sRes, eRes, aRes]) => {
      if (sRes.status === 'fulfilled' && sRes.value) setStats(sRes.value)
      if (eRes.status === 'fulfilled') setEquipo(eRes.value ?? [])
      if (aRes.status === 'fulfilled') setAlertas(aRes.value ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const alertasCriticas    = alertas.filter(a => a.prioridad === 'critica').length
  const alertasAdvertencia = alertas.filter(a => a.prioridad === 'advertencia').length
  const cumplimientoPromedio = equipo.length
    ? Math.round(equipo.reduce((s, e) => s + (e.compliance ?? e.cumplimiento ?? 0), 0) / equipo.length)
    : null
  const ejecutivosCumOk = equipo.filter(e => (e.compliance ?? e.cumplimiento ?? 0) >= 80).length

  const funnel    = stats?.funnel    ?? FUNNEL_DEFAULT
  const variables = stats?.variables ?? VARIABLES_DEFAULT

  return (
    <AppLayout>
      <Topbar title="Panel de seguimiento" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando dashboard..." />}
        {!loading && (
          <>
            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard
                label="Alertas activas"
                value={stats?.alertas_activas ?? alertas.length}
                sub={`${alertasCriticas} críticas · ${alertasAdvertencia} advertencias`}
                color="#C0392B"
              />
              <StatCard
                label="Leads estancados"
                value={stats?.leads_estancados ?? '—'}
                sub="+3 días sin actividad"
                color="#F39610"
              />
              <StatCard
                label="Ejecutivos monitoreados"
                value={stats?.ejecutivos_total ?? equipo.length}
                sub={`${stats?.ejecutivos_cum_ok ?? ejecutivosCumOk} con cumplimiento ≥ 80%`}
              />
              <StatCard
                label="Cumplimiento promedio"
                value={stats?.cumplimiento_promedio != null
                  ? `${stats.cumplimiento_promedio}%`
                  : cumplimientoPromedio != null ? `${cumplimientoPromedio}%` : '—'}
                sub="+5% vs mes anterior"
                color="#1A8754"
              />
            </div>

            {/* ── Equipo + Alertas ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

              {/* Equipo */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">Equipo comercial</div>
                    <div className="text-[12px] text-[#6B6B6B]">Cumplimiento y actividad por ejecutivo</div>
                  </div>
                  <button onClick={() => navigate('/coordinador/cumplimiento')}
                    className="text-[12px] font-semibold text-[#24388C] hover:underline">
                    Ver todos
                  </button>
                </div>
                {equipo.length === 0 ? (
                  <div className="p-6 text-center text-[13px] text-[#ABABAB]">Sin datos del equipo</div>
                ) : (
                  <div>
                    {equipo.map((e, i) => {
                      const pct = e.compliance ?? e.cumplimiento ?? 0
                      const nombre = e.nombre ?? '?'
                      return (
                        <div key={e.id ?? i}
                          className="grid items-center gap-3 px-4 py-3.5 border-b border-[#F0F0F0] last:border-0 hover:bg-[#F7F7F7] transition cursor-pointer"
                          style={{ gridTemplateColumns: 'auto 1fr auto auto auto auto' }}
                          onClick={() => navigate(`/coordinador/equipo/${e.id}`)}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                            style={{ background: AVATAR_COLORS[i % 6] }}>
                            {nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13.5px] font-semibold text-[#1A1A1A] truncate">{nombre}</div>
                            <div className="text-[11.5px] text-[#6B6B6B] truncate">
                              {e.departamento ?? e.depto ?? e.ciudad ?? '—'}
                            </div>
                          </div>
                          {[['Leads', e.leads], ['Opp', e.oportunidades ?? e.opps], ['Act.', e.actividades ?? e.act]].map(([lbl, val]) => (
                            <div key={lbl} className="flex flex-col items-end gap-0.5">
                              <span className="text-[10.5px] font-semibold text-[#ABABAB] uppercase tracking-wide">{lbl}</span>
                              <span className="text-[14px] font-bold text-[#1A1A1A]">{val ?? '—'}</span>
                            </div>
                          ))}
                          <ComplianceBadge pct={pct} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Alertas */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">Alertas activas</div>
                    <div className="text-[12px] text-[#6B6B6B]">
                      {alertas.length > 0 ? `${alertas.length} requieren atención` : 'Sin alertas pendientes'}
                    </div>
                  </div>
                  {alertasCriticas > 0 && (
                    <span className="text-[11px] font-bold text-white bg-[#C0392B] px-2 py-0.5 rounded-full">
                      {alertasCriticas} críticas
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {alertas.length === 0 && (
                    <p className="text-[13px] text-[#ABABAB] text-center py-6">Sin alertas activas</p>
                  )}
                  {alertas.slice(0, 4).map((a, i) => {
                    const prio  = a.prioridad ?? 'info'
                    const style = ALERT_STYLES[prio] ?? ALERT_STYLES.info
                    return (
                      <div key={a.id ?? i}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border"
                        style={{ background: style.bg, borderColor: style.border }}>
                        <AlertIcon prioridad={prio} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold" style={{ color: style.titleColor }}>
                            {a.titulo}
                          </div>
                          {a.descripcion && (
                            <div className="text-[11.5px] text-[#6B6B6B] mt-0.5">{a.descripcion}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {alertas.length > 0 && (
                    <button onClick={() => navigate('/coordinador/alertas')}
                      className="w-full mt-1 py-2 text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] rounded-lg hover:bg-[#F0F0F0] transition">
                      Ver todas las alertas
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Funnel + Variables sistema ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Funnel */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0]">
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Funnel general del equipo</div>
                  <div className="text-[12px] text-[#6B6B6B]">Distribución actual del pipeline</div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {funnel.map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="text-[12px] font-semibold text-[#4A4A4A] shrink-0 w-36">{f.label}</span>
                      <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${f.pct}%`, background: f.color ?? '#24388C' }} />
                      </div>
                      <span className="text-[13px] font-bold text-[#1A1A1A] w-6 text-right shrink-0">{f.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variables del sistema */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">Variables del sistema</div>
                    <div className="text-[12px] text-[#6B6B6B]">Configuración actual de alertas y reglas</div>
                  </div>
                  <button className="text-[12px] font-semibold text-[#24388C] hover:underline">
                    Editar
                  </button>
                </div>
                <div className="p-5">
                  <div className="grid gap-y-3 gap-x-4" style={{ gridTemplateColumns: '1fr auto' }}>
                    {variables.map(v => (
                      <div key={v.label} className="contents">
                        <span className="text-[13px] text-[#4A4A4A]">{v.label}</span>
                        <span className="text-[13px] font-bold" style={{ color: v.color ?? '#1A1A1A' }}>
                          {v.valor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
