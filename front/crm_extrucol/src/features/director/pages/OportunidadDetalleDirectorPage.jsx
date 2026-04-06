import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import OportunidadDetallePage from '../../oportunidades/pages/OportunidadDetallePage'

// El director ve el mismo detalle pero sin botones de acción.
// Reutilizamos OportunidadDetallePage pasando readOnly via context
// Simple: redirigimos al mismo detalle pero el director no puede editar
// porque las rutas /director/* están protegidas por rol y 
// OportunidadDetallePage solo muestra botones si el JWT tiene rol EJECUTIVO.
// Por seguridad, creamos una vista explícita de solo lectura.

import { useState, useEffect, useCallback } from 'react'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { oportunidadesAPI } from '../../oportunidades/services/oportunidadesAPI'

const ESTADO_VARIANT = { PROSPECTO: 'blue', CALIFICACION: 'orange', PROPUESTA: 'purple', NEGOCIACION: 'purple', GANADA: 'green', PERDIDA: 'red' }
const TIPO_LABEL     = { COTIZACION: 'Cotización', VENTA: 'Venta de producto', ACOMPANAMIENTO: 'Acompañamiento técnico', PROYECTO: 'Proyecto' }

const formatCOP  = (n) => n ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) : '—'
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'
const formatDateTime = (iso) => iso ? new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[13.5px] text-[#1A1A1A] font-medium">{value || '—'}</div>
    </div>
  )
}

export default function OportunidadDetalleDirectorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [op, setOp]           = useState(null)
  const [actividades, setActs] = useState([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')

  useEffect(() => {
    Promise.all([
      oportunidadesAPI.buscar(id),
      oportunidadesAPI.actividades(id).then(d => d.actividades ?? []).catch(() => []),
    ]).then(([oportunidad, acts]) => {
      setOp(oportunidad); setActs(acts)
    }).catch(() => setError('No se pudo cargar la oportunidad.'))
     .finally(() => setLoading(false))
  }, [id])

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/director/pipeline')}>Pipeline</span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[200px]">{op?.nombre ?? '...'}</span>
        </>
      }>
        {/* CE-36: sin botones de edición para el director */}
        <span className="text-[12px] text-[#ABABAB] bg-[#F0F0F0] px-3 py-1.5 rounded-full">Solo lectura</span>
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando oportunidad..." />}
        {error && <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3">{error}</div>}

        {!loading && op && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Datos */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <h1 className="text-[17px] font-extrabold text-[#1A1A1A]">{op.nombre}</h1>
                  <Badge variant={ESTADO_VARIANT[op.estado] ?? 'gray'}>{op.estado}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">Valor estimado</div>
                    <div className="text-[22px] font-extrabold text-[#24388C]">{formatCOP(op.valor_estimado)}</div>
                  </div>
                  <Field label="Tipo"          value={TIPO_LABEL[op.tipo] ?? op.tipo} />
                  <Field label="Fecha de cierre" value={formatDate(op.fecha_cierre)} />
                  {op.motivo_cierre && <Field label="Motivo de cierre" value={op.motivo_cierre} />}
                  {op.descripcion && <div className="sm:col-span-2"><Field label="Descripción" value={op.descripcion} /></div>}
                </div>
              </div>

              {/* Actividades */}
              <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center gap-2.5">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">Actividades</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EEF1FA] text-[#24388C]">{actividades.length}</span>
                </div>
                <div className="px-5 divide-y divide-[#F0F0F0]">
                  {actividades.length === 0 && (
                    <p className="text-[13px] text-[#ABABAB] text-center py-8">Sin actividades registradas</p>
                  )}
                  {actividades.map(a => (
                    <div key={a.id} className="py-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[13.5px] font-semibold text-[#1A1A1A]">{a.tipo}</div>
                          <div className="text-[12.5px] text-[#6B6B6B] mt-0.5">{a.descripcion}</div>
                          {a.resultado && <div className="text-[12px] text-[#4A4A4A] italic mt-1 bg-[#F7F7F7] rounded px-2 py-1">{a.resultado}</div>}
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${a.resultado ? 'bg-[#E8F5EE] text-[#1A8754]' : 'bg-[#EEF1FA] text-[#24388C]'}`}>
                          {a.resultado ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-[#ABABAB] flex-wrap">
                        {a.usuario?.nombre && <span>{a.usuario.nombre}</span>}
                        {a.fecha_actividad && <span>{formatDateTime(a.fecha_actividad)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {op.cliente && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-3">Cliente</h2>
                  <div className="text-[14px] font-bold text-[#24388C] mb-1">{op.cliente.empresa || op.cliente.nombre}</div>
                  <div className="text-[12.5px] text-[#6B6B6B]">{op.cliente.nombre}</div>
                  {op.cliente.email && <div className="text-[12.5px] text-[#6B6B6B] mt-1">{op.cliente.email}</div>}
                </div>
              )}
              {op.usuario && (
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-3">Ejecutivo</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor(op.usuario.nombre) }}>
                      {initials(op.usuario.nombre)}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-[#1A1A1A]">{op.usuario.nombre}</div>
                      <div className="text-[12px] text-[#6B6B6B]">{op.usuario.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
