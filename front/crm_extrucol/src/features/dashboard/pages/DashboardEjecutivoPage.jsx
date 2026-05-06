import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import { oportunidadesAPI } from '../../oportunidades/services/oportunidadesAPI'
import { directorAPI } from '../../director/services/directorAPI'
import { leadsAPI } from '../../leads/services/leadsAPI'

const ESTADOS_ACTIVOS = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION']
const BADGE_STYLE = {
  PROSPECTO:   { bg: '#EEF1FA', text: '#24388C', dot: '#24388C',  label: 'Prospección' },
  CALIFICACION:{ bg: '#FFF4E0', text: '#B8700C', dot: '#F39610',  label: 'Calificación' },
  PROPUESTA:   { bg: '#F3ECF9', text: '#7B3FA0', dot: '#7B3FA0',  label: 'Propuesta' },
  NEGOCIACION: { bg: '#FFF0F0', text: '#C0392B', dot: '#C0392B',  label: 'Negociación' },
}

const formatCOP = (n) => {
  if (!n) return '$0'
  const m = n / 1_000_000
  return m >= 1 ? `$ ${m.toFixed(0)} M` : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

const formatFecha = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  const hoy  = new Date(); hoy.setHours(0,0,0,0)
  const ayer = new Date(hoy); ayer.setDate(hoy.getDate() - 1)
  const f    = new Date(d);  f.setHours(0,0,0,0)
  const hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  if (f.getTime() === hoy.getTime())  return `Hoy, ${hora}`
  if (f.getTime() === ayer.getTime()) return 'Ayer'
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

const getSemanaActual = () => {
  const hoy = new Date()
  const dia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - dia); lunes.setHours(0,0,0,0)
  const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6)
  return { inicio: lunes.toISOString().slice(0,10), fin: domingo.toISOString().slice(0,10) }
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
const IcoBriefcase = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const IcoCurrency = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IcoClipboard = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)
const IcoTrophy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)
const IcoPlus = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)
const IcoClock = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IcoChevron = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)
const IcoCalendar = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
const IcoFire = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.014 2c-1.46 3.556-3.53 4.47-6.014 4.832 0 9.356 4.252 13.174 6.014 15.168C13.748 20.006 18 16.188 18 6.832 15.516 6.47 13.475 5.556 12.014 2z"/>
  </svg>
)

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, color, Icon }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-4 flex flex-col gap-1">
      <div className="flex items-start justify-between mb-1">
        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider leading-tight">{label}</div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}1A`, color }}>
          <Icon />
        </div>
      </div>
      <div className="text-[24px] font-extrabold tracking-tight leading-none" style={{ color }}>{value}</div>
      <div className="text-[11.5px] text-[#6B6B6B] flex items-center gap-1 mt-0.5">
        {trend && <span className="font-bold text-[#1A8754]">{trend}</span>}
        {sub}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardEjecutivoPage() {
  const navigate = useNavigate()
  const nombre = localStorage.getItem('nombre') ?? 'Ejecutivo'

  const [oportunidades, setOportunidades] = useState([])
  const [actividades,   setActividades]   = useState([])
  const [leads,         setLeads]         = useState([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    const { inicio, fin } = getSemanaActual()
    Promise.all([
      oportunidadesAPI.listar(),
      directorAPI.misActividades({ inicio, fin }),
      leadsAPI.listar(),
    ]).then(([ops, acts, lds]) => {
      setOportunidades(ops)
      setActividades(acts)
      setLeads(lds)
    }).finally(() => setLoading(false))
  }, [])

  const activas       = oportunidades.filter(op => ESTADOS_ACTIVOS.includes(op.estado))
  const valorPipeline = activas.reduce((s, op) => s + (op.valor_estimado ?? 0), 0)
  const ganadas       = oportunidades.filter(op => op.estado === 'GANADA')

  const porEstado = ESTADOS_ACTIVOS.reduce((acc, e) => {
    acc[e] = activas.filter(op => op.estado === e).length
    return acc
  }, {})

  const ultimasActividades = [...actividades]
    .sort((a, b) => new Date(b.fecha_actividad) - new Date(a.fecha_actividad))
    .slice(0, 5)

  const leadsCalientes = [...leads]
    .sort((a, b) => (b.probabilidad ?? b.score ?? 0) - (a.probabilidad ?? a.score ?? 0))
    .slice(0, 3)

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-[#ABABAB]">Cargando dashboard...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">

        {/* ── Encabezado ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-extrabold text-[#1A1A1A] leading-tight">Hola, {nombre} 👋</h1>
            <p className="text-[13.5px] text-[#6B6B6B] mt-0.5">Aquí está el resumen de tu semana comercial</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="text-[12.5px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] bg-white px-3 py-1.5 rounded-lg hover:bg-[#F7F7F7] transition-colors flex items-center gap-1.5">
              <IcoCalendar /> Esta semana
            </button>
            <button onClick={() => navigate('/oportunidades/nueva')}
              className="text-[12.5px] font-semibold text-white bg-[#24388C] px-3 py-1.5 rounded-lg hover:bg-[#1e2f7a] transition-colors flex items-center gap-1.5">
              <IcoPlus /> Nueva oportunidad
            </button>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard label="Oportunidades activas" value={activas.length}      sub="vs mes anterior" trend="+2" color="#24388C" Icon={IcoBriefcase} />
          <StatCard label="Pipeline activo"       value={formatCOP(valorPipeline)} sub="COP estimados"  color="#F39610" Icon={IcoCurrency}  />
          <StatCard label="Actividades semana"    value={actividades.length}   sub="esta semana"  trend="+4" color="#1A8754" Icon={IcoClipboard} />
          <StatCard label="Oportunidades ganadas" value={ganadas.length}       sub="Este trimestre"    color="#22C55E" Icon={IcoTrophy}    />
        </div>

        {/* ── Grid principal ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.2fr 1fr' }}>

          {/* Columna izquierda */}
          <div className="flex flex-col gap-4">

            {/* Oportunidades por estado */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Oportunidades por estado</div>
                  <div className="text-[11.5px] text-[#9A9A9A] mt-0.5">Distribución de tu pipeline activo</div>
                </div>
                <button onClick={() => navigate('/oportunidades')}
                  className="text-[12px] font-semibold text-[#24388C] hover:underline flex items-center gap-1">
                  Ver todas <IcoChevron />
                </button>
              </div>
              <div className="px-5 py-1">
                {ESTADOS_ACTIVOS.map((estado, i) => {
                  const s   = BADGE_STYLE[estado]
                  const cnt = porEstado[estado]
                  const pct = activas.length ? (cnt / activas.length) * 100 : 0
                  return (
                    <div key={estado}
                      className={`flex items-center gap-4 py-3 ${i < ESTADOS_ACTIVOS.length - 1 ? 'border-b border-[#F4F4F4]' : ''}`}>
                      <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 min-w-[110px]"
                        style={{ background: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                      <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(pct * 3, 100)}%`, background: s.dot }} />
                      </div>
                      <span className="text-[13px] font-bold text-[#1A1A1A] w-5 text-right">{cnt}</span>
                    </div>
                  )
                })}
                {activas.length === 0 && (
                  <p className="text-[13px] text-[#ABABAB] text-center py-6">Sin oportunidades activas</p>
                )}
              </div>
            </div>

            {/* Leads más activos */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A1A]">Leads más activos</div>
                  <div className="text-[11.5px] text-[#9A9A9A] mt-0.5">Prospectos con mayor probabilidad de conversión</div>
                </div>
                <span className="text-[11px] font-bold text-[#F39610] bg-[#FFF4E0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  ✦ Top 3
                </span>
              </div>
              <div className="px-5 py-1">
                {leadsCalientes.map((lead, i) => {
                  const score    = lead.probabilidad ?? lead.score ?? 0
                  const initials = (lead.empresa ?? lead.nombre ?? '??').substring(0, 2).toUpperCase()
                  return (
                    <div key={lead.id}
                      className={`flex items-center gap-3 py-3 ${i < leadsCalientes.length - 1 ? 'border-b border-[#F4F4F4]' : ''}`}>
                      <div className="w-8 h-8 rounded-lg bg-[#FFF4E0] text-[#F39610] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{lead.nombre}</div>
                        <div className="text-[11.5px] text-[#9A9A9A] truncate">{lead.descripcion ?? '—'}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 text-[#F39610]">
                        <IcoFire />
                        <span className="text-[13px] font-bold">{score}%</span>
                      </div>
                    </div>
                  )
                })}
                {leadsCalientes.length === 0 && (
                  <p className="text-[13px] text-[#ABABAB] text-center py-6">Sin leads activos</p>
                )}
              </div>
            </div>

          </div>

          {/* Columna derecha — actividades */}
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <div>
                <div className="text-[14px] font-bold text-[#1A1A1A]">Mis últimas actividades</div>
                <div className="text-[11.5px] text-[#9A9A9A] mt-0.5">Registro cronológico</div>
              </div>
              <button onClick={() => navigate('/actividades')}
                className="text-[12px] font-semibold text-[#24388C] hover:underline">
                Ver historial
              </button>
            </div>

            <div className="flex-1 divide-y divide-[#F4F4F4]">
              {ultimasActividades.length === 0 && (
                <p className="text-[13px] text-[#ABABAB] text-center py-8">Sin actividades esta semana</p>
              )}
              {ultimasActividades.map(a => {
                const completada = !!a.resultado
                return (
                  <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${completada ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <span className="text-[12.5px] font-semibold text-[#1A1A1A] flex-1 min-w-0 line-clamp-1">
                          {a.tipo} — {a.descripcion}
                        </span>
                        <span className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${completada ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'}`}>
                          {completada ? 'completada' : 'pendiente'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#ABABAB] flex items-center gap-1 mt-0.5">
                        <IcoClock />
                        {formatFecha(a.fecha_actividad)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-5 py-3 border-t border-[#F0F0F0]">
              <button onClick={() => navigate('/actividades/nueva')}
                className="w-full text-[13px] font-semibold text-[#4A4A4A] border border-[#E5E5E5] bg-white px-3 py-2 rounded-lg hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-1.5">
                <IcoPlus /> Registrar actividad
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
