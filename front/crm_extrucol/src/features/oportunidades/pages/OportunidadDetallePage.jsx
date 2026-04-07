import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import CierreModal from '../components/CierreModal'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { useOportunidadDetalle } from '../hooks/useOportunidadDetalle'
import { oportunidadesAPI } from '../services/oportunidadesAPI'
import { actividadesAPI } from '../../actividades/services/actividadesAPI'

// ── Helpers ───────────────────────────────────────────────────
const formatCOP = (n) => {
  if (!n) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}
const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}
const formatDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const ESTADO_VARIANT = { PROSPECTO: 'blue', CALIFICACION: 'orange', PROPUESTA: 'purple', NEGOCIACION: 'purple', GANADA: 'green', PERDIDA: 'red' }
const ESTADO_LABEL   = { PROSPECTO: 'Prospecto', CALIFICACION: 'Calificación', PROPUESTA: 'Propuesta', NEGOCIACION: 'Negociación', GANADA: 'Ganada', PERDIDA: 'Perdida' }
const TIPO_LABEL     = { COTIZACION: 'Cotización', VENTA: 'Venta de producto', ACOMPANAMIENTO: 'Acompañamiento técnico', PROYECTO: 'Proyecto' }
const ESTADO_SIGUIENTE_LABEL = { PROSPECTO: 'Calificación', CALIFICACION: 'Propuesta', PROPUESTA: 'Negociación', NEGOCIACION: 'Ganada' }
const PIPELINE = ['PROSPECTO', 'CALIFICACION', 'PROPUESTA', 'NEGOCIACION', 'GANADA']
const PIPELINE_LABEL = { PROSPECTO: 'Prospecto', CALIFICACION: 'Calificación', PROPUESTA: 'Propuesta', NEGOCIACION: 'Negociación', GANADA: 'Ganada' }

// ── Pipeline bar ──────────────────────────────────────────────
function PipelineBar({ estado }) {
  const idx     = PIPELINE.indexOf(estado)
  const perdida = estado === 'PERDIDA'
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm px-6 py-5 mb-5">
      <div className="flex items-center">
        {PIPELINE.map((e, i) => {
          const done    = !perdida && idx > i
          const current = !perdida && idx === i
          return (
            <div key={e} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all ${
                  done    ? 'bg-[#24388C] border-[#24388C] text-white' :
                  current ? 'bg-[#24388C] border-[#24388C] text-white ring-4 ring-[#24388C]/20' :
                            'bg-white border-[#D5D5D5] text-[#ABABAB]'
                }`}>
                  {done
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    : i + 1}
                </div>
                <span className={`text-[11px] font-semibold whitespace-nowrap hidden sm:block ${current || done ? 'text-[#24388C]' : 'text-[#ABABAB]'}`}>
                  {PIPELINE_LABEL[e]}
                </span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${done ? 'bg-[#24388C]' : 'bg-[#E5E5E5]'}`} />
              )}
            </div>
          )
        })}
      </div>
      {perdida && <div className="mt-3 flex justify-center"><Badge variant="red">Oportunidad perdida</Badge></div>}
    </div>
  )
}

// ── Modal GPS — actividad presencial ─────────────────────────
function GpsCierreModal({ onConfirm, onCancel, loading, apiError }) {
  const [resultado, setResultado] = useState('')
  const [gpsError, setGpsError]   = useState('')
  const [locating, setLocating]   = useState(false)

  const handleConfirm = () => {
    if (!resultado.trim() || resultado.length < 5) {
      setGpsError('El resultado debe tener al menos 5 caracteres.'); return
    }
    setLocating(true); setGpsError('')
    if (!navigator.geolocation) {
      setGpsError('Tu dispositivo no soporta geolocalización.')
      setLocating(false); return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        onConfirm({ resultado, latitud: pos.coords.latitude, longitud: pos.coords.longitude })
      },
      () => {
        setLocating(false)
        setGpsError('No se pudo obtener la ubicación. Activa el GPS e intenta de nuevo.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const errorMostrado = apiError || gpsError

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[16px] font-bold text-[#1A1A1A]">Registrar resultado</h2>
          <p className="text-[13px] text-[#6B6B6B] mt-0.5">Se capturará tu ubicación GPS automáticamente al confirmar.</p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 bg-[#EEF1FA] rounded-lg px-3 py-2 mb-4 text-[12.5px] text-[#24388C]">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Asegúrate de tener el GPS activo antes de confirmar
          </div>
          <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
            Resultado <span className="text-[#C0392B]">*</span>
          </label>
          <textarea rows={3}
            placeholder="Describe el resultado de la visita o reunión... (mínimo 5 caracteres)"
            value={resultado}
            onChange={e => { setResultado(e.target.value); setGpsError('') }}
            className="w-full px-3 py-2.5 text-[13.5px] text-[#1A1A1A] bg-white border border-[#D5D5D5] rounded-md outline-none placeholder:text-[#ABABAB] resize-none focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
          />
          {errorMostrado && (
            <div className="text-[12.5px] text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-3 py-2 mt-2">
              {errorMostrado}
            </div>
          )}
          <div className="flex gap-2.5 mt-5">
            <button onClick={onCancel} disabled={loading || locating}
              className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={handleConfirm} disabled={loading || locating}
              className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {(loading || locating)
                ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                   {locating ? 'Obteniendo GPS...' : 'Guardando...'}</>
                : 'Confirmar resultado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal Virtual — solo resultado ────────────────────────────
function VirtualCierreModal({ onConfirm, onCancel, loading, apiError }) {
  const [resultado, setResultado] = useState('')
  const [error, setError]         = useState('')
  const errorMostrado = apiError || error

  const handleConfirm = () => {
    if (!resultado.trim() || resultado.length < 5) {
      setError('El resultado debe tener al menos 5 caracteres.'); return
    }
    onConfirm({ resultado })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[16px] font-bold text-[#1A1A1A]">Registrar resultado</h2>
          <p className="text-[13px] text-[#6B6B6B] mt-0.5">Actividad virtual — no se requiere ubicación GPS.</p>
        </div>
        <div className="px-6 py-5">
          <label className="block text-[13px] font-semibold text-[#4A4A4A] mb-1.5">
            Resultado <span className="text-[#C0392B]">*</span>
          </label>
          <textarea rows={4}
            placeholder="Describe el resultado de la llamada, reunión virtual o cotización... (mínimo 5 caracteres)"
            value={resultado}
            onChange={e => { setResultado(e.target.value); setError('') }}
            className="w-full px-3 py-2.5 text-[13.5px] text-[#1A1A1A] bg-white border border-[#D5D5D5] rounded-md outline-none placeholder:text-[#ABABAB] resize-none focus:border-[#24388C] focus:ring-2 focus:ring-[#24388C]/15"
          />
          {errorMostrado && (
            <div className="text-[12.5px] text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-3 py-2 mt-2">
              {errorMostrado}
            </div>
          )}
          <div className="flex gap-2.5 mt-5">
            <button onClick={onCancel} disabled={loading}
              className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all disabled:opacity-50">
              Cancelar
            </button>
            <button onClick={handleConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading
                ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                : 'Confirmar resultado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Actividad item ────────────────────────────────────────────
function ActividadItem({ actividad, onCerrar }) {
  const navigate   = useNavigate()
  const completada = !!actividad.resultado

  return (
    <div className="flex items-start gap-3 py-4 border-b border-[#F0F0F0] last:border-b-0">
      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${completada ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{actividad.tipo}</div>
            <div className="text-[12.5px] text-[#6B6B6B] mt-0.5 line-clamp-2">{actividad.descripcion}</div>
            {actividad.resultado && (
              <div className="text-[12px] text-[#4A4A4A] italic mt-1 bg-[#F7F7F7] rounded px-2 py-1">
                {actividad.resultado}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${completada ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'}`}>
              {completada ? 'Completada' : 'Pendiente'}
            </span>

            {/* Editar */}
            <button onClick={() => navigate(`/actividades/${actividad.id}/editar`)}
              className="p-1.5 rounded hover:bg-[#F0F0F0] text-[#ABABAB] hover:text-[#24388C] transition-colors"
              title="Editar actividad">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>

            {/* Cerrar — solo si está pendiente */}
            {!completada && (
              <button
                onClick={() => onCerrar(actividad.id, actividad.virtual)}
                className="p-1.5 rounded hover:bg-[#F0F0F0] text-[#ABABAB] hover:text-[#22C55E] transition-colors"
                title={actividad.virtual ? 'Registrar resultado' : 'Registrar resultado con GPS'}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 text-[11.5px] text-[#ABABAB] flex-wrap">
          {actividad.usuario?.nombre && <span>{actividad.usuario.nombre}</span>}
          {actividad.fecha_actividad  && <span>{formatDateTime(actividad.fecha_actividad)}</span>}
          <span className={`px-1.5 py-0.5 rounded text-[10.5px] font-semibold ${
            actividad.virtual ? 'bg-[#F0F0F0] text-[#6B6B6B]' : 'bg-[#EEF1FA] text-[#24388C]'
          }`}>
            {actividad.virtual ? 'Virtual' : 'Presencial'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────
export default function OportunidadDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [showCierreModal, setShowCierreModal]   = useState(false)
  // actividadCierre: { id, virtual: boolean } | null
  const [actividadCierre, setActividadCierre]   = useState(null)
  const [actividades, setActividades]           = useState([])
  const [loadingActs, setLoadingActs]           = useState(false)
  const [cierreActLoading, setCierreActLoading] = useState(false)
  const [cierreActError, setCierreActError]     = useState('')

  const {
    oportunidad, loading, error,
    esCerrada, siguienteEstado,
    avanzando, cerrando, actionError,
    avanzar, cerrar,
  } = useOportunidadDetalle(id)

  const cargarActividades = useCallback(() => {
    if (!id) return
    setLoadingActs(true)
    oportunidadesAPI.actividades(id)
      .then(data => setActividades(data.actividades ?? []))
      .catch(() => setActividades([]))
      .finally(() => setLoadingActs(false))
  }, [id])

  useEffect(() => { cargarActividades() }, [cargarActividades])

  const handleCerrarOportunidad = async (data) => {
    const ok = await cerrar(data)
    if (ok) setShowCierreModal(false)
  }

  // Abre el modal correcto según virtual o presencial
  const handleAbrirCierre = (actId, esVirtual) => {
    setCierreActError('')
    setActividadCierre({ id: actId, virtual: esVirtual })
  }

  // Cierre presencial — requiere GPS real del navegador
  const handleCierrePresencial = async ({ resultado, latitud, longitud }) => {
    setCierreActLoading(true); setCierreActError('')
    try {
      await actividadesAPI.cerrarPresencial(actividadCierre.id, { resultado, latitud, longitud })
      setActividadCierre(null)
      cargarActividades()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setCierreActError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.')
    } finally {
      setCierreActLoading(false)
    }
  }

  // Cierre virtual — sin GPS (coordenadas 0,0 como workaround del DTO)
  const handleCierreVirtual = async ({ resultado }) => {
    setCierreActLoading(true); setCierreActError('')
    try {
      await actividadesAPI.cerrarVirtual(actividadCierre.id, { resultado })
      setActividadCierre(null)
      cargarActividades()
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setCierreActError(typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.')
    } finally {
      setCierreActLoading(false)
    }
  }

  const op = oportunidad

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/oportunidades')}>Oportunidades</span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[160px] sm:max-w-[240px]">{op?.nombre ?? '...'}</span>
        </>
      }>
        {op && !esCerrada && (
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => navigate(`/oportunidades/${id}/editar`)}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-[#4A4A4A] border border-[#D5D5D5] hover:bg-[#F7F7F7] transition-all whitespace-nowrap">
              Editar
            </button>
            {siguienteEstado && (
              <button onClick={avanzar} disabled={avanzando}
                className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-[#24388C] border border-[#24388C] hover:bg-[#EEF1FA] transition-all disabled:opacity-50 whitespace-nowrap">
                {avanzando ? '...' : `Avanzar a ${ESTADO_SIGUIENTE_LABEL[op.estado]}`}
              </button>
            )}
            <button onClick={() => setShowCierreModal(true)}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-white bg-[#1A1A1A] hover:bg-[#333] transition-all whitespace-nowrap">
              Cerrar
            </button>
            <button onClick={() => navigate('/proyectos/nuevo', { state: { oportunidadId: id } })}
              className="px-3 py-[7px] rounded-md text-[12.5px] font-semibold text-[#1A8754] border border-[#1A8754] hover:bg-[#E8F5EE] transition-all whitespace-nowrap">
              Convertir a proyecto
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
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#1A1A1A] tracking-tight leading-snug">{op.nombre}</h1>
                <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>{ESTADO_LABEL[op.estado] ?? op.estado}</Badge>
              </div>
              {op.cliente && (
                <div className="text-[13px] text-[#6B6B6B] mt-1">
                  {op.cliente.empresa} — {TIPO_LABEL[op.tipo] ?? op.tipo}
                </div>
              )}
            </div>

            <PipelineBar estado={op.estado} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* ── Izquierda ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">

                {/* Detalles */}
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
                    </svg>
                    <span className="text-[14px] font-bold text-[#1A1A1A]">Detalles de la oportunidad</span>
                  </div>
                  <div className="px-5 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Valor estimado</div>
                        <div className="text-[22px] font-extrabold text-[#24388C] tracking-tight">{formatCOP(op.valor_estimado)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Tipo</div>
                        <div className="text-[13.5px] text-[#1A1A1A] font-medium">{TIPO_LABEL[op.tipo] ?? op.tipo}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Fecha de cierre</div>
                        <div className="text-[13.5px] text-[#1A1A1A] font-medium">{formatDate(op.fecha_cierre)}</div>
                      </div>
                      {op.motivo_cierre && (
                        <div>
                          <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Motivo de cierre</div>
                          <div className="text-[13.5px] text-[#1A1A1A] font-medium">{op.motivo_cierre}</div>
                        </div>
                      )}
                      {op.descripcion && (
                        <div className="sm:col-span-2">
                          <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Descripción</div>
                          <div className="text-[13.5px] text-[#1A1A1A] font-medium">{op.descripcion}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actividades */}
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                      </svg>
                      <span className="text-[14px] font-bold text-[#1A1A1A]">Actividades</span>
                      {actividades.length > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EEF1FA] text-[#24388C]">
                          {actividades.length}
                        </span>
                      )}
                    </div>
                    {!esCerrada && (
                      <button
                        onClick={() => navigate('/actividades/nueva', { state: { oportunidadId: id } })}
                        className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white bg-[#24388C] hover:bg-[#1B2C6B] transition-all">
                        Registrar
                      </button>
                    )}
                  </div>
                  <div className="px-5">
                    {loadingActs && <div className="py-8 flex justify-center"><LoadingSpinner label="Cargando actividades..." /></div>}
                    {!loadingActs && actividades.length === 0 && (
                      <div className="text-center py-10">
                        <div className="w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center mx-auto mb-3">
                          <svg className="w-4 h-4 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-[13px] font-semibold text-[#4A4A4A] mb-1">Sin actividades registradas</p>
                        <p className="text-[12px] text-[#ABABAB]">Usa "Registrar" para agregar la primera actividad</p>
                      </div>
                    )}
                    {!loadingActs && actividades.map(a => (
                      <ActividadItem key={a.id} actividad={a} onCerrar={handleAbrirCierre} />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Derecha ── */}
              <div className="flex flex-col gap-4">
                {op.cliente && (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-[#24388C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18" />
                      </svg>
                      <span className="text-[14px] font-bold text-[#1A1A1A]">Cliente</span>
                    </div>
                    <div className="px-5 py-4">
                      <button onClick={() => navigate(`/clientes/${op.cliente.id}`)}
                        className="text-[14px] font-bold text-[#24388C] hover:underline mb-3 block">
                        {op.cliente.empresa || op.cliente.nombre}
                      </button>
                      <div className="flex flex-col gap-2 text-[12.5px] text-[#4A4A4A]">
                        {op.cliente.nombre && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                            <span>{op.cliente.nombre}</span>
                          </div>
                        )}
                        {op.cliente.email && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            <span className="truncate">{op.cliente.email}</span>
                          </div>
                        )}
                        {op.cliente.telefono && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                            <span>+57 {op.cliente.telefono}</span>
                          </div>
                        )}
                        {op.cliente.ciudad?.nombre && (
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-[#ABABAB] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            <span>{op.cliente.ciudad.nombre}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {op.usuario && (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F0F0F0]">
                      <span className="text-[14px] font-bold text-[#1A1A1A]">Ejecutivo Asignado</span>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                        style={{ background: avatarColor(op.usuario.nombre) }}>
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
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal cierre oportunidad */}
      {showCierreModal && (
        <CierreModal loading={cerrando} onConfirm={handleCerrarOportunidad} onCancel={() => setShowCierreModal(false)} />
      )}

      {/* Modal cierre actividad presencial — GPS obligatorio */}
      {actividadCierre && !actividadCierre.virtual && (
        <GpsCierreModal
          loading={cierreActLoading}
          apiError={cierreActError}
          onConfirm={handleCierrePresencial}
          onCancel={() => { setActividadCierre(null); setCierreActError('') }}
        />
      )}

      {/* Modal cierre actividad virtual — solo resultado */}
      {actividadCierre && actividadCierre.virtual && (
        <VirtualCierreModal
          loading={cierreActLoading}
          apiError={cierreActError}
          onConfirm={handleCierreVirtual}
          onCancel={() => { setActividadCierre(null); setCierreActError('') }}
        />
      )}
    </AppLayout>
  )
}