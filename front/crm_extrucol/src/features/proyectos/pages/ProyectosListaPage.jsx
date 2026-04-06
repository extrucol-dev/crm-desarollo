import { useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Topbar from '../../../shared/components/Topbar'
import { LoadingSpinner, Badge, EmptyState } from '../../../shared/components/FormField'
import { useProyectos } from '../hooks/useProyectos'

const ESTADO_VARIANT = { ACTIVO: 'green', PAUSADO: 'orange', COMPLETADO: 'blue', CANCELADO: 'red' }

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const COLORS = ['#24388C', '#7C3AED', '#1A8754', '#C2410C', '#0369A1']
const avatarColor = (n = '') => COLORS[n.charCodeAt(0) % COLORS.length]
const initials    = (n = '') => n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

function ProyectoCard({ proyecto }) {
  const navigate = useNavigate()
  const p = proyecto
  return (
    <div
      onClick={() => navigate(`/proyectos/${p.id}`)}
      className="bg-white border border-[#F0F0F0] rounded-xl p-4 cursor-pointer
        hover:border-[#24388C] hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-[14px] font-bold text-[#1A1A1A] group-hover:text-[#24388C] transition-colors leading-snug">
          {p.nombre}
        </div>
        <Badge variant={ESTADO_VARIANT[p.estado] ?? 'gray'}>{p.estado}</Badge>
      </div>
      {p.descripcion && (
        <p className="text-[12.5px] text-[#6B6B6B] line-clamp-2 mb-3">{p.descripcion}</p>
      )}
      <div className="flex items-center gap-3 pt-3 border-t border-[#F0F0F0] text-[12px] text-[#ABABAB] flex-wrap">
        {p.oportunidad?.cliente?.empresa && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18" />
            </svg>
            {p.oportunidad.cliente.empresa}
          </span>
        )}
        {p.fecha_creacion && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
            </svg>
            Inicio {formatDate(p.fecha_creacion)}
          </span>
        )}
        {p.usuario?.nombre && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: avatarColor(p.usuario.nombre) }}>
              {initials(p.usuario.nombre)}
            </div>
            <span>{p.usuario.nombre}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProyectosListaPage() {
  const { proyectos, loading, error } = useProyectos()

  return (
    <AppLayout>
      <Topbar title="Mis Proyectos" />
      <div className="p-4 sm:p-6">
        {error && (
          <div className="text-sm text-[#C0392B] bg-[#FDECEA] border border-[#f5c6c6] rounded-md px-4 py-3 mb-4">{error}</div>
        )}
        {loading && <LoadingSpinner label="Cargando proyectos..." />}
        {!loading && proyectos.length === 0 && (
          <EmptyState
            title="Sin proyectos activos"
            description="Los proyectos se crean desde una oportunidad en estado PROSPECTO, CALIFICACION, PROPUESTA o NEGOCIACION"
          />
        )}
        {!loading && proyectos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {proyectos.map(p => <ProyectoCard key={p.id} proyecto={p} />)}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
