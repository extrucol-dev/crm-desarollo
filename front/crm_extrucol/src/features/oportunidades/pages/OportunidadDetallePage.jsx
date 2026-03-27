import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import CierreModal from '../components/CierreModal'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { useOportunidadDetalle } from '../hooks/useOportunidadDetalle'

// ── Helpers ──────────────────────────────────────────────────
const formatCOP = (n) => {
  if (!n) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(n)
}
const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}
const formatDateShort = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

// ── Pipeline steps ────────────────────────────────────────────
const PIPELINE = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION', 'GANADA']
const PIPELINE_LABEL = {
  PROSPECTO:    'Prospecto',
  CALIFICACION: 'Calificación',
  PROPUESTA:    'Propuesta',
  NEGOCIACION:  'Negociación',
  GANADA:       'Ganada',
}

const ESTADO_VARIANT = {
  PROSPECTO:    'blue',
  CALIFICACION: 'orange',
  PROPUESTA:    'purple',
  NEGOCIACION:  'purple',
  GANADA:       'green',
  PERDIDA:      'red',
}

const TIPO_LABEL = {
  COTIZACION:     'Cotización',
  VENTA:          'Venta de producto',
  ACOMPANAMIENTO: 'Acompañamiento técnico',
  PROYECTO:       'Proyecto',
}

const ESTADO_SIGUIENTE_LABEL = {
  PROSPECTO:    'Calificación',
  CALIFICACION: 'Propuesta',
  PROPUESTA:    'Negociación',
  NEGOCIACION:  'Ganada',
}

// ── Sub-componentes ───────────────────────────────────────────
function PipelineBar({ estado }) {
  const currentIdx = PIPELINE.indexOf(estado)
  const perdida = estado === 'PERDIDA'

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm px-6 py-5 mb-5">
      <div className="flex items-center">
        {PIPELINE.map((e, i) => {
          const done    = !perdida && currentIdx > i
          const current = !perdida && currentIdx === i
          return (
            <div key={e} className="flex items-center flex-1 min-w-0">
              {/* Círculo */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all ${
                  done    ? 'bg-[#24388C] border-[#24388C] text-white' :
                  current ? 'bg-[#24388C] border-[#24388C] text-white ring-4 ring-[#24388C]/20' :
                            'bg-white border-[#D5D5D5] text-[#ABABAB]'
                }`}>
                  {done ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${
                  current ? 'text-[#24388C]' : done ? 'text-[#24388C]' : 'text-[#ABABAB]'
                }`}>
                  {PIPELINE_LABEL[e]}
                </span>
              </div>
              {/* Línea conectora */}
              {i < PIPELINE.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${
                  done ? 'bg-[#24388C]' : 'bg-[#E5E5E5]'
                }`} />
              )}
            </div>
          )
        })}
      </div>
      {perdida && (
        <div className="mt-3 text-center">
          <Badge variant="red">Oportunidad perdida</Badge>
        </div>
      )}
    </div>
  )
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden mb-4">
      {title && (
        <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-2.5">
          {icon && <span className="text-[#24388C]">{icon}</span>}
          <span className="text-[14px] font-bold text-[#1A1A1A]">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

function DetailField({ label, value, large }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[#1A1A1A] font-medium ${large ? 'text-[22px] font-bold' : 'text-[13.5px]'}`}>
        {value || '—'}
      </div>
    </div>
  )
}

// ── Actividad item ────────────────────────────────────────────
function ActividadItem({ actividad }) {
  const completada = !!actividad.resultado
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-[#F0F0F0] last:border-b-0">
      {/* Dot de color */}
      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${completada ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{actividad.tipo}</div>
            <div className="text-[12.5px] text-[#6B6B6B] mt-0.5">{actividad.descripcion}</div>
            {actividad.resultado && (
              <div className="text-[12px] text-[#6B6B6B] italic mt-1">{actividad.resultado}</div>
            )}
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
            completada
              ? 'bg-[#E8F5EE] text-[#1A8754]'
              : 'bg-[#EEF1FA] text-[#24388C]'
          }`}>
            {completada ? 'Completada' : 'Pendiente'}
          </span>
        </div>
        {/* Meta */}
        <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-[#ABABAB]">
          {actividad.usuario?.nombre && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
              {actividad.usuario.nombre}
            </span>
          )}
          {actividad.fecha_actividad && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
              </svg>
              {formatDateShort(actividad.fecha_actividad)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export default function OportunidadDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showCierreModal, setShowCierreModal] = useState(false)

  const {
    oportunidad, loading, error,
    esCerrada, siguienteEstado,
    avanzando, cerrando, actionError,
    avanzar, cerrar,
  } = useOportunidadDetalle(id)

  const handleCerrar = async (data) => {
    const ok = await cerrar(data)
    if (ok) setShowCierreModal(false)
  }

  const op = oportunidad

  return (
    <AppLayout>
      {/* Topbar */}
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/oportunidades')}>
            Oportunidades
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[160px] sm:max-w-[240px]">{op?.nombre ?? '...'}</span>
        </>
      }>
        {op && !esCerrada && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/oportunidades/${id}/editar`)}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all whitespace-nowrap"
            >
              Editar
            </button>
            {siguienteEstado && (
              <button
                onClick={avanzar}
                disabled={avanzando}
                className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-[#24388C] border border-[#24388C] hover:bg-[#EEF1FA] transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {avanzando ? '...' : `Avanzar a ${ESTADO_SIGUIENTE_LABEL[op.estado]}`}
              </button>
            )}
            <button
              onClick={() => setShowCierreModal(true)}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-white bg-[#1A1A1A] hover:bg-[#333] transition-all whitespace-nowrap"
            >
              Cerrar
            </button>
            <button
              onClick={() => navigate('/actividades/nueva', { state: { oportunidadId: id } })}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-white bg-[#F39610] hover:bg-[#C7770D] transition-all whitespace-nowrap"
            >
              + Actividad
            </button>
          </div>
        )}
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando oportunidad..." />}

        {(error || actionError) && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-4">
            {error || actionError}
          </div>
        )}

        {!loading && op && (
          <>
            {/* Header — nombre + badge estado */}
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#1A1A1A] tracking-tight leading-snug">
                  {op.nombre}
                </h1>
                <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>
                  {op.estado}
                </Badge>
              </div>
              {op.cliente && (
                <div className="text-[13px] text-[#6B6B6B] mt-1">
                  {op.cliente.empresa} — {TIPO_LABEL[op.tipo] ?? op.tipo}
                </div>
              )}
            </div>

            {/* Pipeline bar */}
            <PipelineBar estado={op.estado} />

            {/* Grid principal: izquierda (2/3) + derecha (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* ── Columna izquierda ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">

                {/* Detalles de la oportunidad */}
                <SectionCard
                  title="Detalles de la oportunidad"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  }
                >
                  <div className="px-5 py-5">
                    {/* Fila 1: Valor + Tipo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Valor estimado</div>
                        <div className="text-[22px] font-extrabold text-[#24388C] tracking-tight">
                          {formatCOP(op.valor_estimado)}
                        </div>
                      </div>
                      <DetailField label="Tipo" value={TIPO_LABEL[op.tipo] ?? op.tipo} />
                    </div>
                    {/* Fila 2: Fecha cierre + Motivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Fecha de cierre</div>
                        <div className="flex items-center gap-1.5 text-[13.5px] text-[#1A1A1A] font-medium">
                          <svg className="w-3.5 h-3.5 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                          </svg>
                          {formatDate(op.fecha_cierre)}
                        </div>
                      </div>
                      {op.motivo_cierre && (
                        <DetailField label="Motivo de cierre" value={op.motivo_cierre} />
                      )}
                      {op.descripcion && (
                        <div className="sm:col-span-2">
                          <DetailField label="Descripción" value={op.descripcion} />
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* Actividades */}
                <SectionCard
                  title={`Actividades`}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  }
                >
                  <div className="px-5 py-2">
                    {/* Placeholder hasta GET /api/oportunidades/{id}/actividades */}
                    <div className="text-center py-10">
                      <div className="w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-3">
                        <svg className="w-4.5 h-4.5 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-[13px] font-semibold text-[#4A4A4A] mb-1">Sin actividades registradas</p>
                      <p className="text-[12px] text-[#ABABAB]">
                        Usa el botón "+ Actividad" para registrar la primera actividad
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* ── Columna derecha ── */}
              <div className="flex flex-col gap-4">

                {/* Cliente */}
                {op.cliente && (
                  <SectionCard
                    title="Cliente"
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    }
                  >
                    <div className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/clientes/${op.cliente.id}`)}
                        className="text-[14px] font-bold text-[#24388C] hover:underline mb-3 block"
                      >
                        {op.cliente.empresa || op.cliente.nombre}
                      </button>
                      <div className="flex flex-col gap-2 text-[12.5px] text-[#4A4A4A]">
                        {op.cliente.nombre && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                            </svg>
                            <span>{op.cliente.nombre}</span>
                          </div>
                        )}
                        {op.cliente.email && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            <span className="truncate">{op.cliente.email}</span>
                          </div>
                        )}
                        {op.cliente.telefono && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            <span>+57 {op.cliente.telefono}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </SectionCard>
                )}

                {/* Ejecutivo asignado */}
                {op.usuario && (
                  <SectionCard title="Ejecutivo Asignado">
                    <div className="px-5 py-4 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                        style={{ background: avatarColor(op.usuario.nombre) }}
                      >
                        {initials(op.usuario.nombre)}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-bold text-[#1A1A1A]">{op.usuario.nombre}</div>
                        <div className="text-[12px] text-[#6B6B6B]">
                          {op.usuario.rol === 'EJECUTIVO' ? 'Ejecutivo Comercial' :
                           op.usuario.rol === 'DIRECTOR'  ? 'Director Comercial' : op.usuario.rol}
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de cierre */}
      {showCierreModal && (
        <CierreModal
          loading={cerrando}
          onConfirm={handleCerrar}
          onCancel={() => setShowCierreModal(false)}
        />
      )}
    </AppLayout>
  )
}