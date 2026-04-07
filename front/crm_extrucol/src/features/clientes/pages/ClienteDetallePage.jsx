import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { clientesAPI } from '../services/clientesAPI'

// ── Helpers ──────────────────────────────────────────────────
const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1', '#B45309']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}
const formatDateShort = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}
const formatCOP = (n) => {
  if (!n) return '$0'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

const ESTADO_VARIANT = {
  PROSPECTO:    'blue',
  CALIFICACION: 'orange',
  PROPUESTA:    'purple',
  NEGOCIACION:  'purple',
  GANADA:       'green',
  PERDIDA:      'red',
}

// ── Íconos SVG ────────────────────────────────────────────────
const IconUser = () => (
  <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)
const IconEmail = () => (
  <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)
const IconPhone = () => (
  <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
)
const IconLocation = () => (
  <svg className="w-4 h-4 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)
const IconBriefcase = () => (
  <svg className="w-4 h-4 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)
const IconClipboard = () => (
  <svg className="w-4 h-4 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
)
const IconCalendar = () => (
  <svg className="w-3.5 h-3.5 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
  </svg>
)

// ── Tarjeta de oportunidad (tab) ──────────────────────────────
function OportunidadCard({ op, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#F0F0F0] rounded-xl p-4 cursor-pointer
        hover:border-[#24388C] hover:shadow-sm transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="text-[13.5px] font-bold text-[#1A1A1A] group-hover:text-[#24388C] transition-colors leading-snug">
          {op.nombre}
        </div>
        <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>{op.estado}</Badge>
      </div>
      {op.descripcion && (
        <div className="text-[12.5px] text-[#6B6B6B] mb-3 line-clamp-1">{op.descripcion}</div>
      )}
      <div className="flex items-center gap-3 text-[11.5px] text-[#ABABAB]">
        {op.tipo && (
          <span className="px-2 py-0.5 rounded bg-[#F0F0F0] text-[#6B6B6B] font-medium">{op.tipo}</span>
        )}
        {op.fecha_cierre && (
          <span className="flex items-center gap-1">
            <IconCalendar />
            {formatDateShort(op.fecha_cierre)}
          </span>
        )}
        {op.valor_estimado && (
          <span className="ml-auto font-bold text-[#24388C]">
            {formatCOP(op.valor_estimado)}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export default function ClienteDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState('oportunidades')

  useEffect(() => {
    clientesAPI.buscar(id)
      .then(setCliente)
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setLoading(false))
  }, [id])

  // Métricas calculadas
  const totalOportunidades = cliente?.oportunidades?.length ?? 0
  const valorTotal = cliente?.oportunidades?.reduce((sum, op) => sum + (op.valor_estimado ?? 0), 0) ?? 0
  const valorActivo = cliente?.oportunidades
    ?.filter(op => !['GANADA', 'PERDIDA'].includes(op.estado))
    ?.reduce((sum, op) => sum + (op.valor_estimado ?? 0), 0) ?? 0

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/clientes')}>
            Mis Clientes
          </span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[160px] sm:max-w-[240px]">{cliente?.nombre ?? '...'}</span>
        </>
      }>
        {cliente && (
          <button
            onClick={() => navigate(`/clientes/${id}/editar`)}
            className="px-4 py-[7px] rounded-md text-[13px] font-semibold text-[#24388C] border border-[#24388C] hover:bg-[#EEF1FA] transition-all whitespace-nowrap"
          >
            Editar
          </button>
        )}
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando cliente..." />}

        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3">
            {error}
          </div>
        )}

        {!loading && cliente && (
          <>
            {/* Header — nombre + sector + fecha */}
            <div className="mb-5 flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0"
                style={{ background: avatarColor(cliente.nombre) }}
              >
                {initials(cliente.nombre)}
              </div>
              <div>
                <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#1A1A1A] tracking-tight">
                  {cliente.nombre}
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {cliente.sector && (
                    <Badge variant="gray">{cliente.sector}</Badge>
                  )}
                  {cliente.fecha_creacion && (
                    <span className="text-[12px] text-[#ABABAB]">
                      Cliente desde {formatDate(cliente.fecha_creacion)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid: izquierda (sidebar) + derecha (contenido) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* ── Columna izquierda ── */}
              <div className="flex flex-col gap-4">

                {/* Información de contacto */}
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Información de Contacto</h2>
                  <div className="flex flex-col gap-3">
                    {cliente.empresa && (
                      <div className="flex items-center gap-2.5 text-[13px] text-[#4A4A4A]">
                        <IconUser />
                        <span className="truncate">{cliente.empresa}</span>
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center gap-2.5">
                        <IconEmail />
                        <a href={`mailto:${cliente.email}`}
                          className="text-[13px] text-[#24388C] hover:underline truncate">
                          {cliente.email}
                        </a>
                      </div>
                    )}
                    {cliente.telefono && (
                      <div className="flex items-center gap-2.5 text-[13px] text-[#4A4A4A]">
                        <IconPhone />
                        <span>+57 {cliente.telefono}</span>
                      </div>
                    )}
                    {cliente.ciudad && (
                      <div className="flex items-center gap-2.5 text-[13px] text-[#4A4A4A]">
                        <IconLocation />
                        <span>{cliente.ciudad.nombre}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen estadístico */}
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Resumen</h2>
                  <div className="flex flex-col gap-0 divide-y divide-[#F0F0F0]">
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-[13px] text-[#6B6B6B]">Total Oportunidades</span>
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{totalOportunidades}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-[13px] text-[#6B6B6B]">Valor Total</span>
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{formatCOP(valorTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-[13px] text-[#6B6B6B]">Pipeline Activo</span>
                      <span className="text-[13px] font-bold text-[#24388C]">{formatCOP(valorActivo)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Columna derecha ── */}
              <div className="lg:col-span-2">
                {/* Tabs */}
                <div className="flex items-center gap-1 mb-4">
                  <button
                    onClick={() => setTab('oportunidades')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      tab === 'oportunidades'
                        ? 'bg-white border border-[#F0F0F0] text-[#1A1A1A] shadow-sm'
                        : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white/60'
                    }`}
                  >
                    <IconBriefcase />
                    Oportunidades
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab === 'oportunidades' ? 'bg-[#EEF1FA] text-[#24388C]' : 'bg-[#F0F0F0] text-[#6B6B6B]'
                    }`}>
                      {totalOportunidades}
                    </span>
                  </button>
                  <button
                    onClick={() => setTab('actividades')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      tab === 'actividades'
                        ? 'bg-white border border-[#F0F0F0] text-[#1A1A1A] shadow-sm'
                        : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white/60'
                    }`}
                  >
                    <IconClipboard />
                    Actividades
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab === 'actividades' ? 'bg-[#EEF1FA] text-[#24388C]' : 'bg-[#F0F0F0] text-[#6B6B6B]'
                    }`}>
                      0
                    </span>
                  </button>
                </div>

                {/* Tab: Oportunidades */}
                {tab === 'oportunidades' && (
                  <div className="flex flex-col gap-3">
                    {(!cliente.oportunidades || cliente.oportunidades.length === 0) ? (
                      <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm text-center py-12 px-4">
                        <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-3">
                          <IconBriefcase />
                        </div>
                        <div className="text-[14px] font-semibold text-[#4A4A4A] mb-1">Sin oportunidades</div>
                        <div className="text-[12.5px] text-[#6B6B6B] mb-4">
                          Registra la primera oportunidad para este cliente
                        </div>
                        <button
                          onClick={() => navigate('/oportunidades/nueva', { state: { clienteId: cliente.id } })}
                          className="px-4 py-2 rounded-md text-[12.5px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all"
                        >
                          Nueva oportunidad
                        </button>
                      </div>
                    ) : (
                      <>
                        {cliente.oportunidades.map(op => (
                          <OportunidadCard
                            key={op.id}
                            op={op}
                            onClick={() => navigate(`/oportunidades/${op.id}`)}
                          />
                        ))}
                        <button
                          onClick={() => navigate('/oportunidades/nueva', { state: { clienteId: cliente.id } })}
                          className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#24388C] border-2 border-dashed border-[#D5D5D5] hover:border-[#24388C] hover:bg-[#EEF1FA] transition-all"
                        >
                          Nueva oportunidad
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Tab: Actividades — placeholder hasta que backend implemente filtro por cliente */}
                {tab === 'actividades' && (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm text-center py-12 px-4">
                    <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-3">
                      <IconClipboard />
                    </div>
                    <div className="text-[14px] font-semibold text-[#4A4A4A] mb-1">Sin actividades</div>
                    <div className="text-[12.5px] text-[#6B6B6B]">
                      Las actividades se registran desde el detalle de cada oportunidad
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
