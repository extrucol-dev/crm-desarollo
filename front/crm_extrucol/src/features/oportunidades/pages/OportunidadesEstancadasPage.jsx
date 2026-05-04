import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner } from '../../../shared/components/FormField'
import { coordinadorAPI } from '../../coordinador/services/coordinadorAPI'

const formatCOP = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000_000) return `$ ${(n / 1_000_000_000).toFixed(1)} B`
  return `$ ${(n / 1_000_000).toFixed(0)} M`
}

const AVATAR_COLORS = ['#24388C', '#F39610', '#1A8754', '#6366F1', '#C0392B', '#0891B2']

const LEAD_ESTADO = {
  nuevo:         { label: 'Nuevo',       bg: '#EEF1FA', color: '#24388C' },
  contactado:    { label: 'Contactado',  bg: '#FFF8E5', color: '#B87E15' },
  calificado:    { label: 'Calificado',  bg: '#E8F5EE', color: '#1A8754' },
  sin_interes:   { label: 'Sin interés', bg: '#FDECEA', color: '#C0392B' },
}

const OPP_ESTADO = {
  prospecto:    { label: 'Prospecto',    bg: '#EEF1FA', color: '#24388C' },
  calificacion: { label: 'Calificación', bg: '#FFF8E5', color: '#B87E15' },
  propuesta:    { label: 'Propuesta',    bg: '#EEF1FA', color: '#6366F1' },
  negociacion:  { label: 'Negociación',  bg: '#E8F5EE', color: '#1A8754' },
}

const ESTANCADOS_DEFAULT = [
  { id: 1, tipo: 'LEAD', titulo: 'HyM Contratistas Sas', empresa: 'HyM Contratistas', ref: 'L-0041', ejecutivo: 'Paola', ejecutivo_idx: 1, estado: 'contactado', dias: 6, umbral: 5, valor: null },
  { id: 2, tipo: 'LEAD', titulo: 'Hidromecánica S.A.S', empresa: 'Hidromecánica',     ref: 'L-0038', ejecutivo: 'Alvaro', ejecutivo_idx: 2, estado: 'nuevo',      dias: 4, umbral: 5, valor: null },
  { id: 3, tipo: 'LEAD', titulo: 'GMOS Ingenieros SAS', empresa: 'GMOS Ingenieros',   ref: 'L-0035', ejecutivo: 'Diana',  ejecutivo_idx: 0, estado: 'contactado', dias: 5, umbral: 5, valor: null },
  { id: 4, tipo: 'OPP',  titulo: 'UT Balsa 3 - Fase II',      empresa: 'UT Balsa 3',      ref: 'C-1391', ejecutivo: 'Alvaro', ejecutivo_idx: 2, estado: 'propuesta',    dias: 14, umbral: 10, valor: 111_000_000 },
  { id: 5, tipo: 'OPP',  titulo: 'Acueducto Turbaco',         empresa: 'CIVILE Hidráulicos', ref: 'C-1393', ejecutivo: 'Paola',  ejecutivo_idx: 1, estado: 'negociacion',  dias: 9,  umbral: 10, valor: 92_000_000  },
  { id: 6, tipo: 'OPP',  titulo: 'ADOS Ingeniería - Proceso', empresa: 'ADOS Ingeniería',   ref: 'C-1385', ejecutivo: 'Diana',  ejecutivo_idx: 0, estado: 'propuesta',    dias: 11, umbral: 10, valor: 44_000_000  },
]

function EstadoBadge({ tipo, estado }) {
  const map = tipo === 'LEAD' ? LEAD_ESTADO : OPP_ESTADO
  const cfg = map[estado] ?? { label: estado, bg: '#F0F0F0', color: '#6B6B6B' }
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function DiasBadge({ dias, umbral }) {
  const danger = dias >= umbral
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[13px] font-extrabold px-2.5 py-0.5 rounded-full"
        style={{ background: danger ? '#FDECEA' : '#FFF8E5', color: danger ? '#C0392B' : '#B87E15' }}>
        {dias}d
      </span>
      <span className="text-[10px] text-[#ABABAB]">umbral {umbral}d</span>
    </div>
  )
}

export default function OportunidadesEstancadasPage() {
  const navigate = useNavigate()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEjecutivo, setFiltroEjecutivo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [orden, setOrden] = useState('dias_desc')

  useEffect(() => {
    coordinadorAPI.estancadas()
      .then(d => setItems(Array.isArray(d) && d.length ? d : ESTANCADOS_DEFAULT))
      .catch(() => setItems(ESTANCADOS_DEFAULT))
      .finally(() => setLoading(false))
  }, [])

  const ejecutivos = useMemo(() => [...new Set(items.map(i => i.ejecutivo).filter(Boolean))], [items])

  const filtrados = useMemo(() => {
    let lista = items
    if (tab !== 'todos') lista = lista.filter(i => i.tipo === (tab === 'leads' ? 'LEAD' : 'OPP'))
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(i =>
        i.titulo?.toLowerCase().includes(q) ||
        i.empresa?.toLowerCase().includes(q) ||
        i.ref?.toLowerCase().includes(q)
      )
    }
    if (filtroEjecutivo) lista = lista.filter(i => i.ejecutivo === filtroEjecutivo)
    if (filtroEstado) lista = lista.filter(i => i.estado === filtroEstado)
    return lista.sort((a, b) =>
      orden === 'dias_desc' ? b.dias - a.dias :
      orden === 'dias_asc'  ? a.dias - b.dias :
      (b.valor ?? 0) - (a.valor ?? 0)
    )
  }, [items, tab, busqueda, filtroEjecutivo, filtroEstado, orden])

  const criticos    = items.filter(i => i.dias >= i.umbral).length
  const advertencias = items.filter(i => i.dias > 0 && i.dias < i.umbral).length
  const leadsCount  = items.filter(i => i.tipo === 'LEAD').length
  const valorRiesgo = items.filter(i => i.tipo === 'OPP').reduce((s, i) => s + (i.valor ?? 0), 0)

  const TABS = [
    { id: 'todos',        label: 'Todos',         count: items.length },
    { id: 'leads',        label: 'Leads',          count: items.filter(i => i.tipo === 'LEAD').length },
    { id: 'oportunidades', label: 'Oportunidades', count: items.filter(i => i.tipo === 'OPP').length },
  ]

  return (
    <AppLayout>
      <Topbar title="Oportunidades estancadas" />
      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando registros..." />}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Críticos',         value: criticos,                     color: '#C0392B', sub: 'Superaron umbral' },
                { label: 'Advertencias',      value: advertencias,                  color: '#F39610', sub: 'Cerca del umbral' },
                { label: 'Leads estancados',  value: leadsCount,                   color: '#24388C', sub: 'Sin contactar' },
                { label: 'Valor en riesgo',   value: formatCOP(valorRiesgo),        color: '#6366F1', sub: 'En oportunidades' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-2">{s.label}</div>
                  <div className="text-[22px] font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[12px] text-[#6B6B6B] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#F7F7F7] p-1 rounded-lg mb-4 w-fit">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition"
                  style={tab === t.id
                    ? { background: '#fff', color: '#1A1A1A', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                    : { color: '#6B6B6B' }}>
                  {t.label}
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: tab === t.id ? '#EEF1FA' : '#E5E5E5', color: tab === t.id ? '#24388C' : '#6B6B6B' }}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar registro, empresa..."
                  className="pl-9 pr-4 py-2 w-full border border-[#E5E5E5] rounded-lg text-[12.5px] bg-white focus:outline-none focus:border-[#24388C] transition" />
              </div>
              <select value={filtroEjecutivo} onChange={e => setFiltroEjecutivo(e.target.value)}
                className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition">
                <option value="">Todos los ejecutivos</option>
                {ejecutivos.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition">
                <option value="">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="contactado">Contactado</option>
                <option value="calificado">Calificado</option>
                <option value="propuesta">Propuesta</option>
                <option value="negociacion">Negociación</option>
              </select>
              <select value={orden} onChange={e => setOrden(e.target.value)}
                className="border border-[#E5E5E5] rounded-lg text-[12.5px] text-[#4A4A4A] bg-white px-3 py-2 focus:outline-none focus:border-[#24388C] transition">
                <option value="dias_desc">Más días primero</option>
                <option value="dias_asc">Menos días primero</option>
                <option value="valor_desc">Mayor valor primero</option>
              </select>
            </div>

            {/* Table */}
            {filtrados.length === 0 ? (
              <div className="text-center py-16 text-[13px] text-[#ABABAB]">No hay registros estancados</div>
            ) : (
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="hidden sm:grid px-4 py-2.5 bg-[#F7F7F7] border-b border-[#F0F0F0] text-[10.5px] font-semibold text-[#ABABAB] uppercase tracking-wider"
                  style={{ gridTemplateColumns: '110px 1fr 130px 110px 90px 100px' }}>
                  <span>Tipo</span>
                  <span>Registro</span>
                  <span>Ejecutivo</span>
                  <span>Estado</span>
                  <span className="text-center">Sin actividad</span>
                  <span className="text-right">Acciones</span>
                </div>

                {filtrados.map((item, idx) => {
                  const avatarColor = AVATAR_COLORS[(item.ejecutivo_idx ?? idx) % 6]
                  const iniciales = (item.ejecutivo ?? '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  const isLead = item.tipo === 'LEAD'
                  const path = isLead ? `/leads/${item.id}` : `/oportunidades/${item.id}`

                  return (
                    <div key={item.id ?? idx}
                      className="grid items-center gap-3 px-4 py-3.5 border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA] transition"
                      style={{ gridTemplateColumns: '110px 1fr 130px 110px 90px 100px' }}>

                      {/* Tipo */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded w-fit"
                          style={isLead
                            ? { background: '#EEF1FA', color: '#24388C' }
                            : { background: '#FFF8E5', color: '#B87E15' }}>
                          {item.tipo}
                        </span>
                        {item.valor && (
                          <span className="text-[11px] font-semibold text-[#1A1A1A]">{formatCOP(item.valor)}</span>
                        )}
                      </div>

                      {/* Registro */}
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-[#1A1A1A] truncate">{item.titulo}</div>
                        <div className="text-[11.5px] text-[#6B6B6B]">{item.empresa} · {item.ref}</div>
                      </div>

                      {/* Ejecutivo */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                          style={{ background: avatarColor }}>
                          {iniciales}
                        </div>
                        <span className="text-[12.5px] font-medium text-[#1A1A1A] truncate">{item.ejecutivo}</span>
                      </div>

                      {/* Estado */}
                      <div>
                        <EstadoBadge tipo={item.tipo} estado={item.estado} />
                      </div>

                      {/* Días */}
                      <div className="flex justify-center">
                        <DiasBadge dias={item.dias} umbral={item.umbral} />
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(path)}
                          className="text-[11.5px] font-semibold text-[#24388C] hover:underline whitespace-nowrap">
                          Ver detalle
                        </button>
                      </div>
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
