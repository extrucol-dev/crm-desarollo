import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge } from '../../../shared/components/FormField'
import { proyectosAPI } from '../services/proyectosAPI'

const ESTADO_VARIANT = { ACTIVO: 'green', PAUSADO: 'orange', COMPLETADO: 'blue', CANCELADO: 'red' }
const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}
const formatCOP = (n) => {
  if (!n) return '—'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[#ABABAB] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[13.5px] text-[#1A1A1A] font-medium">{value || '—'}</div>
    </div>
  )
}

export default function ProyectoDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proyecto, setProyecto] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    proyectosAPI.buscar(id)
      .then(setProyecto)
      .catch(() => setError('No se pudo cargar el proyecto.'))
      .finally(() => setLoading(false))
  }, [id])

  const p = proyecto

  return (
    <AppLayout>
      <Topbar breadcrumb={
        <>
          <span className="text-[#24388C] cursor-pointer hover:underline"
            onClick={() => navigate('/proyectos')}>Proyectos</span>
          <span className="text-[#D5D5D5]">›</span>
          <span className="truncate max-w-[200px]">{p?.nombre ?? '...'}</span>
        </>
      }>
        {p && (
          <button onClick={() => navigate(`/proyectos/${id}/editar`)}
            className="px-4 py-[7px] rounded-md text-[13px] font-semibold text-[#24388C] border border-[#24388C] hover:bg-[#EEF1FA] transition-all">
            Editar
          </button>
        )}
      </Topbar>

      <div className="p-4 sm:p-6">
        {loading && <LoadingSpinner label="Cargando proyecto..." />}
        {error && <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3">{error}</div>}

        {!loading && p && (
          <>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#1A1A1A] tracking-tight">{p.nombre}</h1>
              <Badge variant={ESTADO_VARIANT[p.estado] ?? 'gray'}>{p.estado}</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Izquierda: detalles */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                  <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Detalles del proyecto</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Estado"        value={p.estado} />
                    <Field label="Fecha de inicio" value={formatDate(p.fecha_creacion)} />
                    <div className="sm:col-span-2">
                      <Field label="Descripción" value={p.descripcion} />
                    </div>
                  </div>
                </div>

                {/* Oportunidad de origen */}
                {p.oportunidad && (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-4">Oportunidad de origen</h2>
                    <div
                      onClick={() => navigate(`/oportunidades/${p.oportunidad.id}`)}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-[#F0F0F0] cursor-pointer hover:border-[#24388C] hover:bg-[#F7F9FF] transition-all group"
                    >
                      <div>
                        <div className="text-[13.5px] font-bold text-[#1A1A1A] group-hover:text-[#24388C]">{p.oportunidad.nombre}</div>
                        <div className="text-[12px] text-[#6B6B6B] mt-0.5">{p.oportunidad.tipo} — {p.oportunidad.estado}</div>
                      </div>
                      <div className="text-[13px] font-bold text-[#24388C] whitespace-nowrap">
                        {formatCOP(p.oportunidad.valor_estimado)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Derecha: cliente + ejecutivo */}
              <div className="flex flex-col gap-4">
                {p.oportunidad?.cliente && (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-3">Cliente</h2>
                    <button
                      onClick={() => navigate(`/clientes/${p.oportunidad.cliente.id}`)}
                      className="text-[14px] font-bold text-[#24388C] hover:underline block mb-2">
                      {p.oportunidad.cliente.empresa || p.oportunidad.cliente.nombre}
                    </button>
                    <div className="text-[12.5px] text-[#6B6B6B]">{p.oportunidad.cliente.nombre}</div>
                    {p.oportunidad.cliente.email && (
                      <div className="text-[12.5px] text-[#6B6B6B] mt-1">{p.oportunidad.cliente.email}</div>
                    )}
                  </div>
                )}

                {p.usuario && (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-sm p-5">
                    <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-3">Ejecutivo</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                        style={{ background: avatarColor(p.usuario.nombre) }}>
                        {initials(p.usuario.nombre)}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-bold text-[#1A1A1A]">{p.usuario.nombre}</div>
                        <div className="text-[12px] text-[#6B6B6B]">{p.usuario.email}</div>
                      </div>
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
