import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { equipoAPI } from '../services/equipoAPI'

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const formatCOP = (n) => (!n && n !== 0) ? '—' : `$ ${(n / 1_000_000).toFixed(0)} M`

const LEAD_BADGE = {
  NUEVO:      { bg: '#EEF1FA', color: '#24388C' },
  CONTACTADO: { bg: '#F0EEF9', color: '#6366F1' },
  CALIFICADO: { bg: '#FFF4E0', color: '#F39610' },
  DESCARTADO: { bg: '#FDECEA', color: '#C0392B' },
  CONVERTIDO: { bg: '#E8F5EE', color: '#1A8754' },
}
const OPP_BADGE = {
  PROSPECTO:   { bg: '#EEF1FA', color: '#24388C' },
  CALIFICACION: { bg: '#FFF4E0', color: '#F39610' },
  PROPUESTA:   { bg: '#F0EEF9', color: '#6366F1' },
  NEGOCIACION: { bg: '#F0EEF9', color: '#6366F1' },
  GANADA:      { bg: '#E8F5EE', color: '#1A8754' },
  PERDIDA:     { bg: '#FDECEA', color: '#C0392B' },
}

const PERFIL_DEFAULT = {
  id: 1, nombre: 'Diana', departamento: 'Medellín', email: 'diana@extrucol.co',
  telefono: '+57 310 555 1234', fecha_ingreso: '15 Ene 2024',
  ventas: 698_000_000, meta: 600_000_000, meta_pct: 116, cumplimiento: 95, tendencia_pct: 20,
  leads: [
    { id: 1, titulo: 'Consulta tubería INGEOMEGA',   empresa: 'INGEOMEGA',         origen: 'WhatsApp', score: 100, estado: 'CALIFICADO' },
    { id: 2, titulo: 'Proyecto RB de Colombia',      empresa: 'RB DE COLOMBIA SA', origen: 'Instagram', score: 80, estado: 'CONTACTADO' },
    { id: 3, titulo: 'Cotización CMM Manizales',      empresa: 'CMM',               origen: 'Facebook',  score: 80, estado: 'CALIFICADO' },
    { id: 4, titulo: 'Seguimiento MONTAJES JM',       empresa: 'MONTAJES JM',       origen: 'WhatsApp',  score: 60, estado: 'NUEVO' },
  ],
  oportunidades: [
    { id: 1, titulo: 'Sistema acueducto INGEOMEGA',  empresa: 'INGEOMEGA',                  valor: 397_000_000, estado: 'NEGOCIACION', fecha_cierre: '20 Mar', probabilidad: 80 },
    { id: 2, titulo: 'Obra civil MONTAJES JM',        empresa: 'MONTAJES JM',                valor: 15_000_000,  estado: 'NEGOCIACION', fecha_cierre: '18 Mar', probabilidad: 80 },
    { id: 3, titulo: 'Construcción ADOS INGENIERIA',  empresa: 'ADOS INGENIERIA',            valor: 98_000_000,  estado: 'NEGOCIACION', fecha_cierre: '15 Mar', probabilidad: 80 },
    { id: 4, titulo: 'Consorcio ING Santa Elena',     empresa: 'CONSORCIO ING SANTA ELENA', valor: 152_000_000, estado: 'PROPUESTA',   fecha_cierre: '10 Mar', probabilidad: 60 },
  ],
  actividades: [
    { id: 1, tipo: 'Visita',   titulo: 'Visita técnica - INGEOMEGA',  descripcion: 'Revisión especificaciones técnicas', fecha: 'Hoy 10:30 AM',  completada: true },
    { id: 2, tipo: 'Llamada',  titulo: 'Llamada seguimiento - ADOS',  descripcion: 'Negociación de términos',            fecha: 'Hoy 9:00 AM',   completada: true },
    { id: 3, tipo: 'Reunión',  titulo: 'Reunión virtual - CMM',       descripcion: 'Presentación portafolio productos', fecha: 'Hoy 3:00 PM',   completada: false },
    { id: 4, tipo: 'Email',    titulo: 'Email - CONSORCIO ING',       descripcion: 'Envío de propuesta técnica',        fecha: 'Ayer 8:15 AM',  completada: true },
  ],
}

function BadgeEstado({ estado, map }) {
  const s = map[estado] ?? { bg: '#F0F0F0', color: '#4A4A4A' }
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: s.bg, color: s.color }}>
      {estado}
    </span>
  )
}

function ResumenTab({ perfil }) {
  const metaColor = (perfil.meta_pct ?? 0) >= 100 ? '#1A8754' : (perfil.meta_pct ?? 0) >= 80 ? '#F39610' : '#C0392B'
  const leads = perfil.leads ?? []
  const opps  = perfil.oportunidades ?? []
  const acts  = perfil.actividades ?? []

  const leadsResumen = Object.entries(leads.reduce((acc, l) => {
    acc[l.estado] = (acc[l.estado] ?? 0) + 1; return acc
  }, {}))
  const oppsResumen = Object.entries(opps.reduce((acc, o) => {
    acc[o.estado] = (acc[o.estado] ?? 0) + 1; return acc
  }, {}))

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Ventas mes', value: formatCOP(perfil.ventas), color: '#F39610', sub: `${perfil.tendencia_pct >= 0 ? '+' : ''}${perfil.tendencia_pct ?? 0}% vs anterior` },
          { label: 'Meta mensual', value: formatCOP(perfil.meta), color: '#1A1A1A', sub: `${perfil.meta_pct ?? 0}% alcanzado` },
          { label: 'Leads activos', value: leads.length, color: '#1A1A1A', sub: 'En seguimiento' },
          { label: 'Cumplimiento', value: `${perfil.cumplimiento ?? 0}%`, color: metaColor, sub: 'Actividades' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
            <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-[22px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { title: 'Leads por estado', rows: leadsResumen.map(([e, n]) => ({ label: e, value: n, color: LEAD_BADGE[e]?.color ?? '#4A4A4A' })) },
          { title: 'Oportunidades por estado', rows: oppsResumen.map(([e, n]) => ({ label: e, value: n, color: OPP_BADGE[e]?.color ?? '#4A4A4A' })) },
          { title: 'Actividades recientes', rows: [
            { label: 'Completadas hoy', value: acts.filter(a => a.fecha?.startsWith('Hoy') && a.completada).length, color: '#1A8754' },
            { label: 'Agendadas', value: acts.filter(a => !a.completada).length, color: '#24388C' },
            { label: 'Esta semana', value: acts.length, color: '#1A1A1A' },
          ]},
        ].map(panel => (
          <div key={panel.title} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0F0F0]">
              <div className="text-[13px] font-bold text-[#1A1A1A]">{panel.title}</div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {panel.rows.map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-[13px] text-[#4A4A4A]">{r.label}</span>
                  </div>
                  <span className="text-[14px] font-bold text-[#1A1A1A]">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function LeadsTab({ perfil }) {
  const navigate = useNavigate()
  const leads = perfil.leads ?? []
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0F0] flex justify-between">
        <div className="text-[14px] font-bold text-[#1A1A1A]">Leads de {perfil.nombre}</div>
        <span className="text-[13px] text-[#6B6B6B]">{leads.length} leads</span>
      </div>
      {leads.map(l => (
        <div key={l.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F0F0F0] last:border-0 hover:bg-[#F7F7F7] transition cursor-pointer"
          onClick={() => navigate(`/leads/${l.id}`)}>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-[#1A1A1A] truncate">{l.titulo}</div>
            <div className="text-[12px] text-[#6B6B6B]">{l.empresa} · {l.origen}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[12px] font-bold" style={{ color: '#F39610' }}>{l.score}%</span>
            <BadgeEstado estado={l.estado} map={LEAD_BADGE} />
          </div>
        </div>
      ))}
    </div>
  )
}

function OportunidadesTab({ perfil }) {
  const navigate = useNavigate()
  const opps = perfil.oportunidades ?? []
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0F0] flex justify-between">
        <div className="text-[14px] font-bold text-[#1A1A1A]">Oportunidades de {perfil.nombre}</div>
        <span className="text-[13px] text-[#6B6B6B]">{opps.length} oportunidades</span>
      </div>
      {opps.map(o => (
        <div key={o.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F0F0F0] last:border-0 hover:bg-[#F7F7F7] transition cursor-pointer"
          onClick={() => navigate(`/oportunidades/${o.id}`)}>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-[#1A1A1A] truncate">{o.titulo}</div>
            <div className="text-[12px] text-[#6B6B6B]">{o.empresa} · {o.fecha_cierre}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[13px] font-bold" style={{ color: '#F39610' }}>{formatCOP(o.valor)}</div>
              <div className="text-[11px] text-[#ABABAB]">{o.probabilidad}% prob</div>
            </div>
            <BadgeEstado estado={o.estado} map={OPP_BADGE} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ActividadesTab({ perfil }) {
  const acts = perfil.actividades ?? []
  const TIPO_COLORS = { Visita: '#FFF4E0', Llamada: '#E8F5EE', Email: '#F3E8FF', Reunión: '#EEF1FA' }
  const TIPO_TEXT   = { Visita: '#C7770D', Llamada: '#1A8754', Email: '#7C3AED', Reunión: '#24388C' }
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0F0] flex justify-between">
        <div className="text-[14px] font-bold text-[#1A1A1A]">Actividades de {perfil.nombre}</div>
        <span className="text-[13px] text-[#6B6B6B]">{acts.length} actividades</span>
      </div>
      {acts.map(a => (
        <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F0F0F0] last:border-0 hover:bg-[#F7F7F7] transition">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
            style={{ background: TIPO_COLORS[a.tipo] ?? '#F0F0F0', color: TIPO_TEXT[a.tipo] ?? '#4A4A4A' }}>
            {a.tipo?.slice(0, 3).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold text-[#1A1A1A] truncate">{a.titulo}</div>
            <div className="text-[12px] text-[#6B6B6B]">{a.descripcion}</div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: a.completada ? '#E8F5EE' : '#EEF1FA', color: a.completada ? '#1A8754' : '#24388C' }}>
              {a.completada ? 'Completada' : 'Agendada'}
            </span>
            <span className="text-[11.5px] text-[#ABABAB]">{a.fecha}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const TABS = ['resumen', 'leads', 'oportunidades', 'actividades']
const TAB_LABELS = { resumen: 'Resumen', leads: 'Leads', oportunidades: 'Oportunidades', actividades: 'Actividades' }

export default function EjecutivoPerfilPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [perfil,   setPerfil]  = useState(null)
  const [loading,  setLoading] = useState(true)
  const [tabActiva, setTab]    = useState('resumen')

  useEffect(() => {
    equipoAPI.buscarEjecutivo(id)
      .then(p => setPerfil(p ?? PERFIL_DEFAULT))
      .catch(() => setPerfil(PERFIL_DEFAULT))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <AppLayout>
      <Topbar title="Perfil ejecutivo" />
      <div className="p-6"><LoadingSpinner label="Cargando perfil..." /></div>
    </AppLayout>
  )

  if (!perfil) return null

  const nombre    = perfil.nombre ?? '?'
  const initials  = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const metaColor = (perfil.meta_pct ?? 0) >= 100 ? '#1A8754' : (perfil.meta_pct ?? 0) >= 80 ? '#F39610' : '#C0392B'

  const breadcrumb = (
    <>
      <span className="text-[#24388C] cursor-pointer hover:underline" onClick={() => navigate(-1)}>
        Equipo comercial
      </span>
      <span className="text-[#D5D5D5]">›</span>
      <span>{nombre}</span>
    </>
  )

  const tabCount = (tab) => {
    if (tab === 'leads') return (perfil.leads ?? []).length
    if (tab === 'oportunidades') return (perfil.oportunidades ?? []).length
    if (tab === 'actividades') return (perfil.actividades ?? []).length
    return null
  }

  return (
    <AppLayout>
      <Topbar breadcrumb={breadcrumb} />
      <div className="p-4 sm:p-6">
        {/* Profile header */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-6 mb-5">
          <div className="flex items-start gap-5 mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0"
              style={{ background: AVATAR_COLORS[0] }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">{nombre}</h1>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: metaColor }}>
                  {perfil.meta_pct ?? 0}% meta
                </span>
              </div>
              <div className="text-[13px] text-[#6B6B6B] mb-2">{perfil.departamento ?? '—'}</div>
              <div className="flex flex-wrap gap-4 text-[12px] text-[#6B6B6B]">
                {perfil.email && <span>{perfil.email}</span>}
                {perfil.telefono && <span>{perfil.telefono}</span>}
                {perfil.fecha_ingreso && <span>Desde {perfil.fecha_ingreso}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 pt-4 border-t border-[#F0F0F0]">
            {[
              { label: 'Ventas mes',      value: formatCOP(perfil.ventas),      color: '#F39610' },
              { label: 'Meta',            value: formatCOP(perfil.meta),        color: '#1A1A1A' },
              { label: 'Oportunidades',   value: (perfil.oportunidades ?? []).length, color: '#1A1A1A' },
              { label: 'Leads',           value: (perfil.leads ?? []).length,   color: '#1A1A1A' },
              { label: 'Cumplimiento',    value: `${perfil.cumplimiento ?? 0}%`, color: metaColor },
            ].map(m => (
              <div key={m.label}>
                <div className="text-[10.5px] font-semibold text-[#ABABAB] uppercase tracking-wide mb-1">{m.label}</div>
                <div className="text-[14px] font-bold" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b border-[#F0F0F0]">
          {TABS.map(tab => {
            const count = tabCount(tab)
            return (
              <button key={tab}
                onClick={() => setTab(tab)}
                className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all -mb-px ${
                  tabActiva === tab
                    ? 'border-[#24388C] text-[#24388C]'
                    : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}>
                {TAB_LABELS[tab]}
                {count != null && (
                  <span className="ml-1.5 text-[11px] bg-[#F0F0F0] text-[#4A4A4A] px-1.5 py-0.5 rounded-full">{count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {tabActiva === 'resumen'       && <ResumenTab perfil={perfil} />}
        {tabActiva === 'leads'         && <LeadsTab perfil={perfil} />}
        {tabActiva === 'oportunidades' && <OportunidadesTab perfil={perfil} />}
        {tabActiva === 'actividades'   && <ActividadesTab perfil={perfil} />}
      </div>
    </AppLayout>
  )
}
